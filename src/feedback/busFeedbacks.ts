import type { CompanionFeedbackSchema, CompanionFeedbackDefinitions } from '@companion-module/base'
import { presets } from 'companion-module-utils'
import { busName, decibelToLinear, options } from '../utils.js'
import type VoicemeeterInstance from '../index.js'

export type BusFeedbacksSchema = {
  busEQ: CompanionFeedbackSchema<{
    bus: string
  }>
  busEQAB: CompanionFeedbackSchema<{
    bus: string
    mode: 0 | 1
  }>
  busMeters: CompanionFeedbackSchema<{
    bus: string
  }>
  busMonitor: CompanionFeedbackSchema<{
    bus: string
  }>
  busMono: CompanionFeedbackSchema<{
    bus: string
  }>
  busMute: CompanionFeedbackSchema<{
    bus: string
  }>
  busSel: CompanionFeedbackSchema<{
    bus: string
  }>
}

export const getBusFeedbacks = (instance: VoicemeeterInstance): CompanionFeedbackDefinitions<BusFeedbacksSchema> => {
  return {
    busEQ: {
      type: 'boolean',
      name: 'Bus - EQ',
      description: 'Indicates EQ status on Bus',
      options: [options(instance).busSelect],
      defaultStyle: {
        color: 0x000000,
        bgcolor: 0xff0000,
      },
      callback: (feedback) => {
        let busId: string | number = feedback.options.bus === 'Selected' ? instance.selectedBus : feedback.options.bus
        busId = busName.indexOf(busId)
        if (!instance.data.busState[busId]) return false
        return instance.data.busState[busId]?.eq
      },
    },

    busEQAB: {
      type: 'boolean',
      name: 'Bus - EQ A or B',
      description: 'Indicates if the EQ of a Bus is set to preset A or B',
      options: [
        options(instance).busSelect,
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
      ],
      defaultStyle: {
        color: 0x000000,
        bgcolor: 0xff0000,
      },
      callback: (feedback) => {
        let busId: string | number = feedback.options.bus === 'Selected' ? instance.selectedBus : feedback.options.bus
        busId = busName.indexOf(busId)
        return feedback.options.mode === 1 ? instance.data.busState[busId]?.eqB : !instance.data.busState[busId]?.eqB
      },
    },

    busMeters: {
      type: 'advanced',
      name: 'Bus - Meters',
      description: 'Bus Volume Meters',
      options: [options(instance).busSelect],
      affectedProperties: ['imageBuffer'],
      callback: (feedback) => {
        let busId: string | number = feedback.options.bus === 'Selected' ? instance.selectedBus : feedback.options.bus
        busId = busName.indexOf(busId)
        const bus = instance.data.outputLeveldB100[busId]

        if (!bus || !feedback.image) return {}

        const meter = presets.meter1({
          width: feedback.image.width,
          height: feedback.image.height,
          meter1: decibelToLinear(bus[0]),
          meter2: decibelToLinear(bus[1]),
          muted: instance.data.busState[busId]?.mute,
        })

        return {
          imageBuffer: Buffer.from(meter).toString('base64'),
        }
      },
    },

    busMonitor: {
      type: 'boolean',
      name: 'Bus - Monitor',
      description: 'Indicates if a selected Bus is set to Monitor',
      options: [options(instance).busSelect],
      defaultStyle: {
        color: 0x000000,
        bgcolor: 0xff0000,
      },
      callback: (feedback) => {
        let busId: string | number = feedback.options.bus === 'Selected' ? instance.selectedBus : feedback.options.bus
        busId = busName.indexOf(busId)
        return instance.data.busState[busId]?.monitor
      },
    },

    busMono: {
      type: 'boolean',
      name: 'Bus - Mono',
      description: 'Indicates if a Bus is Mono',
      options: [options(instance).busSelect],
      defaultStyle: {
        color: 0x000000,
        bgcolor: 0xff0000,
      },
      callback: (feedback) => {
        let busId: string | number = feedback.options.bus === 'Selected' ? instance.selectedBus : feedback.options.bus
        busId = busName.indexOf(busId)
        return instance.data.busState[busId]?.mono
      },
    },

    busMute: {
      type: 'boolean',
      name: 'Bus - Mute',
      description: 'Indicate if a Bus is Muted',
      options: [options(instance).busSelect],
      defaultStyle: {
        color: 0x000000,
        bgcolor: 0xff0000,
      },
      callback: (feedback): boolean => {
        let busId: string | number = feedback.options.bus === 'Selected' ? instance.selectedBus : feedback.options.bus
        busId = busName.indexOf(busId)
        return instance.data.busState[busId]?.mute
      },
    },

    busSel: {
      type: 'boolean',
      name: 'Bus - SEL',
      description: 'Indicates if a Bus is Selected',
      options: [options(instance).busSelect],
      defaultStyle: {
        color: 0x000000,
        bgcolor: 0xff0000,
      },
      callback: (feedback) => {
        let busId: string | number = feedback.options.bus === 'Selected' ? instance.selectedBus : feedback.options.bus
        busId = busName.indexOf(busId)
        return instance.data.busState[busId]?.sel
      },
    },
  }
}
