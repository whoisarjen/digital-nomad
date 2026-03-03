import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({
    adapter,
    log: ['error', 'warn', 'info'],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (!globalThis.prismaGlobal) {
  globalThis.prismaGlobal = prisma;
}

// @ts-expect-error BigInt is not serializable to JSON by default
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const getThresholdAsDate = (threshold: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - threshold);
  return date;
};

export const processInBatches = async <T>(
  items: T[],
  asyncFn: (item: T) => Promise<unknown>,
  batchSize = 50,
  isLogging = true,
): Promise<void> => {
  for (let i = 0; i < items.length; i += batchSize) {
    if (isLogging) {
      console.info(`processInBatches is working, left ${items.length - i}`);
    }
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(asyncFn));
  }
};
