
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Event, fileToBase64 } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

// Event form schema
const eventFormSchema = z.object({
  title: z.string().min(3, { message: 'Title is required' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  date: z.date({ required_error: 'Date is required' }),
  time: z.string().min(1, { message: 'Time is required' }),
  location: z.string().min(3, { message: 'Location is required' }),
  organizer: z.string().min(3, { message: 'Organizer is required' }),
  type: z.string().min(1, { message: 'Event type is required' }),
});

interface EventFormProps {
  onSubmit: (data: any) => void;
  initialData?: Event | null;
  isLoading?: boolean;
}

const eventTypes = [
  'Academic',
  'Cultural',
  'Sports',
  'Career',
  'Workshop',
  'Seminar',
  'Conference',
  'Competition',
  'Other',
];

const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  initialData = null,
  isLoading = false,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          date: new Date(initialData.date),
          time: initialData.time,
          location: initialData.location,
          organizer: initialData.organizer,
          type: initialData.type,
        }
      : {
          title: '',
          description: '',
          date: undefined,
          time: '',
          location: '',
          organizer: '',
          type: '',
        },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof eventFormSchema>) => {
    try {
      let imageUrl = initialData?.imageUrl || '';

      if (imageFile) {
        imageUrl = await fileToBase64(imageFile);
      }

      onSubmit({
        ...data,
        date: format(data.date, 'yyyy-MM-dd'),
        imageUrl,
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter event description"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="organizer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter organizer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Event Image</FormLabel>
              <div className="border-2 border-dashed rounded-md p-4 border-muted hover:border-muted-foreground/50 transition-colors">
                {imagePreview ? (
                  <div className="relative aspect-video overflow-hidden rounded-md">
                    <img
                      src={imagePreview}
                      alt="Event preview"
                      className="object-cover w-full h-full"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        SVG, PNG, JPG or GIF (max. 2MB)
                      </p>
                    </div>
                    <Input
                      id="eventImage"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="eventImage"
                      className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Select Image
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isLoading}>
            {initialData ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
