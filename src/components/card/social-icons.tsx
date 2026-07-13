import { Globe } from "lucide-react";
import type { SocialPlatform } from "@/types/card";
import {
  LinkedinIcon,
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  YoutubeIcon,
  WhatsappIcon,
} from "./brand-icons";

type IconComponent = (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;

export const socialIcon: Record<SocialPlatform, IconComponent> = {
  website: Globe as IconComponent,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
  whatsapp: WhatsappIcon,
};

export const socialLabel: Record<SocialPlatform, string> = {
  website: "Website",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  twitter: "Twitter",
  facebook: "Facebook",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
};
