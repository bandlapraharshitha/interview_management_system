'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle } from 'lucide-react';

export default function AvailabilityPage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });

  const timeOptions: string[] = [];
  const now = new Date();
  const isToday = formData.date === format(now, 'yyyy-MM-dd');
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      if (isToday) {
        if (i < currentHour || (i === currentHour && j <= currentMinute)) {
          continue;
        }
      }
      const hour = i.toString().padStart(2, '0');
      const minute = j.toString().padStart(2, '0');
      timeOptions.push(`${hour}:${minute}`);
    }
  }

  const fetchSlots = async () => {
    try {
      const { data } = await api.get('/availability/me');
      setSlots(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSlots(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/availability', formData);
      fetchSlots();
      // Reset only forms we might change often
      setFormData({...formData, startTime: '', endTime: ''});
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to add availability');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/availability/${id}`);
      fetchSlots();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to delete slot');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">My Availability</h1>
        <p className="text-gray-500">Set the times you are available to conduct verification interviews.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        <Card className="col-span-1 shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Add Availability Block</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} min={format(new Date(), 'yyyy-MM-dd')} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <select 
                  id="startTime" 
                  value={formData.startTime} 
                  onChange={(e) => setFormData({...formData, startTime: e.target.value, endTime: ''})} 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#563574]"
                  required
                >
                  <option value="" disabled>Select start time</option>
                  {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <select 
                  id="endTime" 
                  value={formData.endTime} 
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})} 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#563574]"
                  required
                >
                  <option value="" disabled>Select end time</option>
                  {timeOptions.filter(t => !formData.startTime || t > formData.startTime).map(time => <option key={time} value={time}>{time}</option>)}
                </select>
              </div>
              <div className="pt-2">
                <Button type="submit" className="w-full bg-[#563574] hover:bg-[#432959] text-white">
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Slots
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">Time blocks are automatically split into 30-minute intervals.</p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="col-span-2 shadow-sm border-gray-200">
          <div className="relative w-full overflow-auto max-h-[600px]">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
                <tr className="border-b">
                  <th className="h-12 px-4 font-medium text-gray-500">Date</th>
                  <th className="h-12 px-4 font-medium text-gray-500">Time</th>
                  <th className="h-12 px-4 font-medium text-gray-500">Status</th>
                  <th className="h-12 px-4 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {slots.map((slot: any) => (
                  <tr key={slot._id} className="border-b transition-colors hover:bg-gray-50/50">
                    <td className="p-4 align-middle font-medium text-gray-700">{format(new Date(slot.date), 'EEE, MMM d, yyyy')}</td>
                    <td className="p-4 align-middle text-gray-600">{slot.startTime} - {slot.endTime}</td>
                    <td className="p-4 align-middle">
                      {slot.isBooked ? 
                        <span className="inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-600/20">Booked</span> : 
                        <span className="inline-flex rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20">Available</span>
                      }
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(slot._id)} disabled={slot.isBooked}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {slots.length === 0 && !loading && (
                  <tr><td colSpan={4} className="h-32 text-center text-gray-500">No availability slots configured yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
