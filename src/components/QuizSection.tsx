"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Lightbulb, Palette, Shapes, Hash, Send, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { generateQuizQuestion, type GenerateQuizQuestionOutput } from '@/ai/flows/generate-dynamic-quiz';
import FeedbackCard from './FeedbackCard';
import { PRAISE_PHRASES, ENCOURAGE_PHRASES } from '@/lib/constants';

type QuizSubject = "colors" | "shapes" | "numbers";

interface QuizData extends GenerateQuizQuestionOutput {
  subject: QuizSubject;
}

const QuizSection = () => {
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'praise' | 'encouragement'; message: string } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizMode, setQuizMode] = useState<QuizSubject | null>(null);
  
  const getRandomPhrase = (phrases: string[]) => phrases[Math.floor(Math.random() * phrases.length)];

  const fetchQuizQuestion = async (subject: QuizSubject) => {
    setIsLoading(true);
    setCurrentQuiz(null);
    setSelectedAnswer(null);
    setFeedback(null);
    setShowAnswer(false);
    setQuizMode(subject);

    try {
      const aiResult = await generateQuizQuestion({ subject });
      setCurrentQuiz({ ...aiResult, subject });
    } catch (e) {
      console.error("Error generating quiz question:", e);
      setFeedback({ type: 'error', message: "Oh no! I couldn't think of a question right now. Let's try another topic?" });
      setQuizMode(null); // Reset quiz mode on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentQuiz || !selectedAnswer) return;

    setShowAnswer(true);
    if (selectedAnswer === currentQuiz.correctAnswer) {
      setFeedback({ type: 'praise', message: getRandomPhrase(PRAISE_PHRASES) });
    } else {
      setFeedback({ type: 'encouragement', message: `${getRandomPhrase(ENCOURAGE_PHRASES)} The correct answer was: ${currentQuiz.correctAnswer}` });
    }
  };

  const handleNextQuestion = () => {
    if (quizMode) {
      fetchQuizQuestion(quizMode);
    }
  };
  
  const QuizSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <Button onClick={() => fetchQuizQuestion("colors")} className="text-lg py-8 bg-red-500 hover:bg-red-600 text-white shadow-lg transform hover:scale-105 transition-transform">
        <Palette size={28} className="mr-3" /> Colors Quiz
      </Button>
      <Button onClick={() => fetchQuizQuestion("shapes")} className="text-lg py-8 bg-green-500 hover:bg-green-600 text-white shadow-lg transform hover:scale-105 transition-transform">
        <Shapes size={28} className="mr-3" /> Shapes Quiz
      </Button>
      <Button onClick={() => fetchQuizQuestion("numbers")} className="text-lg py-8 bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg transform hover:scale-105 transition-transform">
        <Hash size={28} className="mr-3" /> Numbers Quiz
      </Button>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-primary-foreground p-6">
        <div className="flex items-center gap-3">
          <Lightbulb size={36} />
          <CardTitle className="text-3xl">Quiz Time!</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {!quizMode && !isLoading && <QuizSelection />}
        
        {isLoading && (
          <div className="flex flex-col justify-center items-center min-h-[200px] p-4 bg-secondary/50 rounded-md">
            <Loader2 size={48} className="animate-spin text-primary mb-4" />
            <p className="text-xl text-primary">Getting a fun question ready...</p>
          </div>
        )}

        {currentQuiz && !isLoading && (
          <div className="space-y-6">
            <p className="text-2xl font-semibold text-center">{currentQuiz.question}</p>
            <RadioGroup
              value={selectedAnswer || undefined}
              onValueChange={setSelectedAnswer}
              className="space-y-3"
              disabled={showAnswer}
            >
              {currentQuiz.answers.map((answer, index) => (
                <Label
                  key={index}
                  htmlFor={`answer-${index}`}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-lg border-2 text-lg cursor-pointer transition-all",
                    "hover:border-accent",
                    selectedAnswer === answer && "border-accent bg-accent/10",
                    showAnswer && answer === currentQuiz.correctAnswer && "border-green-500 bg-green-500/20 text-green-700 dark:text-green-300",
                    showAnswer && answer !== currentQuiz.correctAnswer && selectedAnswer === answer && "border-red-500 bg-red-500/20 text-red-700 dark:text-red-300"
                  )}
                >
                  <RadioGroupItem value={answer} id={`answer-${index}`} className="h-6 w-6"/>
                  <span>{answer}</span>
                  {showAnswer && answer === currentQuiz.correctAnswer && <CheckCircle2 className="ml-auto h-6 w-6 text-green-500" />}
                  {showAnswer && answer !== currentQuiz.correctAnswer && selectedAnswer === answer && <XCircle className="ml-auto h-6 w-6 text-red-500" />}
                </Label>
              ))}
            </RadioGroup>

            {feedback && <FeedbackCard type={feedback.type} message={feedback.message} className="mt-6" />}

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {!showAnswer && (
                <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer || isLoading} className="w-full sm:w-auto flex-1 text-lg py-6 bg-primary hover:bg-primary/90">
                  <Send size={20} className="mr-2" /> Check Answer
                </Button>
              )}
              {showAnswer && (
                <Button onClick={handleNextQuestion} disabled={isLoading} className="w-full sm:w-auto flex-1 text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <RotateCcw size={20} className="mr-2" /> Next Question
                </Button>
              )}
            </div>
             {quizMode && (
                <Button variant="outline" onClick={() => setQuizMode(null)} className="w-full sm:w-auto text-lg py-6 mt-4">
                    Back to Quiz Selection
                </Button>
            )}
          </div>
        )}
        {!isLoading && quizMode && !currentQuiz && !feedback && (
             <Button variant="outline" onClick={() => setQuizMode(null)} className="w-full sm:w-auto text-lg py-6 mt-4">
                Back to Quiz Selection
            </Button>
        )}


      </CardContent>
      <CardFooter className="p-6 bg-secondary/20">
         <p className="text-sm text-muted-foreground text-center w-full">
          {quizMode ? `You're playing the ${quizMode} quiz!` : "Select a category to start the quiz!"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default QuizSection;
