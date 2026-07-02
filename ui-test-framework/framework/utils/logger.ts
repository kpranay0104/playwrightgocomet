/**
 * Minimal structured logger for the framework.
 *
 * Kept dependency-free on purpose (no winston/pino) so the framework has
 * zero extra runtime cost in CI. Swap the implementation here if you later
 * want file transports, log levels via env var, JSON output for a log
 * aggregator, etc. — every page object and test goes through this module,
 * so there's a single place to change.
 */

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'STEP';

function timestamp(): string {
  return new Date().toISOString();
}

function write(level: LogLevel, message: string, meta?: unknown): void {
  const base = `[${timestamp()}] [${level}] ${message}`;
  if (meta !== undefined) {
    // eslint-disable-next-line no-console
    console.log(base, typeof meta === 'string' ? meta : JSON.stringify(meta));
  } else {
    // eslint-disable-next-line no-console
    console.log(base);
  }
}

export const logger = {
  info: (message: string, meta?: unknown) => write('INFO', message, meta),
  warn: (message: string, meta?: unknown) => write('WARN', message, meta),
  error: (message: string, meta?: unknown) => write('ERROR', message, meta),
  debug: (message: string, meta?: unknown) => write('DEBUG', message, meta),
  /** Use for high-level test/page-object actions, e.g. logger.step('Logging in as admin') */
  step: (message: string, meta?: unknown) => write('STEP', message, meta),
};
