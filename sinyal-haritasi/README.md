# 📶 Sinyal Haritası

Telefonu gezdirerek **en iyi hücresel internet hızına sahip noktayı** bulmanı
sağlayan tek dosyalık web uygulaması. Kurulum yok, hesap yok, sunucu yok —
telefonun tarayıcısında çalışır.

Sinyal çubuğuna değil, **gerçekten indirilen veriye** bakar: her ölçümde bir
dosya indirir, kaç Mbit/s aldığını ölçer ve o anki konumunla birlikte kaydeder.
Sonra noktaları hızlarına göre sıralar ve en iyisine yön tarifi verir.

---

## 🚀 Telefonda nasıl açılır?

**Tek seferlik kurulum:** depo ayarlarında **Settings → Pages → Build and
deployment → Source: `GitHub Actions`** seçilmelidir. Actions'ın `GITHUB_TOKEN`'ı
Pages sitesini *oluşturma* yetkisine sahip değildir, bu yüzden ilk açılış elle
yapılır. (Alternatif: Source olarak `Deploy from a branch` → varsayılan dal →
`/ (root)`; kökteki `.nojekyll` sayesinde bu da çalışır.)

Bir kez açıldıktan sonra `.github/workflows/pages.yml` her push'ta otomatik
yayınlar. Adres:

```
https://emrecanbuluttt.github.io/HelloWorld/sinyal-haritasi/
```

**Ana ekrana ekle** dersen ayrı bir uygulama gibi açılır, adres çubuğu olmadan.

> **Önemli:** Ölçüm sırasında **Wi-Fi kapalı** olmalı. Açıkken hücresel şebekeyi
> değil Wi-Fi'yi ölçersin. Uygulama Wi-Fi'yi tespit edebilirse üstte uyarı gösterir.

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

1. **Gecikme (ping) ve jitter** — 1 baytlık `ping.txt` ile 5 gidiş-dönüş;
   en düşüğü ping, ardışık farkların ortalaması jitter.
2. **İndirme hızı** — sitenin yanındaki `payload.bin` dosyasından **Range**
   isteğiyle tam N bayt indirilir, veri akarken hız ölçülür. İlk parça
   (bağlantı kurulum süresi) hesaba katılmaz, böylece sonuç gecikmeden değil
   gerçek aktarım hızından çıkar. Sunucu Range'i yok sayarsa akış hedefe
   ulaşınca kesilir — dosyanın tamamı asla boşuna inmez.
3. **Yükleme hızı** — yalnızca uzak bir hız testi sunucusu seçiliysin ve
   ayarlardan açtıysan (statik dosya POST kabul etmez).

İndirme boyutu **kendini ayarlar**: transferin yaklaşık 2,5 saniye sürmesi
hedeflenir (en az 128 KB, en çok 8 MB). Yani yavaş şebekede az veri harcanır,
hızlı şebekede ölçüm anlamlı kalacak kadar büyür.

Ölçüm başarısız olursa (bağlantı kopuk, kapsama dışı) bu **0 Mbit/s olarak
kaydedilir** — ölü bölgeleri görmek de en az hızlı noktayı bulmak kadar
işe yarar.

### Ölçüm kaynağı

Varsayılan kaynak **sitenin kendi dosyasıdır** (`payload.bin`, 8 MiB rastgele
veri). Aynı origin olduğu için CORS gerekmez ve uygulama hiçbir üçüncü taraf
sunucuya bağımlı değildir — bu, ölçümün "sunucu bize izin veriyor mu?"
sorusuna takılmamasını garanti eder.

Ayarlardan kaynağı **Cloudflare hız testi sunucusu** ya da **kendi adresin**
olarak da seçebilirsin; uzak kaynakta yükleme testi de açılır. Adresin
`/__down?bytes=N` ve `/__up` uçlarını CORS ile sunması gerekir.
**Kaynağı test et** düğmesi erişimi ve Range desteğini anında raporlar.

---

## 📊 Veri kullanımı

Ölçüm gerçek mobil veri harcar. Bu yüzden:

- Üst çubukta **o ana kadar harcanan veri** sürekli görünür.
- Ayarlardan bir **veri bütçesi** seçilir (varsayılan 250 MB); bütçe dolunca
  uygulama kendini durdurur.
- Yükleme testi varsayılan olarak **kapalıdır**.

Kaba tahmin: ~1 Mbit/s'lik yavaş bir hatta ölçüm başına ~0,3 MB;
50 Mbit/s'lik hızlı bir hatta üst sınır olan 8 MB.

Sayaç yaklaşıktır: gövde baytlarını tam sayar, HTTP başlıkları için ping
başına ~0,5 KB ekler.

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
├── payload.bin           # 8 MiB rastgele veri — indirme hızı bununla ölçülür
├── ping.txt              # 1 bayt — gecikme bununla ölçülür
├── sw.js                 # kapsama dışında da açılabilsin diye service worker
├── manifest.webmanifest  # ana ekrana eklenince uygulama gibi açılması için
├── icon.svg
└── icon-maskable.svg
```
