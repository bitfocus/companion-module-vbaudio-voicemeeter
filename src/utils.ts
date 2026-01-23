import type { CompanionInputFieldDropdown } from '@companion-module/base'

export interface Bus {
  index: number
  type: 'physical' | 'virtual'
  mono: boolean
  mute: boolean
  eq: boolean
  eqAB: boolean
  gain: number
  label: string
  mode: BusMode
  sel: boolean
  returnReverb: number
  returnDelay: number
  returnFx1: number
  returnFx2: number
  monitor: 1 | 0
  levels: number[]
  levelsHold: number
}

export type BusMode = 'normal' | 'Amix' | 'Bmix' | 'Repeat' | 'Composite' | 'TVMix' | 'UpMix21' | 'UpMix41' | 'UpMix61' | 'CenterOnly' | 'LFEOnly' | 'RearOnly'

export interface Strip {
  index: number
  type: 'physical' | 'virtual'
  mono: boolean
  mute: boolean
  solo: boolean
  mc: boolean
  gain: number
  gainLayer: number[]
  panX: number
  panY: number
  colorX: number
  colorY: number
  fxX: number
  fxY: number
  comp: number
  compGainIn: number
  compRatio: number
  compThreshold: number
  compAttack: number
  compRelease: number
  compKnee: number
  compGainOut: number
  compMakeUp: boolean
  gate: number
  gateThreshold: number
  gateDamping: number
  gateBPSidechain: number
  gateAttack: number
  gateHold: number
  gateRelease: number
  denoiser: number
  karaoke: 0 | 1 | 2 | 3 | 4
  limit: number
  eqGain1: number
  eqGain2: number
  eqGain3: number
  label: string
  A1: boolean
  A2: boolean
  A3: boolean
  A4: boolean
  A5: boolean
  B1: boolean
  B2: boolean
  B3: boolean
  reverb: number
  delay: number
  fx1: number
  fx2: number
  postReverb: boolean
  postDelay: boolean
  postFx1: boolean
  postFx2: boolean
  eqon: boolean
  eqAB: 0 | 1
  levels: number[]
  levelsHold: number
}

export type VoicemeeterType = 'voicemeeter' | 'voicemeeterBanana' | 'voicemeeterPotato' | ''

// Force options to have a default to prevent sending undefined values
type EnforceDefault<T, U> = Omit<T, 'default'> & { default: U }

export interface Options {
  busSelect: EnforceDefault<CompanionInputFieldDropdown, number>
}

export const busName = ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3']

export const getOptions = (): Options => {
  return {
    busSelect: {
      type: 'dropdown',
      label: 'Bus',
      id: 'bus',
      default: 0,
      choices: busName.map((bus, index) => ({ id: index, label: bus })),
    },
  }
}

export const scaleValue = (value: number, fromRange: number[], toRange: number[]): number => {
  return ((value - fromRange[0]) * (toRange[1] - toRange[0])) / (fromRange[1] - fromRange[0]) + toRange[0]
}

export const decibelToLinear = (decibelVal: number): number => scaleValue(decibelVal, [-90, 19], [0, 100])

export const linearToDecibel = (linearVal: number): number => scaleValue(linearVal, [0, 100], [-90, 19])
