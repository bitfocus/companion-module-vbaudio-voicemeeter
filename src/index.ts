import { InstanceBase, InstanceStatus, createModuleLogger, type CompanionHTTPRequest, type CompanionHTTPResponse, type SomeCompanionConfigField } from '@companion-module/base'
import { type Config, getConfigFields } from './config.js'
import { type ActionsSchema, getActions } from './actions/actions.js'
import { type FeedbacksSchema, getFeedbacks } from './feedback/feedback.js'
import { httpHandler } from './http.js'
import { getPresetDefinitions, getPresetStructure } from './presets/presets.js'
import { getUpgrades } from './upgrade.js'
import { VariablesSchema, Variables } from './variables/variables.js'
import { type VBANData, defaultData, VBAN } from './vban.js'

export interface InstanceTypes {
  config: Config
  secrets: undefined
  actions: ActionsSchema
  feedbacks: FeedbacksSchema
  variables: VariablesSchema
}

const log = createModuleLogger('Main')

/**
 * Companion instance class for VBAudio Voicemeeter
 */
export default class VoicemeeterInstance extends InstanceBase<InstanceTypes> {
  public connected = false
  public data: VBANData = defaultData
  public selectedBus = ''
  public selectedStrip = -1
  public connection = new VBAN(this)

  constructor(internal: unknown) {
    super(internal)
    this.connection.init()
  }

  public config: Config = {
    host: '',
    port: 6,
    commandStream: '',
  }

  public variables: Variables | null = null

  /**
   * @description triggered on instance being enabled
   */
  public async init(config: Config): Promise<void> {
    log.info(
      'This module has been tested with Voicemeeter Potato, if other versions run in to issues please report them here: https://github.com/bitfocus/companion-module-vbaudio-voicemeeter/issues ',
    )
    await this.configUpdated(config)

    this.variables = new Variables(this)
    this.variables.updateDefinitions()
  }

  /**
   * @param config new configuration data
   * @description triggered every time the config for this instance is saved
   */
  public async configUpdated(config: Config): Promise<void> {
    const change = this.config.host !== config.host || this.config.port !== config.port || this.config.commandStream !== config.commandStream

    this.config = config
    if (change && !(this.config.host === '' || this.config.commandStream === '')) this.connection.registerRTPacket()

    if (this.config.host === '' || this.config.commandStream === '') {
      log.info(`Please configure the Voicemeeter instance, and ensure that VBAN, and the VBAN ASCII stream is enabled in Voicemeeter.`)
      this.updateStatus(InstanceStatus.BadConfig)
    }

    this.updateInstance()
    this.setPresetDefinitions(getPresetStructure, getPresetDefinitions(this))
    if (this.variables) this.variables.updateDefinitions()
  }

  /**
   * @returns config options
   * @description generates the config options available for this instance
   */
  public getConfigFields(): SomeCompanionConfigField[] {
    return getConfigFields()
  }

  /**
   * @description close connections and stop timers/intervals
   */
  public async destroy(): Promise<void> {
    log.debug(`Instance destroyed: ${this.id}`)
    this.connection.destroy()
  }

  /**
   * @description sets actions and feedbacks available for this instance
   */
  public updateInstance(): void {
    // Cast actions and feedbacks from Voicemeeter types to Companion types
    const actions = getActions(this)
    const feedbacks = getFeedbacks(this)

    this.setActionDefinitions(actions)
    this.setFeedbackDefinitions(feedbacks)
  }

  /**
   * @param request HTTP request from Companion
   * @returns HTTP response
   */
  public async handleHttpRequest(request: CompanionHTTPRequest): Promise<CompanionHTTPResponse> {
    return httpHandler(this, request)
  }
}

export const UpgradeScripts = getUpgrades

