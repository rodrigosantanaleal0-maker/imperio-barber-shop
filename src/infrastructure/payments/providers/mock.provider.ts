import { randomUUID } from "node:crypto";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  NormalizedPaymentStatus,
  PaymentGateway,
} from "@/infrastructure/payments/gateway.interface";

/**
 * Provider mock para desenvolvimento sem credenciais reais de gateway.
 * Aprova instantaneamente. Trocar por um provider Mercado Pago (mesma
 * interface PaymentGateway) assim que houver Access Token/Public Key sandbox.
 */
export function createMockPaymentGateway(): PaymentGateway {
  return {
    providerName: "mock",

    async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
      const providerPaymentId = `mock_${randomUUID()}`;

      if (input.method === "pix") {
        return {
          providerPaymentId,
          status: "approved",
          pixQrCode: "00020126580014BR.GOV.BCB.PIX-MOCK-QR-CODE",
          pixQrCodeBase64:
            "data:image/svg+xml;base64," +
            Buffer.from(
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#F2EFE8"/><text x="100" y="104" text-anchor="middle" font-family="monospace" font-size="14" fill="#050505">PIX MOCK</text></svg>',
            ).toString("base64"),
        };
      }

      return { providerPaymentId, status: "approved" };
    },

    async getPaymentStatus(): Promise<NormalizedPaymentStatus> {
      return "approved";
    },
  };
}
