/**
 * Location of a card's "pulse" document — a tiny counter that bumps every time
 * an analytics event is logged. The dashboard subscribes to it so it can
 * refresh in real time when a new visit lands, without the client ever reading
 * the (sensitive) analytics events themselves.
 *
 * Kept free of `server-only` so both the server writer and the client listener
 * can share the exact same path.
 */
export function pulseDocPath(cardSlug: string): [string, string, string, string] {
  return ["cards", cardSlug, "meta", "pulse"];
}
