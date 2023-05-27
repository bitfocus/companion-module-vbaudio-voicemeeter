import {
  InstanceBase,
  runEntrypoint,
  CompanionFeedbackDefinitions,
  CompanionHTTPRequest,
  CompanionHTTPResponse,
  SomeCompanionConfigField,
  InstanceStatus,
} from '@companion-module/base'
import { Voicemeeter } from 'voicemeeter-connector'
import { io, Socket } from 'socket.io-client'
import { Config, getConfigFields } from './config'
import { getActions } from './actions'
import { getFeedbacks } from './feedback'
import { httpHandler } from './http'
import { getPresets } from './presets'
import { getUpgrades } from './upgrade'
import { Bus, Strip, ProxyConnection, getAllData, parseVersion, VoicemeeterType } from './utils'
import { Variables } from './variables'

interface Device {
  name: string
  hardwareId: string
  type: number
}

/**
 * Companion instance class for VBAudio Voicemeeter
 */
class VoicemeeterInstance extends InstanceBase<Config> {
  public connected = false
  public connection: null | Voicemeeter | ProxyConnection = null
  public proxySocket: null | Socket = null
  public bus: Bus[] = []
  public recorder: any = {}
  public strip: Strip[] = []
  public inputDevices: Device[] = []
  public outputDevices: Device[] = []
  public selectedBus = -1
  public selectedStrip = -1
  public type: VoicemeeterType = ''
  public version = ''
  private levelsInterval: NodeJS.Timer | null = null

  constructor(internal: unknown) {
    super(internal)
    //this.instanceOptions.disableVariableValidation = true
  }

  public config: Config = {
    host: '',
    port: 0,
  }

  public variables: Variables | null = null

  /**
   * @description triggered on instance being enabled
   */
  public async init(config: Config): Promise<void> {
    this.log('info', 'This module has been tested with Voicemeeter Potato, if other versions run in to issues please report them here: https://github.com/bitfocus/companion-module-vbaudio-voicemeeter/issues ')
    await this.configUpdated(config)

    this.variables = new Variables(this)
    await this.connect()
  }

  private async connect(): Promise<void> {
    if (this.config.host === '') {
      this.log(
        'info',
        `Please configure the Voicemeeter instance. If you're connection to Voicemeeter on the same machine that's running Companion, set the host to 127.0.0.1, otherwise read the instructions for setting up a proxy`
      )
    } else if (this.config.host === '127.0.0.1' || this.config.host.toLowerCase() === 'localhost') {
      Voicemeeter.init()
        .then((connection) => {
          connection.connect()
          this.connected = true
          this.connection = connection
          this.log('debug', 'Connected to Voicemeeter')
          this.updateStatus(InstanceStatus.Ok)
          this.updateData()

          connection.attachChangeEvent(() => {
            this.updateData()
            this.checkFeedbacks()
          })

          this.levelsInterval = setInterval(() => {
            this.strip.forEach((strip) => {
              let level0 = connection.getLevel(1, strip.index * 2) as number
              let level1 = connection.getLevel(1, strip.index * 2 + 1) as number

              // Buffer for momentary level drops to 0
              if (level0 === 0 && level1 === 0 && (strip.levels[0] !== 0 && strip.levels[1] !== 0)) {
                if (strip.levelsHold < 3) {
                  strip.levelsHold++
                  level0 = strip.levels[0]
                  level1 = strip.levels[1]
                } else {
                  strip.levelsHold = 0
                }
              }

              strip.levels[0] = level0
              strip.levels[1] = level1
            })

            this.bus.forEach((bus) => {
              let level0 = connection.getLevel(3, bus.index * 8) as number
              let level1 = connection.getLevel(3, bus.index * 8 + 1) as number

              // Buffer for momentary level drops to 0
              if (level0 === 0 && level1 === 0 && (bus.levels[0] !== 0 && bus.levels[1] !== 0)) {
                if (bus.levelsHold < 3) {
                  bus.levelsHold++
                  level0 = bus.levels[0]
                  level1 = bus.levels[1]
                } else {
                  bus.levelsHold = 0
                }
              }

              bus.levels[0] = level0
              bus.levels[1] = level1
            })

            this.variables?.updateVariables()
            this.checkFeedbacks()
          }, 100)
        })
        .catch((err) => {
          this.log('error', err.toString())
          this.updateStatus(InstanceStatus.ConnectionFailure, err)
        })
    } else {
      this.log('debug', `Starting connection to Proxy at ${this.config.host}:${this.config.port}`)
      this.updateStatus(InstanceStatus.Connecting)

      this.proxySocket = io(`ws://${this.config.host}:${this.config.port}`, {
        reconnectionDelayMax: 10000,
      })

      this.proxySocket.on('connect', () => {
        this.log('debug', 'Connected to Voicemeeter Proxy')
        this.updateStatus(InstanceStatus.Ok)
      })

      this.proxySocket.on('disconnect', (reason, description) => {
        this.log('warn', `Disconnected from Voicemeeter: ${reason} - ${JSON.stringify(description)}`)
        this.updateStatus(InstanceStatus.Disconnected)
      })

      this.proxySocket.on('data', (data) => {
        this.connected = data.connected
        this.type = data.type
        this.version = data.version
        this.inputDevices = data.inputDevices
        this.outputDevices = data.outputDevices
        this.bus = data.bus
        this.strip = data.strip
        this.recorder = data.recorder

        this.variables?.updateVariables()
        this.checkFeedbacks()
      })

      this.connection = {
        disconnect: () => {
          this.proxySocket?.emit('disconnect')
        },
        getBusParameter: (index, property) => {
          this.proxySocket?.emit('getBusParameter', { index, property })
        },
        getLevels: (type, id) => {
          this.proxySocket?.emit('getLevels', { type, id })
        },
        getRecorderParameter: (property) => {
          this.proxySocket?.emit('getRecorderParameter', { property })
        },
        getStripParameter: (index, property) => {
          this.proxySocket?.emit('getStripParameter', { index, property })
        },
        setBusParameter: (index, property, value) => {
          this.proxySocket?.emit('setBusParameter', { index, property, value })
        },
        setRecorderParameter: (property, value) => {
          this.proxySocket?.emit('setRecorderParameter', { property, value })
        },
        setStripParameter: (index, property, value) => {
          this.proxySocket?.emit('setStripParameter', { index, property, value })
        },
        $type: '',
        $version: '',
        $inputDevices: [],
        $outputDevices: [],
      } as ProxyConnection
    }
  }

  /**
   * @param config new configuration data
   * @description triggered every time the config for this instance is saved
   */
  public async configUpdated(config: Config): Promise<void> {
    this.config = config
    this.updateInstance()
    this.setPresetDefinitions(getPresets(this))
    if (this.variables) this.variables.updateDefinitions()
    return
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
    if (this.connection) this.connection.disconnect()
    if (this.levelsInterval) clearInterval(this.levelsInterval)
    this.log('debug', `Instance destroyed: ${this.id}`)
  }

  /**
   * @description updates all Voicemeeter data after init and any change
   */
  private updateData(): void {
    if (this.connection === null) return

    this.connection.updateDeviceList()

    this.inputDevices = this.connection.$inputDevices
    this.outputDevices = this.connection.$outputDevices
    this.type = (this.connection.$type as VoicemeeterType) || ''

    // Type version to Buffer as module is mistyped
    this.version = parseVersion(this.connection.$version as unknown as Buffer)

    getAllData(this)
    this.variables?.updateVariables()
    this.updateInstance()
  }

  /**
   * @description sets actions and feedbacks available for this instance
   */
  private updateInstance(): void {
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
