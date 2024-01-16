const prisma = require('../lib/prisma');
const { hash } = require('bcrypt');

async function main() {
  const password = '1';
  const hashed = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashed,
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
