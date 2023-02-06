export function fromSemicolonList(str: string) {
  return str.split(';').map(item => item.trim());
}

export function toSemicolonList(list: string[]) {
  return list.join('; ').trim();
}
