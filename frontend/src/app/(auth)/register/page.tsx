'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    city: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/register', {
        ...formData,
        age: parseInt(formData.age, 10)
      });
      // After successful registration, login automatically
      login(data.token, data);
      
      // Usually users are pushed to dashboard directly on success
      // Note: `login` function inside AuthContext handles the routing
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg border-0 ring-1 ring-gray-200 my-8">
      <CardHeader className="space-y-2 text-center pt-8">
        <CardTitle className="text-2xl font-bold tracking-tight">Create your profile</CardTitle>
        <CardDescription>
          Apply to join Wingmann
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm text-white bg-red-500 rounded-md">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={formData.password} onChange={handleChange} required minLength={6} />
            </div>

            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" min="18" max="100" placeholder="25" value={formData.age} onChange={handleChange} required />
            </div>

            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(val: string | null) => { if (typeof val === 'string') handleSelectChange('gender', val); }}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="e.g. New York, London" value={formData.city} onChange={handleChange} required />
            </div>
          </div>
          
          <Button type="submit" className="w-full h-11 bg-[#563574] hover:bg-[#432959] text-white mt-4" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue to Interview Scheduling'}
          </Button>
        </form>
        
        <div className="mt-6 flex items-center justify-center space-x-2 text-sm">
          <span className="text-gray-500">Already have an account?</span>
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
