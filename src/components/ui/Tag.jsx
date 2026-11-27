/**
 * Tag / Badge — small label chip.
 *
 * Props:
 *   variant — 'green' | 'brown' | 'outline'
 */
export default function Tag({ variant = 'green', children, className = '' }) {
  return (
    <span className={`tag tag--${variant} ${className}`.trim()}>
      {children}
    </span>
  );
}
