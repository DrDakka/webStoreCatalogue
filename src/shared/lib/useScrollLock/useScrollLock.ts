import { useEffect } from 'react';

export const useScrollLock = (locked: boolean) => {
  useEffect(() => {
    document.body.classList.toggle('scroll-lock', locked);

    return () => {
      document.body.classList.remove('scroll-lock');
    };
  }, [locked]);
};
