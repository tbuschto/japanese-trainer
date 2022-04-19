import * as readline from 'readline';

export const clear = () => write('\x1Bc');

export const writeln = (line: string) => write(line + '\n');

export const write = (text: string) => process.stdout.write(text);

export const readln = async () => {
  const rli = readline.createInterface(process.stdin, process.stdout);
  const result: string = await new Promise(resolve => rli.once('line', resolve));
  rli.close();
  return result;
};

export const readkey = async () => {
  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();
  const data: Buffer = await new Promise(resolve => stdin.once('data', resolve));
  stdin.pause();
  return String.fromCharCode(data[0]);
};
