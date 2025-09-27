"use client";
import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

interface EventItem {
  id: string;
  title: string;
  time: string;
  location: string;
  description?: string;
  signupsAvailable?: boolean;
  recurring?: string;
  date: Date;
}

const ChurchEventsCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Sample events with specific dates
  const allEvents: EventItem[] = [
    {
      id: '1',
      title: 'Baptism Sunday',
      time: '8:30–10am CDT',
      location: 'NASHVILLE CAMPUS',
      signupsAvailable: true,
      date: new Date(2027, 6, 13) // July 13, 2027
    },
    {
      id: '2',
      title: 'Sunday Services',
      time: '8:30am–2pm CDT',
      location: 'NASHVILLE CAMPUS',
      recurring: 'Every Sunday',
      date: new Date(2027, 6, 13) // July 13, 2027
    },
    {
      id: '3',
      title: 'Next Steps - July',
      time: '1:30–2:30pm CDT',
      location: 'NASHVILLE CAMPUS',
      recurring: 'Custom dates',
      date: new Date(2027, 6, 20) // July 20, 2027
    },
    {
      id: '4',
      title: 'Jesus Baptisms Team Selection',
      time: '11:00am–12:00pm CDT',
      location: 'NASHVILLE CAMPUS',
      date: new Date(2027, 6, 15) // July 15, 2027
    },
    {
      id: '5',
      title: 'Youth Group Meeting',
      time: '7:00–9:00pm CDT',
      location: 'NASHVILLE CAMPUS',
      recurring: 'Every Wednesday',
      date: new Date(2027, 6, 16) // July 16, 2027
    },
    {
      id: '6',
      title: 'Prayer Meeting',
      time: '6:00–7:00am CDT',
      location: 'NASHVILLE CAMPUS',
      recurring: 'Every Friday',
      date: new Date(2027, 6, 18) // July 18, 2027
    },
    {
      id: '7',
      title: 'Community Outreach',
      time: '9:00am–12:00pm CDT',
      location: 'VARIOUS LOCATIONS',
      signupsAvailable: true,
      date: new Date(2027, 6, 26) // July 26, 2027
    },
    {
      id: '10',
      title: 'Bible Study',
      time: '7:00–8:30pm CDT',
      location: 'NASHVILLE CAMPUS',
      recurring: 'Every Tuesday',
      date: new Date(2027, 6, 22) // July 22, 2027
    },
    {
      id: '11',
      title: 'Next Steps - July',
      time: '1:30–2:30pm CDT',
      location: 'NASHVILLE CAMPUS',
      recurring: 'Custom dates',
      date: new Date(2027, 6, 20) // July 20, 2027
    },
    {
      id: '12',
      title: 'Next Steps - July',
      time: '1:30–2:30pm CDT',
      location: 'NASHVILLE CAMPUS',
      recurring: 'Custom dates',
      date: new Date(2027, 6, 20) // July 20, 2027
    },
    {
      id: '13',
      title: 'Next Steps - July',
      time: '1:30–2:30pm CDT',
      location: 'NASHVILLE CAMPUS',
      recurring: 'Custom dates',
      date: new Date(2027, 6, 20) // July 20, 2027
    },
    {
      id: '14',
      title: 'Next Steps - July',
      time: '1:30–2:30pm CDT',
      location: 'NASHVILLE CAMPUS',
      recurring: 'Custom dates',
      date: new Date(2027, 6, 20) // July 20, 2027
    },
  ];

  // Get events for selected date
  const getEventsForDate = (date: Date | undefined): EventItem[] => {
    if (!date) return [];
    return allEvents.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // Get all dates that have events for calendar highlighting
  const getEventDates = (): Date[] => {
    return allEvents.map(event => event.date);
  };

  const selectedEvents = getEventsForDate(selectedDate);
  const eventDates = getEventDates();

  const formatSelectedDate = (date: Date | undefined): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-8" style={{ backgroundColor: '#EAC6B7' }}>
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">UPCOMING EVENTS</h1>
      
      <Card className="bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Calendar Section */}
            <div className="w-80 pr-6 border-r border-gray-200">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0"
                modifiers={{
                  hasEvent: eventDates
                }}
                modifiersStyles={{
                  hasEvent: {
                    backgroundColor: '#14b8a6',
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}
                defaultMonth={new Date(2027, 6)} // July 2027
              />
            </div>
            
            {/* Events Section */}
            <div className="flex-1 pl-6">
              {selectedDate && (
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {formatSelectedDate(selectedDate)}
                  </h2>
                  <div className="text-sm text-gray-600">
                    {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''} scheduled
                  </div>
                </div>
              )}
              
              <div className="h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                <div className="space-y-6 pr-2">
                  {selectedEvents.length > 0 ? (
                    selectedEvents.map((event) => (
                      <div key={event.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-teal-600 mb-1">
                              {event.title}
                            </h3>
                            <div className="text-sm text-gray-600 mb-1">
                              {event.time}
                              {event.recurring && (
                                <span className="text-gray-500"> | {event.recurring}</span>
                              )}
                            </div>
                            <div className="text-sm font-medium text-gray-700 mb-2">
                              {event.location}
                            </div>
                            {event.signupsAvailable && (
                              <div className="text-sm text-gray-600">
                                Signups available
                              </div>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="p-1 text-gray-400">
                            <Info className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-lg mb-2">No events scheduled</div>
                      <div className="text-gray-500 text-sm">
                        {selectedDate ? 'Select a different date to view events' : 'Select a date to view events'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChurchEventsCalendar;
