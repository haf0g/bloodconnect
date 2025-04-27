'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { getLocationName } from '@/utils/geocode';
import { supabase } from '@/utils/supabase/client';


interface BloodRecord {
  date: string;
  hospital_name: string;
  city: string;
  blood_type: string;
  units_available: number;
  units_used: number;
  expired_units: number;
  accidents_reported: number;
  local_event: string;
  donations_received: number;
  contact_person: string;
  contact_phone: string;
}

const calculateRisk = (record: BloodRecord) => {
  const { units_available, units_used, expired_units, accidents_reported, donations_received } = record;
  const numerator = units_used + accidents_reported * 5 + expired_units * 3;
  const denominator = units_available + donations_received + 1; // +1 to avoid division by zero
  return Math.min((numerator / denominator) * 100, 100); // cap at 100%
};

// Sample data to show when real data is empty
const sampleData = [
  { name: 'Jan', risk: 25 },
  { name: 'Feb', risk: 30 },
  { name: 'Mar', risk: 22 },
  { name: 'Apr', risk: 35 },
];

const sampleTypeData = [
  { name: 'O+', risk: 45 },
  { name: 'A+', risk: 32 },
  { name: 'B+', risk: 28 },
  { name: 'AB+', risk: 20 },
];

const PredictionPage = () => {
  const { user } = useAuth();
  const [locationName, setLocationName] = useState<string>('');
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [data, setData] = useState<BloodRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [shortageData, setShortageData] = useState<any[]>([]);
  const [healthRiskData, setHealthRiskData] = useState<any[]>([]);
  const [anemiaResult, setAnemiaResult] = useState<string | null>(null);
    const [insightText, setInsightText] = useState<string>('');


  // Fetch blood inventory data
  useEffect(() => {
    console.log('Fetching blood inventory data...');
  
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('blood_inventory').select('*');
        
        if (error) {
          console.error('Error fetching blood inventory:', error);
          setError(`Failed to fetch data: ${error.message}`);
          setLoading(false);
          return;
        }
        
        console.log("Fetched blood_inventory:", data);
        
        if (!data || data.length === 0) {
          console.warn('No data returned from blood_inventory');
          setError('No blood inventory data available');
          setData([]);
        } else {
          // Validate data structure
          const validData = data.filter(record => 
            record && 
            typeof record === 'object' && 
            'date' in record && 
            'blood_type' in record &&
            'units_available' in record &&
            'units_used' in record
          );
          
          console.log(`Valid records: ${validData.length} out of ${data.length}`);
          setData(validData as BloodRecord[]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError(`Failed to process data: ${err instanceof Error ? err.message : String(err)}`);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // Process data for charts
  useEffect(() => {
    if (data.length > 0) {
      try {
        // Process shortage data
        const shortageMap = new Map();
        data.forEach(record => {
          try {
            // Safely parse date
            const date = new Date(record.date);
            if (isNaN(date.getTime())) {
              console.warn(`Invalid date format: ${record.date}`);
              return;
            }
            
            const month = date.toLocaleString('default', { month: 'short' });
            const risk = calculateRisk(record);
            
            if (shortageMap.has(month)) {
              const existing = shortageMap.get(month);
              existing.risk += risk;
              existing.count += 1;
            } else {
              shortageMap.set(month, { risk, count: 1 });
            }
          } catch (err) {
            console.warn(`Error processing record for shortage data:`, record, err);
          }
        });
        
        const processedShortageData = Array.from(shortageMap.entries())
          .map(([month, { risk, count }]) => ({
            name: month,
            risk: risk / count
          }));
        
        console.log("Processed shortage data:", processedShortageData);
        setShortageData(processedShortageData.length > 0 ? processedShortageData : sampleData);
        
        // Process health risk by blood type
        const typeMap = new Map();
        data.forEach(record => {
          try {
            if (!record.blood_type) {
              console.warn(`Record missing blood type:`, record);
              return;
            }
            
            const risk = calculateRisk(record);
            
            if (typeMap.has(record.blood_type)) {
              const existing = typeMap.get(record.blood_type);
              existing.risk += risk;
              existing.count += 1;
            } else {
              typeMap.set(record.blood_type, { risk, count: 1 });
            }
          } catch (err) {
            console.warn(`Error processing record for health risk data:`, record, err);
          }
        });
        
        const processedHealthRiskData = Array.from(typeMap.entries())
          .map(([type, { risk, count }]) => ({
            name: type,
            risk: risk / count
          }));
        
        console.log("Processed health risk data:", processedHealthRiskData);
        setHealthRiskData(processedHealthRiskData.length > 0 ? processedHealthRiskData : sampleTypeData);
      } catch (err) {
        console.error("Error processing data for charts:", err);
        setShortageData(sampleData);
        setHealthRiskData(sampleTypeData);
      }
    } else {
      // Use sample data if no real data
      setShortageData(sampleData);
      setHealthRiskData(sampleTypeData);
    }
  }, [data]);


const fetchInsight = async () => {
  try {
    setLoading(true);
    const response = await fetch('http://localhost:5000/generate_insight');
    const data = await response.json();
    setInsightText(data.insight);
  } catch (error) {
    console.error('Error fetching insight:', error);
    setInsightText('Failed to load insights.');
  } finally {
    setLoading(false);
  }
};
  const predictAnemia = async (hemoglobin: number, mch: number, mchc: number, mcv: number) => {
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Hemoglobin: hemoglobin, MCH: mch, MCHC: mchc, MCV: mcv }),
      });
  
      const data = await response.json();
      console.log('Prediction result:', data.prediction);
      return data.prediction;
    } catch (error) {
      console.error('Prediction failed:', error);
      return null;
    }
  };

  // Location handling
  useEffect(() => {
    const fetchLocationName = async () => {
      if (user?.location) {
        setIsGeocoding(true);
        setGeocodingError(null);

        try {
          const name = await getLocationName(user.location.latitude, user.location.longitude);
          setLocationName(name);
        } catch (error) {
          console.error('Failed to geocode:', error);
          setGeocodingError('Failed to detect location name');
        } finally {
          setIsGeocoding(false);
        }
      }
    };

    fetchLocationName();
  }, [user?.location]);

  const renderLocationText = () => {
    if (!user?.location) {
      return "Enable location services for personalized predictions.";
    }

    if (isGeocoding) {
      return (
        <span className="flex items-center gap-2">
          <Loader2 className="h-3 w-3 animate-spin" />
          Detecting your location...
        </span>
      );
    }

    if (geocodingError) {
      return "Based on your location, we predict moderate shortage risk.";
    }

    return `Based on your location (${locationName}), we predict moderate shortage risk.`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Blood Supply Predictions</h1>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <p className="mt-4">Using sample data for visualization.</p>
          </CardContent>
        </Card>
        {/* Continue with charts using sample data */}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Blood Supply Predictions</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <h3 className="font-medium text-yellow-800">Data Status</h3>
        <p className="text-sm text-yellow-700">
          {data.length === 0 ? 
            "No data was returned from Supabase. Showing sample data instead." : 
            `Showing predictions based on ${data.length} blood inventory records.`
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shortage Prediction Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Shortage Risk Forecast</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={shortageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke="#ef4444"
                  name="Risk %"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="ml-auto">
              View Details
            </Button>
          </CardFooter>
        </Card>

        {/* Health Risk Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Blood Type Health Risks</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthRiskData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="risk"
                  fill="#8884d8"
                  name="Risk %"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="ml-auto">
              View Details
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Insights Card */}
      

      <Card>
  <CardHeader>
    <CardTitle>Prediction Insights</CardTitle>
  </CardHeader>
  <CardContent>
    {loading ? (
      <div>Loading insights...</div>
    ) : (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {insightText}
        </p>
        <Button onClick={fetchInsight} className="w-full">
          Refresh Insights
        </Button>
      </div>
    )}
  </CardContent>
</Card>

{/* Anemia Prediction Form */}
<Card>
  <CardHeader>
    <CardTitle>Predict Anemia</CardTitle>
  </CardHeader>
  <CardContent>
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const hemoglobin = parseFloat((form.elements.namedItem('hemoglobin') as HTMLInputElement).value);
        const mch = parseFloat((form.elements.namedItem('mch') as HTMLInputElement).value);
        const mchc = parseFloat((form.elements.namedItem('mchc') as HTMLInputElement).value);
        const mcv = parseFloat((form.elements.namedItem('mcv') as HTMLInputElement).value);

        const prediction = await predictAnemia(hemoglobin, mch, mchc, mcv);
        if (prediction !== null) {
          setAnemiaResult(prediction === 1 ? 'Positive for Anemia' : 'Negative for Anemia');
        }
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Hemoglobin (g/dL)</label>
          <input type="number" step="any" name="hemoglobin" className="input input-bordered w-full" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">MCH (pg)</label>
          <input type="number" step="any" name="mch" className="input input-bordered w-full" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">MCHC (g/dL)</label>
          <input type="number" step="any" name="mchc" className="input input-bordered w-full" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">MCV (fL)</label>
          <input type="number" step="any" name="mcv" className="input input-bordered w-full" required />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Predict
      </Button>
    </form>

    {anemiaResult && (
      <div className={`mt-6 p-4 rounded-md ${anemiaResult.includes('Positive') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
        <p className="text-center font-semibold">{anemiaResult}</p>
      </div>
    )}
  </CardContent>
</Card>
    </div>
  );
};

export default PredictionPage;