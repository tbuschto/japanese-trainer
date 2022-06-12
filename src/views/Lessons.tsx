import {Action} from './Action';
import {createNewLesson} from '../app/actions';

export function Lessons() {
  return (
    <div>
      <table>
        <tr>
          <td>
            <Action action={createNewLesson()}>New Lesson</Action>
          </td>
        </tr>
      </table>
    </div>
  );
}
