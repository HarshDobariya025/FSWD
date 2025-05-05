
import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Event } from '@/services/api';

interface EventCardProps {
  event: Event;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onView, 
  onEdit, 
  onDelete,
  showActions = false
}) => {
  const { id, title, date, location, imageUrl, type } = event;
  
  // Convert date string to readable format
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  });

  return (
    <Card className="overflow-hidden event-card h-full flex flex-col">
      <div className="relative h-48">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 m-2">
          <span className="bg-white/90 px-2 py-1 rounded text-xs font-medium text-college-purple">
            {type}
          </span>
        </div>
      </div>
      
      <CardContent className="pt-4 flex-grow">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{title}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar size={14} className="mr-1" />
          <span>{formattedDate}</span>
        </div>
        
        <div className="text-sm text-gray-500 line-clamp-1">
          {location}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onView(id)}
          className="text-college-purple border-college-purple hover:bg-college-purple hover:text-white"
        >
          View Details
        </Button>
        
        {showActions && (
          <div className="flex space-x-2">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(id)}
              >
                Edit
              </Button>
            )}
            
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-destructive hover:bg-destructive/10" 
                onClick={() => onDelete(id)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
