'use server';

/**
 * @fileOverview An object recognition AI agent.
 *
 * - recognizeObject - A function that handles the object recognition process.
 * - RecognizeObjectInput - The input type for the recognizeObject function.
 * - RecognizeObjectOutput - The return type for the recognizeObject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecognizeObjectInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an object, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  objectDescription: z.string().optional().describe('Additional description of the object, if available.'),
});
export type RecognizeObjectInput = z.infer<typeof RecognizeObjectInputSchema>;

const RecognizeObjectOutputSchema = z.object({
  objectName: z.string().describe('The name of the object identified in the image.'),
  objectColor: z.string().optional().describe('The color of the identified object, if discernible.'),
  confidenceLevel: z.number().describe('A numerical value (0-1) representing the confidence level of the object recognition.'),
});
export type RecognizeObjectOutput = z.infer<typeof RecognizeObjectOutputSchema>;

export async function recognizeObject(input: RecognizeObjectInput): Promise<RecognizeObjectOutput> {
  return recognizeObjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recognizeObjectPrompt',
  input: {schema: RecognizeObjectInputSchema},
  output: {schema: RecognizeObjectOutputSchema},
  prompt: `You are an AI expert in object recognition. Please identify the object in the image provided.

  Object Image: {{media url=photoDataUri}}
  {% if objectDescription %}Description: {{{objectDescription}}}{% endif %}
  
  Based on the image, provide the objectName and objectColor (if applicable). Also, provide a confidenceLevel (0-1) for your identification.
  Make sure to return a valid JSON.
  `,
});

const recognizeObjectFlow = ai.defineFlow(
  {
    name: 'recognizeObjectFlow',
    inputSchema: RecognizeObjectInputSchema,
    outputSchema: RecognizeObjectOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
