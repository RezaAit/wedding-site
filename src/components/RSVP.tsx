'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './RSVP.module.css'

const RELATIONS = ['আত্মীয়','বন্ধু','সহকর্মী','প্রতিবেশী','শিক্ষক/ছাত্র','পরিচিত','অন্যান্য']
const GUEST_OPTIONS = ['১ জন','২ জন','৩ জন','৪ জন','৫ জন','৫+ জন']

function ThankYouPopup({ name, guests, onClose, onWhatsApp }:{
  name: string; guests: string; onClose: ()=>void; onWhatsApp: ()=>void
}) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={e => e.stopPropagation()}>

        {/* Floating confetti hearts */}
        <div className={styles.confetti}>
          {['🎊','💕','✨','🌸','💍','❤','🎉','💖','⭐','🌺'].map((h,i) => (
            <span key={i} className={styles.confettiItem}
              style={{ '--i': i, '--x': `${-40 + i*9}%` } as React.CSSProperties}>{h}</span>
          ))}
        </div>

        {/* Top shimmer bar */}
        <div className={styles.popupBar}/>

        <div className={styles.popupIconWrap}>
          <span className={styles.popupIcon}>✅</span>
          <span className={styles.popupRing}/>
          <span className={styles.popupRing2}/>
        </div>

        <h2 className={styles.popupTitle}>আপনার RSVP নিশ্চিত হয়েছে!</h2>
        <p className={styles.popupName}>{name}</p>

        <div className={styles.popupDetails}>
          <div className={styles.popupDetailItem}>
            <span>📅</span>
            <div>
              <strong>বৌ-ভাত</strong>
              <p>২৭ মার্চ ২০২৬ · দুপুর ১২:৩০</p>
            </div>
          </div>
          <div className={styles.popupDetailItem}>
            <span>👥</span>
            <div>
              <strong>অতিথি সংখ্যা</strong>
              <p>{guests}</p>
            </div>
          </div>
          <div className={styles.popupDetailItem}>
            <span>📍</span>
            <div>
              <strong>স্থান</strong>
              <p>হাওলাদার কমিউনিটি সেন্টার, ঠাকুরগাঁও</p>
            </div>
          </div>
        </div>

        <p className={styles.popupMsg}>
          আপনার আগমনের অপেক্ষায় রইলাম। আল্লাহ আপনাকে উত্তম প্রতিদান দিন। 🤲
        </p>

        <div className={styles.popupBtns}>
          <button className={styles.popupWaBtn} onClick={onWhatsApp}>
            💬 WhatsApp-এ নিশ্চিত করুন
          </button>
          <button className={styles.popupCloseBtn} onClick={onClose}>
            ✓ ঠিক আছে
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RSVP() {
  const [form, setForm] = useState({
    name: '', phone: '', guests: '1', relation: 'বন্ধু', message: ''
  })
  const [status, setStatus]   = useState<'idle'|'sending'|'error'>('idle')
  const [showPopup, setShowPopup] = useState(false)
  const [savedData, setSavedData] = useState({ name: '', guests: '' })

  function handle(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setStatus('sending')

    const guestLabel = GUEST_OPTIONS[parseInt(form.guests) - 1] || `${form.guests} জন`

    // Save to Supabase first
    const { error } = await supabase.from('rsvp').insert({
      name:     form.name.trim(),
      phone:    form.phone.trim(),
      guests:   parseInt(form.guests),
      relation: form.relation,
      message:  form.message.trim() || null,
    })

    if (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    // Save for popup
    setSavedData({ name: form.name.trim(), guests: guestLabel })

    // Reset form
    setForm({ name: '', phone: '', guests: '1', relation: 'বন্ধু', message: '' })
    setStatus('idle')

    // Show popup
    setShowPopup(true)
  }

  function sendWhatsApp() {
    const msg = encodeURIComponent(
      `আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু 🤲\n\n` +
      `রোকন ❤ ইভা\n\n` +
      `🎊 *RSVP — শুভ বিবাহ*\n\n` +
      `নাম: ${savedData.name}\n` +
      `অতিথি: ${savedData.guests}\n` +
      `অনুষ্ঠান: বৌ-ভাত, ২৭ মার্চ ২০২৬\n` +
      `স্থান: হাওলাদার কমিউনিটি সেন্টার, ঠাকুরগাঁও\n\n` +
      `ইনশাআল্লাহ উপস্থিত থাকব। 🤲`
    )
    window.open(`https://wa.me/8801719204590?text=${msg}`, '_blank')
  }

  return (
    <>
      <form className={styles.form} onSubmit={submit}>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>আপনার নাম *</label>
            <input
              name="name" required value={form.name} onChange={handle}
              placeholder="পূর্ণ নাম লিখুন"
              disabled={status === 'sending'}
            />
          </div>
          <div className={styles.field}>
            <label>মোবাইল নম্বর *</label>
            <input
              name="phone" required value={form.phone} onChange={handle}
              placeholder="01XXXXXXXXX"
              disabled={status === 'sending'}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>কতজন আসবেন?</label>
            <select name="guests" value={form.guests} onChange={handle} disabled={status === 'sending'}>
              {GUEST_OPTIONS.map((g, i) => (
                <option key={g} value={String(i+1)}>{g}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>সম্পর্ক</label>
            <select name="relation" value={form.relation} onChange={handle} disabled={status === 'sending'}>
              {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label>বার্তা (ঐচ্ছিক)</label>
          <textarea
            name="message" value={form.message} onChange={handle}
            rows={3} placeholder="আপনার শুভেচ্ছা বার্তা লিখুন..."
            disabled={status === 'sending'}
          />
        </div>

        <button type="submit" className={styles.btn} disabled={status === 'sending'}>
          {status === 'sending' ? '⏳ পাঠানো হচ্ছে...' :
           status === 'error'   ? '❌ সমস্যা হয়েছে, আবার চেষ্টা করুন' :
           '✅ RSVP নিশ্চিত করুন'}
        </button>
      </form>

      {showPopup && (
        <ThankYouPopup
          name={savedData.name}
          guests={savedData.guests}
          onClose={() => setShowPopup(false)}
          onWhatsApp={() => { sendWhatsApp(); setShowPopup(false) }}
        />
      )}
    </>
  )
}
