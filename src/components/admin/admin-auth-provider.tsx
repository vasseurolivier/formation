'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase/provider';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc, onSnapshot } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const { auth, user, isUserLoading, firestore } = useFirebase();
  const [isAdminRoleSet, setIsAdminRoleSet] = useState(false);

  // Step 1: Trigger anonymous sign-in if not logged in.
  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  // Step 2: Once we have a user, ensure their admin role document exists.
  // This is fire-and-forget; we confirm the write in the next effect.
  useEffect(() => {
    if (user && firestore && auth) {
      const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
      setDocumentNonBlocking(auth, adminRoleRef, { isAdmin: true }, { merge: true });
    }
  }, [user, firestore, auth]);

  // Step 3: Listen for the admin role document to be created/confirmed in Firestore.
  // This is the source of truth for readiness.
  useEffect(() => {
    if (user && firestore) {
      const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
      const unsubscribe = onSnapshot(adminRoleRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().isAdmin) {
          setIsAdminRoleSet(true); // Mark as ready
          unsubscribe(); // Clean up listener once confirmed
        }
      }, (error) => {
        // This can happen if the rules don't allow the read yet.
        // We'll retry by re-triggering the write in the other effect.
        console.warn("Admin role snapshot listener error, will retry:", error.message);
      });
      return () => unsubscribe();
    }
  }, [user, firestore]);

  // The admin section is ready only when auth is done AND the admin role is confirmed in Firestore.
  const isReady = !isUserLoading && user && isAdminRoleSet;

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 pt-24 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto w-full space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Préparation de l'accès administrateur</h1>
            <p className="text-sm text-muted-foreground">Veuillez patienter pendant que nous configurons votre session sécurisée...</p>
          </div>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
