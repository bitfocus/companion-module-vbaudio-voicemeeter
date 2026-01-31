import dgram from 'dgram'
import { InstanceStatus } from '@companion-module/base'
import type VoicemeeterInstance from './'

export interface StripData {
  mode: {
    mute: boolean
    solo: boolean
    mono: boolean
    muteC: boolean
    eq: boolean
    eqB: boolean
    busA1: boolean
    busA2: boolean
    busA3: boolean
    busA4: boolean
    busA5: boolean
    busB1: boolean
    busB2: boolean
    busB3: boolean
    pan0: boolean
    pancolor: boolean
    panmod: boolean
    postFXR: boolean
    postFXD: boolean
    postFX1: boolean
    postFX2: boolean
  }
  dBLevel: string
  audibility: number
  pos3D_x: number
  pos3D_y: number
  posColor_x: number
  posColor_y: number
  posMod_x: number
  posMox_y: number
  EQgain1: number
  EQgain2: number
  EQgain3: number
  PEQ: StripDataPEQ[]
  sendReverb: number
  sendDelay: number
  sendFX1: number
  sendFX2: number
  dBLimit: number
  karaoke: number
  comp: {
    gainIn: number
    attack: number
    release: number
    knee: number
    ratio: number
    threshold: number
    enabled: number
    auto: number
    gainOut: number

    [key: string]: any
  }
  gate: {
    dbThresholdIn: number
    dbDampingMax: number
    BPSideChan: number
    attack: number
    hold: number
    release: number

    [key: string]: any
  }
  denoiser: number
  pitch: {
    enabled: boolean
    dryWet: number
    value: number
    formantLo: number
    formantMed: number
    formantHigh: number

    [key: string]: any
  }
}

export interface StripDataPEQ {
  on: number
  type: number
  gain: string
  freq: string
  q: string
}

export interface StripState {
  mute: boolean
  solo: boolean
  mono: boolean
  muteC: boolean
  eq: boolean
  eqB: boolean
  busA1: boolean
  busA2: boolean
  busA3: boolean
  busA4: boolean
  busA5: boolean
  busB1: boolean
  busB2: boolean
  busB3: boolean
  pan0: boolean
  pancolor: boolean
  panmod: boolean
  panmask: boolean
  postFXR: boolean
  postFXD: boolean
  postFX1: boolean
  postFX2: boolean

  [key: string]: any
}

export interface BusState {
  mute: boolean
  mono: boolean
  mode: 'normal' | 'mixdownA' | 'mixdownB' | 'repeat' | 'composite' | 'upmixtv' | 'upmixtv2' | 'upmixtv4' | 'upmixtv6' | 'center' | 'lfe' | 'rear'
  mask: boolean
  eq: boolean
  cross: boolean
  eqB: boolean
  sel: boolean
  monitor: boolean

  [key: string]: any
}

export interface VBANData extends VBANHeader {
  inputLeveldB100: number[][]
  outputLeveldB100: number[][]
  TransportBit: number
  stripData: StripData[]
  stripState: StripState[]
  busState: BusState[]
  stripGaindB100Layer0: number[]
  stripGaindB100Layer1: number[]
  stripGaindB100Layer2: number[]
  stripGaindB100Layer3: number[]
  stripGaindB100Layer4: number[]
  stripGaindB100Layer5: number[]
  stripGaindB100Layer6: number[]
  stripGaindB100Layer7: number[]
  stripGaindB100Layer8: number[]
  busGaindB100: number[]
  stripLabelUTF8c60: string[]
  busLabelUTF8c60: string[]
}

export interface VBANHeader {
  voicemeeterType: number
  reserved: number
  buffersize: number
  voicemeeterVersion: string
  optionsBits: number
  samplerate: number

  [key: string]: any
}

export interface VBANStripData extends VBANHeader {
  strip: StripData[]
}

export const defaultData: VBANData = {
  voicemeeterType: 0,
  reserved: 0,
  buffersize: 0,
  voicemeeterVersion: '',
  optionsBits: 0,
  samplerate: 0,
  inputLeveldB100: [],
  outputLeveldB100: [],
  TransportBit: 0,
  stripData: [],
  stripState: [],
  busState: [],
  stripGaindB100Layer0: [],
  stripGaindB100Layer1: [],
  stripGaindB100Layer2: [],
  stripGaindB100Layer3: [],
  stripGaindB100Layer4: [],
  stripGaindB100Layer5: [],
  stripGaindB100Layer6: [],
  stripGaindB100Layer7: [],
  stripGaindB100Layer8: [],
  busGaindB100: [],
  stripLabelUTF8c60: [],
  busLabelUTF8c60: [],
}

export class VBAN {
  public connected = false
  private disconnectCount = 0
  private disconnectTimer: NodeJS.Timeout | null = null
  private started = false
  private readonly instance: VoicemeeterInstance
  private rtPacketInterval: NodeJS.Timeout | null = null
  public readonly server = dgram.createSocket({ type: 'udp4' })
  private updateHold = false
  private updateHoldInterval: NodeJS.Timeout | null = null

  constructor(instance: VoicemeeterInstance) {
    this.instance = instance
  }

  public destroy = (): void => {
    if (this.rtPacketInterval) clearTimeout(this.rtPacketInterval)
    if (this.updateHoldInterval) clearTimeout(this.updateHoldInterval)
    this.server.close()
  }

  public readonly init = (): void => {
    this.instance.log('debug', 'VBAN init')
    this.instance.updateStatus(InstanceStatus.Connecting)

    this.server.on('error', (err) => {
      this.instance.log('error', `VBAN connection err: ${err.message}`)
      this.instance.updateStatus(InstanceStatus.Disconnected, err.message)
      this.connected = false
      this.server.close()
    })

    this.server.on('listening', () => {
      const address = this.server.address()
      this.instance.log('info', `server listening ${address.address}:${address.port}`)

      this.registerRTPacket()
    })

    this.server.on('message', (msg, _info) => {
      this.parseMessage(msg)
    })

    this.server.bind()
    this.started = true
  }

  // Trigger a forced update from the RT Service
  private forceUpdate = () => {
    if (!this.instance.data.stripState[0]) return

    const currentValue = this.instance.data.stripState[0].mono
    this.sendCommand(`Strip[0].Mono=${currentValue ? '0' : '1'}`, true)
    setTimeout(() => {
      this.sendCommand(`Strip[0].Mono=${currentValue ? '1' : '0'}`, true)
    }, 50)
  }

  private parseMessage = (msg: Buffer): void => {
    const header = {
      vban: msg.subarray(0, 4).toString(),
      subProtocol: msg.subarray(4, 5),
      function: parseInt(msg.subarray(5, 6).toString('hex'), 16),
      service: parseInt(msg.subarray(6, 7).toString('hex'), 16),
      additionalInfo: msg.subarray(7, 8),
      stream: msg.subarray(8, 23),
      counter: parseInt(msg.subarray(24, 28).reverse().toString('hex'), 16),
    }

    if (header.stream.toString() === 'Voicemeeter-RTP') {
      const payload = msg.subarray(28)

      const parseNumber = (x: Buffer, max = 65536): number => {
        const number = parseInt(x.toString('hex'), 16)
        return number > max ? number - 65536 : number
      }

      const parseVersion = (x: Buffer) => {
        return `${parseNumber(x.subarray(0, 1))}.${parseNumber(x.subarray(1, 2))}.${parseNumber(x.subarray(2, 3))}.${parseNumber(x.subarray(3, 4))}`
      }

      if (header.function === 0) {
        if (!this.connected) {
          this.instance.updateStatus(InstanceStatus.Ok)
        }

        const newData: VBANData = {
          voicemeeterType: parseNumber(payload.subarray(0, 1)),
          reserved: parseNumber(payload.subarray(1, 2)),
          buffersize: parseNumber(payload.subarray(2, 4)),
          voicemeeterVersion: parseVersion(payload.subarray(4, 8).reverse()),
          optionsBits: parseNumber(payload.subarray(8, 12)),
          samplerate: parseNumber(payload.subarray(12, 16).reverse()),
          inputLeveldB100: [],
          outputLeveldB100: [],
          TransportBit: parseNumber(payload.subarray(212, 216).reverse()),
          stripData: [],
          stripState: [],
          busState: [],
          stripGaindB100Layer0: [],
          stripGaindB100Layer1: [],
          stripGaindB100Layer2: [],
          stripGaindB100Layer3: [],
          stripGaindB100Layer4: [],
          stripGaindB100Layer5: [],
          stripGaindB100Layer6: [],
          stripGaindB100Layer7: [],
          stripGaindB100Layer8: [],
          busGaindB100: [],
          stripLabelUTF8c60: [],
          busLabelUTF8c60: [],
        }

        for (let i = 0; i < 5; i++) {
          const start = 16 + i * 4
          const levels = [payload.subarray(start, start + 2), payload.subarray(start + 2, start + 4)].map((x) => parseNumber(x.reverse(), 1200) / 100)
          newData.inputLeveldB100.push(levels)
        }

        for (let i = 0; i < 3; i++) {
          const start = 36 + i * 16
          const levels = [
            payload.subarray(start, start + 2),
            payload.subarray(start + 2, start + 4),
            payload.subarray(start + 4, start + 6),
            payload.subarray(start + 6, start + 8),
            payload.subarray(start + 8, start + 10),
            payload.subarray(start + 10, start + 12),
            payload.subarray(start + 12, start + 14),
            payload.subarray(start + 14, start + 16),
          ].map((x) => parseNumber(x.reverse(), 1900) / 100)
          newData.inputLeveldB100.push(levels)
        }

        for (let i = 0; i < 8; i++) {
          const start = 84 + i * 16
          const levels = [
            payload.subarray(start, start + 2),
            payload.subarray(start + 2, start + 4),
            payload.subarray(start + 4, start + 6),
            payload.subarray(start + 6, start + 8),
            payload.subarray(start + 8, start + 10),
            payload.subarray(start + 10, start + 12),
            payload.subarray(start + 12, start + 14),
            payload.subarray(start + 14, start + 16),
          ].map((x) => parseNumber(x.reverse(), 1900) / 100)
          newData.outputLeveldB100.push(levels)
        }

        for (let i = 0; i < 8; i++) {
          const start = 216 + i * 4
          const stateData = payload.subarray(start, start + 4)

          const state: StripState = {
            mute: ((stateData[0] >> 0) & 1) === 1,
            solo: ((stateData[0] >> 1) & 1) === 1,
            mono: ((stateData[0] >> 2) & 1) === 1,
            muteC: ((stateData[0] >> 3) & 1) === 1,
            eq: ((stateData[1] >> 0) & 1) === 1,
            eqB: ((stateData[1] >> 3) & 1) === 1,
            busA1: ((stateData[1] >> 4) & 1) === 1,
            busA2: ((stateData[1] >> 5) & 1) === 1,
            busA3: ((stateData[1] >> 6) & 1) === 1,
            busA4: ((stateData[1] >> 7) & 1) === 1,
            busA5: ((stateData[2] >> 3) & 1) === 1,
            busB1: ((stateData[2] >> 0) & 1) === 1,
            busB2: ((stateData[2] >> 1) & 1) === 1,
            busB3: ((stateData[2] >> 2) & 1) === 1,
            pan0: (((stateData[2] >> 4) & 1) === 0 && ((stateData[2] >> 5) & 1) === 0 ? 1 : 0) === 1,
            pancolor: ((stateData[2] >> 4) & 1) === 1,
            panmod: ((stateData[2] >> 5) & 1) === 1,
            panmask: ((stateData[3] >> 0) & 1) === 1,
            postFXR: ((stateData[3] >> 0) & 1) === 1,
            postFXD: ((stateData[3] >> 1) & 1) === 1,
            postFX1: ((stateData[3] >> 2) & 1) === 1,
            postFX2: ((stateData[3] >> 3) & 1) === 1,
          }

          newData.stripState.push(state)
        }

        for (let i = 0; i < 8; i++) {
          const start = 248 + i * 4
          const stateData = payload.subarray(start, start + 4)

          const x = []

          for (let q = 0; q < 4; q++) {
            for (let w = 0; w < 8; w++) {
              x.push((stateData[q] >> w) & 1)
              if (w === 7) x.push(' ')
            }
          }

          const mode = () => {
            let value = 0
            for (let i = 4; i < 8; i++) {
              value += (stateData[0] >> i) & 1 ? Math.pow(2, i - 4) : 0
            }

            if (value === 1) return 'mixdownA'
            if (value === 2) return 'repeat'
            if (value === 3) return 'mixdownB'
            if (value === 4) return 'composite'
            if (value === 5) return 'upmixtv'
            if (value === 6) return 'upmixtv2'
            if (value === 7) return 'upmixtv4'
            if (value === 8) return 'upmixtv6'
            if (value === 9) return 'center'
            if (value === 10) return 'lfe'
            if (value === 11) return 'rear'
            return 'normal'
          }

          const state: BusState = {
            mute: ((stateData[0] >> 0) & 1) === 1,
            mono: ((stateData[0] >> 2) & 1) === 1,
            mode: mode(),
            mask: ((stateData[1] >> 7) & 1) === 1,
            eq: ((stateData[1] >> 0) & 1) === 1,
            cross: ((stateData[1] >> 1) & 1) === 1,
            eqB: ((stateData[1] >> 3) & 1) === 1,
            sel: ((stateData[3] >> 4) & 1) === 1,
            monitor: ((stateData[3] >> 5) & 1) === 1,
          }

          newData.busState.push(state)
        }

        for (let i = 0; i < 8; i++) {
          const start = 280 + i * 16
          for (let x = 0; x < 8; x++) {
            const offset = start + x * 2
            newData[`stripGaindB100Layer${i + 1}`].push(parseNumber(payload.subarray(offset, offset + 2).reverse(), 1200) / 100)
          }
        }

        for (let i = 0; i < 8; i++) {
					let stripValues: number[] = []
          for (let x = 0; x < 8; x++) {
						stripValues.push(newData[`stripGaindB100Layer${x + 1}`][i])
          }

					newData[`stripGaindB100Layer0`].push(Math.max(...stripValues))
        }

        for (let i = 0; i < 8; i++) {
          const start = 408 + i * 2
          newData.busGaindB100.push(parseNumber(payload.subarray(start, start + 2).reverse(), 1200) / 100)
        }

        for (let i = 0; i < 8; i++) {
          const start = 424 + i * 60
          newData.stripLabelUTF8c60.push(
            payload
              .subarray(start, start + 60)
              .toString()
              .replace(/\x00/g, ''),
          )
        }

        for (let i = 0; i < 8; i++) {
          const start = 904 + i * 60
          newData.busLabelUTF8c60.push(
            payload
              .subarray(start, start + 60)
              .toString()
              .replace(/\x00/g, ''),
          )
        }

        this.updateData(newData, 0)

        if (!this.connected) {
          this.forceUpdate()
        }

        this.connected = true
      } else if (header.function === 1) {
        const modeValue = (x: Buffer, max = 50): number => {
          let value = parseNumber(x)
          if (value > max) value = value - 65536
          return value
        }

        const stripData: VBANStripData = {
          voicemeeterType: parseNumber(payload.subarray(0, 1)),
          reserved: parseNumber(payload.subarray(1, 2)),
          buffersize: parseNumber(payload.subarray(2, 4)),
          voicemeeterVersion: parseVersion(payload.subarray(4, 8).reverse()),
          optionsBits: parseNumber(payload.subarray(8, 12)),
          samplerate: parseNumber(payload.subarray(12, 16).reverse()),
          strip: [],
        }

        for (let i = 0; i < 8; i++) {
          const start = 16 + i * 174
          const modeData = payload.subarray(start, start + 4)

          stripData.strip[i] = {
            mode: {
              mute: ((modeData[0] >> 0) & 1) === 1,
              solo: ((modeData[0] >> 1) & 1) === 1,
              mono: ((modeData[0] >> 2) & 1) === 1,
              muteC: ((modeData[0] >> 3) & 1) === 1,
              eq: ((modeData[1] >> 0) & 1) === 1,
              eqB: ((modeData[1] >> 3) & 1) === 1,
              busA1: ((modeData[1] >> 4) & 1) === 1,
              busA2: ((modeData[1] >> 5) & 1) === 1,
              busA3: ((modeData[1] >> 6) & 1) === 1,
              busA4: ((modeData[1] >> 7) & 1) === 1,
              busA5: ((modeData[2] >> 3) & 1) === 1,
              busB1: ((modeData[2] >> 0) & 1) === 1,
              busB2: ((modeData[2] >> 1) & 1) === 1,
              busB3: ((modeData[2] >> 2) & 1) === 1,
              pan0: (((modeData[2] >> 4) & 1) === 0 && ((modeData[2] >> 5) & 1) === 0 ? 1 : 0) === 1,
              pancolor: ((modeData[2] >> 4) & 1) === 1,
              panmod: ((modeData[2] >> 5) & 1) === 1,
              postFXR: ((modeData[3] >> 0) & 1) === 1,
              postFXD: ((modeData[3] >> 1) & 1) === 1,
              postFX1: ((modeData[3] >> 2) & 1) === 1,
              postFX2: ((modeData[3] >> 3) & 1) === 1,
            },
            dBLevel: payload
              .subarray(start + 4, start + 8)
              .reverse()
              .readFloatBE(0)
              .toFixed(2),
            audibility: parseNumber(payload.subarray(start + 8, start + 10).reverse()),
            pos3D_x: modeValue(payload.subarray(start + 10, start + 12).reverse()) / 100,
            pos3D_y: modeValue(payload.subarray(start + 12, start + 14).reverse(), 100) / 100,
            posColor_x: modeValue(payload.subarray(start + 14, start + 16).reverse()) / 100,
            posColor_y: modeValue(payload.subarray(start + 16, start + 18).reverse(), 100) / 100,
            posMod_x: modeValue(payload.subarray(start + 114, start + 116).reverse()) / 100,
            posMox_y: modeValue(payload.subarray(start + 116, start + 118).reverse(), 100) / 100,
            EQgain1: modeValue(payload.subarray(start + 18, start + 20).reverse(), 1200) / 100,
            EQgain2: modeValue(payload.subarray(start + 20, start + 22).reverse(), 1200) / 100,
            EQgain3: modeValue(payload.subarray(start + 22, start + 24).reverse(), 1200) / 100,
            PEQ: [],
            sendReverb: parseNumber(payload.subarray(start + 118, start + 120).reverse()) / 100,
            sendDelay: parseNumber(payload.subarray(start + 120, start + 122).reverse()) / 100,
            sendFX1: parseNumber(payload.subarray(start + 122, start + 124).reverse()) / 100,
            sendFX2: parseNumber(payload.subarray(start + 124, start + 126).reverse()) / 100,
            dBLimit: modeValue(payload.subarray(start + 126, start + 128).reverse(), 1200) / 100,
            karaoke: parseNumber(payload.subarray(start + 128, start + 130).reverse()),
            comp: {
              gainIn: parseNumber(payload.subarray(start + 130, start + 132).reverse(), 24000) / 100,
              attack: parseNumber(payload.subarray(start + 132, start + 134).reverse()) / 10,
              release: parseNumber(payload.subarray(start + 134, start + 136).reverse()) / 10,
              knee: parseNumber(payload.subarray(start + 136, start + 138).reverse()) / 100,
              ratio: parseNumber(payload.subarray(start + 138, start + 140).reverse()) / 100,
              threshold: parseNumber(payload.subarray(start + 140, start + 142).reverse(), 0) / 100,
              enabled: parseNumber(payload.subarray(start + 142, start + 144).reverse()),
              auto: parseNumber(payload.subarray(start + 144, start + 146).reverse()),
              gainOut: parseNumber(payload.subarray(start + 146, start + 148).reverse(), 24000) / 100,
            },
            gate: {
              dbThresholdIn: parseNumber(payload.subarray(start + 148, start + 150).reverse(), 0) / 100,
              dbDampingMax: parseNumber(payload.subarray(start + 150, start + 152).reverse(), 0) / 100,
              BPSideChan: parseNumber(payload.subarray(start + 152, start + 154).reverse()) / 10,
              attack: parseNumber(payload.subarray(start + 154, start + 156).reverse()) / 10,
              hold: parseNumber(payload.subarray(start + 156, start + 158).reverse()) / 10,
              release: parseNumber(payload.subarray(start + 158, start + 160).reverse()) / 10,
            },
            denoiser: parseNumber(payload.subarray(start + 160, start + 162).reverse()) / 100,
            pitch: {
              enabled: parseNumber(payload.subarray(start + 162, start + 164).reverse()) === 1,
              dryWet: parseNumber(payload.subarray(start + 164, start + 166).reverse(), 10000) / 100,
              value: parseNumber(payload.subarray(start + 166, start + 168).reverse(), 12000) / 100,
              formantLo: parseNumber(payload.subarray(start + 168, start + 170).reverse(), 12000) / 100,
              formantMed: parseNumber(payload.subarray(start + 170, start + 172).reverse(), 12000) / 100,
              formantHigh: parseNumber(payload.subarray(start + 172, start + 174).reverse(), 12000) / 100,
            },
          }

          for (let j = 0; j < 6; j++) {
            const charStart = start + 24 + j
            const floatStart = start + 36 + j * 4
            stripData.strip[i].PEQ[j] = {
              on: parseNumber(payload.subarray(charStart, charStart + 1)),
              type: parseNumber(payload.subarray(charStart + 6, charStart + 7)),
              gain: payload
                .subarray(floatStart, floatStart + 4)
                .reverse()
                .readFloatBE(0)
                .toFixed(2),
              freq: payload
                .subarray(floatStart + 24, floatStart + 28)
                .reverse()
                .readFloatBE(0)
                .toFixed(2),
              q: payload
                .subarray(floatStart + 48, floatStart + 52)
                .reverse()
                .readFloatBE(0)
                .toFixed(2),
            }
          }
        }

        this.updateData(stripData.strip, 1)
      }
    } else if (header.stream.toString().startsWith('VBAN Service')) {
      this.instance.log('debug', 'Received VBAN service message')
      this.instance.updateStatus(InstanceStatus.Ok)
      if (this.disconnectTimer) {
        this.disconnectCount = 0
        clearTimeout(this.disconnectTimer)
      }
    } else {
      this.instance.log('debug', `Unknown VBAN Message ${msg.toString()}`)
    }
  }

  public registerRTPacket = (): void => {
    if (!this.started) {
      if (this.rtPacketInterval) clearTimeout(this.rtPacketInterval)
      this.rtPacketInterval = setTimeout(this.registerRTPacket, 200)
      return
    }

    const createRTPacket = (id: number): Buffer => {
      return Buffer.from([
        0x56,
        0x42,
        0x41,
        0x4e, // 'VBAN'
        0x60, // 0x60 (SERVICE)
        id, // 0 = register to RT packet service ID (0-127).
        0x20, // 32 = VBAN_SERVICE_RTPACKETREGISTER
        0x0f, // 0 – 255 = Time out in second (to stop RT packet broadcast)
        0x52,
        0x65,
        0x67,
        0x69,
        0x73,
        0x74,
        0x65,
        0x72,
        0x20,
        0x52,
        0x54,
        0x50, // 'Register RTP'
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00, // Padding
      ])
    }

    this.server.send(createRTPacket(0x00), this.instance.config.port, this.instance.config.host, (err) => {
      this.disconnectTimer = setTimeout(() => {
        this.disconnectCount++
        if (this.disconnectCount > 1) this.instance.updateStatus(InstanceStatus.Disconnected, 'Failed to receive RT Packet')
      }, 4000)

      this.instance.log('debug', 'Sent Register RTPacket message')
      if (err) {
        this.instance.log('error', `Error sending VBAN register RTPacket0 message: ${err}`)
      } else {
        if (this.rtPacketInterval) clearTimeout(this.rtPacketInterval)
        this.rtPacketInterval = setTimeout(this.registerRTPacket, 15000)
      }
    })

    this.server.send(createRTPacket(0x01), this.instance.config.port, this.instance.config.host, (err) => {
      if (err) {
        this.instance.log('error', `Error sending VBAN register RTPacket1 message: ${err}`)
      }
    })
  }

  public sendCommand = async (command: string, forcedUpdate = false): Promise<void> => {
    const stream = Buffer.from(`${this.instance.config.commandStream}`.padEnd(16, '\0') + '\x01\x00\x00\x00')

    // Define the VBAN protocol header
    const vbanHeader = Buffer.concat([
      Buffer.from([
        0x56,
        0x42,
        0x41,
        0x4e, // 'VBAN'
        //0x00, // Sample rate (0x00 for 44.1kHz)
        0x40, // Data type (0x20 for text/command)
        0x00, // Number of channels (1 channel)
        0x00,
        0x00, // Data format (0 for default)
      ]),
      stream,
    ])

    // Define the VBAN text command to mute strip 1
    const vbanCommand = Buffer.from(command)

    // Combine header and command
    const message = Buffer.concat([vbanHeader, vbanCommand])

    return new Promise((resolve) => {
      this.server.send(message, this.instance.config.port, this.instance.config.host, (err) => {
        if (err) {
          this.instance.log('error', `Sending command err: ${err.message}`)
        } else {
          this.instance.log(forcedUpdate ? 'debug' : 'info', `Sent command: ${command}`)
        }

        resolve()
      })
    })
  }

  private updateData = (newData: VBANData | StripData[], type: number): void => {
    if (type === 0) {
      const data = newData as VBANData
      if (JSON.stringify(newData) === JSON.stringify(this.instance.data)) return

      const stripLevelChange = JSON.stringify(data.inputLeveldB100) !== JSON.stringify(this.instance.data.inputLeveldB100)
      const busLevelChange = JSON.stringify(data.outputLeveldB100) !== JSON.stringify(this.instance.data.outputLeveldB100)
      const stripStateChange = JSON.stringify(data.stripState) !== JSON.stringify(this.instance.data.stripState)
      const busStateChange = JSON.stringify(data.busState) !== JSON.stringify(this.instance.data.busState)
      const stripLabelChange = JSON.stringify(data.stripLabelUTF8c60) !== JSON.stringify(this.instance.data.stripLabelUTF8c60)
      const busLabelChange = JSON.stringify(data.busLabelUTF8c60) !== JSON.stringify(this.instance.data.busLabelUTF8c60)

      const feedbackUpdates = []
      if (stripStateChange) feedbackUpdates.push('stripMono', 'stripMute', 'stripSolo', 'routing')
      if (busStateChange) feedbackUpdates.push('busEQ', 'busEQAB', 'busEQABCallback', 'busMonitor', 'busMono', 'busMute', 'busSel')

      this.instance.data = { ...(newData as VBANData), stripData: this.instance.data.stripData }

      if (!this.updateHold) {
        if (stripLevelChange) feedbackUpdates.push('stripMeters')
        if (busLevelChange) feedbackUpdates.push('busMeters')

        this.updateHold = true
        this.updateHoldInterval = setTimeout(() => {
          this.updateHold = false
        }, 100)

        this.instance.variables?.updateVariables()
      }

      if (stripLabelChange || busLabelChange) this.instance.updateInstance()

      if (feedbackUpdates.length > 0) {
        this.instance.checkFeedbacks(...feedbackUpdates)
      }
    } else if (type === 1) {
      const data = newData as StripData[]
      const change = JSON.stringify(this.instance.data.stripData) === JSON.stringify(data)

      this.instance.data.stripData = data

      if (!this.updateHold && change) {
        this.updateHold = true
        this.updateHoldInterval = setTimeout(() => {
          this.updateHold = false
        }, 100)

        this.instance.variables?.updateVariables()
      }
    }
  }
}
