// 'use server';

/**
 * @fileOverview Analyzes an image to identify the location in the background and provides a caption describing the image.
 *
 * - analyzeImage - A function that handles the image analysis process.
 * - AnalyzeImageInput - The input type for the analyzeImage function.
 * - AnalyzeImageOutput - The return type for the analyzeImage function.
 */

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

const AnalyzeImageOutputSchema = z.object({
  locationGuess: z.string().describe('The AI\u0027s best guess of the location in the image.'),
  caption: z.string().describe('A short caption describing the image.'),
  confidence: z.number().describe('The confidence level of the location guess (0-1).'),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const analyzeImagePrompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: { schema: AnalyzeImageInputSchema },
  output: { schema: AnalyzeImageOutputSchema },
  prompt: `You are an AI that analyzes images to identify the location in the background and provide a caption describing the image.\n\nAnalyze the following image and provide your best guess of the location, a short caption describing the image, and the certainty or confidence with which you suggest its location guess (0-1).\n\nImage: {{media url=photoDataUri}}\n\nLocation Guess: {{locationGuess}}\nCaption: {{caption}}\nConfidence: {{confidence}}`,
});

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async input => {
    const { output } = await analyzeImagePrompt(input);
    return output!;
  }
);
