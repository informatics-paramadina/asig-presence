import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'visitors'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('uuid', 255).notNullable().unique()
      table.string('name', 255).notNullable()
      table.string('email', 255).notNullable()
      table.string('phone', 255).notNullable()
      table.date('date_of_birth').notNullable()
      table.string('institution', 255).notNullable()
      table.text('user_agent').nullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
