import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { default as AdonisEvent } from '@ioc:Adonis/Core/Event'
import Presence from 'App/Models/Presence'
import Visitor from 'App/Models/Visitor'
import Event from 'App/Models/Event'

export default class PresencesController {
  public async index({ response }: HttpContextContract) {
    const presences = await Presence.all()
    return response.json(presences)
  }

  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['visitor_id', 'event_id', 'status'])
    if (data.visitor_id === undefined || data.event_id === undefined) {
      return response.status(400).json({ message: 'Missing visitor_id or event_id' })
    }
    let visitor = await Visitor.findBy('uuid', data.visitor_id)
    let event = await Event.findBy('uuid', data.event_id)

    if (visitor === null || event === null) {
      return response.status(404).json({ message: 'Visitor or event not found' })
    }

    data.event_id = event?.id
    data.visitor_id = visitor?.id
    const presence = await Presence.create(data)
    AdonisEvent.emit('new:presence', presence)
    return response.json(presence)
  }

  public async show({ params, response }: HttpContextContract) {
    const presence = await Presence.find(params.id)
    if (presence) {
      return response.json(presence)
    }
    return response.status(404).json({ message: 'Presence not found' })
  }

  // public async update({ params, request, response }: HttpContextContract) {
  //   const presence = await Presence.find(params.id)
  //   if (presence) {
  //     const data = request.only(['visitor_id', 'event_id'])
  //     presence.merge(data)
  //     await presence.save()
  //     return response.json(presence)
  //   }
  //   return response.status(404).json({ message: 'Presence not found' })
  // }

  public async destroy({ params, response }: HttpContextContract) {
    const presence = await Presence.find(params.id)
    if (presence) {
      await presence.delete()
      return response.json({ message: 'Presence deleted' })
    }
    return response.status(404).json({ message: 'Presence not found' })
  }

}
