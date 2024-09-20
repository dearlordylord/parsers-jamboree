import { useSearchParams } from 'react-router-dom';

export const useIsIframe = () => {
  const [searchParams] = useSearchParams();
  return searchParams.has('iframe');
};
