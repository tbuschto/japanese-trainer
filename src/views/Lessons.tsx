import {Action} from './Action';
import {createNewLesson} from '../app/actions';

export function Lessons() {
  return (
    <main>
      <table>
        <tbody>
          <tr>
            <td>
              <Action action={() => createNewLesson()}>New Lesson</Action>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
