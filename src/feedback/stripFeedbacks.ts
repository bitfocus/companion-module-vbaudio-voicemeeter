import type { CompanionFeedbackSchema, CompanionFeedbackDefinitions } from '@companion-module/base'
import { presets } from 'companion-module-utils'
import { decibelToLinear, options } from '../utils.js'
import type VoicemeeterInstance from '../index.js'

export type StripFeedbacksSchema = {
  routing: CompanionFeedbackSchema<{
    source: number
    destination: 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'B1' | 'B2' | 'B3'
  }>
  stripMeters: CompanionFeedbackSchema<{
    strip: number | 'Selected'
  }>
  stripMono: CompanionFeedbackSchema<{
    strip: number | 'Selected'
  }>
  stripMute: CompanionFeedbackSchema<{
    strip: number | 'Selected'
  }>
  stripSolo: CompanionFeedbackSchema<{
    strip: number | 'Selected'
  }>
}

export const getStripFeedbacks = (instance: VoicemeeterInstance): CompanionFeedbackDefinitions<StripFeedbacksSchema> => {
  return {
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
            { id: 9, label: 'Selected' },
          ],
					disableAutoExpression: true,
        },
        {
          type: 'dropdown',
          label: 'Destination',
          id: 'destination',
          default: 'A1',
          choices: ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3'].map((type) => ({ id: type, label: type })),
					expressionDescription: `Valid Values: 'A1' to 'B3'`,
        },
      ],
      defaultStyle: {
        color: 0x000000,
        bgcolor: 0x00ff00,
      },
      callback: (feedback): boolean => {
        const source = feedback.options.source === 9 ? instance.selectedStrip - 1 : feedback.options.source
        const destination = `bus${feedback.options.destination}`

        return instance.data.stripState[source]?.[destination]
      },
    },

    stripMeters: {
      type: 'advanced',
      name: 'Strip - Meters',
      description: 'Strip Volume Meters',
      options: [options(instance).stripSelect],
			affectedProperties: ['imageBuffer'],
      callback: (feedback) => {
        const stripId = feedback.options.strip === 'Selected' ? instance.selectedStrip : feedback.options.strip
        const strip = instance.data.inputLeveldB100[stripId - 1]

        if (!strip || !feedback.image) return {}

        const meter = presets.meter1({
          width: feedback.image.width,
          height: feedback.image.height,
          meter1: decibelToLinear(strip[0]),
          meter2: decibelToLinear(strip[1]),
          muted: instance.data.stripState[stripId - 1]?.mute,
        })

        return {
          imageBuffer: Buffer.from(meter).toString('base64'),
        }
      },
    },

    stripMono: {
      type: 'boolean',
      name: 'Strip - Mono',
      description: 'Indicate if a Strip is Mono',
      options: [options(instance).stripSelect],
      defaultStyle: {
        color: 0x000000,
        bgcolor: 0xff0000,
      },
      callback: (feedback): boolean => {
        const stripId = feedback.options.strip === 'Selected' ? instance.selectedStrip : feedback.options.strip
        return instance.data.stripState[stripId - 1]?.mono
      },
    },

    stripMute: {
      type: 'boolean',
      name: 'Strip - Mute',
      description: 'Indicate if a Strip is Muted',
      options: [options(instance).stripSelect],
      defaultStyle: {
        color: 0x000000,
        bgcolor: 0xff0000,
      },
      callback: (feedback): boolean => {
        const stripId = feedback.options.strip === 'Selected' ? instance.selectedStrip : feedback.options.strip
        return instance.data.stripState[stripId - 1]?.mute
      },
    },

    stripSolo: {
      type: 'boolean',
      name: 'Strip - Solo',
      description: 'Indicate if a Strip Solo is enabled',
      options: [options(instance).stripSelect],
      defaultStyle: {
        color: 0x000000,
        bgcolor: 0xffff00,
      },
      callback: (feedback): boolean => {
        const stripId = feedback.options.strip === 'Selected' ? instance.selectedStrip : feedback.options.strip
        return instance.data.stripState[stripId - 1]?.solo
      },
    },

	}
}
