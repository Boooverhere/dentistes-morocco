"use client";

import { Phone, MessageCircle } from "lucide-react";
import { incrementLead } from "./actions";

interface Props {
  dentistId: string;
  phone: string;
}

export function ContactButtons({ dentistId, phone }: Props) {
  const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}`;

  async function handleClick(href: string) {
    await incrementLead(dentistId);
    window.location.href = href;
  }

  return (
    <>
      <button
        onClick={() => handleClick(`tel:${phone}`)}
        className="flex w-full items-center gap-2.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
      >
        <Phone className="h-4 w-4" />
        {phone}
      </button>
      <button
        onClick={() => handleClick(whatsappUrl)}
        className="flex w-full items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </button>
    </>
  );
}
