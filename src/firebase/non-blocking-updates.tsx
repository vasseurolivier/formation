'use client';
    
import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  SetOptions,
  FirestoreError,
} from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { toast } from '@/hooks/use-toast';

function handleFirestoreError(
    error: any, 
    auth: Auth, 
    context: SecurityRuleContext
) {
    if (error instanceof FirestoreError && error.code === 'permission-denied') {
        const permissionError = new FirestorePermissionError(auth, context);
        console.error("Permission denied error:", permissionError.message);
        toast({
            variant: "destructive",
            title: "Permission Refusée",
            description: "Vous n'avez pas les droits nécessaires pour effectuer cette action.",
        });
    } else {
        console.error(`An unexpected Firestore error occurred during ${context.operation} on ${context.path}:`, error);
        toast({
            variant: "destructive",
            title: "Une erreur inattendue est survenue",
            description: error.message || "Impossible de terminer l'opération. Veuillez vérifier la console.",
        });
    }
}


/**
 * Initiates a setDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function setDocumentNonBlocking(auth: Auth, docRef: DocumentReference, data: any, options: SetOptions) {
  setDoc(docRef, data, options).catch(error => {
    handleFirestoreError(error, auth, {
        path: docRef.path,
        operation: options.merge ? 'update' : 'create',
        requestResourceData: data,
    });
  })
  // Execution continues immediately
}


/**
 * Initiates an addDoc operation for a collection reference.
 * Does NOT await the write operation internally.
 * Returns the Promise for the new doc ref, but typically not awaited by caller.
 */
export function addDocumentNonBlocking(auth: Auth, colRef: CollectionReference, data: any) {
  const promise = addDoc(colRef, data)
    .catch(error => {
        handleFirestoreError(error, auth, {
            path: colRef.path,
            operation: 'create',
            requestResourceData: data,
        });
    });
  return promise;
}


/**
 * Initiates an updateDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function updateDocumentNonBlocking(auth: Auth, docRef: DocumentReference, data: any) {
  updateDoc(docRef, data)
    .catch(error => {
        handleFirestoreError(error, auth, {
            path: docRef.path,
            operation: 'update',
            requestResourceData: data,
        });
    });
}


/**
 * Initiates a deleteDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function deleteDocumentNonBlocking(auth: Auth, docRef: DocumentReference) {
  deleteDoc(docRef)
    .catch(error => {
        handleFirestoreError(error, auth, {
            path: docRef.path,
            operation: 'delete',
        });
    });
}
