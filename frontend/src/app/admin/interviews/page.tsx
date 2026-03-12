'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const { data } = await api.get('/interviews');
        setInterviews(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const filteredInterviews = interviews.filter((inv: any) => {
    if (filter === 'all') return true;
    if (filter === 'scheduled') return inv.status === 'scheduled';
    if (filter === 'completed') return inv.status === 'completed';
    if (filter === 'accepted') return inv.decision === 'accepted';
    if (filter === 'rejected') return inv.decision === 'rejected';
    if (filter === 'pending') return inv.decision === 'none';
    return true;
  });

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">All Interviews</h1>
          <p className="text-slate-500 mt-2">Monitor scheduled and completed interviews across the platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Interviews</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
          {filter !== 'all' && (
            <Button variant="ghost" onClick={() => setFilter('all')} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
              Clear Filter
            </Button>
          )}
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b bg-slate-50/50">
              <tr className="border-b transition-colors hover:bg-slate-100/50">
                <th className="h-12 px-4 font-medium text-slate-500 text-left">Applicant</th>
                <th className="h-12 px-4 font-medium text-slate-500 text-left">Interviewer</th>
                <th className="h-12 px-4 font-medium text-slate-500 text-left">Date</th>
                <th className="h-12 px-4 font-medium text-slate-500 text-left">Time</th>
                <th className="h-12 px-4 font-medium text-slate-500 text-left">Status</th>
                <th className="h-12 px-4 font-medium text-slate-500 text-left">Decision</th>
                <th className="h-12 px-4 font-medium text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr><td colSpan={7} className="h-24 text-center text-slate-500">Loading...</td></tr>
              ) : filteredInterviews.map((inv: any) => (
                <tr key={inv._id} className="border-b transition-colors hover:bg-slate-50/50">
                  <td className="p-4 align-middle">
                    <div className="font-medium text-slate-900">{inv.userId?.name}</div>
                    <div className="text-xs text-slate-500">{inv.userId?.email}</div>
                  </td>
                  <td className="p-4 align-middle font-medium text-slate-700">{inv.interviewerId?.name}</td>
                  <td className="p-4 align-middle text-slate-600">
                    {inv.slotId?.date ? format(new Date(inv.slotId.date), 'MMM d, yyyy') : 'N/A'}
                  </td>
                  <td className="p-4 align-middle text-slate-600">
                    {inv.slotId?.startTime} - {inv.slotId?.endTime}
                  </td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      inv.status === 'scheduled' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20' : 
                      'bg-slate-100 text-slate-700 ring-1 ring-slate-600/20'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      inv.decision === 'accepted' ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' : 
                      inv.decision === 'rejected' ? 'bg-red-50 text-red-700 ring-1 ring-red-600/20' :
                      'bg-slate-100 text-slate-700 ring-1 ring-slate-600/20'
                    }`}>
                      {inv.decision === 'none' ? 'Pending' : inv.decision}
                    </span>
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
                          <DialogDescription>Review details for this applicant.</DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-4 space-y-4 text-left">
                          <div className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50/50">
                             <div className="w-12 h-12 bg-purple-100 rounded-full flex justify-center items-center shrink-0">
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
                          
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4">
                             <p className="text-sm text-blue-800 font-medium">Interview Details</p>
                             <p className="text-blue-900 text-sm mt-1">
                               Date: {inv.slotId?.date ? format(new Date(inv.slotId.date), 'EEEE, MMMM d, yyyy') : ''}<br/>
                               Time: {inv.slotId?.startTime} - {inv.slotId?.endTime}<br/>
                               Interviewer: {inv.interviewerId?.name}
                             </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
              {filteredInterviews.length === 0 && !loading && (
                <tr><td colSpan={7} className="h-24 text-center text-slate-500">No interviews found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
