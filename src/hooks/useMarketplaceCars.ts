import { useEffect, useState } from 'react';

import { Car } from '../types';
import {
  subscribeToMarketplaceCars,
} from '../services/firebase/cars';

export const useMarketplaceCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe =
      subscribeToMarketplaceCars(
        (data) => {
          setCars(data);
          setLoading(false);
        },
        (err) => {
          console.error(
            'MARKETPLACE HOOK ERROR:',
            err,
          );

          setError(err);
          setLoading(false);
        },
      );

    return unsubscribe;
  }, []);

  return {
    cars,
    loading,
    error,
  };
};