'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Calendar, Clock, User, Info } from 'lucide-react';
import { format } from 'date-fns';

export default function UserDashboard() {
  const { user } = useAuth();
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const { data } = await api.get('/interviews');
        if (data.length > 0) {
          setInterview(data[0]); // User only has 1 active interview at a time
        }
      } catch (error) {
        console.error("Failed to fetch interview", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Applicant Dashboard</h1>
      
      {/* Application Status Alert Based on User Model */}
      {user?.status === 'accepted' && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 flex items-start gap-4">
            <Info className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800 text-lg">Congratulations!</h3>
              <p className="text-green-700 mt-1">Your profile has been accepted into Wingmann.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {user?.status === 'rejected' && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 flex items-start gap-4">
            <Info className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 text-lg">Application Update</h3>
              <p className="text-red-700 mt-1">Your profile was not accepted at this time. Thank you for applying.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* active interview widget */}
      {!interview ? (
        <Card className="border-dashed border-2 bg-gray-50/50">
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-[#563574]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Schedule Your Interview</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              To complete your Wingmann profile verification, please schedule a short 30-minute chat with our executive team.
            </p>
            <Link href="/schedule">
              <Button size="lg" className="bg-[#563574] hover:bg-[#432959] text-white">Book an Interview</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Your Scheduled Interview</CardTitle>
              <Badge variant={interview.status === 'completed' ? 'secondary' : 'default'} className={interview.status !== 'completed' ? 'bg-[#563574] hover:bg-[#563574]' : ''}>
                {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                   <Calendar className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                   <p className="text-sm text-gray-500 font-medium">Date</p>
                   <p className="font-semibold text-lg">{format(new Date(interview.slotId.date), 'MMMM d, yyyy')}</p>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                   <Clock className="w-5 h-5 text-blue-600" />
                 </div>
                 <div>
                   <p className="text-sm text-gray-500 font-medium">Time</p>
                   <p className="font-semibold text-lg">{interview.slotId.startTime} - {interview.slotId.endTime}</p>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                   <User className="w-5 h-5 text-green-600" />
                 </div>
                 <div>
                   <p className="text-sm text-gray-500 font-medium">Interviewer</p>
                   <p className="font-semibold text-lg">{interview.interviewerId?.name || 'Assigned Executive'}</p>
                 </div>
              </div>
            </div>
            
            {interview.status === 'scheduled' && (
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Info className="w-4 h-4" /> 
                  A meeting link will be sent to your email 15 minutes before the interview begins.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
