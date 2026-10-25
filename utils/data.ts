import fs from 'fs';
import path from 'path';

export const AUTH_DIR = path.resolve(__dirname, '..', '.auth');
export const AUTH_STATE_FILE = path.join(AUTH_DIR, 'user.json');
export const USER_DATA_FILE = path.join(AUTH_DIR, 'user-data.json');
export const UPLOAD_FILE = path.resolve(__dirname, '..', 'test-data', 'upload-sample.txt');

export interface SetupUser {
  email: string;
  password: string;
  name: string;
}

export const generateEmail = (prefix = 'user'): string =>
  `${prefix}.${Date.now()}.${Math.floor(Math.random() * 10000)}@example.com`;

export const parsePrice = (text: string): number => {
  const match = text.match(/\d+(?:\.\d+)?/);
  if (!match) throw new Error(`No number found in "${text}"`);
  return Number(match[0]);
};

export const saveSetupUser = (user: SetupUser): void => {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  fs.writeFileSync(USER_DATA_FILE, JSON.stringify(user, null, 2));
};

export const readSetupUser = (): SetupUser => {
  if (!fs.existsSync(USER_DATA_FILE)) {
    throw new Error(`${USER_DATA_FILE} not found. The "setup" project must run first.`);
  }
  return JSON.parse(fs.readFileSync(USER_DATA_FILE, 'utf-8')) as SetupUser;
};

export const removeSetupUser = (): void => {
  fs.rmSync(USER_DATA_FILE, { force: true });
};
