import { CompanionStaticUpgradeScript, CompanionStaticUpgradeResult } from '@companion-module/base'
import { Config } from './config'

const upgradeV1_2_0: CompanionStaticUpgradeScript<Config> = (_context, props): CompanionStaticUpgradeResult<Config> => {
  let actions: any = props.actions

  const upgrade: CompanionStaticUpgradeResult<Config> = {
    updatedActions: [],
    updatedConfig: null,
    updatedFeedbacks: []
  }

  actions.forEach((action: any) => {
    if (action.actionId === 'routeAudio') {
      action.options.type = 'Toggle'

      upgrade.updatedActions.push(action)
    }
  })

  return upgrade
}

export const getUpgrades = (): CompanionStaticUpgradeScript<Config>[] => {
  return [upgradeV1_2_0]
}
