# Maitrix-v1.0

Skrip otomatisasi ini untuk berinteraksi dengan berbagai faucet dan protokol staking di jaringan Arbitrum Sepolia. Bot ini dirancang untuk mengelola banyak dompet, mengklaim token dari faucet, melakukan minting token, dan men-stake token yang diperoleh secara otomatis.

## ✨ Fitur

* **Manajemen Multi-Dompet**: Memproses beberapa dompet dari file `privatekeys.txt`.
* **Dukungan Proxy**: Mendukung penggunaan proksi dari file `proxies.txt` dengan rotasi proksi.
* **Klaim Faucet Otomatis**: Mengklaim token dari berbagai faucet yang dikonfigurasi.
    * ATH
    * USDe
    * LULUSD
    * Ai16Z
    * Virtual
    * Vana
* **Minting Token Otomatis**: Melakukan minting token turunan seperti AUSD, VUSD, AZUSD, dan VANAUSD.
* **Staking Token Otomatis**: Men-stake token yang telah di-mint atau diperoleh seperti AZUSD, VANAUSD, VUSD, AUSD, LULUSD, dan USDE.
* **Logging Berwarna**: Output log yang jelas dan mudah dibaca dengan tag berwarna untuk status yang berbeda.
* **Penanganan Error**: Mekanisme penanganan error dan coba lagi yang tangguh.
* **Konfigurasi Jeda**: Jeda waktu yang dapat dikonfigurasi antar operasi untuk menghindari pembatasan rate.
* **Tampilan Saldo**: Menampilkan saldo token dan ETH untuk setiap dompet sebelum dan sesudah siklus operasi.

## 🔧 Prasyarat

* [Node.js](https://nodejs.org/) (versi 16 atau lebih tinggi direkomendasikan)
* NPM (biasanya terinstal bersama Node.js)
* Git (opsional, untuk kloning repositori)

## ⚙️ Setup dan Instalasi

1.  **Kloning Repositori (jika ada):**
    ```bash
    git clone https://github.com/AirdropFamilyIDN-V2-0/Maitrix-v1.0
    cd Maitrix
    ```

2.  **Instal Dependensi:**
    ```bash
    npm install ethers axios https-proxy-agent fs
    ```

## 📄 Konfigurasi

Sebelum menjalankan skrip, Anda perlu membuat dan mengisi file konfigurasi berikut di direktori root proyek:

1.  **`privatekeys.txt`**:
    * Berisi daftar private key dompet Anda, satu private key per baris.
    * **Pastikan untuk menjaga file ini tetap aman dan jangan pernah membagikannya.**
    * Contoh:
        ```
        0xprivatkeydompet1................................................
        0xprivatkeydompet2................................................
        ```

2.  **`proxies.txt` (Opsional)**:
    * Berisi daftar proksi Anda, satu proksi per baris. Jika file ini tidak ada atau kosong, skrip akan berjalan tanpa proksi.
    * Format proksi: `http://user:pass@host:port` atau `http://host:port`.
    * Contoh:
        ```
        [http://username:password@proxy.example.com:8080](http://username:password@proxy.example.com:8080)
        [http://192.168.1.100:3128](http://192.168.1.100:3128)
        ```

**Konfigurasi Internal Skrip (jika perlu diubah):**

* **`RPC_URL`**: URL RPC untuk jaringan Arbitrum Sepolia (default: `https://sepolia-rollup.arbitrum.io/rpc`).
* **Alamat Kontrak**: Skrip berisi alamat kontrak untuk token, router, dan staking. Ubah hanya jika Anda tahu apa yang Anda lakukan.
* **Jeda Waktu**: Konstanta seperti `DELAY_BETWEEN_FAUCET_CLAIMS`, `DELAY_BETWEEN_MINT_OPERATIONS`, dll., dapat disesuaikan di dalam skrip untuk mengubah waktu tunggu antar operasi.

## ▶️ Cara Menjalankan

Setelah konfigurasi selesai, jalankan skrip menggunakan Node.js:

```bash
node main.js
