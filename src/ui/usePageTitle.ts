import { useEffect } from 'react'

/** Sets the browser tab title: "<page> — AJEMS". */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} — AJEMS` : 'AJEMS — Alliance des Jeunes Entrepreneurs de Mermoz-Sacré-Cœur'
  }, [title])
}
