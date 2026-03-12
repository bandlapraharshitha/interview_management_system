'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, ArrowLeft } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';

interface TimeSlotGroup {
  time: string;
  availableSlots: number;
  slotIds: string[];
}

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<TimeSlotGroup[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSlots = async () => {
      if (!date) return;
      setLoading(true);
      try {
        const dateStr = format(date, 'yyyy-MM-dd');
        const { data } = await api.get(`/availability?date=${dateStr}`);
        setSlots(data);
        setSelectedSlot(null); // Reset selection when date changes
      } catch (error) {
        console.error("Failed to fetch availability", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [date]);

  const handleBook = async () => {
    if (!date || !selectedSlot) return;
    setBooking(true);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      await api.post('/interviews/schedule', {
        date: dateStr,
        time: selectedSlot
      });
      router.push('/dashboard');
    } catch (error) {
      console.error("Failed to book slot", error);
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-20 bg-white border-b flex items-center px-6">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Logo />
      </header>
      
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Schedule Interview</h1>
          <p className="text-gray-500 mt-2">Select a date and time that works best for you.</p>
        </div>

        <div className="grid md:grid-cols-[1fr_400px] gap-8 items-start">
          {/* Calendar Side */}
          <Card className="p-4 shadow-sm">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md mx-auto"
              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </Card>

          {/* Slots Side */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 border-b pb-4">
                <Clock className="w-5 h-5 text-gray-400" />
                Available Slots for {date ? format(date, 'MMM d, yyyy') : 'Select Date'}
              </h3>
              
              <div className="space-y-4">
                {loading ? (
                  <div className="py-8 text-center text-gray-500">Loading slots...</div>
                ) : slots.length === 0 ? (
                  <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg">
                    No available times on this date.<br/>Please choose another day.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {slots.map((group) => (
                      <button
                        key={group.time}
                        onClick={() => setSelectedSlot(group.time)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          selectedSlot === group.time 
                            ? 'border-[#563574] bg-purple-50 ring-1 ring-[#563574]' 
                            : 'border-gray-200 hover:border-[#563574] hover:bg-purple-50/50'
                        }`}
                      >
                        <span className={`text-lg font-medium ${selectedSlot === group.time ? 'text-[#563574]' : 'text-gray-900'}`}>
                          {group.time}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {group.availableSlots} slot{group.availableSlots !== 1 ? 's' : ''} left
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedSlot && (
                <div className="mt-8 pt-6 border-t animate-in fade-in slide-in-from-bottom-4">
                  <p className="text-sm text-gray-600 mb-4 font-medium">
                    Booking interview for <span className="text-gray-900 font-bold">{format(date!, 'MMMM d')} at {selectedSlot}</span>
                  </p>
                  <Button 
                    className="w-full h-12 bg-[#563574] hover:bg-[#432959] text-white text-lg" 
                    onClick={handleBook}
                    disabled={booking}
                  >
                    {booking ? 'Confirming...' : 'Book Interview'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
