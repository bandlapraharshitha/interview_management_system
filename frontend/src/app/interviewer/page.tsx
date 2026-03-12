'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, Clock, UserIcon } from 'lucide-react';
import { format, isToday } from 'date-fns';

export default function InterviewerDashboardPage() {
  const [stats, setStats] = useState({
    upcoming: 0,
    today: 0,
    hours: 0,
  });
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
    </div>
  );
}
