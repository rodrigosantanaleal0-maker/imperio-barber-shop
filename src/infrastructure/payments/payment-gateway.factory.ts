import { createMockPaymentGateway } from "@/infrastructure/payments/providers/mock.provider";
import type { PaymentGateway } from "@/infrastructure/payments/gateway.interface";

/**
 * Único ponto de escolha de provider. Quando MERCADOPAGO_ACCESS_TOKEN existir,
 * plugar aqui um createMercadoPagoGateway() satisfazendo a mesma interface —
 * nenhum outro arquivo precisa mudar.
 */
export function getPaymentGateway(): PaymentGateway {
  return createMockPaymentGateway();
}
