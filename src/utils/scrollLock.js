// Simple scroll lock utility with reference counting
// Ensures multiple components can request the page to be locked without
// clobbering each other's settings. Restores original overflow when count
// reaches zero.
let lockCount = 0;
let originalOverflow = '';

export function lockScroll() {
  try {
    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow || '';
      document.body.style.overflow = 'hidden';
      // also disable touchmove to be safe on mobile
      document.body.style.touchAction = 'none';
    }
    lockCount += 1;
  } catch (err) {
    // no-op in non-browser environments
    // console.warn('lockScroll failed', err);
  }
}

export function unlockScroll() {
  try {
    if (lockCount <= 0) return;
    lockCount -= 1;
    if (lockCount === 0) {
      document.body.style.overflow = originalOverflow || '';
      document.body.style.touchAction = '';
      originalOverflow = '';
    }
  } catch (err) {
    // no-op
  }
}

export function isLocked() {
  return lockCount > 0;
}
