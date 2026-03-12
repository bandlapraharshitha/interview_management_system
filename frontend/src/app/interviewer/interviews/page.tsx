'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, CheckCircle, XCircle } from 'lucide-react';

export default function ScheduledInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  const fetchInterviews = async () => {
    try {
      const { data } = await api.get('/interviews');
      setInterviews(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInterviews(); }, []);

  const handleDecision = async (id: string, decision: 'accepted' | 'rejected') => {
    setUpdating(true);
    try {
      await api.patch(`/interviews/${id}/decision`, { decision });
      setSelectedInterview(null);
      fetchInterviews();
    } catch (e) {
      console.error(e);
      alert('Failed to submit decision.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">My Interviews</h1>
        <p className="text-gray-500">Manage your scheduled verification interviews and submit decisions.</p>
      </div>

      <Card className="shadow-sm border-gray-200">
        <div className="relative w-full overflow-auto max-h-[700px]">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
              <tr className="border-b">
                <th className="h-12 px-4 font-medium text-gray-500">Applicant</th>
                <th className="h-12 px-4 font-medium text-gray-500">Location</th>
                <th className="h-12 px-4 font-medium text-gray-500">Date & Time</th>
                <th className="h-12 px-4 font-medium text-gray-500">Status</th>
                <th className="h-12 px-4 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {interviews.map((inv: any) => (
                <tr key={inv._id} className="border-b transition-colors hover:bg-gray-50/50">
                  <td className="p-4 align-middle">
                    <div className="font-medium text-gray-900">{inv.userId?.name}</div>
                  </td>
                  <td className="p-4 align-middle text-gray-600 flex items-center gap-1">
                     <MapPin className="w-4 h-4 text-gray-400" /> {inv.userId?.city || 'N/A'}
                  </td>
                  <td className="p-4 align-middle text-gray-600">
                    <div className="font-medium text-gray-800">{inv.slotId?.date ? format(new Date(inv.slotId.date), 'MMM d, yyyy') : 'N/A'}</div>
                    <div className="text-xs">{inv.slotId?.startTime} - {inv.slotId?.endTime}</div>
                  </td>
                  <td className="p-4 align-middle">
                    {inv.status === 'scheduled' ? (
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none">Scheduled</Badge>
                    ) : (
                       <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-none">Completed</Badge>
                    )}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Dialog open={selectedInterview?._id === inv._id} onOpenChange={(open) => !open && setSelectedInterview(null)}>
                      <DialogTrigger>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-[#563574] text-[#563574] hover:bg-purple-50"
                          onClick={() => setSelectedInterview(inv)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Applicant Profile</DialogTitle>
                          <DialogDescription>Review details before submitting a decision.</DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-4 space-y-4">
                          <div className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50/50">
                             <div className="w-12 h-12 bg-purple-100 rounded-full flex justify-center items-center">
                               <User className="w-6 h-6 text-[#563574]" />
                             </div>
                             <div>
                                <h3 className="font-semibold text-lg text-gray-900">{inv.userId?.name}</h3>
                                <p className="text-sm text-gray-500">{inv.userId?.email}</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Age</p>
                              <p className="font-medium text-gray-900">{inv.userId?.age || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Gender</p>
                              <p className="font-medium text-gray-900 capitalize">{inv.userId?.gender || 'N/A'}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">City</p>
                              <p className="font-medium text-gray-900">{inv.userId?.city || 'N/A'}</p>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                             <p className="text-sm text-blue-800 font-medium">Interview Time</p>
                             <p className="text-blue-900 text-sm">
                               {inv.slotId?.date ? format(new Date(inv.slotId.date), 'EEEE, MMMM d, yyyy') : ''} at {inv.slotId?.startTime}
                             </p>
                          </div>
                        </div>

                        {inv.status === 'scheduled' ? (
                          <div className="grid grid-cols-2 gap-3 mt-2">
                            <Button 
                              variant="outline" 
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-12"
                              onClick={() => handleDecision(inv._id, 'rejected')}
                              disabled={updating}
                            >
                              <XCircle className="w-5 h-5 mr-2" /> Reject Profile
                            </Button>
                            <Button 
                              className="bg-green-600 hover:bg-green-700 text-white h-12"
                              onClick={() => handleDecision(inv._id, 'accepted')}
                              disabled={updating}
                            >
                              <CheckCircle className="w-5 h-5 mr-2" /> Accept Profile
                            </Button>
                          </div>
                        ) : (
                          <div className="mt-4 p-4 border rounded-lg bg-gray-50 text-center">
                            <p className="text-sm text-gray-600">Decision Submitted</p>
                            <p className={`font-bold mt-1 text-lg capitalize ${inv.decision === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                              {inv.decision}
                            </p>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
              {interviews.length === 0 && !loading && (
                <tr><td colSpan={5} className="h-32 text-center text-gray-500">No scheduled interviews found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
