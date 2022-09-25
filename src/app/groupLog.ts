/* eslint-disable no-console */
export function groupLog<T>(message: string | string[], wrapped: () => T): T {
  console.groupCollapsed(message instanceof Array ? message.join(' ') :  message);
  try {
    const result = wrapped();
    if (result instanceof Promise) {
      void result
        .then(() => console.groupEnd())
        .catch(ex => {console.groupEnd(); console.error(ex);});
    } else {
      console.groupEnd();
    }
    return result;
  } catch (ex) {
    console.groupEnd();
    console.error(ex);
    throw ex;
  }
}
