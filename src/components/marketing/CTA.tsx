import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-14 text-center sm:px-16 sm:py-16">
          {/* one soft highlight, kept subtle */}
          <div className="pointer-events-none absolute inset-x-0 -top-1/2 h-full bg-[radial-gradient(40rem_20rem_at_50%_100%,rgba(255,255,255,0.18),transparent_70%)]" />

          <h2 className="relative mx-auto max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to make a memorable first impression?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-base text-white/85">
            Create your free digital business card today — no credit card, no app,
            no printing.
          </p>

          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink
              href="/signin"
              size="lg"
              className="bg-white text-brand hover:bg-white/90"
            >
              Create your card — free
            </ButtonLink>
            <ButtonLink
              href="/pricing"
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              See pricing
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
