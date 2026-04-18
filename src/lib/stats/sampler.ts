export type StatTransform = 'linear' | 'log' | 'exp'

export type SamplerConfig = {
  name?: string
  color?: string
  /**
   * Function that returns the current value of the stat
   */
  sample: () => number

  /**
   * Smoothing factor for EMA calculation.
   *
   * @remarks
   * 0 is no smoothing, 0.9 is heavy smoothing. Don't set to 1 or it will never update! Default is 0 (no smoothing).
   */
  smoothing?: number

  /**
   * Expected minimum value for display. Used for normalization and auto-ranging. Default is 0.
   */
  min?: number

  /**
   * Expected maximum value for display. Used for normalization and auto-ranging. Default is 1.
   */
  max?: number

  transform?: StatTransform
}

export interface Sampler {
  color?: string

  smoothing: number
  transform: (v: number) => number
  min: number
  max: number

  sample: () => number

  value: number | null
  normalized: number

  // --- canonical ring buffer ---
  buffer: Float32Array
  head: number
  count: number
  index: number

  // --- O(1) average ---
  sum: number
  avg: number

  // --- monotonic queues ---
  minDeque: Float32Array
  maxDeque: Float32Array
  minIdx: Uint32Array
  maxIdx: Uint32Array

  minHead: number
  minTail: number
  maxHead: number
  maxTail: number

  minSeen: number
  maxSeen: number
}

export function sampler(config: SamplerConfig, size: number): Sampler {
  const sampler: Sampler = {
    color: config.color,

    smoothing: config.smoothing ?? 0,
    transform: linearTransform,
    min: config.min ?? 0,
    max: config.max ?? 1,

    value: null,
    normalized: 0,

    buffer: new Float32Array(size),
    head: 0,
    count: 0,
    index: 0,

    sum: 0,
    avg: 0,

    minDeque: new Float32Array(size),
    maxDeque: new Float32Array(size),
    minIdx: new Uint32Array(size),
    maxIdx: new Uint32Array(size),

    minHead: 0,
    minTail: 0,
    maxHead: 0,
    maxTail: 0,

    minSeen: Infinity,
    maxSeen: -Infinity,

    sample: () => processValue(config.sample(), sampler),
  }
  switch (config.transform) {
    case 'log':
      sampler.transform = logTransform
      break
    case 'exp':
      sampler.transform = expTransform
      break
    default:
      sampler.transform = linearTransform
      break
  }
  return sampler
}

function logTransform(v: number): number {
  return Math.log10(1 + Math.max(0, v))
}

function expTransform(v: number): number {
  return Math.exp(v) - 1
}

function linearTransform(v: number): number {
  return v
}

function processValue(sample: number, s: Sampler): number {
  // --- EMA ---
  if (s.value == null) {
    s.value = sample
  } else {
    const a = s.smoothing
    s.value = a * s.value + (1 - a) * sample
  }

  const v = s.value
  const i = s.index++
  const size = s.buffer.length

  // --- remove outgoing value (for avg) ---
  if (s.count === size) {
    const old = s.buffer[s.head]
    s.sum -= old
  } else {
    s.count++
  }

  // --- write new value ---
  s.buffer[s.head] = v
  s.head = (s.head + 1) % size

  // --- update sum / avg ---
  s.sum += v
  s.avg = s.sum / s.count

  // --- MIN QUEUE ---
  while (s.minHead !== s.minTail) {
    const last = (s.minTail - 1 + size) % size
    if (s.minDeque[last] <= v) break
    s.minTail = last
  }

  s.minDeque[s.minTail] = v
  s.minIdx[s.minTail] = i
  s.minTail = (s.minTail + 1) % size

  while (s.minHead !== s.minTail && s.minIdx[s.minHead] <= i - size) {
    s.minHead = (s.minHead + 1) % size
  }

  // --- MAX QUEUE ---
  while (s.maxHead !== s.maxTail) {
    const last = (s.maxTail - 1 + size) % size
    if (s.maxDeque[last] >= v) break
    s.maxTail = last
  }

  s.maxDeque[s.maxTail] = v
  s.maxIdx[s.maxTail] = i
  s.maxTail = (s.maxTail + 1) % size

  while (s.maxHead !== s.maxTail && s.maxIdx[s.maxHead] <= i - size) {
    s.maxHead = (s.maxHead + 1) % size
  }

  // --- current window min/max ---
  const winMin = s.minHead !== s.minTail ? s.minDeque[s.minHead] : s.min

  const winMax = s.maxHead !== s.maxTail ? s.maxDeque[s.maxHead] : s.max

  s.minSeen = winMin
  s.maxSeen = winMax

  // --- normalization ---
  const t = s.transform

  const tv = t(v)
  const tmin = t(Math.min(s.min, winMin))
  const tmax = t(Math.max(s.max, winMax))

  const denom = tmax - tmin || 1
  const norm = (tv - tmin) / denom

  s.normalized = Math.max(0, Math.min(1, norm))
  return s.normalized
}
