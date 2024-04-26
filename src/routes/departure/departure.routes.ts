import { Router } from 'express'
import DepartureController from '../../controllers/departure/departure.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const departureRoutes = Router()

departureRoutes.post('/:machineId', authMiddleware, DepartureController.store)
departureRoutes.get('/:machineId', authMiddleware, DepartureController.index)
departureRoutes.get('/', authMiddleware, DepartureController.show)
departureRoutes.delete('/:id', authMiddleware, DepartureController.delete)
departureRoutes.put('/:id', authMiddleware, DepartureController.update)

export default departureRoutes