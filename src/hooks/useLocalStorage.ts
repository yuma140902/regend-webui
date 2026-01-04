import { useCallback, useState } from 'react';

export function useLocalStorage(
  key: string,
  initialValue: string,
): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [value, setValue] = useState(() => {
    const v = localStorage.getItem(key);
    if (v === null) {
      return initialValue;
    }
    return v;
  });

  const set = useCallback(
    (action: string | ((p: string) => string)) => {
      const newState = action instanceof Function ? action(value) : action;
      localStorage.setItem(key, newState);
      setValue(() => newState);
    },
    [key, value],
  );

  return [value, set];
}
