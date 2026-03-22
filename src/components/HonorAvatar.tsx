'use client'
import { useState } from 'react'
import styles from './HonorAvatar.module.css'

export default function HonorAvatar() {
  const [imgError, setImgError] = useState(false)

  return (
    <div className={styles.avatar}>
      {!imgError ? (
        <img
          src="/chacha.jpg"
          alt="মো: রুহুল আমিন"
          className={styles.photo}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={styles.emoji}>🎩</span>
      )}
    </div>
  )
}
