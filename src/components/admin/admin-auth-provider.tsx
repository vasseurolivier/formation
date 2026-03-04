'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase/provider';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const { auth, user, isUserLoading, firestore } = useFirebase();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  useEffect(() => {
    if (user && firestore) {
      const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
      // This will grant admin rights to the anonymous user for the session.
      // This is for prototyping and should be replaced with a real auth system.
      setDocumentNonBlocking(adminRoleRef, { isAdmin: true }, { merge: true });
      
      // A small delay to allow Firestore rules to propagate
      setTimeout(() => setIsReady(true), 500);
    }
  }, [user, firestore]);

  if (isUserLoading || !user || !isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 pt-24 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto w-full space-y-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
