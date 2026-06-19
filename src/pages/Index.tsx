import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { isDemoMode } from "@/lib/demo-mode";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BrandLogo from "@/components/BrandLogo";
import { MobileMenu } from "@/components/MobileMenu";
import { hardwareImages, getDepartmentImage } from "@/lib/hardware-images";
import { getCatalogDepartmentId } from "@/lib/catalog-departments";
import { mergeCompanyContact, formatFullAddress, whatsappUrl, type CompanyContactRow } from "@/lib/company-contact";
import {
  ShoppingBag,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Hammer,
  Paintbrush,
  Droplets,
  Zap,
  Home,
  TreePine,
  Truck,
  ShieldCheck,
  Users,
  BadgeDollarSign,
  ArrowRight,
  Mail,
} from "lucide-react";

const DEPARTMENTS = [
  { name: "Tools & Equipment", icon: Hammer, description: "Hand tools, power tools, and jobsite essentials" },
  { name: "Building Materials", icon: Home, description: "Cement, timber, fasteners, and structural supplies" },
  { name: "Plumbing", icon: Droplets, description: "Pipes, fittings, taps, and drainage" },
  { name: "Electrical", icon: Zap, description: "Cables, switches, lighting, and safety gear" },
  { name: "Paint & Finishes", icon: Paintbrush, description: "Interior, exterior, brushes, and prep" },
  { name: "Garden & Outdoor", icon: TreePine, description: "Garden tools, irrigation, and outdoor care" },
];

const Index = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<CompanyContactRow | null>(null);

  useEffect(() => {
    if (isDemoMode()) return;
    supabase
      .from("company_info")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setCompany(data));
  }, []);

  const contact = mergeCompanyContact(company);
  const location = formatFullAddress(contact);
  const weekdayHours = contact.weekdayHours;
  const saturdayHours = contact.saturdayHours;
  const sundayHours = contact.sundayHours;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="border-b border-navira-navy/20 bg-navira-navy text-sm text-white">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2 px-4 py-2">
          <div className="flex flex-wrap items-center gap-4 text-white/85">
            <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-navira-red" />
                <a href={`tel:${contact.phone1.replace(/\s/g, "")}`} className="hover:text-white">
                  {contact.phone1}
                </a>
              </span>
              <a
                href={whatsappUrl(contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white"
              >
                <MessageCircle className="h-3.5 w-3.5 text-navira-red" />
                WhatsApp
              </a>
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <Clock className="h-3.5 w-3.5 text-navira-red" />
              {weekdayHours}
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex items-center justify-between gap-2 px-4 py-3 sm:py-4">
          <button type="button" onClick={() => navigate("/")} className="min-w-0 shrink text-left">
            <BrandLogo size="sm" className="sm:hidden" />
            <BrandLogo size="md" className="hidden sm:flex" />
            <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">Build it right. Build it local.</p>
          </button>
          <nav className="hidden items-center gap-6 lg:flex">
            <button
              type="button"
              onClick={() => navigate("/shop/catalog")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Browse products
            </button>
            <a href="#departments" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Departments
            </a>
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Why Us
            </a>
            <Link to="/company-info" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </nav>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Button
              size="icon"
              className="bg-navira-red hover:bg-navira-red/90 text-white sm:hidden"
              onClick={() => navigate("/shop")}
              aria-label="Shop online"
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden sm:inline-flex md:hidden"
              onClick={() => navigate("/find-store")}
              aria-label="Find store"
            >
              <MapPin className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="hidden md:inline-flex" onClick={() => navigate("/find-store")}>
              <MapPin className="mr-2 h-4 w-4" />
              Find store
            </Button>
            <Button
              size="sm"
              className="hidden bg-navira-red hover:bg-navira-red/90 text-white sm:inline-flex"
              onClick={() => navigate("/shop")}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Shop online</span>
              <span className="md:hidden">Shop</span>
            </Button>
            <MobileMenu
              title="NAVIRA Hardware"
              items={[
                {
                  label: "Browse products",
                  onClick: () => navigate("/shop/catalog"),
                  icon: <ShoppingBag className="h-4 w-4" />,
                },
                {
                  label: "Shop online",
                  onClick: () => navigate("/shop"),
                  icon: <ShoppingBag className="h-4 w-4" />,
                },
                {
                  label: "Departments",
                  onClick: () => document.getElementById("departments")?.scrollIntoView({ behavior: "smooth" }),
                },
                {
                  label: "Why us",
                  onClick: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }),
                },
                {
                  label: "Find store (map)",
                  onClick: () => navigate("/find-store"),
                  icon: <MapPin className="h-4 w-4" />,
                },
                {
                  label: "Contact details",
                  onClick: () => navigate("/company-info"),
                },
              ]}
            />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[min(85vh,520px)] overflow-hidden border-b border-border">
        <img
          src={hardwareImages.hero}
          alt="Hardware tools and equipment at NAVIRA Hardware"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navira-navy/95 via-navira-navy/85 to-navira-navy/70" aria-hidden />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-28">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              Your neighborhood hardware store
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Everything you need to build, fix &amp; finish
            </h1>
            <p className="mb-8 text-lg text-hardware-light md:text-xl">
              From everyday repairs to full construction projects — quality products, fair prices, and people who know the trade.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button size="lg" className="w-full bg-navira-red hover:bg-navira-red/90 text-white sm:w-auto" onClick={() => navigate("/shop/catalog")}>
                Browse products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:w-auto"
                onClick={() => navigate("/find-store")}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Find store on map
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick trust strip */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
          {[
            { icon: Truck, label: "In-store pickup", sub: "Order online, collect today" },
            { icon: BadgeDollarSign, label: "Fair pricing", sub: "Honest value every day" },
            { icon: Users, label: "Expert advice", sub: "Talk to people who know tools" },
            { icon: ShieldCheck, label: "Trusted quality", sub: "Brands you can rely on" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="rounded-md bg-navira-navy/10 p-2">
                <Icon className="h-5 w-5 text-navira-red" />
              </div>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section id="departments" className="container mx-auto px-4 py-14 md:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Shop by department</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Walk our aisles in person or browse online — the same range of hardware for home, trade, and farm.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEPARTMENTS.map(({ name, icon: Icon, description }) => (
            <Card
              key={name}
              className="group cursor-pointer overflow-hidden border-border transition-all hover:border-navira-red/40 hover:shadow-md"
              onClick={() => navigate(`/shop/department/${getCatalogDepartmentId(name)}`)}
            >
              <img
                src={getDepartmentImage(name)}
                alt={name}
                className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <CardContent className="flex gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navira-navy/10 transition-colors group-hover:bg-navira-red/10">
                  <Icon className="h-5 w-5 text-navira-navy group-hover:text-navira-red" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-navira-red">{name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button size="lg" className="bg-navira-navy hover:bg-navira-navy/90" onClick={() => navigate("/shop/catalog?view=all")}>
            View all products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Why us */}
      <section id="about" className="border-y border-border bg-muted/20">
        <div className="container mx-auto grid items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Built for builders &amp; DIYers alike</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              NAVIRA HARDWARE has been serving our community with the supplies you need to get the job done — whether you are
              a contractor on a deadline or a homeowner fixing a leak on the weekend.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Wide range of tools, materials, and fixings under one roof",
                "Knowledgeable staff happy to help you choose the right product",
                "Competitive prices on everyday essentials",
                "Order online for convenience — we will have it ready",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-navira-red" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="space-y-4 p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-navira-red" />
                Store hours
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex flex-col gap-0.5 border-b border-border pb-2 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-muted-foreground">Weekdays</dt>
                  <dd className="font-medium sm:text-right">{weekdayHours}</dd>
                </div>
                <div className="flex flex-col gap-0.5 border-b border-border pb-2 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-muted-foreground">Saturday</dt>
                  <dd className="font-medium sm:text-right">{saturdayHours}</dd>
                </div>
                <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-muted-foreground">Sunday</dt>
                  <dd className="font-medium sm:text-right">{sundayHours}</dd>
                </div>
              </dl>
              <div className="pt-2">
                <p className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-navira-red" />
                  {location}
                </p>
                <Button variant="link" className="mt-2 h-auto p-0" onClick={() => navigate("/find-store")}>
                  View on Google Maps
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-navira-navy text-white">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-12 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Ready to start your project?</h2>
            <p className="mt-2 opacity-90">Shop online now or drop by the store — we are here to help.</p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-center gap-3">
            <Button size="lg" className="bg-navira-red hover:bg-navira-red/90 text-white" onClick={() => navigate("/shop")}>
              Shop online
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
              onClick={() => navigate("/company-info")}
            >
              Contact us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-3">
          <div>
            <BrandLogo size="sm" />
            <p className="mt-3 text-sm text-muted-foreground">
              Your local source for tools, building materials, and expert hardware advice.
            </p>
          </div>
          <div>
            <p className="font-semibold">Quick links</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <button type="button" className="hover:text-foreground" onClick={() => navigate("/shop/catalog")}>
                  Browse products
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-foreground" onClick={() => navigate("/shop")}>
                  Shop online
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-foreground" onClick={() => navigate("/find-store")}>
                  Find store (map)
                </button>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-navira-red" />
                {location}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-navira-red" />
                <span>
                  <a href={`tel:${contact.phone1.replace(/\s/g, "")}`} className="hover:text-foreground">
                    {contact.phone1}
                  </a>
                  {" · "}
                  <a href={`tel:${contact.phone2.replace(/\s/g, "")}`} className="hover:text-foreground">
                    {contact.phone2}
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 shrink-0 text-navira-red" />
                <a
                  href={whatsappUrl(contact.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  WhatsApp {contact.whatsapp}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-navira-red" />
                <span className="space-y-0.5">
                  <a href={`mailto:${contact.salesEmail}`} className="block hover:text-foreground">
                    {contact.salesEmail}
                  </a>
                  <a href={`mailto:${contact.generalEmail}`} className="block hover:text-foreground">
                    {contact.generalEmail}
                  </a>
                  <a href={`mailto:${contact.accountsEmail}`} className="block hover:text-foreground">
                    {contact.accountsEmail}
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} NAVIRA HARDWARE. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
