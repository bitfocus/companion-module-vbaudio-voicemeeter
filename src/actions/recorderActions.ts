import { type CompanionActionDefinitions, type CompanionActionSchema } from '@companion-module/base'
import type VoicemeeterInstance from '../index.js'

export type RecorderActionsSchema = {
  recorderArm: CompanionActionSchema<
    {
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
    },
    void
  >
  recorderArmInputOutput: CompanionActionSchema<
    {
      type: 'strip' | 'bus'
    },
    void
  >
  recorderGain: CompanionActionSchema<
    {
      value: number
    },
    void
  >
  recorderLoadTrack: CompanionActionSchema<
    {
      path: string
    },
    void
  >
  recorderState: CompanionActionSchema<
    {
      type: 'Play' | 'Stop' | 'Record' | 'Goto' | 'FastForward' | 'Loop' | 'PlayOnLoad'
      state: 'On' | 'Off'
    },
    void
  >
}

export const getRecorderActions = (instance: VoicemeeterInstance): CompanionActionDefinitions<RecorderActionsSchema> => {
  return {
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
            ...instance.data.stripLabelUTF8c60.map((label: string, index: number) => ({
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
          disableAutoExpression: true,
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
          expressionDescription: `Valid Values: 'On', 'Off'`,
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
          expressionDescription: `Valid Values: 'strip', or 'bus'`,
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
          type: 'number',
          label: 'Volume',
          description: `-60 to 12`,
          id: 'value',
          default: 0,
          min: -60,
          max: 12,
        },
      ],
      callback: async (action) => {
        let value = action.options.value

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
          disableAutoExpression: true,
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
          isVisibleExpression: `$(options:type) === 'Loop' || $(options:type) === 'PlayOnLoad'`,
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
  }
}
