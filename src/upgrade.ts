import type { CompanionStaticUpgradeScript, CompanionStaticUpgradeResult } from '@companion-module/base'
import type { Config } from './config.js'
import { busName } from './utils.js'

const upgradeV1_2_0: CompanionStaticUpgradeScript<Config> = (_context, props): CompanionStaticUpgradeResult<Config, undefined> => {
  const actions = props.actions

  const changes: CompanionStaticUpgradeResult<Config, undefined> = {
    updatedConfig: null,
    updatedSecrets: null,
    updatedActions: [],
    updatedFeedbacks: [],
  }

  actions.forEach((action: any) => {
    if (action.actionId === 'routeAudio') {
      action.options.type = 'Toggle'

      changes.updatedActions.push(action)
    }
  })

  return changes
}

const upgradeV2_0_0: CompanionStaticUpgradeScript<Config> = (_context, props): CompanionStaticUpgradeResult<Config, undefined> => {
  const actions = props.actions

  const changes: CompanionStaticUpgradeResult<Config, undefined> = {
    updatedConfig: null,
    updatedSecrets: null,
    updatedActions: [],
    updatedFeedbacks: [],
  }

  actions.forEach((action) => {
    if (action.actionId === 'busReturns') {
      delete action.options.adjustment
      changes.updatedActions.push(action)
    } else if (action.actionId === 'recorderGain') {
      delete action.options.adjustment
      changes.updatedActions.push(action)
    } else if (action.actionId === 'recorderState') {
      if (action.options.type?.value === 'PlayStop') action.options.type.value = 'Play'
      changes.updatedActions.push(action)
    }
  })

  return changes
}

const upgradeV3_0_0: CompanionStaticUpgradeScript<Config> = (_context, props): CompanionStaticUpgradeResult<Config, undefined> => {
  const changes: CompanionStaticUpgradeResult<Config, undefined> = {
    updatedConfig: null,
    updatedSecrets: null,
    updatedActions: [],
    updatedFeedbacks: [],
  }

  const busActionUpdate = ['busEQ', 'busEQAB', 'busGain', 'busMode', 'busMonitor', 'busMono', 'busMute', 'busReturns', 'busSel', 'utilSelectBus']
  const stripActionUpdate = ['stripCompressor', 'stripDenoiser', 'stripEQGain', 'stripGain', 'stripGate', 'stripMono', 'stripMute', 'stripSolo', 'utilSelectStrip']

  for (const action of props.actions) {
    let updated = false

    if (busActionUpdate.includes(action.actionId)) {
      let bus = action.options.bus?.value as number
      action.options.bus = { isExpression: false, value: bus === -1 ? 'Selected' : busName[bus] }
      updated = true
    } else if (stripActionUpdate.includes(action.actionId)) {
      let strip = action.options.strip?.value as string | number
			if (typeof strip === 'string') strip = parseInt(strip)
      action.options.strip = { isExpression: false, value: strip === -1 ? 'Selected' : strip + 1 }
      updated = true
    }

    if (action.actionId === 'busGain') {
      action.options.fade = { isExpression: false, value: parseInt(action.options.fade?.value as string) }
      action.options.value = { isExpression: false, value: parseFloat(action.options.value?.value as string) }
      updated = true
    } else if (action.actionId === 'busReturns') {
      action.options.value = { isExpression: false, value: parseFloat(action.options.value?.value as string) }
      updated = true
    } else if (action.actionId === 'recorderGain') {
      action.options.value = { isExpression: false, value: parseFloat(action.options.value?.value as string) }
      updated = true
    } else if (action.actionId === 'stripCompressor') {
      action.options.comp = { isExpression: false, value: parseFloat(action.options.comp?.value as string) }
      action.options.compGainIn = { isExpression: false, value: parseFloat(action.options.compGainIn?.value as string) }
      action.options.compRatio = { isExpression: false, value: parseFloat(action.options.compRatio?.value as string) }
      action.options.compThreshold = { isExpression: false, value: parseFloat(action.options.compThreshold?.value as string) }
      action.options.compAttack = { isExpression: false, value: parseFloat(action.options.compAttack?.value as string) }
      action.options.compRelease = { isExpression: false, value: parseFloat(action.options.compRelease?.value as string) }
      action.options.compKnee = { isExpression: false, value: parseFloat(action.options.compKnee?.value as string) }
      action.options.compGainOut = { isExpression: false, value: parseFloat(action.options.compGainOut?.value as string) }
      action.options.compMakeUp = { isExpression: false, value: parseInt(action.options.compMakeUp?.value as string) }
      updated = true
    } else if (action.actionId === 'stripDenoiser') {
      action.options.value = { isExpression: false, value: parseFloat(action.options.value?.value as string) }
      updated = true
    } else if (action.actionId === 'stripEQGain') {
      action.options.value = { isExpression: false, value: parseFloat(action.options.value?.value as string) }
      updated = true
    } else if (action.actionId === 'stripGain') {
      action.options.fade = { isExpression: false, value: parseFloat(action.options.fade?.value as string) }
      action.options.value = { isExpression: false, value: parseFloat(action.options.value?.value as string) }
      updated = true
    }

    if (updated) changes.updatedActions.push(action)
  }

  const busFeedbackUpdate = ['busEQ', 'busEQAB', 'busMeters', 'busMonitor', 'busMono', 'busMute', 'busSel', 'utilSelectedBus']
  const stripFeedbackUpdate = ['stripMeters', 'stripMono', 'stripMute', 'stripSolo', 'utilSelectedStrip']
  for (const feedback of props.feedbacks) {
    let updated = false

    if (busFeedbackUpdate.includes(feedback.feedbackId)) {
      let bus = feedback.options.bus?.value as number
      feedback.options.bus = { isExpression: false, value: bus === -1 ? 'Selected' : busName[bus] }
      updated = true
    }

    if (stripFeedbackUpdate.includes(feedback.feedbackId)) {
      let strip = feedback.options.strip?.value as number
      feedback.options.strip = { isExpression: false, value: strip === -1 ? 'Selected' : strip + 1 }
      updated = true
    }

		
    if (updated) changes.updatedFeedbacks.push(feedback)
  }

  return changes
}

export const getUpgrades: CompanionStaticUpgradeScript<Config>[] = [upgradeV1_2_0, upgradeV2_0_0, upgradeV3_0_0]
