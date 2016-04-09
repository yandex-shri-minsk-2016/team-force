/**
  * Pools collection
 **/
import { Meteor } from 'meteor/meteor';

class PoolsCollection extends Mongo.Collection {
    constructor() {
        super(PoolsCollection.name);
    }
    
    add(shop, time, ownerId, company, items, price=0, callback=null) {
        //TODO: check data here
        let data = {
            shop, time, ownerId, company, items, price
        };
        return super.insert(data, callback);
    }

    getCompanyPools(company) {
        return this.find({company});
    }

    findOne(filter, callback) {
        //TODO: Attach items to the response from items collection
        return super.findOne(filter, callback);
    }
}

PoolsCollection.name = 'Pools';

Pools = new PoolsCollection();

export default Pools;