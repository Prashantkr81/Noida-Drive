import { useEffect, useState } from 'react';

import { subscribeToRentCars } from '../services/firebase/cars';
import { Car } from '../types/car';

export const useRentCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToRentCars(
      (data) => {
        setCars(data);
        setLoading(false);
      },
      (firebaseError) => {
        setError(firebaseError);
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