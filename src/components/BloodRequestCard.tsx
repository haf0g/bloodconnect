
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BloodRequest } from "@/contexts/BloodRequestContext";
import { formatDistanceToNow } from "date-fns";
import { Droplet, MapPin, Phone } from "lucide-react";

// Helper function to determine urgency colors
const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "critical":
      return "bg-red-500 text-white";
    case "high":
      return "bg-orange-500 text-white";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-500";
  }
};

interface BloodRequestCardProps {
  request: BloodRequest;
  onRespond?: () => void;
  compact?: boolean;
}

export const BloodRequestCard = ({ request, onRespond, compact = false }: BloodRequestCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(request.createdAt), { addSuffix: true });

  if (compact) {
    return (
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm flex items-center gap-1">
              <Droplet className="h-4 w-4 text-blood" />
              {request.bloodType}
            </CardTitle>
            <Badge className={getUrgencyColor(request.urgency)}>{request.urgency}</Badge>
          </div>
          <CardDescription className="text-xs flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {request.location.address.split(',')[0]}
          </CardDescription>
        </CardHeader>
        <CardFooter className="p-4 pt-2 flex justify-between items-center">
          <span className="text-xs text-gray-500">{timeAgo}</span>
          <Button size="sm" variant="outline" onClick={onRespond}>
            Respond
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blood" />
              {request.bloodType} • {request.quantity} units
            </CardTitle>
            <CardDescription>
              Requested by {request.requesterName}
            </CardDescription>
          </div>
          <Badge className={getUrgencyColor(request.urgency)}>{request.urgency}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <span>{request.location.address}</span>
          </div>
          {request.description && (
            <p className="text-sm text-muted-foreground mt-2">{request.description}</p>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3 w-3" />
            <span>{request.contactPhone}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-gray-500">{timeAgo}</span>
        {onRespond && (
          <Button onClick={onRespond}>
            Respond to Request
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
