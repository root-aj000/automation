// utils/scroll.ts
export function calculateScrollProgress(): number {
  if (typeof window === "undefined") return 0; // avoid SSR issues

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  return (scrollTop / docHeight) * 100;
}
