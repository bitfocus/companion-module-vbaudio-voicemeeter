import type { CompanionPresetDefinitions, CompanionPresetGroupSimple, CompanionPresetSection } from '@companion-module/base'
import { type InstanceTypes } from '../index.js'
import { type BusName, busName } from '../utils.js'

/*
	routeAudio: CompanionActionSchema<
		{
			type: 'Toggle' | 'On' | 'Off'
			recorderType: 'On' | 'Off'
			source: number
			destination: 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'B1' | 'B2' | 'B3'
		},
		void
	>

*/

export const getStripDefinitions = (): CompanionPresetDefinitions<InstanceTypes> => {
  const stripDefinitions: CompanionPresetDefinitions<InstanceTypes> = {}

  for (let i = 1; i < 9; i++) {
    stripDefinitions[`strip_${i}_gainInc`] = {
      name: `Strip ${i}\nGain +1`,
      type: 'simple',
      style: {
        text: `Strip ${i}\nGain +1`,
        size: 14,
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      steps: [
        {
          down: [
            {
              actionId: 'stripGain',
              options: { strip: i, adjustment: 'Increase', fade: 0, value: 1 },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [],
    }

    stripDefinitions[`strip_${i}_gainDec`] = {
      name: `Strip ${i}\nGain -1`,
      type: 'simple',
      style: {
        text: `Strip ${i}\nGain -1`,
        size: 14,
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      steps: [
        {
          down: [
            {
              actionId: 'stripGain',
              options: { strip: i, adjustment: 'Decrease', fade: 0, value: 1 },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [],
    }

    stripDefinitions[`strip_${i}_mono`] = {
      name: `Strip ${i}\nMono`,
      type: 'simple',
      style: {
        text: `Strip ${i}\nMono`,
        size: 14,
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      steps: [
        {
          down: [
            {
              actionId: 'stripMono',
              options: { strip: i, type: 'Toggle' },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'stripMono',
          options: { strip: i },
          style: {
            color: 0x000000,
            bgcolor: 0xff0000,
          },
        },
      ],
    }

    stripDefinitions[`strip_${i}_mute`] = {
      name: `Strip ${i}\nMute`,
      type: 'simple',
      style: {
        text: `Strip ${i}\nMute`,
        size: 14,
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      steps: [
        {
          down: [
            {
              actionId: 'stripMute',
              options: { strip: i, type: 'Toggle' },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'stripMute',
          options: { strip: i },
          style: {
            color: 0x000000,
            bgcolor: 0xff0000,
          },
        },
      ],
    }

    stripDefinitions[`strip_${i}_solo`] = {
      name: `Strip ${i}\nSolo`,
      type: 'simple',
      style: {
        text: `Strip ${i}\nSolo`,
        size: 14,
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      steps: [
        {
          down: [
            {
              actionId: 'stripSolo',
              options: { strip: i, type: 'Toggle' },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'stripSolo',
          options: { strip: i },
          style: {
            color: 0x000000,
            bgcolor: 0xff0000,
          },
        },
      ],
    }

    busName.forEach((bus) => {
      stripDefinitions[`strip_${i}_routing_${bus}`] = {
        name: `Strip ${i}\n${bus}`,
        type: 'simple',
        style: {
          text: `Strip ${i}\n${bus}`,
          size: 14,
          color: 0xffffff,
          bgcolor: 0x000000,
        },
        steps: [
          {
            down: [
              {
                actionId: 'routeAudio',
                options: { type: 'Toggle', recorderType: 'On', source: i - 1, destination: bus as BusName },
              },
            ],
            up: [],
          },
        ],
        feedbacks: [
          {
            feedbackId: 'routing',
            options: { source: i - 1, destination: bus as BusName },
            style: {
              color: 0x000000,
              bgcolor: 0xff0000,
            },
          },
        ],
      }
    })
  }

  return stripDefinitions
}

export const getStripStructure = (): CompanionPresetSection<InstanceTypes>[] => {
  const stripGroups: CompanionPresetGroupSimple<InstanceTypes>[] = []
  const routingGroups: CompanionPresetGroupSimple<InstanceTypes>[] = []

  for (let i = 1; i < 9; i++) {
    stripGroups.push({
      id: `stripPresets${i}`,
      type: 'simple' as const,
      name: `${i} Actions/Feedback`,
      presets: [`strip_${i}_gainInc`, `strip_${i}_gainDec`, `strip_${i}_mono`, `strip_${i}_mute`, `strip_${i}_solo`],
    })

    const routingPreset: CompanionPresetGroupSimple<InstanceTypes> = {
      id: `stripPresets${i}`,
      type: 'simple' as const,
      name: `${i} Routing`,
      presets: [],
    }

    busName.forEach((bus) => {
      routingPreset.presets.push(`strip_${i}_routing_${bus}`)
    })

    routingGroups.push(routingPreset)
  }

  const stripStructure: CompanionPresetSection<InstanceTypes>[] = [
    {
      id: 'stripPresets',
      name: 'Strip Presets',
      description: 'Presets for Strip 1 to 8',
      definitions: stripGroups,
    },
    {
      id: 'stripRouting',
      name: 'Strip Routing',
      description: 'Routing Strips 1 to 8 to Bus A1 to B3',
      definitions: routingGroups,
    },
  ]

  return stripStructure
}
