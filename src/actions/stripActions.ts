import { type CompanionActionDefinitions, type CompanionActionSchema, createModuleLogger } from '@companion-module/base'
import { type BusName, busName, options } from '../utils.js'
import type VoicemeeterInstance from '../index.js'

export type StripActionsSchema = {
  routeAudio: CompanionActionSchema<
    {
      type: 'Toggle' | 'On' | 'Off'
      recorderType: 'On' | 'Off'
      source: number
      destination: BusName
    },
    void
  >
  stripCompressor: CompanionActionSchema<
    {
      strip: number | 'Selected'
      setting: 'comp' | 'compGainIn' | 'compRatio' | 'compThreshold' | 'compAttack' | 'compRelease' | 'compKnee' | 'compGainOut' | 'compMakeUp'
      adjustment: 'Set' | 'Increase' | 'Decrease'
      comp: number
      compGainIn: number
      compRatio: number
      compThreshold: number
      compAttack: number
      compRelease: number
      compKnee: number
      compGainOut: number
      compMakeUp: number
    },
    void
  >
  stripDenoiser: CompanionActionSchema<
    {
      strip: number | 'Selected'
      adjustment: 'Set' | 'Increase' | 'Decrease'
      value: number
    },
    void
  >
  stripEQGain: CompanionActionSchema<
    {
      strip: number | 'Selected'
      freq: 1 | 2 | 3
      adjustment: 'Set' | 'Increase' | 'Decrease'
      value: number
    },
    void
  >
  stripGain: CompanionActionSchema<
    {
      strip: number | 'Selected'
      adjustment: 'Set' | 'Increase' | 'Decrease'
      fade: number
      value: number
    },
    void
  >
  stripGate: CompanionActionSchema<
    {
      strip: number | 'Selected'
      setting: 'gate' | 'gateThreshold' | 'gateDamping' | 'gateBPSidechain' | 'gateAttack' | 'gateHold' | 'gateRelease'
      adjustment: 'Set' | 'Increase' | 'Decrease'
      gate: string
      gateThreshold: string
      gateDamping: string
      gateBPSidechain: string
      gateAttack: string
      gateHold: string
      gateRelease: string
    },
    void
  >
  stripMono: CompanionActionSchema<
    {
      strip: number | 'Selected'
      type: 'Toggle' | 'On' | 'Off'
    },
    void
  >
  stripMute: CompanionActionSchema<
    {
      strip: number | 'Selected'
      type: 'Toggle' | 'Mute' | 'Unmute'
    },
    void
  >
  stripSolo: CompanionActionSchema<
    {
      strip: number | 'Selected'
      type: 'Toggle' | 'On' | 'Off'
    },
    void
  >
}

const log = createModuleLogger('Strip Actions')

export const getStripActions = (instance: VoicemeeterInstance): CompanionActionDefinitions<StripActionsSchema> => {
  return {
    routeAudio: {
      name: 'Route Audio',
      description: 'Route a Strip or Recorder to a Bus',
      options: [
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'Toggle',
          choices: ['Toggle', 'On', 'Off'].map((type) => ({ id: type, label: type })),
          expressionDescription: `Valid Values: 'Toggle', 'On', or 'Off'`,
          isVisibleExpression: `$(options:source) !== 8`,
        },
        {
          type: 'dropdown',
          label: 'Type',
          id: 'recorderType',
          default: 'On',
          choices: [
            { id: 'On', label: 'On' },
            { id: 'Off', label: 'Off' },
          ],
          expressionDescription: `Valid Values: 'On' or 'Off'`,
          isVisibleExpression: `$(options:source) === 8`,
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
          disableAutoExpression: true,
        },
        {
          type: 'dropdown',
          label: 'Destination',
          id: 'destination',
          default: 'A1',
          choices: busName.map((type) => ({ id: type, label: type })),
          expressionDescription: `Valid Values: 'A1' to 'B3'`,
        },
      ],
      callback: async (action) => {
        const source = action.options.source === 9 ? instance.selectedStrip - 1 : action.options.source
        if (source === -1 || source === -2) return

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
        options(instance).stripSelect,
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
          disableAutoExpression: true,
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
          isVisibleExpression: `$(options:setting) !+= 'comp' && $(options:setting) !== 'compMakeUp'`,
          expressionDescription: `Valid Values: 'Set', 'Increase', or 'Decrease'`,
        },
        {
          type: 'number',
          label: 'Compressor',
          description: '0 to 10',
          id: 'comp',
          default: 0,
          min: 0,
          max: 10,
          isVisibleExpression: `$(options:setting) === 'comp'`,
        },
        {
          type: 'number',
          label: 'Input Gain',
          description: '-24 to +24',
          id: 'compGainIn',
          default: 0,
          min: -24,
          max: 245,
          isVisibleExpression: `$(options:setting) === 'compGainIn'`,
        },
        {
          type: 'number',
          label: 'Ratio',
          description: '1 to 8',
          id: 'compRatio',
          default: 1,
          min: 1,
          max: 8,
          isVisibleExpression: `$(options:setting) === 'compRatio'`,
        },
        {
          type: 'number',
          label: 'Threshold',
          description: '-40 to -3 dB',
          id: 'compThreshold',
          default: -3,
          min: -40,
          max: -3,
          isVisibleExpression: `$(options:setting) === 'compThreshold'`,
        },
        {
          type: 'number',
          label: 'Attack Time',
          description: '0 to 200 ms',
          id: 'compAttack',
          default: 0,
          min: 0,
          max: 200,
          isVisibleExpression: `$(options:setting) === 'compAttack'`,
        },
        {
          type: 'number',
          label: 'Release Time',
          description: '0 to 5000 ms',
          id: 'compRelease',
          default: 0,
          min: 0,
          max: 5000,
          isVisibleExpression: `$(options:setting) === 'compRelease'`,
        },
        {
          type: 'number',
          label: 'Knee',
          description: '0 to 1',
          id: 'compKnee',
          default: 0,
          min: 0,
          max: 1,
          isVisibleExpression: `$(options:setting) === 'compKnee'`,
        },
        {
          type: 'number',
          label: 'Output Gain',
          description: '-24 to +24',
          id: 'compGainOut',
          default: 0,
          min: -24,
          max: 24,
          isVisibleExpression: `$(options:setting) === 'compGainOut'`,
        },
        {
          type: 'number',
          label: 'Make Up',
          description: '0 or 1',
          id: 'compMakeUp',
          default: 0,
          min: 0,
          max: 1,
          step: 1,
          isVisibleExpression: `$(options:setting) === 'compMakeUp'`,
        },
      ],
      callback: async (action) => {
        const stripId = (action.options.strip === 'Selected' ? instance.selectedStrip : action.options.strip) - 1
        if (stripId === -1) return

        const updateCompressor = async (command: any, min: number, max: number) => {
          const value = action.options[action.options.setting]

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
              log.debug(`Missing strip data, strip id: ${stripId}`)
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
        options(instance).stripSelect,
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
        const stripId = (action.options.strip === 'Selected' ? instance.selectedStrip : action.options.strip) - 1
        if (stripId === -1) return

        const value = action.options.value
        if (isNaN(value)) return

        let newValue = value
        if (newValue < 0) newValue = 0
        if (newValue > 10) newValue = 10
        return instance.connection.sendCommand(`Strip[${stripId}].Denoiser=${newValue}`)
      },
    },

    stripEQGain: {
      name: 'Strip - EQ Gain 1 to 3 (Virtual Strips)',
      description: 'Adjust EQ on Virtual Strips',
      options: [
        options(instance).stripSelect,
        {
          type: 'dropdown',
          label: 'Frequency',
          id: 'freq',
          default: 3,
          choices: [
            { id: 3, label: 'Treble' },
            { id: 2, label: 'Mid' },
            { id: 1, label: 'Bass' },
          ],
          expressionDescription: `Valid Values: 1 for Bass, 2 for Mid, 3 for Treble`,
        },
        options(instance).adjustment,
        {
          type: 'number',
          label: 'EQ',
          description: '-12 to 12',
          id: 'value',
          default: 0,
          min: -12,
          max: 12,
        },
      ],
      callback: async (action) => {
        const stripId = (action.options.strip === 'Selected' ? instance.selectedStrip : action.options.strip) - 1
        if (stripId === -1) return

        const value = action.options.value

        if (isNaN(value)) return log.warn(`Invalid EQ Value: ${value}`)

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
        options(instance).stripSelect,
        options(instance).adjustment,
        {
          type: 'number',
          label: 'Fade time in ms',
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
        const stripId = (action.options.strip === 'Selected' ? instance.selectedStrip : action.options.strip) - 1
        if (stripId === -1) return

        let fade = action.options.fade
        const value = action.options.value

        if (isNaN(fade) || isNaN(value)) return

        let currentValue = instance.data.stripGaindB100Layer0[stripId]

        const busSel = instance.data.busState.find((bus: any) => bus.sel)

        if (busSel) {
          const values: number[] = []

          instance.data.busState.forEach((bus: any, index: number) => {
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
        options(instance).stripSelect,
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
          disableAutoExpression: true,
        },
        options(instance).adjustment,
        {
          type: 'textinput',
          label: 'Gate',
          description: '0 to 10',
          id: 'gate',
          default: '0',
          isVisibleExpression: `$(options:setting) === 'gate'`,
          useVariables: true,
        },
        {
          type: 'textinput',
          label: 'Threshold',
          description: '-60 to -10 dB',
          id: 'gateThreshold',
          default: '-60',
          isVisibleExpression: `$(options:setting) === 'gateThreshold'`,
          useVariables: true,
        },
        {
          type: 'textinput',
          label: 'Damping',
          description: '-60 to -10 dB',
          id: 'gateDamping',
          default: '-60',
          isVisibleExpression: `$(options:setting) === 'gateDamping'`,
          useVariables: true,
        },
        {
          type: 'textinput',
          label: 'BP Sidechain',
          description: '100 to 4000 Hz',
          id: 'gateBPSidechain',
          default: '0',
          isVisibleExpression: `$(options:setting) === 'gateBPSidechain'`,
          useVariables: true,
        },
        {
          type: 'textinput',
          label: 'Attack Time',
          description: '0 to 1000 ms',
          id: 'gateAttack',
          default: '0',
          isVisibleExpression: `$(options:setting) === 'gateAttack'`,
          useVariables: true,
        },
        {
          type: 'textinput',
          label: 'Hold Time',
          description: '0 to 5000 ms',
          id: 'gateHold',
          default: '0',
          isVisibleExpression: `$(options:setting) === 'gateHold'`,
          useVariables: true,
        },
        {
          type: 'textinput',
          label: 'ReleaseTime',
          description: '0 to 5000 ms',
          id: 'gateRelease',
          default: '0',
          isVisibleExpression: `$(options:setting) === 'gateRelease'`,
          useVariables: true,
        },
      ],
      callback: async (action) => {
        const stripId = (action.options.strip === 'Selected' ? instance.selectedStrip : action.options.strip) - 1
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
      options: [options(instance).stripSelect, options(instance).toggle],
      callback: async (action) => {
        const stripId = (action.options.strip === 'Selected' ? instance.selectedStrip : action.options.strip) - 1
        if (stripId === -1) return

        let value = action.options.type === 'On' ? 1 : 0

        if (action.options.type === 'Toggle') {
          value = instance.data.stripState[stripId].mono ? 0 : 1
        }

        return instance.connection.sendCommand(`Strip[${stripId}].Mono=${value}`)
      },
    },

    stripMute: {
      name: 'Strip - Mute',
      description: 'Mutes the specified Strip',
      options: [
        options(instance).stripSelect,
        {
          type: 'dropdown',
          label: 'Type',
          id: 'type',
          default: 'Toggle',
          choices: ['Toggle', 'Mute', 'Unmute'].map((type) => ({ id: type, label: type })),
        },
      ],
      callback: async (action) => {
        const stripId = (action.options.strip === 'Selected' ? instance.selectedStrip : action.options.strip) - 1
        if (stripId === -1) return

        let value = action.options.type === 'Mute' ? 1 : 0

        if (action.options.type === 'Toggle') {
          value = instance.data.stripState[stripId].mute ? 0 : 1
        }

        return instance.connection.sendCommand(`Strip[${stripId}].Mute=${value}`)
      },
    },

    stripSolo: {
      name: 'Strip - Solo',
      description: 'Sets Solo on the specified Strip',
      options: [options(instance).stripSelect, options(instance).toggle],
      callback: async (action) => {
        const stripId = (action.options.strip === 'Selected' ? instance.selectedStrip : action.options.strip) - 1
        if (stripId === -1) return

        let value = action.options.type === 'On' ? 1 : 0

        if (action.options.type === 'Toggle') {
          value = instance.data.stripState[stripId].solo ? 0 : 1
        }

        return instance.connection.sendCommand(`Strip[${stripId}].Solo=${value}`)
      },
    },
  }
}
