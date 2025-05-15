
"use client";

import { useState, useCallback, ChangeEvent, DragEvent, useEffect } from 'react';
import NextImage from 'next/image';
import Link from 'next/link'; // Added Link for pricing page
import { analyzeImage, type AnalyzeImageOutput } from '@/ai/flows/analyze-image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, Image as ImageIcon, Search, Loader2, XCircle, Sparkles, ExternalLink, ShieldAlert } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

export default function GeoGuessAIPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { toast } = useToast();

  const resetState = useCallback(() => {
    setSelectedFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Invalid file type. Please upload an image.');
      toast({
        title: "Invalid File",
        description: "Please upload a valid image file (e.g., JPG, PNG).",
        variant: "destructive",
      });
      return;
    }
    // Reset previous state if a new file is selected
    resetState();
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [resetState, toast]);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    preventDefaults(event);
    setIsDraggingOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const preventDefaults = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    preventDefaults(event);
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    preventDefaults(event);
    setIsDraggingOver(false);
  };
  
  const handleAnalyze = useCallback(async () => {
    if (!selectedFile || !imagePreview) {
      setError('Please select an image first.');
      toast({
        title: "No Image Selected",
        description: "Please upload an image before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeImage({ photoDataUri: imagePreview });
      setAnalysisResult(result);
    } catch (e: any) {
      console.error('Analysis error:', e);
      const errorMessage = e.message || 'An unknown error occurred during analysis.';
      setError(errorMessage);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, imagePreview, toast]);

  const getGoogleImageSearchUrl = (query: string) => {
    return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
  };
  
  // Effect to clear file input value when selectedFile is null (e.g. on reset)
  useEffect(() => {
    if (!selectedFile) {
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }, [selectedFile]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out">
      <header className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary flex items-center justify-center">
          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mr-2 sm:mr-3" />
          GeoGuessAI
        </h1>
        <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-muted-foreground max-w-md mx-auto">
          Upload an image and let our AI discover where it might be from!
        </p>
      </header>

      <main className="w-full max-w-2xl space-y-8">
        {isLoading && (
          <Card className="shadow-xl">
            <CardContent className="p-6 sm:p-8 text-center">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
              <p className="text-xl font-semibold text-foreground">Analyzing your image...</p>
              <p className="text-muted-foreground mt-2">Our AI is working its magic. This might take a moment.</p>
            </CardContent>
          </Card>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="shadow-lg">
            <XCircle className="h-5 w-5" />
            <AlertTitle>Analysis Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button variant="outline" size="sm" onClick={resetState} className="mt-4">
              Try another image
            </Button>
          </Alert>
        )}

        {analysisResult && !isLoading && (
          <Card className="shadow-xl animate-in fade-in-50 duration-500">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl text-primary flex items-center">
                <Sparkles className="w-7 h-7 mr-2" />
                Analysis Complete!
              </CardTitle>
              <CardDescription>Here's what our AI found in your image:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {imagePreview && (
                <div className="rounded-lg overflow-hidden border border-border shadow-md">
                  <div className="relative w-full aspect-video">
                    <NextImage
                      src={imagePreview}
                      alt="Uploaded image for analysis"
                      layout="fill"
                      objectFit="contain"
                      data-ai-hint="user uploaded image"
                    />
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Location Guess:</h3>
                <p className="text-2xl font-bold text-primary">{analysisResult.locationGuess || "Could not determine"}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">AI Caption:</h3>
                <p className="text-muted-foreground italic">"{analysisResult.caption || "No caption generated."}"</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Confidence:</h3>
                <div className="flex items-center space-x-2">
                  <Progress value={(analysisResult.confidence || 0) * 100} className="w-full h-3" />
                  <span className="text-sm font-medium text-primary">{((analysisResult.confidence || 0) * 100).toFixed(0)}%</span>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full group">
                <a
                  href={getGoogleImageSearchUrl(`${analysisResult.locationGuess} ${analysisResult.caption}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Search for similar images on Google
                  <ExternalLink className="w-4 h-4 ml-auto opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              </Button>
            </CardContent>
            <CardFooter>
              <Button onClick={resetState} className="w-full" variant="default">
                Analyze Another Image
              </Button>
            </CardFooter>
          </Card>
        )}

        {!imagePreview && !isLoading && !analysisResult && !error && (
           <Card 
            className={cn(
              "shadow-xl transition-all duration-300 ease-in-out",
              isDraggingOver ? "border-primary ring-2 ring-primary" : "border-border"
            )}
            onDrop={handleDrop}
            onDragOver={preventDefaults}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            <CardContent className="p-6 sm:p-8 text-center">
              <UploadCloud className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Upload Your Image</h2>
              <p className="text-muted-foreground mt-2 mb-6">
                Drag & drop an image here, or click to select a file.
              </p>
              <Button asChild variant="default" size="lg" className="cursor-pointer">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Choose File
                </label>
              </Button>
              <Input 
                id="file-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
               <p className="text-xs text-muted-foreground mt-4">Supports JPG, PNG, WEBP, GIF.</p>
            </CardContent>
          </Card>
        )}

        {imagePreview && !analysisResult && !isLoading && !error && (
          <Card className="shadow-xl animate-in fade-in-50 duration-500">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Image Preview</CardTitle>
              <CardDescription>Ready to analyze this image?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg overflow-hidden border border-border shadow-md">
                <div className="relative w-full aspect-video">
                  <NextImage
                    src={imagePreview}
                    alt="Image preview"
                    layout="fill"
                    objectFit="contain"
                    data-ai-hint="preview image"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAnalyze} className="flex-1" size="lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Image
                </Button>
                <Button onClick={resetState} variant="outline" className="flex-1" size="lg">
                  <XCircle className="w-5 h-5 mr-2" />
                  Remove Image
                </Button>
              </div>
            </CardContent>
             <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-1.5 text-amber-500"/>
                  Please ensure your image does not contain sensitive personal data.
                </p>
              </CardFooter>
          </Card>
        )}
      </main>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} GeoGuessAI. An AI-powered image location finder.</p>
        <p className="mt-1">
          <Link href="/pricing" className="hover:underline text-primary font-medium">
            View Pricing Plans
          </Link>
        </p>
        <p className="mt-1">
          Built with Next.js, Tailwind CSS, and Genkit.
        </p>
      </footer>
    </div>
  );
}
