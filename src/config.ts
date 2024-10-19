import { SomeCompanionConfigField } from '@companion-module/base'

export interface Config {
  host: string
  port: number
  commandStream: string
}

export const getConfigFields = (): SomeCompanionConfigField[] => {
  return [
    {
      type: 'static-text',
      id: 'proxyInfo',
      width: 11,
      label: 'Voicemeeter Connection',
      value:
        'Connecting to Voicemeeter requires VBAN turned on, as well as the ASCII stream (called Command1 by default) turned on',
    },
    {
      type: 'textinput',
      id: 'host',
      label: 'VBAN IP',
      width: 6,
      default: '',
    },
    {
      type: 'number',
      id: 'port',
      label: 'VBAN Port',
      width: 6,
      default: 8099,
      min: 1,
      max: 65535,
      step: 1,
    },
    {
      type: 'textinput',
      id: 'commandStream',
      label: 'VBAN Command Stream Name',
      width: 12,
      default: 'Command1',
    },
  ]
}
