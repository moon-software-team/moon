export const milliseconds = (n: number) => n;
export const seconds = (n: number) => n * 1000;
export const minutes = (n: number) => n * 60 * seconds(1);
export const hours = (n: number) => n * 60 * minutes(1);
export const days = (n: number) => n * 24 * hours(24);
