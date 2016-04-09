/**
  * Pools collection
 **/
import { Meteor } from 'meteor/meteor';
import Items from './../items/items';

class PoolsCollection extends Mongo.Collection {
    constructor() {
        super(PoolsCollection.name);
    }
    
    add(shop, time, ownerId, company, items, price=0, callback=null) {
        //TODO: check data here
        let data = {
            shop, time, ownerId, company, price
        };
        return super.insert(data, function(e, id) {
            if (!e) {
                items.forEach((item) => {
                    Items.add(id, item.shop, item.link);
                });
            }
        });
    }

    getCompanyPools(company) {
        let pools = this.find({company}).fetch();
        if (pools.length > 0) {
            for (let i in pools) {
                pools[i].items = Items.getPoolItems(pools[i]._id);
            }
        }
        return pools;
    }

    findOne(filter, callback) {
        //TODO: Attach items to the response from items collection
        return super.findOne(filter, callback);
    }
}

PoolsCollection.name = 'Pools';

Pools = new PoolsCollection();

export default Pools;