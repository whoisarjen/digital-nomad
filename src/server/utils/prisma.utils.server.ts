import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const prismaClientSingleton = () => {
  const connectionString = `${process.env.DATABASE_URL}`;

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);

  return new PrismaClient({
    adapter,
    log: ["error", "warn", "info"],
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (!globalThis.prismaGlobal) {
  globalThis.prismaGlobal = prisma
}

//@ts-expect-error It's existing
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const getThresholdAsDate = (threshold: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - threshold);

  return date
}

export const processInBatches = async <T>(
    items: T[],
    asyncFn: (item: T) => Promise<any>,
    batchSize = 50,
): Promise<void> => {
    for (let i = 0; i < items.length; i += batchSize) {
        console.info(`processInBatches is working, left ${items.length - i}`)
        const batch = items.slice(i, i + batchSize);
        await Promise.all(batch.map(asyncFn));
    }
}
