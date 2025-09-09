import VoicemeeterInstance from './'
import { CompanionVariableDefinition } from '@companion-module/base'
import { busName } from './utils'

interface InstanceVariableValue {
  [key: string]: string | number | undefined
}

export class Variables {
  private readonly instance: VoicemeeterInstance
  public currentVariables: any = {}

  constructor(instance: VoicemeeterInstance) {
    this.instance = instance
  }

  /**
   * @param variables Object of variable names and their values
   * @description Updates or removes variable for current instance
   */
  public readonly set = (variables: InstanceVariableValue): void => {
    const newVariables: { [variableId: string]: string | undefined } = {}

    for (const name in variables) {
      newVariables[name] = variables[name]?.toString()
    }

    this.currentVariables = newVariables
    this.instance.setVariableValues(newVariables)
  }

  /**
   * @description Sets variable definitions
   */
  public readonly updateDefinitions = (): void => {
    const variables: Set<CompanionVariableDefinition> = new Set([])

    variables.add({ name: 'Type', variableId: 'type' })
    variables.add({ name: 'Version', variableId: 'version' })
    variables.add({ name: 'Util Selected Bus', variableId: 'util_selected_bus' })
    variables.add({ name: 'Util Selected Strip', variableId: 'util_selected_strip' })

    for (let i = 0; i < 8; i++) {
      const name = busName[i]
      variables.add({ name: `Bus ${name} Mono`, variableId: `bus_${name.toLowerCase()}_mono` })
      variables.add({ name: `Bus ${name} Mute`, variableId: `bus_${name.toLowerCase()}_mute` })
      variables.add({ name: `Bus ${name} EQ`, variableId: `bus_${name.toLowerCase()}_eq` })
      variables.add({ name: `Bus ${name} EQ AB`, variableId: `bus_${name.toLowerCase()}_eqab` })
      variables.add({ name: `Bus ${name} Gain`, variableId: `bus_${name.toLowerCase()}_gain` })
      variables.add({ name: `Bus ${name} Label`, variableId: `bus_${name.toLowerCase()}_label` })
      variables.add({ name: `Bus ${name} Level 1`, variableId: `bus_${name.toLowerCase()}_l1` })
      variables.add({ name: `Bus ${name} Level 2`, variableId: `bus_${name.toLowerCase()}_l2` })
      variables.add({ name: `Bus ${name} Mode`, variableId: `bus_${name.toLowerCase()}_mode` })
      variables.add({ name: `Bus ${name} Select`, variableId: `bus_${name.toLowerCase()}_select` })
    }

    for (let i = 1; i <= 9; i++) {
      const name = i === 9 ? 'Selected' : i.toString()
      variables.add({ name: `Strip ${name} Mono`, variableId: `strip_${name.toLowerCase()}_mono` })
      variables.add({ name: `Strip ${name} Mute`, variableId: `strip_${name.toLowerCase()}_mute` })
      variables.add({ name: `Strip ${name} Solo`, variableId: `strip_${name.toLowerCase()}_solo` })
      variables.add({ name: `Strip ${name} MC`, variableId: `strip_${name.toLowerCase()}_mc` })
      variables.add({ name: `Strip ${name} Gain`, variableId: `strip_${name.toLowerCase()}_gain` })
      variables.add({ name: `Strip ${name} Level 1`, variableId: `strip_${name.toLowerCase()}_l1` })
      variables.add({ name: `Strip ${name} Level 2`, variableId: `strip_${name.toLowerCase()}_l2` })

      for (let j = 0; j < 8; j++) {
        const name = busName[j]

        variables.add({
          name: `Strip ${name} Gain ${name}`,
          variableId: `strip_${name.toLowerCase()}_gain_${name.toLowerCase()}`,
        })
      }

      variables.add({ name: `Strip ${name} Pan X`, variableId: `strip_${name.toLowerCase()}_pan_x` })
      variables.add({ name: `Strip ${name} Pan Y`, variableId: `strip_${name.toLowerCase()}_pan_y` })
      variables.add({ name: `Strip ${name} Color X`, variableId: `strip_${name.toLowerCase()}_color_x` })
      variables.add({ name: `Strip ${name} Color Y`, variableId: `strip_${name.toLowerCase()}_color_y` })
      variables.add({ name: `Strip ${name} FX X`, variableId: `strip_${name.toLowerCase()}_fx_x` })
      variables.add({ name: `Strip ${name} FX Y`, variableId: `strip_${name.toLowerCase()}_fx_y` })
      variables.add({
        name: `Strip ${name} Compressor Input Gain`,
        variableId: `strip_${name.toLowerCase()}_compressor_input_gain`,
      })
      variables.add({
        name: `Strip ${name} Compressor Ratio`,
        variableId: `strip_${name.toLowerCase()}_compressor_ratio`,
      })
      variables.add({
        name: `Strip ${name} Compressor Threshold`,
        variableId: `strip_${name.toLowerCase()}_compressor_threshold`,
      })
      variables.add({
        name: `Strip ${name} Compressor Attack`,
        variableId: `strip_${name.toLowerCase()}_compressor_attack`,
      })
      variables.add({
        name: `Strip ${name} Compressor Release`,
        variableId: `strip_${name.toLowerCase()}_compressor_release`,
      })
      variables.add({
        name: `Strip ${name} Compressor Knee`,
        variableId: `strip_${name.toLowerCase()}_compressor_knee`,
      })
      variables.add({
        name: `Strip ${name} Compressor Output Gain`,
        variableId: `strip_${name.toLowerCase()}_compressor_output_gain`,
      })
      variables.add({
        name: `Strip ${name} Compressor Make Up`,
        variableId: `strip_${name.toLowerCase()}_compressor_make_up`,
      })
      variables.add({ name: `Strip ${name} Gate Threshold`, variableId: `strip_${name.toLowerCase()}_gate_threshold` })
      variables.add({ name: `Strip ${name} Gate Damping`, variableId: `strip_${name.toLowerCase()}_gate_damping` })
      variables.add({
        name: `Strip ${name} Gate Band Pass Sidechain`,
        variableId: `strip_${name.toLowerCase()}_gate_bps`,
      })
      variables.add({ name: `Strip ${name} Gate Attack`, variableId: `strip_${name.toLowerCase()}_gate_attack` })
      variables.add({ name: `Strip ${name} Gate Hold`, variableId: `strip_${name.toLowerCase()}_gate_hold` })
      variables.add({ name: `Strip ${name} Gate Release`, variableId: `strip_${name.toLowerCase()}_gate_release` })
      variables.add({ name: `Strip ${name} Denoiser Threshold`, variableId: `strip_${name.toLowerCase()}_denoiser` })
      variables.add({ name: `Strip ${name} Pitch`, variableId: `strip_${name.toLowerCase()}_pitch` })
      variables.add({ name: `Strip ${name} Pitch Value`, variableId: `strip_${name.toLowerCase()}_pitch_value` })
      variables.add({ name: `Strip ${name} Pitch Dry/Wet`, variableId: `strip_${name.toLowerCase()}_pitch_drywet` })
      variables.add({
        name: `Strip ${name} Pitch Formant Lo`,
        variableId: `strip_${name.toLowerCase()}_pitch_formant_lo`,
      })
      variables.add({
        name: `Strip ${name} Pitch Formant Med`,
        variableId: `strip_${name.toLowerCase()}_pitch_formant_med`,
      })
      variables.add({
        name: `Strip ${name} Pitch Formant Hi`,
        variableId: `strip_${name.toLowerCase()}_pitch_formant_hi`,
      })
      variables.add({ name: `Strip ${name} Karaoke`, variableId: `strip_${name.toLowerCase()}_karaoke` })
      variables.add({ name: `Strip ${name} Limit`, variableId: `strip_${name.toLowerCase()}_limit` })
      variables.add({ name: `Strip ${name} EQ Gain 1`, variableId: `strip_${name.toLowerCase()}_eq_gain_1` })
      variables.add({ name: `Strip ${name} EQ Gain 2`, variableId: `strip_${name.toLowerCase()}_eq_gain_2` })
      variables.add({ name: `Strip ${name} EQ Gain 3`, variableId: `strip_${name.toLowerCase()}_eq_gain_3` })
      variables.add({ name: `Strip ${name} Label`, variableId: `strip_${name.toLowerCase()}_label` })
      variables.add({ name: `Strip ${name} A1`, variableId: `strip_${name.toLowerCase()}_a1` })
      variables.add({ name: `Strip ${name} A2`, variableId: `strip_${name.toLowerCase()}_a2` })
      variables.add({ name: `Strip ${name} A3`, variableId: `strip_${name.toLowerCase()}_a3` })
      variables.add({ name: `Strip ${name} A4`, variableId: `strip_${name.toLowerCase()}_a4` })
      variables.add({ name: `Strip ${name} A5`, variableId: `strip_${name.toLowerCase()}_a5` })
      variables.add({ name: `Strip ${name} B1`, variableId: `strip_${name.toLowerCase()}_b1` })
      variables.add({ name: `Strip ${name} B2`, variableId: `strip_${name.toLowerCase()}_b2` })
      variables.add({ name: `Strip ${name} B3`, variableId: `strip_${name.toLowerCase()}_b3` })
      variables.add({ name: `Strip ${name} Reverb`, variableId: `strip_${name.toLowerCase()}_reverb` })
      variables.add({ name: `Strip ${name} Delay`, variableId: `strip_${name.toLowerCase()}_delay` })
      variables.add({ name: `Strip ${name} FX 1`, variableId: `strip_${name.toLowerCase()}_fx1` })
      variables.add({ name: `Strip ${name} FX 2`, variableId: `strip_${name.toLowerCase()}_fx2` })
      variables.add({ name: `Strip ${name} Post Reverb`, variableId: `strip_${name.toLowerCase()}_post_reverb` })
      variables.add({ name: `Strip ${name} Post Delay`, variableId: `strip_${name.toLowerCase()}_post_delay` })
      variables.add({ name: `Strip ${name} Post FX 1`, variableId: `strip_${name.toLowerCase()}_post_fx1` })
      variables.add({ name: `Strip ${name} Post FX 2`, variableId: `strip_${name.toLowerCase()}_post_fx2` })
      variables.add({ name: `Strip ${name} Post FX 2`, variableId: `strip_${name.toLowerCase()}_post_fx2` })
    }

    this.instance.setVariableDefinitions([...variables])
  }

  /**
   * @description Update variables
   */
  public readonly updateVariables = async (): Promise<void> => {
    const newVariables: InstanceVariableValue = {}

    newVariables.type = this.instance.type
    newVariables.version = this.instance.version
    newVariables.util_selected_bus = this.instance.selectedBus === -1 ? '' : busName[this.instance.selectedBus]
    newVariables.util_selected_strip = ''
    if (this.instance.selectedStrip !== -1) {
      newVariables.util_selected_strip =
        this.instance.selectedStrip === 8
          ? 'Recorder'
          : this.instance.data.stripLabelUTF8c60[this.instance.selectedStrip]
    }

    for (let i = 0; i < 8; i++) {
      const name = busName[i]
      newVariables[`bus_${name.toLowerCase()}_mono`] = this.instance.data.busState[i].mono.toString()
      newVariables[`bus_${name.toLowerCase()}_mute`] = this.instance.data.busState[i].mute.toString()
      newVariables[`bus_${name.toLowerCase()}_eq`] = this.instance.data.busState[i].eq.toString()
      newVariables[`bus_${name.toLowerCase()}_eqab`] = this.instance.data.busState[i].eqB ? 'B' : 'A'
      newVariables[`bus_${name.toLowerCase()}_gain`] = (
        Math.round(this.instance.data.busGaindB100[i] * 10) / 10
      ).toFixed(1)
      newVariables[`bus_${name.toLowerCase()}_label`] = this.instance.data.busLabelUTF8c60[i]
      newVariables[`bus_${name.toLowerCase()}_l1`] = this.instance.data.outputLeveldB100[i][0]
      newVariables[`bus_${name.toLowerCase()}_l2`] = this.instance.data.outputLeveldB100[i][1]
      newVariables[`bus_${name.toLowerCase()}_mode`] = this.instance.data.busState[i].mode
      newVariables[`bus_${name.toLowerCase()}_select`] = this.instance.data.busState[i].sel.toString()
    }

    for (let i = 0; i < 8; i++) {
      newVariables[`strip_${i + 1}_mono`] = this.instance.data.stripState[i].mono.toString()
      newVariables[`strip_${i + 1}_mute`] = this.instance.data.stripState[i].mute.toString()
      newVariables[`strip_${i + 1}_solo`] = this.instance.data.stripState[i].solo.toString()
      newVariables[`strip_${i + 1}_mc`] = this.instance.data.stripState[i].muteC.toString()
      newVariables[`strip_${i + 1}_gain`] = this.instance.data.stripGaindB100Layer1[i]
      for (let j = 0; j < 8; j++) {
        const name = busName[j]
        newVariables[`strip_${i + 1}_gain_${name.toLowerCase()}`] = this.instance.data[`stripGaindB100Layer${j}`]
      }

      newVariables[`strip_${i + 1}_pan_x`] = this.instance.data.stripData[i]?.pos3D_x
      newVariables[`strip_${i + 1}_pan_y`] = this.instance.data.stripData[i]?.pos3D_y
      newVariables[`strip_${i + 1}_color_x`] = this.instance.data.stripData[i]?.posColor_x
      newVariables[`strip_${i + 1}_color_y`] = this.instance.data.stripData[i]?.posColor_y
      newVariables[`strip_${i + 1}_fx_x`] = this.instance.data.stripData[i]?.posColor_y
      newVariables[`strip_${i + 1}_fx_y`] = this.instance.data.stripData[i]?.posMox_y
      newVariables[`strip_${i + 1}_compressor_input_gain`] = this.instance.data.stripData[i]?.comp.gainIn
      newVariables[`strip_${i + 1}_compressor_ratio`] = this.instance.data.stripData[i]?.comp.ratio
      newVariables[`strip_${i + 1}_compressor_threshold`] = this.instance.data.stripData[i]?.comp.threshold
      newVariables[`strip_${i + 1}_compressor_attack`] = this.instance.data.stripData[i]?.comp.attack
      newVariables[`strip_${i + 1}_compressor_release`] = this.instance.data.stripData[i]?.comp.release
      newVariables[`strip_${i + 1}_compressor_knee`] = this.instance.data.stripData[i]?.comp.knee
      newVariables[`strip_${i + 1}_compressor_output_gain`] = this.instance.data.stripData[i]?.comp.gainOut
      newVariables[`strip_${i + 1}_compressor_make_up`] = this.instance.data.stripData[i]?.comp.auto
      newVariables[`strip_${i + 1}_gate_threshold`] = this.instance.data.stripData[i]?.gate.dbThresholdIn
      newVariables[`strip_${i + 1}_gate_damping`] = this.instance.data.stripData[i]?.gate.dbDampingMax
      newVariables[`strip_${i + 1}_gate_bps`] = this.instance.data.stripData[i]?.gate.BPSideChan
      newVariables[`strip_${i + 1}_gate_attack`] = this.instance.data.stripData[i]?.gate.attack
      newVariables[`strip_${i + 1}_gate_hold`] = this.instance.data.stripData[i]?.gate.hold
      newVariables[`strip_${i + 1}_gate_release`] = this.instance.data.stripData[i]?.gate.release
      newVariables[`strip_${i + 1}_denoiser`] = this.instance.data.stripData[i]?.denoiser
      newVariables[`strip_${i + 1}_pitch`] = this.instance.data.stripData[i]?.pitch.enabled.toString()
      newVariables[`strip_${i + 1}_pitch_value`] = this.instance.data.stripData[i]?.pitch.value
      newVariables[`strip_${i + 1}_pitch_drywet`] = this.instance.data.stripData[i]?.pitch.dryWet
      newVariables[`strip_${i + 1}_pitch_formant_lo`] = this.instance.data.stripData[i]?.pitch.formantLo
      newVariables[`strip_${i + 1}_pitch_formant_med`] = this.instance.data.stripData[i]?.pitch.formantMed
      newVariables[`strip_${i + 1}_pitch_formant_hi`] = this.instance.data.stripData[i]?.pitch.formantHigh
      newVariables[`strip_${i + 1}_karaoke`] = this.instance.data.stripData[i]?.karaoke
      newVariables[`strip_${i + 1}_limit`] = this.instance.data.stripData[i]?.dBLimit
      newVariables[`strip_${i + 1}_eq_gain_1`] = this.instance.data.stripData[i]?.EQgain1
      newVariables[`strip_${i + 1}_eq_gain_2`] = this.instance.data.stripData[i]?.EQgain2
      newVariables[`strip_${i + 1}_eq_gain_3`] = this.instance.data.stripData[i]?.EQgain3
      newVariables[`strip_${i + 1}_label`] = this.instance.data.stripLabelUTF8c60[i]
      newVariables[`strip_${i + 1}_l1`] = this.instance.data.inputLeveldB100[i][0]
      newVariables[`strip_${i + 1}_l2`] = this.instance.data.inputLeveldB100[i][1]
      newVariables[`strip_${i + 1}_a1`] = this.instance.data.stripState[i].busA1.toString()
      newVariables[`strip_${i + 1}_a2`] = this.instance.data.stripState[i].busA2.toString()
      newVariables[`strip_${i + 1}_a3`] = this.instance.data.stripState[i].busA3.toString()
      newVariables[`strip_${i + 1}_a4`] = this.instance.data.stripState[i].busA4.toString()
      newVariables[`strip_${i + 1}_a5`] = this.instance.data.stripState[i].busA5.toString()
      newVariables[`strip_${i + 1}_b1`] = this.instance.data.stripState[i].busB1.toString()
      newVariables[`strip_${i + 1}_b2`] = this.instance.data.stripState[i].busB2.toString()
      newVariables[`strip_${i + 1}_b3`] = this.instance.data.stripState[i].busB3.toString()
      newVariables[`strip_${i + 1}_reverb`] = this.instance.data.stripData[i]?.sendReverb
      newVariables[`strip_${i + 1}_delay`] = this.instance.data.stripData[i]?.sendDelay
      newVariables[`strip_${i + 1}_fx1`] = this.instance.data.stripData[i]?.sendFX1
      newVariables[`strip_${i + 1}_fx2`] = this.instance.data.stripData[i]?.sendFX2
      newVariables[`strip_${i + 1}_post_reverb`] = this.instance.data.stripState[i].postFXR.toString()
      newVariables[`strip_${i + 1}_post_delay`] = this.instance.data.stripState[i].postFXD.toString()
      newVariables[`strip_${i + 1}_post_fx1`] = this.instance.data.stripState[i].postFX1.toString()
      newVariables[`strip_${i + 1}_post_fx2`] = this.instance.data.stripState[i].postFX2.toString()
    }

    this.set(newVariables)
  }
}
