
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Sparkles, Zap, MessageSquare } from "lucide-react";
import Link from 'next/link';

const LandingPage = () => {
  return (

    <main className="min-h-screen space-y-8 p-16">

      <section className="border-separate border-4 border-spacing-2 border-white rounded-3xl p-2">


        <section className="relative overflow-hidden  bg-slate-900 border-2  border-black rounded-3xl p-24">

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20"></div>
          </div>

          <div className="max-w-6xl mx-auto relative">
            <div className="text-center space-y-8">
              <span className="px-4 py-2 rounded-full bg-violet-500/10 text-gray-400 text-sm inline-block">
                AI-Powered Note Taking
              </span>
              <h1 className="text-6xl font-bold text-white">
                 Your Notes,

                <span className="text-transparent bg-clip-text bg-custom-gradient-1">Supercharged</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Transform your thoughts into organized knowledge with AI assistance. Seamlessly create, summarize, and interact with your notes.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href='/notebook'>
                  <Button size="lg" className="bg-violet-100 text-gray-900 hover:bg-white">
                    Start Taking Notes
                  </Button>
                </Link>
                
              </div>
            </div>
          </div>
        </section>
      </section>


      <section className="py-20 px-4  border-white rounded-3xl bg-gray-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-slate-800/50 border-slate-700 hover:border-violet-500/50 transition-all p-6">
            <CardContent className="space-y-4 p-0">
              <Brain className="h-8 w-8 text-violet-400" />
              <h3 className="text-xl font-semibold text-white">Smart Organization</h3>
              <p className="text-gray-300">
                Automatically categorize and structure your notes using AI. Create unlimited notebooks and pages.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-violet-500/50 transition-all p-6">
            <CardContent className="space-y-4 p-0">
              <Sparkles className="h-8 w-8 text-fuchsia-400" />
              <h3 className="text-xl font-semibold text-white">AI Summaries</h3>
              <p className="text-gray-300">
                Get instant, intelligent summaries of your notes. Perfect for quick reviews and knowledge sharing.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-violet-500/50 transition-all p-6">
            <CardContent className="space-y-4 p-0">
              <MessageSquare className="h-8 w-8 text-violet-400" />
              <h3 className="text-xl font-semibold text-white">Interactive AI Chat</h3>
              <p className="text-gray-300">
                Have natural conversations with your notes. Ask questions and get intelligent insights instantly.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-violet-500/50 transition-all p-6">
            <CardContent className="space-y-4 p-0">
              <Zap className="h-8 w-8 text-fuchsia-400" />
              <h3 className="text-xl font-semibold text-white">Real-time Collaboration</h3>
              <p className="text-gray-300">
                Share notebooks and collaborate with team members in real-time with AI assistance.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>


      <section className="py-20 px-4 border-1 border-indigo-700 rounded-3xl bg-gray-900">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-100 to-fuchsia-300">
            Start Writing Smarter Today
          </h2>
          <p className="text-xl text-violet-100">
            Join thousands of professionals who've elevated their note-taking with AI.
          </p>
          <Button size="lg" className="bg-violet-500 hover:bg-violet-600">
            Try Free for 14 Days
          </Button>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;