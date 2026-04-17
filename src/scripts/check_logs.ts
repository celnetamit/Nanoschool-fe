import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- LATEST NOTIFICATION LOGS ---');
  const logs = await prisma.notificationLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' }
  });

  if (logs.length === 0) {
    console.log('No notification logs found.');
  } else {
    logs.forEach(log => {
      console.log(`[${log.createdAt.toISOString()}] ${log.type} to ${log.target} -> Status: ${log.status} ${log.error ? '| Error: ' + log.error : ''}`);
    });
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
