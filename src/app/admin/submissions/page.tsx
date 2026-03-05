'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowLeft, Inbox, Mail, MailOpen } from 'lucide-react';
import { collection, doc, updateDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { useCollection, type WithId } from '@/firebase/firestore/use-collection';
import { useFirebase } from '@/firebase/provider';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { courses } from '@/lib/data';
import type { ContactSubmission } from '@/lib/firebase-types';

const SubmissionItem = ({ submission }: { submission: WithId<ContactSubmission> }) => {
    const { firestore } = useFirebase();
    const { t } = useTranslation();

    const submissionDate = (submission.submittedAt as Timestamp).toDate();

    const course = courses.find(c => c.id === submission.courseOfInterest);

    const handleOpen = () => {
        if (!submission.isRead && firestore) {
            const submissionRef = doc(firestore, 'contactSubmissions', submission.id);
            updateDoc(submissionRef, { isRead: true });
        }
    };

    return (
        <AccordionItem value={submission.id}>
            <AccordionTrigger onFocus={handleOpen} className="p-4 hover:no-underline data-[state=open]:bg-muted/50">
                <div className="flex items-center gap-4 w-full">
                    {submission.isRead ? <MailOpen className="w-5 h-5 text-muted-foreground" /> : <Mail className="w-5 h-5 text-primary" />}
                    <div className="flex-1 text-left">
                        <p className={`font-semibold ${!submission.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>{submission.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs md:max-w-md">{submission.subject}</p>
                    </div>
                    <p className="text-sm text-muted-foreground hidden md:block">{format(submissionDate, "d MMM yyyy 'à' HH:mm", { locale: fr })}</p>
                    {!submission.isRead && <Badge>Nouveau</Badge>}
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 bg-muted">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <p><strong>Email:</strong> <a href={`mailto:${submission.email}`} className="text-primary hover:underline">{submission.email}</a></p>
                        {submission.phone && <p><strong>Téléphone:</strong> {submission.phone}</p>}
                        {course && <p><strong>Formation:</strong> {t(course.titleKey)}</p>}
                    </div>
                    <div className="whitespace-pre-wrap p-4 bg-background rounded-md border text-sm">
                        {submission.message}
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};


export default function SubmissionsPage() {
    const { firestore, isUserLoading } = useFirebase();
    
    const submissionsQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'contactSubmissions'), orderBy('submittedAt', 'desc'));
    }, [firestore]);

    const { data: submissions, isLoading } = useCollection<ContactSubmission>(submissionsQuery);
    const effectiveIsLoading = isLoading || isUserLoading;

    return (
        <div className="min-h-screen bg-background p-4 pt-24 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                <ArrowLeft className="w-4 h-4" />
                Retour au Tableau de Bord Admin
                </Link>
                <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                        <Inbox />
                        Boîte de Réception
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">
                        Voici les messages reçus via le formulaire de contact du site.
                    </p>
                    {effectiveIsLoading && (
                        <div className="space-y-2">
                           <Skeleton className="h-16 w-full" />
                           <Skeleton className="h-16 w-full" />
                           <Skeleton className="h-16 w-full" />
                        </div>
                    )}
                    {!effectiveIsLoading && submissions && submissions.length > 0 && (
                        <Accordion type="multiple" className="border rounded-md">
                            {submissions.map(submission => (
                                <SubmissionItem key={submission.id} submission={submission} />
                            ))}
                        </Accordion>
                    )}
                     {!effectiveIsLoading && (!submissions || submissions.length === 0) && (
                        <div className="text-center py-12 text-muted-foreground">
                            <Inbox className="w-12 h-12 mx-auto mb-4" />
                            <p>La boîte de réception est vide.</p>
                        </div>
                    )}
                </CardContent>
                </Card>
            </div>
        </div>
    );
}
