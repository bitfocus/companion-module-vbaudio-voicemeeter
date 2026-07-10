import type { CompanionVariableDefinitions, JsonValue } from '@companion-module/base'
import type VoicemeeterInstance from '../index.js'
import { busName } from '../utils.js'

export type StripVariablesSchema = {
  [key: `strip_${string}`]: JsonValue
  [key: `strip_${string}_mono`]: boolean
  [key: `strip_${string}_mute`]: boolean
  [key: `strip_${string}_solo`]: boolean
  [key: `strip_${string}_mc`]: boolean
  [key: `strip_${string}_fader`]: number
  [key: `strip_${string}_gain`]: number
  [key: `strip_${string}_gain_${string}`]: number
  [key: `strip_${string}_pan_x`]: number
  [key: `strip_${string}_pan_y`]: number
  [key: `strip_${string}_color_x`]: number
  [key: `strip_${string}_color_y`]: number
  [key: `strip_${string}_fx_x`]: number
  [key: `strip_${string}_fx_y`]: number
  [key: `strip_${string}_compressor_input_gain`]: number
  [key: `strip_${string}_compressor_ratio`]: number
  [key: `strip_${string}_compressor_threshold`]: number
  [key: `strip_${string}_compressor_attack`]: number
  [key: `strip_${string}_compressor_release`]: number
  [key: `strip_${string}_compressor_knee`]: number
  [key: `strip_${string}_compressor_output_gain`]: number
  [key: `strip_${string}_compressor_make_up`]: number
  [key: `strip_${string}_gate_threshold`]: number
  [key: `strip_${string}_gate_damping`]: number
  [key: `strip_${string}_gate_bps`]: number
  [key: `strip_${string}_gate_attack`]: number
  [key: `strip_${string}_gate_hold`]: number
  [key: `strip_${string}_gate_release`]: number
  [key: `strip_${string}_denoiser`]: number
  [key: `strip_${string}_pitch`]: boolean
  [key: `strip_${string}_pitch_value`]: number
  [key: `strip_${string}_pitch_drywet`]: number
  [key: `strip_${string}_pitch_formant_lo`]: number
  [key: `strip_${string}_pitch_formant_med`]: number
  [key: `strip_${string}_pitch_formant_hi`]: number
  [key: `strip_${string}_karaoke`]: number
  [key: `strip_${string}_limit`]: number
  [key: `strip_${string}_eq_gain_1`]: number
  [key: `strip_${string}_eq_gain_2`]: number
  [key: `strip_${string}_eq_gain_3`]: number
  [key: `strip_${string}_label`]: string
  [key: `strip_${string}_l1`]: number
  [key: `strip_${string}_l2`]: number
  [key: `strip_${string}_a1`]: boolean
  [key: `strip_${string}_a2`]: boolean
  [key: `strip_${string}_a3`]: boolean
  [key: `strip_${string}_a4`]: boolean
  [key: `strip_${string}_a5`]: boolean
  [key: `strip_${string}_b1`]: boolean
  [key: `strip_${string}_b2`]: boolean
  [key: `strip_${string}_b3`]: boolean
  [key: `strip_${string}_reverb`]: boolean | number
  [key: `strip_${string}_delay`]: boolean | number
  [key: `strip_${string}_fx1`]: boolean | number
  [key: `strip_${string}_fx2`]: boolean | number
  [key: `strip_${string}_post_reverb`]: boolean | number
  [key: `strip_${string}_post_delay`]: boolean | number
  [key: `strip_${string}_post_fx1`]: boolean | number
  [key: `strip_${string}_post_fx2`]: boolean | number
}

export const stripDefinitions = (_instance: VoicemeeterInstance): CompanionVariableDefinitions<StripVariablesSchema> => {
  const definitions: CompanionVariableDefinitions<StripVariablesSchema> = {}

  for (let i = 1; i <= 9; i++) {
    const name = i === 9 ? 'selected' : i.toString()
    definitions[`strip_${name}_mono`] = { name: `Strip ${name} Mono` }
    definitions[`strip_${name}_mute`] = { name: `Strip ${name} Mute` }
    definitions[`strip_${name}_solo`] = { name: `Strip ${name} Solo` }
    definitions[`strip_${name}_mc`] = { name: `Strip ${name} MC` }
    definitions[`strip_${name}_fader`] = { name: `Strip ${name} Fader` }
    definitions[`strip_${name}_gain`] = { name: `Strip ${name} Gain` }
    definitions[`strip_${name}_l1`] = { name: `Strip ${name} Level 1` }
    definitions[`strip_${name}_l2`] = { name: `Strip ${name} Level 2` }

    for (let j = 0; j < 8; j++) {
      const bus = busName[j]
      definitions[`strip_${name}_gain_${bus}`] = { name: `Strip ${name} Gain ${bus}` }
    }

    definitions[`strip_${name}_pan_x`] = { name: `Strip ${name} Pan X` }
    definitions[`strip_${name}_pan_y`] = { name: `Strip ${name} Pan Y` }
    definitions[`strip_${name}_color_x`] = { name: `Strip ${name} Color X` }
    definitions[`strip_${name}_color_y`] = { name: `Strip ${name} Color Y` }
    definitions[`strip_${name}_fx_x`] = { name: `Strip ${name} FX X` }
    definitions[`strip_${name}_fx_y`] = { name: `Strip ${name} FX Y` }
    definitions[`strip_${name}_compressor_input_gain`] = { name: `Strip ${name} Compressor Input Gain` }
    definitions[`strip_${name}_compressor_ratio`] = { name: `Strip ${name} Compressor Ratio` }
    definitions[`strip_${name}_compressor_threshold`] = { name: `Strip ${name} Compressor Threshold` }
    definitions[`strip_${name}_compressor_attack`] = { name: `Strip ${name} Compressor Attack` }
    definitions[`strip_${name}_compressor_release`] = { name: `Strip ${name} Compressor Release` }
    definitions[`strip_${name}_compressor_knee`] = { name: `Strip ${name} Compressor Knee` }
    definitions[`strip_${name}_compressor_output_gain`] = { name: `Strip ${name} Compressor Output Gain` }
    definitions[`strip_${name}_compressor_make_up`] = { name: `Strip ${name} Compressor Make Up` }
    definitions[`strip_${name}_gate_threshold`] = { name: `Strip ${name} Gate Threshold` }
    definitions[`strip_${name}_gate_damping`] = { name: `Strip ${name} Gate Damping` }
    definitions[`strip_${name}_gate_bps`] = { name: `Strip ${name} Gate Band Pass Sidechain` }
    definitions[`strip_${name}_gate_attack`] = { name: `Strip ${name} Gate Attack` }
    definitions[`strip_${name}_gate_hold`] = { name: `Strip ${name} Gate Hold` }
    definitions[`strip_${name}_gate_release`] = { name: `Strip ${name} Gate Release` }
    definitions[`strip_${name}_denoiser`] = { name: `Strip ${name} Denoiser Threshold` }
    definitions[`strip_${name}_pitch`] = { name: `Strip ${name} Pitch` }
    definitions[`strip_${name}_pitch_value`] = { name: `Strip ${name} Pitch Value` }
    definitions[`strip_${name}_pitch_drywet`] = { name: `Strip ${name} Pitch Dry/Wet` }
    definitions[`strip_${name}_pitch_formant_lo`] = { name: `Strip ${name} Pitch Formant Lo` }
    definitions[`strip_${name}_pitch_formant_med`] = { name: `Strip ${name} Pitch Formant Med` }
    definitions[`strip_${name}_pitch_formant_hi`] = { name: `Strip ${name} Pitch Formant Hi` }
    definitions[`strip_${name}_karaoke`] = { name: `Strip ${name} Karaoke` }
    definitions[`strip_${name}_limit`] = { name: `Strip ${name} Limit` }
    definitions[`strip_${name}_eq_gain_1`] = { name: `Strip ${name} EQ Gain 1` }
    definitions[`strip_${name}_eq_gain_2`] = { name: `Strip ${name} EQ Gain 2` }
    definitions[`strip_${name}_eq_gain_3`] = { name: `Strip ${name} EQ Gain 3` }
    definitions[`strip_${name}_label`] = { name: `Strip ${name} Label` }
    definitions[`strip_${name}_a1`] = { name: `Strip ${name} A1` }
    definitions[`strip_${name}_a2`] = { name: `Strip ${name} A2` }
    definitions[`strip_${name}_a3`] = { name: `Strip ${name} A3` }
    definitions[`strip_${name}_a4`] = { name: `Strip ${name} A4` }
    definitions[`strip_${name}_a5`] = { name: `Strip ${name} A5` }
    definitions[`strip_${name}_b1`] = { name: `Strip ${name} B1` }
    definitions[`strip_${name}_b2`] = { name: `Strip ${name} B2` }
    definitions[`strip_${name}_b3`] = { name: `Strip ${name} B3` }
    definitions[`strip_${name}_reverb`] = { name: `Strip ${name} Reverb` }
    definitions[`strip_${name}_delay`] = { name: `Strip ${name} Delay` }
    definitions[`strip_${name}_fx1`] = { name: `Strip ${name} FX 1` }
    definitions[`strip_${name}_fx2`] = { name: `Strip ${name} FX 2` }
    definitions[`strip_${name}_post_reverb`] = { name: `Strip ${name} Post Reverb` }
    definitions[`strip_${name}_post_delay`] = { name: `Strip ${name} Post Delay` }
    definitions[`strip_${name}_post_fx1`] = { name: `Strip ${name} Post FX 1` }
    definitions[`strip_${name}_post_fx2`] = { name: `Strip ${name} Post FX 2` }
  }

  return definitions
}

export const stripValues = async (instance: VoicemeeterInstance): Promise<StripVariablesSchema> => {
  const variables: StripVariablesSchema = {}

  for (let i = 1; i <= 9; i++) {
    const name = i === 9 ? 'Selected' : i.toString()
    const stripId = i === 9 ? instance.selectedStrip : i - 1
		if (!instance.data.stripState[stripId]) continue

    variables[`strip_${name}`] = instance.data.stripState[stripId]
    variables[`strip_${name}_mono`] = instance.data.stripState[stripId].mono
    variables[`strip_${name}_mute`] = instance.data.stripState[stripId].mute
    variables[`strip_${name}_solo`] = instance.data.stripState[stripId].solo
    variables[`strip_${name}_mc`] = instance.data.stripState[stripId].muteC

    let gainValue: number[] = []
    instance.data.busState.forEach((bus, index) => {
      if (bus.sel) {
        gainValue.push(instance.data[`stripGaindB100Layer${index + 1}`][stripId])
      }
    })
		variables[`strip_${name}_fader`] = Math.round(Math.pow((instance.data.stripGaindB100Layer0[stripId] + 60) / 72, 1) * 100)
    variables[`strip_${name}_gain`] = gainValue.length > 0 ? Math.max(...gainValue) : instance.data.stripGaindB100Layer0[stripId]

    for (let j = 0; j < 8; j++) {
      const bus = busName[j]
      variables[`strip_${name}_gain_${bus}`] = instance.data[`stripGaindB100Layer${j + 1}`][stripId]
    }

    variables[`strip_${name}_pan_x`] = instance.data.stripData[stripId]?.pos3D_x
    variables[`strip_${name}_pan_y`] = instance.data.stripData[stripId]?.pos3D_y
    variables[`strip_${name}_color_x`] = instance.data.stripData[stripId]?.posColor_x
    variables[`strip_${name}_color_y`] = instance.data.stripData[stripId]?.posColor_y
    variables[`strip_${name}_fx_x`] = instance.data.stripData[stripId]?.posColor_y
    variables[`strip_${name}_fx_y`] = instance.data.stripData[stripId]?.posMox_y
    variables[`strip_${name}_compressor_input_gain`] = instance.data.stripData[stripId]?.comp.gainIn
    variables[`strip_${name}_compressor_ratio`] = instance.data.stripData[stripId]?.comp.ratio
    variables[`strip_${name}_compressor_threshold`] = instance.data.stripData[stripId]?.comp.threshold
    variables[`strip_${name}_compressor_attack`] = instance.data.stripData[stripId]?.comp.attack
    variables[`strip_${name}_compressor_release`] = instance.data.stripData[stripId]?.comp.release
    variables[`strip_${name}_compressor_knee`] = instance.data.stripData[stripId]?.comp.knee
    variables[`strip_${name}_compressor_output_gain`] = instance.data.stripData[stripId]?.comp.gainOut
    variables[`strip_${name}_compressor_make_up`] = instance.data.stripData[stripId]?.comp.auto
    variables[`strip_${name}_gate_threshold`] = instance.data.stripData[stripId]?.gate.dbThresholdIn
    variables[`strip_${name}_gate_damping`] = instance.data.stripData[stripId]?.gate.dbDampingMax
    variables[`strip_${name}_gate_bps`] = instance.data.stripData[stripId]?.gate.BPSideChan
    variables[`strip_${name}_gate_attack`] = instance.data.stripData[stripId]?.gate.attack
    variables[`strip_${name}_gate_hold`] = instance.data.stripData[stripId]?.gate.hold
    variables[`strip_${name}_gate_release`] = instance.data.stripData[stripId]?.gate.release
    variables[`strip_${name}_denoiser`] = instance.data.stripData[stripId]?.denoiser
    variables[`strip_${name}_pitch`] = instance.data.stripData[stripId]?.pitch.enabled
    variables[`strip_${name}_pitch_value`] = instance.data.stripData[stripId]?.pitch.value
    variables[`strip_${name}_pitch_drywet`] = instance.data.stripData[stripId]?.pitch.dryWet
    variables[`strip_${name}_pitch_formant_lo`] = instance.data.stripData[stripId]?.pitch.formantLo
    variables[`strip_${name}_pitch_formant_med`] = instance.data.stripData[stripId]?.pitch.formantMed
    variables[`strip_${name}_pitch_formant_hi`] = instance.data.stripData[stripId]?.pitch.formantHigh
    variables[`strip_${name}_karaoke`] = instance.data.stripData[stripId]?.karaoke
    variables[`strip_${name}_limit`] = instance.data.stripData[stripId]?.dBLimit
    variables[`strip_${name}_eq_gain_1`] = instance.data.stripData[stripId]?.EQgain1
    variables[`strip_${name}_eq_gain_2`] = instance.data.stripData[stripId]?.EQgain2
    variables[`strip_${name}_eq_gain_3`] = instance.data.stripData[stripId]?.EQgain3
    variables[`strip_${name}_label`] = instance.data.stripLabelUTF8c60[stripId]
    variables[`strip_${name}_l1`] = instance.data.inputLeveldB100[stripId][0]
    variables[`strip_${name}_l2`] = instance.data.inputLeveldB100[stripId][1]
    variables[`strip_${name}_a1`] = instance.data.stripState[stripId].busA1
    variables[`strip_${name}_a2`] = instance.data.stripState[stripId].busA2
    variables[`strip_${name}_a3`] = instance.data.stripState[stripId].busA3
    variables[`strip_${name}_a4`] = instance.data.stripState[stripId].busA4
    variables[`strip_${name}_a5`] = instance.data.stripState[stripId].busA5
    variables[`strip_${name}_b1`] = instance.data.stripState[stripId].busB1
    variables[`strip_${name}_b2`] = instance.data.stripState[stripId].busB2
    variables[`strip_${name}_b3`] = instance.data.stripState[stripId].busB3
    variables[`strip_${name}_reverb`] = instance.data.stripData[stripId]?.sendReverb
    variables[`strip_${name}_delay`] = instance.data.stripData[stripId]?.sendDelay
    variables[`strip_${name}_fx1`] = instance.data.stripData[stripId]?.sendFX1
    variables[`strip_${name}_fx2`] = instance.data.stripData[stripId]?.sendFX2
    variables[`strip_${name}_post_reverb`] = instance.data.stripState[stripId].postFXR
    variables[`strip_${name}_post_delay`] = instance.data.stripState[stripId].postFXD
    variables[`strip_${name}_post_fx1`] = instance.data.stripState[stripId].postFX1
    variables[`strip_${name}_post_fx2`] = instance.data.stripState[stripId].postFX2
  }

  return variables
}
