import { RefObject, useEffect, useRef } from 'react';

export const useOutsideClick = (callback: () => void, ignore: RefObject<HTMLButtonElement>) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (ignore.current && !ignore.current.contains(event.target as Node)) {
            return
        }
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback, ignore]);

  return ref;
};