import {Action} from './Action';
import {LessonNameRow} from './LessonNameRow';
import {newQuestion} from '../app/actions';

export const LessonOverview = () =>
  <table>
    <tbody>
      <LessonNameRow/>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <Action action={() => newQuestion()}>Add</Action>
        </td>
      </tr>
    </tbody>
  </table>;

