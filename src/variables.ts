import VoicemeeterInstance from './'
import { CompanionVariableDefinition } from '@companion-module/base'
import { busName, maxBus, maxStrip } from './utils'

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
   * @param variables Object of variablenames and their values
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
    variables.add({ name: 'Verison', variableId: 'version' })
    variables.add({ name: 'Util Selected Bus', variableId: 'util_selected_bus' })
    variables.add({ name: 'Util Selected Strip', variableId: 'util_selected_strip' })

    for (let i = 0; i < maxBus[this.instance.type]; i++) {
      const name = busName[this.instance.type][i]
      variables.add({ name: `Bus ${name} Mono`, variableId: `bus_${name.toLowerCase()}_mono` })
      variables.add({ name: `Bus ${name} Mute`, variableId: `bus_${name.toLowerCase()}_mute` })
      variables.add({ name: `Bus ${name} EQ`, variableId: `bus_${name.toLowerCase()}_eq` })
      variables.add({ name: `Bus ${name} EQ AB`, variableId: `bus_${name.toLowerCase()}_eqab` })
      variables.add({ name: `Bus ${name} Gain`, variableId: `bus_${name.toLowerCase()}_gain` })
      variables.add({ name: `Bus ${name} Label`, variableId: `bus_${name.toLowerCase()}_label` })
      variables.add({ name: `Bus ${name} Mode`, variableId: `bus_${name.toLowerCase()}_mode` })
      variables.add({ name: `Bus ${name} Select`, variableId: `bus_${name.toLowerCase()}_select` })
      variables.add({ name: `Bus ${name} Return Reverd`, variableId: `bus_${name.toLowerCase()}_return_reverb` })
      variables.add({ name: `Bus ${name} Return Delay`, variableId: `bus_${name.toLowerCase()}_return_delay` })
      variables.add({ name: `Bus ${name} Return FX1`, variableId: `bus_${name.toLowerCase()}_return_fx1` })
      variables.add({ name: `Bus ${name} Return FX2`, variableId: `bus_${name.toLowerCase()}_return_fx2` })
    }

    for (let i = 1; i <= maxStrip[this.instance.type] + 1; i++) {
      const name = i === maxStrip[this.instance.type] + 1 ? 'Selected' : i.toString()
      variables.add({ name: `Strip ${name} Mono`, variableId: `strip_${name.toLowerCase()}_mono` })
      variables.add({ name: `Strip ${name} Mute`, variableId: `strip_${name.toLowerCase()}_mute` })
      variables.add({ name: `Strip ${name} Solo`, variableId: `strip_${name.toLowerCase()}_solo` })
      variables.add({ name: `Strip ${name} MC`, variableId: `strip_${name.toLowerCase()}_mc` })
      variables.add({ name: `Strip ${name} Gain`, variableId: `strip_${name.toLowerCase()}_gain` })
      variables.add({ name: `Strip ${name} L1`, variableId: `strip_${name.toLowerCase()}_l1` })
      variables.add({ name: `Strip ${name} L2`, variableId: `strip_${name.toLowerCase()}_l2` })
      variables.add({ name: `Strip ${name} L3`, variableId: `strip_${name.toLowerCase()}_l3` })
      for (let j = 0; j < maxBus[this.instance.type]; j++) {
        const name = busName[this.instance.type][j]
        variables.add({
          name: `Strip ${name} Gain ${name}`,
          variableId: `strip_${name.toLowerCase()}_gain_${name.toLowerCase()}`,
        })
      }

      variables.add({ name: `Strip ${name} Pan X`, variableId: `strip_${name.toLowerCase()}_pan_x` })
      variables.add({ name: `Strip ${name} Pan Y`, variableId: `strip_${name.toLowerCase()}_pan_y` })
      variables.add({ name: `Strip ${name} Color X`, variableId: `strip_${name.toLowerCase()}_color_x` })
      variables.add({ name: `Strip ${name} Color Y`, variableId: `strip_${name.toLowerCase()}_colorr_y` })
      variables.add({ name: `Strip ${name} FX X`, variableId: `strip_${name.toLowerCase()}_fx_x` })
      variables.add({ name: `Strip ${name} FX Y`, variableId: `strip_${name.toLowerCase()}_fx_y` })
      variables.add({ name: `Strip ${name} Compressor`, variableId: `strip_${name.toLowerCase()}_compressor` })
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
      variables.add({ name: `Strip ${name} Gate`, variableId: `strip_${name.toLowerCase()}_gate` })
      variables.add({ name: `Strip ${name} Gate Threshold`, variableId: `strip_${name.toLowerCase()}_gate_threshold` })
      variables.add({ name: `Strip ${name} Gate Damping`, variableId: `strip_${name.toLowerCase()}_gate_damping` })
      variables.add({
        name: `Strip ${name} Gate Band Pass Sidechain`,
        variableId: `strip_${name.toLowerCase()}_gate_bps`,
      })
      variables.add({ name: `Strip ${name} Gate Attack`, variableId: `strip_${name.toLowerCase()}_gate_attack` })
      variables.add({ name: `Strip ${name} Gate Hold`, variableId: `strip_${name.toLowerCase()}_gate_hold` })
      variables.add({ name: `Strip ${name} Gate Release`, variableId: `strip_${name.toLowerCase()}_gate_release` })
      variables.add({ name: `Strip ${name} Denoiser`, variableId: `strip_${name.toLowerCase()}_denoiser` })
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
    }

    variables.add({ name: 'VBAN On/Off', variableId: 'vban_on' })
    for (let i = 0; i < 8; i++) {
      variables.add({ name: `VBAN Instream ${i} On/Off`, variableId: `vban_instream_${i}_on` })
      variables.add({ name: `VBAN Instream ${i} Name`, variableId: `vban_instream_${i}_name` })
      variables.add({ name: `VBAN Instream ${i} IP`, variableId: `vban_instream_${i}_ip` })
      variables.add({ name: `VBAN Instream ${i} Port`, variableId: `vban_instream_${i}_port` })
      variables.add({ name: `VBAN Instream ${i} Sample Rate`, variableId: `vban_instream_${i}_sr` })
      variables.add({ name: `VBAN Instream ${i} Channel`, variableId: `vban_instream_${i}_channel` })
      variables.add({ name: `VBAN Instream ${i} Bit`, variableId: `vban_instream_${i}_bit` })
      variables.add({ name: `VBAN Instream ${i} Quality`, variableId: `vban_instream_${i}_quality` })
      variables.add({ name: `VBAN Instream ${i} Route`, variableId: `vban_instream_${i}_route` })

      variables.add({ name: `VBAN Outstream ${i} On/Off`, variableId: `vban_outstream_${i}_on` })
      variables.add({ name: `VBAN Outstream ${i} Name`, variableId: `vban_outstream_${i}_name` })
      variables.add({ name: `VBAN Outstream ${i} IP`, variableId: `vban_outstream_${i}_ip` })
      variables.add({ name: `VBAN Outstream ${i} Port`, variableId: `vban_outstream_${i}_port` })
      variables.add({ name: `VBAN Outstream ${i} Sample Rate`, variableId: `vban_outstream_${i}_sr` })
      variables.add({ name: `VBAN Outstream ${i} Channel`, variableId: `vban_outstream_${i}_channel` })
      variables.add({ name: `VBAN Outstream ${i} Bit`, variableId: `vban_outstream_${i}_bit` })
      variables.add({ name: `VBAN Outstream ${i} Quality`, variableId: `vban_outstream_${i}_quality` })
      variables.add({ name: `VBAN Outstream ${i} Route`, variableId: `vban_outstream_${i}_route` })
    }

    //this.currentDefinitions = new Set(variables)

    this.instance.setVariableDefinitions([...variables])
  }

  /**
   * @description Update variables
   */
  public readonly updateVariables = async (): Promise<void> => {
    const newVariables: InstanceVariableValue = {}

    newVariables.type = this.instance.type
    newVariables.version = this.instance.version
    newVariables.util_selected_bus =
      this.instance.selectedBus === -1 ? '' : busName[this.instance.type][this.instance.selectedBus]
    newVariables.util_selected_strip = ''
    if (this.instance.selectedStrip !== -1) {
      newVariables.util_selected_strip =
        this.instance.selectedStrip === 8 ? 'Recorder' : this.instance.strip[this.instance.selectedStrip].label
    }

    for (let i = 0; i < maxBus[this.instance.type]; i++) {
      const name = busName[this.instance.type][i]
      newVariables[`bus_${name.toLowerCase()}_mono`] = this.instance.bus[i]?.mono.toString()
      newVariables[`bus_${name.toLowerCase()}_mute`] = this.instance.bus[i]?.mute.toString()
      newVariables[`bus_${name.toLowerCase()}_eq`] = this.instance.bus[i]?.eq.toString()
      newVariables[`bus_${name.toLowerCase()}_eqab`] = this.instance.bus[i]?.eqAB ? 'B' : 'A'
      newVariables[`bus_${name.toLowerCase()}_gain`] = (Math.round(this.instance.bus[i]?.gain * 10) / 10).toFixed(1)
      newVariables[`bus_${name.toLowerCase()}_label`] = this.instance.bus[i]?.label
      newVariables[`bus_${name.toLowerCase()}_mode`] = this.instance.bus[i]?.mode
      newVariables[`bus_${name.toLowerCase()}_select`] = this.instance.bus[i]?.sel.toString()
      newVariables[`bus_${name.toLowerCase()}_return_reverb`] = this.instance.bus[i]?.returnReverb.toString()
      newVariables[`bus_${name.toLowerCase()}_return_delay`] = this.instance.bus[i]?.returnDelay.toString()
      newVariables[`bus_${name.toLowerCase()}_return_fx1`] = this.instance.bus[i]?.returnFx2.toString()
      newVariables[`bus_${name.toLowerCase()}_return_fx2`] = this.instance.bus[i]?.returnFx1.toString()
    }

    for (let i = 0; i < maxStrip[this.instance.type]; i++) {
      newVariables[`strip_${i + 1}_mono`] = this.instance.strip[i]?.mono.toString()
      newVariables[`strip_${i + 1}_mute`] = this.instance.strip[i]?.mute.toString()
      newVariables[`strip_${i + 1}_solo`] = this.instance.strip[i]?.solo.toString()
      newVariables[`strip_${i + 1}_mc`] = this.instance.strip[i]?.mc.toString()
      newVariables[`strip_${i + 1}_gain`] = this.instance.strip[i]?.gain
      for (let j = 0; j < maxBus[this.instance.type]; j++) {
        const name = busName[this.instance.type][j]
        newVariables[`strip_${i + 1}_gain_${name.toLowerCase()}`] = this.instance.strip[i]?.gainLayer[j]
      }

      newVariables[`strip_${i + 1}_pan_x`] = this.instance.strip[i]?.panX
      newVariables[`strip_${i + 1}_pan_y`] = this.instance.strip[i]?.panY
      newVariables[`strip_${i + 1}_color_x`] = this.instance.strip[i]?.colorX
      newVariables[`strip_${i + 1}_colorr_y`] = this.instance.strip[i]?.colorY
      newVariables[`strip_${i + 1}_fx_x`] = this.instance.strip[i]?.fxX
      newVariables[`strip_${i + 1}_fx_y`] = this.instance.strip[i]?.fxY
      newVariables[`strip_${i + 1}_compressor`] = this.instance.strip[i]?.comp
      newVariables[`strip_${i + 1}_compressor_input_gain`] = this.instance.strip[i]?.compGainIn
      newVariables[`strip_${i + 1}_compressor_ratio`] = this.instance.strip[i]?.compRatio
      newVariables[`strip_${i + 1}_compressor_threshold`] = this.instance.strip[i]?.compThreshold
      newVariables[`strip_${i + 1}_compressor_attack`] = this.instance.strip[i]?.compAttack
      newVariables[`strip_${i + 1}_compressor_release`] = this.instance.strip[i]?.compRelease
      newVariables[`strip_${i + 1}_compressor_knee`] = this.instance.strip[i]?.compKnee
      newVariables[`strip_${i + 1}_compressor_output_gain`] = this.instance.strip[i]?.compGainOut
      newVariables[`strip_${i + 1}_compressor_make_up`] = this.instance.strip[i]?.compMakeUp.toString()
      newVariables[`strip_${i + 1}_gate`] = this.instance.strip[i]?.gate
      newVariables[`strip_${i + 1}_gate_threshold`] = this.instance.strip[i]?.gateThreshold
      newVariables[`strip_${i + 1}_gate_damping`] = this.instance.strip[i]?.gateDamping
      newVariables[`strip_${i + 1}_gate_bps`] = this.instance.strip[i]?.gateBPSidechain
      newVariables[`strip_${i + 1}_gate_attack`] = this.instance.strip[i]?.gateAttack
      newVariables[`strip_${i + 1}_gate_hold`] = this.instance.strip[i]?.gateHold
      newVariables[`strip_${i + 1}_gate_release`] = this.instance.strip[i]?.gateRelease
      newVariables[`strip_${i + 1}_denoiser`] = this.instance.strip[i]?.denoiser
      newVariables[`strip_${i + 1}_karaoke`] = this.instance.strip[i]?.karaoke
      newVariables[`strip_${i + 1}_limit`] = this.instance.strip[i]?.limit
      newVariables[`strip_${i + 1}_eq_gain_1`] = this.instance.strip[i]?.eqGain1
      newVariables[`strip_${i + 1}_eq_gain_2`] = this.instance.strip[i]?.eqGain2
      newVariables[`strip_${i + 1}_eq_gain_3`] = this.instance.strip[i]?.eqGain3
      newVariables[`strip_${i + 1}_label`] = this.instance.strip[i]?.label
      newVariables[`strip_${i + 1}_a1`] = this.instance.strip[i]?.A1.toString()
      newVariables[`strip_${i + 1}_a2`] = this.instance.strip[i]?.A2.toString()
      newVariables[`strip_${i + 1}_a3`] = this.instance.strip[i]?.A3.toString()
      newVariables[`strip_${i + 1}_a4`] = this.instance.strip[i]?.A4.toString()
      newVariables[`strip_${i + 1}_a5`] = this.instance.strip[i]?.A5.toString()
      newVariables[`strip_${i + 1}_b1`] = this.instance.strip[i]?.B1.toString()
      newVariables[`strip_${i + 1}_b2`] = this.instance.strip[i]?.B2.toString()
      newVariables[`strip_${i + 1}_b3`] = this.instance.strip[i]?.B3.toString()
      newVariables[`strip_${i + 1}_reverb`] = this.instance.strip[i]?.reverb
      newVariables[`strip_${i + 1}_delay`] = this.instance.strip[i]?.delay
      newVariables[`strip_${i + 1}_fx1`] = this.instance.strip[i]?.fx1
      newVariables[`strip_${i + 1}_fx2`] = this.instance.strip[i]?.fx2
      newVariables[`strip_${i + 1}_post_reverb`] = this.instance.strip[i]?.postReverb.toString()
      newVariables[`strip_${i + 1}_post_delay`] = this.instance.strip[i]?.postDelay.toString()
      newVariables[`strip_${i + 1}_post_fx1`] = this.instance.strip[i]?.postFx1.toString()
      newVariables[`strip_${i + 1}_post_fx2`] = this.instance.strip[i]?.postFx2.toString()
    }

    newVariables[`vban_on`] = this.instance.vban.on
    for (let i = 0; i < 8; i++) {
      if (this.instance.vban.instream[i]) {
        newVariables[`vban_instream_${i}_on`] = this.instance.vban.instream[i].on
        newVariables[`vban_instream_${i}_name`] = this.instance.vban.instream[i].name
        newVariables[`vban_instream_${i}_ip`] = this.instance.vban.instream[i].ip
        newVariables[`vban_instream_${i}_port`] = this.instance.vban.instream[i].port
        newVariables[`vban_instream_${i}_sr`] = this.instance.vban.instream[i].sr
        newVariables[`vban_instream_${i}_channel`] = this.instance.vban.instream[i].channel
        newVariables[`vban_instream_${i}_bit`] = this.instance.vban.instream[i].bit
        newVariables[`vban_instream_${i}_quality`] = this.instance.vban.instream[i].quality
        newVariables[`vban_instream_${i}_route`] = this.instance.vban.instream[i].route
      }
      if (this.instance.vban.outstream[i]) {
        newVariables[`vban_outstream_${i}_on`] = this.instance.vban.outstream[i].on
        newVariables[`vban_outstream_${i}_name`] = this.instance.vban.outstream[i].name
        newVariables[`vban_outstream_${i}_ip`] = this.instance.vban.outstream[i].ip
        newVariables[`vban_outstream_${i}_port`] = this.instance.vban.outstream[i].port
        newVariables[`vban_outstream_${i}_sr`] = this.instance.vban.outstream[i].sr
        newVariables[`vban_outstream_${i}_channel`] = this.instance.vban.outstream[i].channel
        newVariables[`vban_outstream_${i}_bit`] = this.instance.vban.outstream[i].bit
        newVariables[`vban_outstream_${i}_quality`] = this.instance.vban.outstream[i].quality
        newVariables[`vban_outstream_${i}_route`] = this.instance.vban.outstream[i].route
      }
    }

    this.set(newVariables)
    this.updateDefinitions()
  }
}
