import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'watchlist_movies'
  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('watchlist_id').unsigned().references('watchlists.id').notNullable()
      table.integer('movie_id').unsigned().references('movies.id').notNullable()
      table.boolean('watched').notNullable().defaultTo(false)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['watchlist_id', 'movie_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
