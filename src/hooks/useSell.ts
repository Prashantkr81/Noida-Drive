import { useEffect, useState } from 'react';

import { SellSubmission } from '../types';
import {
  subscribeToMySellSubmissions,
} from '../services/firebase/sell';

import { useAuth } from './useAuth';

export const useSell = () => {
  const { user } = useAuth();

  const [submissions, setSubmissions] =
    useState<SellSubmission[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setSubmissions([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe =
      subscribeToMySellSubmissions(
        user.uid,

        (data) => {
          setSubmissions(data);
          setLoading(false);
        },

        (err) => {
          console.error(
            'SELL HOOK ERROR:',
            err,
          );

          setError(err);
          setLoading(false);
        },
      );

    return unsubscribe;
  }, [user]);

  return {
    submissions,
    loading,
    error,
  };
};