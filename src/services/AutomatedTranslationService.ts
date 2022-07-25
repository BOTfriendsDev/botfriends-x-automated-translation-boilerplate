import { OutgoingTranslationDto, IncomingTranslationDto } from '../interfaces/translation'
import MockTranslationService from './MockTranslationService'

class AutomatedTranslationService {

  private static translationLanguage: string = 'en'

  /**
   * Processes an incoming translation dto, which contains the following properties
   * @param {string} incomingTranslationDto.recipient - Unique Id for recipient
   * @param {string} incomingTranslationDto.channel - Channel from which the message is coming
   * @param {string} incomingTranslationDto.projectLanguages - Languages for which NLU integration is available
   * @param {string} incomingTranslationDto.defaultLanguage - The default language of the project
   * @param {string} incomingTranslationDto.languageCode - Language with which the intent detection should be performed
   * @param {string} incomingTranslationDto.originalLanguage - Default language or language by the channel if the language detection in botfriends x is not enabled. Otherwise, the detected language by Google Language Detection.
   * @param {object} incomingTranslationDto.message - Message object includes type and input
   * @param {string} incomingTranslationDto.message.type - 'text' | 'file' | 'event'
   * @param {string} incomingTranslationDto.message.input - Depending on the type a link or text
   * @returns Updated IncomingTranslationDto
  */
  public static async handleIncomingTranslation (incomingTranslationDto: IncomingTranslationDto): Promise<IncomingTranslationDto> {
    const { message: { input }, languageCode, originalLanguage, projectLanguages } = incomingTranslationDto
    const detectedLanguage = MockTranslationService.detectLanguage(input, originalLanguage)
    const translationRequired = languageCode !== detectedLanguage && !projectLanguages.includes(languageCode)
    if (translationRequired) {
      const { translation } = MockTranslationService.translateText(input, this.translationLanguage)
      // Override originalLanguage so it can be used for the ougoing translation
      incomingTranslationDto.originalLanguage = detectedLanguage
      // Overwrite languageCode with the language to be used for intent detection
      incomingTranslationDto.languageCode = this.translationLanguage
      // Overwrite message.input with the translated user input to be used for intent detection
      incomingTranslationDto.message.input = translation
    }
    return incomingTranslationDto
  }

  /**
   * Processes an outgoing translation dto, which contains the following properties
   * @param {string} outgoingTranslationDto.recipient - Unique Id for recipient
   * @param {string} outgoingTranslationDto.channel - Channel from which the message is coming
   * @param {string} outgoingTranslationDto.projectLanguages - Languages for which NLU integration is available
   * @param {string} outgoingTranslationDto.defaultLanguage - The default language of the project
   * @param {string} outgoingTranslationDto.languageCode - Language with which the intent detection was performed
   * @param {string} outgoingTranslationDto.originalLanguage - Language code into which language should be translated (was set by incoming translation)
   * @param {object} outgoingTranslationDto.outputs - Output[] of bot responses
   * @returns Updated OutgoingTranslationDto
  */
  public static async handleOutgoingTranslation (outgoingTranslationDto: OutgoingTranslationDto): Promise<OutgoingTranslationDto> {
    const { outputs, languageCode, originalLanguage } = outgoingTranslationDto
    const translationRequired = languageCode !== originalLanguage
    if (translationRequired) {
      const translatedOutputs = await MockTranslationService.translateOutputs(outputs, originalLanguage)
      // Override outputs with the translated outputs which will be sent to the user
      outgoingTranslationDto.outputs = translatedOutputs
    }
    return outgoingTranslationDto
  }
}

export default AutomatedTranslationService
