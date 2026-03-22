'use client'
import { useState, useEffect } from 'react'
import styles from './MusicPlayer.module.css'

// Global audio instance — shared with SplashScreen
let globalAudio: HTMLAudioElement | null = null

export function getOrCreateAudio(): HTMLAudioElement {
  if (!globalAudio) {
    globalAudio = new Audio('/WeddingNasheed.mp3')
    globalAudio.loop   = true
    globalAudio.volume = 0.8
  }
  return globalAudio
}

export default function MusicPlayer() {
  const [muted, setMuted]     = useState(false)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady]     = useState(false)

  useEffect(() => {
    const audio = getOrCreateAudio()

    function onPlay()  { setPlaying(true);  setReady(true) }
    function onPause() { setPlaying(false) }

    audio.addEventListener('play',  onPlay)
    audio.addEventListener('pause', onPause)

    // Check current state
    setPlaying(!audio.paused)
    setMuted(audio.muted)
    if (!audio.paused) setReady(true)

    // Show bar after 2s regardless
    const t = setTimeout(() => setReady(true), 2000)

    return () => {
      audio.removeEventListener('play',  onPlay)
      audio.removeEventListener('pause', onPause)
      clearTimeout(t)
    }
  }, [])

  function toggleMute() {
    const audio = getOrCreateAudio()
    audio.muted = !audio.muted
    setMuted(audio.muted)
    if (!audio.paused === false) audio.play().catch(()=>{})
  }

  function togglePlay() {
    const audio = getOrCreateAudio()
    if (audio.paused) { audio.play().catch(()=>{}) }
    else              { audio.pause() }
  }

  return (
    <div className={`${styles.bar} ${ready ? styles.barVisible : ''}`}>
      <div className={styles.iconWrap}>
        <span className={`${styles.note} ${playing && !muted ? styles.noteAnimate : ''}`}>🎵</span>
      </div>
      <div className={styles.info}>
        <span className={styles.title}>Wedding Nasheed</span>
        <span className={styles.sub}>{!playing?'Paused':muted?'🔇 Muted':'▶ Playing'}</span>
      </div>
      <button className={styles.btn} onClick={togglePlay}>{playing?'⏸':'▶'}</button>
      <button className={`${styles.btn} ${!muted?styles.btnActive:''}`} onClick={toggleMute}>
        {muted?'🔇':'🔊'}
      </button>
    </div>
  )
}
