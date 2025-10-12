import Link from "next/link";
import Header from "@/components/layout/Header";
import EducationBackground from "@/components/shared/effects/EducationBackground";
import { Zap, Users, Calendar, FileText, Bell, Database } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <EducationBackground />
      
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="bg-black/80 backdrop-blur-lg text-white py-20 relative z-10 border-b border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Automate Your Teaching Workflow</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            A simple platform for instructors to automate administrative tasks and complex pedagogical processes without IT knowledge
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link 
              href="/register" 
              className="bg-white text-black px-6 py-3 rounded-md font-bold border-2 border-white hover:bg-stone-100 hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all duration-200"
            >
              Get Started
            </Link>
            <Link 
              href="/learn-more" 
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-bold hover:bg-white/10 hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-white tracking-tight drop-shadow-lg">What You Can Automate</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl border-2 border-white/30 hover:border-blue-400 hover:bg-white/95 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:-translate-y-1">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black group-hover:text-blue-600 transition-colors">Class Attendance</h3>
              <p className="text-black/80 leading-relaxed font-medium">Distribute attendance sheets via QR codes or links, summarize results, and get warnings about absences.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl border-2 border-white/30 hover:border-green-400 hover:bg-white/95 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:-translate-y-1">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black group-hover:text-green-600 transition-colors">Scoring & Feedback</h3>
              <p className="text-black/80 leading-relaxed font-medium">Create self-scoring tests, use suggested rubrics for essays, and provide quick feedback to students.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl border-2 border-white/30 hover:border-purple-400 hover:bg-white/95 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:-translate-y-1">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black group-hover:text-purple-600 transition-colors">Teaching Schedule</h3>
              <p className="text-black/80 leading-relaxed font-medium">Create personal timetables, get deadline reminders, and sync with Google Calendar or Outlook.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl border-2 border-white/30 hover:border-red-400 hover:bg-white/95 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:-translate-y-1">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors duration-300">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black group-hover:text-red-600 transition-colors">Document Creation</h3>
              <p className="text-black/80 leading-relaxed font-medium">Create and export lesson plans, slides, tests, and other teaching materials to various formats.</p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl border-2 border-white/30 hover:border-yellow-400 hover:bg-white/95 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:-translate-y-1">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-600 transition-colors duration-300">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black group-hover:text-yellow-600 transition-colors">Notifications</h3>
              <p className="text-black/80 leading-relaxed font-medium">Send conditional mass text/email notifications using customizable templates.</p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl border-2 border-white/30 hover:border-indigo-400 hover:bg-white/95 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:-translate-y-1">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black group-hover:text-indigo-600 transition-colors">Submission Management</h3>
              <p className="text-black/80 leading-relaxed font-medium">Collect submissions from various platforms, organize files, and create grading lists.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-10 mt-auto relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-xl font-bold">Education Automation Hub</div>
              <p className="text-black mt-2">Simplify your teaching workflow</p>
            </div>
            <div className="flex gap-8">
              <div>
                <h3 className="font-semibold mb-2">Product</h3>
                <ul className="space-y-1 text-black">

                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Company</h3>
                <ul className="space-y-1 text-black">

                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-black">
            <p>&copy; {new Date().getFullYear()} EduAutomation Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
