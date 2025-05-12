"use client";

import AppHeader from '@/components/AppHeader';
import ObjectRecognizerSection from '@/components/ObjectRecognizerSection';
import QuizSection from '@/components/QuizSection';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Zap, Lightbulb, Home } from 'lucide-react';

type ActiveMode = "home" | "recognizer" | "quiz";

export default function HomePage() {
  const [activeMode, setActiveMode] = useState<ActiveMode>("home");

  const renderContent = () => {
    switch (activeMode) {
      case "recognizer":
        return <ObjectRecognizerSection />;
      case "quiz":
        return <QuizSection />;
      case "home":
      default:
        return (
          <div className="text-center space-y-8">
            <div 
              className="p-8 rounded-xl shadow-2xl bg-gradient-to-br from-primary via-blue-500 to-teal-400 text-primary-foreground"
              data-ai-hint="child learning illustration"
              style={{
                backgroundImage: "url('https://picsum.photos/seed/eduvisionwelcome/1200/400')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="bg-black/50 p-6 rounded-lg">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome to EduVision!</h2>
                <p className="text-xl md:text-2xl">
                  Let's learn about colors, objects, and take fun quizzes together!
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 pt-8">
              <Button
                onClick={() => setActiveMode("recognizer")}
                className="h-auto py-8 md:py-12 px-6 text-2xl md:text-3xl font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-transform bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                aria-label="Start object recognition mode"
              >
                <Zap size={40} className="mr-4" />
                Explore & Discover
              </Button>
              <Button
                onClick={() => setActiveMode("quiz")}
                className="h-auto py-8 md:py-12 px-6 text-2xl md:text-3xl font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-transform bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                aria-label="Start quiz mode"
              >
                <Lightbulb size={40} className="mr-4" />
                Quiz Time!
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {activeMode !== "home" && (
          <Button
            onClick={() => setActiveMode("home")}
            variant="outline"
            className="mb-8 text-lg py-3 px-6"
            aria-label="Back to home"
          >
            <Home size={20} className="mr-2" />
            Back to Home
          </Button>
        )}
        {renderContent()}
      </main>
      <footer className="py-6 text-center text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} EduVision. Learning made fun!</p>
      </footer>
    </div>
  );
}
