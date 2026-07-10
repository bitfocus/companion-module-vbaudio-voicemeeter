import type { CompanionVariableDefinitions, JsonValue } from '@companion-module/base'
import type VoicemeeterInstance from '../index.js'
import { busName } from '../utils.js'

export type BusVariablesSchema = {
	bus_names: JsonValue
	bus_labels: JsonValue
  [key: `bus_${string}`]: JsonValue
  [key: `bus_${string}_mono`]: boolean
  [key: `bus_${string}_mute`]: boolean
  [key: `bus_${string}_eq`]: boolean
  [key: `bus_${string}_eqab`]: string
  [key: `bus_${string}_fader`]: number
  [key: `bus_${string}_gain`]: number
  [key: `bus_${string}_label`]: string
  [key: `bus_${string}_l1`]: number
  [key: `bus_${string}_l2`]: number
  [key: `bus_${string}_mode`]: string
  [key: `bus_${string}_select`]: boolean
}

export const busDefinitions = (_instance: VoicemeeterInstance): CompanionVariableDefinitions<BusVariablesSchema> => {
  const definitions: CompanionVariableDefinitions<BusVariablesSchema> = {
		bus_names: { name: `Bus name list` },
		bus_labels: { name: `Bus labels list` },
	}

  for (let i = 0; i < 8; i++) {
    const name = busName[i]
    definitions[`bus_${name.toLowerCase()}`] = { name: `Bus ${name}` }
    definitions[`bus_${name.toLowerCase()}_mono`] = { name: `Bus ${name} Mono` }
    definitions[`bus_${name.toLowerCase()}_mute`] = { name: `Bus ${name} Mute` }
    definitions[`bus_${name.toLowerCase()}_eq`] = { name: `Bus ${name} EQ` }
    definitions[`bus_${name.toLowerCase()}_eqab`] = { name: `Bus ${name} EQ AB` }
    definitions[`bus_${name.toLowerCase()}_fader`] = { name: `Bus ${name} Fader position` }
    definitions[`bus_${name.toLowerCase()}_gain`] = { name: `Bus ${name} Gain` }
    definitions[`bus_${name.toLowerCase()}_label`] = { name: `Bus ${name} Label` }
    definitions[`bus_${name.toLowerCase()}_l1`] = { name: `Bus ${name} Level 1` }
    definitions[`bus_${name.toLowerCase()}_l2`] = { name: `Bus ${name} Level 2` }
    definitions[`bus_${name.toLowerCase()}_mode`] = { name: `Bus ${name} Mode` }
    definitions[`bus_${name.toLowerCase()}_select`] = { name: `Bus ${name} Select` }
  }

  return definitions
}

export const busValues = async (instance: VoicemeeterInstance): Promise<BusVariablesSchema> => {
  const variables: BusVariablesSchema = {
		bus_names: busName,
		bus_labels: instance.data.busLabelUTF8c60
	}

  for (let i = 0; i < 8; i++) {
    const name = busName[i]
    variables[`bus_${name.toLowerCase()}`] = instance.data.busState[i]
    variables[`bus_${name.toLowerCase()}_mono`] = instance.data.busState[i].mono
    variables[`bus_${name.toLowerCase()}_mute`] = instance.data.busState[i].mute
    variables[`bus_${name.toLowerCase()}_eq`] = instance.data.busState[i].eq
    variables[`bus_${name.toLowerCase()}_eqab`] = instance.data.busState[i].eqB ? 'B' : 'A'
    variables[`bus_${name.toLowerCase()}_fader`] = Math.round(Math.pow((instance.data.busGaindB100[i] + 60) / 72, 1) * 100)
    variables[`bus_${name.toLowerCase()}_gain`] = Math.round(instance.data.busGaindB100[i] * 10) / 10
    variables[`bus_${name.toLowerCase()}_label`] = instance.data.busLabelUTF8c60[i]
    variables[`bus_${name.toLowerCase()}_l1`] = instance.data.outputLeveldB100[i][0]
    variables[`bus_${name.toLowerCase()}_l2`] = instance.data.outputLeveldB100[i][1]
    variables[`bus_${name.toLowerCase()}_mode`] = instance.data.busState[i].mode
    variables[`bus_${name.toLowerCase()}_select`] = instance.data.busState[i].sel
  }

  return variables
}
