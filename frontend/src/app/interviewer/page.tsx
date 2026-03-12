'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, Clock, UserIcon, Video } from 'lucide-react';
import { format, isToday } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function InterviewerDashboardPage() {
  const [stats, setStats] = useState({
    upcoming: 0,
    today: 0,
    hours: 0,
  });
  const [ongoing, setOngoing] = useState<any>(null);
  const [next, setNext] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interviewsRes, availabilityRes] = await Promise.all([
          api.get('/interviews'),
          api.get('/availability/me')
        ]);
        
        const interviews = interviewsRes.data;
        const upcoming = interviews.filter((i: any) => i.status === 'scheduled');
        const today = upcoming.filter((i: any) => isToday(new Date(i.slotId.date)));
        
        const now = new Date();
        const sortedUpcoming = [...upcoming].sort((a: any, b: any) => {
          if (!a.slotId?.date || !b.slotId?.date) return 0;
          const dateA = new Date(`${a.slotId.date}T${a.slotId.startTime}`);
          const dateB = new Date(`${b.slotId.date}T${b.slotId.startTime}`);
          return dateA.getTime() - dateB.getTime();
        });

        let nextInt = null;
        let ongoingInt = null;

        for (const inv of sortedUpcoming) {
          if (!inv.slotId?.date) continue;
          const start = new Date(`${inv.slotId.date}T${inv.slotId.startTime}`);
          const end = new Date(`${inv.slotId.date}T${inv.slotId.endTime}`);
          
          if (now >= start && now < end) {
            ongoingInt = inv;
          } else if (start > now && !nextInt) {
            nextInt = inv;
          }
        }

        setOngoing(ongoingInt);
        setNext(nextInt);

        // Each slot is 30 mins (0.5 hours)
        const totalHours = availabilityRes.data.length * 0.5;

        setStats({
          upcoming: upcoming.length,
          today: today.length,
          hours: totalHours
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Executive Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Upcoming Interviews</CardTitle>
            <CalendarCheck className="w-5 h-5 text-[#563574]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.upcoming}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm ring-1 ring-gray-200 bg-purple-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#563574]">Today's Interviews</CardTitle>
            <UserIcon className="w-5 h-5 text-[#563574]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#563574]">{stats.today}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Availability (Hours)</CardTitle>
            <Clock className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.hours}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Ongoing */}
        <Card className="border-0 shadow-sm ring-1 ring-purple-200 bg-purple-50 shrink-0">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-purple-900 flex items-center gap-2">
               <Video className="w-5 h-5 text-purple-600 mb-0.5" /> Ongoing Interview
            </CardTitle>
          </CardHeader>
          <CardContent>
             {ongoing ? (
               <div className="space-y-4 pt-2">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                     <UserIcon className="w-5 h-5 text-purple-700" />
                   </div>
                   <div>
                     <p className="font-semibold text-purple-900">{ongoing.userId?.name}</p>
                     <p className="text-sm text-purple-700">{ongoing.slotId?.startTime} - {ongoing.slotId?.endTime}</p>
                   </div>
                 </div>
                 {ongoing.meetingLink ? (
                   <Link href={ongoing.meetingLink} target="_blank">
                      <Button className="w-full bg-[#563574] hover:bg-[#432959] text-white">Join Meeting Now</Button>
                   </Link>
                 ) : (
                   <p className="text-sm text-purple-700 mt-2">No meeting link assigned. Please add a link in the My Interviews schedule.</p>
                 )}
               </div>
             ) : (
                <div className="py-6 text-center text-purple-700">
                  <p>Nothing scheduled at this very moment.</p>
                </div>
             )}
          </CardContent>
        </Card>

        {/* Upcoming */}
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardHeader className="pb-2">
             <CardTitle className="text-lg font-bold text-gray-900">Next Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
             {next ? (
               <div className="space-y-4 pt-2">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                     <UserIcon className="w-5 h-5 text-gray-500" />
                   </div>
                   <div>
                     <p className="font-semibold text-gray-900">{next.userId?.name}</p>
                     <p className="text-sm text-gray-500">{format(new Date(next.slotId.date), 'MMM d, yyyy')} at {next.slotId?.startTime}</p>
                   </div>
                 </div>
                 <Dialog>
                    <DialogTrigger>
                      <Button variant="outline" className="w-full">View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Applicant Profile</DialogTitle>
                          <DialogDescription>Review details for this upcoming interview.</DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-4 space-y-4 text-left">
                          <div className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50/50">
                             <div className="w-12 h-12 bg-purple-100 rounded-full flex justify-center items-center shrink-0">
                               <UserIcon className="w-6 h-6 text-[#563574]" />
                             </div>
                             <div>
                                <h3 className="font-semibold text-lg text-gray-900">{next.userId?.name}</h3>
                                <p className="text-sm text-gray-500">{next.userId?.email}</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Age</p>
                              <p className="font-medium text-gray-900">{next.userId?.age || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Gender</p>
                              <p className="font-medium text-gray-900 capitalize">{next.userId?.gender || 'N/A'}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">City</p>
                              <p className="font-medium text-gray-900">{next.userId?.city || 'N/A'}</p>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4">
                             <p className="text-sm text-blue-800 font-medium">Interview Details</p>
                             <p className="text-blue-900 text-sm mt-1">
                               Date: {next.slotId?.date ? format(new Date(next.slotId.date), 'EEEE, MMMM d, yyyy') : ''}<br/>
                               Time: {next.slotId?.startTime} - {next.slotId?.endTime}<br/>
                             </p>
                          </div>
                        </div>
                    </DialogContent>
                 </Dialog>
               </div>
             ) : (
                <div className="py-6 text-center text-gray-500">
                  <p>No upcoming interviews scheduled ahead.</p>
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
