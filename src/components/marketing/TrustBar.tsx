import { Container } from "@/components/ui/Container";

const stats = [
  { value: "50%", label: "Cheaper than printed cards" },
  { value: "5 min", label: "To create & share" },
  { value: "0", label: "Apps to install" },
  { value: "100%", label: "Eco-friendly" },
];

export function TrustBar() {
  return (
    <div className="border-b border-border">
      <Container className="grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-bold text-foreground sm:text-3xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-muted sm:text-sm">{s.label}</p>
          </div>
        ))}
      </Container>
    </div>
  );
}
