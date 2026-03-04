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
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { ScrollReveal } from "../scroll-reveal";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ContactSection() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
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
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            {t("contactSection.title")}
          </h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            {t("contactSection.subtitle")}
          </p>
        </ScrollReveal>
        
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
