// src/ai/flows/improve-explanation-with-feedback.ts
'use server';

/**
 * @fileOverview A flow to improve explanations with user feedback.
 *
 * - improveExplanationWithFeedback - A function that improves the explanation based on feedback.
 * - ImproveExplanationWithFeedbackInput - The input type for the improveExplanationWithFeedback function.
 * - ImproveExplanationWithFeedbackOutput - The return type for the improveExplanationWithFeedback function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ImproveExplanationWithFeedbackInputSchema = z.object({
  concept: z.string().describe('The engineering concept to explain.'),
  explanation: z.string().describe('The current explanation of the concept.'),
  feedback: z.string().describe('User feedback on the explanation.'),
});
export type ImproveExplanationWithFeedbackInput = z.infer<
  typeof ImproveExplanationWithFeedbackInputSchema
>;

const ImproveExplanationWithFeedbackOutputSchema = z.object({
  improvedExplanation: z
    .string()
    .describe('The improved explanation based on the feedback.'),
});
export type ImproveExplanationWithFeedbackOutput = z.infer<
  typeof ImproveExplanationWithFeedbackOutputSchema
>;

export async function improveExplanationWithFeedback(
  input: ImproveExplanationWithFeedbackInput
): Promise<ImproveExplanationWithFeedbackOutput> {
  return improveExplanationWithFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveExplanationWithFeedbackPrompt',
  input: {
    schema: z.object({
      concept: z.string().describe('The engineering concept to explain.'),
      explanation: z.string().describe('The current explanation of the concept.'),
      feedback: z.string().describe('User feedback on the explanation.'),
    }),
  },
  output: {
    schema: z.object({
      improvedExplanation:
        z.string().describe('The improved explanation based on the feedback.'),
    }),
  },
  prompt: `You are an expert in simplifying complex engineering concepts.
      You have provided the following explanation for the concept "{{concept}}":
      """
      {{explanation}}
      """

      A user has given the following feedback on your explanation:
      """
      {{feedback}}
      """

      Based on this feedback, improve your explanation of the concept.  The improved explanation should be easy to understand, and address the user's feedback.
      Return ONLY the improved explanation.  Do not include any introductory or concluding remarks.
      `,
});

const improveExplanationWithFeedbackFlow = ai.defineFlow<
  typeof ImproveExplanationWithFeedbackInputSchema,
  typeof ImproveExplanationWithFeedbackOutputSchema
>(
  {
    name: 'improveExplanationWithFeedbackFlow',
    inputSchema: ImproveExplanationWithFeedbackInputSchema,
    outputSchema: ImproveExplanationWithFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {improvedExplanation: output!.improvedExplanation!};
  }
);
