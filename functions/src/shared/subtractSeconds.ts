export const subtractSeconds = (date: Date, seconds: number): Date => {
  const a = new Date(date);
  a.setSeconds(date.getSeconds() - seconds);
  return a;
}
