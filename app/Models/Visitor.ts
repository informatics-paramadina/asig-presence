import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 } from 'uuid'

export default class Visitor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public phone: string

  @column()
  public dateOfBirth: Date

  @column()
  public institution: string

  @column()
  public userAgent: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (visitor: Visitor) {
    visitor.uuid = v4()
  }
}
