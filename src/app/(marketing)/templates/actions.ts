"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getCardFromStore, saveCardToStore } from "@/lib/cards-store";
import { getTemplate } from "@/data/templates";
import { getCard } from "@/data/cards";
import { CardData } from "@/types/card";

export async function chooseTemplateAction(templateId: string): Promise<void> {
  const user = await getSession();
  if (!user) {
    redirect("/signin");
  }

  let card = await getCardFromStore(user.cardSlug);
  
  if (!card) {
    // Clone the template's demo card
    const template = getTemplate(templateId);
    const demoCard = getCard(template?.demoSlug || "");
    
    if (demoCard) {
      card = {
        ...demoCard,
        slug: user.cardSlug,
        name: user.name || demoCard.name,
        contact: {
          ...demoCard.contact,
          email: user.email || demoCard.contact?.email || "",
        }
      };
    } else {
      // Fallback empty card
      card = {
        slug: user.cardSlug,
        templateId,
        name: user.name || "",
        title: "",
        company: "",
        tagline: "",
        about: "",
        contact: { email: user.email || "" },
        socials: [],
        services: [],
        gallery: [],
      };
    }
  } else {
    // Update existing card's template
    card.templateId = templateId;
    const template = getTemplate(templateId);
    if (template) {
      card.accent = template.style.accent;
    }
  }

  await saveCardToStore(card);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/edit");
  redirect("/dashboard/edit?tab=content");
}
