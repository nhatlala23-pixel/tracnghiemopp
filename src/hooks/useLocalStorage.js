import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return storageService.get(key, initialValue);
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storageService.set(key, valueToStore);
    } catch (error) {
      console.error(`Error in useLocalStorage for key ${key}:`, error);
    }
  };

  return [storedValue, setValue];
}
