import { PrismaClient, UserRole } from "@prisma/client";
import { createHash } from "node:crypto";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = createHash("sha256").update("ChangeMe123!").digest("hex");

  await prisma.user.upsert({
    where: { email: "admin@legalops.local" },
    update: {},
    create: {
      name: "Administrador LegalOps",
      email: "admin@legalops.local",
      passwordHash,
      role: UserRole.ADMIN,
      permissions: {
        persons: ["read", "write", "export"],
        companies: ["read", "write", "export"],
        audit: ["read"],
        admin: ["*"]
      },
      twoFactorEnabled: false
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
