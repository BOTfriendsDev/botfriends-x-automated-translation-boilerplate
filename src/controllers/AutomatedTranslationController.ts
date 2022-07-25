import { Request, Response } from 'express'
import { IncomingTranslationDto, OutgoingTranslationDto } from '../interfaces/translation'
import AutomatedTranslationService from '../services/AutomatedTranslationService'

class AutomatedTranslationController {

  public static async handleIncomingTranslation (req: Request, res: Response): Promise<Response> {
    const incomingTranslationDto: IncomingTranslationDto = req.body
    const updatedIncoingTranslationDto = await AutomatedTranslationService.handleIncomingTranslation(incomingTranslationDto)
    return res.status(200).json(updatedIncoingTranslationDto)
  }

  public static async handleOutgoingTranslation (req: Request, res: Response): Promise<Response> {
    const outgoingTranslationDto: OutgoingTranslationDto = req.body
    const updatedOutgoingTranslationDto = await AutomatedTranslationService.handleOutgoingTranslation(outgoingTranslationDto)
    return res.status(200).json(updatedOutgoingTranslationDto)
  }
}

export default AutomatedTranslationController
