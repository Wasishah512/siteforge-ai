
import { twMerge } from 'tailwind-merge'

// Minimal local replacement for `clsx` to avoid adding the dependency.
export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: any }
  | ClassValue[]

function clsx(...inputs: ClassValue[]) {
  const classes: string[] = []

  const handle = (val: ClassValue) => {
    if (!val) return
    if (typeof val === 'string' || typeof val === 'number') {
      classes.push(String(val))
      return
    }
    if (Array.isArray(val)) {
      val.forEach(handle)
      return
    }
    if (typeof val === 'object') {
      for (const key in val) {
        if (Object.prototype.hasOwnProperty.call(val, key) && (val as any)[key]) {
          classes.push(key)
        }
      }
    }
  }

  inputs.forEach(handle)
  return classes.join(' ')
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}
