import type { CompanionPresetSection, CompanionPresetDefinitions } from '@companion-module/base'
import type VoicemeeterInstance from '../index.js'
import { type InstanceTypes } from '../index.js'
import { getBusDefinitions, getBusStructure } from './busPresets.js'
import { getStripDefinitions, getStripStructure } from './stripPresets.js'

export function getPresetDefinitions(_instance: VoicemeeterInstance): CompanionPresetDefinitions<InstanceTypes> {
  const presets: CompanionPresetDefinitions<InstanceTypes> = {
    ...getBusDefinitions(),
    ...getStripDefinitions(),
  }

  return presets
}

export const getPresetStructure: CompanionPresetSection<InstanceTypes>[] = [...getBusStructure(), ...getStripStructure()]
