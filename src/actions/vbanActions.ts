import { type CompanionActionDefinitions, type CompanionActionSchema, createModuleLogger } from '@companion-module/base'
import type VoicemeeterInstance from '../index.js'

export type VBANActionsSchema = {
  vbanSettings: CompanionActionSchema<
    {
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
    },
    void
  >
}

const log = createModuleLogger('VBAN Actions')

export const getVBANActions = (instance: VoicemeeterInstance): CompanionActionDefinitions<VBANActionsSchema> => {
  return {
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
					disableAutoExpression: true,
        },
        {
          type: 'textinput',
          label: 'Stream Index',
					description: '0 to 9',
          id: 'index',
          default: '0',
          useVariables: true,
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
					disableAutoExpression: true,
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
          isVisibleExpression: `$(options:property) === 'on'`
        },
        {
          type: 'textinput',
          label: 'Stream Name',
          id: 'name',
          default: 'StreamX',
          useVariables: true,
          isVisibleExpression: `$(options:property) === 'name'`
        },
        {
          type: 'textinput',
          label: 'IP',
          id: 'ip',
          default: '0.0.0.0',
          useVariables: true,
          isVisibleExpression: `$(options:property) === 'ip'`
        },
        {
          type: 'textinput',
          label: 'Port',
          id: 'port',
          default: '6980',
          useVariables: true,
          isVisibleExpression: `$(options:property) === 'port'`
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
					disableAutoExpression: true,
          isVisibleExpression: `$(options:type) === 'outstream' && $(options:property) === 'sr'`
        },
        {
          type: 'textinput',
          label: 'Channel',
					description: '1 to 8',
          id: 'channel',
          default: '2',
          useVariables: true,
          isVisibleExpression: `$(options:type) === 'outstream' && $(options:property) === 'channel'`
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
					disableAutoExpression: true,
          isVisibleExpression: `$(options:type) === 'outstream' && $(options:property) === 'bit'`
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
					disableAutoExpression: true,
          isVisibleExpression: `$(options:property) === 'quality'`
        },
        {
          type: 'textinput',
          label: 'Strip/Bus (0 to 8)',
          id: 'route',
          default: '0',
          useVariables: true,
          isVisibleExpression: `$(options:property) === 'route'`
        },
      ],
      callback: async (action) => {
        const index = parseInt(action.options.index, 10)

        if (isNaN(index)) {
          log.warn(`VBAN Settings must have a valid index (0 to 7)`)
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
