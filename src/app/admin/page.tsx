'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './admin.module.css'

const ADMIN_PASSWORD = 'rokon2026'

type RSVPRow = { id:string; name:string; phone:string; guests:number; relation:string; message:string|null; created_at:string }
type DuaRow  = { id:string; name:string; message:string; created_at:string }
type MediaRow= { id:string; url:string; type:string; name:string; created_at:string }
type Tab = 'rsvp' | 'dua' | 'media'

export default function AdminPage() {
  const [authed, setAuthed]   = useState(false)
  const [pass, setPass]       = useState('')
  const [error, setError]     = useState('')
  const [tab, setTab]         = useState<Tab>('rsvp')
  const [rsvps, setRsvps]     = useState<RSVPRow[]>([])
  const [duas, setDuas]       = useState<DuaRow[]>([])
  const [media, setMedia]     = useState<MediaRow[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch]   = useState('')
  const [deleting, setDeleting] = useState<string|null>(null)
  const [confirmId, setConfirmId] = useState<string|null>(null)
  const [confirmType, setConfirmType] = useState<Tab|null>(null)

  function login(e: React.FormEvent) {
    e.preventDefault()
    if (pass === ADMIN_PASSWORD) { setAuthed(true); setError(''); loadData() }
    else { setError('পাসওয়ার্ড সঠিক নয়!'); setPass('') }
  }

  async function loadData() {
    setLoading(true)
    const [{ data: r }, { data: d }, { data: m }] = await Promise.all([
      supabase.from('rsvp').select('*').order('created_at', { ascending: false }),
      supabase.from('duas').select('*').order('created_at', { ascending: false }),
      supabase.from('media').select('*').order('created_at', { ascending: false }),
    ])
    if (r) setRsvps(r)
    if (d) setDuas(d)
    if (m) setMedia(m)
    setLoading(false)
  }

  async function deleteRow(id: string, table: string) {
    setDeleting(id)
    if (table === 'media') {
      // Also delete from storage if image
      const item = media.find(m => m.id === id)
      if (item && item.type === 'image') {
        const path = item.url.split('/wedding-media/')[1]
        if (path) await supabase.storage.from('wedding-media').remove([path])
      }
    }
    await supabase.from(table).delete().eq('id', id)
    setDeleting(null)
    setConfirmId(null)
    setConfirmType(null)
    loadData()
  }

  function formatDate(str: string) {
    return new Date(str).toLocaleString('bn-BD', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
  }
  function totalGuests() { return rsvps.reduce((s,r) => s + (r.guests||1), 0) }

  function exportCSV(type: Tab) {
    let header='', rows: string[] = []
    if (type==='rsvp') {
      header = 'নাম,ফোন,অতিথি,সম্পর্ক,বার্তা,সময়'
      rows = rsvps.map(r => `"${r.name}","${r.phone}","${r.guests}","${r.relation||''}","${r.message||''}","${formatDate(r.created_at)}"`)
    } else if (type==='dua') {
      header = 'নাম,দোয়া,সময়'
      rows = duas.map(d => `"${d.name}","${d.message}","${formatDate(d.created_at)}"`)
    } else {
      header = 'নাম,ধরন,URL,সময়'
      rows = media.map(m => `"${m.name}","${m.type}","${m.url}","${formatDate(m.created_at)}"`)
    }
    const blob = new Blob(['\uFEFF' + header + '\n' + rows.join('\n')], { type:'text/csv;charset=utf-8;' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = `${type}-list.csv`; a.click()
  }

  const filteredRsvps  = rsvps.filter(r  => r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search) || (r.relation||'').includes(search))
  const filteredDuas   = duas.filter(d   => d.name.toLowerCase().includes(search.toLowerCase()) || d.message.toLowerCase().includes(search.toLowerCase()))
  const filteredMedia  = media.filter(m  => m.name.toLowerCase().includes(search.toLowerCase()) || m.type.includes(search))

  // ── LOGIN ──
  if (!authed) return (
    <div className={styles.loginWrap}>
      <div className={styles.loginBox}>
        <div className={styles.loginIcon}>🔐</div>
        <h1 className={styles.loginTitle}>Admin Panel</h1>
        <p className={styles.loginSub}>রোকন ❤ ইভা — বিবাহ ওয়েবসাইট</p>
        <form onSubmit={login} className={styles.loginForm}>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="পাসওয়ার্ড দিন..." className={styles.loginInput} autoFocus/>
          {error && <p className={styles.loginError}>⚠️ {error}</p>}
          <button type="submit" className={styles.loginBtn}>প্রবেশ করুন →</button>
        </form>
      </div>
    </div>
  )

  // ── DASHBOARD ──
  return (
    <div className={styles.wrap}>
      {/* Confirm Delete Modal */}
      {confirmId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>🗑️</div>
            <h3 className={styles.modalTitle}>মুছে ফেলবেন?</h3>
            <p className={styles.modalMsg}>এই তথ্যটি স্থায়ীভাবে মুছে যাবে।</p>
            <div className={styles.modalBtns}>
              <button className={styles.modalCancel} onClick={() => { setConfirmId(null); setConfirmType(null) }}>বাতিল</button>
              <button className={styles.modalConfirm} onClick={() => deleteRow(confirmId, confirmType!)} disabled={!!deleting}>
                {deleting === confirmId ? '⏳...' : '✓ মুছুন'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>💍 Admin Panel</h1>
          <p className={styles.headerSub}>রোকন ❤ ইভা — বৌ-ভাত, ২৭ মার্চ ২০২৬</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.refreshBtn} onClick={loadData} disabled={loading}>{loading?'⏳':'🔄'} Refresh</button>
          <button className={styles.logoutBtn} onClick={() => setAuthed(false)}>🚪 Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}><div className={styles.statNum}>{rsvps.length}</div><div className={styles.statLabel}>মোট RSVP</div></div>
        <div className={styles.statCard}><div className={styles.statNum}>{totalGuests()}</div><div className={styles.statLabel}>মোট অতিথি</div></div>
        <div className={styles.statCard}><div className={styles.statNum}>{duas.length}</div><div className={styles.statLabel}>মোট দোয়া</div></div>
        <div className={styles.statCard}><div className={styles.statNum}>{media.length}</div><div className={styles.statLabel}>মোট মিডিয়া</div></div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab==='rsvp'?styles.tabActive:''}`} onClick={()=>{setTab('rsvp');setSearch('')}}>✅ RSVP ({rsvps.length})</button>
          <button className={`${styles.tab} ${tab==='dua'?styles.tabActive:''}`}  onClick={()=>{setTab('dua');setSearch('')}}>🤲 দোয়া ({duas.length})</button>
          <button className={`${styles.tab} ${tab==='media'?styles.tabActive:''}`} onClick={()=>{setTab('media');setSearch('')}}>🖼️ মিডিয়া ({media.length})</button>
        </div>
        <div className={styles.toolbarRight}>
          <input className={styles.searchInput} placeholder="🔍 খুঁজুন..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <button className={styles.exportBtn} onClick={() => exportCSV(tab)}>⬇ CSV</button>
        </div>
      </div>

      {/* ── RSVP TABLE ── */}
      {tab==='rsvp' && (
        <div className={styles.tableWrap}>
          {loading ? <div className={styles.loader}>লোড হচ্ছে...</div>
          : filteredRsvps.length===0 ? <div className={styles.empty}>কোনো RSVP পাওয়া যায়নি</div>
          : <table className={styles.table}>
              <thead><tr><th>#</th><th>নাম</th><th>ফোন</th><th>অতিথি</th><th>সম্পর্ক</th><th>বার্তা</th><th>সময়</th><th>Action</th></tr></thead>
              <tbody>
                {filteredRsvps.map((r,i) => (
                  <tr key={r.id}>
                    <td className={styles.tdNum}>{i+1}</td>
                    <td className={styles.tdName}>{r.name}</td>
                    <td className={styles.tdPhone}>{r.phone}</td>
                    <td className={styles.tdCenter}>{r.guests} জন</td>
                    <td><span className={styles.relationBadge}>{r.relation||'—'}</span></td>
                    <td className={styles.tdMsg}>{r.message||<span className={styles.na}>—</span>}</td>
                    <td className={styles.tdDate}>{formatDate(r.created_at)}</td>
                    <td>
                      <div className={styles.actionBtns}>
                        <a href={`tel:${r.phone}`} className={styles.callBtn} title="Call">📞</a>
                        <a href={`https://wa.me/88${r.phone}`} target="_blank" rel="noopener noreferrer" className={styles.waBtn} title="WhatsApp">💬</a>
                        <button className={styles.deleteBtn} title="মুছুন" onClick={() => { setConfirmId(r.id); setConfirmType('rsvp') }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr><td colSpan={3} className={styles.tfootLabel}>মোট</td><td className={styles.tdCenter}><strong>{totalGuests()} জন</strong></td><td colSpan={4}/></tr></tfoot>
            </table>
          }
        </div>
      )}

      {/* ── DUA TABLE ── */}
      {tab==='dua' && (
        <div className={styles.tableWrap}>
          {loading ? <div className={styles.loader}>লোড হচ্ছে...</div>
          : filteredDuas.length===0 ? <div className={styles.empty}>কোনো দোয়া পাওয়া যায়নি</div>
          : <table className={styles.table}>
              <thead><tr><th>#</th><th>নাম</th><th>দোয়া ও শুভেচ্ছা</th><th>সময়</th><th>Action</th></tr></thead>
              <tbody>
                {filteredDuas.map((d,i) => (
                  <tr key={d.id}>
                    <td className={styles.tdNum}>{i+1}</td>
                    <td className={styles.tdName}>{d.name}</td>
                    <td className={styles.tdDua}>{d.message}</td>
                    <td className={styles.tdDate}>{formatDate(d.created_at)}</td>
                    <td>
                      <button className={styles.deleteBtn} title="মুছুন" onClick={() => { setConfirmId(d.id); setConfirmType('dua') }}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      )}

      {/* ── MEDIA GRID ── */}
      {tab==='media' && (
        <div className={styles.tableWrap}>
          {loading ? <div className={styles.loader}>লোড হচ্ছে...</div>
          : filteredMedia.length===0 ? <div className={styles.empty}>কোনো মিডিয়া পাওয়া যায়নি</div>
          : (
            <>
              <div className={styles.mediaGrid}>
                {filteredMedia.map(m => (
                  <div key={m.id} className={styles.mediaCard}>
                    {/* Preview */}
                    <div className={styles.mediaPreview}>
                      {m.type==='image' && <img src={m.url} alt={m.name} className={styles.mediaImg}/>}
                      {m.type==='video' && <video src={m.url} className={styles.mediaImg}/>}
                      {m.type==='youtube' && (
                        <img src={`https://img.youtube.com/vi/${m.url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1]}/hqdefault.jpg`} alt="YouTube" className={styles.mediaImg}/>
                      )}
                      {m.type==='facebook' && <div className={styles.mediaFb}><span>📘</span><p>Facebook</p></div>}
                      <span className={styles.mediaTypeBadge}>{m.type==='image'?'📸':m.type==='video'?'🎬':m.type==='youtube'?'▶':m.type==='facebook'?'📘':'📁'} {m.type}</span>
                    </div>
                    {/* Info */}
                    <div className={styles.mediaInfo}>
                      <p className={styles.mediaName}>{m.name||'—'}</p>
                      <p className={styles.mediaDate}>{formatDate(m.created_at)}</p>
                    </div>
                    {/* Actions */}
                    <div className={styles.mediaActions}>
                      <a href={m.url} target="_blank" rel="noopener noreferrer" className={styles.viewBtn}>👁 দেখুন</a>
                      <button className={styles.deleteBtn} onClick={() => { setConfirmId(m.id); setConfirmType('media') }}>🗑️ মুছুন</button>
                    </div>
                  </div>
                ))}
              </div>
              <p className={styles.mediaCount}>মোট {filteredMedia.length}টি মিডিয়া · ছবি: {media.filter(m=>m.type==='image').length} · ভিডিও: {media.filter(m=>m.type==='video'||m.type==='youtube'||m.type==='facebook').length}</p>
            </>
          )}
        </div>
      )}

      <p className={styles.footer}>🔒 এই page-এর URL কাউকে share করবেন না · Admin only</p>
    </div>
  )
}
