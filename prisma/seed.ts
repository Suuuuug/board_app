import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: "사용자1", pin: "1111" },
    { name: "사용자2", pin: "2222" },
    { name: "사용자3", pin: "3333" },
    { name: "사용자4", pin: "4444" },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { name: user.name },
      update: {},
      create: { id: crypto.randomUUID(), ...user },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
