import { RefObject, useEffect, useRef } from 'react';

type OnClickOutsideCallback = () => void;

const useOnClickOutside = (
  callback: OnClickOutsideCallback,
): RefObject<HTMLElement> => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClick = (event: DocumentEventMap['click']) => {
      if (
        event.target instanceof Node &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
  }, [callback, ref]);

  return ref;
};

export default useOnClickOutside;
