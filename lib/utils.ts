import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkIsPublicPage() {
  // In client components, you can use usePathname() from 'next/navigation'
  // For server components, you can use headers() from 'next/headers'
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname
    console.log(pathname);
    
    return ['/auth/login', '/register', '/reset-password'].includes(pathname)
  }
  return false
}