import { ArrowRight } from 'lucide-react';
import styles from './primitives.module.css';

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  /** Show a trailing arrow that points along the reading direction. */
  arrow?: boolean;
  className?: string;
};

export function ButtonLink({ href, children, variant = 'primary', arrow, className }: ButtonLinkProps) {
  const base = variant === 'primary' ? styles.button : styles.ghost;
  return (
    <a href={href} className={[base, className].filter(Boolean).join(' ')}>
      {children}
      {arrow && <ArrowRight aria-hidden size={18} className={`${styles.icon} ${styles.flip}`} />}
    </a>
  );
}
