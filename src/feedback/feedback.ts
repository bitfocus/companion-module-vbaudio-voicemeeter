import type { CompanionFeedbackDefinitions, StringKeys } from '@companion-module/base'
import type VoicemeeterInstance from '../index.js'
import { type BusFeedbacksSchema, getBusFeedbacks } from './busFeedbacks.js'
import { type StripFeedbacksSchema, getStripFeedbacks } from './stripFeedbacks.js'
import { type UtilFeedbacksSchema, getUtilFeedbacks } from './utilFeedbacks.js'

export type FeedbacksSchema = BusFeedbacksSchema & StripFeedbacksSchema & UtilFeedbacksSchema

export type FeedbackId = StringKeys<FeedbacksSchema>

export function getFeedbacks(instance: VoicemeeterInstance): CompanionFeedbackDefinitions<FeedbacksSchema> {
  return {
    ...getBusFeedbacks(instance),
    ...getStripFeedbacks(instance),
    ...getUtilFeedbacks(instance),
  }
}
