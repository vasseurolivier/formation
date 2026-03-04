"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import type { AICourseContentAndTranslationAssistantOutput } from "@/ai/flows/ai-course-content-and-translation-assistant-flow";
import { generateCourseContentAction } from "./actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CourseGeneratorPage() {
  const { t } = useTranslation();
  const [generationResult, setGenerationResult] =
    useState<AICourseContentAndTranslationAssistantOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const formSchema = z.object({
    courseName: z.string().min(3),
    courseCategory: z.string().min(3),
    keyTopics: z.string().min(10),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: "",
      courseCategory: "",
      keyTopics: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setGenerationResult(null);
    try {
      const result = await generateCourseContentAction({
        ...values,
        keyTopics: values.keyTopics.split("\n").filter((t) => t.trim() !== ""),
      });
      setGenerationResult(result);
    } catch (error) {
      console.error("Generation failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate course content.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 pt-24 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Dashboard
        </Link>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">
              {t("admin.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              {t("admin.description")}
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="courseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.courseName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("admin.courseNamePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="courseCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.courseCategory")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("admin.courseCategoryPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="keyTopics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.keyTopics")}</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder={t("admin.keyTopicsPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? t("admin.generating") : t("admin.generate")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isGenerating && (
          <div className="space-y-4">
            <div className="animate-pulse rounded-md bg-muted h-64 w-full"></div>
            <div className="animate-pulse rounded-md bg-muted h-64 w-full"></div>
          </div>
        )}

        {generationResult && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">
                {t("admin.results")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold">{t("admin.originalDescription")}</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {generationResult.description}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">{t("admin.frenchTranslation")}</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {generationResult.frenchTranslation}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">{t("admin.englishTranslation")}</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {generationResult.englishTranslation}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">{t("admin.chineseTranslation")}</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {generationResult.chineseTranslation}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
