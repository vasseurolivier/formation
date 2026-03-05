'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase/provider';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { doc, onSnapshot, setDoc, Unsubscribe } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { FirestorePermissionError } from '@/firebase/errors';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const { auth, user, isUserLoading, firestore } = useFirebase();
  const [isAdminRoleSet, setIsAdminRoleSet] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Step 1: Trigger anonymous sign-in if not logged in.
  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  // Step 2 & 3 Combined: Once we have a user, ensure their admin role document exists,
  // then listen for it to confirm.
  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    const setupAdminRole = async () => {
      if (user && firestore && auth) {
        const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
        try {
          // Await the write to ensure it's attempted before listening.
          // The rule allows users to create their own role doc.
          await setDoc(adminRoleRef, { isAdmin: true }, { merge: true });

          // Now that we've written, start listening.
          unsubscribe = onSnapshot(adminRoleRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data().isAdmin) {
              setIsAdminRoleSet(true);
              if (unsubscribe) unsubscribe(); // Clean up listener once confirmed
            }
          }, (err) => {
            console.error("Admin role snapshot listener error:", err);
            // If the listener fails, we are not an admin.
            const permError = new FirestorePermissionError(auth, { path: adminRoleRef.path, operation: 'get' });
            setError(permError);
            if (unsubscribe) unsubscribe();
          });

        } catch (err: any) {
          console.error("Failed to set admin role:", err);
          // If setting the role fails, it's a permission error.
           const permError = new FirestorePermissionError(auth, {
              path: adminRoleRef.path,
              operation: 'write',
              requestResourceData: { isAdmin: true },
            });
          setError(permError);
        }
      }
    };

    setupAdminRole();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, firestore, auth]);
  
  if (error) {
    // If an error occurred during setup, throw it to the error boundary
    throw error;
  }

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
