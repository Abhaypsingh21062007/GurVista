/**
 * Button — Gurvista reusable button component.
 *
 * Props:
 *   variant  — 'primary' | 'secondary' | 'ghost-green' | 'ghost-brown' | 'ghost-ivory'
 *   size     — 'md' (default) | 'sm'
 *   as       — override element: 'a' | 'button' (default)
 *   href     — when as='a'
 *   ...rest  — any other HTML button/anchor attributes
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  href,
  children,
  className = '',
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'sm' ? 'btn--sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (Tag === 'a') {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
