/**
  * Pools collection
 **/
import { Meteor } from 'meteor/meteor';
import Items from './../items/items';
import Orders from './../orders/orders';

class PoolsCollection extends Mongo.Collection {
    constructor() {
        super(PoolsCollection.name);
    }
    
    add(data) {
        return new Promise((resolve, reject) => {
            try {
                PoolsCollection.schema.validate(data);
                super.insert(data, (error, id) => {
                    error ? reject(error) : resolve(id);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    getCompanyPools(companyId) {
        return this.find({ companyId: companyId });
    }
}

PoolsCollection.name = 'Pools';
PoolsCollection.schema = new SimpleSchema({
    shop: {
        type: String
    },
    time: {
        type: Date
    },
    ownerId: {
        type: String
    },
    status: {
        type: String
    },
    companyId: {
        type: String
    }
});

export default new PoolsCollection();
