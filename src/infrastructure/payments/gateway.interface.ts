export type PaymentMethod = "pix" | "credit_card" | "deposit" | "local";
export type NormalizedPaymentStatus = "pending" | "approved" | "rejected" | "refunded";

export type CreatePaymentInput = {
  appointmentId: string;
  amountCents: number;
  method: PaymentMethod;
  description: string;
  payer: { name: string; email?: string };
};

export type CreatePaymentResult = {
  providerPaymentId: string;
  status: NormalizedPaymentStatus;
  pixQrCode?: string;
  pixQrCodeBase64?: string;
  checkoutUrl?: string;
};

/**
 * Interface estável do gateway. A implementação mock (Fase 1) e uma futura
 * implementação real (Mercado Pago, quando houver credenciais) satisfazem o
 * mesmo contrato — trocar o provider não exige mudar quem o consome.
 */
export type PaymentGateway = {
  readonly providerName: "mock" | "mercadopago";
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  getPaymentStatus(providerPaymentId: string): Promise<NormalizedPaymentStatus>;
};
