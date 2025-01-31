import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utilities/hash';
const prisma = new PrismaClient();
async function main() {
  const Admin = await prisma.user.upsert({
    where: { email: 'example@example.com' },
    update: {
      name: 'admin',
      hashPassword: await hashPassword('123456'),
      position: 'ADMIN',
      email:"admin@something.com",
      
      phoneNumber: '09121111111',
      
    },
    create: {
      name: 'admin',
      email: 'example@example.com',
      hashPassword: await hashPassword('123456'),
      position: 'ADMIN',
      phoneNumber: '09121111111',
      
      
    },
  });

  
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
