import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('point', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('uf',2).notNullable();
    });
}

//A função down() desfaz o que a função up() fez.
//Example: Se up() cria uma tabela, então down() deve remove-la.
export async function down(knex: Knex) {
    return knex.schema.dropTable('point');
}
