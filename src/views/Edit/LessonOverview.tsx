import {LessonNameRow} from './LessonNameRow';
import {deleteCard, editCard, newCard} from './actions';
import {Action} from '../../elements/Action';
import {Label} from '../../elements/Label';
import {$} from '../../app/hooks';
import {selectCards} from '../../app/selectors';
import {Card} from '../../app/AppState';
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
    <span className={CLASS_NUMBER}>{index + ' )'}</span>
    <span className={CLASS_TITLE}>{card.japanese}</span>
  </td>
  <td>
    <Action id='editCard' action={() => editCard(index)}>Edit</Action>
    <span className='sep'>&nbsp;/</span>
  </td>
  <td>
    <Action action={() => deleteCard(index)}>Delete</Action>
  </td>
</tr>;

const NewCardRow = () => <tr>
  <td></td>
  <td></td>
  <td colSpan={2}>
    <Action action={() => newCard()}>New Card</Action>
  </td>
</tr>;
