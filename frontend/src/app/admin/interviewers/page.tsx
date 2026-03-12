'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, UserPlus, Mail } from 'lucide-react';

export default function InterviewersPage() {
  const [interviewers, setInterviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', gender: ''
  });

  const fetchInterviewers = async () => {
    try {
      const { data } = await api.get('/interviewers');
      setInterviewers(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInterviewers(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/interviewers', {
        ...formData,
        age: parseInt(formData.age, 10)
      });
      fetchInterviewers();
      setOpen(false);
      setFormData({ name: '', email: '', password: '', age: '', gender: '' });
    } catch (e) {
      console.error(e);
      alert('Failed to add interviewer');
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Are you sure you want to remove this interviewer?')) return;
    try {
      await api.delete(`/interviewers/${id}`);
      fetchInterviewers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Interviewer Management</h1>
        
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) setNewPassword(''); }}>
          <DialogTrigger>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <UserPlus className="w-4 h-4 mr-2" /> Add Interviewer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Interviewer</DialogTitle>
              <DialogDescription>
                Create a new executive account. A temporary password will be shown upon creation.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAdd} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Initial Password</Label>
                <Input id="password" type="text" placeholder="Set a secure password..." value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select onValueChange={(val: any) => setFormData({...formData, gender: val as string})} required>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Create Account</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b bg-slate-50/50">
              <tr className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100">
                <th className="h-12 px-4 align-middle font-medium text-slate-500 text-left">Name</th>
                <th className="h-12 px-4 align-middle font-medium text-slate-500 text-left">Email</th>
                <th className="h-12 px-4 align-middle font-medium text-slate-500 text-left">Gender</th>
                <th className="h-12 px-4 align-middle font-medium text-slate-500 text-left">Created At</th>
                <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {interviewers.map((inv: any) => (
                <tr key={inv._id} className="border-b transition-colors hover:bg-slate-50/50">
                  <td className="p-4 align-middle font-medium">{inv.name}</td>
                  <td className="p-4 align-middle flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" /> {inv.email}
                  </td>
                  <td className="p-4 align-middle capitalize text-slate-600">{inv.gender}</td>
                  <td className="p-4 align-middle text-slate-600">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 align-middle text-right">
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(inv._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {interviewers.length === 0 && !loading && (
                <tr><td colSpan={5} className="h-24 text-center text-slate-500 text-lg">No interviewers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
