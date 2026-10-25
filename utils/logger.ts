import fs from 'fs';
import path from 'path';

const LOG_FILE = path.resolve(__dirname, '..', 'logs', 'test-run.log');

type Level = 'INFO' | 'WARN' | 'ERROR';

const write = (level: Level, testName: string, message: string): void => {
  const line = `${new Date().toISOString()} [${level}] [${testName}] ${message}`;
  if (level === 'ERROR') console.error(line);
  else if (level === 'WARN') console.warn(line);
  else console.log(line);
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  fs.appendFileSync(LOG_FILE, `${line}\n`);
};

export const createLogger = (testName: string) => ({
  info: (message: string) => write('INFO', testName, message),
  warn: (message: string) => write('WARN', testName, message),
  error: (message: string) => write('ERROR', testName, message),
});

export type Logger = ReturnType<typeof createLogger>;
