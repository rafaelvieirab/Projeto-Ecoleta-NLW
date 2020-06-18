import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction(); 
        /* trx => 
            Só permite que os dados sejam salvas no banco de dados
            se as duas inserções forem validas.
        */
        
        const point = {
            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };
        const insertedIds = await trx('point').insert(point);
    
        const point_id = insertedIds[0];
        const pointItems = items.map( (item_id: number) => {
            return {
                item_id,
                point_id
            }
        });
    
        await trx('point_item').insert(pointItems);
    
        return response.json( {
            id: point_id,
            ...point
        } );
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;
            
        const point = await knex('point')
            .where('id',id)
            .first();
        
        if( !point ) 
            return response.status(400).json( { message: 'Point not found!'} );
        
        const items = await knex('item')
            .join('point_item', 'item.id', '=', 'point_item.item_id')
            .where('point_item.point_id', id)
            .select('item.title');
        /* 
            SELECT item.title FROM item
                JOIN point_item ON item.id = point_item.item_id
                WHERE point_item.point_id = { id };
        */
        
        return response.json( { point, items} );
    }
}

export default PointsController;