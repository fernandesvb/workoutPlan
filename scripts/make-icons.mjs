// Gera os ícones PNG do PWA sem dependências externas.
// Desenha um halter branco sobre fundo laranja e codifica o PNG na mão.
// Rodar: node scripts/make-icons.mjs
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

const BG = [11, 13, 16]
const FG = [255, 92, 41]
const WHITE = [255, 255, 255]

function crc32(buf) {
  let c
  const table = []
  for (let n = 0; n < 256; n++) {
    c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  let crc = 0xffffffff
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePng(size, pixels) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // color type: truecolor RGB
  const raw = Buffer.alloc(size * (size * 3 + 1))
  let p = 0
  for (let y = 0; y < size; y++) {
    raw[p++] = 0 // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b] = pixels[y][x]
      raw[p++] = r
      raw[p++] = g
      raw[p++] = b
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function draw(size) {
  const px = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => BG)
  )
  const u = size / 100 // unidade relativa, para escalar em qualquer tamanho
  const rect = (x, y, w, h, color) => {
    for (let j = Math.round(y * u); j < Math.round((y + h) * u); j++) {
      for (let i = Math.round(x * u); i < Math.round((x + w) * u); i++) {
        if (j >= 0 && j < size && i >= 0 && i < size) px[j][i] = color
      }
    }
  }

  // Fundo laranja com "cantos" recortados, dando o efeito de squircle simples.
  rect(0, 0, 100, 100, FG)
  const r = 22
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = Math.min(x, size - 1 - x)
      const cy = Math.min(y, size - 1 - y)
      const rr = r * u
      if (cx < rr && cy < rr) {
        const dx = rr - cx
        const dy = rr - cy
        if (dx * dx + dy * dy > rr * rr) px[y][x] = BG
      }
    }
  }

  // Halter: barra central + dois pares de anilhas.
  rect(30, 46, 40, 8, WHITE) // barra
  rect(18, 34, 9, 32, WHITE) // anilha externa esquerda
  rect(29, 39, 7, 22, WHITE) // anilha interna esquerda
  rect(64, 39, 7, 22, WHITE) // anilha interna direita
  rect(73, 34, 9, 32, WHITE) // anilha externa direita

  return px
}

mkdirSync(new URL('../public/', import.meta.url), { recursive: true })
for (const size of [192, 512, 180]) {
  const buf = encodePng(size, draw(size))
  const name = size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`
  writeFileSync(new URL(`../public/${name}`, import.meta.url), buf)
  console.log(`✓ public/${name} (${buf.length} bytes)`)
}
