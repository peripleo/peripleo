import { useRef } from 'react';

interface UseInViewProps {

  onViewportChange(arg: { entered: Element[], left: Element[] }): void;

}

/**
 * A simple test to check if a DOM element is within the
 * vertical bounds of the container element.
 */
const isInViewport = (el: Element, container: Element) => {
  const containerBounds = container.getBoundingClientRect();
  const { top, bottom } = el.getBoundingClientRect();
  return (top <= containerBounds.bottom && bottom >= containerBounds.top);
}

export const useTrackViewport = <T extends Element>(props: UseInViewProps) => {

  const ref = useRef<T>(null);

  const startTracking = (targets: Element[]) => {

    const onIntersect = (entries: IntersectionObserverEntry[]) => {
      // Split entries into entered vs. left 
      const entriesEntered = entries.filter(e => e.isIntersecting);
      const entriesLeft = entries.filter(e => !e.isIntersecting);

      // Poor-mans garbage collection
      window.setTimeout(() => {
        const garbage = entriesEntered
          .filter(t => !isInViewport(t.target, ref.current.parentElement));

        if (garbage.length > 0 )
          props.onViewportChange({ 
            entered: [], 
            left: garbage.map(t => t.target)
          });
      }, 1000);

      props.onViewportChange({
        entered: entriesEntered.map(e => e.target),
        left: entriesLeft.map(e => e.target),
      });
    }

    // Init intersection observer
    const observer = new IntersectionObserver(onIntersect, {
      root: ref.current.parentElement
    });

    targets.forEach(p => observer.observe(p));
  }

  return { ref, startTracking };

}