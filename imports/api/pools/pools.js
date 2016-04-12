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
    
    add(data, callback=null) {
        //TODO: check data here
        return super.insert(data, function(error, id) {
            if (!error) {
                data.orders.forEach((order) => {
                    Orders.add({
                        poolId: id,
                        items: order.items,
                        owner: Meteor.userId(),
                        sum: 0,
                    });
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
