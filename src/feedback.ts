import VoicemeeterInstance from './index'
import { presets } from 'companion-module-utils'
import { getOptions, decibelToLinear } from './utils'
import {
  CompanionAdvancedFeedbackResult,
  CompanionFeedbackButtonStyleResult,
  CompanionFeedbackAdvancedEvent,
  CompanionFeedbackBooleanEvent,
  CompanionFeedbackContext,
  SomeCompanionFeedbackInputField,
  combineRgb,
} from '@companion-module/base'

export interface VoicemeeterFeedbacks {
  busEQ: VoicemeeterFeedback<BusEQCallback>
  busEQAB: VoicemeeterFeedback<BusEQABCallback>
  busMonitor: VoicemeeterFeedback<BusMonitorCallback>
  busMono: VoicemeeterFeedback<BusMonoCallback>
  busMute: VoicemeeterFeedback<BusMuteCallback>
  busSel: VoicemeeterFeedback<BusSelCallback>
  routing: VoicemeeterFeedback<RoutingCallback>
  stripMono: VoicemeeterFeedback<StripMonoCallback>
  stripMute: VoicemeeterFeedback<StripMuteCallback>
  stripSolo: VoicemeeterFeedback<StripSoloCallback>
  utilSelectedBus: VoicemeeterFeedback<UtilSelectedBusCallback>
  utilSelectedStrip: VoicemeeterFeedback<UtilSelectedStripCallback>

  // Index signature
  [key: string]: VoicemeeterFeedback<any>
}

interface BusEQCallback {
  feedbackId: 'busEQ'
  options: Readonly<{
    bus: number
  }>
}

interface BusEQABCallback {
  feedbackId: 'busEQAB'
  options: Readonly<{
    bus: number
    mode: 0 | 1
  }>
}

interface BusMetersCallback {
  feedbackId: 'busMeters'
  options: Readonly<{
    bus: number
  }>
}

interface BusMonitorCallback {
  feedbackId: 'busMonitor'
  options: Readonly<{
    bus: number
  }>
}

interface BusMonoCallback {
  feedbackId: 'busMono'
  options: Readonly<{
    bus: number
  }>
}

interface BusMuteCallback {
  feedbackId: 'busMute'
  options: Readonly<{
    bus: number
  }>
}

interface BusSelCallback {
  feedbackId: 'busSel'
  options: Readonly<{
    bus: number
  }>
}

interface RoutingCallback {
  feedbackId: 'routing'
  options: Readonly<{
    source: number
    destination: RoutingDestination
  }>
}

interface StripMetersCallback {
  feedbackId: 'StripMeters'
  options: Readonly<{
    strip: number
  }>
}

interface StripMonoCallback {
  feedbackId: 'stripMono'
  options: Readonly<{
    strip: number
  }>
}

interface StripMuteCallback {
  feedbackId: 'stripMute'
  options: Readonly<{
    strip: number
  }>
}

interface StripSoloCallback {
  feedbackId: 'stripSolo'
  options: Readonly<{
    strip: number
  }>
}

interface UtilSelectedBusCallback {
  feedbackId: 'utilSelectedBus'
  options: Readonly<{
    bus: number
  }>
}

interface UtilSelectedStripCallback {
  feedbackId: 'utilSelectedStrip'
  options: Readonly<{
    strip: number
  }>
}

type RoutingDestination = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'B1' | 'B2' | 'B3'

export type FeedbackCallbacks =
  | BusEQCallback
  | BusEQABCallback
  | BusMetersCallback
  | BusMonitorCallback
  | BusMonoCallback
  | BusMuteCallback
  | BusSelCallback
  | RoutingCallback
  | StripMetersCallback
  | StripMonoCallback
  | StripMuteCallback
  | StripSoloCallback
  | UtilSelectedBusCallback
  | UtilSelectedStripCallback

// Force options to have a default to prevent sending undefined values
type InputFieldWithDefault = Exclude<SomeCompanionFeedbackInputField, 'default'> & {
  default: string | number | boolean | null
}

// Voicemeeter Boolean and Advanced feedback types
interface VoicemeeterFeedbackBoolean<T> {
  type: 'boolean'
  name: string
  description: string
  defaultStyle: Partial<CompanionFeedbackButtonStyleResult>
  options: InputFieldWithDefault[]
  callback: (
    feedback: Readonly<Omit<CompanionFeedbackBooleanEvent, 'options' | 'type'> & T>,
    context: CompanionFeedbackContext
  ) => boolean | Promise<boolean>
  subscribe?: (feedback: Readonly<Omit<CompanionFeedbackBooleanEvent, 'options' | 'type'> & T>) => boolean
  unsubscribe?: (feedback: Readonly<Omit<CompanionFeedbackBooleanEvent, 'options' | 'type'> & T>) => boolean
}

interface VoicemeeterFeedbackAdvanced<T> {
  type: 'advanced'
  name: string
  description: string
  options: InputFieldWithDefault[]
  callback: (
    feedback: Readonly<Omit<CompanionFeedbackAdvancedEvent, 'options' | 'type'> & T>,
    context: CompanionFeedbackContext
  ) => CompanionAdvancedFeedbackResult | Promise<CompanionAdvancedFeedbackResult>
  subscribe?: (
    feedback: Readonly<Omit<CompanionFeedbackAdvancedEvent, 'options' | 'type'> & T>
  ) => CompanionAdvancedFeedbackResult
  unsubscribe?: (
    feedback: Readonly<Omit<CompanionFeedbackAdvancedEvent, 'options' | 'type'> & T>
  ) => CompanionAdvancedFeedbackResult
}

export type VoicemeeterFeedback<T> = VoicemeeterFeedbackBoolean<T> | VoicemeeterFeedbackAdvanced<T>

export function getFeedbacks(instance: VoicemeeterInstance): VoicemeeterFeedbacks {
  const utilOptions = getOptions()

  return {
    busEQ: {
      type: 'boolean',
      name: 'Bus - EQ',
      description: 'Indicates EQ status on Bus',
      options: [
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [...utilOptions.busSelect.choices, { id: -1, label: 'Selected' }],
        },
      ],
      defaultStyle: {
        color: combineRgb(0, 0, 0),
        bgcolor: combineRgb(255, 0, 0),
      },
      callback: (feedback) => {
        const bus = feedback.options.bus === -1 ? instance.selectedBus : feedback.options.bus
        if (!instance.data.busState[bus]) return false
        return instance.data.busState[bus]?.eq
      },
    },

    busEQAB: {
      type: 'boolean',
      name: 'Bus - EQ A or B',
      description: 'Indicates if the EQ of a Bus is set to preset A or B',
      options: [
        {
          type: 'dropdown',
          label: 'Mode',
          id: 'mode',
          default: 0,
          choices: [
            { id: 0, label: 'A' },
            { id: 1, label: 'B' },
          ],
        },
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [...utilOptions.busSelect.choices, { id: -1, label: 'Selected' }],
        },
      ],
      defaultStyle: {
        color: combineRgb(0, 0, 0),
        bgcolor: combineRgb(255, 0, 0),
      },
      callback: (feedback) => {
        const bus = feedback.options.bus === -1 ? instance.selectedBus : feedback.options.bus
        if (!instance.data.busState[bus]) return false
        return feedback.options.mode === 1 ? instance.data.busState[bus]?.eqB : !instance.data.busState[bus]?.eqB
      },
    },

    busMeters: {
      type: 'advanced',
      name: 'Bus - Meters',
      description: 'Bus Volume Meters',
      options: [
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [...utilOptions.busSelect.choices, { id: -1, label: 'Selected' }],
        },
      ],
      callback: (feedback) => {
        const busId = feedback.options.bus === -1 ? instance.selectedBus : feedback.options.bus
        const bus = instance.data.outputLeveldB100[busId]

        if (!bus) return {}

        const meter = presets.meter1({
          width: feedback.image.width,
          height: feedback.image.height,
          meter1: decibelToLinear(bus[0]),
          meter2: decibelToLinear(bus[1]),
          muted: instance.data.busState[busId]?.mute,
        })

        return {
          imageBuffer: meter,
        }
      },
    },

    busMonitor: {
      type: 'boolean',
      name: 'Bus - Monitor',
      description: 'Indicates if a selected Bus is set to Monitor',
      options: [
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [...utilOptions.busSelect.choices, { id: -1, label: 'Selected' }],
        },
      ],
      defaultStyle: {
        color: combineRgb(0, 0, 0),
        bgcolor: combineRgb(255, 0, 0),
      },
      callback: (feedback) => {
        const bus = feedback.options.bus === -1 ? instance.selectedBus : feedback.options.bus
        return instance.data.busState[bus]?.monitor
      },
    },

    busMono: {
      type: 'boolean',
      name: 'Bus - Mono',
      description: 'Indicates if a Bus is Mono',
      options: [
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [...utilOptions.busSelect.choices, { id: -1, label: 'Selected' }],
        },
      ],
      defaultStyle: {
        color: combineRgb(0, 0, 0),
        bgcolor: combineRgb(255, 0, 0),
      },
      callback: (feedback) => {
        const bus = feedback.options.bus === -1 ? instance.selectedBus : feedback.options.bus
        return instance.data.busState[bus]?.mono
      },
    },

    busMute: {
      type: 'boolean',
      name: 'Bus - Mute',
      description: 'Indicate if a Bus is Muted',
      options: [
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [
            { id: 0, label: 'A1' },
            { id: 1, label: 'A2' },
            { id: 2, label: 'A3' },
            { id: 3, label: 'A4' },
            { id: 4, label: 'A5' },
            { id: 5, label: 'B1' },
            { id: 6, label: 'B2' },
            { id: 7, label: 'B3' },
            { id: -1, label: 'Selected' },
          ],
        },
      ],
      defaultStyle: {
        color: combineRgb(0, 0, 0),
        bgcolor: combineRgb(255, 0, 0),
      },
      callback: (feedback): boolean => {
        const bus = feedback.options.bus === -1 ? instance.selectedBus : feedback.options.bus
        return instance.data.busState[bus]?.mute
      },
    },

    busSel: {
      type: 'boolean',
      name: 'Bus - SEL',
      description: 'Indicates if a Bus is Selected',
      options: [
        {
          type: 'dropdown',
          label: 'Bus',
          id: 'bus',
          default: -1,
          choices: [...utilOptions.busSelect.choices, { id: -1, label: 'Selected' }],
        },
      ],
      defaultStyle: {
        color: combineRgb(0, 0, 0),
        bgcolor: combineRgb(255, 0, 0),
      },
      callback: (feedback) => {
        const bus = feedback.options.bus === -1 ? instance.selectedBus : feedback.options.bus
        return instance.data.busState[bus]?.sel
      },
    },

    routing: {
      type: 'boolean',
      name: 'Routing',
      description: 'Indicate if a Strip is routed to a Bus',
      options: [
        {
          type: 'dropdown',
          label: 'Source',
          id: 'source',
          default: 0,
          choices: [
            { id: 0, label: 'Strip 1' },
            { id: 1, label: 'Strip 2' },
            { id: 2, label: 'Strip 3' },
            { id: 3, label: 'Strip 4' },
            { id: 4, label: 'Strip 5' },
            { id: 5, label: 'Aux 1' },
            { id: 6, label: 'Aux 2' },
            { id: 7, label: 'Aux 3' },
            //{ id: 8, label: 'Recorder' },
            { id: 9, label: 'Selected' },
          ],
        },
        {
          type: 'dropdown',
          label: 'Destination',
          id: 'destination',
          default: 'A1',
          choices: ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3'].map((type) => ({ id: type, label: type })),
        },
      ],
      defaultStyle: {
        color: combineRgb(0, 0, 0),
        bgcolor: combineRgb(0, 255, 0),
      },
      callback: (feedback): boolean => {
        const source = feedback.options.source === 9 ? instance.selectedStrip : feedback.options.source
        const destination = `bus${feedback.options.destination}`

        return instance.data.stripState[source]?.[destination]
      },
    },

    stripMeters: {
      type: 'advanced',
      name: 'Strip - Meters',
      description: 'Strip Volume Meters',
      options: [
        {
          type: 'dropdown',
          label: 'Strip',
          id: 'strip',
          default: -1,
          choices: [
            ...instance.data.stripLabelUTF8c60.map((label, index) => ({
              id: index,
              label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
            })),
            { id: -1, label: 'Selected' },
          ],
        },
      ],
      callback: (feedback) => {
        const stripId = feedback.options.strip === -1 ? instance.selectedStrip : feedback.options.strip
        const strip = instance.data.inputLeveldB100[stripId]

        if (!strip) return {}

        const meter = presets.meter1({
          width: feedback.image.width,
          height: feedback.image.height,
          meter1: decibelToLinear(strip[0]),
          meter2: decibelToLinear(strip[1]),
          muted: instance.data.stripState[stripId]?.mute,
        })

        return {
          imageBuffer: meter,
        }
      },
    },

    stripMono: {
      type: 'boolean',
      name: 'Strip - Mono',
      description: 'Indicate if a Strip is Mono',
      options: [
        {
          type: 'dropdown',
          label: 'Strip',
          id: 'strip',
          default: -1,
          choices: [
            ...instance.data.stripLabelUTF8c60.map((label, index) => ({
              id: index,
              label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
            })),
            // { id: 9, label: 'Recorder' },
            { id: -1, label: 'Selected' },
          ],
        },
      ],
      defaultStyle: {
        color: combineRgb(0, 0, 0),
        bgcolor: combineRgb(255, 0, 0),
      },
      callback: (feedback): boolean => {
        const strip = feedback.options.strip === -1 ? instance.selectedStrip : feedback.options.strip
        return instance.data.stripState[strip]?.mono
      },
    },

    stripMute: {
      type: 'boolean',
      name: 'Strip - Mute',
      description: 'Indicate if a Strip is Muted',
      options: [
        {
          type: 'dropdown',
          label: 'Strip',
          id: 'strip',
          default: -1,
          choices: [
            ...instance.data.stripLabelUTF8c60.map((label, index) => ({
              id: index,
              label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
            })),
            // { id: 9, label: 'Recorder' },
            { id: -1, label: 'Selected' },
          ],
        },
      ],
      defaultStyle: {
        color: combineRgb(0, 0, 0),
        bgcolor: combineRgb(255, 0, 0),
      },
      callback: (feedback): boolean => {
        const strip = feedback.options.strip === -1 ? instance.selectedStrip : feedback.options.strip
        return instance.data.stripState[strip]?.mute
      },
    },

    stripSolo: {
      type: 'boolean',
      name: 'Strip - Solo',
      description: 'Indicate if a Strip Solo is enabled',
      options: [
        {
          type: 'dropdown',
          label: 'Strip',
          id: 'strip',
          default: -1,
          choices: [
            ...instance.data.stripLabelUTF8c60.map((label, index) => ({
              id: index,
              label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
            })),
            // { id: 9, label: 'Recorder' },
            { id: -1, label: 'Selected' },
          ],
        },
      ],
      defaultStyle: {
        color: combineRgb(0, 0, 0),
        bgcolor: combineRgb(255, 255, 0),
      },
      callback: (feedback): boolean => {
        const strip = feedback.options.strip === -1 ? instance.selectedStrip : feedback.options.strip

        return instance.data.stripState[strip]?.solo
      },
    },

    utilSelectedBus: {
      type: 'boolean',
      name: 'Util - Selected Bus',
      description: 'Indicates the currently selected Bus in Companion',
      options: [utilOptions.busSelect],
      defaultStyle: {
        color: combineRgb(0, 0, 0),
        bgcolor: combineRgb(0, 255, 0),
      },
      callback: (feedback) => {
        return instance.selectedBus === feedback.options.bus
      },
    },

    utilSelectedStrip: {
      type: 'boolean',
      name: 'Util - Selected Strip',
      description: 'Indicates the currently selected Strip in Companion',
      options: [
        {
          type: 'dropdown',
          label: 'Strip',
          id: 'strip',
          default: 0,
          choices: [
            ...instance.data.stripLabelUTF8c60.map((label, index) => ({
              id: index,
              label: label ? `Strip ${index + 1}: ${label}` : `${index + 1}`,
            })),
          ],
        },
      ],
      defaultStyle: {
        color: combineRgb(0, 0, 0),
        bgcolor: combineRgb(0, 255, 0),
      },
      callback: (feedback) => {
        return instance.selectedStrip === feedback.options.strip
      },
    },
  }
}
