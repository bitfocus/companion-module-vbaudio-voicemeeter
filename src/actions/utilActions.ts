import { type CompanionActionDefinitions, type CompanionActionSchema } from '@companion-module/base'
import { options } from '../utils.js'
import type VoicemeeterInstance from '../index.js'

export type UtilActionsSchema = {
  utilSelectBus: CompanionActionSchema<
    {
      bus: string
    },
    void
  >
  utilSelectStrip: CompanionActionSchema<
    {
      strip: number
    },
    void
  >
}

export const getUtilActions = (instance: VoicemeeterInstance): CompanionActionDefinitions<UtilActionsSchema> => {
  return {
    utilSelectBus: {
      name: 'Util - Select Bus',
      description: 'For use in Companion actions/feedback/variables, not Voicemeeter',
      options: [options(instance).bus],
      callback: async (action) => {
        instance.selectedBus = instance.selectedBus === action.options.bus ? '' : action.options.bus
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
          default: 1,
          choices: [
            ...instance.data.stripLabelUTF8c60.map((label: string, index: number) => ({
              id: index + 1,
              label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
            })),
            { id: 9, label: 'Recorder' },
          ],
        },
      ],
      callback: async (action) => {
        instance.selectedStrip = instance.selectedStrip === action.options.strip ? -1 : action.options.strip
        instance.checkFeedbacks('stripMeters', 'stripMono', 'stripMute', 'stripSolo', 'utilSelectedStrip', 'routing')
        instance.variables?.updateVariables()
      },
    },
  }
}
