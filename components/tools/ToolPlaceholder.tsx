/** Placeholder body shared by every not-yet-built tool page. */
export default function ToolPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="py-16">
      <p className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-3">
        Coming soon
      </p>
      <h1 className="font-display text-headline-lg font-extrabold text-on-surface mb-4">
        {title}
      </h1>
      <p className="max-w-2xl text-body-lg text-on-surface-variant">
        {description}
      </p>
    </section>
  );
}
