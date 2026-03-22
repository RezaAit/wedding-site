'use client'
import { useState, useRef, useEffect } from 'react'
import { supabase, type MediaItem } from '@/lib/supabase'
import styles from './MediaUpload.module.css'

const PAGE_SIZE = 20

function getYouTubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export default function MediaUpload() {
  const [videoItems, setVideoItems]   = useState<MediaItem[]>([])
  const [urlInput, setUrlInput]       = useState('')
  const [urlError, setUrlError]       = useState('')
  const [active, setActive]           = useState<MediaItem|null>(null)
  const [dragOver, setDragOver]       = useState(false)
  const [uploading, setUploading]     = useState(false)
  const [uploadDone, setUploadDone]   = useState(false)
  const [loading, setLoading]         = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore]         = useState(false)
  const [offset, setOffset]           = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadVideos(0, true)
    const interval = setInterval(() => loadVideos(0, false, true), 5000)
    return () => clearInterval(interval)
  }, [])

  async function loadVideos(from: number, replace: boolean, silent = false) {
    if (!silent) replace ? setLoading(true) : setLoadingMore(true)
    const { data } = await supabase
      .from('media')
      .select('*')
      .in('type', ['video','youtube','facebook'])
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE)
    if (data) {
      const items = data.slice(0, PAGE_SIZE)
      if (replace) {
        setVideoItems(items)
      } else {
        setVideoItems(prev => {
          const ids = new Set(prev.map(i => i.id))
          return [...prev, ...items.filter(i => !ids.has(i.id))]
        })
      }
      setHasMore(data.length > PAGE_SIZE)
      setOffset(from + items.length)
    }
    setLoading(false)
    setLoadingMore(false)
  }

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return
    setUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: upErr } = await supabase.storage.from('wedding-media').upload(path, file, { cacheControl:'3600', upsert:false })
    if (upErr) { setUploading(false); alert('Upload failed: ' + upErr.message); return }
    const { data: urlData } = supabase.storage.from('wedding-media').getPublicUrl(path)
    const type = file.type.startsWith('image/') ? 'image' : 'video'
    await supabase.from('media').insert({ url: urlData.publicUrl, type, name: file.name })
    setUploading(false); setUploadDone(true)
    setTimeout(() => setUploadDone(false), 3000)
    if (type === 'video') loadVideos(0, true)
  }

  function handleFiles(files: FileList|null) {
    if (!files) return
    Array.from(files).forEach(uploadFile)
  }

  async function addUrl() {
    const u = urlInput.trim()
    if (!u) return
    setUrlError('')
    const ytId = getYouTubeId(u)
    let type: string, name: string
    if (ytId)                                             { type='youtube';  name='YouTube ভিডিও' }
    else if (u.includes('facebook.com')||u.includes('fb.watch')) { type='facebook'; name='Facebook ভিডিও' }
    else { setUrlError('শুধু YouTube বা Facebook ভিডিও লিংক দিন'); return }
    await supabase.from('media').insert({ url: u, type, name })
    setUrlInput('')
    loadVideos(0, true)
  }

  return (
    <div className={styles.wrap}>  

      <div
        className={`${styles.dropZone} ${dragOver?styles.dragOver:''} ${uploading?styles.uploading:''}`}
        onDragOver={e=>{e.preventDefault();setDragOver(true)}}
        onDragLeave={()=>setDragOver(false)}
        onDrop={e=>{e.preventDefault();setDragOver(false);handleFiles(e.dataTransfer.files)}}
        onClick={()=>!uploading&&fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept="image/*,video/*" multiple style={{display:'none'}} onChange={e=>handleFiles(e.target.files)}/>
        <div className={styles.dropIcon}>{uploading?'⏳':uploadDone?'✅':'📁'}</div>
        <p className={styles.dropText}>
          {uploading?'Upload হচ্ছে...':uploadDone?'সফলভাবে upload হয়েছে! Gallery-তে দেখুন':'ছবি বা ভিডিও drag করুন অথবা ক্লিক করুন'}
        </p>
        <p className={styles.dropSub}>JPG, PNG, MP4 সাপোর্ট করে</p>
      </div>

      <div className={styles.sectionLabel}>🎬 YouTube / Facebook ভিডিও যোগ করুন</div>
      <div className={styles.urlRow}>
        <input className={styles.urlInput} value={urlInput} onChange={e=>setUrlInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&addUrl()} placeholder="YouTube বা Facebook ভিডিও লিংক পেস্ট করুন..."/>
        <button className={styles.urlBtn} onClick={addUrl}>যোগ করুন</button>
      </div>
      {urlError && <p className={styles.error}>⚠️ {urlError}</p>}

      {loading && <div className={styles.loadRow}><span className={styles.dot}/><span className={styles.dot}/><span className={styles.dot}/></div>}
      {!loading && videoItems.length===0 && <p className={styles.emptyNote}>এখনো কোনো ভিডিও যোগ করা হয়নি</p>}

      {videoItems.length > 0 && (
        <div className={styles.grid}>
          {videoItems.map(item => (
            <div key={item.id} className={styles.card} onClick={()=>setActive(item)}>
              {item.type==='video' && <div className={styles.videoThumb}><video src={item.url} className={styles.thumb}/><div className={styles.playIcon}>▶</div></div>}
              {item.type==='youtube' && <div className={styles.videoThumb}><img src={`https://img.youtube.com/vi/${getYouTubeId(item.url)}/hqdefault.jpg`} alt="YouTube" className={styles.thumb}/><div className={styles.ytBadge}>▶ YouTube</div></div>}
              {item.type==='facebook' && <div className={styles.fbThumb}><span style={{fontSize:38}}>📘</span><p style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginTop:6}}>Facebook</p></div>}
              <p className={styles.cardName}>{item.name}</p>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className={styles.loadMoreWrap}>
          <button className={styles.loadMoreBtn} onClick={()=>loadVideos(offset,false)} disabled={loadingMore}>
            {loadingMore ? <><span className={styles.btnDot}/><span className={styles.btnDot}/><span className={styles.btnDot}/></> : '🎬 আরো ভিডিও দেখুন'}
          </button>
        </div>
      )}

      {active && (
        <div className={styles.lightbox} onClick={()=>setActive(null)}>
          <button className={styles.lbClose} onClick={()=>setActive(null)}>✕</button>
          <div className={styles.lbInner} onClick={e=>e.stopPropagation()}>
            {active.type==='video' && <video src={active.url} controls autoPlay className={styles.lbMedia}/>}
            {active.type==='youtube' && <iframe src={`https://www.youtube.com/embed/${getYouTubeId(active.url)}?autoplay=1`} className={styles.lbFrame} allowFullScreen allow="autoplay; encrypted-media"/>}
            {active.type==='facebook' && <iframe src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(active.url)}&autoplay=1`} className={styles.lbFrame} allowFullScreen allow="autoplay; encrypted-media"/>}
          </div>
        </div>
      )}
    </div>
  )
}
