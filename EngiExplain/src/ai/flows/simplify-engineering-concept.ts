'use server';
/**
 * @fileOverview A flow that simplifies complex engineering concepts using AI.
 *
 * - simplifyEngineeringConcept - A function that simplifies an engineering concept.
 * - SimplifyEngineeringConceptInput - The input type for the simplifyEngineeringConcept function.
 * - SimplifyEngineeringConceptOutput - The return type for the simplifyEngineeringConcept function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SimplifyEngineeringConceptInputSchema = z.object({
  concept: z.string().describe('The complex engineering concept to simplify.'),
});
export type SimplifyEngineeringConceptInput = z.infer<typeof SimplifyEngineeringConceptInputSchema>;

const SimplifyEngineeringConceptOutputSchema = z.object({
  simplifiedExplanation: z.string().describe('The simplified explanation of the concept.'),
});
export type SimplifyEngineeringConceptOutput = z.infer<typeof SimplifyEngineeringConceptOutputSchema>;

export async function simplifyEngineeringConcept(
  input: SimplifyEngineeringConceptInput
): Promise<SimplifyEngineeringConceptOutput> {
  return simplifyEngineeringConceptFlow(input);
}

const simplifyEngineeringConceptPrompt = ai.definePrompt({
  name: 'simplifyEngineeringConceptPrompt',
  input: {
    schema: z.object({
      concept: z.string().describe('The complex engineering concept to simplify.'),
    }),
  },
  output: {
    schema: z.object({
      simplifiedExplanation: z.string().describe('The simplified explanation of the concept.'),
    }),
  },
  prompt: `You are an expert in simplifying complex engineering concepts. Please provide a simplified explanation of the following concept:\n\nConcept: {{{concept}}}\n\nSimplified Explanation:`,
});

const simplifyEngineeringConceptFlow = ai.defineFlow<
  typeof SimplifyEngineeringConceptInputSchema,
  typeof SimplifyEngineeringConceptOutputSchema
>(
  {
    name: 'simplifyEngineeringConceptFlow',
    inputSchema: SimplifyEngineeringConceptInputSchema,
    outputSchema: SimplifyEngineeringConceptOutputSchema,
  },
  async input => {
    const {output} = await simplifyEngineeringConceptPrompt(input);
    return output!;
  }
);
