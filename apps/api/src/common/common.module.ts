import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./services/prisma.service";
import { EncryptionService } from "./services/encryption.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtModule } from "@nestjs/jwt";

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [PrismaService, EncryptionService, JwtAuthGuard],
  exports: [PrismaService, EncryptionService, JwtAuthGuard]
})
export class CommonModule {}
