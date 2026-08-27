export interface NavLink {
  label: string;
  href: string;
}

export type ServiceCategory = "corte" | "barba" | "combo" | "acabamento" | "sobrancelha";

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  priceCents: number;
  durationMinutes: number;
  image: string;
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  image: string;
}

export interface Testimonial {
  id: string;
  author: string;
  service: string;
  quote: string;
  rating: number;
  avatar: string;
}

export interface InstagramPost {
  id: string;
  image: string;
  alt: string;
  href: string;
}

export interface ExperienceMedia {
  id: string;
  image: string;
  caption: string;
  aspect: "wide" | "tall";
}
