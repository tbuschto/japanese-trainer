import {useEffect, useRef} from 'react';
import {actions, topMeanings} from './editActions';
import {$, useAppDispatch} from '../../app/hooks';
import {selectSelectedSuggestion} from '../../app/selectors';
import {JTDictReadingInfo} from '../../app/AppState';

export const SuggestionItem = ({info}: {info: JTDictReadingInfo}) => {
  const dispatch = useAppDispatch();
  const hasKanji = !!info.kanji?.length;
  const selected = $(selectSelectedSuggestion) === info ? 'selected' : '';
  const item = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (selected && item.current) {
      const el = item.current;
      const parent = el.parentElement;
      const portTopEdge = parent?.scrollTop || 0;
      const portBottomEdge = portTopEdge + (parent?.clientHeight || 0);
      const itemTopEdge = el.offsetTop - (parent?.offsetTop || 0);
      const itemBottomEdge = itemTopEdge + el.clientHeight;
      if (portTopEdge > itemTopEdge) {
        el.scrollIntoView();
      } else if (portBottomEdge < itemBottomEdge) {
        el.scrollIntoView(false);
      }
    }
  }, [selected]);
  return (
    <li ref={item} className={selected} onClick={() => dispatch(actions.fillDictEntry(info))}>
      <div className='info'>
        {hasKanji ? <KanjiInfo info={info}/> : <ReadingInfo info={info}/>}
        <br/>
        {topMeanings(info)}
      </div>
      <div className='enter'>↲</div>
    </li>
  );
};

const KanjiInfo = ({info}: {info: JTDictReadingInfo}) => <>
  <b>{info.kanji?.join(', ') || info.reading}</b><br/>
  <i>{info.reading}</i>
</>;

const ReadingInfo = ({info}: {info: JTDictReadingInfo}) => <b>{info.reading}</b>;
