import { env } from '@/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const emit = (level: LogLevel, message: string, meta?: unknown): void => {
  if (!env.enableLogging && level !== 'error') {
    return;
  }

  const method = level === 'debug' ? 'log' : level;
  const tag = `[${env.environment}:${level}]`;

  if (meta === undefined) {
    // eslint-disable-next-line no-console
    console[method](`${tag} ${message}`);
    return;
  }

  // eslint-disable-next-line no-console
  console[method](`${tag} ${message}`, meta);
};

export const logger = {
  debug: (message: string, meta?: unknown): void => emit('debug', message, meta),
  info: (message: string, meta?: unknown): void => emit('info', message, meta),
  warn: (message: string, meta?: unknown): void => emit('warn', message, meta),
  error: (message: string, meta?: unknown): void => emit('error', message, meta),
};
