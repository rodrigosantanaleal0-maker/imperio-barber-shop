import type {
  Barber,
  ExperienceMedia,
  InstagramPost,
  NavLink,
  Service,
  Testimonial,
} from "@/domain/types/site";

const PLACEHOLDER = {
  scene: "/images/placeholder/scene.svg",
  portrait: "/images/placeholder/portrait.svg",
  detail: "/images/placeholder/detail.svg",
};

/**
 * Fonte única de conteúdo editável do site. Trocar aqui não exige mexer em componentes.
 * TODO: trocar o número de WhatsApp pelo real da barbearia antes de publicar.
 */
export const contact = {
  whatsappNumber: "5511999999999",
  bookingMessage: "Olá! Quero agendar um horário na Império Barber Shop.",
  phoneDisplay: "(11) 99999-9999",
  address: "Rua Augusta, 1200 — Consolação, São Paulo/SP",
  hours: "Seg a Sáb · 09h às 20h",
  instagramHandle: "@imperiobarbershop",
};

export function getWhatsAppLink(message = contact.bookingMessage) {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const navLinks: NavLink[] = [
  { label: "Experiência", href: "#experiencia" },
  { label: "Serviços", href: "#servicos" },
  { label: "Barbeiros", href: "#barbeiros" },
  { label: "Galeria", href: "#galeria" },
  { label: "Avaliações", href: "#avaliacoes" },
  { label: "Localização", href: "#localizacao" },
];

export const services: Service[] = [
  {
    id: "corte-imperial",
    category: "corte",
    name: "Corte Imperial",
    description: "Precisão, acabamento e personalidade em cada fio.",
    priceCents: 8000,
    durationMinutes: 45,
    image: PLACEHOLDER.scene,
  },
  {
    id: "barba",
    category: "barba",
    name: "Barba",
    description: "Desenho na navalha com toalha quente e óleo finalizador.",
    priceCents: 6000,
    durationMinutes: 30,
    image: PLACEHOLDER.detail,
  },
  {
    id: "corte-barba",
    category: "combo",
    name: "Corte + Barba",
    description: "O ritual completo: cabelo e barba em perfeita harmonia.",
    priceCents: 12000,
    durationMinutes: 70,
    image: PLACEHOLDER.scene,
  },
  {
    id: "acabamento",
    category: "acabamento",
    name: "Acabamento",
    description: "Contorno e nuca alinhados entre um corte e outro.",
    priceCents: 3500,
    durationMinutes: 20,
    image: PLACEHOLDER.detail,
  },
  {
    id: "sobrancelha",
    category: "sobrancelha",
    name: "Sobrancelha",
    description: "Design na navalha para um olhar mais expressivo.",
    priceCents: 2500,
    durationMinutes: 15,
    image: PLACEHOLDER.detail,
  },
  {
    id: "combo-imperio",
    category: "combo",
    name: "Combo Império",
    description: "Corte, barba e sobrancelha — a experiência completa.",
    priceCents: 15000,
    durationMinutes: 90,
    image: PLACEHOLDER.scene,
  },
];

export const barbers: Barber[] = [
  {
    id: "rafael-duarte",
    name: "Rafael Duarte",
    specialty: "Especialista em Fade",
    experienceYears: 8,
    rating: 4.9,
    image: PLACEHOLDER.portrait,
  },
  {
    id: "bruno-castro",
    name: "Bruno Castro",
    specialty: "Barba e navalha",
    experienceYears: 12,
    rating: 5.0,
    image: PLACEHOLDER.portrait,
  },
  {
    id: "diego-farias",
    name: "Diego Farias",
    specialty: "Cortes clássicos",
    experienceYears: 6,
    rating: 4.8,
    image: PLACEHOLDER.portrait,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    author: "Marcelo A.",
    service: "Combo Império",
    quote: "Entrei um cliente e saí sentindo que era outra pessoa. Atenção a cada detalhe.",
    rating: 5,
    avatar: PLACEHOLDER.portrait,
  },
  {
    id: "t2",
    author: "Felipe R.",
    service: "Corte Imperial",
    quote: "Ambiente impecável, barbeiros que realmente entendem de estilo.",
    rating: 5,
    avatar: PLACEHOLDER.portrait,
  },
  {
    id: "t3",
    author: "Thiago M.",
    service: "Barba",
    quote: "Virei cliente fixo. Precisão cirúrgica na navalha.",
    rating: 4,
    avatar: PLACEHOLDER.portrait,
  },
];

export const instagramPosts: InstagramPost[] = Array.from({ length: 8 }).map((_, index) => ({
  id: `insta-${index + 1}`,
  image: [PLACEHOLDER.scene, PLACEHOLDER.detail, PLACEHOLDER.portrait][index % 3],
  alt: "Império Barber Shop no Instagram",
  href: `https://instagram.com/${contact.instagramHandle.replace("@", "")}`,
}));

export const experienceMedia: ExperienceMedia[] = [
  { id: "salao", image: PLACEHOLDER.scene, caption: "O Salão", aspect: "wide" },
  { id: "instrumentos", image: PLACEHOLDER.detail, caption: "Instrumentos", aspect: "wide" },
  { id: "detalhe", image: PLACEHOLDER.detail, caption: "Detalhe", aspect: "tall" },
  { id: "ritual", image: PLACEHOLDER.scene, caption: "O Ritual", aspect: "wide" },
];
