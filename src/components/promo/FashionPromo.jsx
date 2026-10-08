import { useEffect, useRef } from 'react'

export default function FashionPromo() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Explicitly set the muted property before asking the browser to autoplay.
    video.muted = true
    video.defaultMuted = true

    const startPlayback = () => {
      if (document.visibilityState !== 'visible' || !video.paused) return
      video.play().catch(() => {
        // The hero's CSS background remains visible if browser autoplay is blocked.
      })
    }

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      startPlayback()
    } else {
      video.addEventListener('canplay', startPlayback, { once: true })
    }

    document.addEventListener('visibilitychange', startPlayback)
    return () => {
      video.removeEventListener('canplay', startPlayback)
      document.removeEventListener('visibilitychange', startPlayback)
    }
  }, [])

  return (
    <section className="hero-video-background" aria-hidden="true">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/ads/untitled-1.mp4" type="video/mp4" />
      </video>
    </section>
  )
}
