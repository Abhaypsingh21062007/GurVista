/**
 * SectionHeader — Eyebrow + H2 + optional description block.
 *
 * Props:
 *   eyebrow      — small all-caps label above heading
 *   heading      — main section title (string or JSX)
 *   description  — paragraph text below heading
 *   align        — 'left' (default) | 'center'
 */
export default function SectionHeader({
  eyebrow,
  heading,
  description,
  align = 'left',
}) {
  return (
    <div
      className="section-header"
      style={align === 'center' ? { textAlign: 'center' } : undefined}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {heading && <h2>{heading}</h2>}
      {description && <p>{description}</p>}
    </div>
  );
}
