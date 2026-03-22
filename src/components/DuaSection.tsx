'use client'
import { useState, useEffect } from 'react'
import { supabase, type Dua } from '@/lib/supabase'
import styles from './DuaSection.module.css'

const PAGE_SIZE = 10

const TEMPLATES = [
  'বারাকাল্লাহু লাকা, ওয়া বারাকা \'আলাইকা, ওয়া জামা\'আ বাইনাকুমা ফি খাইর।',
  'আল্লাহ তোমার জন্য বরকত দান করুন, তোমার ওপর বরকত নাযিল করুন এবং তোমাদের উভয়কে কল্যাণের মধ্যে একত্রিত রাখুন।',
  'আল্লাহ আপনাদের দাম্পত্য জীবনে ভালোবাসা, রহমত ও বরকত দান করুন।',
  'আপনাদের জীবন সুখ, শান্তি ও নেক সন্তানে পরিপূর্ণ হোক।',
  'আল্লাহ আপনাদেরকে একে অপরের জন্য দুনিয়া ও আখিরাতে কল্যাণের মাধ্যম বানান।',
]

const RELATIONS = ['আত্মীয়','বন্ধু','সহকর্মী','প্রতিবেশী','শিক্ষক/ছাত্র','পরিচিত','অন্যান্য']

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff/60000)
  if (m<1) return 'এইমাত্র'
  if (m<60) return `${m} মিনিট আগে`
  const h = Math.floor(m/60)
  if (h<24) return `${h} ঘণ্টা আগে`
  return `${Math.floor(h/24)} দিন আগে`
}

function ThankYouPopup({ name, onClose }: { name:string; onClose:()=>void }) {
  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popup} onClick={e=>e.stopPropagation()}>
        <div className={styles.popupHearts}>
          {['❤','💕','💖','💗','💝','✨','🌸','💫'].map((h,i)=>(
            <span key={i} className={styles.popupHeart} style={{'--i':i} as React.CSSProperties}>{h}</span>
          ))}
        </div>
        <div className={styles.popupIcon}>🤲</div>
        <h2 className={styles.popupTitle}>জাযাকাল্লাহু খাইরান</h2>
        <p className={styles.popupName}>{name}</p>
        <p className={styles.popupMsg}>আপনার দোয়া ও শুভেচ্ছা পেয়ে আমরা অত্যন্ত কৃতজ্ঞ।<br/>আল্লাহ আপনাকেও উত্তম প্রতিদান দিন। 🌸</p>
        <div className={styles.popupDua}>آمِيْن يَا رَبَّ الْعَالَمِيْن</div>
        <button className={styles.popupBtn} onClick={onClose}>✨ ধন্যবাদ</button>
      </div>
    </div>
  )
}

export default function DuaSection() {
  const [duas, setDuas]               = useState<Dua[]>([])
  const [form, setForm]               = useState({ name:'', relation:'বন্ধু', message:'' })
  const [status, setStatus]           = useState<'idle'|'sending'|'error'>('idle')
  const [loading, setLoading]         = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore]         = useState(false)
  const [offset, setOffset]           = useState(0)
  const [showThank, setShowThank]     = useState(false)
  const [submittedName, setSubmittedName] = useState('')
  const [activeTemplate, setActiveTemplate] = useState<number|null>(null)
  const [total, setTotal]             = useState(0)

  useEffect(() => {
    loadDuas(0, true)
    const interval = setInterval(() => loadDuas(0, false, true), 4000)
    return () => clearInterval(interval)
  }, [])

  async function loadDuas(from: number, replace: boolean, silent = false) {
    if (!silent) replace ? setLoading(true) : setLoadingMore(true)
    const { data, count } = await supabase
      .from('duas').select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE)
    if (data) {
      const items = data.slice(0, PAGE_SIZE)
      if (replace) {
        setDuas(items)
      } else {
        setDuas(prev => {
          const ids = new Set(prev.map(i=>i.id))
          return [...prev, ...items.filter(i=>!ids.has(i.id))]
        })
      }
      setHasMore(data.length > PAGE_SIZE)
      setOffset(from + items.length)
      if (count !== null) setTotal(count)
    }
    setLoading(false)
    setLoadingMore(false)
  }

  function handle(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function pickTemplate(idx: number) {
    setActiveTemplate(idx)
    setForm(f => ({ ...f, message: TEMPLATES[idx] }))
  }

  function clearTemplate() {
    setActiveTemplate(null)
    setForm(f => ({ ...f, message: '' }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()||!form.message.trim()) return
    setStatus('sending')
    const { error } = await supabase.from('duas').insert({
      name: `${form.name.trim()} (${form.relation})`,
      message: form.message.trim(),
    })
    if (error) { setStatus('error'); setTimeout(()=>setStatus('idle'),3000); return }
    setSubmittedName(form.name.trim())
    setForm({ name:'', relation:'বন্ধু', message:'' })
    setActiveTemplate(null)
    setStatus('idle')
    setShowThank(true)
    await loadDuas(0, true)
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={submit}>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <label>আপনার নাম *</label>
            <input name="name" required value={form.name} onChange={handle} placeholder="আপনার নাম লিখুন" disabled={status==='sending'}/>
          </div>
          <div className={styles.field}>
            <label>সম্পর্ক</label>
            <select name="relation" value={form.relation} onChange={handle} disabled={status==='sending'}>
              {RELATIONS.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.templateLabel}>দোয়ার template বেছে নিন অথবা নিজে লিখুন:</div>
        <div className={styles.templates}>
          {TEMPLATES.map((t,i)=>(
            <button key={i} type="button"
              className={`${styles.chip} ${activeTemplate===i?styles.chipActive:''}`}
              onClick={()=>activeTemplate===i?clearTemplate():pickTemplate(i)}>
              {activeTemplate===i?'✓ ':''} দোয়া {i+1}
            </button>
          ))}
          <button type="button" className={`${styles.chip} ${activeTemplate===null&&form.message?styles.chipActive:''}`} onClick={clearTemplate}>✏️ নিজে লিখুন</button>
        </div>

        {activeTemplate!==null && (
          <div className={styles.templatePreview}>
            <span className={styles.tpIcon}>📖</span>
            <p>{TEMPLATES[activeTemplate]}</p>
          </div>
        )}

        <div className={styles.field}>
          <label>{activeTemplate!==null?'দোয়া (edit করতে পারবেন)':'আপনার দোয়া ও শুভেচ্ছা *'}</label>
          <textarea name="message" required value={form.message} onChange={handle} rows={3}
            placeholder="দোয়া লিখুন অথবা উপরে template বেছে নিন..." disabled={status==='sending'}/>
        </div>

        <button type="submit" className={styles.btn} disabled={status==='sending'}>
          {status==='sending'?'⏳ পাঠানো হচ্ছে...':status==='error'?'❌ সমস্যা হয়েছে':'🤲 দোয়া পাঠান'}
        </button>
      </form>

      <div className={styles.duaList}>
        <h3 className={styles.listTitle}>
          💝 সকলের দোয়া ও শুভেচ্ছা
          {total > 0 && <span className={styles.count}>{total}</span>}
        </h3>

        {loading && <div className={styles.loader}><span className={styles.dot}/><span className={styles.dot}/><span className={styles.dot}/></div>}
        {!loading && duas.length===0 && <div className={styles.empty}>প্রথম দোয়াটি আপনিই দিন! 🤲</div>}

        {duas.map((d,i)=>(
          <div key={d.id} className={styles.duaCard} style={{ animationDelay:`${Math.min(i,5)*0.05}s` }}>
            <div className={styles.duaAvatar}>{d.name.charAt(0)}</div>
            <div className={styles.duaBody}>
              <div className={styles.duaHeader}>
                <span className={styles.duaName}>{d.name}</span>
                <span className={styles.duaTime}>{timeAgo(d.created_at)}</span>
              </div>
              <p className={styles.duaText}>{d.message}</p>
            </div>
          </div>
        ))}

        {hasMore && (
          <div className={styles.loadMoreWrap}>
            <button className={styles.loadMoreBtn} onClick={()=>loadDuas(offset,false)} disabled={loadingMore}>
              {loadingMore
                ? <><span className={styles.btnDot}/><span className={styles.btnDot}/><span className={styles.btnDot}/></>
                : '🤲 আরো দোয়া দেখুন'}
            </button>
          </div>
        )}
      </div>

      {showThank && <ThankYouPopup name={submittedName} onClose={()=>setShowThank(false)}/>}
    </div>
  )
}
