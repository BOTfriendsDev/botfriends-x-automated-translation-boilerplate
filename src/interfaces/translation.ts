import { Output } from 'botfriends-x-sdk/src/interfaces/Output'

interface BotfriendsBaseTranslationDto {
  recipient: string
  channel: string
  projectLanguages: string[]
  defaultLanguage: string
  originalLanguage: string
  languageCode: string
}

export type IncomingTranslationMessageType = 'text' | 'file' | 'event'

export interface IncomingTranslationMessage {
  type: IncomingTranslationMessageType
  input: string
}

export interface IncomingTranslationDto extends BotfriendsBaseTranslationDto {
  message: IncomingTranslationMessage
}

export interface OutgoingTranslationDto extends BotfriendsBaseTranslationDto {
  outputs: Output[]
}
