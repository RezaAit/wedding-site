'use client'
import { useEffect, useRef, ReactNode } from 'react'

type Animation = 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'zoomIn' | 'zoomInUp' | 'flipInX'

interface Props {
  children: ReactNode
  animation?: Animation
  delay?: number
  duration?: number
  threshold?: number
}

export default function ScrollAnimation({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 1200,
  threshold = 0.15,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Initial hidden state
    el.style.opacity = '0'
    el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms cubic-bezier(0.22,1,0.36,1)`
    el.style.transitionDelay = `${delay}ms`
    el.style.willChange = 'opacity, transform'

    const setInitial = () => {
      switch (animation) {
        case 'fadeIn':       el.style.transform = 'none'; break
        case 'fadeInUp':     el.style.transform = 'translateY(70px)'; break
        case 'fadeInDown':   el.style.transform = 'translateY(-70px)'; break
        case 'fadeInLeft':   el.style.transform = 'translateX(-80px)'; break
        case 'fadeInRight':  el.style.transform = 'translateX(80px)'; break
        case 'zoomIn':       el.style.transform = 'scale(0.8)'; break
        case 'zoomInUp':     el.style.transform = 'scale(0.85) translateY(40px)'; break
        case 'flipInX':      el.style.transform = 'perspective(600px) rotateX(25deg)'; break
      }
    }
    setInitial()

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'none'
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [animation, delay, duration, threshold])

  return <div ref={ref}>{children}</div>
}
