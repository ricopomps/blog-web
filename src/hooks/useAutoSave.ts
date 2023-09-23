import { isServer } from "@/utils/utils";
import { useCallback, useEffect, useState } from "react";

/**
 * A hook that automatically saves a balue to sessionStorage at a specified interval
 */

export default function useAutoSave<T>(key: string, value: T, interval = 3000) {
  const stringifiedValue = JSON.stringify(value);

  const [lastSavedValue, setLastSavedValue] = useState(() => {
    if (isServer()) return null;
    return sessionStorage.getItem(key);
  });

  const [autosave, setAutoSave] = useState(false);

  useEffect(() => {
    const i = setInterval(() => {
      setAutoSave(true);
    }, interval);

    return () => {
      setAutoSave(false);
      clearInterval(i);
    };
  }, [interval]);

  useEffect(() => {
    if (autosave && stringifiedValue !== lastSavedValue) {
      sessionStorage.setItem(key, stringifiedValue);
      setAutoSave;
    }
  }, [autosave, key, stringifiedValue, lastSavedValue]);

  const getValue = useCallback((): T | null => {
    const savedValue = sessionStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : null;
  }, [key]);

  const clearValue = useCallback(() => {
    sessionStorage.removeItem(key);
  }, [key]);

  return { getValue, clearValue };
}
