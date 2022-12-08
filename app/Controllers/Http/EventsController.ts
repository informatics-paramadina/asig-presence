import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { default as AdonisEvent } from '@ioc:Adonis/Core/Event'
import Event from 'App/Models/Event'
import QRCode from 'qrcode'

export default class EventsController {
  public async index({ response }: HttpContextContract) {
    const events = await Event.all()
    return response.json(events)
  }

  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['uuid', 'name', 'place'])
    const event = await Event.create(data)
    return response.json(event)
  }

  public async show({ params, response }: HttpContextContract) {
    const event = await Event.findBy('uuid', params.id)
    if (event) {
      return response.json(event)
    }
    return response.status(404).json({ message: 'Event not found' })
  }

  public async update({ params, request, response }: HttpContextContract) {
    const event = await Event.find(params.id)
    if (event) {
      const data = request.only(['uuid', 'name', 'place'])
      event.merge(data)
      await event.save()
      return response.json(event)
    }
    return response.status(404).json({ message: 'Event not found' })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const event = await Event.find(params.id)
    if (event) {
      await event.delete()
      return response.json({ message: 'Event deleted' })
    }
    return response.status(404).json({ message: 'Event not found' })
  }

  public async presences({ params, response }: HttpContextContract) {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    };
    let event = await Event.query().preload('presences', (presenceQuery) => {
      presenceQuery.preload('visitor')
    }).where('uuid', params.id).first()
    if (!event) {
      return response.status(404).json({ message: 'Event not found' })
    }

    response.response.writeHead(200, headers)
    response.response.write('data: ' + JSON.stringify(event) + '\n\n')

    AdonisEvent.on('new:presence', async () => {
      let event = await Event.query().preload('presences', (presenceQuery) => {
        presenceQuery.preload('visitor')
      }).where('uuid', params.id).first()
      response.response.write('data: ' + JSON.stringify(event) + '\n\n')
    })

  }

  public async generateQrCode({ params, response }: HttpContextContract) {
    let event = await Event.findBy('uuid', params.id)

    let data = {
      uuid: event?.uuid,
      type: params.status
    }
    if (event) {
      let qrCode = await QRCode.toDataURL(JSON.stringify(data), { type: 'image/png', width: 500 })
      return response.json({
        qrCode: qrCode
      })
    }
    return response.status(404).json({ message: 'Event not found' })
  }

}
