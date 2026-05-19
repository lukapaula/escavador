import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { PrismaService } from "../../common/services/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async login(input: { email: string; password: string; twoFactorCode?: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.isActive) throw new UnauthorizedException("Credenciais inválidas");

    const valid = user.passwordHash.startsWith("$2")
      ? await bcrypt.compare(input.password, user.passwordHash)
      : createHash("sha256").update(input.password).digest("hex") === user.passwordHash;
    if (!valid) throw new UnauthorizedException("Credenciais inválidas");
    if (user.twoFactorEnabled && !input.twoFactorCode) throw new UnauthorizedException("2FA obrigatório");

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const refreshToken = randomBytes(48).toString("base64url");
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      }
    });

    return {
      accessToken: this.signAccess(user.id, user.email, user.role),
      refreshToken,
      user: { id: user.uuid, name: user.name, email: user.email, role: user.role }
    };
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
      include: { user: true }
    });
    if (!stored || !stored.user.isActive) throw new UnauthorizedException("Refresh token inválido");
    return { accessToken: this.signAccess(stored.user.id, stored.user.email, stored.user.role) };
  }

  private signAccess(sub: bigint, email: string, role: string) {
    return this.jwt.sign({ sub: Number(sub), email, role }, { secret: this.config.getOrThrow<string>("JWT_SECRET") });
  }

  private hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }
}
