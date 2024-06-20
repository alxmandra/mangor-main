import {useEffect, useState} from 'react';

export const useMediaQuery = (query: string) => {
  const mediaMatch = window.matchMedia(query);
  const [matches, setMatches] = useState<boolean>(mediaMatch.matches);

  useEffect(() => {
    const handler = (e: { matches: boolean | ((prevState: boolean) => boolean); }) => setMatches(e.matches);
    mediaMatch.addEventListener("change", (r) => {
        handler(r);
    });/* addListener(handler); */
    return () => mediaMatch.removeEventListener("change",handler);
  });
  return matches;
};