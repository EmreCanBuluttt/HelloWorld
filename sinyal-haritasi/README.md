# 📶 Sinyal Haritası

Telefonu gezdirerek **en iyi hücresel internet hızına sahip noktayı** bulmanı
sağlayan tek dosyalık web uygulaması. Kurulum yok, hesap yok, sunucu yok —
telefonun tarayıcısında çalışır.

Sinyal çubuğuna değil, **gerçekten indirilen veriye** bakar: her ölçümde bir
dosya indirir, kaç Mbit/s aldığını ölçer ve o anki konumunla birlikte kaydeder.
Sonra noktaları hızlarına göre sıralar ve en iyisine yön tarifi verir.

---

## 🚀 Telefonda nasıl açılır?

Uygulamanın **https adresinden** açılması gerekir (konum izni ve service worker
bunu şart koşar). En kolay yol GitHub Pages:

1. Depoda **Settings → Pages** sekmesine gir.
2. **Source:** `Deploy from a branch`, **Branch:** bu dalı (veya `main`) ve
   klasör olarak `/ (root)` seç, kaydet.
3. Bir iki dakika sonra adres hazır olur:
   `https://emrecanbuluttt.github.io/HelloWorld/sinyal-haritasi/`
4. Telefonda bu adresi aç → **Ana ekrana ekle** dersen uygulama gibi açılır.

> **Önemli:** Ölçüm sırasında **Wi-Fi kapalı** olmalı. Açıkken hücresel şebekeyi
> değil Wi-Fi'yi ölçersin.

Bilgisayarda denemek için:

```bash
cd sinyal-haritasi
python3 -m http.server 8000
# → http://localhost:8000  (localhost güvenli sayılır, konum izni çalışır)
```

---

## 🧭 Nasıl kullanılır?

1. **Konum iznini ver** (yön tarifi ve harita için; vermezsen de ölçüm çalışır).
2. Bulunduğun yerin adını yaz — `Balkon`, `Mutfak`, `Sokak kapısı` gibi.
   GPS bina içinde odaları ayıramaz; **isim vermek en önemli adım**.
3. **ÖLÇ**'e bas, birkaç saniye bekle.
4. Birkaç adım yürü, yeni bir isim yaz, tekrar ölç. Aynı isme tekrar ölçüm
   eklersen o noktanın ortalaması güçlenir.
5. **Otomatik** düğmesi belirli aralıklarla kendi kendine ölçer — telefonu
   elinde tutup gezerken kullanışlıdır (ekranı da uyanık tutar).

Uygulama üç şeyi gösterir:

| Bölüm | Ne işe yarar |
|---|---|
| **En iyi nokta** | O ana kadarki en hızlı yerin adı, hızı, kaç metre ve hangi yönde olduğu |
| **Ölçüm haritası** | Noktaların birbirine göre konumu; yeşil hızlı, kırmızı yavaş |
| **Noktalar** | Medyan hıza göre sıralı liste; ölçüm sayısı, gecikme, uzaklık |

Sıralama **medyana** göredir: tek seferlik şanslı bir ölçüm listeyi
yanıltamasın diye.

---

## 📏 Ölçüm nasıl yapılıyor?

Her turda sırayla:

1. **Gecikme (ping) ve jitter** — boş yanıtla 5 gidiş-dönüş; en düşüğü ping,
   ardışık farkların ortalaması jitter.
2. **İndirme hızı** — bir dosya indirilir, veri akarken hız ölçülür.
   İlk parça (bağlantı kurulum süresi) hesaba katılmaz, böylece sonuç
   gecikmeden değil gerçek aktarım hızından çıkar.
3. **Yükleme hızı** — yalnızca ayarlardan açtıysan.

İndirme boyutu **kendini ayarlar**: transferin yaklaşık 2,5 saniye sürmesi
hedeflenir (en az 128 KB, en çok 8 MB). Yani yavaş şebekede az veri harcanır,
hızlı şebekede ölçüm anlamlı kalacak kadar büyür.

Ölçüm başarısız olursa (bağlantı kopuk, kapsama dışı) bu **0 Mbit/s olarak
kaydedilir** — ölü bölgeleri görmek de en az hızlı noktayı bulmak kadar
işe yarar.

Varsayılan ölçüm sunucusu **Cloudflare**'in herkese açık hız testi ucudur
(`speed.cloudflare.com`). Ayarlardan **Sunucuyu test et** ile erişilebilirliğini
kontrol edebilir, istersen kendi adresini girebilirsin (sunucunun
`/__down?bytes=N` ve `/__up` uçlarını CORS ile sunması gerekir).

---

## 📊 Veri kullanımı

Ölçüm gerçek mobil veri harcar. Bu yüzden:

- Üst çubukta **o ana kadar harcanan veri** sürekli görünür.
- Ayarlardan bir **veri bütçesi** seçilir (varsayılan 250 MB); bütçe dolunca
  uygulama kendini durdurur.
- Yükleme testi varsayılan olarak **kapalıdır**.

Kaba tahmin: ~1 Mbit/s'lik yavaş bir hatta ölçüm başına ~0,3 MB;
50 Mbit/s'lik hızlı bir hatta üst sınır olan 8 MB.

---

## 🔒 Gizlilik

Ölçümler ve konumlar **yalnızca telefonun tarayıcısında** (`localStorage`)
saklanır. Hiçbir sunucuya gönderilmez. Ölçüm sunucusuna giden tek şey, boş
veri indirme/yükleme istekleridir. İstediğin an **CSV/JSON olarak dışa
aktarabilir** veya **tümünü silebilirsin**.

---

## ⚠️ Sınırlar

- GPS bina içinde **±10–50 m** şaşar; odaları ayırmak için mutlaka isim ver.
- Şebeke hızı anlık dalgalanır — her noktada **2–3 ölçüm** al.
- Ölçülen değer, o andaki uçtan uca aktarım hızıdır; ölçüm sunucusunun
  yoğunluğu da sonuca yansır. Noktaları **birbiriyle karşılaştırmak** için
  güvenilirdir, operatörünün "taahhüt hızı" belgesi değildir.
- Pusula oku yalnızca cihaz manyetometresi varsa baktığın yöne göre döner;
  yoksa ok **kuzeye göre** gösterir (haritadaki `K ↑` ile aynı).

---

## 📁 Dosyalar

```
sinyal-haritasi/
├── index.html            # uygulamanın tamamı (HTML + CSS + JS, bağımlılık yok)
├── sw.js                 # kapsama dışında da açılabilsin diye service worker
├── manifest.webmanifest  # ana ekrana eklenince uygulama gibi açılması için
├── icon.svg
└── icon-maskable.svg
```
