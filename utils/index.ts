const zip = (a: any[], b: any[]) => a.map((k, i) => [k, b[i]]);

export function zipWithIndex<T>(arr: T[]) {
  return arr.map((a, i) => [a, i]);
}

export function dropUntil<T>(data: T[], check: (T: any) => boolean): T[] {
  for (let i = 0; i < data.length; i++) {
    if (check(data[i])) {
      return data.slice(i);
    }
  }
  return [];
}
