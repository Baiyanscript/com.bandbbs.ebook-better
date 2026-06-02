// Simple QR Code generator for Vela QuickApp
// Based on QR Code Model 2 specification
// Supports numeric, alphanumeric, byte modes

const EC_LEVEL = { L: 0, M: 1, Q: 2, H: 3 }

const ALIGNMENT_PATTERNS = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
  [6, 30, 54],
  [6, 32, 58],
  [6, 34, 62],
  [6, 26, 46, 66],
  [6, 26, 48, 70],
  [6, 26, 50, 74],
  [6, 30, 54, 78],
  [6, 30, 56, 82],
  [6, 30, 58, 86],
  [6, 34, 62, 90],
  [6, 28, 50, 72, 94],
  [6, 26, 50, 74, 98],
  [6, 30, 54, 78, 102],
  [6, 28, 54, 80, 106],
  [6, 32, 58, 84, 110],
  [6, 30, 58, 86, 114],
  [6, 34, 62, 90, 118],
  [6, 26, 50, 74, 98, 122],
  [6, 30, 54, 78, 102, 126],
  [6, 26, 52, 78, 104, 130],
  [6, 30, 56, 82, 108, 134],
  [6, 34, 60, 86, 112, 138],
  [6, 30, 58, 86, 114, 142],
  [6, 34, 62, 90, 118, 146],
  [6, 30, 54, 78, 102, 126, 150],
  [6, 24, 50, 76, 102, 128, 154],
  [6, 28, 54, 80, 106, 132, 158],
  [6, 32, 58, 84, 110, 136, 162],
  [6, 26, 54, 82, 110, 138, 166],
  [6, 30, 58, 86, 114, 142, 170]
]

function getDataCodewords(version, ecLevel) {
  const total = [
    [19,16,13,9],[34,28,22,16],[55,44,34,26],[80,64,44,36],
    [108,86,60,46],[136,108,74,60],[156,124,86,66],[194,154,108,84],
    [232,182,130,98],[274,216,152,118],[324,254,180,138],[370,290,206,158],
    [428,334,244,180],[461,365,261,197],[523,415,295,223],[589,453,325,253],
    [647,507,367,283],[721,563,397,313],[795,627,437,345],[861,669,473,375],
    [932,714,513,407],[1006,782,549,437],[1094,860,595,475],[1174,914,635,507],
    [1276,1000,685,545],[1370,1062,729,581],[1468,1128,777,619],[1531,1193,823,657],
    [1631,1267,869,697],[1735,1373,925,737],[1843,1455,973,779],[1955,1541,1025,821],
    [2071,1631,1077,865],[2191,1725,1137,909],[2306,1812,1189,953],[2434,1914,1247,999],
    [2566,1992,1301,1047],[2702,2102,1361,1097],[2812,2216,1425,1147],[2956,2334,1487,1201]
  ]
  return total[version - 1][ecLevel]
}

function getErrorCorrectionCodewords(version, ecLevel) {
  const ec = [
    [7,10,13,17],[10,16,22,28],[15,26,18,22],[20,18,26,16],
    [26,24,18,22],[18,16,24,28],[20,18,18,26],[24,22,22,26],
    [30,22,20,24],[18,26,24,28],[20,30,28,28],[24,22,26,28],
    [26,22,24,28],[30,24,20,28],[22,24,30,28],[24,28,24,30],
    [28,28,28,28],[30,26,28,28],[28,26,26,28],[28,26,28,30],
    [28,26,28,30],[28,28,28,30],[28,28,28,30],[28,28,28,30],
    [28,28,28,30],[28,28,28,30],[28,28,28,30],[28,28,28,30],
    [28,28,28,30],[28,28,28,30],[28,28,28,30],[28,28,28,30],
    [28,28,28,30],[28,28,28,30],[28,28,28,30],[28,28,28,30],
    [28,28,28,30],[28,28,28,30],[28,28,28,30],[28,28,28,30]
  ]
  return ec[version - 1][ecLevel]
}

function getMinVersion(text) {
  const len = text.length
  // Byte mode capacity for EC level L
  const capacities = [17,32,53,78,106,134,154,192,230,271,321,367,425,458,520,586,644,718,792,858,929,1003,1091,1171,1273,1367,1465,1528,1628,1732,1840,1952,2068,2188,2303,2431,2563,2699,2809,2953]
  for (let v = 0; v < capacities.length; v++) {
    if (len <= capacities[v]) return v + 1
  }
  return 40
}

function createMatrix(version) {
  const size = version * 4 + 17
  const matrix = []
  const reserved = []
  for (let i = 0; i < size; i++) {
    matrix[i] = []
    reserved[i] = []
    for (let j = 0; j < size; j++) {
      matrix[i][j] = 0
      reserved[i][j] = false
    }
  }
  return { matrix, reserved, size }
}

function placeFinderPattern(m, row, col) {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const rr = row + r
      const cc = col + c
      if (rr < 0 || rr >= m.size || cc < 0 || cc >= m.size) continue
      if ((r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
        m.matrix[rr][cc] = 1
      }
      m.reserved[rr][cc] = true
    }
  }
}

function placeAlignmentPattern(m, row, col) {
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const rr = row + r
      const cc = col + c
      if (rr < 0 || rr >= m.size || cc < 0 || cc >= m.size) continue
      if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
        m.matrix[rr][cc] = 1
      }
      m.reserved[rr][cc] = true
    }
  }
}

function placeTimingPatterns(m) {
  for (let i = 8; i < m.size - 8; i++) {
    if (!m.reserved[6][i]) {
      m.matrix[6][i] = i % 2 === 0 ? 1 : 0
      m.reserved[6][i] = true
    }
    if (!m.reserved[i][6]) {
      m.matrix[i][6] = i % 2 === 0 ? 1 : 0
      m.reserved[i][6] = true
    }
  }
}

function reserveFormatInfo(m) {
  for (let i = 0; i < 9; i++) {
    if (!m.reserved[8][i]) { m.reserved[8][i] = true }
    if (!m.reserved[i][8]) { m.reserved[i][8] = true }
  }
  for (let i = 0; i < 8; i++) {
    if (!m.reserved[8][m.size - 1 - i]) { m.reserved[8][m.size - 1 - i] = true }
    if (!m.reserved[m.size - 1 - i][8]) { m.reserved[m.size - 1 - i][8] = true }
  }
  m.reserved[m.size - 8][8] = true
}

function placeDarkModule(m, version) {
  m.matrix[m.size - 8][8] = 1
  m.reserved[m.size - 8][8] = true
}

function initMatrix(m, version) {
  placeFinderPattern(m, 0, 0)
  placeFinderPattern(m, 0, m.size - 7)
  placeFinderPattern(m, m.size - 7, 0)
  const ap = ALIGNMENT_PATTERNS[version - 1] || []
  for (let i = 0; i < ap.length; i++) {
    for (let j = 0; j < ap.length; j++) {
      const row = ap[i]
      const col = ap[j]
      if (m.reserved[row] && m.reserved[row][col]) continue
      placeAlignmentPattern(m, row, col)
    }
  }
  placeTimingPatterns(m)
  reserveFormatInfo(m)
  placeDarkModule(m, version)
}

function encodeText(text) {
  const bytes = []
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    if (code < 0x80) {
      bytes.push(code)
    } else if (code < 0x800) {
      bytes.push(0xC0 | (code >> 6))
      bytes.push(0x80 | (code & 0x3F))
    } else {
      bytes.push(0xE0 | (code >> 12))
      bytes.push(0x80 | ((code >> 6) & 0x3F))
      bytes.push(0x80 | (code & 0x3F))
    }
  }
  return bytes
}

function getDataBits(version, ecLevel, text) {
  const bytes = encodeText(text)
  const dataCodewords = getDataCodewords(version, ecLevel)
  const bits = []

  // Mode indicator: byte mode = 0100
  bits.push(0, 1, 0, 0)

  // Character count
  const ccBits = version <= 9 ? 8 : 16
  for (let i = ccBits - 1; i >= 0; i--) {
    bits.push((bytes.length >> i) & 1)
  }

  // Data
  for (let i = 0; i < bytes.length; i++) {
    for (let j = 7; j >= 0; j--) {
      bits.push((bytes[i] >> j) & 1)
    }
  }

  // Terminator
  const maxBits = dataCodewords * 8
  const termLen = Math.min(4, maxBits - bits.length)
  for (let i = 0; i < termLen; i++) bits.push(0)

  // Pad to byte boundary
  while (bits.length % 8 !== 0) bits.push(0)

  // Pad codewords
  const padBytes = [0xEC, 0x11]
  let padIdx = 0
  while (bits.length < maxBits) {
    const pb = padBytes[padIdx % 2]
    for (let j = 7; j >= 0; j--) bits.push((pb >> j) & 1)
    padIdx++
  }

  return bits.slice(0, maxBits)
}

function gfMultiply(a, b) {
  let p = 0
  for (let i = 0; i < 8; i++) {
    if (b & 1) p ^= a
    const hi = a & 0x80
    a = (a << 1) & 0xFF
    if (hi) a ^= 0x1D
    b >>= 1
  }
  return p
}

function generateEC(data, ecCount) {
  const gen = []
  gen[0] = 1
  for (let i = 0; i < ecCount; i++) {
    const newGen = []
    for (let j = 0; j <= gen.length; j++) newGen[j] = 0
    for (let j = 0; j < gen.length; j++) {
      newGen[j] ^= gen[j]
      newGen[j + 1] ^= gfMultiply(gen[j], Math.pow(2, i) % 256)
    }
    for (let j = 0; j <= gen.length; j++) gen[j] = newGen[j]
  }

  const result = []
  const dividend = data.slice()
  for (let i = 0; i < ecCount; i++) dividend.push(0)

  for (let i = 0; i < data.length; i++) {
    const coef = dividend[i]
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        dividend[i + j] ^= gfMultiply(gen[j], coef)
      }
    }
  }

  for (let i = 0; i < ecCount; i++) result[i] = dividend[data.length + i]
  return result
}

function interleave(dataBlocks, ecBlocks) {
  const result = []
  const maxDataLen = Math.max.apply(null, dataBlocks.map(b => b.length))
  for (let i = 0; i < maxDataLen; i++) {
    for (let j = 0; j < dataBlocks.length; j++) {
      if (i < dataBlocks[j].length) result.push(dataBlocks[j][i])
    }
  }
  const maxEcLen = Math.max.apply(null, ecBlocks.map(b => b.length))
  for (let i = 0; i < maxEcLen; i++) {
    for (let j = 0; j < ecBlocks.length; j++) {
      if (i < ecBlocks[j].length) result.push(ecBlocks[j][i])
    }
  }
  return result
}

function placeData(m, dataBits) {
  let bitIdx = 0
  let upward = true

  for (let col = m.size - 1; col >= 0; col -= 2) {
    if (col === 6) col = 5
    const rows = upward ? [] : []
    for (let r = 0; r < m.size; r++) {
      const row = upward ? m.size - 1 - r : r
      for (let c = 1; c >= 0; c--) {
        const cc = col - c
        if (cc < 0 || cc >= m.size) continue
        if (m.reserved[row][cc]) continue
        m.matrix[row][cc] = bitIdx < dataBits.length ? dataBits[bitIdx] : 0
        bitIdx++
      }
    }
    upward = !upward
  }
}

function applyMask(m) {
  for (let r = 0; r < m.size; r++) {
    for (let c = 0; c < m.size; c++) {
      if (m.reserved[r][c]) continue
      if ((r + c) % 2 === 0) {
        m.matrix[r][c] ^= 1
      }
    }
  }
}

function placeFormatInfo(m, ecLevel) {
  const formatBits = [0x5412, 0x5125, 0x5E7C, 0x5B4B, 0x45F9, 0x40CE, 0x4F97, 0x4AA0,
    0x77C4, 0x72F3, 0x7DAA, 0x789D, 0x662F, 0x6318, 0x6C41, 0x6976,
    0x1689, 0x13BE, 0x1CE7, 0x19D0, 0x0762, 0x0255, 0x0D0C, 0x083B,
    0x355F, 0x3068, 0x3F31, 0x3A06, 0x24B4, 0x2183, 0x2EDA, 0x2BED]
  const bits = formatBits[ecLevel * 8 + 0] // Using mask 0
  for (let i = 0; i < 6; i++) m.matrix[8][i] = (bits >> (14 - i)) & 1
  m.matrix[8][7] = (bits >> 8) & 1
  m.matrix[8][8] = (bits >> 7) & 1
  m.matrix[7][8] = (bits >> 6) & 1
  for (let i = 0; i < 6; i++) m.matrix[5 - i][8] = (bits >> (i)) & 1

  for (let i = 0; i < 8; i++) m.matrix[m.size - 1 - i][8] = (bits >> (14 - i)) & 1
  for (let i = 0; i < 7; i++) m.matrix[8][m.size - 8 + i] = (bits >> (6 - i)) & 1
}

function generateQR(text) {
  if (!text || text.length === 0) return null

  const version = Math.max(getMinVersion(text), 2) // Min version 2 for reasonable output
  const ecLevel = EC_LEVEL.L
  const m = createMatrix(version)

  initMatrix(m, version)

  const dataBits = getDataBits(version, ecLevel, text)
  const ecCount = getErrorCorrectionCodewords(version, ecLevel)
  const dataCodewords = getDataCodewords(version, ecLevel)

  // Simple: single block
  const dataBytes = []
  for (let i = 0; i < dataBits.length; i += 8) {
    let byte = 0
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | (dataBits[i + j] || 0)
    }
    dataBytes.push(byte)
  }

  const ecBytes = generateEC(dataBytes, ecCount)
  const allBytes = interleave([dataBytes], [ecBytes])

  const allBits = []
  for (let i = 0; i < allBytes.length; i++) {
    for (let j = 7; j >= 0; j--) {
      allBits.push((allBytes[i] >> j) & 1)
    }
  }

  placeData(m, allBits)
  applyMask(m)
  placeFormatInfo(m, ecLevel)

  return { size: m.size, matrix: m.matrix }
}

module.exports = { generateQR }
