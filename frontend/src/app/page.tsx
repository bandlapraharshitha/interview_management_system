import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Shield, CalendarCheck, UserCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="px-6 h-20 flex items-center justify-between border-b bg-white">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
          <Link href="#about" className="hover:text-primary transition-colors">About</Link>
          <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
          <div className="flex items-center gap-4 ml-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#563574] hover:bg-[#432959] text-white">Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-24 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
              Join Wingmann — <br />
              <span className="text-[#563574]">Verified Connections Only</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-lg leading-relaxed">
              Every member is verified through a short interview process. We prioritize trust, authenticity, and real connections without the noise.
            </p>
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg bg-[#563574] hover:bg-[#432959] text-white rounded-xl shadow-md">
                Apply Now
              </Button>
            </Link>
          </div>
          
          <div className="flex-1 flex justify-center">
            {/* Simple abstract illustration block */}
            <div className="relative w-full max-w-md aspect-square rounded-full bg-purple-50 flex items-center justify-center">
              <div className="absolute top-10 right-10 bg-white p-4 shadow-xl rounded-2xl animate-bounce" style={{animationDuration: '3s'}}>
                <Shield className="w-8 h-8 text-[#563574]" />
              </div>
              <div className="absolute bottom-20 left-4 bg-white p-4 shadow-xl rounded-2xl animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
                <UserCheck className="w-8 h-8 text-[#563574]" />
              </div>
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=600" 
                alt="Professional verification" 
                className="rounded-full w-3/4 h-3/4 object-cover shadow-2xl border-8 border-white"
              />
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-24 bg-gray-50 border-t">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How it Works</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Get verified and start connecting with intention.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-[#563574]">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Create Profile</h3>
                <p className="text-gray-500 leading-relaxed">Sign up with your details and prepare for a short verification chat.</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm border text-center relative">
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200"></div>
                <div className="hidden md:block absolute top-1/2 -left-4 w-8 h-0.5 bg-gray-200"></div>
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CalendarCheck className="w-8 h-8 text-[#563574]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Schedule Interview</h3>
                <p className="text-gray-500 leading-relaxed">Pick a time that works for you. Our executives are ready to meet.</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-[#563574]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Approved</h3>
                <p className="text-gray-500 leading-relaxed">Once verified, welcome to the community of intentional connectors.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Verification Matters */}
        <section className="py-24 max-w-4xl mx-auto px-6 text-center">
           <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Verification Matters</h2>
           <p className="text-xl text-gray-600 leading-relaxed mb-8">
             In a world of endless swipes and anonymous profiles, Wingmann stands for trust. 
             By ensuring every member is interviewed, we cultivate a community built on mutual respect and genuine intent.
           </p>
           <Link href="/register">
            <Button variant="outline" size="lg" className="border-[#563574] text-[#563574] hover:bg-purple-50">
              Join the waitlist
            </Button>
           </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <Logo className="mb-4 md:mb-0 grayscale opacity-70" />
          <p className="text-sm text-gray-400">© 2026 Wingmann Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
