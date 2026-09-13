# DTF·LAB — DTF Baskı Sitesi Taslağı

Direct-to-Film (DTF) transfer baskı işletmesi için, tasarımdan uygulamaya kadar
tüm adımları içeren bir **web sitesi taslağı**. Merkezinde DTF sektörünün en
kritik özelliği olan **gang sheet (toplu tasarım sayfası) + canlı metretül/m²
fiyat hesaplayıcı** bulunur.

> **Referans hakkında not:** Kaynak olarak verilen Instagram reel'i
> (`instagram.com/reel/DaHIsoBxxEo`) giriş gerektirdiği için otomatik olarak
> izlenemedi. Bu taslak; DTF sektörünün yerleşik site kalıpları (gang sheet
> builder, anlık fiyatlandırma, dosya yükleme, "nasıl çalışır" akışı) ve
> Türkiye pazarındaki DTF baskı sitelerinin ortak yapısı temel alınarak
> hazırlandı. Reel'deki spesifik detayları (renk, metin, özel animasyon)
> iletirsen taslağı birebir ona göre uyarlarım.

---

## 🎯 Ne içeriyor?

Tek sayfalık (landing) çalışan bir ön yüz:

- **Sticky navigasyon** + aydınlık/karanlık tema geçişi
- **Hero**: canlı "gang sheet" görseli ve anlık fiyat göstergesi
- **Süreç**: dosyadan kumaşa 4 adım (yükle → diz → bas → kargo)
- **Fiyat hesaplayıcı**: rulo genişliği (30/60 cm) × uzunluk (slider) × adet →
  KDV dahil canlı fiyat, m² bazlı kademeli toplu indirim
- **Avantajlar**: DTF'in serigrafiye karşı üstünlükleri
- **Kullanım galerisi**, **SSS akordeon**, **teklif/dosya yükleme formu**
- Tamamen **responsive**, `prefers-reduced-motion` ve klavye erişilebilirliği
  gözetilmiş

### Canlı önizleme

Anında bakmak için: kök dizindeki `index.html`'i tarayıcıda açman yeterli.
(Ayrıca tek dosyalık, bağımsız bir önizleme sürümü de üretildi.)

---

## 🎨 Tasarım Sistemi — "Mürekkep & Film"

Kimlik, DTF'in kendi dünyasından türetildi: nötr bir **film yüzeyi** üzerine
basılan **canlı CMYK mürekkebi**.

### Renk paleti
| Rol | Aydınlık | Karanlık | Açıklama |
|-----|----------|----------|----------|
| Zemin (film) | `#F1F4F9` | `#0A0E16` | Mavi-gri eğilimli nötr |
| Yüzey | `#FFFFFF` | `#121826` | Kart/panel |
| Metin | `#10151F` | `#EDF1F8` | Mürekkep siyahı |
| **Ana aksan (Magenta / M)** | `#E5006D` | `#FF2E86` | CMYK'nın M'i — marka rengi |
| İkincil (Cyan / C) | `#009FD6` | `#35BDEC` | İşlevsel vurgu |
| Üçüncül (Sarı / Y) | `#FFC400` | `#FFCE33` | Çok az kullanılan pop |

Renkler `assets/css/style.css` içinde CSS custom property (token) olarak
tanımlıdır; her iki tema da tek tek elden geçirildi (naif ters çevirme değil).

### Tipografi
- **Display / başlık:** Archivo (endüstriyel, teknik karakter)
- **Gövde:** Manrope (küçük boyutlarda okunaklı)
- **Veri / spesifikasyon:** IBM Plex Mono (ebat, DPI, fiyat — "üretim fişi" hissi)

---

## 🗺️ Tasarımdan Uygulamaya — Adımlar

Bu taslak **Faz 2**'yi (statik ön yüz) hayata geçirir. Aşağıda sıfırdan
canlı ürüne giden tam yol haritası var.

### Faz 0 — Keşif & Strateji
- [ ] Hedef kitle: KOBİ atölyeleri mi, bireysel son kullanıcı mı, bayi mi?
- [ ] Fiyat modeli netleştir: metretül mü, m² mi, sabit ebat paketleri mi?
- [ ] Rakip analizi (kolaytisort, transferciyiz, dtf.com.tr, falcontransfers…)
- [ ] Marka adı, logo, ton; alan adı ve sosyal hesaplar

### Faz 1 — Tasarım
- [x] Tasarım sistemi: renk token'ları, tipografi, boşluk ölçeği
- [x] Bilgi mimarisi: hero → süreç → hesaplayıcı → avantaj → galeri → SSS → CTA
- [x] Wireframe → yüksek sadakatli mockup (bu taslak referans alınabilir)
- [ ] Gerçek fotoğraf/çekim: baskı örnekleri, atölye, uygulama videoları

### Faz 2 — Frontend (bu taslak) ✅
- [x] Semantik HTML, token tabanlı CSS, çerçevesiz (vanilla) JS
- [x] Etkileşimli fiyat hesaplayıcı + gang sheet görselleştirme
- [x] Responsive, erişilebilirlik, aydınlık/karanlık tema
- [ ] Sonraki: bileşenleri bir framework'e taşı (Next.js/Astro/Nuxt)

### Faz 3 — Gang Sheet Builder (asıl motor)
Sektörün kalbi. Kullanıcının tarayıcıda tasarım yükleyip film üzerine
dizebildiği editör:
- [ ] Canvas editörü (Fabric.js / Konva.js) — sürükle-bırak, ölçekle, çoğalt
- [ ] Otomatik dizgi/nesting algoritması (boşluğu minimize eden yerleşim)
- [ ] Dosya ön kontrolü: DPI, şeffaflık, renk profili, kesim payı uyarıları
- [ ] Yüksek çözünürlüklü baskıya hazır PDF/PNG çıktısı (300+ DPI)
- [ ] Alternatif: `autogangsheet.com` gibi bir servise entegrasyon

### Faz 4 — Backend, E-ticaret & Ödeme
- [ ] Ürün/fiyat modeli, sepet, sipariş API'si (Node/NestJS, Django veya
      hazır platform: Shopify / WooCommerce / Ticimax)
- [ ] Dosya depolama (S3 / Cloudflare R2) + güvenli yükleme
- [ ] Ödeme: iyzico / PayTR / Stripe; 3D Secure, fatura, KDV
- [ ] Üyelik, sipariş geçmişi, tekrar sipariş, bayi fiyat kademesi
- [ ] Fiyat mantığını backend'e taşı (şu an `app.js` içinde örnek sabit)

### Faz 5 — Üretim & Sipariş Yönetimi
- [ ] Admin paneli: sipariş kuyruğu, durum (onay → baskı → kargo)
- [ ] Baskı iş emri / otomatik dizgi çıktısı üretimi
- [ ] Kargo entegrasyonu (Aras, Yurtiçi, MNG) + takip numarası
- [ ] E-posta/SMS/WhatsApp bildirimleri

### Faz 6 — Yayın, SEO & Ölçümleme
- [ ] Teknik SEO: meta, Open Graph (hazır), sitemap, schema.org (LocalBusiness)
- [ ] Performans: görsel optimizasyonu, lazy-load, Lighthouse ≥ 90
- [ ] Analitik: GA4 / Meta Pixel + dönüşüm olayları (teklif, sipariş)
- [ ] Yasal: KVKK, mesafeli satış, teslimat & iade sayfaları
- [ ] CI/CD + hosting (Vercel / Netlify / Cloudflare Pages)

---

## 📁 Dosya yapısı

```
HelloWorld/
├── index.html            # Ana landing sayfası (Google Fonts ile)
├── assets/
│   ├── css/style.css     # Tasarım sistemi + tüm stiller (token tabanlı)
│   └── js/app.js         # Hesaplayıcı, tema, akordeon, form, reveal
└── README.md             # Bu belge — tasarım→uygulama yol haritası
```

## ▶️ Yerelde çalıştırma

Bağımlılık yok, saf HTML/CSS/JS:

```bash
# 1) Doğrudan aç
#   index.html dosyasına çift tıkla

# 2) veya basit bir sunucu ile (önerilir)
python3 -m http.server 8000
#   → http://localhost:8000
```

---

## 🧩 Önerilen teknoloji yığını (üretim için)

| Katman | Öneri |
|--------|-------|
| Frontend | Next.js / Astro (bu taslak referans tasarım) |
| Gang sheet editör | Fabric.js veya Konva.js (canvas) |
| Backend | Node.js (NestJS) / veya Shopify · WooCommerce |
| Ödeme | iyzico / PayTR (TR) veya Stripe |
| Depolama | Cloudflare R2 / AWS S3 |
| Hosting | Vercel / Cloudflare Pages |

---

## ⚠️ Notlar
- Fiyatlar (`app.js` içindeki `PRICE_PER_M2 = 650`) **örnektir**; gerçek
  entegrasyonda backend'den gelmelidir.
- Form ve dosya yükleme şu an **demo** amaçlıdır (backend'e bağlı değildir).
- Marka adı "DTF·LAB", iletişim ve istatistikler yer tutucudur.

_Bu bir taslaktır — yön, içerik ve öncelikler geri bildirime göre uyarlanır._

---

## 📦 Bu depodaki diğer projeler

- **[`sinyal-haritasi/`](sinyal-haritasi/)** — Telefonu gezdirerek en iyi
  hücresel internet hızına sahip noktayı bulmanı sağlayan ölçüm uygulaması.
  Adres (Pages açıldıktan sonra):
  <https://emrecanbuluttt.github.io/HelloWorld/sinyal-haritasi/>
