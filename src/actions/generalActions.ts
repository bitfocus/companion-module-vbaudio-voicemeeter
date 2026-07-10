import { type CompanionActionDefinitions, type CompanionActionSchema } from '@companion-module/base'
import type VoicemeeterInstance from '../index.js'

export type GeneralActionsSchema = {
  commandActions: CompanionActionSchema<
    {
      command: 'Default' | 'Shutdown' | 'Show' | 'Restart' | 'Eject' | 'Reset' | 'Save' | 'Load' | 'Lock'
      show: 'Show' | 'Hide'
      path: string
      lock: 'Lock' | 'Unlock'
    },
    void
  >
  macroButton: CompanionActionSchema<
    {
      id: string
      type: 'state' | 'stateOnly' | 'trigger' | 'color'
      state: boolean
      color: string
    },
    void
  >
  rawCommand: CompanionActionSchema<
    {
      command: string
    },
    void
  >
}

export const getGeneralActions = (instance: VoicemeeterInstance): CompanionActionDefinitions<GeneralActionsSchema> => {
  return {
    commandActions: {
      name: 'General - Command Actions',
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
          disableAutoExpression: true,
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
          isVisibleExpression: `$(options:command) === 'Show'`,
        },
        {
          type: 'textinput',
          label: '',
          id: 'path',
          default: '',
          useVariables: true,
          isVisibleExpression: `$(options:command) === 'Save' || $(options:command) === 'Load'`,
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
          isVisibleExpression: `$(options:command) === 'Lock'`,
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
      name: 'General - Macro Button',
      description: '',
      options: [
        {
          type: 'textinput',
          label: 'Button ID',
          description: '0 based index',
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
          disableAutoExpression: true,
        },
        {
          type: 'checkbox',
          label: 'State',
          id: 'state',
          default: false,
          isVisibleExpression: `$(options:type) !== 'color'`,
        },
        {
          type: 'textinput',
          label: 'Color',
          description: '0 to 8',
          id: 'color',
          default: '0',
          useVariables: true,
          isVisibleExpression: `$(options:type) === 'color'`,
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
      name: 'General - Send Raw Command',
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
  }
}
