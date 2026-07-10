import { type CompanionActionDefinitions, type CompanionActionSchema } from '@companion-module/base'
import { busName, options } from '../utils.js'
import type VoicemeeterInstance from '../index.js'

export type BusActionsSchema = {
  busEQ: CompanionActionSchema<
    {
      bus: string
      type: 'Toggle' | 'On' | 'Off'
    },
    void
  >
  busEQAB: CompanionActionSchema<
    {
      bus: string
      mode: 'Toggle' | 'A' | 'B'
    },
    void
  >
  busGain: CompanionActionSchema<
    {
      bus: string
      adjustment: 'Set' | 'Increase' | 'Decrease'
      fade: number
      value: number
    },
    void
  >
  busMode: CompanionActionSchema<
    {
      bus: string
      mode: 'normal' | 'Amix' | 'Bmix' | 'Repeat' | 'Composite' | 'TVMix' | 'UpMix21' | 'UpMix41' | 'UpMix61' | 'CenterOnly' | 'LFEOnly' | 'RearOnly' | 'next' | 'prev'
    },
    void
  >
  busMonitor: CompanionActionSchema<
    {
      bus: string
      type: 'Toggle' | 'On' | 'Off'
    },
    void
  >
  busMono: CompanionActionSchema<
    {
      bus: string
      type: 'Toggle' | 'On' | 'Off'
    },
    void
  >
  busMute: CompanionActionSchema<
    {
      bus: string
      type: 'Toggle' | 'Mute' | 'Unmute'
    },
    void
  >
  busReturns: CompanionActionSchema<
    {
      bus: string
      returns: 'returnReverb' | 'returnDelay' | 'returnFx1' | 'returnFx2'
      value: number
    },
    void
  >
  busSel: CompanionActionSchema<
    {
      bus: string
      type: 'Toggle' | 'On' | 'Off'
    },
    void
  >
}

export const getBusActions = (instance: VoicemeeterInstance): CompanionActionDefinitions<BusActionsSchema> => {
  return {
    busEQ: {
      name: 'Bus - EQ',
      description: 'Control EQ on a Bus',
      options: [options(instance).busSelect, options(instance).toggle],
      callback: async (action) => {
        const bus = action.options.bus === 'Selected' ? instance.selectedBus : action.options.bus
        const busIndex = busName.indexOf(bus)

        if (!instance.data.busState[busIndex]) return

        let newValue = instance.data.busState[busIndex].eq ? 0 : 1
        if (action.options.type === 'On') newValue = 1
        if (action.options.type === 'Off') newValue = 0

        return instance.connection.sendCommand(`Bus[${busIndex}].EQ.on=${newValue}`)
      },
    },

    busEQAB: {
      name: 'Bus - EQ A or B',
      description: 'Control EQ preset A or B on a Bus',
      options: [
        options(instance).busSelect,
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
          expressionDescription: `Valid Values: 'Toggle', 'A', or 'B'`,
        },
      ],
      callback: async (action) => {
        const bus = action.options.bus === 'Selected' ? instance.selectedBus : action.options.bus
        const busIndex = busName.indexOf(bus)

        if (!instance.data.busState[busIndex]) return

        let newValue: 0 | 1 = instance.data.busState[busIndex].eqB ? 0 : 1
        if (action.options.mode === 'A') newValue = 0
        if (action.options.mode === 'B') newValue = 1

        return instance.connection.sendCommand(`Bus[${busIndex}].EQ.AB=${newValue}`)
      },
    },

    busGain: {
      name: 'Bus - Gain',
      description: 'Control the Gain on a Bus',
      options: [
        options(instance).busSelect,
        options(instance).adjustment,
        {
          type: 'number',
          label: 'Fade time ms',
          description: '0 for instant',
          id: 'fade',
          default: 0,
          min: 0,
          max: 60000,
          step: 1,
        },
        {
          type: 'number',
          label: 'Gain',
          description: '-60 to +12 dB',
          id: 'value',
          default: 0,
          min: -60,
          max: 12,
        },
      ],
      callback: async (action) => {
        const bus = action.options.bus === 'Selected' ? instance.selectedBus : action.options.bus
        const busIndex = busName.indexOf(bus)

        if (!instance.data.busState[busIndex]) return

        let fade = action.options.fade
        const value = action.options.value

        if (isNaN(fade) || isNaN(value)) return

        const currentValue = instance.data.busGaindB100[busIndex]
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
            return instance.connection.sendCommand(`Bus[${busIndex}].Gain=${newValue}`)
          } else {
            return instance.connection.sendCommand(`Bus[${busIndex}].FadeTo=(${newValue},${fade})`)
          }
        }

        return
      },
    },

    busMode: {
      name: 'Bus - Mode',
      description: 'Sets the Mode on the specified Bus',
      options: [
        options(instance).busSelect,
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
          disableAutoExpression: true,
        },
      ],
      callback: async (action) => {
        const bus = action.options.bus === 'Selected' ? instance.selectedBus : action.options.bus
        const busIndex = busName.indexOf(bus)

        if (!instance.data.busState[busIndex]) return

        const modes = ['normal', 'Amix', 'Bmix', 'Repeat', 'Composite', 'TVMix', 'UpMix21', 'UpMix41', 'UpMix61', 'CenterOnly', 'LFEOnly', 'RearOnly']
        const rtPacketModes = ['normal', 'mixdownA', 'mixdownB', 'repeat', 'composite', 'upmixtv', 'upmixtv2', 'upmixtv4', 'upmixtv6', 'center', 'lfe', 'rear']

        const index = rtPacketModes.indexOf(instance.data.busState[busIndex].mode)
        let newMode: string = action.options.mode

        if (action.options.mode === 'next') {
          const newIndex = (index + 1) % modes.length
          newMode = modes[newIndex]
        } else if (action.options.mode === 'prev') {
          const newIndex = (index + modes.length - 1) % modes.length
          newMode = modes[newIndex]
        }

        return instance.connection.sendCommand(`Bus[${busIndex}].mode.${newMode}=1`)
      },
    },

    busMonitor: {
      name: 'Bus - Monitor',
      description: 'Target Bus selection for Monitor on SEL',
      options: [options(instance).busSelect, options(instance).toggle],
      callback: async (action) => {
        const bus = action.options.bus === 'Selected' ? instance.selectedBus : action.options.bus
        const busIndex = busName.indexOf(bus)

        if (!instance.data.busState[busIndex]) return

        let value = instance.data.busState[busIndex].monitor ? 0 : 1
        if (action.options.type === 'On') value = 1
        if (action.options.type === 'Off') value = 0

        if (instance.data.busState[busIndex].monitor ? 1 : 0 !== value) {
          return instance.connection.sendCommand(`Bus[${busIndex}].Monitor=${value}`)
        }

        return
      },
    },

    busMono: {
      name: 'Bus - Mono',
      description: 'Sets Mono on the specified Bus',
      options: [options(instance).busSelect, options(instance).toggle],
      callback: async (action) => {
        const bus = action.options.bus === 'Selected' ? instance.selectedBus : action.options.bus
        const busIndex = busName.indexOf(bus)

        if (!instance.data.busState[busIndex]) return

        let value = instance.data.busState[busIndex].mono ? 0 : 1
        if (action.options.type === 'On') value = 1
        if (action.options.type === 'Off') value = 0

        if (instance.data.busState[busIndex].mono ? 1 : 0 !== value) {
          return instance.connection.sendCommand(`Bus[${busIndex}].Mono=${value}`)
        }

        return
      },
    },

    busMute: {
      name: 'Bus - Mute',
      description: 'Mutes the specified Bus',
      options: [
        options(instance).busSelect,
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'Toggle',
          choices: ['Toggle', 'Mute', 'Unmute'].map((type) => ({ id: type, label: type })),
        },
      ],
      callback: async (action) => {
        const bus = action.options.bus === 'Selected' ? instance.selectedBus : action.options.bus
        const busIndex = busName.indexOf(bus)

        if (!instance.data.busState[busIndex]) return

        let value = instance.data.busState[busIndex].mute ? 0 : 1
        if (action.options.type === 'Mute') value = 1
        if (action.options.type === 'Unmute') value = 0

        if (instance.data.busState[busIndex].mute ? 1 : 0 !== value) {
          return instance.connection.sendCommand(`Bus[${busIndex}].Mute=${value}`)
        }

        return
      },
    },

    busReturns: {
      name: 'Bus - Returns',
      description: 'Bus Reverb, Delay, and FX Returns',
      options: [
        options(instance).busSelect,
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
          disableAutoExpression: true,
        },
        {
          type: 'number',
          label: 'Value',
          description: '0 to 10',
          id: 'value',
          default: 0,
          min: 0,
          max: 10,
        },
      ],
      callback: async (action) => {
        const bus = action.options.bus === 'Selected' ? instance.selectedBus : action.options.bus
        const busIndex = busName.indexOf(bus)

        if (!instance.data.busState[busIndex]) return
        let value = action.options.value

        if (value < 0) value = 0
        if (value > 10) value = 10

        return instance.connection.sendCommand(`Bus[${busIndex}].${action.options.returns}=${value}`)
      },
    },

    busSel: {
      name: 'Bus - SEL',
      description: 'Control SEL on the specified Bus',
      options: [options(instance).busSelect, options(instance).toggle],
      callback: async (action) => {
        const bus = action.options.bus === 'Selected' ? instance.selectedBus : action.options.bus
        const busIndex = busName.indexOf(bus)

        if (!instance.data.busState[busIndex]) return

        let value = instance.data.busState[busIndex].sel ? 0 : 1
        if (action.options.type === 'On') value = 1
        if (action.options.type === 'Off') value = 0

        if (instance.data.busState[busIndex].sel ? 1 : 0 !== value) {
          return instance.connection.sendCommand(`Bus[${busIndex}].Sel=${value}`)
        }

        return
      },
    },
  }
}
