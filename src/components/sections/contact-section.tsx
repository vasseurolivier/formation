"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { ScrollReveal } from "../scroll-reveal";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { courses } from "@/lib/data";

export default function ContactSection() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    phone: z.string().optional(),
    subject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
    courseOfInterest: z.string().optional(),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      courseOfInterest: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Mock form submission
    console.log(values);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: t('contactSection.successMessage'),
    });
    form.reset();
  }

  return (
    <section className="py-20 md:py-32 bg-muted">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
                <ScrollReveal>
                    <div className="p-8 md:p-12">
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("contactSection.form.name")}</FormLabel>
                                  <FormControl>
                                    <Input placeholder={t("contactSection.form.namePlaceholder")} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("contactSection.form.email")}</FormLabel>
                                  <FormControl>
                                    <Input placeholder={t("contactSection.form.emailPlaceholder")} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("contactSection.form.phone")}</FormLabel>
                                  <FormControl>
                                    <Input placeholder={t("contactSection.form.phonePlaceholder")} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                             <FormField
                              control={form.control}
                              name="subject"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("contactSection.form.subject")}</FormLabel>
                                  <FormControl>
                                    <Input placeholder={t("contactSection.form.subjectPlaceholder")} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="courseOfInterest"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("contactSection.form.courseOfInterest")}</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t("contactSection.form.courseOfInterestPlaceholder")} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="none">{t("contactSection.form.noCourse")}</SelectItem>
                                      {courses.map(course => (
                                        <SelectItem key={course.id} value={course.id}>
                                          {t(course.titleKey)}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="message"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("contactSection.form.message")}</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder={t("contactSection.form.messagePlaceholder")}
                                      className="min-h-[150px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                              {form.formState.isSubmitting ? 'Sending...' : t("contactSection.form.submit")}
                            </Button>
                          </form>
                        </Form>
                    </div>
                </ScrollReveal>
                <ScrollReveal delay={200}>
                    <div className="relative w-full h-full min-h-[400px] md:min-h-full bg-primary/5 flex flex-col items-center justify-center p-8 space-y-8 text-center">
                        <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit">
                        <MapPin className="w-10 h-10" />
                        </div>
                        <div>
                            <h3 className="font-headline text-xl font-semibold text-foreground">{t("contactSection.locations.title")}</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">{t("contactSection.locations.description")}</p>
                        </div>
                        <Button asChild>
                            <Link href="/locations">
                                {t("contactSection.locations.cta")}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </ScrollReveal>
            </div>
        </Card>
      </div>
    </section>
  );
}
