import type { CompanionActionDefinitions } from '@companion-module/base'
import type VoicemeeterInstance from '../index.js'
import { type BusActionsSchema, getBusActions } from './busActions.js'
import { type GeneralActionsSchema, getGeneralActions } from './generalActions.js'
import { type RecorderActionsSchema, getRecorderActions } from './recorderActions.js'
import { type StripActionsSchema, getStripActions } from './stripActions.js'
import { type UtilActionsSchema, getUtilActions } from './utilActions.js'
import { type VBANActionsSchema, getVBANActions } from './vbanActions.js'

export type ActionsSchema = BusActionsSchema & GeneralActionsSchema & RecorderActionsSchema & StripActionsSchema & UtilActionsSchema & VBANActionsSchema

export function getActions(instance: VoicemeeterInstance): CompanionActionDefinitions<ActionsSchema> {
  return {
    ...getBusActions(instance),
    ...getGeneralActions(instance),
    ...getRecorderActions(instance),
    ...getStripActions(instance),
    ...getUtilActions(instance),
    ...getVBANActions(instance),
  }
}
