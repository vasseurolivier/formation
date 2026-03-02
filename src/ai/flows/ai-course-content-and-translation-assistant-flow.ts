'use server';
/**
 * @fileOverview An AI assistant flow to generate course descriptions and their translations.
 *
 * - generateCourseContentAndTranslations - A function that generates course descriptions and their translations.
 * - AICourseContentAndTranslationAssistantInput - The input type for the generateCourseContentAndTranslations function.
 * - AICourseContentAndTranslationAssistantOutput - The return type for the generateCourseContentAndTranslations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICourseContentAndTranslationAssistantInputSchema = z.object({
  courseName: z.string().describe('The name of the course.'),
  courseCategory: z
    .string()
    .describe('The category to which the course belongs (e.g., Luxury & Hospitality, Sport & Management).'),
  keyTopics: z
    .array(z.string())
    .describe('A list of key topics or modules covered in the course.'),
});
export type AICourseContentAndTranslationAssistantInput = z.infer<
  typeof AICourseContentAndTranslationAssistantInputSchema
>;

const AICourseContentAndTranslationAssistantOutputSchema = z.object({
  description: z.string().describe('The generated comprehensive course description in original language.'),
  frenchTranslation: z.string().describe('The French translation of the course description.'),
  englishTranslation: z.string().describe('The English translation of the course description.'),
  chineseTranslation: z
    .string()
    .describe('The Simplified Chinese translation of the course description.'),
});
export type AICourseContentAndTranslationAssistantOutput = z.infer<
  typeof AICourseContentAndTranslationAssistantOutputSchema
>;

export async function generateCourseContentAndTranslations(
  input: AICourseContentAndTranslationAssistantInput
): Promise<AICourseContentAndTranslationAssistantOutput> {
  return aiCourseContentAndTranslationAssistantFlow(input);
}

const courseContentPrompt = ai.definePrompt({
  name: 'aiCourseContentAndTranslationAssistantPrompt',
  input: {schema: AICourseContentAndTranslationAssistantInputSchema},
  output: {schema: AICourseContentAndTranslationAssistantOutputSchema},
  prompt: `You are a content manager and professional translator for a leading international training center based in France.
Your task is to generate a comprehensive and engaging course description based on the provided details, and then provide accurate translations of this description into French, English, and Simplified Chinese.

The course should be presented attractively for a target audience of young French students, Chinese students, and professionals in career transition.

Course Name: {{{courseName}}}
Course Category: {{{courseCategory}}}
Key Topics: {{#each keyTopics}}- {{{this}}}
{{/each}}

Generate the course description in a professional, clear, and inspiring tone. Ensure the translations are culturally appropriate and fluent.
`,
});

const aiCourseContentAndTranslationAssistantFlow = ai.defineFlow(
  {
    name: 'aiCourseContentAndTranslationAssistantFlow',
    inputSchema: AICourseContentAndTranslationAssistantInputSchema,
    outputSchema: AICourseContentAndTranslationAssistantOutputSchema,
  },
  async input => {
    const {output} = await courseContentPrompt(input);
    return output!;
  }
);
