/**
 * Items collection
 **/
import { Meteor } from 'meteor/meteor';

class ItemsCollection extends Mongo.Collection {
    constructor() {
        super(ItemsCollection.name);
    }

    add(poolId, shop, link, price=0, callback=null) {
        //TODO: check data here
        let data = {
            poolId, shop, link, price
        };
        return super.insert(data, callback);
    }

    getPoolItems(poolId) {
        return this.find({poolId}).fetch();
    }
}

ItemsCollection.name = 'Pools';

Items = new ItemsCollection();

export default Items;