"use server";

import { generateCourseContentAndTranslations, type AICourseContentAndTranslationAssistantInput } from "@/ai/flows/ai-course-content-and-translation-assistant-flow";

export async function generateCourseContentAction(input: AICourseContentAndTranslationAssistantInput) {
  try {
    const result = await generateCourseContentAndTranslations(input);
    return result;
  } catch (error) {
    console.error("Error in generateCourseContentAction:", error);
    throw new Error("Failed to generate content due to a server error.");
  }
}
