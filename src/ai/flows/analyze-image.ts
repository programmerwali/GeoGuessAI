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
  locationGuess: z.string().describe('The AI\u0027s best guess of the location in the image, potentially including specific business names.'),
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
  prompt: `You are an expert image analyst with a deep understanding of global locations, landmarks, and common points of interest, including businesses like cafes or restaurants. Your goal is to identify the specific location depicted in an image.

Analyze the following image: {{media url=photoDataUri}}

Consider all visual cues:
- Landmarks, natural or man-made.
- Architectural styles.
- Signage, text, or logos (even if partially visible or in a foreign language).
- Environmental details (flora, type of street, vehicles, etc.).
- Typical ambiance, decor, or products associated with certain types of places (e.g., a specific cafe chain's branding, unique dishes of a restaurant).

Based on your analysis, provide:
1. Your best guess for the specific name of the location, if identifiable (e.g., "Cafe Aylanto, Lahore", "Eiffel Tower, Paris", "Starbucks on Main Street, Anytown"). If a specific name isn't clear, provide the most precise location description possible (e.g., "A beach in Bali, Indonesia", "A busy downtown street in Tokyo, Japan").
2. A short caption describing the main subject or scene in the image.
3. Your confidence level (0-1) in the accuracy of your location guess.

Output Format:
Location Guess: {{locationGuess}}
Caption: {{caption}}
Confidence: {{confidence}}`,
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

