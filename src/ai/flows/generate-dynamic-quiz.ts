'use server';

/**
 * @fileOverview A dynamic quiz generation AI agent.
 *
 * - generateQuizQuestion - A function that handles the quiz question generation process.
 * - GenerateQuizQuestionInput - The input type for the generateQuizQuestion function.
 * - GenerateQuizQuestionOutput - The return type for the generateQuizQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionInputSchema = z.object({
  subject: z.string().describe('The subject of the quiz question.'),
  objectColor: z.string().optional().describe('The color of the object, if applicable.'),
  objectShape: z.string().optional().describe('The shape of the object, if applicable.'),
});
export type GenerateQuizQuestionInput = z.infer<typeof GenerateQuizQuestionInputSchema>;

const GenerateQuizQuestionOutputSchema = z.object({
  question: z.string().describe('The generated quiz question.'),
  answers: z.array(z.string()).describe('The possible answers to the quiz question.'),
  correctAnswer: z.string().describe('The correct answer to the quiz question.'),
});
export type GenerateQuizQuestionOutput = z.infer<typeof GenerateQuizQuestionOutputSchema>;

export async function generateQuizQuestion(input: GenerateQuizQuestionInput): Promise<GenerateQuizQuestionOutput> {
  return generateQuizQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionPrompt',
  input: {schema: GenerateQuizQuestionInputSchema},
  output: {schema: GenerateQuizQuestionOutputSchema},
  prompt: `You are a quiz question generator for children. Generate a quiz question about the subject: {{{subject}}}.

{% if objectColor %}The object is color: {{{objectColor}}}.{% endif %}
{% if objectShape %}The object is shape: {{{objectShape}}}.{% endif %}

Make sure the response is tailored to children.
Include one correct answer, and 2-3 plausible incorrect answers.

Output a JSON object with the following fields:
- question: the quiz question
- answers: an array of possible answers
- correctAnswer: the correct answer to the quiz question
`,
});

const generateQuizQuestionFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionFlow',
    inputSchema: GenerateQuizQuestionInputSchema,
    outputSchema: GenerateQuizQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
