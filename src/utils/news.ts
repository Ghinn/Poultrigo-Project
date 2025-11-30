/**
 * Utility functions for managing news articles
 */

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
  category: "Teknologi" | "Tips" | "Berita" | "Update" | "Tutorial";
  featuredImage?: string;
  publishedAt: string;
  updatedAt: string;
  published: boolean;
  views: number;
  tags: string[];
}

const STORAGE_KEY = "poultrigo_news";

// Initialize with demo articles
export function initializeDemoNews(): void {
  if (typeof window === "undefined") return;
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return; // Already has news

  const demoArticles: Omit<NewsArticle, "id" | "publishedAt" | "updatedAt">[] = [
    {
      title: "Poultrigo Launching: Platform IoT Pertama untuk Peternakan Ayam di Indonesia",
      content: `
# Poultrigo Launching: Platform IoT Pertama untuk Peternakan Ayam di Indonesia

Poultrigo secara resmi meluncurkan platform IoT dan Machine Learning pertama di Indonesia yang dirancang khusus untuk revolusi digital industri peternakan ayam. Platform ini menggabungkan teknologi sensor IoT canggih dengan analitik berbasis AI untuk membantu peternak mengoptimalkan operasional mereka.

## Transformasi Digital Peternakan

Peternakan ayam di Indonesia memasuki era baru dengan hadirnya Poultrigo. Platform ini memungkinkan peternak untuk:

- **Pemantauan Real-time**: Pantau kondisi kandang, suhu, kelembapan, dan status pakan secara langsung dari smartphone atau komputer
- **Prediksi Pakan Cerdas**: Menggunakan Machine Learning untuk memprediksi kebutuhan pakan dengan akurasi tinggi
- **Optimasi Biaya**: Kurangi waste pakan hingga 30% melalui rekomendasi yang tepat waktu
- **Monitoring Kesehatan**: Deteksi dini potensi masalah kesehatan ayam sebelum berkembang menjadi penyakit serius

## Teknologi Terdepan

Poultrigo menggunakan teknologi sensor IoT terbaru yang dapat dipasang di berbagai jenis kandang, dari skala kecil hingga industri besar. Sistem cloud-based memungkinkan akses data dari mana saja dan kapan saja.

## Dampak untuk Industri

Platform ini diharapkan dapat meningkatkan produktivitas peternakan ayam Indonesia secara signifikan, sekaligus mengurangi biaya operasional dan meningkatkan kualitas produk. Dengan dukungan Machine Learning, sistem akan terus belajar dan meningkatkan akurasi prediksi seiring waktu.

## Kolaborasi dengan Institusi Terkemuka

Poultrigo bekerja sama dengan Institut Pertanian Bogor (IPB) dan mitra industri terkemuka seperti PT. Japfa untuk mengembangkan solusi yang tepat guna dan sesuai dengan kebutuhan pasar Indonesia.

Peluncuran ini menandai dimulainya era baru dalam industri peternakan ayam di Indonesia, di mana teknologi digital menjadi bagian integral dari operasional sehari-hari.
      `,
      excerpt: "Poultrigo meluncurkan platform IoT pertama di Indonesia untuk revolusi digital peternakan ayam. Pelajari bagaimana teknologi ini mengubah cara kita mengelola peternakan.",
      author: "Tim Poultrigo",
      authorId: "admin-001",
      category: "Berita",
      featuredImage: "https://images.unsplash.com/photo-1697545698404-46828377ae9d?auto=format&fit=crop&w=1200&q=80",
      published: true,
      views: 0,
      tags: ["Launch", "IoT", "Innovation", "Indonesia"],
    },
    {
      title: "Cara Mengoptimalkan Pakan Ayam dengan Machine Learning",
      content: `
# Cara Mengoptimalkan Pakan Ayam dengan Machine Learning

Pakan merupakan komponen terbesar dalam biaya operasional peternakan ayam, mencapai 60-70% dari total biaya. Dengan menggunakan teknologi Machine Learning, kita dapat mengoptimalkan penggunaan pakan secara signifikan.

## Masalah Tradisional

Peternak tradisional seringkali memberikan pakan berdasarkan estimasi atau jadwal tetap tanpa mempertimbangkan:
- Berat aktual ayam
- Umur ayam
- Kondisi kesehatan
- Pertumbuhan yang sedang terjadi

Hal ini menyebabkan pakan terbuang atau kurang optimal.

## Solusi dengan Machine Learning

Poultrigo menggunakan algoritma Machine Learning yang menganalisis:
1. **Data Historis**: Pola pertumbuhan ayam dari waktu ke waktu
2. **Data Real-time**: Berat ayam saat ini, kondisi kesehatan, dan aktivitas
3. **Faktor Eksternal**: Suhu, kelembapan, dan kondisi lingkungan

Dari analisis ini, sistem memberikan rekomendasi jumlah pakan yang tepat untuk setiap periode.

## Manfaat Nyata

Peternak yang menggunakan sistem Poultrigo melaporkan:
- Penghematan pakan hingga 25-30%
- Peningkatan pertumbuhan ayam yang lebih konsisten
- Penurunan mortalitas hingga 15%
- ROI yang lebih baik secara keseluruhan

## Cara Menerapkan

1. Pasang sensor IoT di kandang
2. Sistem akan mengumpulkan data secara otomatis
3. Machine Learning menganalisis data dan memberikan rekomendasi
4. Peternak menerima notifikasi rekomendasi pakan harian
5. Sistem belajar dari hasil dan terus meningkatkan akurasi

Dengan teknologi ini, peternak dapat fokus pada aspek lain dari operasional sementara sistem mengoptimalkan pakan secara otomatis.
      `,
      excerpt: "Pelajari bagaimana Machine Learning dapat membantu mengoptimalkan penggunaan pakan ayam, mengurangi biaya hingga 30% dan meningkatkan efisiensi peternakan.",
      author: "Dr. Ahmad Fauzi",
      authorId: "admin-001",
      category: "Tips",
      featuredImage: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      published: true,
      views: 0,
      tags: ["Machine Learning", "Pakan", "Optimasi", "Tips"],
    },
    {
      title: "5 Tips Sukses Peternakan Ayam Modern dengan Teknologi",
      content: `
# 5 Tips Sukses Peternakan Ayam Modern dengan Teknologi

Dunia peternakan ayam terus berkembang, dan teknologi menjadi kunci kesuksesan. Berikut adalah 5 tips praktis untuk sukses dalam peternakan ayam modern.

## 1. Manfaatkan IoT untuk Monitoring Real-time

Sensor IoT memungkinkan Anda memantau kondisi kandang 24/7 tanpa harus berada di lokasi. Pantau suhu, kelembapan, kadar amonia, dan status pakan secara real-time. Dengan notifikasi otomatis, Anda dapat merespons masalah dengan cepat sebelum berkembang menjadi masalah besar.

**Manfaat:**
- Deteksi masalah lebih cepat
- Mengurangi risiko penyakit
- Menghemat waktu dan tenaga

## 2. Gunakan Data untuk Keputusan yang Lebih Baik

Jangan lagi mengandalkan feeling atau pengalaman saja. Kumpulkan data dari setiap siklus produksi dan gunakan untuk membuat keputusan yang berbasis data. Analisis pola pertumbuhan, efisiensi pakan, dan tingkat mortalitas dari waktu ke waktu.

**Manfaat:**
- Keputusan lebih akurat
- Identifikasi masalah secara proaktif
- Optimasi berkelanjutan

## 3. Automatisasi Proses Rutin

Gunakan teknologi untuk mengotomasi proses-proses rutin seperti pemberian pakan, monitoring kesehatan, dan pengumpulan data. Ini membebaskan waktu Anda untuk fokus pada strategi dan pengembangan bisnis.

**Manfaat:**
- Efisiensi waktu
- Konsistensi proses
- Mengurangi human error

## 4. Implementasikan Prediksi dengan AI

Machine Learning dan AI dapat memprediksi kebutuhan pakan, potensi penyakit, dan waktu optimal untuk panen. Ini memungkinkan Anda untuk merencanakan dengan lebih baik dan mengoptimalkan hasil.

**Manfaat:**
- Perencanaan yang lebih baik
- Mengurangi waste
- Meningkatkan profitabilitas

## 5. Terus Belajar dan Beradaptasi

Teknologi terus berkembang. Ikuti perkembangan terbaru dalam teknologi peternakan, hadiri workshop, dan jangan ragu untuk mencoba solusi baru yang dapat meningkatkan efisiensi operasional Anda.

**Manfaat:**
- Tetap kompetitif
- Meningkatkan produktivitas
- Masa depan yang lebih baik

## Kesimpulan

Peternakan ayam modern membutuhkan pendekatan yang menggabungkan teknologi dengan best practices. Dengan menerapkan tips-tips di atas, Anda dapat meningkatkan efisiensi, mengurangi biaya, dan meningkatkan profitabilitas peternakan Anda.
      `,
      excerpt: "Temukan 5 tips praktis untuk sukses dalam peternakan ayam modern dengan memanfaatkan teknologi IoT, data analytics, dan automation.",
      author: "Tim Poultrigo",
      authorId: "admin-001",
      category: "Tips",
      featuredImage: "https://images.unsplash.com/photo-1694854038360-56b29a16fb0c?auto=format&fit=crop&w=1200&q=80",
      published: true,
      views: 0,
      tags: ["Tips", "Teknologi", "Peternakan Modern", "Best Practices"],
    },
    {
      title: "Update Sistem Poultrigo: Fitur Baru Dashboard Analytics",
      content: `
# Update Sistem Poultrigo: Fitur Baru Dashboard Analytics

Kami dengan bangga mengumumkan peluncuran fitur baru dalam dashboard Poultrigo: **Advanced Analytics Dashboard**. Fitur ini dirancang untuk memberikan insight yang lebih mendalam tentang operasional peternakan Anda.

## Fitur-Fitur Baru

### 1. Predictive Analytics
Dashboard sekarang dapat memprediksi tren produksi, kebutuhan pakan, dan potensi masalah hingga 30 hari ke depan berdasarkan data historis dan pola yang teridentifikasi.

### 2. Comparative Analysis
Bandingkan performa antar kandang, periode, atau siklus produksi. Identifikasi kandang dengan performa terbaik dan pelajari faktor-faktor yang berkontribusi.

### 3. Custom Reports
Buat laporan custom sesuai kebutuhan Anda. Export data dalam berbagai format (PDF, Excel, CSV) untuk analisis lebih lanjut atau presentasi.

### 4. Real-time Alerts
Sistem peringatan yang lebih cerdas dengan prioritas dan kategori. Atur notifikasi sesuai preferensi Anda agar tidak ketinggalan informasi penting.

### 5. Mobile App Integration
Akses dashboard dari aplikasi mobile dengan fitur yang sama lengkapnya. Pantau peternakan Anda dari mana saja.

## Cara Mengakses

Fitur-fitur baru ini sudah tersedia untuk semua pengguna Poultrigo. Cukup login ke dashboard Anda dan navigasi ke menu "Analytics" untuk melihat update terbaru.

## Feedback

Kami sangat menghargai feedback dari pengguna untuk terus meningkatkan platform. Jika Anda memiliki saran atau menemukan bug, silakan hubungi tim support kami.

Terima kasih telah menjadi bagian dari komunitas Poultrigo!
      `,
      excerpt: "Peluncuran fitur baru dashboard analytics dengan predictive analytics, comparative analysis, custom reports, dan integrasi mobile app.",
      author: "Tim Development Poultrigo",
      authorId: "admin-001",
      category: "Update",
      featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      published: true,
      views: 0,
      tags: ["Update", "Dashboard", "Analytics", "Feature"],
    },
    {
      title: "Tutorial: Setup Sensor IoT untuk Kandang Ayam",
      content: `
# Tutorial: Setup Sensor IoT untuk Kandang Ayam

Panduan lengkap untuk memasang dan mengkonfigurasi sensor IoT Poultrigo di kandang ayam Anda. Ikuti langkah-langkah ini untuk memastikan instalasi yang optimal.

## Persiapan

Sebelum memulai, pastikan Anda memiliki:
- Sensor IoT Poultrigo
- Power supply yang stabil
- Koneksi internet (WiFi atau kabel)
- Akses ke dashboard Poultrigo

## Langkah 1: Pilih Lokasi Sensor

Pilih lokasi strategis untuk sensor:
- **Sensor Suhu & Kelembapan**: Di tengah kandang, 1.5-2 meter dari lantai
- **Sensor Pakan**: Di dekat tempat pakan
- **Sensor Amonia**: Di area yang mudah terjadi akumulasi gas

## Langkah 2: Pasang Sensor

1. Mount sensor pada dinding atau tiang sesuai lokasi yang dipilih
2. Pastikan sensor tidak terkena air langsung
3. Sambungkan ke power supply
4. Tunggu hingga LED indicator menunjukkan status ready

## Langkah 3: Konfigurasi

1. Login ke dashboard Poultrigo
2. Masuk ke menu "Konfigurasi Sensor"
3. Pilih "Tambah Sensor Baru"
4. Scan QR code pada sensor atau masukkan ID sensor manual
5. Masukkan informasi lokasi dan nama kandang
6. Lakukan kalibrasi awal sesuai petunjuk

## Langkah 4: Verifikasi

Setelah konfigurasi:
1. Pastikan data mulai muncul di dashboard
2. Verifikasi akurasi data dengan sensor manual (jika ada)
3. Atur threshold alert sesuai kebutuhan

## Troubleshooting

### Sensor tidak terhubung
- Periksa koneksi internet
- Pastikan power supply berfungsi
- Restart sensor dan coba lagi

### Data tidak akurat
- Lakukan kalibrasi ulang
- Periksa lokasi sensor
- Bersihkan sensor dari debu atau kotoran

## Maintenance

Lakukan maintenance rutin:
- Bersihkan sensor setiap minggu
- Periksa koneksi setiap bulan
- Update firmware secara berkala

## Support

Jika mengalami masalah, hubungi tim support Poultrigo melalui:
- Email: support@poultrigo.com
- WhatsApp: +62 853 8937 1126
- Live chat di dashboard

Dengan setup yang tepat, sensor IoT akan memberikan data yang akurat dan membantu Anda mengoptimalkan operasional peternakan.
      `,
      excerpt: "Panduan lengkap step-by-step untuk memasang dan mengkonfigurasi sensor IoT Poultrigo di kandang ayam Anda dengan benar.",
      author: "Tim Teknis Poultrigo",
      authorId: "admin-001",
      category: "Tutorial",
      featuredImage: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
      published: true,
      views: 0,
      tags: ["Tutorial", "Setup", "IoT", "Sensor"],
    },
    {
      title: "Inovasi Teknologi dalam Industri Peternakan: Tren 2024",
      content: `
# Inovasi Teknologi dalam Industri Peternakan: Tren 2024

Industri peternakan mengalami transformasi besar dengan adopsi teknologi yang semakin cepat. Berikut adalah tren teknologi terbaru yang akan membentuk masa depan peternakan pada tahun 2024.

## 1. Artificial Intelligence (AI) dan Machine Learning

AI dan ML menjadi game changer dalam peternakan modern. Dari prediksi kebutuhan pakan hingga deteksi dini penyakit, AI membantu peternak membuat keputusan yang lebih baik berdasarkan data.

**Aplikasi:**
- Predictive analytics untuk produksi
- Computer vision untuk monitoring kesehatan
- Natural language processing untuk analisis data

## 2. Internet of Things (IoT) yang Lebih Cerdas

Sensor IoT menjadi lebih murah dan powerful. Generasi baru sensor dapat mengukur lebih banyak parameter dengan akurasi yang lebih tinggi dan konsumsi daya yang lebih rendah.

**Aplikasi:**
- Sensor multi-parameter yang komprehensif
- Edge computing untuk pemrosesan lokal
- Mesh networking untuk jangkauan yang lebih luas

## 3. Blockchain untuk Traceability

Blockchain memungkinkan traceability penuh dari farm to fork. Konsumen dapat melacak asal usul produk dengan mudah, meningkatkan transparansi dan kepercayaan.

**Aplikasi:**
- Supply chain transparency
- Food safety tracking
- Quality assurance

## 4. Drone dan Aerial Monitoring

Drone digunakan untuk monitoring kandang besar, inspeksi infrastruktur, dan bahkan untuk aplikasi obat atau nutrisi di area tertentu.

**Aplikasi:**
- Aerial surveillance
- Crop spraying
- Thermal imaging

## 5. Robotics dan Automation

Robot mulai mengambil alih tugas-tugas repetitif dalam peternakan, dari pemberian pakan hingga pengumpulan telur.

**Aplikasi:**
- Automated feeding systems
- Robotic milking
- Autonomous cleaning

## Dampak untuk Peternak

Tren-tren ini menciptakan peluang besar untuk:
- Meningkatkan efisiensi operasional
- Mengurangi biaya tenaga kerja
- Meningkatkan kualitas produk
- Memenuhi standar yang lebih tinggi

## Tantangan dan Solusi

Meskipun teknologi menawarkan banyak manfaat, adopsi juga menghadapi tantangan:
- **Biaya awal**: Solusi seperti Poultrigo menawarkan paket yang terjangkau
- **Kurva belajar**: Platform user-friendly dengan training yang komprehensif
- **Integrasi**: Sistem yang mudah diintegrasikan dengan infrastruktur existing

## Masa Depan

Masa depan peternakan adalah kombinasi antara teknologi canggih dan praktik terbaik. Peternak yang mengadopsi teknologi lebih awal akan memiliki keunggulan kompetitif yang signifikan.

Platform seperti Poultrigo memungkinkan peternak untuk memulai transformasi digital dengan mudah dan terjangkau, membuka jalan menuju peternakan yang lebih efisien dan profitable.
      `,
      excerpt: "Eksplorasi tren teknologi terbaru dalam industri peternakan 2024: AI, IoT, Blockchain, Drone, dan Robotics yang mengubah cara kita beternak.",
      author: "Dr. Sarah Indira",
      authorId: "admin-001",
      category: "Teknologi",
      featuredImage: "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1200&q=80",
      published: true,
      views: 0,
      tags: ["Teknologi", "Tren", "Innovation", "2024"],
    },
    {
      title: "Pengolahan Ayam Hasil Ternak: Praktik Keamanan Pangan dan Nilai Tambah",
      content: `
# Pengolahan Ayam Hasil Ternak: Praktik Keamanan Pangan dan Nilai Tambah

Pengolahan hasil ternak ayam bukan sekadar memotong dan menjual daging. Proses pengolahan yang baik meningkatkan nilai produk, memperpanjang umur simpan, dan menjamin keamanan pangan bagi konsumen.

## Tahapan Umum Pengolahan

- **Penerimaan & Seleksi**: Ayam yang diterima disortir berdasarkan umur, kondisi, dan tujuan pemrosesan (mis. pedaging vs. petelur). Ayam sakit dipisahkan.
- **Pembiusan dan Pemotongan**: Dilakukan dengan standar humanely dan sesuai regulasi keamanan pangan.
- **Plucking & Evisceration**: Pencabutan bulu dan pengeluaran organ dilakukan di area bersih untuk menghindari kontaminasi silang.
- **Pencucian dan Pendinginan**: Menurunkan suhu inti daging dengan cepat untuk memperlambat pertumbuhan mikroba.
- **Pemotongan & Pengemasan**: Daging dipotong sesuai permintaan pasar dan dikemas dalam kondisi higienis; vacuum atau MAP dapat meningkatkan shelf life.

## Standar Keamanan Pangan

Beberapa praktik untuk menjaga keamanan pangan:

- Kebersihan area dan sanitasi berkala
- Pengendalian suhu sepanjang rantai pasok
- Batch tracking untuk traceability
- Pengujian mikrobiologis (mis. Salmonella, Campylobacter)

## Nilai Tambah Produk

Dengan pengolahan yang tepat, produk dapat dikembangkan menjadi:

- Potongan premium (bone-in, boneless)
- Olahan siap masak (marinated, pre-cooked)
- Produk value-added (sosis, nugget, produk siap saji)

Peningkatan nilai ini membuka akses ke segmen pasar yang lebih baik dan margin keuntungan yang lebih tinggi.
      `,
      excerpt: "Praktik pengolahan ayam yang aman dan bagaimana menambah nilai produk hasil ternak.",
      author: "Tim Poultrigo",
      authorId: "admin-001",
      category: "Berita",
      featuredImage: "https://images.unsplash.com/photo-1604908177522-4b2f2f5d3b4d?auto=format&fit=crop&w=1200&q=80",
      published: true,
      views: 0,
      tags: ["Pengolahan", "Keamanan Pangan", "Nilai Tambah"],
    },
    {
      title: "Perbedaan: Ayam Breeding, Broiler, Petelur, dan Pedaging — Panduan Lengkap",
      content: `
# Perbedaan: Ayam Breeding, Broiler, Petelur, dan Pedaging — Panduan Lengkap

Dalam industri perunggasan ada beberapa tipe ayam yang dibudidayakan dengan tujuan berbeda. Memahami perbedaan penting untuk manajemen, pemilihan pakan, dan strategi bisnis.

## 1. Ayam Breeding (Pembibitan)

Ayam breeding adalah garis induk yang dipelihara untuk menghasilkan telur tetas atau anak (day-old chicks) yang berkualitas. Fokus utamanya adalah **genetika**, fertilitas, dan umur reproduksi.

Karakteristik:
- Dikelola pada siklus reproduksi
- Memerlukan manajemen nutrisi dan kesehatan khusus
- Infrastruktur pemeliharaan berbeda dari broiler atau petelur komersial

## 2. Broiler (Ayam Pedaging)

Broiler dibesarkan khusus untuk produksi daging dalam waktu singkat (biasanya 4–7 minggu tergantung strain). Tujuan utama adalah efisiensi konversi pakan menjadi daging.

Karakteristik:
- Pertumbuhan cepat
- Pakan tinggi energi dan protein
- Sirkulasi kandang dan manajemen lingkungan sangat penting

## 3. Petelur (Layer)

Ayam petelur dipelihara untuk produksi telur konsumen. Mereka memiliki siklus produksi telur yang panjang dan memerlukan nutrisi yang mendukung persistensi bertelur.

Karakteristik:
- Fokus pada kualitas telur dan persistensi bertelur
- Pakan diformulasikan untuk produksi telur (kalsium, fosfor)
- Manajemen reproduksi dan pencahayaan (lighting program) penting

## 4. Ayam Pedaging vs Broiler: Perbedaan Istilah

Istilah "pedaging" seringkali merujuk pada ayam yang dibesarkan untuk daging—dalam praktik komersial Indonesia ini biasanya broiler. Namun pada beberapa konteks, pedaging dapat mencakup strain yang lebih lambat tumbuh untuk pasar tertentu.

## Dampak pada Bisnis

Memilih jenis yang tepat menentukan model bisnis: siklus produksi, jenis kandang, pakan, pasar tujuan, dan modal kerja.

## Rekomendasi Singkat

- Untuk pasar daging massal: pilih strain broiler berkinerja tinggi
- Untuk peternak kecil yang fokus telur: pilih strain layer yang tahan penyakit dan produktif
- Untuk pembibitan: siapkan sumber daya untuk rekayasa genetik, manajemen reproduksi, dan biosekuriti
      `,
      excerpt: "Ringkasan perbedaan tipe ayam penting: breeding, broiler, petelur, dan pedaging beserta implikasi manajerial.",
      author: "Dr. Peternakan",
      authorId: "admin-002",
      category: "Tips",
      featuredImage: "https://images.unsplash.com/photo-1562967916-eb82221dfb36?auto=format&fit=crop&w=1200&q=80",
      published: true,
      views: 0,
      tags: ["Jenis Ayam", "Breeding", "Broiler", "Petelur"],
    },
    {
      title: "Pakan Ayam yang Baik: Ciri, Komposisi, dan Rekomendasi",
      content: `
# Pakan Ayam yang Baik: Ciri, Komposisi, dan Rekomendasi

Pakan yang tepat merupakan fondasi keberhasilan peternakan ayam. Berikut ciri pakan berkualitas dan bagaimana memilihnya.

## Ciri Pakan Berkualitas

- **Sumber bahan baku yang konsisten**: jagung, bungkil kedelai, sumber protein lain
- **Kadar nutrisi sesuai fase**: starter, grower, finisher, layer
- **Kebersihan & bebas dari aflatoksin**
- **Tekstur dan palatabilitas baik**

## Komposisi Umum (contoh untuk broiler starter)

- Energi: 3000–3200 kcal/kg
- Protein: 20–24%
- Kalsium & Fosfor: disesuaikan untuk tahap pertumbuhan
- Additive: enzim, probiotik, vitamin & mineral premix

## Rekomendasi Praktis

1. Beli dari pabrik pakan terpercaya dan minta surat analisis (SNI / spesifikasi)
2. Sesuaikan pakan menurut umur/tujuan produksi
3. Simpan pakan di tempat kering, ventilasi baik, dan rotasi stok (FIFO)
4. Pertimbangkan suplemen lokal bila perlu (mis. probiotik) untuk meningkatkan kesehatan usus

Dengan pakan yang tepat, performa tumbuh dan efisiensi pakan (FCR) akan meningkat.
      `,
      excerpt: "Panduan memilih pakan ayam berkualitas: komposisi, ciri, dan tips penyimpanan.",
      author: "Ahli Nutrisi",
      authorId: "admin-003",
      category: "Tips",
      featuredImage: "https://images.unsplash.com/photo-1603312161729-8f2f7ec9b2dd?auto=format&fit=crop&w=1200&q=80",
      published: true,
      views: 0,
      tags: ["Pakan", "FCR", "Nutrisi"],
    },
    {
      title: "Tips Memilih Bibit Ayam untuk Memulai Peternakan",
      content: `
# Tips Memilih Bibit Ayam untuk Memulai Peternakan

Memilih bibit (day-old chicks) yang tepat menentukan keberhasilan siklus produksi pertama. Berikut langkah praktis untuk memilih bibit berkualitas.

## 1. Sumber Bibit

- Pilih dari pembibitan/penyuplai resmi dengan reputasi baik (sertifikasi, rekam jejak)
- Pastikan ada jaminan kesehatan dan vaksinasi awal

## 2. Kondisi Fisik DOC

- Aktif bergerak dan responsif
- Bulu kering dan bersih
- Mata cerah, tidak ada tanda dehidrasi

## 3. Umur & Berat Rata-rata

- DOC sebaiknya homogen (rentang berat kecil)
- Berat awal yang sesuai dengan strain (lihat spesifikasi breeder)

## 4. Riwayat Vaksinasi & Biosekuriti

- Mintalah bukti vaksinasi dasar (mis. Gumboro, Marek jika relevan)
- Tanyakan tentang praktik biosekuriti di hatchery

## 5. Persiapan Kandang & Brooding

- Siapkan brooder dengan suhu, pakan, dan minum yang sesuai
- Adaptasi awal penting untuk menekan mortalitas

Dengan memilih bibit yang tepat dan persiapan brooding yang baik, Anda memberi fondasi kuat untuk produktivitas ke depan.
      `,
      excerpt: "Praktis: bagaimana memilih day-old chicks (DOC) yang sehat untuk memulai peternakan.",
      author: "Konsultan Peternakan",
      authorId: "admin-004",
      category: "Tutorial",
      featuredImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80",
      published: true,
      views: 0,
      tags: ["Bibit", "DOC", "Brooding"],
    },
    {
      title: "PT Japfa & Manajemen Peternakan Besar di Indonesia: Belajar dari Mitra Industri",
      content: `
# PT Japfa & Manajemen Peternakan Besar di Indonesia: Belajar dari Mitra Industri

PT Japfa (Japfa Comfeed) adalah salah satu pemain besar di industri perunggasan Indonesia, terlibat di berbagai rantai nilai: pembibitan, pakan, pembesaran, dan pemasaran. Bekerja sama dengan perusahaan besar seperti Japfa membuka peluang transfer knowledge dan praktik bisnis yang matang.

## Model Bisnis Terpadu (Integrated Farming)

- **Vertically integrated**: Kontrol mulai dari hatchery, pakan, hingga pemasaran yang memastikan konsistensi kualitas dan margin lebih stabil.
- **Skala Ekonomi**: Produksi besar menurunkan biaya per unit.
- **R&D & Genetika**: Investasi pada breeding dan nutrisi untuk performa ayam yang lebih baik.

## Praktik Manajemen yang Umum Digunakan

1. **Supply Chain Control**: Kontrak dengan peternak mitra, pembelian pakan terstandar.
2. **Standard Operating Procedures (SOP)**: Untuk biosekuriti, vaksinasi, dan euthanasia humanis.
3. **Monitoring & KPI**: FCR, mortalitas, berat panen, dan efisiensi pakan dipantau secara ketat.
4. **Diversifikasi Produk**: Dari komoditas mentah hingga produk olahan.

## Implikasi untuk Peternak Lokal

- Kemitraan dengan perusahaan besar memberi akses ke pasar, pembiayaan, dan teknologi.
- Namun, peternak harus menjaga independensi operasional dan negosiasi kontrak yang adil.

## Kesimpulan

Bekerja sama dengan mitra industri seperti PT Japfa dapat mempercepat adopsi praktik terbaik dan teknologi. Peternak yang cerdas akan memanfaatkan kesempatan ini untuk meningkatkan produktivitas sambil menjaga keberlanjutan usaha mereka.
      `,
      excerpt: "Ringkasan model bisnis dan manajemen peternakan besar di Indonesia dari pengalaman mitra industri seperti PT Japfa.",
      author: "Analyst Poultrigo",
      authorId: "admin-005",
      category: "Berita",
      featuredImage: "https://images.unsplash.com/photo-1580734073186-3b1a0c3fe2f2?auto=format&fit=crop&w=1200&q=80",
      published: true,
      views: 0,
      tags: ["Japfa", "Kemitraan", "Manajemen", "Peternakan Besar"],
    },
  ];

  const articlesWithDates = demoArticles.map((article) => {
    const now = new Date();
    const publishedAt = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date within last 30 days
    return {
      ...article,
      id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      publishedAt: publishedAt.toISOString(),
      updatedAt: publishedAt.toISOString(),
    };
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(articlesWithDates));
}

// Get all news articles
export function getNewsArticles(): NewsArticle[] {
  if (typeof window === "undefined") return [];
  initializeDemoNews();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Get published news articles only
export function getPublishedNews(): NewsArticle[] {
  return getNewsArticles()
    .filter((article) => article.published)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Get news article by ID
export function getNewsById(id: string): NewsArticle | undefined {
  const articles = getNewsArticles();
  return articles.find((article) => article.id === id);
}

// Save new news article
export function saveNewsArticle(
  article: Omit<NewsArticle, "id" | "publishedAt" | "updatedAt" | "views">
): NewsArticle {
  if (typeof window === "undefined") {
    throw new Error("Cannot save news on server side");
  }

  const articles = getNewsArticles();
  const now = new Date().toISOString();
  const newArticle: NewsArticle = {
    ...article,
    id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    publishedAt: now,
    updatedAt: now,
    views: 0,
  };

  articles.push(newArticle);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  return newArticle;
}

// Update news article
export function updateNewsArticle(
  id: string,
  updates: Partial<Omit<NewsArticle, "id" | "publishedAt" | "views">>
): NewsArticle | undefined {
  if (typeof window === "undefined") return undefined;

  const articles = getNewsArticles();
  const index = articles.findIndex((article) => article.id === id);
  if (index === -1) return undefined;

  articles[index] = {
    ...articles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  return articles[index];
}

// Delete news article
export function deleteNewsArticle(id: string): boolean {
  if (typeof window === "undefined") return false;

  const articles = getNewsArticles();
  const initialLength = articles.length;
  const filtered = articles.filter((article) => article.id !== id);

  if (filtered.length < initialLength) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
  return false;
}

// Increment views
export function incrementNewsViews(id: string): void {
  if (typeof window === "undefined") return;

  const articles = getNewsArticles();
  const article = articles.find((a) => a.id === id);
  if (article) {
    article.views += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }
}

// Get news by category
export function getNewsByCategory(category: NewsArticle["category"]): NewsArticle[] {
  return getPublishedNews().filter((article) => article.category === category);
}


