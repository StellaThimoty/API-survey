import { Router } from 'express'
import ArrivalController from '../../controllers/arrival/arrival.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const arrivalRoutes = Router()

arrivalRoutes.post('/:departureId', authMiddleware, ArrivalController.store)
arrivalRoutes.get('/:departureId', authMiddleware, ArrivalController.show)
arrivalRoutes.delete('/:id', authMiddleware, ArrivalController.delete)
arrivalRoutes.put('/:id', authMiddleware, ArrivalController.update)

export default arrivalRoutes