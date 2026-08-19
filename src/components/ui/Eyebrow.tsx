/**
 * Bilingual eyebrow label, the site's recurring identity device:
 * French first in lighter gold, then a dot, then English.
 */
export default function Eyebrow({ fr, en, className = "" }: { fr: string; en: string; className?: string }) {
  return (
    <p className={`eyebrow ${className}`}>
      <span className="fr" lang="fr">
        {fr}
      </span>
      <span aria-hidden="true"> · </span>
      {en}
    </p>
  );
}
