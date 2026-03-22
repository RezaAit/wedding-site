'use client'
import { useEffect, useState } from 'react'
import styles from './Countdown.module.css'

const TARGET = new Date('2026-03-23T00:00:00')

export default function Countdown() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0, done: false })

  useEffect(() => {
    function tick() {
      const diff = TARGET.getTime() - Date.now()
      if (diff <= 0) {
        setTime({ d: 0, h: 0, m: 0, s: 0, done: true })
        return
      }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        done: false,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (time.done) {
    return <div className={styles.done}>💍 আজই শুভ বিবাহ! রোকন ❤ ইভা</div>
  }

  const boxes = [
    { num: time.d, label: 'দিন' },
    { num: time.h, label: 'ঘণ্টা' },
    { num: time.m, label: 'মিনিট' },
    { num: time.s, label: 'সেকেন্ড' },
  ]

  return (
    <div className={styles.wrap}>
      {boxes.map(({ num, label }) => (
        <div key={label} className={styles.box}>
          <span className={styles.num}>{String(num).padStart(2, '0')}</span>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </div>
  )
}
