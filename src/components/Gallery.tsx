'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './Gallery.module.css'

const PAGE_SIZE = 20
const PLACEHOLDERS = ['র','জা','প','বি','আ','স']
const BG = ['#7c3aed','#be185d','#b45309','#6d28d9','#0f766e','#9333ea']

export default function Gallery() {
  const [images, setImages]     = useState<{id:string;url:string;name:string}[]>([])
  const [active, setActive]     = useState<string|null>(null)
  const [loading, setLoading]   = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore]   = useState(false)
  const [offset, setOffset]     = useState(0)

  useEffect(() => {
    loadImages(0, true)
    const interval = setInterval(() => loadImages(0, false, true), 5000)
    return () => clearInterval(interval)
  }, [])

  async function loadImages(from: number, replace: boolean, silent = false) {
    if (!silent) replace ? setLoading(true) : setLoadingMore(true)
    const { data } = await supabase
      .from('media')
      .select('id, url, name')
      .eq('type', 'image')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE)          // fetch PAGE_SIZE+1 to detect hasMore
    if (data) {
      const items = data.slice(0, PAGE_SIZE)
      if (replace) {
        setImages(items)
      } else {
        setImages(prev => {
          const ids = new Set(prev.map(i => i.id))
          const merged = [...prev, ...items.filter(i => !ids.has(i.id))]
          return merged
        })
      }
      setHasMore(data.length > PAGE_SIZE)
      setOffset(from + items.length)
    }
    setLoading(false)
    setLoadingMore(false)
  }

  function loadMore() { loadImages(offset, false) }

  const showPlaceholders = !loading && images.length === 0

  return (
    <>
      {loading && (
        <div className={styles.loader}>
          <span className={styles.dot}/><span className={styles.dot}/><span className={styles.dot}/>
        </div>
      )}

      <div className={styles.grid}>
        {images.map(img => (
          <button key={img.id} className={styles.item} onClick={() => setActive(img.url)}>
            <img src={img.url} alt={img.name} className={styles.img} />
            <div className={styles.overlay}><span className={styles.caption}>{img.name}</span></div>
          </button>
        ))}
        {showPlaceholders && PLACEHOLDERS.map((letter, i) => (
          <button key={i} className={styles.item}>
            <div className={styles.placeholder} style={{ background: BG[i % BG.length] }}>
              <span className={styles.initial}>{letter}</span>
              <span className={styles.addHint}>ছবি যোগ করুন</span>
            </div>
          </button>
        ))}
      </div>

      {hasMore && (
        <div className={styles.loadMoreWrap}>
          <button className={styles.loadMoreBtn} onClick={loadMore} disabled={loadingMore}>
            {loadingMore
              ? <><span className={styles.btnDot}/><span className={styles.btnDot}/><span className={styles.btnDot}/></>
              : '📸 আরো ছবি দেখুন'}
          </button>
        </div>
      )}

      {active && (
        <div className={styles.lightbox} onClick={() => setActive(null)}>
          <button className={styles.close} onClick={() => setActive(null)}>✕</button>
          <div className={styles.lbInner} onClick={e => e.stopPropagation()}>
            <img src={active} className={styles.lbImg} alt="" />
          </div>
        </div>
      )}
    </>
  )
}
