/**
 * walletKeyService.js
 * Self-custodial HD wallet — key generation, derivation and encrypted storage.
 * Uses ethers v6 for HD wallet + secp256k1. TRON address encoding is manual.
 */
import { ethers } from 'ethers'

const STORAGE_KEY = 'xdt_wallet_v1'

// ── BIP44 Derivation Paths ───────────────────────────────────────────────────
const ETH_PATH  = "m/44'/60'/0'/0/0"
const TRON_PATH = "m/44'/195'/0'/0/0"

// ── Mnemonic Generation ──────────────────────────────────────────────────────
export function generateMnemonic() {
  const entropy = ethers.randomBytes(16) // 128 bits → 12 words
  return ethers.Mnemonic.entropyToPhrase(entropy)
}

export function validateMnemonic(phrase) {
  try {
    return ethers.Mnemonic.isValidMnemonic(phrase.trim())
  } catch {
    return false
  }
}

// ── ETH Wallet Derivation ────────────────────────────────────────────────────
export function deriveETHWallet(mnemonic) {
  const hd = ethers.HDNodeWallet.fromPhrase(mnemonic.trim(), undefined, ETH_PATH)
  return {
    address:    hd.address,          // checksummed 0x…
    privateKey: hd.privateKey,       // 0x…
  }
}

// ── TRON Wallet Derivation ───────────────────────────────────────────────────
export function deriveTRONWallet(mnemonic) {
  const hd = ethers.HDNodeWallet.fromPhrase(mnemonic.trim(), undefined, TRON_PATH)
  const tronAddress = ethAddressToTron(hd.address)
  return {
    address:          tronAddress,     // Base58Check T…
    privateKey:       hd.privateKey,   // 0x…
    ethStyleAddress:  hd.address,      // underlying 20-byte ETH-style hex
  }
}

/**
 * Convert an Ethereum-style checksummed address (0x + 20 bytes) to a
 * TRON Base58Check address (T…).
 * TRON address = Base58Check( 0x41 || 20-byte-body || 4-byte-checksum )
 */
export function ethAddressToTron(ethAddress) {
  const body = ethers.getBytes(ethAddress)          // 20 bytes

  // Prefix 0x41 → 21 bytes
  const raw = new Uint8Array(21)
  raw[0] = 0x41
  raw.set(body, 1)

  // Double-SHA256 checksum (first 4 bytes)
  const h1  = ethers.getBytes(ethers.sha256(raw))
  const h2  = ethers.getBytes(ethers.sha256(h1))
  const cksum = h2.slice(0, 4)

  // Concatenate → 25 bytes
  const full = new Uint8Array(25)
  full.set(raw,   0)
  full.set(cksum, 21)

  return ethers.encodeBase58(full)
}

/**
 * Convert a TRON Base58Check address to the 20-byte body in lowercase hex
 * (same bytes as the underlying Ethereum address, no 0x prefix, no 0x41 prefix).
 * Used for ABI-encoding smart-contract call parameters for TronGrid API.
 */
export function tronAddressToBodyHex(tronAddress) {
  const n      = ethers.decodeBase58(tronAddress)   // BigInt (25 bytes represented)
  const hexStr = n.toString(16).padStart(50, '0')   // exactly 50 hex chars = 25 bytes
  // First byte is 0x41, bytes 1-20 are the address body, bytes 21-24 are checksum
  return hexStr.slice(2, 42)                         // 20 bytes = 40 hex chars
}

/**
 * Convert a TRON Base58Check address to the 21-byte hex form used by TronGrid
 * API (e.g. "41a614f803…").
 */
export function tronAddressToHex21(tronAddress) {
  const n      = ethers.decodeBase58(tronAddress)
  const hexStr = n.toString(16).padStart(50, '0')
  return hexStr.slice(0, 42)                         // 21 bytes
}

// ── PIN-based Encryption / Decryption (Web Crypto AES-GCM + PBKDF2) ─────────
async function deriveKey(pin, saltBytes) {
  const enc         = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltBytes, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptMnemonic(mnemonic, pin) {
  const salt      = crypto.getRandomValues(new Uint8Array(16))
  const iv        = crypto.getRandomValues(new Uint8Array(12))
  const key       = await deriveKey(pin, salt)
  const enc       = new TextEncoder()
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(mnemonic))

  // Pack: salt(16) + iv(12) + ciphertext
  const buf = new Uint8Array(16 + 12 + encrypted.byteLength)
  buf.set(salt,                0)
  buf.set(iv,                 16)
  buf.set(new Uint8Array(encrypted), 28)
  return btoa(String.fromCharCode(...buf))
}

export async function decryptMnemonic(base64Blob, pin) {
  const buf       = Uint8Array.from(atob(base64Blob), c => c.charCodeAt(0))
  const salt      = buf.slice(0, 16)
  const iv        = buf.slice(16, 28)
  const cipher    = buf.slice(28)
  const key       = await deriveKey(pin, salt)

  try {
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher)
    return new TextDecoder().decode(decrypted)
  } catch {
    throw new Error('Wrong PIN — could not decrypt wallet')
  }
}

// ── Persistent Storage Helpers ────────────────────────────────────────────────
/**
 * Persists encrypted wallet data to localStorage.
 * @param {string} encryptedMnemonic  base64 blob from encryptMnemonic()
 * @param {string} ethAddress         checksummed ETH address
 * @param {string} tronAddress        Base58Check TRON address
 */
export function saveWalletData(encryptedMnemonic, ethAddress, tronAddress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    encryptedMnemonic,
    ethAddress,
    tronAddress,
    createdAt: Date.now(),
  }))
}

/** Returns the stored wallet record or null if none exists. */
export function loadWalletData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** Wipes the wallet from localStorage (used on "Delete Wallet" / reset). */
export function clearWalletData() {
  localStorage.removeItem(STORAGE_KEY)
}

// ── One-shot Setup Helper ─────────────────────────────────────────────────────
/**
 * Full setup flow:
 *   1. Derives ETH + TRON wallets from the mnemonic
 *   2. Encrypts the mnemonic with the PIN
 *   3. Persists to localStorage
 * Returns { ethAddress, tronAddress }
 */
export async function setupWallet(mnemonic, pin) {
  const eth  = deriveETHWallet(mnemonic)
  const tron = deriveTRONWallet(mnemonic)
  const enc  = await encryptMnemonic(mnemonic, pin)
  saveWalletData(enc, eth.address, tron.address)
  return { ethAddress: eth.address, tronAddress: tron.address }
}

/**
 * Unlock an existing wallet: decrypts the mnemonic and re-derives keys.
 * Returns { ethAddress, ethPrivateKey, tronAddress, tronPrivateKey, tronEthStyleAddress }
 */
export async function unlockWallet(pin) {
  const stored = loadWalletData()
  if (!stored) throw new Error('No wallet found')

  const mnemonic = await decryptMnemonic(stored.encryptedMnemonic, pin)
  const eth      = deriveETHWallet(mnemonic)
  const tron     = deriveTRONWallet(mnemonic)

  return {
    ethAddress:        eth.address,
    ethPrivateKey:     eth.privateKey,
    tronAddress:       tron.address,
    tronPrivateKey:    tron.privateKey,
    tronEthStyleAddress: tron.ethStyleAddress,
  }
}
