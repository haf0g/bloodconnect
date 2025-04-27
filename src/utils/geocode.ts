// src/utils/geocode.ts
export const getLocationName = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
  
      const data = await response.json();
      
      // Extract city/town/village name
      return data.address?.city 
        || data.address?.town 
        || data.address?.village 
        || data.address?.county 
        || 'your area';
    } catch (error) {
      console.error('Geocoding error:', error);
      return 'your area';
    }
  };