import { CompanionInputFieldDropdown } from '@companion-module/base'
import { BusProperties, StripProperties, RecorderProperties, VBANInstream, VBANOutstream } from 'voicemeeter-connector'
import VoicemeeterInstance from './'

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

export type BusMode =
  | 'normal'
  | 'Amix'
  | 'Bmix'
  | 'Repeat'
  | 'Composite'
  | 'TVMix'
  | 'UpMix21'
  | 'UpMix41'
  | 'UpMix61'
  | 'CenterOnly'
  | 'LFEOnly'
  | 'RearOnly'

export interface Recorder {
  stop: boolean
  play: boolean
  fastForward: boolean
  rewind: boolean
  A1: boolean
  A2: boolean
  A3: boolean
  A4: boolean
  A5: boolean
  B1: boolean
  B2: boolean
  B3: boolean
  record: boolean
  pause: boolean
  load: boolean
  ArmStrip0: boolean
  ArmStrip1: boolean
  ArmStrip2: boolean
  ArmStrip3: boolean
  ArmStrip4: boolean
  ArmStrip5: boolean
  ArmStrip6: boolean
  ArmStrip7: boolean
  ArmStrip8: boolean
  ArmBus0: boolean
  ArmBus1: boolean
  ArmBus2: boolean
  ArmBus3: boolean
  ArmBus4: boolean
  ArmBus5: boolean
  ArmBus6: boolean
  ArmBus7: boolean
  ArmBus8: boolean
  modeRecBus: boolean
  modePlayOnLoad: boolean
  modeLoop: boolean
  modeMultiTrack: boolean
  bitResolution: 8 | 16 | 24 | 32
  channel: number
  kbps: number
  fileType: 1 | 2 | 3 | 100
  gain: number
}

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

export interface VBAN {
  on: number
  instream: VBANInstream[]
  outstream: VBANOutstream[]
}

interface VBANInstream {
  on: number
  name: number
  ip: number
  port: number
  sr: number
  channel: number
  bit: number
  quality: number
  route: number
}

interface VBANOutstream {
  on: number
  name: number
  ip: number
  port: number
  sr: number
  channel: number
  bit: number
  quality: number
  route: number
}

export interface ProxyConnection {
  disconnect(): void
  executeCommandAction(property: string, value: any): any
  executeButtonAction(index: number, property: string, value: any): any
  executeEqAction(index: number, property: string, value: any): any
  getVMState(property: string): any
  getButtonParameter(index: number, property: string): any
  getBusParameter(index: number, property: string): any
  getLevels(type: 0 | 1 | 2 | 3, id: number): any
  getRecorderParameter(property: string): any
  getStripParameter(index: number, property: string): any
  getVBANParameter(): any
  getVBANInstreamParameter(index: number, property: string): any
  getVBANOutstreamParameter(index: number, property: string): any
  setBusParameter(index: number, property: string, value: any): any
  setRecorderParameter(property: string, value: any): any
  setStripParameter(index: number, property: string, value: any): any
  setVBANParameter(value: any): any
  setVBANInstreamParameter(index: number, property: string, value: any): any
  setVBANOutstreamParameter(index: number, property: string, value: any): any
  setRaw(value: string): any
  updateDeviceList(): void
  $inputDevices: []
  $outputDevices: []
  $type: ''
  $version: ''
}

export type VoicemeeterType = 'voicemeeter' | 'voicemeeterBanana' | 'voicemeeterPotato' | ''

export const parseVersion = (raw: Buffer): string => {
  const version = parseInt(parseInt(raw.toString()).toString(16))
  const major = Math.floor(version / 1000000) % 100
  const minor = Math.floor(version / 10000) % 100
  const patch = Math.floor(version / 100) % 100
  const increment = version % 100

  if (isNaN(major) || isNaN(minor) || isNaN(patch) || isNaN(increment)) {
    return ''
  } else {
    return `${major}.${minor}.${patch}.${increment}`
  }
}

export const busName = {
  voicemeeter: ['A1', 'A2'],
  voicemeeterBanana: ['A1', 'A2', 'A3', 'B1', 'B2'],
  voicemeeterPotato: ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3'],
  '': [],
}

export const maxBus = {
  voicemeeter: 2,
  voicemeeterBanana: 5,
  voicemeeterPotato: 8,
  '': 0,
}

export const maxStrip = {
  voicemeeter: 3,
  voicemeeterBanana: 5,
  voicemeeterPotato: 8,
  '': 0,
}

export const phsyicalInputs = {
  voicemeeter: 2,
  voicemeeterBanana: 3,
  voicemeeterPotato: 5,
  '': 0,
}

export const phsicalOutputs = {
  voicemeeter: 2,
  voicemeeterBanana: 3,
  voicemeeterPotato: 5,
  '': 0,
}

export const getAllData = (instance: VoicemeeterInstance) => {
  for (let i = 0; i < maxBus[instance.type]; i++) {
    let mode: BusMode = 'normal'

    const modes = [
      ['normal', instance.connection?.getBusParameter(i, BusProperties.ModeNormal)],
      ['Amix', instance.connection?.getBusParameter(i, BusProperties.ModeAmix)],
      ['Bmix', instance.connection?.getBusParameter(i, BusProperties.ModeBmix)],
      ['Repeat', instance.connection?.getBusParameter(i, BusProperties.ModeRepeat)],
      ['Composite', instance.connection?.getBusParameter(i, BusProperties.ModeComposite)],
      ['TVMix', instance.connection?.getBusParameter(i, BusProperties.ModeTVMix)],
      ['UpMix21', instance.connection?.getBusParameter(i, BusProperties.ModeUpMix21)],
      ['UpMix41', instance.connection?.getBusParameter(i, BusProperties.ModeUpMix41)],
      ['UpMix61', instance.connection?.getBusParameter(i, BusProperties.ModeUpMix61)],
      ['CenterOnly', instance.connection?.getBusParameter(i, BusProperties.ModeCenterOnly)],
      ['LFEOnly', instance.connection?.getBusParameter(i, BusProperties.ModeLFEOnly)],
      ['RearOnly', instance.connection?.getBusParameter(i, BusProperties.ModeRearOnly)],
    ]

    modes.forEach((type) => {
      if (type[1] === 1) mode = type[0]
    })

    instance.bus[i] = {
      index: i,
      type: i < phsicalOutputs[instance.type] ? 'physical' : 'virtual',
      mono: !!instance.connection?.getBusParameter(i, BusProperties.Mono),
      mute: !!instance.connection?.getBusParameter(i, BusProperties.Mute),
      eq: !!instance.connection?.getBusParameter(i, BusProperties.EQ),
      eqAB: !!instance.connection?.getBusParameter(i, BusProperties.EQAB),
      gain: instance.connection?.getBusParameter(i, BusProperties.Gain),
      label: instance.connection?.getBusParameter(i, BusProperties.Label),
      mode,
      sel: !!instance.connection?.getBusParameter(i, BusProperties.Sel),
      returnReverb: instance.connection?.getBusParameter(i, BusProperties.ReturnReverb),
      returnDelay: instance.connection?.getBusParameter(i, BusProperties.ReturnDelay),
      returnFx1: instance.connection?.getBusParameter(i, BusProperties.ReturnFx1),
      returnFx2: instance.connection?.getBusParameter(i, BusProperties.ReturnFx2),
      monitor: instance.connection?.getBusParameter(i, BusProperties.Monitor),
      levels: instance.bus[i]?.levels || [],
      levelsHold: 0,
    }
  }

  for (let i = 0; i < maxStrip[instance.type]; i++) {
    instance.strip[i] = {
      index: i,
      type: i < phsyicalInputs[instance.type] ? 'physical' : 'virtual',
      mono: !!instance.connection?.getStripParameter(i, StripProperties.Mono),
      mute: !!instance.connection?.getStripParameter(i, StripProperties.Mute),
      solo: !!instance.connection?.getStripParameter(i, StripProperties.Solo),
      mc: !!instance.connection?.getStripParameter(i, StripProperties.MC),
      gain: instance.connection?.getStripParameter(i, StripProperties.Gain),
      gainLayer: [
        instance.connection?.getStripParameter(i, StripProperties.GainLayer0),
        instance.connection?.getStripParameter(i, StripProperties.GainLayer1),
        instance.connection?.getStripParameter(i, StripProperties.GainLayer2),
        instance.connection?.getStripParameter(i, StripProperties.GainLayer3),
        instance.connection?.getStripParameter(i, StripProperties.GainLayer4),
        instance.connection?.getStripParameter(i, StripProperties.GainLayer5),
        instance.connection?.getStripParameter(i, StripProperties.GainLayer6),
        instance.connection?.getStripParameter(i, StripProperties.GainLayer7),
      ],
      panX: instance.connection?.getStripParameter(i, StripProperties.Pan_x),
      panY: instance.connection?.getStripParameter(i, StripProperties.Pan_y),
      colorX: instance.connection?.getStripParameter(i, StripProperties.Color_x),
      colorY: instance.connection?.getStripParameter(i, StripProperties.Color_y),
      fxX: instance.connection?.getStripParameter(i, StripProperties.fx_x),
      fxY: instance.connection?.getStripParameter(i, StripProperties.fx_y),
      comp: instance.connection?.getStripParameter(i, StripProperties.Comp),
      compGainIn: instance.connection?.getStripParameter(i, StripProperties.CompGainIn),
      compRatio: instance.connection?.getStripParameter(i, StripProperties.CompRatio),
      compThreshold: instance.connection?.getStripParameter(i, StripProperties.CompThreshold),
      compAttack: instance.connection?.getStripParameter(i, StripProperties.CompAttack),
      compRelease: instance.connection?.getStripParameter(i, StripProperties.CompRelease),
      compKnee: instance.connection?.getStripParameter(i, StripProperties.CompKnee),
      compGainOut: instance.connection?.getStripParameter(i, StripProperties.CompGainOut),
      compMakeUp: instance.connection?.getStripParameter(i, StripProperties.CompMakeUp),
      gate: instance.connection?.getStripParameter(i, StripProperties.Gate),
      gateThreshold: instance.connection?.getStripParameter(i, StripProperties.GateThreshold),
      gateDamping: instance.connection?.getStripParameter(i, StripProperties.GateDamping),
      gateBPSidechain: instance.connection?.getStripParameter(i, StripProperties.GateBPSidechain),
      gateAttack: instance.connection?.getStripParameter(i, StripProperties.GateAttack),
      gateHold: instance.connection?.getStripParameter(i, StripProperties.GateHold),
      gateRelease: instance.connection?.getStripParameter(i, StripProperties.GateRelease),
      denoiser: instance.connection?.getStripParameter(i, StripProperties.Denoiser),
      karaoke: instance.connection?.getStripParameter(i, StripProperties.Karaoke),
      limit: instance.connection?.getStripParameter(i, StripProperties.Limit),
      eqGain1: instance.connection?.getStripParameter(i, StripProperties.EqGain1),
      eqGain2: instance.connection?.getStripParameter(i, StripProperties.EqGain2),
      eqGain3: instance.connection?.getStripParameter(i, StripProperties.EqGain3),
      label: instance.connection?.getStripParameter(i, StripProperties.Label),
      A1: instance.connection?.getStripParameter(i, StripProperties.A1),
      A2: instance.connection?.getStripParameter(i, StripProperties.A2),
      A3: instance.connection?.getStripParameter(i, StripProperties.A3),
      A4: instance.connection?.getStripParameter(i, StripProperties.A4),
      A5: instance.connection?.getStripParameter(i, StripProperties.A5),
      B1: instance.connection?.getStripParameter(i, StripProperties.B1),
      B2: instance.connection?.getStripParameter(i, StripProperties.B2),
      B3: instance.connection?.getStripParameter(i, StripProperties.B3),
      reverb: instance.connection?.getStripParameter(i, StripProperties.Reverb),
      delay: instance.connection?.getStripParameter(i, StripProperties.Delay),
      fx1: instance.connection?.getStripParameter(i, StripProperties.Fx1),
      fx2: instance.connection?.getStripParameter(i, StripProperties.Fx2),
      postReverb: instance.connection?.getStripParameter(i, StripProperties.PostReverb),
      postDelay: instance.connection?.getStripParameter(i, StripProperties.PostDelay),
      postFx1: instance.connection?.getStripParameter(i, StripProperties.PostFx1),
      postFx2: instance.connection?.getStripParameter(i, StripProperties.PostFx2),
      eqon: instance.connection?.getStripParameter(i, StripProperties.EQon),
      eqAB: instance.connection?.getStripParameter(i, StripProperties.EQAB),
      levels: instance.strip[i]?.levels || [],
      levelsHold: 0,
    }
  }

  instance.recorder = {
    stop: instance.connection?.getRecorderParameter(RecorderProperties.Stop),
    play: instance.connection?.getRecorderParameter(RecorderProperties.Play),
    replay: instance.connection?.getRecorderParameter(RecorderProperties.Replay),
    fastForward: instance.connection?.getRecorderParameter(RecorderProperties.FastForward),
    rewind: instance.connection?.getRecorderParameter(RecorderProperties.Rewind),
    goTo: instance.connection?.getRecorderParameter(RecorderProperties.GoTo),
    A1: instance.connection?.getRecorderParameter(RecorderProperties.A1),
    A2: instance.connection?.getRecorderParameter(RecorderProperties.A2),
    A3: instance.connection?.getRecorderParameter(RecorderProperties.A3),
    A4: instance.connection?.getRecorderParameter(RecorderProperties.A4),
    A5: instance.connection?.getRecorderParameter(RecorderProperties.A5),
    B1: instance.connection?.getRecorderParameter(RecorderProperties.B1),
    B2: instance.connection?.getRecorderParameter(RecorderProperties.B2),
    B3: instance.connection?.getRecorderParameter(RecorderProperties.B3),
    record: instance.connection?.getRecorderParameter(RecorderProperties.Record),
    pause: instance.connection?.getRecorderParameter(RecorderProperties.Pause),
    load: instance.connection?.getRecorderParameter(RecorderProperties.Load),
    ArmStrip0: instance.connection?.getRecorderParameter(RecorderProperties.ArmStrip0),
    ArmStrip1: instance.connection?.getRecorderParameter(RecorderProperties.ArmStrip1),
    ArmStrip2: instance.connection?.getRecorderParameter(RecorderProperties.ArmStrip2),
    ArmStrip3: instance.connection?.getRecorderParameter(RecorderProperties.ArmStrip3),
    ArmStrip4: instance.connection?.getRecorderParameter(RecorderProperties.ArmStrip4),
    ArmStrip5: instance.connection?.getRecorderParameter(RecorderProperties.ArmStrip5),
    ArmStrip6: instance.connection?.getRecorderParameter(RecorderProperties.ArmStrip6),
    ArmStrip7: instance.connection?.getRecorderParameter(RecorderProperties.ArmStrip7),
    ArmStrip8: instance.connection?.getRecorderParameter(RecorderProperties.ArmStrip8),
    ArmBus0: instance.connection?.getRecorderParameter(RecorderProperties.ArmBus0),
    ArmBus1: instance.connection?.getRecorderParameter(RecorderProperties.ArmBus1),
    ArmBus2: instance.connection?.getRecorderParameter(RecorderProperties.ArmBus2),
    ArmBus3: instance.connection?.getRecorderParameter(RecorderProperties.ArmBus3),
    ArmBus4: instance.connection?.getRecorderParameter(RecorderProperties.ArmBus4),
    ArmBus5: instance.connection?.getRecorderParameter(RecorderProperties.ArmBus5),
    ArmBus6: instance.connection?.getRecorderParameter(RecorderProperties.ArmBus6),
    ArmBus7: instance.connection?.getRecorderParameter(RecorderProperties.ArmBus7),
    ArmBus8: instance.connection?.getRecorderParameter(RecorderProperties.ArmBus8),
    modeRecBus: instance.connection?.getRecorderParameter(RecorderProperties.ModeRecBus),
    modePlayOnLoad: instance.connection?.getRecorderParameter(RecorderProperties.ModePlayOnLoad),
    modeLoop: instance.connection?.getRecorderParameter(RecorderProperties.ModeLoop),
    modeMultiTrack: instance.connection?.getRecorderParameter(RecorderProperties.ModeMultiTrack),
    bitResolution: instance.connection?.getRecorderParameter(RecorderProperties.BitResolution),
    channel: instance.connection?.getRecorderParameter(RecorderProperties.Channel),
    kbps: instance.connection?.getRecorderParameter(RecorderProperties.KBPS),
    fileType: instance.connection?.getRecorderParameter(RecorderProperties.FileType),
    gain: instance.connection?.getRecorderParameter(RecorderProperties.Gain),
  }

  instance.vban.on = instance.connection?.getVBANParameter()
  for (let i = 0; i < 8; i++) {
    const instream: VBANInstream = {
      on: instance.connection?.getVBANInstreamParameter(i, VBANInstream.On),
      name: instance.connection?.getVBANInstreamParameter(i, VBANInstream.Name),
      ip: instance.connection?.getVBANInstreamParameter(i, VBANInstream.IP),
      port: instance.connection?.getVBANInstreamParameter(i, VBANInstream.Port),
      sr: instance.connection?.getVBANInstreamParameter(i, VBANInstream.SR),
      channel: instance.connection?.getVBANInstreamParameter(i, VBANInstream.Channel),
      bit: instance.connection?.getVBANInstreamParameter(i, VBANInstream.Bit),
      quality: instance.connection?.getVBANInstreamParameter(i, VBANInstream.Quality),
      route: instance.connection?.getVBANInstreamParameter(i, VBANInstream.Route),
    }

    const outstream: VBANOutstream = {
      on: instance.connection?.getVBANOutstreamParameter(i, VBANOutstream.On),
      name: instance.connection?.getVBANOutstreamParameter(i, VBANOutstream.Name),
      ip: instance.connection?.getVBANOutstreamParameter(i, VBANOutstream.IP),
      port: instance.connection?.getVBANOutstreamParameter(i, VBANOutstream.Port),
      sr: instance.connection?.getVBANOutstreamParameter(i, VBANOutstream.SR),
      channel: instance.connection?.getVBANOutstreamParameter(i, VBANOutstream.Channel),
      bit: instance.connection?.getVBANOutstreamParameter(i, VBANOutstream.Bit),
      quality: instance.connection?.getVBANOutstreamParameter(i, VBANOutstream.Quality),
      route: instance.connection?.getVBANOutstreamParameter(i, VBANOutstream.Route),
    }

    instance.vban.instream[i] = instream
    instance.vban.outstream[i] = outstream
  }
}

// Force options to have a default to prevent sending undefined values
type EnforceDefault<T, U> = Omit<T, 'default'> & { default: U }

export interface Options {
  busSelect: EnforceDefault<CompanionInputFieldDropdown, number>
}

export const getOptions = (instance: VoicemeeterInstance): Options => {
  return {
    busSelect: {
      type: 'dropdown',
      label: 'Bus',
      id: 'bus',
      default: 0,
      choices: busName[instance.type].map((bus, index) => ({ id: index, label: bus })),
    },
  }
}
