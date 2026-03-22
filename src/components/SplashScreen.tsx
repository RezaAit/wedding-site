'use client'
import { useState, useEffect } from 'react'
import styles from './SplashScreen.module.css'
import { getOrCreateAudio } from './MusicPlayer'

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [closing, setClosing] = useState(false)

  // Show every time page loads

  function enter() {
    // Start music with volume on user click
    const audio = getOrCreateAudio()
    audio.muted  = false
    audio.volume = 0.8
    audio.play().catch(() => {})

    setClosing(true)
    setTimeout(() => {
      setVisible(false)
    }, 1000)
  }

  if (!visible) return null

  return (
    <div className={`${styles.splash} ${closing ? styles.closing : ''}`} onClick={enter}>

      {/* Animated background particles */}
      <div className={styles.particles}>
        {Array.from({length:16}).map((_,i) => (
          <span key={i} className={styles.particle}
            style={{ '--i':i, '--x':`${5+i*6}%`, '--s':`${0.5+(i%3)*0.4}`, '--d':`${(i%5)*1.2}s` } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Floating petals */}
      <div className={styles.petals}>
        {['🌸','🌹','💮','🌺','✨','💫','🌸','🌹','💮','🌺'].map((p,i) => (
          <span key={i} className={styles.petal}
            style={{ '--i':i, '--x':`${8+i*9}%`, '--fs':`${14+i%3*6}px` } as React.CSSProperties}
          >{p}</span>
        ))}
      </div>

      {/* Main content */}
      <div className={styles.content}>

        {/* Bismillah */}
        <p className={styles.bismillah}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>

        {/* Salam & Welcome */}
        <div className={styles.salamWrap}>
          <p className={styles.salam}>আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ 🤲</p>         
        </div>

        {/* Ornament */}
        <div className={styles.ornRow}>
          <span className={styles.ornLine}/>
          <span className={styles.ornStar}>✦</span>
          <span className={styles.ornLine}/>
        </div>

        {/* Big animated heart */}
        <div className={styles.heartWrap}>
          <span className={styles.heartBig}>❤</span>
          <span className={styles.ring1}/>
          <span className={styles.ring2}/>
          <span className={styles.ring3}/>
        </div>

        {/* Label */}
        <p className={styles.label}>শুভ বিবাহ অনুষ্ঠানে স্বাগতম</p>

        {/* Names */}
        <h1 className={styles.names}>
          <span className={styles.groomName}>মোঃ রোকন হাসান</span>
          <span className={styles.amp}>❤</span>
          <span className={styles.brideName}>জাকিয়া সুলতানা ইভা</span>
        </h1>

        {/* Date */}
        <div className={styles.dateRow}>
          <div className={styles.dateItem}>
            <span className={styles.dateIcon}>💍</span>
            <span>বিয়ে — ২৩ মার্চ ২০২৬</span>
          </div>
          <span className={styles.dateDot}>·</span>
          <div className={styles.dateItem}>
            <span className={styles.dateIcon}>🎊</span>
            <span>বৌ-ভাত — ২৭ মার্চ ২০২৬</span>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <span/><span className={styles.diamond}/><span className={styles.diamond}/><span className={styles.diamond}/><span/>
        </div>

        {/* Enter button */}
        <button className={styles.enterBtn} onClick={e => { e.stopPropagation(); enter(); }}>
          <span className={styles.enterBtnInner}>
            💍 শুভ বিবাহ
          </span>
          <span className={styles.enterBtnGlow}/>
        </button>

     

        {/* Tap anywhere hint */}
        <div className={styles.tapWrap}>
          <div className={styles.tapRing}/>
          <div className={styles.tapRing2}/>
          <div className={styles.tapRing3}/>
          <span className={styles.tapIcon}>👆</span>
        </div>
       

      </div>
    </div>
  )
}
