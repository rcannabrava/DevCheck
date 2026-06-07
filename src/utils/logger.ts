const isProduction = import.meta.env.VITE_APP_ENV === "production";

type LogArgs = readonly unknown[];

export const logger = {
  info(...args: LogArgs): void {
    if (isProduction) return;
    // eslint-disable-next-line no-console
    console.info(...args);
  },
  warn(...args: LogArgs): void {
    if (isProduction) return;
    // eslint-disable-next-line no-console
    console.warn(...args);
  },
  error(...args: LogArgs): void {
    if (isProduction) return;
    // eslint-disable-next-line no-console
    console.error(...args);
  },
};