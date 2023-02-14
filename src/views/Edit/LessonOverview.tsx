import {push} from 'connected-react-router';
import {LessonNameRow} from './LessonNameRow';
import {actions} from './editActions';
import {Action} from '../../elements/Action';
import {Label} from '../../elements/Label';
import {$} from '../../app/hooks';
import {selectCards} from '../../app/selectors';
import {Card, RootPath} from '../../app/AppState';
import {CLASS_NUMBER, CLASS_TITLE} from '../../app/cssClassNames';

export const LessonOverview = () => {
  const cards = $(selectCards);
  return (
    <table>
      <tbody>
        <LessonNameRow/>
        <CardsHeaderRow/>
        {
          cards.map((card, i) => <CardRow card={card} index={i} key={card.id}/>)
        }
        <NewCardRow/>
        <OtherLessonRow/>
      </tbody>
    </table>
  );
};

const CardsHeaderRow = () => <tr>
  <td>
    <Label>Cards:</Label>
  </td>
  <td></td>
  <td></td>
  <td></td>
</tr>;

const CardRow = ({card, index}: {card: Card, index: number}) => <tr>
  <td colSpan={2}>
    <span className={CLASS_NUMBER}>{index + 1} )</span>
    <span className={CLASS_TITLE}>{card.japanese}</span>
  </td>
  <td>
    <Action id='editCard' action={() => actions.editCard(index)}>Edit</Action>
    <span className='sep'>&nbsp;/</span>
  </td>
  <td>
    <Action action={() => actions.deleteCard(index)}>Delete</Action>
  </td>
</tr>;

const NewCardRow = () => <tr>
  <td></td>
  <td></td>
  <td colSpan={2}>
    <Action action={() => actions.editNewCard()}>New Card</Action>
  </td>
</tr>;

const OtherLessonRow = () => <tr>
  <td></td>
  <td></td>
  <td colSpan={2}>
    <Action action={() => push(RootPath.Lessons)}>Other Lessons</Action>
  </td>
</tr>;
