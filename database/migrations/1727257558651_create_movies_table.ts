import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('title', 250).notNullable()
      table.timestamp('release_date').nullable()
      table.string('realisator', 100).notNullable()
      table.text('summary').notNullable()
      table.integer('rating').notNullable()
      table.string('image').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
