import { ObjectId } from "mongodb";
import client  from '../common/db.js';
import { Actor } from "./actor.js";
import { peliculaCollection } from "../pelicula/controller.js";

const actorCollection = client.db('cine-db').collection('actor')

async function handleInsertActorRequest(req, res) {
    let data = req.body

    let peliculaId;
    try {
        peliculaId = ObjectId.createFromHexString(data.idPelicula);
    } catch (error) {
        return res.status(400).send('ID de película mal formado');
    }

    const pelicula = await peliculaCollection.findOne({ _id: peliculaId });

    if (!pelicula) {
        return res.status(400).send('La película no existe');
    }
    
    let actor = {
        _id: new ObjectId(), 
        nombre: data.nombre,
        edad: data.edad,
        estaRetirado: data.estaRetirado,
        premios: data.premios,
        idPelicula: pelicula._id.toString()
    };
    
    await actorCollection.insertOne(actor)
    .then((data) => {
        if(data == null) return res.status(400).send('Error al guardar registro')
        
        return res.status(201).send(data)

        })
    .catch((e) => { return res.status(500).send({ error: e}) })
    
}

async function handleGetActoresRequest(req, res) {
    await actorCollection.find({}).toArray()
    .then((data) => {return res.status(200).send(data) })
    .catch((e) => { return res.status(500).send({error :e }) })
    
}

async function handleGetActorByIdRequest(req, res) {
    let id = req.params.id

    try{
        let oid = ObjectId.createFromHexString(id)

        await actorCollection.findOne({ _id: oid })
        .then((data) => {
            if(data == null) return res.status(404),sedn(data)

            return res.status(200).send(data)
        })
        .catch ((e) => {
            return res.status(500).send({ error: e.code })
        })
    }catch(e){
        return res.status(400).send('Id mal formado')
    }
    
}

async function handleUpdateActorByIdRequest(req, res) {
    let id = req.params.id
    let actor = req.body

    try{
        let oid = ObjectId.createFromHexString(id)

        let query = { $set: actor }

        await actorCollection.updateOne({ _id: oid }, query)
        .then((data) => { return res.status(200).send(data) })
        .catch((e) => { return res.status(500).send({code: e.code}) })
    }catch(e){
        return res.status(400).send('Id mal formado')
    }
    
}

async function handleDeleteActorByIdRequest(req, res) {
    let id = req.params.id

    try{
        let oid = ObjectId.createFromHexString(id)

        await actorCollection.deleteOne({ _id: oid })
        .then ((data) => { return res.status(200).send(data)})
        .catch((e) => { return res.status(500).send( {code: e.code}) })
    }catch(e) {
        return res.status(400).send('Id mal formado')
    }
    
}

export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleUpdateActorByIdRequest,
    handleDeleteActorByIdRequest
}