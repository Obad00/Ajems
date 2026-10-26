import { Camera } from 'lucide-react'
import type { Photo } from '../content/photos'

type Props = {
  photo: Photo
  /** Tailwind aspect class, e.g. "aspect-[4/5]". */
  ratio?: string
  className?: string
  /** Light caption for dark backgrounds. */
  onDark?: boolean
}

/** A real photo when `photo.src` is set, otherwise a clean placeholder frame (no stock images). */
export function PhotoSlot({ photo, ratio = 'aspect-[4/5]', className = '', onDark = false }: Props) {
  return (
    <figure className={className}>
      {photo.src ? (
        <img src={photo.src} alt={photo.alt} className={`${ratio} w-full object-cover`} loading="lazy" />
      ) : (
        <div
          role="img"
          aria-label={`Emplacement photo : ${photo.alt}`}
          className={`${ratio} grid w-full place-items-center bg-navy-2 bg-[repeating-linear-gradient(135deg,rgb(255_255_255/0.06)_0_1px,transparent_1px_12px)]`}
        >
          <span className="flex flex-col items-center gap-2 text-white/80">
            <Camera aria-hidden className="size-7 text-gold" strokeWidth={1.5} />
            <span className="text-xs tracking-wide">Photo à venir</span>
          </span>
        </div>
      )}
      <figcaption className={`mt-2 text-xs ${onDark ? 'bg-navy/90 px-1.5 py-1 text-white/80' : 'text-muted'}`}>{photo.caption}</figcaption>
    </figure>
  )
}
