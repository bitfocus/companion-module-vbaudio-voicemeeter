import type { /*combineRgb,*/ CompanionButtonPresetDefinition, CompanionPresetDefinitions } from '@companion-module/base'
import type VoicemeeterInstance from './index'
import type { ActionCallbacks } from './actions'
import type { FeedbackCallbacks } from './feedback'

export type PresetCategory = ''

interface VoicemeeterPresetAdditions {
  category: PresetCategory
  steps: {
    down: ActionCallbacks[]
    up: ActionCallbacks[]
  }[]
  feedbacks: FeedbackCallbacks[]
}

export type VoicemeeterPreset = Exclude<CompanionButtonPresetDefinition, 'category' | 'steps' | 'feedbacks'> & VoicemeeterPresetAdditions

export function getPresets(_instance: VoicemeeterInstance): CompanionPresetDefinitions {
  const presets: VoicemeeterPreset[] = []

  return presets as unknown as CompanionPresetDefinitions
}
