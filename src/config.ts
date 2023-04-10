import { SomeCompanionConfigField } from '@companion-module/base'

export interface Config {
  host: string
  port: number
}

export const getConfigFields = (): SomeCompanionConfigField[] => {
  return [
    {
      type: 'static-text',
      id: 'proxyInfo',
      width: 11,
      label: 'Voicemeeter Proxy',
      value:
        "If you're connecting to Voicemeeter on the same machine that's running Companion, set the Target Host as 127.0.0.1. Otherwise read the help documentation on how to start a proxy.",
    },
    {
      type: 'textinput',
      id: 'host',
      label: 'Target host',
      width: 6,
      default: '',
    },
    {
      type: 'number',
      id: 'port',
      label: 'Proxy port',
      width: 6,
      default: 8099,
      min: 1,
      max: 65535,
      step: 1,
    },
  ]
}
