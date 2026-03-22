'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './admin.module.css'

// ⚠️ এই password পরিবর্তন করুন
const ADMIN_PASSWORD = 'rokon2026'

type RSVPRow = {
  id: string
  name: string
  phone: string
  guests: number
  relation: string
  message: string | null
  created_at: string
}

type DuaRow = {
  id: string
  name: string
  message: string
  created_at: string
}

type Tab = 'rsvp' | 'dua'

export default function AdminPage() {
  const [authed, setAuthed]   = useState(false)
  const [pass, setPass]       = useState('')
  const [error, setError]     = useState('')
  const [tab, setTab]         = useState<Tab>('rsvp')
  const [rsvps, setRsvps]     = useState<RSVPRow[]>([])
  const [duas, setDuas]       = useState<DuaRow[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch]   = useState('')

  function login(e: React.FormEvent) {
    e.preventDefault()
    if (pass === ADMIN_PASSWORD) {
      setAuthed(true)
      setError('')
      loadData()
    } else {
      setError('পাসওয়ার্ড সঠিক নয়!')
      setPass('')
    }
  }

  async function loadData() {
    setLoading(true)
    const [{ data: r }, { data: d }] = await Promise.all([
      supabase.from('rsvp').select('*').order('created_at', { ascending: false }),
      supabase.from('duas').select('*').order('created_at', { ascending: false }),
    ])
    if (r) setRsvps(r)
    if (d) setDuas(d)
    setLoading(false)
  }

  function formatDate(str: string) {
    return new Date(str).toLocaleString('bn-BD', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  function totalGuests() {
    return rsvps.reduce((sum, r) => sum + (r.guests || 1), 0)
  }

  function exportCSV() {
    const header = 'নাম,ফোন,অতিথি,সম্পর্ক,বার্তা,সময়'
    const rows = rsvps.map(r =>
      `"${r.name}","${r.phone}","${r.guests}","${r.relation || ''}","${r.message || ''}","${formatDate(r.created_at)}"`
    )
    const blob = new Blob(['\uFEFF' + header + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'rsvp-list.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  function exportDuaCSV() {
    const header = 'নাম,দোয়া,সময়'
    const rows = duas.map(d =>
      `"${d.name}","${d.message}","${formatDate(d.created_at)}"`
    )
    const blob = new Blob(['\uFEFF' + header + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'dua-list.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const filteredRsvps = rsvps.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.phone.includes(search) ||
    (r.relation || '').includes(search)
  )

  const filteredDuas = duas.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.message.toLowerCase().includes(search.toLowerCase())
  )

  // ── LOGIN PAGE ──
  if (!authed) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginBox}>
          <div className={styles.loginIcon}>🔐</div>
          <h1 className={styles.loginTitle}>Admin Panel</h1>
          <p className={styles.loginSub}>রোকন ❤ ইভা — বিবাহ ওয়েবসাইট</p>
          <form onSubmit={login} className={styles.loginForm}>
            <input
              type="password" value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="পাসওয়ার্ড দিন..."
              className={styles.loginInput}
              autoFocus
            />
            {error && <p className={styles.loginError}>⚠️ {error}</p>}
            <button type="submit" className={styles.loginBtn}>প্রবেশ করুন →</button>
          </form>
        </div>
      </div>
    )
  }

  // ── ADMIN DASHBOARD ──
  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>💍 Admin Panel</h1>
          <p className={styles.headerSub}>রোকন ❤ ইভা — বৌ-ভাত, ২৭ মার্চ ২০২৬</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.refreshBtn} onClick={loadData} disabled={loading}>
            {loading ? '⏳' : '🔄'} Refresh
          </button>
          <button className={styles.logoutBtn} onClick={() => setAuthed(false)}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{rsvps.length}</div>
          <div className={styles.statLabel}>মোট RSVP</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{totalGuests()}</div>
          <div className={styles.statLabel}>মোট অতিথি</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{duas.length}</div>
          <div className={styles.statLabel}>মোট দোয়া</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum}>
            {rsvps.length > 0
              ? formatDate(rsvps[rsvps.length - 1].created_at).split(',')[0]
              : '—'}
          </div>
          <div className={styles.statLabel}>প্রথম RSVP</div>
        </div>
      </div>

      {/* Tabs + Search + Export */}
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab==='rsvp'?styles.tabActive:''}`} onClick={()=>{setTab('rsvp');setSearch('')}}>
            ✅ RSVP ({rsvps.length})
          </button>
          <button className={`${styles.tab} ${tab==='dua'?styles.tabActive:''}`} onClick={()=>{setTab('dua');setSearch('')}}>
            🤲 দোয়া ({duas.length})
          </button>
        </div>
        <div className={styles.toolbarRight}>
          <input
            className={styles.searchInput}
            placeholder="🔍 খুঁজুন..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {tab === 'rsvp'
            ? <button className={styles.exportBtn} onClick={exportCSV}>⬇ CSV Export</button>
            : <button className={styles.exportBtn} onClick={exportDuaCSV}>⬇ CSV Export</button>
          }
        </div>
      </div>

      {/* RSVP Table */}
      {tab === 'rsvp' && (
        <div className={styles.tableWrap}>
          {loading ? (
            <div className={styles.loader}>লোড হচ্ছে...</div>
          ) : filteredRsvps.length === 0 ? (
            <div className={styles.empty}>কোনো RSVP পাওয়া যায়নি</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>নাম</th>
                  <th>ফোন নম্বর</th>
                  <th>অতিথি</th>
                  <th>সম্পর্ক</th>
                  <th>বার্তা</th>
                  <th>সময়</th>
                  <th>Call</th>
                </tr>
              </thead>
              <tbody>
                {filteredRsvps.map((r, i) => (
                  <tr key={r.id}>
                    <td className={styles.tdNum}>{i + 1}</td>
                    <td className={styles.tdName}>{r.name}</td>
                    <td className={styles.tdPhone}>{r.phone}</td>
                    <td className={styles.tdCenter}>{r.guests} জন</td>
                    <td>
                      <span className={styles.relationBadge}>{r.relation || '—'}</span>
                    </td>
                    <td className={styles.tdMsg}>{r.message || <span className={styles.na}>—</span>}</td>
                    <td className={styles.tdDate}>{formatDate(r.created_at)}</td>
                    <td>
                      <div className={styles.actionBtns}>
                        <a href={`tel:${r.phone}`} className={styles.callBtn}>📞</a>
                        <a href={`https://wa.me/88${r.phone}`} target="_blank" rel="noopener noreferrer" className={styles.waBtn}>💬</a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className={styles.tfootLabel}>মোট</td>
                  <td className={styles.tdCenter}><strong>{totalGuests()} জন</strong></td>
                  <td colSpan={4}/>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      )}

      {/* Dua Table */}
      {tab === 'dua' && (
        <div className={styles.tableWrap}>
          {loading ? (
            <div className={styles.loader}>লোড হচ্ছে...</div>
          ) : filteredDuas.length === 0 ? (
            <div className={styles.empty}>কোনো দোয়া পাওয়া যায়নি</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>নাম</th>
                  <th>দোয়া ও শুভেচ্ছা</th>
                  <th>সময়</th>
                </tr>
              </thead>
              <tbody>
                {filteredDuas.map((d, i) => (
                  <tr key={d.id}>
                    <td className={styles.tdNum}>{i + 1}</td>
                    <td className={styles.tdName}>{d.name}</td>
                    <td className={styles.tdDua}>{d.message}</td>
                    <td className={styles.tdDate}>{formatDate(d.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <p className={styles.footer}>
        🔒 এই page-এর URL কাউকে share করবেন না · Admin only
      </p>
    </div>
  )
}
