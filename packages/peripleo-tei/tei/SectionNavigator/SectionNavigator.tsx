import { useEffect, useRef, useState } from 'react';
import { useSearch, useSelectionValue } from '../../../peripleo/state';
import { Section } from './Section';
import { HistogramConfig, createRenderer } from './Histogram';
import { SectionPicker } from './SectionPicker';
import { TagFilter } from './TagFilter';

import './SectionNavigator.css';

interface SectionNavigatorProps {

  tei: Element;

  placesInViewport: Element[];

  histogramConfig?: HistogramConfig;

}

export const SectionNavigator = (props: SectionNavigatorProps) => {

  const { tei } = props;

  const { search } = useSearch();

  const selection = useSelectionValue();

  const canvas = useRef<HTMLCanvasElement>(null);

  const [sections, setSections] = useState<Section[]>([]); 

  const [renderer, setRenderer] = useState<ReturnType<typeof createRenderer>>(null);

  const [cursor, setCursor] = useState(-1);

  useEffect(() => {
    if (tei) {
      const divs = Array.from(tei.querySelectorAll('tei-div[subtype=section]'));

      const sections = divs.map(element => {
        const placenames = Array.from(element.querySelectorAll('tei-placename'));
        return { element , placenames };
      });

      setSections(sections);
    }    
  }, [tei]);

  useEffect(() => {
    if (sections) {
      const renderer = createRenderer(canvas.current, sections, props.histogramConfig);
      setRenderer(renderer);
      renderer.render();
    }
  }, [ sections /* currentIdx, props.filter, props.selected */ ]);

  useEffect(() => {
    if (renderer)
      renderer.render(cursor, search?.args.filters, selection);
  }, [renderer, cursor, search?.args?.filters, selection]);

  useEffect(() => {
    // Put the cursor at the first section in the viewport
    if (props.placesInViewport.length > 0) {
      const [ first, ] = props.placesInViewport;

      const section = first.closest('tei-div[subtype=section]');

      const cursor = sections.findIndex(s => s.element === section);
      setCursor(cursor); 
    }
  }, [ props.placesInViewport ]);

  const onHistogramClicked = (evt: React.MouseEvent) => {
    const { x, y } = (evt.target as Element).getBoundingClientRect();

    const offsetX = evt.clientX - x;
    const offsetY = evt.clientY - y;

    // TODO add a function to renderer that resolves this to a 
    // section, and then get chapter/section from the sections
    console.log(offsetX, offsetY);
  } 

  const onJumpTo = ({ chapter, section }) => {
    const chapterEl = tei.querySelector(`tei-div[subtype="chapter"][n="${chapter}"]`);
    if (chapterEl) {
      const sectionEl = chapterEl.querySelector(`tei-div[subtype="section"][n="${section}"]`);
      if (sectionEl) {
        window.setTimeout(() => 
          sectionEl.scrollIntoView({ behavior: 'smooth' }), 1);
      }
    }
  }

  return (
    <div className="p6o-teiview-nav">
      <div className="p6o-teiview-histogram">
        <canvas ref={canvas} onClick={onHistogramClicked} />
      </div>

      <div className="p6o-teiview-nav-bottom">
        <SectionPicker 
          cursor={cursor}
          sections={sections} 
          onJumpTo={onJumpTo}/>

        <TagFilter 
          placesInViewport={props.placesInViewport} />
      </div>
    </div>
  )

}