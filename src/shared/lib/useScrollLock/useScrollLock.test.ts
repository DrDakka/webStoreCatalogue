import { describe, it, expect, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollLock } from './useScrollLock';

afterEach(() => {
  document.body.classList.remove('scroll-lock');
});

describe('useScrollLock', () => {
  it('adds scroll-lock class when locked=true', () => {
    renderHook(() => useScrollLock(true));
    expect(document.body.classList.contains('scroll-lock')).toBe(true);
  });

  it('does not add scroll-lock class when locked=false', () => {
    renderHook(() => useScrollLock(false));
    expect(document.body.classList.contains('scroll-lock')).toBe(false);
  });

  it('removes scroll-lock class when locked changes from true to false', () => {
    const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
      initialProps: { locked: true },
    });
    expect(document.body.classList.contains('scroll-lock')).toBe(true);

    rerender({ locked: false });
    expect(document.body.classList.contains('scroll-lock')).toBe(false);
  });

  it('removes scroll-lock class on unmount', () => {
    const { unmount } = renderHook(() => useScrollLock(true));
    expect(document.body.classList.contains('scroll-lock')).toBe(true);

    unmount();
    expect(document.body.classList.contains('scroll-lock')).toBe(false);
  });
});
