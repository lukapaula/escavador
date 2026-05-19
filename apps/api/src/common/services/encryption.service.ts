import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

@Injectable()
export class EncryptionService {
  private readonly key: Buffer;
  private readonly keyVersion: string;

  constructor(config: ConfigService) {
    const rawKey = config.get<string>("ENCRYPTION_KEY") ?? "";
    this.key = rawKey.startsWith("base64-")
      ? Buffer.from(rawKey.replace("base64-", ""), "base64")
      : createHash("sha256").update(rawKey).digest();
    this.keyVersion = config.get<string>("ENCRYPTION_KEY_VERSION") ?? "v1";
  }

  encrypt(value?: string | null): string | null {
    if (!value) return null;
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.key, iv);
    const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return [this.keyVersion, iv.toString("base64"), tag.toString("base64"), encrypted.toString("base64")].join(":");
  }

  decrypt(payload?: string | null): string | null {
    if (!payload) return null;
    const [, iv, tag, data] = payload.split(":");
    const decipher = createDecipheriv("aes-256-gcm", this.key, Buffer.from(iv, "base64"));
    decipher.setAuthTag(Buffer.from(tag, "base64"));
    return Buffer.concat([decipher.update(Buffer.from(data, "base64")), decipher.final()]).toString("utf8");
  }

  hash(value?: string | null): string | null {
    if (!value) return null;
    return createHash("sha256").update(this.onlyDigits(value)).digest("hex");
  }

  maskCpf(value?: string | null): string | null {
    const digits = this.onlyDigits(value);
    if (digits.length !== 11) return value ?? null;
    return `${digits.slice(0, 3)}.***.***-${digits.slice(9)}`;
  }

  maskCnpj(value?: string | null): string | null {
    const digits = this.onlyDigits(value);
    if (digits.length !== 14) return value ?? null;
    return `${digits.slice(0, 2)}.***.***/****-${digits.slice(12)}`;
  }

  private onlyDigits(value?: string | null) {
    return (value ?? "").replace(/\D/g, "");
  }
}
