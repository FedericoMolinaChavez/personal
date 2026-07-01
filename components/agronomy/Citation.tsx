export type Source = {
  marker: number;
  documentName: string;
  page: number | null;
  section: string | null;
  url: string | null;
};

export default function Citation({ source }: { source: Source }) {
  const label = `[${source.marker}] ${source.documentName}${
    source.page != null ? `, p.${source.page}` : ""
  }`;
  const cls =
    "inline-flex items-center gap-1 rounded-full border border-cmd-accent/30 bg-cmd-accent/10 px-2.5 py-1 font-mono text-label-sm text-cmd-accent transition-colors hover:bg-cmd-accent/20";
  return source.url ? (
    <a href={source.url} target="_blank" rel="noopener noreferrer" className={cls}>
      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
        open_in_new
      </span>
      {label}
    </a>
  ) : (
    <span className={cls.replace("hover:bg-cmd-accent/20", "")}>{label}</span>
  );
}
