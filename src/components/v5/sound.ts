/*
 * The drone's sound, synthesised (no recordings): a motor hum made of two
 * slightly detuned sawtooth oscillators through a low-pass filter that opens
 * as the drone speeds up, and a two-note chime on reaching a waypoint. Off
 * until asked for; an AudioContext can only start from a click anyway.
 */
export class Engine {
  private ctx: AudioContext | null = null
  private gain: GainNode | null = null
  private filter: BiquadFilterNode | null = null
  private oscs: OscillatorNode[] = []

  start() {
    if (this.ctx) return
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 380
    filter.Q.value = 6
    const gain = ctx.createGain()
    gain.gain.value = 0
    filter.connect(gain).connect(ctx.destination)
    this.oscs = [72, 72.9, 144.4].map((f, i) => {
      const o = ctx.createOscillator()
      o.type = i === 2 ? 'triangle' : 'sawtooth'
      o.frequency.value = f
      o.connect(filter)
      o.start()
      return o
    })
    gain.gain.setTargetAtTime(0.025, ctx.currentTime, 0.2)
    this.ctx = ctx
    this.gain = gain
    this.filter = filter
  }

  /** 0 (hover) … 1 (full speed). */
  speed(v: number) {
    const c = this.ctx
    if (!c || !this.gain || !this.filter) return
    const t = c.currentTime
    this.oscs.forEach((o, i) => o.frequency.setTargetAtTime((i === 2 ? 144 : 72 + i * 0.9) * (1 + v * 0.9), t, 0.12))
    this.filter.frequency.setTargetAtTime(380 + v * 1500, t, 0.12)
    this.gain.gain.setTargetAtTime(0.025 + v * 0.045, t, 0.15)
  }

  chime() {
    const c = this.ctx
    if (!c) return
    ;[1046.5, 1568].forEach((f, i) => {
      const o = c.createOscillator()
      const g = c.createGain()
      o.type = 'sine'
      o.frequency.value = f
      const t = c.currentTime + i * 0.11
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.09, t + 0.015)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32)
      o.connect(g).connect(c.destination)
      o.start(t)
      o.stop(t + 0.35)
    })
  }

  stop() {
    const c = this.ctx
    if (!c || !this.gain) return
    this.gain.gain.setTargetAtTime(0, c.currentTime, 0.08)
    const ctx = c
    setTimeout(() => ctx.close(), 400)
    this.ctx = null
    this.gain = null
    this.filter = null
    this.oscs = []
  }
}
