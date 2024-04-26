import Arrival from '../../models/arrival.entity'
import Document from '../../models/machine.entity'
import Report from '../../models/report.entity'
import { Request, Response } from 'express'
import User from '../../models/user.entity'

export default class ReportController {
    static async store(req: Request, res: Response){
        const { departureId } = req.params
        const { sensorId } = req.body
        const { userId } = req.headers

        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

        //validacao de categoria de usuario para permissao de acesso
        const user = await User.findOneBy({id: Number(userId)})
        if (user?.category == "Consultor" || user?.category == "Registrador"){
          return res.status(403).json({erro: 'Você não possui permissão de acesso'})
        }
          
        const arrival = await Arrival.findOneBy({departureId: Number(departureId)})
        if (!departureId || !arrival){
            return res.status(400).json({erro: 'O relatório deve possuir uma saída e uam chegada!'})
        }

        const report = new Report()
        report.departureId = Number(departureId)
        report.sensorId = sensorId

        await report.save()

        return res.status(201).json(report)
    }

    /*static async index(req: Request, res: Response){
        const { userId } = req.headers
        const { id } = req.params

        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })
        
        //validacao de categoria de usuario para permissao de acesso
        const user = await User.findOneBy({id: Number(userId)})
        if (user?.category == "Registrador"){
          return res.status(403).json({erro: 'Você não possui permissão de acesso'})
        }

        const report = await Report.find({where: { id: Number(id) }})

        return res.status(200).json(report)
    }*/

    static async show (req: Request, res: Response){
        const { id } = req.params 
        const { userId } = req.headers

        if (!id || isNaN(Number(id))) 
	        return res.status(400).json({erro: 'O id do relatório é obrigatório'})

        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

        //validacao de categoria de usuario para permissao de acesso
        const user = await User.findOneBy({id: Number(userId)})
        if (user?.category == "Registrador"){
          return res.status(403).json({erro: 'Você não possui permissão de acesso'})
        }
        
        const report = await Report.findOneBy({id: Number(id)})
        
        if (!report) 
	        return res.status(404)

        return res.json(report)    
    }

    static async delete (req: Request, res: Response) {
        const { id } = req.params
        const { userId } = req.headers
    
        if(!id || isNaN(Number(id))) {
          return res.status(400).json({ error: 'O id do relatório é obrigatório' })
        }
    
        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })
    
        //validacao de categoria de usuario para permissao de acesso
        const user = await User.findOneBy({id: Number(userId)})
        if (user?.category == "Consultor" || user?.category == "Registrador"){
          return res.status(403).json({erro: 'Você não possui permissão de acesso'})
        }

        const report = await Report.findOneBy({id: Number(id)})
        if (!report) {
          return res.status(404).json({ error: 'Relatório não encontrado' })
        }
    
        await report.remove()
        return res.status(204).json()
      }

}