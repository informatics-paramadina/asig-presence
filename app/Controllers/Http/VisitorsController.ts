import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Visitor from 'App/Models/Visitor'

export default class VisitorsController {

  public async index({ response }: HttpContextContract) {
    const visitors = await Visitor.all()
    return response.json(visitors)
  }

  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['uuid', 'name', 'email', 'phone', 'date_of_birth', 'institution', 'user_agent'])
    // check if visitor already exists
    let visitor = await Visitor.findBy('email', data.email)
    if (visitor) {
      return response.json(visitor)
    }

    data.date_of_birth = new Date(data.date_of_birth)

    visitor = await Visitor.create(data)
    return response.json({
      uuid: visitor.uuid,
      // name: visitor.name,
      // email: visitor.email,
      // phone: visitor.phone,
      // date_of_birth: visitor.dateOfBirth,
      // institution: visitor.institution,
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const visitor = await Visitor.findBy('uuid', params.id)
    if (visitor) {
      return response.json(visitor)
    }
    return response.status(404).json({ message: 'Visitor not found' })
  }

  public async update({ params, request, response }: HttpContextContract) {
    const visitor = await Visitor.findBy('uuid', params.id)
    if (visitor) {
      const data = request.only(['uuid', 'name', 'email', 'phone', 'date_of_birth', 'institution'])
      visitor.merge(data)
      await visitor.save()
      return response.json(visitor)
    }
    return response.status(404).json({ message: 'Visitor not found' })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const visitor = await Visitor.findBy('uuid', params.id)
    if (visitor) {
      await visitor.delete()
      return response.json({ message: 'Visitor deleted' })
    }
    return response.status(404).json({ message: 'Visitor not found' })
  }
}
