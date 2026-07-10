import type { CompanionPresetDefinitions, CompanionPresetGroupSimple, CompanionPresetSection } from '@companion-module/base'
import { type InstanceTypes } from '../index.js'
import { busName } from '../utils.js'

export const getBusDefinitions = (): CompanionPresetDefinitions<InstanceTypes> => {
  const busDefinitions: CompanionPresetDefinitions<InstanceTypes> = {}

  busName.forEach((bus) => {
    busDefinitions[`bus_${bus}_eq`] = {
      name: `Bus ${bus} EQ Toggle`,
      type: 'simple',
      style: {
        text: `${bus}\nEQ`,
        size: 14,
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      steps: [
        {
          down: [
            {
              actionId: 'busEQ',
              options: { bus, type: 'Toggle' },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'busEQ',
          options: { bus },
          style: {
            color: 0x000000,
            bgcolor: 0xff0000,
          },
        },
      ],
    }

    busDefinitions[`bus_${bus}_eqab`] = {
      name: `Bus ${bus} EQ AB Select`,
      type: 'simple',
      style: {
        text: `${bus}\nEQ A/B`,
        size: 14,
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      steps: [
        {
          down: [
            {
              actionId: 'busEQAB',
              options: { bus, mode: 'Toggle' },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'busEQAB',
          options: { bus, mode: 0 },
          style: {
            color: 0x000000,
            bgcolor: 0xff0000,
          },
        },
      ],
    }

    busDefinitions[`bus_${bus}_busGainInc`] = {
      name: `Bus ${bus} Gain +1`,
      type: 'simple',
      style: {
        text: `${bus}\nGain +1`,
        size: 14,
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      steps: [
        {
          down: [
            {
              actionId: 'busGain',
              options: { bus, adjustment: 'Increase', fade: 0, value: 1 },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [],
    }

    busDefinitions[`bus_${bus}_busGainDec`] = {
      name: `Bus ${bus} Gain -1`,
      type: 'simple',
      style: {
        text: `${bus}\nGain -1`,
        size: 14,
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      steps: [
        {
          down: [
            {
              actionId: 'busGain',
              options: { bus, adjustment: 'Decrease', fade: 0, value: 1 },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [],
    }

    busDefinitions[`bus_${bus}_busMonitor`] = {
      name: `Bus ${bus} Monitor`,
      type: 'simple',
      style: {
        text: `${bus}\nMonitor`,
        size: 14,
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      steps: [
        {
          down: [
            {
              actionId: 'busMonitor',
              options: { bus, type: 'Toggle' },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'busMonitor',
          options: { bus },
          style: {
            color: 0x000000,
            bgcolor: 0xff0000,
          },
        },
      ],
    }

    busDefinitions[`bus_${bus}_busMono`] = {
      name: `Bus ${bus} Mono`,
      type: 'simple',
      style: {
        text: `${bus}\nMono`,
        size: 14,
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      steps: [
        {
          down: [
            {
              actionId: 'busMono',
              options: { bus, type: 'Toggle' },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'busMono',
          options: { bus },
          style: {
            color: 0x000000,
            bgcolor: 0xff0000,
          },
        },
      ],
    }

    busDefinitions[`bus_${bus}_busMute`] = {
      name: `Bus ${bus} Mute`,
      type: 'simple',
      style: {
        text: `${bus}\nMute`,
        size: 14,
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      steps: [
        {
          down: [
            {
              actionId: 'busMute',
              options: { bus, type: 'Toggle' },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'busMute',
          options: { bus },
          style: {
            color: 0x000000,
            bgcolor: 0xff0000,
          },
        },
      ],
    }

    busDefinitions[`bus_${bus}_busSel`] = {
      name: `Bus ${bus} Sel`,
      type: 'simple',
      style: {
        text: `${bus}\nSel`,
        size: 14,
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      steps: [
        {
          down: [
            {
              actionId: 'busSel',
              options: { bus, type: 'Toggle' },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'busSel',
          options: { bus },
          style: {
            color: 0x000000,
            bgcolor: 0xffff00,
          },
        },
      ],
    }
  })

  return busDefinitions
}

export const getBusStructure = (): CompanionPresetSection<InstanceTypes>[] => {
  const busGroups: CompanionPresetGroupSimple<InstanceTypes>[] = [
    ...busName.map((bus) => {
      return {
        id: `busPresets${bus}`,
        type: 'simple' as 'simple',
        name: `${bus}`,
        description: `Bus ${bus}`,
        presets: [
          `bus_${bus}_eq`,
          `bus_${bus}_eqab`,
          `bus_${bus}_busGainInc`,
          `bus_${bus}_busGainDec`,
          `bus_${bus}_busMonitor`,
          `bus_${bus}_busMono`,
          `bus_${bus}_busMute`,
          `bus_${bus}_busSel`,
        ],
      }
    }),
  ]

  const busStructure: CompanionPresetSection<InstanceTypes>[] = [
    {
      id: 'busPresets',
      name: 'Bus Presets',
      description: 'Presets for Bus A1 to B3',
      definitions: busGroups,
    },
  ]

  return busStructure
}
