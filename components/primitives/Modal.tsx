'use client';

import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import styles from './modal.module.css';

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Visually hide the title when the content provides its own heading. */
  hideTitle?: boolean;
  closeLabel: string;
  size?: 'medium' | 'wide' | 'full';
  dir: 'rtl' | 'ltr';
  children: React.ReactNode;
};

/** Accessible dialog on Base UI: focus trap, Escape to close, focus return. */
export function Modal({ open, onOpenChange, title, hideTitle, closeLabel, size = 'medium', dir, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={`${styles.popup} ${styles[size]}`} dir={dir}>
          <Dialog.Title className={hideTitle ? 'visually-hidden' : styles.title}>{title}</Dialog.Title>
          <Dialog.Close className={styles.close} aria-label={closeLabel}>
            <X size={20} aria-hidden />
          </Dialog.Close>
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
