import type { CompanionStaticUpgradeScript, CompanionStaticUpgradeResult } from '@companion-module/base'
import type { Config } from './config'

const upgradeV1_2_0: CompanionStaticUpgradeScript<Config> = (_context, props): CompanionStaticUpgradeResult<Config> => {
  const actions: any = props.actions

  const upgrade: CompanionStaticUpgradeResult<Config> = {
    updatedActions: [],
    updatedConfig: null,
    updatedFeedbacks: [],
  }

  actions.forEach((action: any) => {
    if (action.actionId === 'routeAudio') {
      action.options.type = 'Toggle'

      upgrade.updatedActions.push(action)
    }
  })

  return upgrade
}

const upgradeV2_0_0: CompanionStaticUpgradeScript<Config> = (_context, props): CompanionStaticUpgradeResult<Config> => {
  const actions: any = props.actions

  const upgrade: CompanionStaticUpgradeResult<Config> = {
    updatedActions: [],
    updatedConfig: null,
    updatedFeedbacks: [],
  }

  actions.forEach((action: any) => {
    if (action.actionId === 'busReturns') {
      delete action.options.adjustment
      upgrade.updatedActions.push(action)
    } else if (action.actionId === 'recorderGain') {
      delete action.options.adjustment
      upgrade.updatedActions.push(action)
    } else if (action.actionId === 'recorderState') {
      if (action.options.type === 'PlayStop') action.options.type === 'Play'
      upgrade.updatedActions.push(action)
    }
  })

  return upgrade
}

export const getUpgrades = (): CompanionStaticUpgradeScript<Config>[] => {
  return [upgradeV1_2_0, upgradeV2_0_0]
}
