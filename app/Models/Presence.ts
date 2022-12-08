import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import {v4} from 'uuid'
import Event from './Event'
import Visitor from './Visitor'

export default class Presence extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public visitorId: number

  @column()
  public eventId: number

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (presence: Presence) {
    presence.uuid = v4()
  }

  @belongsTo(() => Event)
  public event: BelongsTo<typeof Event>

  @belongsTo(() => Visitor)
  public visitor: BelongsTo<typeof Visitor>
}
