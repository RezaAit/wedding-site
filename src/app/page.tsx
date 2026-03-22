import Countdown from '@/components/Countdown'
import Gallery from '@/components/Gallery'
import RSVP from '@/components/RSVP'
import DuaSection from '@/components/DuaSection'
import MediaUpload from '@/components/MediaUpload'
import styles from './page.module.css'
import MusicPlayer from '@/components/MusicPlayer'
import HonorAvatar from '@/components/HonorAvatar'
import SplashScreen from '@/components/SplashScreen'

const EVENTS = [
  { icon:'🌿', name:'গায়ে হলুদ',  date:'২১ মার্চ ২০২৬', bn:'৭ চৈত্র ১৪৩২',  day:'রোজ: শনিবার',  time:'বিকাল ৪:০০ টা', color:'haldi' },
  { icon:'🚗', name:'বর যাত্রা',  date:'২৩ মার্চ ২০২৬', bn:'৯ চৈত্র ১৪৩২',  day:'রোজ: সোমবার', time:'',             color:'rose'  },
  { icon:'🎊', name:'বৌ-ভাত',     date:'২৭ মার্চ ২০২৬', bn:'১৩ চৈত্র ১৪৩২', day:'রোজ: শুক্রবার',time:'দুপুর ১২:৩০', color:'gold'  },
]

const CONTACTS = [
  { role:'পরিচালনায়', name:'মোঃ আলাউদ্দিন',            phone:'01719204590' },
  { role:'পরিচালনায়', name:'মোঃ রতন হোসেন',             phone:'01712710512' },
  { role:'আমন্ত্রণে', name:'মোঃ নুর ইসলাম (আল-আমিন)',  phone:'01719204590' },
]

const STARS = [
  {top:'63.94%',left:'2.50%',size:'1.69px',delay:'0.89s'},
  {top:'73.65%',left:'67.67%',size:'3.23px',delay:'0.35s'},
  {top:'42.19%',left:'2.98%',size:'1.55px',delay:'2.02s'},
  {top:'2.65%',left:'19.88%',size:'2.62px',delay:'2.18s'},
  {top:'22.04%',left:'58.93%',size:'3.02px',delay:'0.03s'},
  {top:'80.58%',left:'69.81%',size:'1.85px',delay:'0.62s'},
  {top:'95.72%',left:'33.66%',size:'1.23px',delay:'0.39s'},
  {top:'84.75%',left:'60.37%',size:'3.02px',delay:'2.92s'},
  {top:'53.62%',left:'97.31%',size:'1.95px',delay:'2.21s'},
  {top:'82.94%',left:'61.85%',size:'3.15px',delay:'2.31s'},
  {top:'70.46%',left:'4.58%',size:'1.57px',delay:'1.16s'},
  {top:'7.98%',left:'23.28%',size:'1.25px',delay:'1.11s'},
  {top:'63.57%',left:'36.48%',size:'1.93px',delay:'0.84s'},
  {top:'26.70%',left:'93.67%',size:'2.62px',delay:'2.44s'},
  {top:'17.11%',left:'72.91%',size:'1.41px',delay:'1.52s'},
  {top:'98.95%',left:'64.00%',size:'2.39px',delay:'2.74s'},
  {top:'84.29%',left:'77.60%',size:'1.57px',delay:'0.13s'},
  {top:'31.55%',left:'26.77%',size:'1.53px',delay:'3.77s'},
  {top:'87.64%',left:'31.47%',size:'2.64px',delay:'1.58s'},
  {top:'91.45%',left:'45.89%',size:'1.66px',delay:'0.99s'},
  {top:'56.14%',left:'26.27%',size:'2.46px',delay:'3.59s'},
  {top:'39.94%',left:'21.93%',size:'3.49px',delay:'2.04s'},
  {top:'9.09%',left:'4.71%',size:'1.27px',delay:'2.51s'},
  {top:'79.21%',left:'42.22%',size:'1.16px',delay:'1.53s'},
  {top:'99.61%',left:'52.91%',size:'3.43px',delay:'3.44s'},
  {top:'1.15%',left:'72.07%',size:'2.70px',delay:'2.15s'},
  {top:'26.68%',left:'64.10%',size:'1.28px',delay:'1.74s'},
  {top:'45.37%',left:'95.38%',size:'3.19px',delay:'1.05s'},
  {top:'50.06%',left:'17.87%',size:'3.28px',delay:'3.48s'},
  {top:'29.84%',left:'63.89%',size:'2.52px',delay:'0.61s'},
  {top:'76.25%',left:'53.94%',size:'2.95px',delay:'2.12s'},
  {top:'0.06%',left:'32.42%',size:'1.05px',delay:'3.72s'},
  {top:'87.87%',left:'83.17%',size:'1.77px',delay:'0.23s'},
  {top:'87.80%',left:'94.69%',size:'1.21px',delay:'1.94s'},
  {top:'6.92%',left:'76.06%',size:'2.91px',delay:'0.51s'},
  {top:'47.53%',left:'54.98%',size:'1.66px',delay:'3.49s'},
  {top:'42.31%',left:'21.18%',size:'2.35px',delay:'2.92s'},
  {top:'20.12%',left:'31.17%',size:'3.49px',delay:'2.60s'},
  {top:'43.81%',left:'51.76%',size:'1.30px',delay:'0.90s'},
  {top:'33.81%',left:'58.83%',size:'1.58px',delay:'0.88s'},
  {top:'7.10%',left:'63.11%',size:'1.57px',delay:'3.62s'},
  {top:'85.96%',left:'7.09%',size:'1.60px',delay:'2.68s'},
  {top:'21.42%',left:'13.23%',size:'3.34px',delay:'2.28s'},
  {top:'47.27%',left:'78.46%',size:'3.02px',delay:'0.76s'},
  {top:'9.69%',left:'43.11%',size:'2.06px',delay:'1.87s'},
  {top:'72.91%',left:'67.34%',size:'3.46px',delay:'0.39s'},
  {top:'40.26%',left:'33.93%',size:'3.15px',delay:'0.99s'},
  {top:'19.02%',left:'44.86%',size:'2.05px',delay:'1.11s'},
  {top:'24.98%',left:'92.33%',size:'2.11px',delay:'3.45s'},
  {top:'55.03%',left:'5.06%',size:'3.50px',delay:'3.34s'},
  {top:'96.90%',left:'92.64%',size:'3.12px',delay:'0.67s'},
  {top:'48.56%',left:'21.37%',size:'2.00px',delay:'0.23s'},
  {top:'37.90%',left:'98.53%',size:'1.66px',delay:'3.14s'},
  {top:'45.50%',left:'42.30%',size:'3.39px',delay:'3.98s'},
  {top:'55.58%',left:'71.84%',size:'1.39px',delay:'1.19s'},
  {top:'96.87%',left:'57.92%',size:'2.36px',delay:'2.99s'},
  {top:'5.72%',left:'58.42%',size:'2.26px',delay:'3.41s'},
  {top:'15.74%',left:'96.08%',size:'1.20px',delay:'0.74s'},
  {top:'59.50%',left:'67.52%',size:'1.59px',delay:'0.48s'},
  {top:'89.03%',left:'24.62%',size:'2.49px',delay:'2.48s'},
]

const HEARTS = ['❤','💕','💖','💗','💝','💘','💓','♥']

export default function Home() {
  return (
    <main>
      <SplashScreen/>

      {/* ════ HERO ════ */}
      <section className={styles.hero}>
        <div className={styles.heroBg}/>
        <div className={styles.stars}>
          {STARS.map((s,i)=>(
            <span key={i} className={styles.star} style={{
              top:s.top, left:s.left, width:s.size, height:s.size,
              ['--d' as string]:s.delay,
            }}/>
          ))}
        </div>
        <div className={styles.hearts}>
          {HEARTS.map((h,i)=>(
            <span key={i} className={styles.fheart} style={{
              ['--i' as string]:i,
              ['--fs' as string]:`${16+i*4}px`,
            }}>{h}</span>
          ))}
        </div>

        <div className={styles.heroInner}>
          <p className={styles.bismillah}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
          <div className={styles.ornRow}>
            <span className={styles.ornLine}/>
            <span className={styles.ornStar}>✦</span>
            <span className={`${styles.ornLine} ${styles.ornLineR}`}/>
          </div>
          <p className={styles.heroLabel}>Shubho Bibaho</p>

          {/* BIG HEART */}
          <div className={styles.bigHeart}>
            <span className={styles.bigHeartIcon}>❤</span>
            <span className={styles.bigHeartRing}/>
            <span className={styles.bigHeartRing2}/>
          </div>

          {/* BIG GRADIENT ANIMATED NAMES */}
          <h1 className={styles.heroNames}>
            <span className={styles.groomName}>মোঃ রোকন হাসান</span>
            <span className={styles.heroAnd}>❤</span>
            <span className={styles.brideName}>জাকিয়া সুলতানা ইভা</span>
          </h1>

          <p className={styles.heroSub}>পরম করুণাময় মহান আল্লাহ তায়ালার অসীম রহমতে শুভ বিবাহ উপলক্ষে আপনাকে আন্তরিক আমন্ত্রণ</p>

          <div className={styles.heroBtns}>
            <a href="#events"  className={`${styles.heroBtn} ${styles.hBtn1}`}>💍 অনুষ্ঠান সূচি</a>
            <a href="#rsvp"    className={`${styles.heroBtn} ${styles.hBtn2}`}>✉️ RSVP করুন</a>
            <a href="#dua"     className={`${styles.heroBtn} ${styles.hBtn3}`}>🤲 দোয়া করুন</a>
            <a href="#contact" className={`${styles.heroBtn} ${styles.hBtn4}`}>📞 যোগাযোগ</a>
            <a href="#gallery" className={`${styles.heroBtn} ${styles.hBtn5}`}>📸 গ্যালারি</a>
            <a href="#venue"   className={`${styles.heroBtn} ${styles.hBtn6}`}>📍 ভেন্যু</a>
          </div>

          <Countdown/>
        </div>

        <div className={styles.wave}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{background:"transparent"}}>
            <path d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="#fdf4ff"/>
          </svg>
        </div>
      </section>

      {/* ════ COUPLE ════ */}
      <section className={`${styles.section} ${styles.coupleSection}`}>
        <SectionHead title="বর ও কনের পরিচয়" icon="🌹"/>
        <div className={styles.coupleGrid}>

          <div className={styles.personCard}>
            <div className={styles.personRing}><span>🤵</span></div>
            <span className={`${styles.badge} ${styles.badgeGroom}`}>বর বেশে</span>
            <h3 className={styles.personName}>মোঃ রোকন হাসান</h3>
            <div className={styles.personDivider}/>
            <ul className={styles.personInfo}>
              <li><span>পিতা</span> মোঃ নুর ইসলাম (আল-আমিন)</li>
              <li><span>মাতা</span> মোছাঃ রেহানা বেগম</li>
              <li><span>ঠিকানা</span> আশ্রমপাড়া, ঠাকুরগাঁও সদর, ঠাকুরগাঁও</li>
            </ul>
          </div>

          <div className={styles.coupleCenter}>
            <div className={styles.coupleHeartWrap}>
              <span className={styles.coupleHeart}>❤</span>
              <span className={styles.coupleRing1}/>
              <span className={styles.coupleRing2}/>
            </div>
          </div>

          <div className={styles.personCard}>
            <div className={`${styles.personRing} ${styles.personRingBride}`}><span>👰</span></div>
            <span className={`${styles.badge} ${styles.badgeBride}`}>কনে সেজে</span>
            <h3 className={styles.personName}>জাকিয়া সুলতানা ইভা</h3>
            <div className={styles.personDivider}/>
            <ul className={styles.personInfo}>
              <li><span>পিতা</span> জুলফিকার আলী</li>
              <li><span>মাতা</span> আকলিমা বেগম</li>
              <li><span>ঠিকানা</span> ভোলাডাঙ্গা বাজার, মহেশপুর, ঝিনাইদহ</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ════ EVENTS ════ */}
      <section id="events" className={`${styles.section} ${styles.eventsSection}`}>
        <SectionHead title="অনুষ্ঠান সূচি" icon="💍" dark/>
        <div className={styles.eventTimeline}>
          {EVENTS.map((ev,i)=>(
            <div key={i} className={`${styles.eventItem} ${styles[`event_${ev.color}`]}`}>
              <div className={styles.eventNum}>{i+1}</div>
              <div className={styles.eventBody}>
                <div className={styles.eventIcon}>{ev.icon}</div>
                <h3 className={styles.eventName}>{ev.name}</h3>
                <p className={styles.eventDateMain}>{ev.date}</p>
                <p className={styles.eventDateSub}>{ev.bn} · {ev.day}</p>
                {ev.time&&<p className={styles.eventTime}>⏰ {ev.time}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ VENUE ════ */}
      <section id="venue" className={`${styles.section} ${styles.venueSection}`}>
        <SectionHead title="অনুষ্ঠানের স্থান" icon="📍"/>
        <div className={styles.venueCard}>
          <div className={styles.venueBadge}>🏛</div>
          <h3 className={styles.venueName}>হাওলাদার কমিউনিটি সেন্টার</h3>
          <p className={styles.venueAddress}>আশ্রমপাড়া, ঠাকুরগাঁও সদর, ঠাকুরগাঁও</p>
          <div className={styles.venueInfo}>
            <div className={styles.venueInfoItem}>
              <span>⏰</span>
              <div>
                <strong>বৌ-ভাতের সময়</strong>
                <p>দুপুর ১২:৩০ মিনিট হতে</p>
              </div>
            </div>
          </div>

          <div className={styles.streetViewWrap}>
            <div className={styles.streetViewLabel}>
              <span>🗺️</span> Google Street View
            </div>
            <div className={styles.streetViewFrame}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!3m2!1sen!2sbd!4v1774123242056!5m2!1sen!2sbd!6m8!1m7!1sGXVrE6LMWkgCx0QVXPKyXw!2m2!1d26.03064487627128!2d88.45960475268055!3f121.83984007888448!4f9.896561934624543!5f0.8037486488036882"
                width="100%" height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <a href="https://maps.google.com/?q=হাওলাদার+কমিউনিটি+সেন্টার+আশ্রমপাড়া+ঠাকুরগাঁও"
             target="_blank" rel="noopener noreferrer" className={styles.mapBtn}>
            📍 Google Maps-এ রাস্তা দেখুন
          </a>
        </div>
      </section>

      {/* ════ GALLERY ════ */}
      <section id="gallery" className={`${styles.section} ${styles.gallerySection}`}>
        <SectionHead title="ফটো গ্যালারি" icon="📸" dark/>
        <p className={styles.galleryNote}>
          ছবি যোগ করতে <code>src/components/Gallery.tsx</code> এর <code>PHOTOS</code> array-এ src দিন
        </p>
        <Gallery/>
      </section>

      {/* ════ MEDIA UPLOAD ════ */}
      <section className={`${styles.section} ${styles.mediaSection}`}>
        <SectionHead title="ছবি ও ভিডিও শেয়ার করুন" icon="🎬" dark/>
        <p className={styles.mediaSub}>
          আপনার তোলা ছবি ও ভিডিও upload করুন অথবা YouTube / Facebook লিংক যোগ করুন
        </p>
        <MediaUpload/>
      </section>

      {/* ════ INVITE ════ */}
      <section className={`${styles.section} ${styles.inviteSection}`}>
        <SectionHead title="আমন্ত্রণপত্র" icon="💌" dark/>
        <div className={styles.inviteCard}>
          <p className={styles.inviteSalute}>জনাব/জনাবা,</p>
          <p className={styles.inviteGreet}>আসসালামু আলাইকুম,</p>
          <p className={styles.inviteBody}>
            পরম করুণাময় মহান আল্লাহ তায়ালার অসীম রহমতে আমাদের প্রথম পুত্র{' '}
            <strong>মোঃ রোকন হাসান</strong> এর শুভ বিবাহ উপলক্ষে{' '}
            <strong>বৌ-ভাত</strong> অনুষ্ঠানের আয়োজন করা হয়েছে।
          </p>
          <p className={styles.inviteBody}>
            উক্ত বৌ-ভাত অনুষ্ঠানে আপনার/আপনাদের উপস্থিতি ও দোয়া একান্তভাবে কামনা করছি।
          </p>
          <div className={styles.inviteDivider}/>
          <div className={styles.inviteFooter}>
            <div className={styles.inviteCol}>
              <p className={styles.inviteRole}>পরিচালনায়</p>
              <p className={styles.inviteName}>মোঃ আলাউদ্দিন</p>
              <p className={styles.inviteName}>মোঃ রতন হোসেন</p>
            </div>
            <div className={styles.inviteCol}>
              <p className={styles.inviteRole}>যোগাযোগ</p>
              <p className={styles.inviteName}>০১৭১৯২০৪৫৯০</p>
              <p className={styles.inviteName}>০১৭১২৭১০৫১২</p>
            </div>
            <div className={styles.inviteCol}>
              <p className={styles.inviteRole}>আমন্ত্রণে</p>
              <p className={styles.inviteName}>মোঃ নুর ইসলাম (আল-আমিন)</p>
              <p className={styles.inviteName}>মোছাঃ রেহানা বেগম</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════ DUA ════ */}
      <section id="dua" className={`${styles.section} ${styles.duaSection}`}>
        <SectionHead title="দোয়া ও শুভেচ্ছা" icon="🤲" dark/>
        <p className={styles.duaSub}>
          নবদম্পতির জন্য আপনার দোয়া ও শুভেচ্ছা জানান
        </p>
        <DuaSection/>
      </section>

      {/* ════ RSVP ════ */}
      <section id="rsvp" className={`${styles.section} ${styles.rsvpSection}`}>
        <SectionHead title="উপস্থিতি নিশ্চিত করুন (RSVP)" icon="✉️"/>
        <p className={styles.rsvpIntro}>আপনার আগমন সম্পর্কে আগে থেকে জানালে আমরা আপনার জন্য যথাযথ ব্যবস্থা নিতে পারব</p>
        <RSVP/>
      </section>

      {/* ════ CONTACT ════ */}
      <section id="contact" className={`${styles.section} ${styles.contactSection}`}>
        <SectionHead title="যোগাযোগ করুন" icon="📞" dark/>
        <div className={styles.contactGrid}>
          {CONTACTS.map((c,i)=>(
            <div key={i} className={styles.contactCard}>
              <div className={styles.contactTop}>
                <div className={styles.contactAvatar}>
                  {['👨','👨‍💼','🤵'][i] || '👤'}
                </div>
                <span className={styles.contactRole}>{c.role}</span>
                <p className={styles.contactName}>{c.name}</p>
                <p className={styles.contactNum}>📱 {c.phone}</p>
              </div>
              <div className={styles.contactDivider}/>
              <div className={styles.contactBtns}>
                <a href={`tel:${c.phone}`} className={styles.callBtn}>📞 Call</a>
                <a href={`https://wa.me/88${c.phone}`} target="_blank" rel="noopener noreferrer" className={styles.waBtn}>💬 WhatsApp</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ SPECIAL HONOR ════ */}
      <section className={`${styles.section} ${styles.honorSection}`}>
        <SectionHead title="বিশেষ সম্মাননা" icon="🌟" dark/>
        <div className={styles.honorCard}>
          <div className={styles.honorStars}>
            {['⭐','✨','🌟','✨','⭐'].map((s,i) => (
              <span key={i} className={styles.honorStar}
                style={{ '--i': i } as React.CSSProperties}>{s}</span>
            ))}
          </div>
          <div className={styles.honorBadge}>সম্মানিত অতিথি</div>
          <div className={styles.honorAvatarWrap}>
            <HonorAvatar/>
            <div className={styles.honorRing1}/>
            <div className={styles.honorRing2}/>
          </div>
          <h2 className={styles.honorName}>মো: রুহুল আমিন</h2>
          <p className={styles.honorRelation}>বরের পিতার বড় ভাই (চাচা)</p>
          <div className={styles.honorDivider}>
            <span/><span className={styles.honorDiamond}/><span/>
          </div>
          <p className={styles.honorMsg}>
            আমাদের পরিবারের শ্রদ্ধেয় বড় ভাই মো: রুহুল আমিন চাচার
            আন্তরিক উপস্থিতি ও দোয়া আমাদের এই শুভ অনুষ্ঠানকে
            পরিপূর্ণ করেছে। আল্লাহ তাঁকে দীর্ঘ ও সুস্থ জীবন দান করুন।
          </p>
          <div className={styles.honorDua}>
            اللَّهُمَّ بَارِكْ فِيهِ وَأَكْرِمْهُ
          </div>
          <p className={styles.honorDuaBn}>হে আল্লাহ! তাঁকে বরকত দিন এবং সম্মানিত করুন।</p>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className={styles.footer}>
        <div className={styles.footerOrnament}>
          <span/><span className={styles.footerDiamond}/><span/>
        </div>
        <p className={styles.footerTitle}>Shubho Bibaho</p>
        <p className={styles.footerNames}>রোকন ❤ ইভা</p>
        <p className={styles.footerDate}>২৭ মার্চ ২০২৬ · ঠাকুরগাঁও</p>
        <p className={styles.footerDua}>আল্লাহ্ তাদের সংসারকে সুখময় করুন — আমিন 🤲</p>
      </footer>

      <MusicPlayer/>
    </main>
  )
}

function SectionHead({title,icon,dark}:{title:string;icon:string;dark?:boolean}){
  return(
    <div className={`${styles.sectionHead} ${dark?styles.sectionHeadDark:''}`}>
      <div className={styles.sectionDivider}>
        <span className={styles.divLine}/>
        <span className={styles.divIcon}>{icon}</span>
        <span className={`${styles.divLine} ${styles.divLineR}`}/>
      </div>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionUnder}/>
    </div>
  )
}
