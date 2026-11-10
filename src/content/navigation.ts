import { routes } from "@/lib/routes";

export interface NavItem {
  label: string;
  href: string;
  index: string;
}

export const primaryNav: NavItem[] = [
  { label: "Home", href: routes.home, index: "01" },
  { label: "About", href: routes.about, index: "02" },
  { label: "Services", href: routes.services, index: "03" },
  { label: "Contact", href: routes.contact, index: "04" },
];

export const bookingNav: NavItem = { label: "Book a service", href: routes.booking, index: "05" };
