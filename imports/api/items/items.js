/**
 * Items collection
 **/
import { Meteor } from 'meteor/meteor';

class ItemsCollection extends Mongo.Collection {
    constructor() {
        super(ItemsCollection.name);
    }

    add(data, callback=null) {
        return super.insert(data, callback);
    }

    getPoolItems(poolId) {
        return this.find({poolId}).fetch();
    }
}

ItemsCollection.name = 'Pools';

export default new ItemsCollection();