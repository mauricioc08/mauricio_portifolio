"use client";

// Hook de autenticação do admin (client). Envolve o Firebase Auth:
// estado do usuário, login, logout e obtenção do ID token para as API Routes.
import { useCallback, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, firebaseEnabled, ADMIN_UID } from "./client";

export type AuthState = {
  ready: boolean; // já resolveu o estado inicial?
  user: User | null;
  isAdmin: boolean;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    ready: false,
    user: null,
    isAdmin: false,
  });

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setState({ ready: true, user: null, isAdmin: false });
      return;
    }
    return onAuthStateChanged(auth, (user) => {
      setState({
        ready: true,
        user,
        isAdmin: !!user && user.uid === ADMIN_UID,
      });
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase não configurado.");
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const logout = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (auth) await signOut(auth);
  }, []);

  return { ...state, firebaseEnabled, login, logout };
}

/** Obtém o ID token do usuário logado (para o header Authorization). */
export async function getIdToken(): Promise<string | null> {
  const auth = getFirebaseAuth();
  return auth?.currentUser ? auth.currentUser.getIdToken() : null;
}
