import { MouseEvent, useEffect, useState } from 'react';
import { useSelectionState, useStore } from '../../../peripleo/state';
import { useTrackViewport } from './useTrackViewport';

import './TEITextView.css';

interface TEITextViewProps {

  tei: Element;

  onViewportChange(placenames: Element[]): void;

}

// Shorthand
const addClass = (id: string, cls: string) => {
  const elem = document.getElementById(id);

  if (elem)
    elem.classList.add(cls);
}

// Shorthand
const deselect = (root: Element) => {
  root.querySelectorAll('.p6o-tei-selected').forEach(elem => {
    elem.classList.remove('p6o-tei-selected');
    elem.classList.remove('p6o-tei-primary');
  });
}

export const TEITextView = (props: TEITextViewProps) => {

  const [selection, setSelection] = useSelectionState();

  const store = useStore();

  const [visible, setVisible] = useState<Element[]>([]);

  const onViewportChange = ({ entered, left}) =>
    setVisible(visible => ([
      ...visible.filter(el => !left.includes(el)),
      ...entered
    ]));

  const { ref, startTracking } = useTrackViewport<HTMLDivElement>({ onViewportChange });

  useEffect(() => {
    if (props.tei) {
      ref.current.appendChild(props.tei);

      const placeNames = Array.from(document.querySelectorAll('tei-body tei-placename'));
      startTracking(placeNames);
    }
  }, [props.tei])

  // Debounce viewport scroll event
  useEffect(() => {
    props.onViewportChange(visible);
  }, [visible, props.onViewportChange]);

  // Selection changed
  useEffect(() => {
    if (!store)
      return;

    deselect(ref.current);

    if (!selection)
      return; 

    const toSelect = store.getItemsAt(selection.id);
    toSelect.forEach(item => addClass(item.id, 'p6o-tei-selected'));
  }, [ store, selection ]);

  const onClick = (evt: MouseEvent) => {
    const el = evt.target as Element;
    const tagName = el?.tagName;

    if (tagName === 'TEI-PLACENAME') {
      deselect(ref.current);

      const placeId = el.getAttribute('ref');
      const place = placeId ? store.getPlaceById(placeId) : undefined;

      setSelection(place);
      
      el.classList.add('p6o-tei-selected', 'p6o-tei-primary');
    }
  }

  return (
    <div 
      ref={ref} 
      className="p6o-tei-content"
      onClick={onClick} />
  )

}