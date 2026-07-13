import type { CardData } from "@/types/card";

/**
 * Phase 1 demo cards (local seed data). One per template so the gallery can
 * link to a live preview. Access through the helpers below so Phase 2 can
 * replace this array with DB queries without changing callers.
 */
export const cards: CardData[] = [
  {
    slug: "aarav-mehta",
    templateId: "pro-clinic",
    accent: "#4f46e5",
    name: "Aarav Mehta",
    title: "Financial Advisor",
    company: "Mehta Wealth Partners",
    tagline: "Helping families grow & protect their wealth",
    about:
      "Certified financial planner with 12+ years of experience in mutual funds, insurance and retirement planning. I build simple, transparent plans that put your goals first.",
    logoText: "AM",
    avatarImage: "https://randomuser.me/api/portraits/men/32.jpg",
    coverImage: "https://picsum.photos/seed/aarav-cover/900/360",
    establishedYear: "2012",
    businessType: "Financial Services",
    contact: {
      phone: "+91 98200 12345",
      whatsapp: "919820012345",
      email: "aarav@mehtawealth.in",
      website: "https://mehtawealth.in",
      address: "204, Trade Centre, Bandra Kurla Complex, Mumbai 400051",
      mapUrl: "https://maps.google.com/?q=Bandra+Kurla+Complex+Mumbai",
    },
    socials: [
      { platform: "linkedin", url: "https://linkedin.com/in/aaravmehta" },
      { platform: "website", url: "https://mehtawealth.in" },
      { platform: "whatsapp", url: "https://wa.me/919820012345" },
    ],
    services: [
      {
        title: "Mutual Fund Planning",
        description: "Goal-based SIP portfolios reviewed every quarter.",
        price: "Free consult",
      },
      {
        title: "Retirement Planning",
        description: "Build a corpus that outlasts inflation.",
      },
      {
        title: "Term & Health Insurance",
        description: "Right cover, no mis-selling.",
      },
    ],
    gallery: [],
    payment: {
      upiId: "aaravmehta@okicici",
      bankName: "ICICI Bank",
      accountName: "Mehta Wealth Partners",
    },
  },
  {
    slug: "sara-khan",
    templateId: "crea-mono",
    accent: "#0f172a",
    name: "Sara Khan",
    title: "Product Designer",
    company: "Independent",
    tagline: "Design that feels obvious",
    about:
      "I design calm, usable products for early-stage startups — from first wireframe to shipped interface.",
    logoText: "SK",
    avatarImage: "https://randomuser.me/api/portraits/women/44.jpg",
    coverImage: "https://picsum.photos/seed/sara-cover/900/360",
    businessType: "Design",
    contact: {
      email: "hello@sarakhan.design",
      website: "https://sarakhan.design",
      whatsapp: "919812345678",
    },
    socials: [
      { platform: "website", url: "https://sarakhan.design" },
      { platform: "twitter", url: "https://twitter.com/sarakhan" },
      { platform: "instagram", url: "https://instagram.com/sara.designs" },
      { platform: "linkedin", url: "https://linkedin.com/in/sarakhan" },
    ],
    services: [
      { title: "Product & UX Design", description: "End-to-end interface design." },
      { title: "Design Systems", description: "Scalable, documented components." },
    ],
    gallery: [],
  },
  {
    slug: "meridian-labs",
    templateId: "biz-meridian",
    accent: "#0369a1",
    name: "Rohan Verma",
    title: "Director of Sales",
    company: "Meridian Labs Pvt. Ltd.",
    tagline: "Cloud & data engineering for growing teams",
    about:
      "Meridian Labs builds reliable cloud infrastructure, data pipelines and internal tools for mid-market companies across India and the Gulf.",
    logoText: "ML",
    avatarImage: "https://randomuser.me/api/portraits/men/46.jpg",
    coverImage: "https://picsum.photos/seed/meridian-cover/900/360",
    establishedYear: "2016",
    businessType: "IT Services · GSTIN 27ABCDE1234F1Z5",
    contact: {
      phone: "+91 44 4000 1234",
      whatsapp: "914440001234",
      email: "rohan@meridianlabs.io",
      website: "https://meridianlabs.io",
      address: "7th Floor, Olympia Tech Park, Guindy, Chennai 600032",
      mapUrl: "https://maps.google.com/?q=Olympia+Tech+Park+Chennai",
    },
    socials: [
      { platform: "linkedin", url: "https://linkedin.com/company/meridianlabs" },
      { platform: "website", url: "https://meridianlabs.io" },
      { platform: "twitter", url: "https://twitter.com/meridianlabs" },
    ],
    services: [
      {
        title: "Cloud Migration",
        description: "Lift-and-shift or re-architect to AWS / Azure.",
        price: "From ₹1,50,000",
      },
      {
        title: "Data Engineering",
        description: "ETL, warehousing and dashboards.",
        price: "Custom quote",
      },
      {
        title: "Managed DevOps",
        description: "CI/CD, monitoring and 24×7 support.",
        price: "₹60,000 / mo",
      },
    ],
    gallery: [
      { src: "https://picsum.photos/seed/ml1/500/500", alt: "Data centre" },
      { src: "https://picsum.photos/seed/ml2/500/500", alt: "Team at work" },
      { src: "https://picsum.photos/seed/ml3/500/500", alt: "Office" },
    ],
    payment: {
      upiId: "pay@meridianlabs",
      bankName: "HDFC Bank",
      accountName: "Meridian Labs Pvt Ltd",
      accountNumber: "50100XXXXXX234",
      ifsc: "HDFC0000123",
    },
  },
  {
    slug: "dr-nadia-rao",
    templateId: "pro-verdant",
    accent: "#047857",
    name: "Dr. Nadia Rao",
    title: "Dermatologist · MBBS, MD",
    company: "GlowSkin Clinic",
    tagline: "Healthy skin, backed by science",
    about:
      "Consultant dermatologist with 10 years of clinical experience in medical and cosmetic dermatology. Appointments available six days a week.",
    logoText: "NR",
    avatarImage: "https://randomuser.me/api/portraits/women/68.jpg",
    coverImage: "https://picsum.photos/seed/glow-cover/900/360",
    establishedYear: "2015",
    businessType: "Healthcare · Dermatology",
    contact: {
      phone: "+91 80 2233 4455",
      whatsapp: "918022334455",
      email: "care@glowskinclinic.in",
      website: "https://glowskinclinic.in",
      address: "12, Indiranagar 100ft Road, Bengaluru 560038",
      mapUrl: "https://maps.google.com/?q=Indiranagar+Bengaluru",
    },
    socials: [
      { platform: "instagram", url: "https://instagram.com/glowskinclinic" },
      { platform: "website", url: "https://glowskinclinic.in" },
      { platform: "whatsapp", url: "https://wa.me/918022334455" },
    ],
    services: [
      { title: "Acne & Scar Treatment", description: "Personalised, dermatologist-led plans." },
      { title: "Laser & Pigmentation", description: "Advanced, safe laser therapy." },
      { title: "Anti-Ageing", description: "Botox, fillers and skin boosters." },
    ],
    gallery: [
      { src: "https://picsum.photos/seed/glow1/500/500", alt: "Clinic reception" },
      { src: "https://picsum.photos/seed/glow2/500/500", alt: "Treatment room" },
    ],
    payment: {
      upiId: "glowskin@okhdfcbank",
    },
  },
  {
    slug: "pixel-forge",
    templateId: "crea-nova",
    accent: "#6d28d9",
    name: "Kabir Nair",
    title: "Founder & Creative Director",
    company: "Pixel Forge Studio",
    tagline: "Brands, websites & motion that convert",
    about:
      "A boutique creative studio crafting bold brand identities, high-converting websites and scroll-stopping motion for ambitious startups.",
    logoText: "PF",
    avatarImage: "https://randomuser.me/api/portraits/men/15.jpg",
    coverImage: "https://picsum.photos/seed/pixel-cover/900/360",
    establishedYear: "2019",
    businessType: "Creative Studio",
    contact: {
      phone: "+91 99999 88888",
      whatsapp: "919999988888",
      email: "studio@pixelforge.co",
      website: "https://pixelforge.co",
      address: "Remote-first · Bengaluru, India",
    },
    socials: [
      { platform: "instagram", url: "https://instagram.com/pixelforge" },
      { platform: "youtube", url: "https://youtube.com/@pixelforge" },
      { platform: "website", url: "https://pixelforge.co" },
      { platform: "linkedin", url: "https://linkedin.com/company/pixelforge" },
    ],
    services: [
      {
        title: "Brand Identity",
        description: "Logo, system & guidelines.",
        price: "From ₹80,000",
      },
      {
        title: "Website Design & Build",
        description: "Design + Next.js development.",
        price: "From ₹1,20,000",
      },
      {
        title: "Motion & Reels",
        description: "Launch films and social motion.",
        price: "From ₹40,000",
      },
    ],
    gallery: [
      { src: "https://picsum.photos/seed/pf1/500/500", alt: "Brand identity project" },
      { src: "https://picsum.photos/seed/pf2/500/500", alt: "Website design project" },
      { src: "https://picsum.photos/seed/pf3/500/500", alt: "Motion design project" },
      { src: "https://picsum.photos/seed/pf4/500/500", alt: "Packaging project" },
      { src: "https://picsum.photos/seed/pf5/500/500", alt: "Editorial layout" },
      { src: "https://picsum.photos/seed/pf6/500/500", alt: "Product photography" },
    ],
    youtubeVideos: [
      "https://youtu.be/aqz-KE-bpKQ",
      "https://youtu.be/ScMzIvxBSi4",
      "https://youtu.be/9bZkp7q19f0",
    ],
    payment: {
      upiId: "pixelforge@okaxis",
    },
  },
  {
    slug: "urban-threads",
    templateId: "shop-market",
    accent: "#ea580c",
    name: "Neha Kapoor",
    title: "Founder",
    company: "Urban Threads",
    tagline: "Everyday fashion, delivered to your door.",
    about:
      "A homegrown clothing label bringing you comfortable, affordable and trendy everyday wear. Free shipping across India on orders above ₹999.",
    logoText: "UT",
    avatarImage: "https://randomuser.me/api/portraits/women/65.jpg",
    coverImage: "https://picsum.photos/seed/urban-store/900/500",
    establishedYear: "2021",
    businessType: "Fashion & Apparel",
    contact: {
      phone: "+91 90000 45678",
      whatsapp: "919000045678",
      email: "orders@urbanthreads.in",
      website: "https://urbanthreads.in",
      address: "Shop 14, Linking Road, Bandra West, Mumbai 400050",
      mapUrl: "https://maps.google.com/?q=Linking+Road+Bandra",
    },
    socials: [
      { platform: "instagram", url: "https://instagram.com/urbanthreads" },
      { platform: "website", url: "https://urbanthreads.in" },
      { platform: "whatsapp", url: "https://wa.me/919000045678" },
    ],
    services: [
      {
        title: "Oversized Cotton Tee",
        description: "100% cotton · unisex",
        price: "₹799",
        image: "https://picsum.photos/seed/ut-tee/500/500",
      },
      {
        title: "Classic Denim Jacket",
        description: "Mid-wash · all sizes",
        price: "₹2,499",
        image: "https://picsum.photos/seed/ut-denim/500/500",
      },
      {
        title: "Floral Summer Dress",
        description: "Breezy & light",
        price: "₹1,299",
        image: "https://picsum.photos/seed/ut-dress/500/500",
      },
      {
        title: "Everyday Sneakers",
        description: "Cushioned sole",
        price: "₹1,999",
        image: "https://picsum.photos/seed/ut-shoes/500/500",
      },
    ],
    gallery: [
      { src: "https://picsum.photos/seed/ut-g1/500/500", alt: "Lookbook 1" },
      { src: "https://picsum.photos/seed/ut-g2/500/500", alt: "Lookbook 2" },
      { src: "https://picsum.photos/seed/ut-g3/500/500", alt: "Lookbook 3" },
    ],
    payment: {
      upiId: "urbanthreads@okhdfcbank",
      bankName: "HDFC Bank",
      accountName: "Urban Threads",
    },
  },
  {
    slug: "arjun-rao",
    templateId: "me-aura",
    accent: "#7c3aed",
    name: "Arjun Rao",
    title: "Content Creator",
    company: "",
    tagline: "Tech, travel and everyday stories. Let’s connect ✨",
    about:
      "Sharing honest tech reviews, travel vlogs and behind-the-scenes from the road. 250k+ across platforms.",
    logoText: "AR",
    avatarImage: "https://randomuser.me/api/portraits/men/13.jpg",
    businessType: "Creator",
    contact: {
      phone: "+91 98765 43210",
      whatsapp: "919876543210",
      email: "hello@arjunrao.me",
      website: "https://arjunrao.me",
    },
    socials: [
      { platform: "instagram", url: "https://instagram.com/arjunrao" },
      { platform: "youtube", url: "https://youtube.com/@arjunrao" },
      { platform: "twitter", url: "https://twitter.com/arjunrao" },
      { platform: "website", url: "https://arjunrao.me" },
    ],
    services: [],
    gallery: [],
    payment: {
      upiId: "arjunrao@okicici",
    },
  },
];

export function getCard(slug: string): CardData | undefined {
  return cards.find((c) => c.slug === slug);
}

export function getAllCardSlugs(): string[] {
  return cards.map((c) => c.slug);
}
