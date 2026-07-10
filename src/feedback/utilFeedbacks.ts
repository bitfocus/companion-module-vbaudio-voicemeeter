import type { CompanionFeedbackSchema, CompanionFeedbackDefinitions } from '@companion-module/base'
import { options } from '../utils.js'
import type VoicemeeterInstance from '../index.js'

export type UtilFeedbacksSchema = {
  utilSelectedBus: CompanionFeedbackSchema<{
    bus: string
  }>
  utilSelectedStrip: CompanionFeedbackSchema<{
    strip: number
  }>
}

export const getUtilFeedbacks = (instance: VoicemeeterInstance): CompanionFeedbackDefinitions<UtilFeedbacksSchema> => {
  return {
    utilSelectedBus: {
      type: 'boolean',
      name: 'Util - Selected Bus',
      description: 'Indicates the currently selected Bus in Companion',
      options: [options(instance).bus],
      defaultStyle: {
        color: 0x000000,
        bgcolor: 0x00ff00,
      },
      callback: (feedback) => {
        return instance.selectedBus === feedback.options.bus
      },
    },

    utilSelectedStrip: {
      type: 'boolean',
      name: 'Util - Selected Strip',
      description: 'Indicates the currently selected Strip in Companion',
      options: [options(instance).strip],
      defaultStyle: {
        color: 0x000000,
        bgcolor: 0x00ff00,
      },
      callback: (feedback) => {
        return instance.selectedStrip === feedback.options.strip
      },
    },
  }
}
