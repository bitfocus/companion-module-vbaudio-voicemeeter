import type { CompanionVariableDefinitions } from '@companion-module/base'
import type VoicemeeterInstance from '../index.js'

export type UtilVariablesSchema = {
  type: number
  version: string
  util_selected_bus: string
  util_selected_strip: string | number
}

export const utilDefinitions = (_instance: VoicemeeterInstance): CompanionVariableDefinitions<UtilVariablesSchema> => {
  const definitions: CompanionVariableDefinitions<UtilVariablesSchema> = {
    type: { name: 'Type' },
    version: { name: 'Version' },
    util_selected_bus: { name: 'Util Selected Bus' },
    util_selected_strip: { name: 'Util Selected Strip' },
  }

  return definitions
}

export const utilValues = async (instance: VoicemeeterInstance): Promise<UtilVariablesSchema> => {
  const variables: UtilVariablesSchema = {
    type: instance.data.voicemeeterType,
    version: instance.data.voicemeeterVersion,
    util_selected_bus: instance.selectedBus,
    util_selected_strip: instance.selectedStrip === 9 ? 'Recorder' : instance.data.stripLabelUTF8c60[instance.selectedStrip - 1]
  }

  return variables
}
