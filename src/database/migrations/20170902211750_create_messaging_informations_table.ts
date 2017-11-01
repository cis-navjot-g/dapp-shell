import * as Knex from 'knex';


exports.up = (db: Knex): Promise<any> => {
    return Promise.all([
        db.schema.createTable('messaging_informations', (table: Knex.CreateTableBuilder) => {
            table.increments('id').primary();

            table.string('protocol').notNullable();
            table.text('public_key').notNullable();

            table.integer('listing_item_id').unsigned().nullable();
            table.foreign('listing_item_id').references('id')
                .inTable('listing_items').onDelete('cascade');

            table.timestamp('updated_at').defaultTo(db.fn.now());
            table.timestamp('created_at').defaultTo(db.fn.now());
        })
    ]);
};

exports.down = (db: Knex): Promise<any> => {
    return Promise.all([
        db.schema.dropTable('messaging_informations')
    ]);
};