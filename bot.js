import fs from "fs";
import { ethers } from "ethers";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

// --- Warna-warni di terminal ---
const WARNA = {
  RESET: "\x1b[0m",
  BIRU_TERANG: "\x1b[96m",
  HIJAU_TERANG: "\x1b[92m",
  KUNING_TERANG: "\x1b[93m",
  MERAH_TERANG: "\x1b[91m",
  PUTIH: "\x1b[97m",
};

const WARNA_TAG = {
  SYSTEM: WARNA.BIRU_TERANG,
  INFO: WARNA.HIJAU_TERANG,
  SUCCESS: WARNA.HIJAU_TERANG,
  QUEUE: WARNA.KUNING_TERANG,
  CYCLE: WARNA.KUNING_TERANG,
  WARN: WARNA.KUNING_TERANG,
  ERROR: WARNA.MERAH_TERANG,
  FATAL: WARNA.MERAH_TERANG,
  QUEUE_ERROR: WARNA.MERAH_TERANG,
  FATAL_QUEUE_ERROR: WARNA.MERAH_TERANG,
};

const HEADER_KEREN = `
███╗   ███╗ █████╗ ██╗████████╗██████╗ ██╗██╗  ██╗
████╗ ████║██╔══██╗██║╚══██╔══╝██╔══██╗██║╚██╗██╔╝
██╔████╔██║███████║██║   ██║   ██████╔╝██║ ╚███╔╝ 
██║╚██╔╝██║██╔══██║██║   ██║   ██╔══██╗██║ ██╔██╗ 
██║ ╚═╝ ██║██║  ██║██║   ██║   ██║  ██║██║██╔╝╚██╗
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
                                @ADFMIDNVIP - v2.0
`;

// File config
const FILE_PRIVATE_KEY = "privatekeys.txt";
const FILE_PROXY = "proxies.txt";

// Load wallet dan proxy
let wallets = [];
let proxies = [];

try {
  const isiPrivateKey = fs.readFileSync(FILE_PRIVATE_KEY, "utf8").trim();
  wallets = isiPrivateKey
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.trim());

  if (wallets.length === 0) {
    console.error("❌ Gagal: privatekeys.txt kosong atau cuma spasi doang.");
    process.exit(1);
  }
} catch (error) {
  console.error(`❌ Gagal baca ${FILE_PRIVATE_KEY}: ${error.message}`);
  process.exit(1);
}

try {
  const isiProxy = fs.readFileSync(FILE_PROXY, "utf8").trim();
  proxies = isiProxy
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.trim());
} catch (error) {
  console.error(`⚠ Peringatan: Gak bisa baca ${FILE_PROXY}. Bakal jalan tanpa proxy.`);
}

// Logic ganti-ganti proxy
let indexProxySekarang = 0;

function ambilProxyBerikutnya() {
  if (proxies.length === 0) return null;

  const proxy = proxies[indexProxySekarang];
  indexProxySekarang = (indexProxySekarang + 1) % proxies.length;

  return proxy;
}

function buatProxyAgent(proxyUrl) {
  if (!proxyUrl) return null;

  try {
    return new HttpsProxyAgent(proxyUrl);
  } catch (error) {
    console.error(`Error bikin proxy agent: ${error.message}`);
    return null;
  }
}

const RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc";
const ATH_ADDRESS = "0x1428444Eacdc0Fd115dd4318FcE65B61Cd1ef399";
const AI16Z_ADDRESS = "0x2d5a4f5634041f50180A25F26b2A8364452E3152";
const USDE_ADDRESS = "0xf4BE938070f59764C85fAcE374F92A4670ff3877";
const VANA_ADDRESS = "0xBEbF4E25652e7F23CCdCCcaaCB32004501c4BfF8";
const VIRTUAL_ADDRESS = "0xFF27D611ab162d7827bbbA59F140C1E7aE56e95C";
const LULUSD_ADDRESS = "0x8802b7bcF8EedCc9E1bA6C20E139bEe89dd98E83";
const AZUSD_ADDRESS = "0x5966cd11aED7D68705C9692e74e5688C892cb162";
const VANAUSD_ADDRESS = "0x46a6585a0Ad1750d37B4e6810EB59cBDf591Dc30";
const AUSD_ADDRESS = "0x78De28aABBD5198657B26A8dc9777f441551B477";
const VUSD_ADDRESS = "0xc14A8E2Fc341A97a57524000bF0F7F1bA4de4802";
const USD1_ADDRESS = "0x16a8A3624465224198d216b33E825BcC3B80abf7";

const ROUTER_ADDRESS_AUSD = "0x2cFDeE1d5f04dD235AEA47E1aD2fB66e3A61C13e";
const ROUTER_ADDRESS_VUSD = "0x3dCACa90A714498624067948C092Dd0373f08265";
const ROUTER_ADDRESS_AZUSD = "0xB0b53d8B4ef06F9Bbe5db624113C6A5D35bB7522";
const ROUTER_ADDRESS_VANAUSD = "0xEfbAE3A68b17a61f21C7809Edfa8Aa3CA7B2546f";
const STAKING_ADDRESS_AZUSD = "0xf45Fde3F484C44CC35Bdc2A7fCA3DDDe0C8f252E";
const STAKING_ADDRESS_VANAUSD = "0x2608A88219BFB34519f635Dd9Ca2Ae971539ca60";
const STAKING_ADDRESS_VUSD = "0x5bb9Fa02a3DCCDB4E9099b48e8Ba5841D2e59d51";
const STAKING_ADDRESS_AUSD = "0x054de909723ECda2d119E31583D40a52a332f85c";
const STAKING_ADDRESS_LULUSD = "0x5De3fBd40D4c3892914c3b67b5B529D776A1483A";
const STAKING_ADDRESS_USDE = "0x3988053b7c748023a1aE19a8ED4c1Bf217932bDB";
const STAKING_ADDRESS_USD1 = "0x7799841734Ac448b8634F1c1d7522Bc8887A7bB9";
const NAMA_NETWORK = "Arbitrum Sepolia";

const ERC20ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
];

const ROUTER_ABI_MINT = [
  {
    inputs: [{ type: "uint256", name: "amount" }],
    name: "customMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const STAKING_ABI = [
  {
    inputs: [{ type: "uint256", name: "amount" }],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const CONFIG_TOKEN = {
  AUSD: { routerAddress: ROUTER_ADDRESS_AUSD, selector: "0x1bf6318b", inputTokenAddress: ATH_ADDRESS, outputTokenAddress: AUSD_ADDRESS, inputTokenName: "ATH", minAmount: 50 },
  VUSD: { routerAddress: ROUTER_ADDRESS_VUSD, selector: "0xa6d67510", inputTokenAddress: VIRTUAL_ADDRESS, outputTokenAddress: VUSD_ADDRESS, inputTokenName: "Virtual", minAmount: 2 },
  AZUSD: { routerAddress: ROUTER_ADDRESS_AZUSD, selector: "0xa6d67510", inputTokenAddress: AI16Z_ADDRESS, outputTokenAddress: AZUSD_ADDRESS, inputTokenName: "Ai16Z", minAmount: 5 },
  VANAUSD: { routerAddress: ROUTER_ADDRESS_VANAUSD, selector: "0xa6d67510", inputTokenAddress: VANA_ADDRESS, outputTokenAddress: VANAUSD_ADDRESS, inputTokenName: "VANA", minAmount: 0.2 },
};

const CONFIG_STAKING = {
  AZUSD: { stakingAddress: STAKING_ADDRESS_AZUSD, tokenAddress: AZUSD_ADDRESS, tokenName: "azUSD", minAmount: 0.0001 },
  VANAUSD: { stakingAddress: STAKING_ADDRESS_VANAUSD, tokenAddress: VANAUSD_ADDRESS, tokenName: "VANAUSD", minAmount: 0.0001 },
  VUSD: { stakingAddress: STAKING_ADDRESS_VUSD, tokenAddress: VUSD_ADDRESS, tokenName: "vUSD", minAmount: 0.0001 },
  AUSD: { stakingAddress: STAKING_ADDRESS_AUSD, tokenAddress: AUSD_ADDRESS, tokenName: "AUSD", minAmount: 0.0001 },
  LULUSD: { stakingAddress: STAKING_ADDRESS_LULUSD, tokenAddress: LULUSD_ADDRESS, tokenName: "LULUSD", minAmount: 0.0001 },
  USDE: { stakingAddress: STAKING_ADDRESS_USDE, tokenAddress: USDE_ADDRESS, tokenName: "USDe", minAmount: 0.0001 },
  USD1: { stakingAddress: STAKING_ADDRESS_USD1, tokenAddress: USD1_ADDRESS, tokenName: "USD1", minAmount: 0.0001 },
};

const FAUCET_APIS = {
  ATH: "https://app.x-network.io/maitrix-faucet/faucet",
  USD1: "https://app.x-network.io/maitrix-usd1/faucet",
  USDe: "https://app.x-network.io/maitrix-usde/faucet",
  LULUSD: "https://app.x-network.io/maitrix-lvl/faucet",
  Ai16Z: "https://app.x-network.io/maitrix-ai16z/faucet",
  Virtual: "https://app.x-network.io/maitrix-virtual/faucet",
  Vana: "https://app.x-network.io/maitrix-vana/faucet",
};

const DELAY_SEBELUM_CLAIM_FAUCET = 7000;
const DELAY_SEBELUM_MINT = 5000;
const DELAY_SEBELUM_STAKE = 5000;
const DELAY_SETELAH_TRANSAKSI = 3000;
const DELAY_ANTAR_TAHAP = 10000;
const DELAY_GANTI_WALLET = 15000;
const DELAY_24_JAM = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik

let cooldownFaucet = {};

function log(pesan, tipe = "INFO", alamatWallet = null) {
  const waktu = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Jakarta" });
  const warnaTipe = WARNA_TAG[tipe] || WARNA.PUTIH;
  const warnaPesan = WARNA.PUTIH;

  const infoWallet = alamatWallet ? `[${potongAlamat(alamatWallet)}] ` : "";

  console.log(`${warnaPesan}[${waktu}] ${warnaTipe}[${tipe}]${WARNA.RESET} ${infoWallet}${warnaPesan}${pesan}${WARNA.RESET}`);
}

function potongAlamat(alamat) {
  return alamat ? `${alamat.slice(0, 6)}...${alamat.slice(-4)}` : "N/A";
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function tambahKeAntrian(asyncFunction, deskripsi, alamatWallet) {
  return asyncFunction()
    .then(async (hasil) => {
      log(`Mulai: ${deskripsi}`, "QUEUE", alamatWallet);
      try {
        const hasilAkhir = await hasil;
        log(`Selesai: ${deskripsi} - Hasil: ${hasilAkhir !== undefined ? hasilAkhir : "OK"}`, "QUEUE", alamatWallet);
        await delay(DELAY_SETELAH_TRANSAKSI);
        return hasilAkhir;
      } catch (error) {
        log(`Error di: ${deskripsi} - ${error.message}`, "QUEUE_ERROR", alamatWallet);
        return null;
      }
    })
    .catch((errorQueue) => {
      log(`Error fatal di antrian: ${errorQueue.message}`, "FATAL_QUEUE_ERROR", alamatWallet);
    });
}

async function cekBalanceToken(alamatToken, alamatPemilik, provider) {
  try {
    const kontrak = new ethers.Contract(alamatToken, ERC20ABI, provider);
    const balance = await kontrak.balanceOf(alamatPemilik);
    const decimals = await kontrak.decimals();
    return { balance, decimals, formatted: ethers.formatUnits(balance, decimals) };
  } catch (error) {
    log(`Gagal cek balance token ${potongAlamat(alamatToken)}: ${error.message}`, "ERROR", alamatPemilik);
    return { balance: 0n, decimals: 18, formatted: "0" };
  }
}

async function updateTampilanWallet(wallet, provider) {
  log("--- BALANCE WALLET ---", "INFO", wallet.address);
  const balanceETH = await provider.getBalance(wallet.address);
  log(`ETH (${NAMA_NETWORK}): ${ethers.formatEther(balanceETH)}`, "INFO", wallet.address);

  const daftarToken = {
    ATH: ATH_ADDRESS,
    Ai16Z: AI16Z_ADDRESS,
    USD1: USD1_ADDRESS,
    USDE: USDE_ADDRESS,
    VANA: VANA_ADDRESS,
    Virtual: VIRTUAL_ADDRESS,
    LULUSD: LULUSD_ADDRESS,
    azUSD: AZUSD_ADDRESS,
    VANAUSD: VANAUSD_ADDRESS,
    AUSD: AUSD_ADDRESS,
    vUSD: VUSD_ADDRESS,
  };
  for (const [nama, alamat] of Object.entries(daftarToken)) {
    if (alamat) {
      const { formatted } = await cekBalanceToken(alamat, wallet.address, provider);
      log(`${nama}: ${formatted}`, "INFO", wallet.address);
    }
  }
  log("----------------------", "INFO", wallet.address);
}

async function claimFaucet(namaToken, wallet, proxyAgent) {
  const apiUrl = FAUCET_APIS[namaToken];
  if (!apiUrl) {
    log(`API buat token ${namaToken} gak ketemu.`, "ERROR", wallet.address);
    return false;
  }

  const sekarang = Date.now();
  const keyWallet = `${wallet.address}_${namaToken}`;
  if (cooldownFaucet[keyWallet] && sekarang < cooldownFaucet[keyWallet]) {
    const waktuTunggu = Math.ceil((cooldownFaucet[keyWallet] - sekarang) / 60000);
    log(`Faucet ${namaToken} masih cooldown. Tunggu ${waktuTunggu} menit lagi.`, "INFO", wallet.address);
    return { cooldown: true, skip: true };
  }

  log(`Coba claim faucet ${namaToken}...`, "INFO", wallet.address);
  try {
    const configAxios = {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Origin: "https://app.testnet.themaitrix.ai",
      },
    };

    if (proxyAgent) {
      configAxios.httpsAgent = proxyAgent;
      configAxios.proxy = false;
    }

    const response = await axios.post(apiUrl, { address: wallet.address }, configAxios);
    const { code, message, data } = response.data;
    if (code === 200) {
      log(`Berhasil claim ${namaToken}: ${data.amount} token. Tx: ${potongAlamat(data.txHash)}`, "SUCCESS", wallet.address);
      cooldownFaucet[keyWallet] = 0;
      return true;
    } else if (code === 202) {
      const waktuTungguDetik = parseInt(data.remainTime);
      cooldownFaucet[keyWallet] = Date.now() + waktuTungguDetik * 1000;
      log(`Gagal claim ${namaToken} (cooldown): ${message}. Tunggu ${Math.ceil(waktuTungguDetik / 60)} menit.`, "WARN", wallet.address);
      return { cooldown: true, remainTime: waktuTungguDetik };
    } else {
      log(`Gagal claim ${namaToken}: ${message} (Code: ${code})`, "ERROR", wallet.address);
      return false;
    }
  } catch (error) {
    const pesanError = error.response ? JSON.stringify(error.response.data) : error.message;
    log(`Error claim ${namaToken}: ${pesanError}`, "ERROR", wallet.address);
    return false;
  }
}

async function mintToken(keyToken, wallet) {
  const config = CONFIG_TOKEN[keyToken];
  if (!config) {
    log(`Config mint buat ${keyToken} gak ketemu.`, "ERROR", wallet.address);
    return false;
  }

  const { balance: balanceInput, decimals: decimalsInput } = await cekBalanceToken(config.inputTokenAddress, wallet.address, wallet.provider);
  const minAmountWei = ethers.parseUnits(config.minAmount.toString(), decimalsInput);

  if (balanceInput < minAmountWei) {
    log(`Balance ${config.inputTokenName} (${ethers.formatUnits(balanceInput, decimalsInput)}) gak cukup buat mint ${keyToken} (butuh ${config.minAmount}).`, "INFO", wallet.address);
    return false;
  }

  const jumlahUntukMint = config.minAmount;
  log(`Coba mint ${keyToken} pake ${jumlahUntukMint} ${config.inputTokenName}...`, "INFO", wallet.address);

  try {
    const kontrakInput = new ethers.Contract(config.inputTokenAddress, ERC20ABI, wallet);
    const kontrakRouter = new ethers.Contract(config.routerAddress, ROUTER_ABI_MINT, wallet);

    const jumlahWei = ethers.parseUnits(jumlahUntukMint.toString(), decimalsInput);

    const allowance = await kontrakInput.allowance(wallet.address, config.routerAddress);
    if (allowance < jumlahWei) {
      log(`Minta approval buat ${jumlahUntukMint} ${config.inputTokenName} ke router ${potongAlamat(config.routerAddress)}...`, "INFO", wallet.address);
      const txApprove = await kontrakInput.approve(config.routerAddress, jumlahWei, { gasLimit: 150000 });
      await txApprove.wait();
      log(`Approval buat ${config.inputTokenName} berhasil. Tx: ${potongAlamat(txApprove.hash)}`, "SUCCESS", wallet.address);
    }

    const paddedAmount = ethers.zeroPadValue(ethers.toBeHex(jumlahWei), 32);
    const txData = config.selector + paddedAmount.slice(2);

    log(`Kirim transaksi mint ${keyToken}...`, "INFO", wallet.address);
    const tx = await wallet.sendTransaction({
      to: config.routerAddress,
      data: txData,
      gasLimit: 450000,
    });
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      log(`Berhasil Mint ${keyToken}. Tx: ${potongAlamat(receipt.hash)}`, "SUCCESS", wallet.address);
      return true;
    } else {
      log(`Transaksi mint ${keyToken} gagal. Tx: ${potongAlamat(receipt.hash)}`, "ERROR", wallet.address);
      return false;
    }
  } catch (error) {
    log(`Error mint ${keyToken}: ${error.message || error}`, "ERROR", wallet.address);
    return false;
  }
}

async function stakeToken(keyToken, wallet) {
  const config = CONFIG_STAKING[keyToken];
  if (!config) {
    log(`Config staking buat ${keyToken} gak ketemu.`, "ERROR", wallet.address);
    return false;
  }

  const { balance: balanceToken, decimals: decimalsToken, formatted: formattedToken } = await cekBalanceToken(config.tokenAddress, wallet.address, wallet.provider);
  const minAmountWei = ethers.parseUnits(config.minAmount.toString(), decimalsToken);

  if (balanceToken < minAmountWei || balanceToken === 0n) {
    log(`Balance ${config.tokenName} (${formattedToken}) gak cukup buat stake atau kosong (minimal ${config.minAmount}).`, "INFO", wallet.address);
    return false;
  }

  const jumlahUntukStake = formattedToken;
  log(`Coba stake semua balance ${jumlahUntukStake} ${config.tokenName}...`, "INFO", wallet.address);

  try {
    const kontrakToken = new ethers.Contract(config.tokenAddress, ERC20ABI, wallet);
    const kontrakStaking = new ethers.Contract(config.stakingAddress, STAKING_ABI, wallet);

    const jumlahWei = balanceToken;

    const allowance = await kontrakToken.allowance(wallet.address, config.stakingAddress);
    if (allowance < jumlahWei) {
      log(`Minta approval buat stake ${jumlahUntukStake} ${config.tokenName} ke ${potongAlamat(config.stakingAddress)}...`, "INFO", wallet.address);
      const txApprove = await kontrakToken.approve(config.stakingAddress, jumlahWei, { gasLimit: 150000 });
      await txApprove.wait();
      log(`Approval staking buat ${config.tokenName} berhasil. Tx: ${potongAlamat(txApprove.hash)}`, "SUCCESS", wallet.address);
    }

    log(`Kirim transaksi stake ${config.tokenName}...`, "INFO", wallet.address);
    const tx = await kontrakStaking.stake(jumlahWei, { gasLimit: 450000 });
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      log(`Berhasil stake ${jumlahUntukStake} ${config.tokenName}. Tx: ${potongAlamat(receipt.hash)}`, "SUCCESS", wallet.address);
      return true;
    } else {
      log(`Transaksi stake ${config.tokenName} gagal. Tx: ${potongAlamat(receipt.hash)}`, "ERROR", wallet.address);
      return false;
    }
  } catch (error) {
    log(`Error stake ${config.tokenName}: ${error.message || error}`, "ERROR", wallet.address);
    return false;
  }
}

async function jalankanAutoClaimSemuaFaucet(wallet, proxyAgent) {
  log("--- Mulai Cycle Claim Faucet ---", "CYCLE", wallet.address);
  const daftarToken = Object.keys(FAUCET_APIS);
  for (let i = 0; i < daftarToken.length; i++) {
    const namaToken = daftarToken[i];
    await tambahKeAntrian(() => claimFaucet(namaToken, wallet, proxyAgent), `Claim Faucet ${namaToken}`, wallet.address);
    if (i < daftarToken.length - 1) {
      await delay(DELAY_SEBELUM_CLAIM_FAUCET);
    }
  }
  log("--- Selesai Cycle Claim Faucet ---", "CYCLE", wallet.address);
}

async function jalankanAutoMintSemuaToken(wallet) {
  log("--- Mulai Cycle Mint Token ---", "CYCLE", wallet.address);
  const daftarToken = Object.keys(CONFIG_TOKEN);
  for (let i = 0; i < daftarToken.length; i++) {
    const keyToken = daftarToken[i];
    await tambahKeAntrian(() => mintToken(keyToken, wallet), `Mint Token ${keyToken}`, wallet.address);
    if (i < daftarToken.length - 1) {
      await delay(DELAY_SEBELUM_MINT);
    }
  }
  log("--- Selesai Cycle Mint Token ---", "CYCLE", wallet.address);
}

async function jalankanAutoStakeSemuaToken(wallet) {
  log("--- Mulai Cycle Stake Token ---", "CYCLE", wallet.address);
  const daftarToken = Object.keys(CONFIG_STAKING);
  for (let i = 0; i < daftarToken.length; i++) {
    const keyToken = daftarToken[i];
    await tambahKeAntrian(() => stakeToken(keyToken, wallet), `Stake Token ${keyToken}`, wallet.address);
    if (i < daftarToken.length - 1) {
      await delay(DELAY_SEBELUM_STAKE);
    }
  }
  log("--- Selesai Cycle Stake Token ---", "CYCLE", wallet.address);
}

async function prosesWallet(privateKey) {
  const proxyUrl = ambilProxyBerikutnya();
  const proxyAgent = buatProxyAgent(proxyUrl);

  const optionsProvider = {};
  if (proxyAgent) {
    optionsProvider.fetchOptions = { agent: proxyAgent };
    log(`Pake proxy: ${proxyUrl}`, "SYSTEM");
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL, undefined, optionsProvider);
  const wallet = new ethers.Wallet(privateKey, provider);

  log(`Proses wallet: ${wallet.address}`, "SYSTEM", wallet.address);
  await updateTampilanWallet(wallet, provider);

  log("Mulai Full Automation Cycle (Claim -> Mint -> Stake)...", "SYSTEM", wallet.address);

  await jalankanAutoClaimSemuaFaucet(wallet, proxyAgent);
  await delay(DELAY_ANTAR_TAHAP);
  await updateTampilanWallet(wallet, provider);

  await jalankanAutoMintSemuaToken(wallet);
  await delay(DELAY_ANTAR_TAHAP);
  await updateTampilanWallet(wallet, provider);

  await jalankanAutoStakeSemuaToken(wallet);
  await updateTampilanWallet(wallet, provider);

  log("Full Automation Cycle Selesai.", "SYSTEM", wallet.address);
}

async function prosesSemuaWallet() {
  for (let i = 0; i < wallets.length; i++) {
    const privateKey = wallets[i];

    try {
      await prosesWallet(privateKey);

      if (i < wallets.length - 1) {
        log(`Tunggu ${DELAY_GANTI_WALLET / 1000} detik sebelum proses wallet selanjutnya...`, "SYSTEM");
        await delay(DELAY_GANTI_WALLET);
      }
    } catch (error) {
      log(`Error proses wallet: ${error.message}`, "ERROR");
    }
  }
}

async function main() {
  // Tampilin Header Keren
  console.log(WARNA.BIRU_TERANG + HEADER_KEREN + WARNA.RESET);

  log("Bot Automation Mulai...", "SYSTEM");
  log(`Ketemu ${wallets.length} wallet dan ${proxies.length} proxy`, "SYSTEM");

  // Fungsi untuk menjalankan loop setiap 24 jam
  const jalankanLoop = async () => {
    try {
      log("Memulai siklus 24 jam...", "SYSTEM");
      await prosesSemuaWallet();
      log("Siklus 24 jam selesai. Akan diulang dalam 24 jam lagi.", "SYSTEM");
    } catch (error) {
      log(`Error dalam siklus 24 jam: ${error.message}`, "ERROR");
    }
  };

  // Jalankan pertama kali
  await jalankanLoop();

  // Set interval untuk looping setiap 24 jam
  setInterval(jalankanLoop, DELAY_24_JAM);
}

main().catch((error) => {
  log(`Error fatal gak kehandle: ${error.message}`, "FATAL");
  process.exit(1);
});
