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

  public async formStore({ request, response }: HttpContextContract) {
    const only_phone = request.only(['only_phone'])
    if (only_phone.only_phone) {
      const visitor = await Visitor.findBy('phone', only_phone.only_phone)
      if (!visitor) {
        return response.status(404).json("Visitor not found")
      }
      const eventId = request.only(['event_id'])
      const presence = await Presence.create({
        visitorId: visitor.id,
        eventId: eventId.event_id,
      })
      AdonisEvent.emit('new:presence', presence)
      return response.json(presence)
    }

    const visitorData = request.only(['uuid', 'name', 'email', 'phone', 'date_of_birth', 'institution', 'user_agent'])

    let visitor = await Visitor.findBy('phone', visitorData.phone)
    if (!visitor) {
      visitorData.date_of_birth = new Date(visitorData.date_of_birth)
      visitor = await Visitor.create(visitorData)
    }

    const event = request.only(['event_id'])
    const presence = await Presence.create({
      visitorId: visitor.id,
      eventId: event.event_id,
    })

    AdonisEvent.emit('new:presence', presence)
    return response.json(presence)
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
