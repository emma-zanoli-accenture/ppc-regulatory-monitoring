/** Resolve after `ms` milliseconds — used to pace scripted "AI working" moments. */
export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
