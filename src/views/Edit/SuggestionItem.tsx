import {useEffect, useRef} from 'react';
import {actions, topMeanings} from './editActions';
import {$, useAppDispatch} from '../../app/hooks';
import {selectSelectedSuggestion} from '../../app/selectors';
import {Candidate} from '../../app/AppState';

export const SuggestionItem = ({candidate}: {candidate: Candidate}) => {
  const dispatch = useAppDispatch();
  const selected = $(selectSelectedSuggestion) === candidate ? 'selected' : '';
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
    <li ref={item} className={selected}
        onClick={() => dispatch(actions.fillDictEntry(candidate))}>
      <div className='info'>
        {candidate.reading ? <KanjiWord candidate={candidate}/> : <KanaWord candidate={candidate}/>}
        <br/>
        {topMeanings(candidate)}
      </div>
      <div className='enter'>↲</div>
    </li>
  );
};

const KanjiWord = ({candidate}: {candidate: Candidate}) => <>
  <b>{candidate.japanese}</b><br/>
  <i>{candidate.reading}</i>
</>;

const KanaWord = ({candidate}: {candidate: Candidate}) => <b>{candidate.japanese}</b>;
