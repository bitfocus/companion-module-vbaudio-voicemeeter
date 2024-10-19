import {
  InstanceBase,
  runEntrypoint,
  CompanionFeedbackDefinitions,
  CompanionHTTPRequest,
  CompanionHTTPResponse,
  SomeCompanionConfigField,
  InstanceStatus,
} from '@companion-module/base'
import { Config, getConfigFields } from './config'
import { getActions } from './actions'
import { getFeedbacks } from './feedback'
import { httpHandler } from './http'
import { getPresets } from './presets'
import { getUpgrades } from './upgrade'
import { VoicemeeterType } from './utils'
import { Variables } from './variables'
import { defaultData, VBAN, VBANData } from './vban'

/**
 * Companion instance class for VBAudio Voicemeeter
 */
class VoicemeeterInstance extends InstanceBase<Config> {
  public connected = false
  public data: VBANData = defaultData
  public selectedBus = -1
  public selectedStrip = -1
  public type: VoicemeeterType = ''
  public connection = new VBAN(this)
  public version = ''

  constructor(internal: unknown) {
    super(internal)
    this.connection.init()
    //this.instanceOptions.disableVariableValidation = true
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
    this.log('debug', `Process ID: ${process.pid}`)
    this.log(
      'info',
      'This module has been tested with Voicemeeter Potato, if other versions run in to issues please report them here: https://github.com/bitfocus/companion-module-vbaudio-voicemeeter/issues '
    )
    this.log(
      'warn',
      'v2.0.0 of this module has undergone significant changes, including removing the need for proxy connections to Voicemeeter and instead utilizing the new VBAN features in the latest version of Voicemeeter. Please see https://github.com/bitfocus/companion-module-vbaudio-voicemeeter for changes and requirements.'
    )
    await this.configUpdated(config)

    this.variables = new Variables(this)
  }

  /**
   * @param config new configuration data
   * @description triggered every time the config for this instance is saved
   */
  public async configUpdated(config: Config): Promise<void> {
    const change =
      this.config.host !== config.host ||
      this.config.port !== config.port ||
      this.config.commandStream !== config.commandStream

    this.config = config
    if (change && !(this.config.host === '' || this.config.commandStream === '')) this.connection.registerRTPacket()

    if (this.config.host === '' || this.config.commandStream === '') {
      this.log(
        'info',
        `Please configure the Voicemeeter instance, and ensure that VBAN, and the VBAN ASCII stream is enabled in Voicemeeter.`
      )
      this.updateStatus(InstanceStatus.BadConfig)
    }

    this.updateInstance()
    this.setPresetDefinitions(getPresets(this))
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
    this.log('debug', `Instance destroyed: ${this.id}`)
    this.connection.destroy()
  }

  /**
   * @description sets actions and feedbacks available for this instance
   */
  public updateInstance(): void {
    // Cast actions and feedbacks from Voicemeeter types to Companion types
    const actions = getActions(this)
    const feedbacks = getFeedbacks(this) as CompanionFeedbackDefinitions

    this.setActionDefinitions(actions)
    this.setFeedbackDefinitions(feedbacks)
  }

  /**
   * @param request HTTP request from Companion
   * @returns HTTP response
   */
  public handleHttpRequest(request: CompanionHTTPRequest): Promise<CompanionHTTPResponse> {
    return httpHandler(this, request)
  }
}

export = VoicemeeterInstance

runEntrypoint(VoicemeeterInstance, getUpgrades())
