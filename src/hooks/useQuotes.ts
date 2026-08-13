import { useEffect, useState } from 'react';

import { Quote } from '../types';
import {
  subscribeToMyQuotes,
} from '../services/firebase/quotes';

import { useAuth } from './useAuth';

export const useQuotes = () => {
  const { user } = useAuth();

  const [quotes, setQuotes] =
    useState<Quote[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setQuotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe =
      subscribeToMyQuotes(
        user.uid,
        (data) => {
          setQuotes(data);
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        },
      );

    return unsubscribe;
  }, [user]);

  return {
    quotes,
    loading,
    error,
  };
};