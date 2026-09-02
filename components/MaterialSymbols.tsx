/**
 * Loads the Material Symbols icon font.
 *
 * Deliberately NOT in the root layout. The landing page draws its own icons
 * (components/dive/Icon.tsx), so shipping a render-blocking third-party
 * stylesheet on the site's most latency-sensitive route — cold outbound
 * traffic, one click from leaving — bought nothing. Every route that actually
 * renders `.material-symbols-outlined` includes this instead.
 *
 * React hoists the <link> into <head> from wherever it is rendered, and
 * de-duplicates it when more than one component on a page asks for it.
 */
export default function MaterialSymbols() {
  return (
    <link
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
      rel="stylesheet"
    />
  );
}
