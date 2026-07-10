import type VoicemeeterInstance from '../index.js'
import { type CompanionVariableDefinitions } from '@companion-module/base'
import { type BusVariablesSchema, busDefinitions, busValues } from './busVariables.js'
import { type StripVariablesSchema, stripDefinitions, stripValues } from './stripVariables.js'
import { type UtilVariablesSchema, utilDefinitions, utilValues } from './utilVariables.js'

export interface InstanceVariableValue {
  [key: string]: string | number | undefined
}

export type VariablesSchema = BusVariablesSchema & StripVariablesSchema & UtilVariablesSchema

export class Variables {
  private readonly instance: VoicemeeterInstance
  public currentDefinitions: CompanionVariableDefinitions = {}
  public currentVariables: Partial<VariablesSchema> = {}
  public definitionsUpdateDebounce: ReturnType<typeof setTimeout> | null = null
  public definitionsUpdateNeeded = false

  constructor(instance: VoicemeeterInstance) {
    this.instance = instance
  }

  /**
   * @param variables Object of variable names and their values
   * @description Updates or removes variable for current instance
   */
  public readonly set = (variables: Partial<VariablesSchema>): void => {
    this.currentVariables = variables
    this.instance.setVariableValues(variables)
  }

  /**
   * @description Sets variable definitions
   */
  public readonly updateDefinitions = async (): Promise<void> => {
    if (this.definitionsUpdateDebounce !== null) {
      this.definitionsUpdateNeeded = true
      return
    }

    this.definitionsUpdateDebounce = setTimeout(() => {
      this.definitionsUpdateDebounce = null
      if (this.definitionsUpdateNeeded) {
        this.definitionsUpdateNeeded = false
        this.updateDefinitions()
      }
    }, 100)

    const variableDefinitions: CompanionVariableDefinitions<VariablesSchema> = {
      ...busDefinitions(this.instance),
      ...stripDefinitions(this.instance),
      ...utilDefinitions(this.instance),
    }

    if (JSON.stringify(this.currentDefinitions) !== JSON.stringify(variableDefinitions)) this.instance.setVariableDefinitions(variableDefinitions)
    this.currentDefinitions = variableDefinitions
  }

  public readonly updateVariables = async (): Promise<void> => {
    let newVariables: Partial<VariablesSchema> = {}
    const variablesPromise = await Promise.all([busValues(this.instance), stripValues(this.instance), utilValues(this.instance)])

    variablesPromise.forEach((variables: Partial<VariablesSchema>) => {
      newVariables = { ...newVariables, ...variables }
    })

    this.set(newVariables)
    this.updateDefinitions()
  }
}
