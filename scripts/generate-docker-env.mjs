import { randomBytes } from 'crypto';
import { writeFile } from 'fs';
import { join } from 'path';
const generateId = () => randomBytes(16).toString('hex');
const dbPassword = generateId();
const envData = `
DATABASE_URL="mysql://registry:${dbPassword}@db:3306/registery-accounting-msg"

SESSION_SECRET="${generateId()}"
SESSION_MAX_AGE=3600000
SESSION_RESAVE=false
SESSION_SAVE_UNINITIALIZED=true

MYSQL_DATABASE="registery-accounting-msg"
MYSQL_USER=registry
MYSQL_PASSWORD="${dbPassword}"
`;

writeFile(join(process.cwd(), '.env'), envData, { flag: 'w' }, (err) =>
  err
    ? console.log(`env write err: ${err?.toString()}`)
    : console.log('.env has been written :)'),
);
