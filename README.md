# 💍 শুভ বিবাহ ওয়েবসাইট — রোবন ❤ জাকিয়া

একটি সুন্দর বাংলা বিবাহ আমন্ত্রণ ওয়েবসাইট, Next.js দিয়ে তৈরি।

---

## ফিচার সমূহ
- ✅ লাইভ countdown timer (বৌভাতের দিন পর্যন্ত)
- ✅ বর ও কনের সম্পূর্ণ পরিচয়
- ✅ অনুষ্ঠান সূচি (বর যাত্রা + বৌভাত)
- ✅ সময় ও স্থান + Google Maps লিংক
- ✅ সকলের Call ও WhatsApp বাটন
- ✅ Mobile responsive ডিজাইন
- ✅ সম্পূর্ণ বাংলা ভাষায়

---

## Vercel-এ Deploy করার নিয়ম

### ধাপ ১ — GitHub-এ Upload করুন
```bash
git init
git add .
git commit -m "Wedding website"
git remote add origin https://github.com/YOUR_USERNAME/wedding-site.git
git push -u origin main
```

### ধাপ ২ — Vercel-এ Connect করুন
1. [vercel.com](https://vercel.com) এ যান
2. "New Project" ক্লিক করুন
3. GitHub থেকে এই repository select করুন
4. "Deploy" ক্লিক করুন — শেষ!

### ধাপ ৩ — Custom Domain যোগ করুন
1. Vercel Dashboard → আপনার project → "Settings" → "Domains"
2. আপনার domain টাইপ করুন (যেমন: `robonjakiya.com`)
3. আপনার domain provider-এ DNS record আপডেট করুন (Vercel নির্দেশ দেবে)

---

## Local-এ চালানো
```bash
npm install
npm run dev
```
তারপর `http://localhost:3000` খুলুন।

---

## তথ্য পরিবর্তন করতে
- **যোগাযোগ নম্বর**: `src/app/page.tsx` এর `CONTACTS` array পরিবর্তন করুন
- **অনুষ্ঠানের তারিখ**: `src/components/Countdown.tsx` এর `TARGET` পরিবর্তন করুন
- **রঙ পরিবর্তন**: `src/app/globals.css` এর CSS variables পরিবর্তন করুন
