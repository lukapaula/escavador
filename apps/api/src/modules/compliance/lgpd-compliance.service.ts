import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class LgpdComplianceService {
  validateConsultation(input: { purpose?: string; legalBasis?: string; lgpdJustification?: string }) {
    if (!input.purpose || input.purpose.trim().length < 10) {
      throw new BadRequestException("Finalidade da consulta e obrigatoria e deve ser especifica.");
    }
    if (!input.legalBasis) {
      throw new BadRequestException("Base legal LGPD e obrigatoria.");
    }
    if (!input.lgpdJustification || input.lgpdJustification.trim().length < 20) {
      throw new BadRequestException("Justificativa LGPD detalhada e obrigatoria.");
    }
  }

  blockMassExport(total: number) {
    if (total > 100) throw new BadRequestException("Exportacao massiva bloqueada por politica LGPD.");
  }

  canViewSealedCase(role: string, secrecyLevel?: number | null) {
    if (!secrecyLevel) return true;
    return ["ADMIN", "COMPLIANCE", "LEGAL"].includes(role);
  }
}
