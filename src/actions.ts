import type { CompanionActionEvent, SomeCompanionActionInputField } from '@companion-module/base'
import type VoicemeeterInstance from './index'
import { getOptions } from './utils'

export interface VoicemeeterActions {
  busEQ: VoicemeeterAction<BusEQCallback>
  busEQAB: VoicemeeterAction<BusEQABCallback>
  busGain: VoicemeeterAction<BusGainCallback>
  busMode: VoicemeeterAction<BusModeCallback>
  busMonitor: VoicemeeterAction<BusMonitorCallback>
  busMono: VoicemeeterAction<BusMonoCallback>
  busMute: VoicemeeterAction<BusMuteCallback>
  busReturns: VoicemeeterAction<BusReturnsCallback>
  busSel: VoicemeeterAction<BusSelCallback>
  commandActions: VoicemeeterAction<CommandActionsCallback>
  macroButton: VoicemeeterAction<MacroButtonCallback>
  rawCommand: VoicemeeterAction<RawCommandCallback>
  recorderArm: VoicemeeterAction<RecorderArmCallback>
  recorderArmInputOutput: VoicemeeterAction<RecorderArmInputOutputCallback>
  recorderGain: VoicemeeterAction<RecorderGainCallback>
  recorderLoadTrack: VoicemeeterAction<RecorderLoadTrackCallback>
  recorderState: VoicemeeterAction<RecorderStateCallback>
  routeAudio: VoicemeeterAction<RouteAudioCallback>
  stripCompressor: VoicemeeterAction<StripCompressorCallback>
  stripDenoiser: VoicemeeterAction<StripDenoiserCallback>
  stripEQGain: VoicemeeterAction<StripEQGainCallback>
  stripGain: VoicemeeterAction<StripGainCallback>
  stripGate: VoicemeeterAction<StripGateCallback>
  stripMono: VoicemeeterAction<StripMonoCallback>
  stripMute: VoicemeeterAction<StripMuteCallback>
  stripSolo: VoicemeeterAction<StripSoloCallback>
  utilSelectBus: VoicemeeterAction<UtilSelectBusCallback>
  utilSelectStrip: VoicemeeterAction<UtilSelectStripCallback>
  vbanSettings: VoicemeeterAction<VbanSettingsCallback>

  // Index signature
  [key: string]: VoicemeeterAction<any>
}

interface BusEQCallback {
  actionId: 'busEQ'
  options: Readonly<{
    type: 'Toggle' | 'On' | 'Off'
    bus: number
  }>
}

interface BusEQABCallback {
  actionId: 'busEQAB'
  options: Readonly<{
    mode: 'Toggle' | 'A' | 'B'
    bus: number
  }>
}

interface BusGainCallback {
  actionId: 'busGain'
  options: Readonly<{
    bus: number
    adjustment: 'Set' | 'Increase' | 'Decrease'
    fade: string
    value: string
  }>
}

interface BusModeCallback {
  actionId: 'busMode'
  options: Readonly<{
    mode: 'normal' | 'Amix' | 'Bmix' | 'Repeat' | 'Composite' | 'TVMix' | 'UpMix21' | 'UpMix41' | 'UpMix61' | 'CenterOnly' | 'LFEOnly' | 'RearOnly' | 'next' | 'prev'
    bus: number
  }>
}

interface BusMonitorCallback {
  actionId: 'busMonitor'
  options: Readonly<{
    type: 'Toggle' | 'On' | 'Off'
    bus: number
  }>
}

interface BusMonoCallback {
  actionId: 'busMono'
  options: Readonly<{
    type: 'Toggle' | 'On' | 'Off'
    bus: number
  }>
}

interface BusMuteCallback {
  actionId: 'busMute'
  options: Readonly<{
    type: 'Toggle' | 'Mute' | 'Unmute'
    bus: number
  }>
}

interface BusReturnsCallback {
  actionId: 'busReturns'
  options: Readonly<{
    bus: number
    adjustment: 'Set' | 'Increase' | 'Decrease'
    returns: 'returnReverb' | 'returnDelay' | 'returnFx1' | 'returnFx2'
    value: string
  }>
}

interface BusSelCallback {
  actionId: 'busSel'
  options: Readonly<{
    bus: number
    type: 'Toggle' | 'On' | 'Off'
  }>
}

interface CommandActionsCallback {
  actionId: 'commandActions'
  options: Readonly<{
    command: 'Default' | 'Shutdown' | 'Show' | 'Restart' | 'Eject' | 'Reset' | 'Save' | 'Load' | 'Lock'
    show: 'Show' | 'Hide'
    path: string
    lock: 'Lock' | 'Unlock'
  }>
}

interface MacroButtonCallback {
  actionId: 'macroButton'
  options: Readonly<{
    id: string
    type: 'state' | 'stateOnly' | 'trigger' | 'color'
    state: boolean
    color: string
  }>
}

interface RawCommandCallback {
  actionId: 'rawCommand'
  options: Readonly<{
    command: string
  }>
}

interface RecorderArmCallback {
  actionId: 'recorderArm'
  options: Readonly<{
    type:
      | 'ArmBus(0)'
      | 'ArmBus(2)'
      | 'ArmBus(3)'
      | 'ArmBus(4)'
      | 'ArmBus(5)'
      | 'ArmBus(6)'
      | 'ArmBus(7)'
      | 'ArmStrip(0)'
      | 'ArmStrip(2)'
      | 'ArmStrip(3)'
      | 'ArmStrip(4)'
      | 'ArmStrip(5)'
      | 'ArmStrip(6)'
      | 'ArmStrip(7)'
    state: 'On' | 'Off'
  }>
}

interface RecorderArmInputOutputCallback {
  actionId: 'recorderArmInputOutput'
  options: Readonly<{
    type: 'strip' | 'bus'
  }>
}

interface RecorderGainCallback {
  actionId: 'recorderGain'
  options: Readonly<{
    value: string
  }>
}

interface RecorderLoadTrackCallback {
  actionId: 'recorderLoadTrack'
  options: Readonly<{
    path: string
  }>
}

interface RecorderStateCallback {
  actionId: 'recorderState'
  options: Readonly<{
    type: 'Play' | 'Stop' | 'Record' | 'Goto' | 'FastForward' | 'Loop' | 'PlayOnLoad'
    state: 'On' | 'Off'
  }>
}

interface RouteAudioCallback {
  actionId: 'routeAudio'
  options: Readonly<{
    type: 'Toggle' | 'On' | 'Off'
    recorderType: 'On' | 'Off'
    source: number
    destination: 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'B1' | 'B2' | 'B3'
  }>
}

interface StripCompressorCallback {
  actionId: 'stripCompressor'
  options: Readonly<{
    setting: 'comp' | 'compGainIn' | 'compRatio' | 'compThreshold' | 'compAttack' | 'compRelease' | 'compKnee' | 'compGainOut' | 'compMakeUp'
    strip: number
    adjustment: 'Set' | 'Increase' | 'Decrease'
    comp: string
    compGainIn: string
    compRatio: string
    compThreshold: string
    compAttack: string
    compRelease: string
    compKnee: string
    compGainOut: string
    compMakeUp: string
  }>
}

interface StripDenoiserCallback {
  actionId: 'stripDenoiser'
  options: Readonly<{
    strip: number
    adjustment: 'Set' | 'Increase' | 'Decrease'
    value: string
  }>
}

interface StripEQGainCallback {
  actionId: 'stripEQGain'
  options: Readonly<{
    strip: number
    freq: 1 | 2 | 3
    adjustment: 'Set' | 'Increase' | 'Decrease'
    value: string
  }>
}

interface StripGainCallback {
  actionId: 'stripGain'
  options: Readonly<{
    strip: number
    adjustment: 'Set' | 'Increase' | 'Decrease'
    fade: string
    value: string
  }>
}

interface StripGateCallback {
  actionId: 'stripGate'
  options: Readonly<{
    setting: 'gate' | 'gateThreshold' | 'gateDamping' | 'gateBPSidechain' | 'gateAttack' | 'gateHold' | 'gateRelease'
    strip: number
    adjustment: 'Set' | 'Increase' | 'Decrease'
    gate: string
    gateThreshold: string
    gateDamping: string
    gateBPSidechain: string
    gateAttack: string
    gateHold: string
    gateRelease: string
  }>
}

interface StripMonoCallback {
  actionId: 'stripMute'
  options: Readonly<{
    type: 'Toggle' | 'On' | 'Off'
    strip: number
  }>
}

interface StripMuteCallback {
  actionId: 'stripMute'
  options: Readonly<{
    type: 'Toggle' | 'Mute' | 'Unmute'
    strip: number
  }>
}

interface StripSoloCallback {
  actionId: 'stripSolo'
  options: Readonly<{
    type: 'Toggle' | 'On' | 'Off'
    strip: number
  }>
}

interface UtilSelectBusCallback {
  actionId: 'utilSelectBus'
  options: Readonly<{
    bus: number
  }>
}

interface UtilSelectStripCallback {
  actionId: 'utilSelectStrip'
  options: Readonly<{
    strip: number
  }>
}

interface VbanSettingsCallback {
  actionId: 'vbanSettings'
  options: Readonly<{
    type: 'instream' | 'outstream'
    index: string
    property: 'on' | 'name' | 'ip' | 'port' | 'sr' | 'channel' | 'bit' | 'quality' | 'route'
    adjustment: 'Toggle' | 'On' | 'Off'
    name: string
    ip: string
    port: string
    sr: '11025' | '16000' | '22050' | '24000' | '32000' | '44100' | '48000' | '64000' | '88200' | '96000'
    channel: string
    bit: '1' | '2'
    quality: '0' | '1' | '2' | '3' | '4'
    route: string
  }>
}

export type ActionCallbacks =
  | BusEQCallback
  | BusEQABCallback
  | BusGainCallback
  | BusModeCallback
  | BusMonoCallback
  | BusMuteCallback
  | BusMonitorCallback
  | BusReturnsCallback
  | BusSelCallback
  | CommandActionsCallback
  | MacroButtonCallback
  | RawCommandCallback
  | RecorderArmCallback
  | RecorderArmInputOutputCallback
  | RecorderGainCallback
  | RecorderLoadTrackCallback
  | RecorderStateCallback
  | RouteAudioCallback
  | StripCompressorCallback
  | StripDenoiserCallback
  | StripEQGainCallback
  | StripGainCallback
  | StripGateCallback
  | StripMonoCallback
  | StripMuteCallback
  | StripSoloCallback
  | UtilSelectBusCallback
  | UtilSelectStripCallback
  | VbanSettingsCallback

// Force options to have a default to prevent sending undefined values
type InputFieldWithDefault = Exclude<SomeCompanionActionInputField, 'default'> & {
  default: string | number | boolean | null
}

// Actions specific to Voicemeeter
export interface VoicemeeterAction<T> {
  name: string
  description?: string
  options: InputFieldWithDefault[]
  callback: (action: Readonly<Omit<CompanionActionEvent, 'options' | 'id'> & T>) => void | Promise<void>
  subscribe?: (action: Readonly<Omit<CompanionActionEvent, 'options' | 'id'> & T>) => void
  unsubscribe?: (action: Readonly<Omit<CompanionActionEvent, 'options' | 'id'> & T>) => void
}

export function getActions(instance: VoicemeeterInstance): VoicemeeterActions {
  const utilOptions = getOptions()

  return {
    busEQ: {
      name: 'Bus - EQ',
      description: 'Control EQ on a Bus',
      options: [
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'Toggle',
          choices: ['Toggle', 'On', 'Off'].map((type) => ({ id: type, label: type })),
        },
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [...utilOptions.busSelect.choices, { id: -1, label: 'Selected' }],
        },
      ],
      callback: async (action) => {
        const bus = action.options.bus === -1 ? instance.selectedBus : action.options.bus
        if (!instance.data.busState[bus]) return

        let newValue = instance.data.busState[bus].eq ? 0 : 1
        if (action.options.type === 'On') newValue = 1
        if (action.options.type === 'Off') newValue = 0

        return instance.connection.sendCommand(`Bus[${bus}].EQ.on=${newValue}`)
      },
    },

    busEQAB: {
      name: 'Bus - EQ A or B',
      description: 'Control EQ preset A or B on a Bus',
      options: [
        {
          type: 'dropdown',
          label: 'Mode',
          id: 'mode',
          default: 'Toggle',
          choices: [
            { id: 'Toggle', label: 'Toggle' },
            { id: 'A', label: 'A' },
            { id: 'B', label: 'B' },
          ],
        },
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [...utilOptions.busSelect.choices, { id: -1, label: 'Selected' }],
        },
      ],
      callback: async (action) => {
        const bus: number = action.options.bus === -1 ? instance.selectedBus : action.options.bus
        if (!instance.data.busState[bus]) return

        let newValue: 0 | 1 = instance.data.busState[bus].eqB ? 0 : 1
        if (action.options.mode === 'A') newValue = 0
        if (action.options.mode === 'B') newValue = 1

        return instance.connection.sendCommand(`Bus[${bus}].EQ.AB=${newValue}`)
      },
    },

    busGain: {
      name: 'Bus - Gain',
      description: 'Control the Gain on a Bus',
      options: [
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [...utilOptions.busSelect.choices, { id: -1, label: 'Selected' }],
        },
        {
          type: 'dropdown',
          label: 'Adjustment',
          id: 'adjustment',
          default: 'Set',
          choices: [
            { id: 'Set', label: 'Set' },
            { id: 'Increase', label: 'Increase' },
            { id: 'Decrease', label: 'Decrease' },
          ],
        },
        {
          type: 'textinput',
          label: 'Fade time ms (0 for instant)',
          id: 'fade',
          default: '0',
          useVariables: true,
        },
        {
          type: 'textinput',
          label: 'Gain -60 to +12 dB',
          id: 'value',
          default: '0',
          useVariables: true,
        },
      ],
      callback: async (action) => {
        const bus = action.options.bus === -1 ? instance.selectedBus : action.options.bus
        if (!instance.data.busState[bus]) return

        let fade = parseInt(action.options.fade, 10)
        const value = parseFloat(action.options.value)

        if (isNaN(fade) || isNaN(value)) return

        const currentValue = instance.data.busGaindB100[bus]
        let newValue

        if (action.options.adjustment === 'Set') {
          newValue = value
        } else if (action.options.adjustment === 'Increase') {
          newValue = currentValue + value
        } else {
          newValue = currentValue - value
        }

        if (newValue < -60) newValue = -60
        if (newValue > 12) newValue = 12
        if (fade < 0) fade = 0

        if (newValue !== currentValue) {
          if (fade === 0) {
            return instance.connection.sendCommand(`Bus[${bus}].Gain=${newValue}`)
          } else {
            return instance.connection.sendCommand(`Bus[${bus}].FadeTo=(${newValue},${fade})`)
          }
        }

        return
      },
    },

    busMode: {
      name: 'Bus - Mode',
      description: 'Sets the Mode on the specified Bus',
      options: [
        {
          type: 'dropdown',
          label: 'Mode',
          id: 'mode',
          default: 'normal',
          choices: [
            { id: 'normal', label: 'Normal Mode' },
            { id: 'Amix', label: 'Mix down A' },
            { id: 'Bmix', label: 'Mix down B' },
            { id: 'Repeat', label: 'Stereo Repeat' },
            { id: 'Composite', label: 'Composite' },
            { id: 'TVMix', label: 'Up Mix TV' },
            { id: 'UpMix21', label: 'Up Mix 2.1' },
            { id: 'UpMix41', label: 'Up Mix 4.1' },
            { id: 'UpMix61', label: 'Up Mix 6.1' },
            { id: 'CenterOnly', label: 'Center Only' },
            { id: 'LFEOnly', label: 'LFE Only' },
            { id: 'RearOnly', label: 'Rear Only' },
            { id: 'next', label: 'Next' },
            { id: 'prev', label: 'Previous' },
          ],
        },
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [...utilOptions.busSelect.choices, { id: -1, label: 'Selected' }],
        },
      ],
      callback: async (action) => {
        const bus = action.options.bus === -1 ? instance.selectedBus : action.options.bus
        if (!instance.data.busState[bus]) return

        const modes = ['normal', 'Amix', 'Bmix', 'Repeat', 'Composite', 'TVMix', 'UpMix21', 'UpMix41', 'UpMix61', 'CenterOnly', 'LFEOnly', 'RearOnly']

        const rtPacketModes = ['normal', 'mixdownA', 'mixdownB', 'repeat', 'composite', 'upmixtv', 'upmixtv2', 'upmixtv4', 'upmixtv6', 'center', 'lfe', 'rear']

        const index = rtPacketModes.indexOf(instance.data.busState[bus].mode)
        let newMode = ''

        if (action.options.mode === 'next') {
          const newIndex = (index + 1) % modes.length
          newMode = modes[newIndex]
        } else if (action.options.mode === 'prev') {
          const newIndex = (index + modes.length - 1) % modes.length
          newMode = modes[newIndex]
        } else {
          newMode = action.options.mode
        }

        return instance.connection.sendCommand(`Bus[${bus}].mode.${newMode}=1`)
      },
    },

    busMonitor: {
      name: 'Bus - Monitor',
      description: 'Target Bus selection for Monitor on SEL',
      options: [
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [...utilOptions.busSelect.choices, { id: -1, label: 'Selected' }],
        },
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'Toggle',
          choices: ['Toggle', 'On', 'Off'].map((type) => ({ id: type, label: type })),
        },
      ],
      callback: async (action) => {
        const bus = action.options.bus === -1 ? instance.selectedBus : action.options.bus
        if (!instance.data.busState[bus]) return

        let value = instance.data.busState[bus].monitor ? 0 : 1
        if (action.options.type === 'On') value = 1
        if (action.options.type === 'Off') value = 0

        if (instance.data.busState[bus].monitor ? 1 : 0 !== value) {
          return instance.connection.sendCommand(`Bus[${bus}].Monitor=${value}`)
        }

        return
      },
    },

    busMono: {
      name: 'Bus - Mono',
      description: 'Sets Mono on the specified Bus',
      options: [
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'Toggle',
          choices: ['Toggle', 'On', 'Off'].map((type) => ({ id: type, label: type })),
        },
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [...utilOptions.busSelect.choices, { id: -1, label: 'Selected' }],
        },
      ],
      callback: async (action) => {
        const bus = action.options.bus === -1 ? instance.selectedBus : action.options.bus
        if (!instance.data.busState[bus]) return

        let value = instance.data.busState[bus].mono ? 0 : 1
        if (action.options.type === 'On') value = 1
        if (action.options.type === 'Off') value = 0

        if (instance.data.busState[bus].mono ? 1 : 0 !== value) {
          return instance.connection.sendCommand(`Bus[${bus}].Mono=${value}`)
        }

        return
      },
    },

    busMute: {
      name: 'Bus - Mute',
      description: 'Mutes the specified Bus',
      options: [
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'Toggle',
          choices: ['Toggle', 'Mute', 'Unmute'].map((type) => ({ id: type, label: type })),
        },
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [...utilOptions.busSelect.choices, { id: -1, label: 'Selected' }],
        },
      ],
      callback: async (action) => {
        const bus = action.options.bus === -1 ? instance.selectedBus : action.options.bus
        if (!instance.data.busState[bus]) return

        let value = instance.data.busState[bus].mute ? 0 : 1
        if (action.options.type === 'Mute') value = 1
        if (action.options.type === 'Unmute') value = 0

        if (instance.data.busState[bus].mute ? 1 : 0 !== value) {
          return instance.connection.sendCommand(`Bus[${bus}].Mute=${value}`)
        }

        return
      },
    },

    busReturns: {
      name: 'Bus - Returns',
      description: 'Bus Reverb, Delay, and FX Returns',
      options: [
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [...utilOptions.busSelect.choices, { id: -1, label: 'Selected' }],
        },
        {
          type: 'dropdown',
          label: 'Returns',
          id: 'returns',
          default: 'returnReverb',
          choices: [
            { id: 'returnReverb', label: 'Reverb Return' },
            { id: 'returnDelay', label: 'Delay Return' },
            { id: 'returnFx1', label: 'FX1 Return' },
            { id: 'returnFx2', label: 'FX2 Return' },
          ],
        },
        {
          type: 'textinput',
          label: 'Value 0 to 10',
          id: 'value',
          default: '0',
          useVariables: true,
        },
      ],
      callback: async (action) => {
        const bus = action.options.bus === -1 ? instance.selectedBus : action.options.bus
        let value = parseFloat(action.options.value)
        if (!instance.data.busState[bus] || isNaN(value)) return

        if (value < 0) value = 0
        if (value > 10) value = 10

        return instance.connection.sendCommand(`Bus[${bus}].${action.options.returns}=${value}`)
      },
    },

    busSel: {
      name: 'Bus - SEL',
      description: 'Control SEL on the specified Bus',
      options: [
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [...utilOptions.busSelect.choices, { id: -1, label: 'Selected' }],
        },
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'Toggle',
          choices: ['Toggle', 'On', 'Off'].map((type) => ({ id: type, label: type })),
        },
      ],
      callback: async (action) => {
        const bus = action.options.bus === -1 ? instance.selectedBus : action.options.bus
        if (!instance.data.busState[bus]) return

        let value = instance.data.busState[bus].sel ? 0 : 1
        if (action.options.type === 'On') value = 1
        if (action.options.type === 'Off') value = 0

        if (instance.data.busState[bus].sel ? 1 : 0 !== value) {
          return instance.connection.sendCommand(`Bus[${bus}].Sel=${value}`)
        }

        return
      },
    },

    commandActions: {
      name: 'Command Actions',
      description: 'Execute Voicemeeter commands',
      options: [
        {
          type: 'dropdown',
          label: 'Command',
          id: 'command',
          default: 'Default',
          choices: [
            { id: 'Default', label: '-- Select Command --' },
            { id: 'Shutdown', label: 'Shutdown Voicemeeter' },
            { id: 'Show', label: 'Show / Hide Voicemeeter' },
            { id: 'Restart', label: 'Restart Audio Engine' },
            { id: 'Eject', label: 'Eject Cassette' },
            { id: 'Reset', label: 'Reset All configuration' },
            { id: 'Save', label: 'Save Complete filename (xml)' },
            { id: 'Load', label: 'Load Complete filename (xml)' },
            { id: 'Lock', label: 'Lock / Unlock Voicemeeter' },
          ],
        },
        {
          type: 'dropdown',
          label: 'Show / Hide',
          id: 'show',
          default: '1',
          choices: [
            { id: '1', label: 'Show' },
            { id: '0', label: 'Hide' },
          ],
          isVisible: (options) => options.command === 'Show',
        },
        {
          type: 'textinput',
          label: '',
          id: 'path',
          default: '',
          useVariables: true,
          isVisible: (options) => options.command === 'Save' || options.command === 'Load',
        },
        {
          type: 'dropdown',
          label: 'Lock / Unlock',
          id: 'lock',
          default: '1',
          choices: [
            { id: '1', label: 'Lock' },
            { id: '0', label: 'Unlock' },
          ],
          isVisible: (options) => options.command === 'Lock',
        },
      ],
      callback: async (action) => {
        const command = action.options.command

        if (command === 'Default') {
          return
        } else if (command === 'Show') {
          return instance.connection.sendCommand(`Command.Show=${action.options.show}`)
        } else if (command === 'Save' || command === 'Load') {
          let path = action.options.path
          if (path === '') return

          if (path.includes(' ') && !(path.startsWith('"') && path.endsWith('"'))) {
            path = `"${[path]}"`
          }

          return instance.connection.sendCommand(`Command.${command}=${path}`)
        } else if (command === 'Lock') {
          return instance.connection.sendCommand(`Command.Lock=${action.options.lock}`)
        } else {
          return instance.connection.sendCommand(`Command.${command}=1`)
        }
      },
    },

    macroButton: {
      name: 'Macro Button',
      description: '',
      options: [
        {
          type: 'textinput',
          label: 'Button ID (0 based index)',
          id: 'id',
          default: '0',
          useVariables: true,
        },
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'state',
          choices: [
            { id: 'state', label: 'Macro Button State' },
            { id: 'stateOnly', label: 'Change button state only' },
            { id: 'trigger', label: 'Trigger State' },
            { id: 'color', label: 'Color' },
          ],
        },
        {
          type: 'checkbox',
          label: 'State',
          id: 'state',
          default: false,
          isVisible: (options) => options.type !== 'color',
        },
        {
          type: 'textinput',
          label: 'Color (0 to 8)',
          id: 'color',
          default: '0',
          useVariables: true,
          isVisible: (options) => options.type === 'color',
        },
      ],
      callback: async (action) => {
        const id = parseInt(action.options.id, 10)

        if (isNaN(id)) {
          instance.log('warn', 'Macro Button id must be a number')
          return
        }

        const value = action.options.state ? 1 : 0

        if (action.options.type === 'state') {
          return instance.connection.sendCommand(`Command.Button[${id}].State=${value}`)
        } else if (action.options.type === 'stateOnly') {
          return instance.connection.sendCommand(`Command.Button[${id}].StateOnly=${value}`)
        } else if (action.options.type === 'trigger') {
          return instance.connection.sendCommand(`Command.Button[${id}].Trigger=${value}`)
        } else {
          const color = action.options.color
          const colorTest = parseInt(color, 10)
          if (isNaN(colorTest) || colorTest < 0 || colorTest > 8) {
            instance.log('warn', 'Macro Button Color value must be a number 0 to 8')
            return
          }
          return instance.connection.sendCommand(`Command.Button[${id}].Color=${color}`)
        }
      },
    },

    rawCommand: {
      name: 'Send Raw Command',
      description: `Send a raw command to Voicemeeter`,
      options: [
        {
          type: 'textinput',
          label: 'Command',
          id: 'command',
          default: '',
          useVariables: true,
        },
      ],
      callback: async (action) => {
        return instance.connection.sendCommand(action.options.command)
      },
    },

    recorderArm: {
      name: 'Recorder - Arm Bus or Strip',
      description: 'Arms a specific Bus or Strip',
      options: [
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'ArmStrip(0)',
          choices: [
            ...instance.data.stripLabelUTF8c60.map((label, index) => ({
              id: `ArmStrip(${index})`,
              label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
            })),
            { id: 'ArmBus(0)', label: 'Bus A1' },
            { id: 'ArmBus(1)', label: 'Bus A2' },
            { id: 'ArmBus(2)', label: 'Bus A3' },
            { id: 'ArmBus(3)', label: 'Bus A4' },
            { id: 'ArmBus(4)', label: 'Bus A5' },
            { id: 'ArmBus(5)', label: 'Bus B1' },
            { id: 'ArmBus(6)', label: 'Bus B2' },
            { id: 'ArmBus(7)', label: 'Bus B3' },
          ],
        },
        {
          type: 'dropdown',
          label: 'State',
          id: 'state',
          default: 'On',
          choices: [
            { id: 'On', label: 'On' },
            { id: 'Off', label: 'Off' },
          ],
        },
      ],
      callback: async (action) => {
        return instance.connection.sendCommand(`Recorder.${action.options.type}=${action.options.state === 'On' ? 1 : 0}`)
      },
    },

    recorderArmInputOutput: {
      name: 'Recorder - Arm Inputs or Outputs',
      description: 'Arms the Recorder for the selected Pre-Fader inputs, or Post-Fader Outputs',
      options: [
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'strip',
          choices: [
            { id: 'strip', label: 'Pre-Fader Inputs' },
            { id: 'bus', label: 'Post-Fader Outputs' },
          ],
        },
      ],
      callback: async (action) => {
        const type = action.options.type === 'strip' ? 0 : 1
        return instance.connection.sendCommand(`Recorder.mode.recbus=${type}`)
      },
    },

    recorderGain: {
      name: 'Recorder - Gain',
      description: 'Set Recorder Gain',
      options: [
        {
          type: 'textinput',
          label: 'Volume (-60 to 12)',
          id: 'value',
          default: '1',
          useVariables: true,
        },
      ],
      callback: async (action) => {
        let value = parseFloat(action.options.value)

        if (isNaN(value)) return

        if (value < -60) value = -60
        if (value > 12) value = 12

        return instance.connection.sendCommand(`Recorder.gain=${value}`)
      },
    },

    recorderLoadTrack: {
      name: 'Recorder - Load Track',
      description: 'Loads a file into the Recorder',
      options: [
        {
          type: 'textinput',
          label: 'Filepath',
          id: 'path',
          default: '',
          useVariables: true,
        },
      ],
      callback: async (action) => {
        return instance.connection.sendCommand(`Recorder.load="${action.options.path}"`)
      },
    },

    recorderState: {
      name: 'Recorder - Position Control',
      description: 'Control the playback and loading of the Recorder',
      options: [
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'Play',
          choices: [
            { id: 'Play', label: 'Play' },
            { id: 'Stop', label: 'Stop' },
            { id: 'Record', label: 'Record' },
            { id: 'Goto', label: 'Restart' },
            { id: 'Rewind', label: 'Rewind' },
            { id: 'ff', label: 'FastForward' },
            { id: 'Loop', label: 'Loop' },
            { id: 'PlayOnLoad', label: 'Play-On-Load' },
          ],
        },
        {
          type: 'dropdown',
          label: 'State',
          id: 'state',
          default: 'On',
          choices: [
            { id: 'On', label: 'On' },
            { id: 'Off', label: 'Off' },
          ],
          isVisible: (options) => {
            return options.type === 'Loop' || options.type === 'PlayOnLoad'
          },
        },
      ],
      callback: async (action) => {
        const state = action.options.state === 'On' ? 1 : 0
        if (action.options.type === 'Loop') {
          return instance.connection.sendCommand(`Recorder.Loop=${state}`)
        } else if (action.options.type === 'PlayOnLoad') {
          return instance.connection.sendCommand(`Recorder.mode.PlayOnLoad=${state}`)
        } else if (action.options.type === 'Goto') {
          return instance.connection.sendCommand(`Recorder.goto=00:00:00`)
        } else {
          return instance.connection.sendCommand(`Recorder.${action.options.type}=1`)
        }
      },
    },

    routeAudio: {
      name: 'Route Audio',
      options: [
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'Toggle',
          choices: ['Toggle', 'On', 'Off'].map((type) => ({ id: type, label: type })),
          isVisible: (options) => options.source !== 8,
        },
        {
          type: 'dropdown',
          label: 'Type',
          id: 'recorderType',
          default: 'Toggle',
          choices: [
            { id: 'On', label: 'On' },
            { id: 'Off', label: 'Off' },
          ],
          isVisible: (options) => options.source === 8,
        },
        {
          type: 'dropdown',
          label: 'Source',
          id: 'source',
          default: '0',
          choices: [
            { id: 0, label: 'Strip 1' },
            { id: 1, label: 'Strip 2' },
            { id: 2, label: 'Strip 3' },
            { id: 3, label: 'Strip 4' },
            { id: 4, label: 'Strip 5' },
            { id: 5, label: 'Aux 1' },
            { id: 6, label: 'Aux 2' },
            { id: 7, label: 'Aux 3' },
            { id: 8, label: 'Recorder' },
            { id: 9, label: 'Selected' },
          ],
        },
        {
          type: 'dropdown',
          label: 'Destination',
          id: 'destination',
          default: 'A1',
          choices: ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3'].map((type) => ({ id: type, label: type })),
        },
      ],
      callback: async (action) => {
        const source = action.options.source === 9 ? instance.selectedStrip : action.options.source
        if (source === -1) return

        if (source === 8) {
          return instance.connection.sendCommand(`Recorder.[${action.options.destination}]=${action.options.recorderType === 'On' ? 1 : 0}`)
        } else {
          let newValue = instance.data.stripState[source][`bus${action.options.destination}`] ? 0 : 1
          if (action.options.type === 'On') newValue = 1
          if (action.options.type === 'Off') newValue = 0

          return instance.connection.sendCommand(`Strip[${source}].${action.options.destination}=${newValue}`)
        }
      },
    },

    stripCompressor: {
      name: 'Strip - Compressor',
      description: 'Control the Compressor settings of a strip',
      options: [
        {
          type: 'dropdown',
          label: 'Setting',
          id: 'setting',
          default: 'comp',
          choices: [
            { id: 'comp', label: 'Compressor' },
            { id: 'compGainIn', label: 'Input Gain' },
            { id: 'compRatio', label: 'Ratio' },
            { id: 'compThreshold', label: 'Threshold' },
            { id: 'compAttack', label: 'Attack Time' },
            { id: 'compRelease', label: 'Release Time' },
            { id: 'compKnee', label: 'Knee' },
            { id: 'compGainOut', label: 'Output Gain' },
            { id: 'compMakeUp', label: 'Make Up' },
          ],
        },
        {
          type: 'dropdown',
          label: 'Strip',
          id: 'strip',
          default: -1,
          choices: [
            ...instance.data.stripLabelUTF8c60.map((label, index) => ({
              id: `${index}`,
              label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
            })),
            { id: -1, label: 'Selected' },
          ],
        },
        {
          type: 'dropdown',
          label: 'Adjustment',
          id: 'adjustment',
          default: 'Set',
          choices: [
            { id: 'Set', label: 'Set' },
            { id: 'Increase', label: 'Increase' },
            { id: 'Decrease', label: 'Decrease' },
          ],
          isVisible: (options) => {
            return options.setting !== 'comp' && options.setting !== 'compMakeUp'
          },
        },
        {
          type: 'textinput',
          label: 'Compressor: 0 to 10',
          id: 'comp',
          default: '0',
          useVariables: true,
          isVisible: (options) => {
            return options.setting === 'comp'
          },
        },
        {
          type: 'textinput',
          label: 'Input Gain: -24 to +24',
          id: 'compGainIn',
          default: '0',
          useVariables: true,
          isVisible: (options) => {
            return options.setting === 'compGainIn'
          },
        },
        {
          type: 'textinput',
          label: 'Ratio: 1 to 8',
          id: 'compRatio',
          default: '1',
          useVariables: true,
          isVisible: (options) => {
            return options.setting === 'compRatio'
          },
        },
        {
          type: 'textinput',
          label: 'Threshold: -40 to -3 dB',
          id: 'compThreshold',
          default: '0',
          useVariables: true,
          isVisible: (options) => {
            return options.setting === 'compThreshold'
          },
        },
        {
          type: 'textinput',
          label: 'Attack Time: 0 to 200 ms',
          id: 'compAttack',
          default: '0',
          useVariables: true,
          isVisible: (options) => {
            return options.setting === 'compAttack'
          },
        },
        {
          type: 'textinput',
          label: 'Release Time: 0 to 5000 ms',
          id: 'compRelease',
          default: '0',
          useVariables: true,
          isVisible: (options) => {
            return options.setting === 'compRelease'
          },
        },
        {
          type: 'textinput',
          label: 'Knee: 0 to 1',
          id: 'compKnee',
          default: '0',
          useVariables: true,
          isVisible: (options) => {
            return options.setting === 'compKnee'
          },
        },
        {
          type: 'textinput',
          label: 'Output Gain: -24 to +24',
          id: 'compGainOut',
          default: '0',
          useVariables: true,
          isVisible: (options) => {
            return options.setting === 'compGainOut'
          },
        },
        {
          type: 'textinput',
          label: 'Make Up: 0 or 1',
          id: 'compMakeUp',
          default: '0',
          useVariables: true,
          isVisible: (options) => {
            return options.setting === 'compMakeUp'
          },
        },
      ],
      callback: async (action) => {
        const stripId = action.options.strip === -1 ? instance.selectedStrip : action.options.strip
        if (stripId === -1) return

        const updateCompressor = async (command: any, min: number, max: number) => {
          const value = parseFloat(action.options[action.options.setting])

          if (isNaN(value)) return

          if (action.options.setting === 'comp' || action.options.setting === 'compMakeUp') {
            return instance.connection.sendCommand(`Strip[${stripId}].${command}=${value}`)
          } else {
            const compressorType = {
              compGainIn: 'gainIn',
              compRatio: 'ratio',
              compThreshold: 'threshold',
              compAttack: 'attack',
              compRelease: 'release',
              compKnee: 'knee',
              compGainOut: 'gainOut',
            }

            let newValue
            const currentValue: number = instance.data.stripData[stripId]?.comp[compressorType[action.options.setting]]
            if (currentValue === undefined) {
              instance.log('debug', `Missing strip data, strip id: ${stripId}`)
              return
            }

            if (action.options.adjustment === 'Set') {
              newValue = value
            } else if (action.options.adjustment === 'Increase') {
              newValue = currentValue + value
            } else {
              newValue = currentValue - value
            }

            if (newValue < min) newValue = min
            if (newValue > max) newValue = max

            return instance.connection.sendCommand(`Strip[${stripId}].${command}=${newValue}`)
          }
        }

        if (action.options.setting === 'comp') {
          return updateCompressor('Comp', 0, 10)
        } else if (action.options.setting === 'compGainIn') {
          return updateCompressor('Comp.GainIn', -24, 24)
        } else if (action.options.setting === 'compRatio') {
          return updateCompressor('Comp.Ratio', 1, 8)
        } else if (action.options.setting === 'compThreshold') {
          return updateCompressor('Comp.Threshold', -40, -3)
        } else if (action.options.setting === 'compAttack') {
          return updateCompressor('Comp.Attack', 0, 200)
        } else if (action.options.setting === 'compRelease') {
          return updateCompressor('Comp.Release', 0, 5000)
        } else if (action.options.setting === 'compKnee') {
          return updateCompressor('Comp.Knee', 0, 1)
        } else if (action.options.setting === 'compGainOut') {
          return updateCompressor('Comp.GainOut', -24, 24)
        } else if (action.options.setting === 'compMakeUp') {
          return updateCompressor('Comp.MakeUp', 0, 1)
        }
      },
    },

    stripDenoiser: {
      name: 'Strip - Denoiser',
      description: 'Control the Denoiser value of a strip',
      options: [
        {
          type: 'dropdown',
          label: 'Strip',
          id: 'strip',
          default: -1,
          choices: [
            ...instance.data.stripLabelUTF8c60.map((label, index) => ({
              id: `${index}`,
              label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
            })),
            { id: -1, label: 'Selected' },
          ],
        },
        {
          type: 'textinput',
          label: 'Value (0 to 10)',
          id: 'value',
          default: '0',
          useVariables: true,
        },
      ],
      callback: async (action) => {
        const stripId = action.options.strip === -1 ? instance.selectedStrip : action.options.strip
        if (stripId === -1) return

        const value = parseFloat(action.options.value)
        if (isNaN(value)) return

        let newValue = value
        if (newValue < 0) newValue = 0
        if (newValue > 10) newValue = 10
        return instance.connection.sendCommand(`Strip[${stripId}].Denoiser=${newValue}`)
      },
    },

    stripEQGain: {
      name: 'Strip - EQ Gain 1 to 3 (Virtual Strips)',
      description: '',
      options: [
        {
          type: 'dropdown',
          label: 'Strip',
          id: 'strip',
          default: -1,
          choices: [
            ...instance.data.stripLabelUTF8c60.map((label, index) => ({
              id: `${index}`,
              label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
            })),
            { id: -1, label: 'Selected' },
          ],
        },
        {
          type: 'dropdown',
          label: 'Frequency',
          id: 'freq',
          default: 3,
          choices: [
            { id: 3, label: 'Trebble' },
            { id: 2, label: 'Mid' },
            { id: 1, label: 'Bass' },
          ],
        },
        {
          type: 'dropdown',
          label: 'Adjustment',
          id: 'adjustment',
          default: 'Set',
          choices: [
            { id: 'Set', label: 'Set' },
            { id: 'Increase', label: 'Increase' },
            { id: 'Decrease', label: 'Decrease' },
          ],
        },
        {
          type: 'textinput',
          label: 'EQ (-12 to 12)',
          id: 'value',
          default: '0',
          useVariables: true,
        },
      ],
      callback: async (action) => {
        const stripId = action.options.strip === -1 ? instance.selectedStrip : action.options.strip
        if (stripId === -1) return

        const value = parseFloat(action.options.value)

        if (isNaN(value)) {
          instance.log('warn', `Invalid EQ Value: ${value}`)
          return
        }

        let currentValue = 0
        if (action.options.freq === 1) currentValue = instance.data.stripData[stripId].EQgain1
        if (action.options.freq === 2) currentValue = instance.data.stripData[stripId].EQgain2
        if (action.options.freq === 3) currentValue = instance.data.stripData[stripId].EQgain3

        let newValue

        if (action.options.adjustment === 'Set') {
          newValue = value
        } else if (action.options.adjustment === 'Increase') {
          newValue = currentValue + value
        } else {
          newValue = currentValue - value
        }

        if (newValue < -12) newValue = -12
        if (newValue > 12) newValue = 12

        return instance.connection.sendCommand(`Strip[${stripId}].EQGain${action.options.freq}=${newValue}`)
      },
    },

    stripGain: {
      name: 'Strip - Gain',
      description: 'Control the Gain on a Strip',
      options: [
        {
          type: 'dropdown',
          label: 'Strip',
          id: 'strip',
          default: -1,
          choices: [
            ...instance.data.stripLabelUTF8c60.map((label, index) => ({
              id: `${index}`,
              label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
            })),
            { id: -1, label: 'Selected' },
          ],
        },
        {
          type: 'dropdown',
          label: 'Adjustment',
          id: 'adjustment',
          default: 'Set',
          choices: [
            { id: 'Set', label: 'Set' },
            { id: 'Increase', label: 'Increase' },
            { id: 'Decrease', label: 'Decrease' },
          ],
        },
        {
          type: 'textinput',
          label: 'Fade time ms (0 for instant)',
          id: 'fade',
          default: '0',
          useVariables: true,
        },
        {
          type: 'textinput',
          label: 'Gain (-60 to +12 dB)',
          id: 'value',
          default: '0',
          useVariables: true,
        },
      ],
      callback: async (action) => {
        const stripId = action.options.strip === -1 ? instance.selectedStrip : action.options.strip
        if (stripId === -1) return

        let fade = parseInt(action.options.fade, 10)
        const value = parseFloat(action.options.value)

        if (isNaN(fade) || isNaN(value)) return

        let currentValue = instance.data.stripGaindB100Layer0[stripId]

				let busSel = instance.data.busState.find(bus => bus.sel)

				if (busSel) {
					let values: number[] = []

					instance.data.busState.forEach((bus, index) => {
						if (bus.sel) values.push(instance.data[`stripGaindB100Layer${index + 1}`][stripId])
					})

					currentValue = Math.max(...values)
				}

        let newValue

        if (action.options.adjustment === 'Set') {
          newValue = value
        } else if (action.options.adjustment === 'Increase') {
          newValue = currentValue + value
        } else {
          newValue = currentValue - value
        }

        if (newValue < -60) newValue = -60
        if (newValue > 12) newValue = 12
        if (fade < 0) fade = 0

        if (fade === 0) {
          return instance.connection.sendCommand(`Strip[${stripId}].Gain=${newValue}`)
        } else {
          return instance.connection.sendCommand(`Strip[${stripId}].FadeTo=(${newValue},${fade})`)
        }
      },
    },

    stripGate: {
      name: 'Strip - Gate',
      description: 'Control the Gate settings of a strip',
      options: [
        {
          type: 'dropdown',
          label: 'Setting',
          id: 'setting',
          default: 'gate',
          choices: [
            { id: 'gate', label: 'Gate' },
            { id: 'gateThreshold', label: 'Threshold' },
            { id: 'gateDamping', label: 'Damping Max' },
            { id: 'gateBPSidechain', label: 'BP Sidechain' },
            { id: 'gateAttack', label: 'Attack Time' },
            { id: 'gateHold', label: 'Hold Time' },
            { id: 'gateRelease', label: 'Release Time' },
          ],
        },
        {
          type: 'dropdown',
          label: 'Strip',
          id: 'strip',
          default: -1,
          choices: [
            ...instance.data.stripLabelUTF8c60.map((label, index) => ({
              id: `${index}`,
              label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
            })),
            { id: -1, label: 'Selected' },
          ],
        },
        {
          type: 'dropdown',
          label: 'Adjustment',
          id: 'adjustment',
          default: 'Set',
          choices: [
            { id: 'Set', label: 'Set' },
            { id: 'Increase', label: 'Increase' },
            { id: 'Decrease', label: 'Decrease' },
          ],
        },
        {
          type: 'textinput',
          label: 'Gate (0 to 10)',
          id: 'gate',
          default: '0',
          isVisible: (options) => options.setting === 'gate',
          useVariables: true,
        },
        {
          type: 'textinput',
          label: 'Threshold (-60 to -10 dB)',
          id: 'gateThreshold',
          default: '-60',
          isVisible: (options) => options.setting === 'gateThreshold',
          useVariables: true,
        },
        {
          type: 'textinput',
          label: 'Damping (-60 to -10 dB)',
          id: 'gateDamping',
          default: '-60',
          isVisible: (options) => options.setting === 'gateDamping',
          useVariables: true,
        },
        {
          type: 'textinput',
          label: 'BP Sidechain (100 to 4000 Hz)',
          id: 'gateBPSidechain',
          default: '0',
          isVisible: (options) => options.setting === 'gateBPSidechain',
          useVariables: true,
        },
        {
          type: 'textinput',
          label: 'Attack Time (0 to 1000 ms)',
          id: 'gateAttack',
          default: '0',
          isVisible: (options) => options.setting === 'gateAttack',
          useVariables: true,
        },
        {
          type: 'textinput',
          label: 'Hold Time (0 to 5000 ms)',
          id: 'gateHold',
          default: '0',
          isVisible: (options) => options.setting === 'gateHold',
          useVariables: true,
        },
        {
          type: 'textinput',
          label: 'ReleaseTime (0 to 5000 ms)',
          id: 'gateRelease',
          default: '0',
          isVisible: (options) => options.setting === 'gateRelease',
          useVariables: true,
        },
      ],
      callback: async (action) => {
        const stripId = action.options.strip === -1 ? instance.selectedStrip : action.options.strip
        if (stripId === -1) return

        const updateGate = async (command: any, min: number, max: number) => {
          const commandValue: any = action.options[action.options.setting]
          const value = parseFloat(commandValue)
          if (isNaN(value)) return

          let newValue = value
          if (newValue < min) newValue = min
          if (newValue > max) newValue = max

          return instance.connection.sendCommand(`Strip[${stripId}].${command}=${newValue}`)
        }

        if (action.options.setting === 'gate') {
          updateGate('Gate', 0, 10)
        } else if (action.options.setting === 'gateThreshold') {
          updateGate('Gate.Threshold', -60, -10)
        } else if (action.options.setting === 'gateDamping') {
          updateGate('Gate.Damping', -60, -10)
        } else if (action.options.setting === 'gateBPSidechain') {
          updateGate('Gate.BPSidechain', 100, 4000)
        } else if (action.options.setting === 'gateAttack') {
          updateGate('Gate.Attack', 0, 1000)
        } else if (action.options.setting === 'gateHold') {
          updateGate('Gate.Hold', 0, 5000)
        } else if (action.options.setting === 'gateRelease') {
          updateGate('Gate.Release', 0, 5000)
        }
      },
    },

    stripMono: {
      name: 'Strip - Mono',
      description: 'Sets Mono on the specified Strip',
      options: [
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'Toggle',
          choices: ['Toggle', 'On', 'Off'].map((type) => ({ id: type, label: type })),
        },
        {
          type: 'dropdown',
          label: 'Strip',
          id: 'strip',
          default: -1,
          choices: [
            ...instance.data.stripLabelUTF8c60.map((label, index) => ({
              id: `${index}`,
              label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
            })),
            { id: -1, label: 'Selected' },
          ],
        },
      ],
      callback: async (action) => {
        const strip = action.options.strip === -1 ? instance.selectedStrip : action.options.strip
        if (strip === -1) return

        let value = action.options.type === 'On' ? 1 : 0

        if (action.options.type === 'Toggle') {
          value = instance.data.stripState[strip].mono ? 0 : 1
        }

        return instance.connection.sendCommand(`Strip[${strip}].Mono=${value}`)
      },
    },

    stripMute: {
      name: 'Strip - Mute',
      description: 'Mutes the specified Strip',
      options: [
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'Toggle',
          choices: ['Toggle', 'Mute', 'Unmute'].map((type) => ({ id: type, label: type })),
        },
        {
          type: 'dropdown',
          label: 'Strip',
          id: 'strip',
          default: -1,
          choices: [
            ...instance.data.stripLabelUTF8c60.map((label, index) => ({
              id: `${index}`,
              label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
            })),
            { id: -1, label: 'Selected' },
          ],
        },
      ],
      callback: async (action) => {
        const strip = action.options.strip === -1 ? instance.selectedStrip : action.options.strip
        if (strip === -1) return

        let value = action.options.type === 'Mute' ? 1 : 0

        if (action.options.type === 'Toggle') {
          value = instance.data.stripState[strip].mute ? 0 : 1
        }

        return instance.connection.sendCommand(`Strip[${strip}].Mute=${value}`)
      },
    },

    stripSolo: {
      name: 'Strip - Solo',
      description: 'Sets Solo on the specified Strip',
      options: [
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'Toggle',
          choices: ['Toggle', 'On', 'Off'].map((type) => ({ id: type, label: type })),
        },
        {
          type: 'dropdown',
          label: 'Strip',
          id: 'strip',
          default: -1,
          choices: [
            ...instance.data.stripLabelUTF8c60.map((label, index) => ({
              id: `${index}`,
              label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
            })),
            { id: -1, label: 'Selected' },
          ],
        },
      ],
      callback: async (action) => {
        const strip = action.options.strip === -1 ? instance.selectedStrip : action.options.strip
        if (strip === -1) return

        let value = action.options.type === 'On' ? 1 : 0

        if (action.options.type === 'Toggle') {
          value = instance.data.stripState[strip].solo ? 0 : 1
        }

        return instance.connection.sendCommand(`Strip[${strip}].Solo=${value}`)
      },
    },

    utilSelectBus: {
      name: 'Util - Select Bus',
      description: 'For use in Companion actions/feedback/variables, not Voicemeeter',
      options: [utilOptions.busSelect],
      callback: async (action) => {
        instance.selectedBus = instance.selectedBus === action.options.bus ? -1 : action.options.bus
        instance.checkFeedbacks('busEQ', 'busEQAB', 'busMeters', 'busMonitor', 'busMono', 'busMute', 'busSel', 'utilSelectedBus')
        instance.variables?.updateVariables()
      },
    },

    utilSelectStrip: {
      name: 'Util - Select Strip',
      description: 'For use in Companion actions/feedback/variables, not Voicemeeter',
      options: [
        {
          type: 'dropdown',
          label: 'Strip',
          id: 'strip',
          default: 0,
          choices: [...instance.data.stripLabelUTF8c60.map((label, index) => ({ id: index, label: label || index + 1 + '' })), { id: 8, label: 'Recorder' }],
        },
      ],
      callback: async (action) => {
        instance.selectedStrip = instance.selectedStrip === action.options.strip ? -1 : action.options.strip
        instance.checkFeedbacks('StripMeters', 'stripMono', 'stripMute', 'stripSolo', 'utilSelectedStrip', 'routing')
        instance.variables?.updateVariables()
      },
    },

    vbanSettings: {
      name: 'VBAN Settings',
      description: 'Control various settings of VBAN and each In/Out stream (Warning, disabling VBAN may disable Companions connection to Voicemeeter)',
      options: [
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'instream',
          choices: [
            { id: 'instream', label: 'VBAN Incoming Stream' },
            { id: 'outstream', label: 'VBAN Outgoing Stream' },
          ],
        },
        {
          type: 'textinput',
          label: 'Stream Index (0 to 9)',
          id: 'index',
          default: '0',
          useVariables: true,
          isVisible: (options) => options.type === 'instream' || options.type === 'outstream',
        },
        {
          type: 'dropdown',
          label: 'Property',
          id: 'property',
          default: 'on',
          choices: [
            { id: 'on', label: 'On/Off' },
            { id: 'name', label: 'Name' },
            { id: 'ip', label: 'IP' },
            { id: 'port', label: 'Port' },
            { id: 'sr', label: 'Sample Rate' },
            { id: 'channel', label: 'Channel' },
            { id: 'bit', label: 'Data Type' },
            { id: 'quality', label: 'Quality' },
            { id: 'route', label: 'Route' },
          ],
        },
        {
          type: 'dropdown',
          label: 'On/Off',
          id: 'adjustment',
          default: 'On',
          choices: [
            { id: 'On', label: 'On' },
            { id: 'Off', label: 'Off' },
          ],
          isVisible: (options) => options.property === 'on',
        },
        {
          type: 'textinput',
          label: 'Stream Name',
          id: 'name',
          default: 'StreamX',
          useVariables: true,
          isVisible: (options) => options.property === 'name',
        },
        {
          type: 'textinput',
          label: 'IP',
          id: 'ip',
          default: '0.0.0.0',
          useVariables: true,
          isVisible: (options) => options.property === 'ip',
        },
        {
          type: 'textinput',
          label: 'Port',
          id: 'port',
          default: '6980',
          useVariables: true,
          isVisible: (options) => options.property === 'port',
        },
        {
          type: 'dropdown',
          label: 'Sample Rate',
          id: 'sr',
          default: '11025',
          choices: [
            { id: '11025', label: '11025 Hz' },
            { id: '16000', label: '16000 Hz' },
            { id: '22050', label: '22050 Hz' },
            { id: '24000', label: '24000 Hz' },
            { id: '32000', label: '32000 Hz' },
            { id: '44100', label: '44100 Hz' },
            { id: '48000', label: '48000 Hz' },
            { id: '64000', label: '64000 Hz' },
            { id: '88200', label: '88200 Hz' },
            { id: '96000', label: '96000 Hz' },
          ],
          isVisible: (options) => options.type === 'outstream' && options.property === 'sr',
        },
        {
          type: 'textinput',
          label: 'Channel (1 to 8)',
          id: 'channel',
          default: '2',
          useVariables: true,
          isVisible: (options) => options.type === 'outstream' && options.property === 'channel',
        },
        {
          type: 'dropdown',
          label: 'Bit Resolution / Data Format',
          id: 'bit',
          default: '1',
          choices: [
            { id: '1', label: '16 bit PCM' },
            { id: '2', label: '24 bit PCM' },
          ],
          isVisible: (options) => options.type === 'outstream' && options.property === 'bit',
        },
        {
          type: 'dropdown',
          label: 'Quality',
          id: 'quality',
          default: '0',
          choices: [
            { id: '0', label: 'Optimal' },
            { id: '1', label: 'Fast' },
            { id: '2', label: 'Medium' },
            { id: '3', label: 'Slow' },
            { id: '4', label: 'Very Slow' },
          ],
          isVisible: (options) => options.property === 'quality',
        },
        {
          type: 'textinput',
          label: 'Strip/Bus (0 to 8)',
          id: 'route',
          default: '0',
          useVariables: true,
          isVisible: (options) => options.property === 'route',
        },
      ],
      callback: async (action) => {
        const index = parseInt(action.options.index, 10)

        if (isNaN(index)) {
          instance.log('warn', `VBAN Settings must have a valid index (0 to 7)`)
          return
        }

        let value: any = ''

        if (action.options.property === 'on') {
          value = action.options.adjustment === 'On' ? 1 : 0
        } else if (action.options.property === 'name') {
          value = action.options.name
        } else if (action.options.property === 'ip') {
          value = action.options.ip
        } else if (action.options.property === 'port') {
          value = action.options.port
        } else if (action.options.property === 'quality') {
          value = action.options.quality
        } else if (action.options.property === 'route') {
          value = action.options.route
        } else if (action.options.property === 'sr') {
          value = action.options.sr
        } else if (action.options.property === 'channel') {
          value = action.options.channel
        } else if (action.options.property === 'bit') {
          value = action.options.bit
        }

        return instance.connection.sendCommand(`Vban.${action.options.type}[${index}].${action.options.property}=${value}`)
      },
    },
  }
}
