import { normalizeLegacyHtml } from "@/lib/legacy-html";

type LegacyHtmlProps = {
  html: string;
};

export function LegacyHtml({ html }: LegacyHtmlProps) {
  const normalized = normalizeLegacyHtml(html);

  return <div className="legacy-content" dangerouslySetInnerHTML={{ __html: normalized }} />;
}
