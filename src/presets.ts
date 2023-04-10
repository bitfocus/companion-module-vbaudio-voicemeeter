import { /*combineRgb,*/ CompanionButtonPresetDefinition, CompanionPresetDefinitions } from '@companion-module/base'
import VoicemeeterInstance from './index'
import { ActionCallbacks } from './actions'
import { FeedbackCallbacks } from './feedback'

export type PresetCategory = ''

interface VoicemeeterPresetAdditions {
  category: PresetCategory
  steps: {
    down: ActionCallbacks[]
    up: ActionCallbacks[]
  }[]
  feedbacks: FeedbackCallbacks[]
}

export type VoicemeeterPreset = Exclude<CompanionButtonPresetDefinition, 'category' | 'steps' | 'feedbacks'> &
  VoicemeeterPresetAdditions

export function getPresets(_instance: VoicemeeterInstance): CompanionPresetDefinitions {
  const presets: VoicemeeterPreset[] = []

  return presets as unknown as CompanionPresetDefinitions
}
