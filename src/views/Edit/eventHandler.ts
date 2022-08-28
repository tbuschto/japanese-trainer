import {setProperty} from '../../app/actions';
import {InputHandler} from '../../app/InputHandler';

export const handleInputJapanese = InputHandler(value => setProperty('editJapanese', value));
export const handleInputReading = InputHandler(value => setProperty('editReading', value));
export const handleInputTranslation = InputHandler(value => setProperty('editTranslation', value));
export const handleInputLessonName = InputHandler(value => setProperty('inputLessonName', value));
