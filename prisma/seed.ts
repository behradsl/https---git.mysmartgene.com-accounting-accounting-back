import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utilities/hash';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@something.com' },
    update: {
      name: 'admin',
      hashPassword: await hashPassword('123456'),
      position: 'ADMIN',
      email: 'admin@something.com',
      phoneNumber: '09121111111',
    },
    create: {
      name: 'admin',
      email: 'admin@something.com',
      hashPassword: await hashPassword('123456'),
      position: 'ADMIN',
      phoneNumber: '09121111111',
    },
  });

  const laboratories = [
    'آزمایشگاه ژن',
    'ایران فردا',
    'آزمایشگاه فروردین',
    'ایرانوم اهواز',
  ];

  for (const name of laboratories) {
    await prisma.laboratory.create({
      data: {
        name,
        type: 'LABORATORY', 
        code: Math.random().toString(36).substring(2, 10),
        address: 'Sample Address',
        contactName: 'Sample Contact',
        phoneNumber: '123456789',
        email: 'sample@example.com',
        paymentType: 'FORMAL', 
        accountManagerId: admin.id,
        UserIdCreatedBy: admin.id,
      },
    });
  }

  console.log('Admin and Laboratory tables seeded successfully');
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
