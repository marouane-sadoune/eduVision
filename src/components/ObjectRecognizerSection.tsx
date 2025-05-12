"use client";

import { useState, type ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Camera, Loader2, Zap } from 'lucide-react';
import { recognizeObject, type RecognizeObjectOutput } from '@/ai/flows/recognize-object';
import { fileToDataUri } from '@/lib/utils';
import FeedbackCard from './FeedbackCard';
import { PRAISE_PHRASES } from '@/lib/constants';

const ObjectRecognizerSection = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecognizeObjectOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{type: 'praise', message: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const dataUri = await fileToDataUri(file);
      setImagePreview(dataUri);
      setResult(null);
      setError(null);
      setFeedback(null);
    }
  };

  const handleRecognize = async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setFeedback(null);

    try {
      const photoDataUri = await fileToDataUri(imageFile);
      const aiResult = await recognizeObject({ photoDataUri });
      setResult(aiResult);
      const randomPraise = PRAISE_PHRASES[Math.floor(Math.random() * PRAISE_PHRASES.length)];
      setFeedback({type: 'praise', message: randomPraise});
    } catch (e) {
      console.error("Error recognizing object:", e);
      setError("Oops! I couldn't figure that one out. Try another image?");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 text-primary-foreground p-6">
        <div className="flex items-center gap-3">
          <Zap size={36} />
          <CardTitle className="text-3xl">Explore & Discover</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Show me something and I'll tell you what I see!</p>
        </div>

        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          ref={fileInputRef}
        />
        <Button 
          onClick={triggerFileInput} 
          variant="outline" 
          className="w-full text-lg py-6 border-dashed border-2 border-primary hover:bg-primary/10"
          aria-label="Upload or take a picture"
        >
          <Camera size={24} className="mr-2" />
          Upload or Take a Picture
        </Button>

        {imagePreview && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="font-semibold text-xl">Here's your picture:</p>
            <div className="rounded-lg overflow-hidden shadow-md border-2 border-accent w-full max-w-md aspect-video relative">
              <Image src={imagePreview} alt="Selected preview" layout="fill" objectFit="contain" data-ai-hint="uploaded image child"/>
            </div>
            <Button onClick={handleRecognize} disabled={isLoading} className="w-full md:w-auto text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? (
                <Loader2 size={24} className="mr-2 animate-spin" />
              ) : (
                <Zap size={24} className="mr-2" />
              )}
              What's this?
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center mt-4 p-4 bg-secondary/50 rounded-md">
            <Loader2 size={32} className="animate-spin text-primary mr-3" />
            <p className="text-lg text-primary">Thinking...</p>
          </div>
        )}

        {error && <FeedbackCard type="error" message={error} />}
        
        {result && (
          <Card className="mt-6 bg-secondary/30 border-primary">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">I see...</CardTitle>
            </CardHeader>
            <CardContent className="text-xl space-y-2">
              <p>It looks like a <strong className="text-accent">{result.objectName || 'something interesting'}</strong>!</p>
              {result.objectColor && <p>It seems to be <strong className="text-accent">{result.objectColor}</strong>.</p>}
              <p className="text-sm text-muted-foreground">(I'm about {(result.confidenceLevel * 100).toFixed(0)}% sure)</p>
            </CardContent>
          </Card>
        )}
         {feedback && <FeedbackCard type={feedback.type} message={feedback.message} />}
      </CardContent>
      <CardFooter className="p-6 bg-secondary/20">
        <p className="text-sm text-muted-foreground text-center w-full">Point your camera at an object or upload a picture to get started!</p>
      </CardFooter>
    </Card>
  );
};

export default ObjectRecognizerSection;
