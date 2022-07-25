import { Output, TextMessage } from 'botfriends-x-sdk/src/interfaces/Output'

class MockTranslationService {

  private static languageDetectionDictonary: { [key: string]: string } = {
    hola: 'es',
    hallo: 'de',
    hello: 'en'
  }
  private static englishTranslationDictonary: { [key: string]: string } = {
    hola: 'hello',
    hallo: 'hello'
  }
  private static spanishTranslationDictonary: { [key: string]: string } = {
    hello: 'hola',
    hallo: 'hola'
  }

  /**
    A prototypical implementation of a language detection system. 
    * @param text String for which the language is to be detected
    * @param defaultLanguage Default language to be returned if no language was detected 
    * @returns Detected Language
  */
  public static detectLanguage (text: string, defaultLanguage: string) : string {
    const lowerCasedInput = text.toLowerCase()
    return this.languageDetectionDictonary[lowerCasedInput] ?? defaultLanguage
  }

  /**
    A prototypical implementation of a translation service.
    * @param text Text to translate
    * @param languageCode Language Code into which which language should be translated
    * @returns Translated user input
  */
  public static translateText (text: string | undefined, languageCode: string) : { translation: string, languageCode: string } {
    if (!text) {
      return {
        translation: '',
        languageCode
      }
    }
    const lowerCasedInput = text.toLowerCase()
    switch (languageCode) {
      case 'en' : {
        return {
          translation: this.englishTranslationDictonary[lowerCasedInput] ?? text,
          languageCode
        }
      }
      case 'es' : {
        return {
          translation: this.spanishTranslationDictonary[lowerCasedInput] ?? text,
          languageCode
        }
      }
      default: {
        return {
          translation: text,
          languageCode
        }
      }
    }
  }
  
  /**
   * A prototypical implementation of response translation (currently only for text responses!).
   * @param outputs Responses which will be sent by bot
   * @param languageCode Language into which the outputs are to be translated
  */
  public static translateOutputs (outputs: Output[], languageCode: string): Output [] {
    const translatedOutputs: Output [] = []
    for (const output of outputs) {
      const { type, message } = output
      switch (type) {
        case 'text':
          const translatedOutput = this.translateTextMessage(message as TextMessage, languageCode)
          translatedOutputs.push(translatedOutput)
          break
        default:
          translatedOutputs.push(output)
      }
    }
    return translatedOutputs
  }

  /**
   A prototypical implementation of text response translation
   * @param message TextMessage
   * @param originalLanguage Language into which the text message is to be translated
  */
  private static translateTextMessage (message: TextMessage, languageCode: string) : Output {
    const { text } = message
    const { translation } = this.translateText(text, languageCode)
    return {
      type: 'text',
      message: {
        text: translation
      }
    }
  }
}

export default MockTranslationService
