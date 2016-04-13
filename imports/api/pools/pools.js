/**
  * Pools collection
 **/
import { Meteor } from 'meteor/meteor';
import Items from './../items/items';

class PoolsCollection extends Mongo.Collection {
    constructor() {
        super(PoolsCollection.name);
    }
    
    add(data, callback=null) {
        //TODO: check data here
        return super.insert(data, function(error, id) {
            if (!error) {
                data.items.forEach((item) => {
                    Items.add({ poolId: id, shop: item.shop, link: item.link});
                });
            }
        });
    }

    getCompanyPools(company) {
        let pools = this.find({ company }).fetch();
        pools.forEach((pool, index) => {
            pools[index].items = Items.getPoolItems(pool._id);
        });
        return pools;
    }

    findOne(filter, callback) {
        //TODO: Attach items to the response from items collection
        return super.findOne(filter, callback);
    }
}

PoolsCollection.name = 'Pools';

export default new PoolsCollection();