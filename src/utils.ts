import type { CompanionInputFieldDropdown } from '@companion-module/base'
import type VoicemeeterInstance from './index.js'

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


export type BusName = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'B1' | 'B2' | 'B3'

export const busName = ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3']

type Options = {
  adjustment: CompanionInputFieldDropdown<'adjustment'>
  bus: CompanionInputFieldDropdown<'bus'>
  busSelect: CompanionInputFieldDropdown<'bus'>
  strip: CompanionInputFieldDropdown<'strip'>
  stripSelect: CompanionInputFieldDropdown<'strip'>
  toggle: CompanionInputFieldDropdown<'type'>
}

export const options = (instance: VoicemeeterInstance): Options => {
  return {
    adjustment: {
      type: 'dropdown',
      label: 'Adjustment',
      id: 'adjustment',
      default: 'Set',
      choices: [
        { id: 'Set', label: 'Set' },
        { id: 'Increase', label: 'Increase' },
        { id: 'Decrease', label: 'Decrease' },
      ],
      expressionDescription: `Valid Values: 'Set', 'Increase', or 'Decrease'`,
    },
    bus: {
      type: 'dropdown',
      label: 'Bus',
      id: 'bus',
      default: 'A1',
      choices: busName.map((bus) => ({ id: bus, label: bus })),
      expressionDescription: `Valid Values: 'A1' to 'B3'`,
    },
    busSelect: {
      type: 'dropdown',
      label: 'Bus',
      id: 'bus',
      default: 'A1',
      choices: [...busName.map((bus) => ({ id: bus, label: bus })), { id: 'Selected', label: 'Selected' }],
      expressionDescription: `Valid Values: 'A1' to 'B3', or 'Selected'`,
    },
    strip: {
      type: 'dropdown',
      label: 'Strip',
      id: 'strip',
      default: 1,
      choices: instance.data.stripLabelUTF8c60.map((label: string, index: number) => ({
        id: index + 1,
        label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
      })),
      expressionDescription: `Valid Values: 1 to 8`,
    },
    stripSelect: {
      type: 'dropdown',
      label: 'Strip',
      id: 'strip',
      default: 1,
      choices: [
        ...instance.data.stripLabelUTF8c60.map((label: string, index: number) => ({
          id: index + 1,
          label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
        })),
        { id: 'Selected', label: 'Selected' },
      ],
      expressionDescription: `Valid Values: 1 to 8, or 'Selected'`,
    },
    toggle: {
      type: 'dropdown',
      label: 'Type',
      id: 'type',
      default: 'Toggle',
      choices: ['Toggle', 'On', 'Off'].map((type) => ({ id: type, label: type })),
      expressionDescription: `Valid Values: 'Toggle', 'On', or 'Off'`,
    },
  }
}

export const scaleValue = (value: number, fromRange: number[], toRange: number[]): number => {
  return ((value - fromRange[0]) * (toRange[1] - toRange[0])) / (fromRange[1] - fromRange[0]) + toRange[0]
}

export const decibelToLinear = (decibelVal: number): number => scaleValue(decibelVal, [-90, 19], [0, 100])

export const linearToDecibel = (linearVal: number): number => scaleValue(linearVal, [0, 100], [-90, 19])
