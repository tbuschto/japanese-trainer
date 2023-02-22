import {createNewLesson, deleteLesson, editLesson, newQuiz} from './lessonsActions';
import {Action} from '../../elements/Action';
import {CLASS_DATA} from '../../app/cssClassNames';
import {useAppSelector as $} from '../../app/hooks';
import {selectLesson, selectLessonNames} from '../../app/selectors';

export function Lessons() {
  const lessons = $(selectLessonNames);
  return (
    <main>
      <table>
        <tbody>
          {lessons.map(lessonId =>
            <LessonRow lessonId={lessonId} key={lessonId}/>
          )}
          <tr>
            <td>
              <Action action={() => createNewLesson('cardDeck')}>New Card Deck</Action>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <Action action={() => createNewLesson('cardCollection')}>New Card Collection</Action>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}

function LessonRow({lessonId}: {lessonId: string}) {
  const lesson = $(selectLesson(lessonId));
  return (
    <tr>
      <td className={CLASS_DATA}>
        {lesson.name}
      </td>
      <td>
        <Action action={() => newQuiz(lessonId)}>Quiz</Action>
      </td>
      <td>
        <Action action={() => editLesson(lessonId)}>Edit</Action>
      </td>
      <td>
        <Action action={() => deleteLesson(lessonId)}>Delete</Action>
      </td>
    </tr>
  );
}
