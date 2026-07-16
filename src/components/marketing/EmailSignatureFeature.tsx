import { Mail, Check, Copy, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";

const signaturePros = [
  "Works perfectly with Gmail, Outlook, Apple Mail, and more",
  "One-click copy and paste to install",
  "Drives traffic directly to your digital business card",
  "Always stays up to date with your latest details",
];

export function EmailSignatureFeature() {
  return (
    <Section id="email-signature">
      <div className="relative mx-auto mt-16 grid max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-8">
        
        {/* ---------- Left side text ---------- */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand ring-1 ring-inset ring-brand/20 dark:bg-brand-500/10 dark:ring-brand-500/30">
            <Mail className="h-4 w-4" /> Email Signatures
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Turn every email into a networking opportunity
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Automatically generate a professional email signature that matches your digital business card. Stop sending plain text emails and start giving your contacts a beautiful way to save your details, view your services, and book meetings.
          </p>

          <ul className="mt-8 space-y-4">
            {signaturePros.map((pro) => (
              <li
                key={pro}
                className="flex items-start gap-3 text-base text-foreground"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {pro}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Right side mockup ---------- */}
        <div className="relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-border bg-surface-2 p-6 shadow-xl ring-1 ring-black/5 sm:p-8">
           {/* soft glow */}
           <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-brand opacity-20 blur-3xl" />
           
           <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <div className="text-xs font-medium text-muted">New Message</div>
           </div>

           <div className="space-y-4 pt-2">
             <div className="border-b border-border pb-2 text-sm text-muted">
               To: <span className="text-foreground">client@example.com</span>
             </div>
             <div className="border-b border-border pb-2 text-sm text-muted">
               Subject: <span className="text-foreground">Meeting Follow-up</span>
             </div>
             <div className="pt-2 text-sm text-foreground space-y-4">
               <p>Hi there,</p>
               <p>It was great speaking with you today. Let me know if you have any further questions!</p>
               <p>Best regards,</p>
               
               {/* Signature Mockup */}
               <div className="mt-6 flex items-start gap-4 border-l-2 border-brand pl-4">
                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-[var(--accent)] text-lg font-bold text-white shadow-sm">
                   AM
                 </div>
                 <div>
                   <p className="font-bold text-foreground">Aarav Mehta</p>
                   <p className="text-xs text-brand font-medium">Financial Advisor</p>
                   <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted">
                     <span>+91 98765 43210</span>
                     <span className="text-border">•</span>
                     <span>aarav@example.com</span>
                   </div>
                   <div className="mt-2 text-xs font-semibold text-brand flex items-center gap-1 hover:underline cursor-pointer">
                     View my Digital Card <ArrowRight className="h-3 w-3" />
                   </div>
                 </div>
               </div>
             </div>
           </div>
           
           <div className="mt-4 flex justify-end">
             <div className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm cursor-pointer hover:bg-brand-600 transition-colors">
               <Copy className="h-4 w-4" /> Copy Signature
             </div>
           </div>
        </div>
      </div>
    </Section>
  );
}
