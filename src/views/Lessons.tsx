import {useSelector} from 'react-redux';
import {Action} from './Action';
import {DATA} from './styles';
import {createNewLesson, deleteLesson, editLesson, newQuiz} from '../app/actions';
import {useAppSelector as $} from '../app/hooks';
import {selectLesson, selectLessons} from '../app/selectors';

export function Lessons() {
  const lessons = $(selectLessons);
  return (
    <main>
      <table>
        <tbody>
          {lessons.map(lessonId =>
            <LessonRow lessonId={lessonId}/>
          )}
          <tr>
            <td>
              <Action action={() => createNewLesson()}>New</Action>
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
  const lesson = useSelector(selectLesson(lessonId));
  return (
    <tr>
      <td className={DATA}>
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
