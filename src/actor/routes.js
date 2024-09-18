import express from 'express'
import controller from './controller.js'

const actorRoutes = express.Router()

actorRoutes.post('/actor', controller.handleInsertActorRequest)

actorRoutes.get('/actores', controller.handleGetActoresRequest)
actorRoutes.get('/actor/:id', controller.handleGetActorByIdRequest)

actorRoutes.put('/actor/:id', controller.handleUpdateActorByIdRequest)

actorRoutes.delete('/actor/:id', controller.handleDeleteActorByIdRequest)


export default actorRoutes