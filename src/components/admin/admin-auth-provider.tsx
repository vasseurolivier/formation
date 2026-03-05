'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useFirebase } from '@/firebase/provider';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { doc, onSnapshot, setDoc, Unsubscribe } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Auth, User } from 'firebase/auth';

/**
 * Ensures the admin role document exists in Firestore for the current user.
 * This is a non-blocking write. We'll confirm its existence via the listener.
 */
function ensureAdminRoleDocument(auth: Auth, firestore: any, user: User) {
  if (!firestore || !user) return;
  const adminRoleRef = doc(firestore, 'roles_admin', user.uid);

  // The security rule `allow create, update, delete: if isSignedIn() && request.auth.uid == adminUid;`
  // on the `/roles_admin/{adminUid}` path permits this write.
  // We fire-and-forget, because the onSnapshot listener below is our source of truth.
  setDoc(adminRoleRef, { isAdmin: true }, { merge: true }).catch((err) => {
    // This should not fail if rules are correct, but if it does, it's a critical setup issue.
    // We'll create a contextual error, which will be thrown by the global FirebaseErrorListener.
    console.error('CRITICAL: Failed to write admin role document.', err);
    const permissionError = new FirestorePermissionError(auth, {
      path: adminRoleRef.path,
      operation: 'write',
      requestResourceData: { isAdmin: true },
    });
    // Rethrow to ensure it's caught by a boundary or logged.
    throw permissionError;
  });
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { auth, user, isUserLoading, firestore } = useFirebase();
  const [isAdminConfirmed, setIsAdminConfirmed] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Step 1: Trigger anonymous sign-in if not logged in.
  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  // Step 2: Once we have a user, attempt to create their admin role doc
  // and listen for it to confirm admin status.
  useEffect(() => {
    if (isUserLoading || !user || !firestore || !auth) {
      return; // Wait for user and firestore to be available
    }

    // Immediately try to write the admin role.
    ensureAdminRoleDocument(auth, firestore, user);

    // Set up a listener to confirm when the admin role is actually active in Firestore.
    const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
    const unsubscribe = onSnapshot(
      adminRoleRef,
      (docSnap) => {
        if (docSnap.exists() && docSnap.data()?.isAdmin) {
          setIsAdminConfirmed(true); // Role confirmed!
        }
        // If it doesn't exist yet, the listener will just wait for our write to complete.
      },
      (err) => {
        // This listener error means we probably don't have read access to our own role doc.
        console.error('Admin role listener failed:', err);
        const permError = new FirestorePermissionError(auth, {
          path: adminRoleRef.path,
          operation: 'get',
        });
        setError(permError); // Set state to trigger error boundary
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user, firestore, auth, isUserLoading]);

  if (error) {
    // Propagate any critical errors to the nearest Next.js error boundary.
    throw error;
  }

  // The admin section is ready only when auth is done AND the admin role is confirmed in Firestore.
  const isReady = !isUserLoading && user && isAdminConfirmed;

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
