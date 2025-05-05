
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Event } from '@/services/api';
import { Separator } from '@/components/ui/separator';

interface EventDetailsProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id: string) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!event) return null;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{event.title}</DialogTitle>
          <div className="bg-college-light text-college-purple text-xs inline-block px-2 py-1 rounded-full mt-1">
            {event.type}
          </div>
        </DialogHeader>

        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="grid gap-4">
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium">About</h3>
            <DialogDescription>{event.description}</DialogDescription>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Calendar size={16} className="text-college-purple mr-2" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center">
              <Clock size={16} className="text-college-purple mr-2" />
              <span>{event.time}</span>
            </div>

            <div className="flex items-center">
              <MapPin size={16} className="text-college-purple mr-2" />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center">
              <User size={16} className="text-college-purple mr-2" />
              <span>{event.organizer}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onEdit && (
            <Button onClick={() => onEdit(event.id)}>
              Edit Event
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetails;
