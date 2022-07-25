import { Router } from 'express'
import AutomatedTranslationController from './controllers/AutomatedTranslationController'

export default () => {
  const router: Router = Router()
  router.post('/incoming-translation', AutomatedTranslationController.handleIncomingTranslation)
  router.post('/outgoing-translation', AutomatedTranslationController.handleOutgoingTranslation)
  return router
}