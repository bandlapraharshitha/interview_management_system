'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

export default function AdminInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">All Interviews</h1>
        <p className="text-slate-500 mt-2">Monitor scheduled and completed interviews across the platform.</p>
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
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr><td colSpan={6} className="h-24 text-center text-slate-500">Loading...</td></tr>
              ) : interviews.map((inv: any) => (
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
                </tr>
              ))}
              {interviews.length === 0 && !loading && (
                <tr><td colSpan={6} className="h-24 text-center text-slate-500">No interviews found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
