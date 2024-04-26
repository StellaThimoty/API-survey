import { Request, Response } from 'express'
import Departure from '../../models/departure.entity'
import Arrival from '../../models/arrival.entity'
import User from '../../models/user.entity'
import Machine from '../../models/machine.entity'
import { IsNull, Not } from 'typeorm'

export default class DepartureController {
    static async store(req: Request, res: Response){
        const { machineId } = req.params
        const { address, client, date_departure } = req.body
        const { userId } = req.headers

        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

        //conferir se a maquina existe ou se o id fornecido esta correto
        if (!machineId || isNaN(Number(machineId))) return res.status(400).json({error: 'Defina o id de máquina válido'})
        const machine = await Machine.find({where: {id: Number(machineId)}})
        if (!machine) return res.status(400).json({error: 'Defina o id de uma máquina existente'})

        //validacao de categoria de usuario para permissao de acesso
        const user = await User.findOneBy({id: Number(userId)})
        if (user?.category == "Consultor"){
          return res.status(403).json({erro: 'Você não possui permissão de acesso'})
        }          

        if (!address || !client || !date_departure){
            return res.status(400).json({erro: 'Todas as informações são obrigatórias!'})
        }

        const departure = new Departure()
        departure.address = address
        departure.client = client
        departure.date_departure = date_departure
        departure.userId = Number(userId)
        departure.machineId = Number(machineId)

        await departure.save()

        return res.status(201).json(departure)
    }

    static async index(req: Request, res: Response){
        const { userId } = req.headers
        const { machineId } = req.params

        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

        //validacao de categoria de usuario para permissao de acesso
        const user = await User.findOneBy({id: Number(userId)})
        if (user?.category == "Consultor"){
          return res.status(403).json({erro: 'Você não possui permissão de acesso'})
        }

        //conferir se a maquina existe ou se o id fornecido esta correto
        if (!machineId || isNaN(Number(machineId))) return res.status(400).json({error: 'Defina o id de máquina válido'})
        const machine = await Machine.find({where: {id: Number(machineId)}})
        if (!machine) return res.status(400).json({error: 'Defina o id de uma máquina existente'})

        const departure = await Departure.find({where: { machineId: Number(machineId) }})

        return res.status(200).json(departure)
    }

    static async show (req: Request, res: Response){
        const { userId } = req.headers

        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })
        
        //validacao de categoria de usuario para permissao de acesso
        const user = await User.findOneBy({id: Number(userId)})
        if (user?.category == "Consultor"){
          return res.status(403).json({erro: 'Você não possui permissão de acesso'})
        }        

        const departure = await Departure.find({where: { address: Not("null") }}) 
        if (!departure) 
	        return res.status(404)

        return res.json(departure)    
    }

    static async delete (req: Request, res: Response) {
        const { id } = req.params
        const { userId } = req.headers
    
        if(!id || isNaN(Number(id))) {
          return res.status(400).json({ error: 'O id da saída é obrigatório' })
        }
    
        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })
          
        //validacao de categoria de usuario para permissao de acesso
        const user = await User.findOneBy({id: Number(userId)})
        if (user?.category == "Consultor"){
          return res.status(403).json({erro: 'Você não possui permissão de acesso'})
        }

        const departure = await Departure.findOneBy({id: Number(id)})
        if (!departure) {
          return res.status(404).json({ error: 'Sáida não encontrada' })
        }

        //a saida só pode ser alterada/excluida caso n tenha chego ainda
        const arrival = await Arrival.findOneBy({departureId: Number(id)})
        if (arrival) {
          return res.status(404).json({ error: 'Esta saída possui chegada e não pode ser excluída ou alterada' })
        }

        await departure.remove()
        return res.status(204).json()
      }

      static async update (req: Request, res: Response) {
        const { id } = req.params
        const { address, client, date_departure } = req.body
        const { userId } = req.headers
    
        if(!id || isNaN(Number(id))) {
          return res.status(400).json({ error: 'O id é obrigatório' })
        }
    
        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

        //validacao de categoria de usuario para permissao de acesso
        const user = await User.findOneBy({id: Number(userId)})
        if (user?.category == "Consultor"){
          return res.status(403).json({erro: 'Você não possui permissão de acesso'})
        }          
    
        const departure = await Departure.findOneBy({id: Number(id)})
        if (!departure) {
          return res.status(404).json({ error: 'Sáida não encontrada' })
        }

        //a saida só pode ser alterada/excluida caso n tenha chego ainda
        const arrival = await Arrival.findOneBy({departureId: Number(id)})
        if (arrival) {
          return res.status(404).json({ error: 'Esta saída possui chegada e não pode ser excluída ou alterada' })
        }

        departure.address = address ?? departure.address
        departure.client = client ?? departure.client
        departure.date_departure = date_departure ?? departure.date_departure

        await departure.save()
    
        return res.json(departure)
      }
}