# Instruksi PPWL12-FE-Clone
Brief:
1. Cloning UI/UX beberapa halaman yang diberikan oleh Asdos. Halaman tersebut dari website yang sama. Cloning menggunakan AI yang dijelaskan di instruksi di bawah. 
2. Menggunakan template repo ini sebagai base, dengan Stack React-TS+TailwindCSS. Target proyek ini untuk melatih mahasiswa dalam mendesain UI menggunakan TailwindCSS & memanfaatkan state di React (untuk interaksi seperti transition carousel, popup, dsb). 
3. Deploy web ke InfinityFree, dengan alur: `GitHub (branch 'main' berubah) → (GitHub Actions build pakai Bun + Vite) → upload /dist → InfinityFree (via FTP)`. Jadi mahasiswa juga belajar rule branch protection, github action (CI/CD), pull request & git merging, & koneksi FTP.

## 1. InfinityFree (Hosting, Domain, & FTP)
> Instruksi ini untuk 1 orang perwakilan.

**Buat Akun dan Hosting**
- Login ke [infinityfree.com](https://dash.infinityfree.com/login)
    - Inifinitytree sering gagal login pakai OAuth account, jadi Pastikan Simpan username & password anda baik-baik. 
- Masuk ke tab halaman `Hosting Accounts` -> `Create Account` 
- Pilih paket `INFINITYFREE`
- Masukkan:
    - subdomain (gunakan nama anda, cth: `leoprangs`)
    - **Domain Extension** bisa pilih yang singkat (cth: `ct.ws`) biar mudah di salin/ketik. 
    - Klik `Check Availability`
- Setup **Account Label** -> **Account Password** -> **Email Concent** (I Approve) 
- Simpan **username** dan **password**. 
- Cek situs dengan `Visit Site`, jika berhasil harusnya tampil halaman **Your domain is ready!**.

**Siapkan Data FTP dari InfinityFree**
Dari panel InfinityFree, ambil:
- FTP Host (contoh: `ftpupload.net`)
- FTP Username
- FTP Password
- Directory tujuan: `htdocs/`

## 2. Setup Repo
> Instruksi ini untuk 1 orang perwakilan.

### 2.1. Buat Repo & Server
Buat repo dengan masuk ke `https://github.com/new`, nama `ppwl12-fe-clone`, salin url.

**Simpan Secrets di GitHub**
- Masuk ke repo → `Settings` → `Secrets and variables` → `Actions`
- Tambahkan secret dari InfinityFree (`New repository secret`):
```sh
FTP_SERVER
FTP_USERNAME
FTP_PASSWORD
FTP_DIR
```

**Local Setup**
```sh
git clone https://github.com/Leo42night/ppwl12-fe-clone && cd ppwl12-fe-clone
# hapus origin remote ke github Leo42night
git remote remove origin
# ganti dengan remote ke repo anda
git remote add origin https://github.com/yourUserName/ppwl12-fe-clone

# push kode ke repo anda (main hanya anda yang dapat push)
git push orign main

# buat branch dev (untuk tim bisa push, lalu `Pull Request` ke branch main)
git checkout -b dev
git push origin dev
```
Pada tab **Code** -> klik pada bagian **About** (Simbol *Gear*) -> **Website** (tempel domain InfinityFree anda `yourDomain.ct.ws`) 

> [!NOTE] 
> Pertama kali push workflow tidak akan ter-*trigger*, anda perlu push lagi untuk mentrigger workflow.
> Buka InfinityFree -> [Your Hosting] -> FileManager (Hapus file htdocs/.htaccess).
> 

<details><summary>Ada beberapa file yang dimodifkasi</summary>

#### **[1] File (deploy.yml)**

Lihat file `.github\workflow\deploy.yml`. Pada dasarnya file ini adalah konfigurasi untuk fitur Github action yang digunakan untuk melakukan proses ketika suatu event terjadi/ter-trigger. 
- Apa *trigger event* nya? Ketika ada push ke branch `main`. 
- Apa *jobs* yang dijalankan? Ada 1 jobs yang terjadi `build-test-and-deploy`. Jobs memerlukan OS server untuk menjalankan perintah, dan yang sekarang dipakai adalah `ubuntu`.
- Apa proses dalam *jobs* tersebut lakukan?
    1. *uses* template `actions/checkout@v4` & `oven-sh/setup-bun@v1` untuk checkout ke repo dan install ubuntu. 
    2. pakai bebrapa *step* manual: *install dependency*, build, & test.
    3. Terakhir, *uses* template koneksi FPT `SamKirkland/FTP-Deploy-Action@v4.3.4`, dengan parameter untuk koneksi dan target path.
**Betul!** File ini konsepnya hampir mirip dengan Dockerfile. 

#### **[2] File (vite.config.ts)**
Pastikan di `vite.config.ts`:
```ts
export default defineConfig({
  base: "./", // penting untuk hosting statis
});
```
> Kalau tidak, asset bisa error (CSS/JS tidak load di InfinityFree).
</details>

### 2.2. Ruleset: Proteksi branch main
- Masuk ke: `Repo → Settings → Rules/Rulesets → New branch ruleset` (name: `Protect branch main`)
- Bypass list: `Repository Admin`
- Target Branch: `Default` (main) 
- Branch rules:
    - ✅ Restrict updates (Hanya user dengan bypass permission (admin) yang bisa)
    - ✅ Require a pull request before merging
        - ✅ Require approvals: `1` (PR tidak bisa di-merge tanpa review)
        - ✅ Require approval of the most recent reviewable push (Orang yang push commit tidak bisa approve PR sendiri, hanya admin yang bisa approve)
    - ✅ Block force pushes (gk bisa push --force, harus merge dulu)
- klik `Create`

Efeknya:
- ❌ collaborator tidak bisa push langsung ke main
- ❌ tidak bisa merge tanpa approval
- ✅ hanya anda yang bisa approve / push

Untuk branch `dev` Tidak perlu rule → semua collaborator bebas push. Jadi kolaborator hanya bisa push ke `dev`. Jika ingin perubahan ke `main`, lakukan **Pull Request**.

## 3. Pembagian Tugas
> Instruksi ini dikerjakan semua anggota. Langkah 1 & 2 harus sudah selesai.

```sh
# lakukan clone dari repo `ppwl12-fe-clone` tim anda.
git clone https://github.com/repoPerwakilan/ppwl12-fe-clone && cd ppwl12-fe-clone

# install & lihat tampilan web saat ini
bun install
bun dev
## Tampilan sudah diberi navbar untuk berpindah halaman. Ini agar asdos dapat navigasi halaman dan mudah dalam penilaian. 
## Sudah disediakan template Page1.tsx - Page2.tsx, isi sesuai hasil clone anda. 
```
Lihat di Navigasi web pada `PageExample` ([referensi](https://universe.leagueoflegends.com/en_US/)), itu  salah satu contoh halaman. Anda dapat menghapus nya dan  dependensinya di `components/`, `lib/`, dan kode style nya di `index.css`. 

Kita akan menggunakan AI dalam web development, terutama untuk generate template dasar.
- Masuk ke https://www.insidersedge.io/ (berisi informasi berbagai web tool AI yang dapat anda coba)
- Cari "same" (tool AI untuk clone website).
- Clone url dari url website yang ditugaskan.
	- ketika anda generate, akan ada opsi generate, pilih "Clone All" untuk clone 1 halaman full.
	- Kode akan dibangun pakai next.js, jadi anda perlu ganti elemen next.js jadi pakai React biasa.
	- Anda perlu salin kode manual 1 per satu ke local (karena "download sekaligus" masih dalam fitur pro).
 - **✨Tips:** Pisahkan kode komponen dari kode pages (masukkan ke `components/`), agar tiap komponen dapat dikerjakan 1 orang saja. Dengan begitu, jika ada merging, tidak akan ada kendala *merge conflict*. 
> Liat [video tips cloing web](https://drive.google.com/file/d/1OH6GrTbvOacRhNob79uRn1jD7QF2o-In/view?usp=drive_link) ini sebagai referensi dalam cloning website nya.

## 4. Final

**Submit** url github repo. 

**Penilaian Plus [++]**
- Nilai Tim: 
    - Terdapat sharing components. Jika ada, kumpulkan dalam dir `components/`.
    - CSS terintegrasi dalam 1 file `index.css`
    - Rapikan repo, hapus file atau kode yang tidak digunakan.
- Nilai Personel: Perbaikan UI dari komponenen yang rusak. Terutama jika struktur UI yang lebih kompleks dibanding anggota lain (Cth: terdapat State khusus yang lebih kompleks dibanding anggota lain).
