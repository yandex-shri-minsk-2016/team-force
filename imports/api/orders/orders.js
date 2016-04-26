import { Meteor } from 'meteor/meteor';

class OrdersCollection extends Mongo.Collection {
    constructor() {
        super(OrdersCollection.name);
    }

    add(data) {
        return new Promise((resolve, reject) => {
            try {
                //OrdersCollection.schema.validate(data);
                super.insert(data, (error, id) => {
                    error ? reject(error) : resolve(error);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    findOne(filter, callback) {
        return super.findOne(filter, callback);
    }

    copyOrder(poolId, orderIndex) {
        const currentPool = Pools.findOne({ _id: poolId });
        let currentOrders = currentPool.orders;
        let newOrder = {};
        $.extend(newOrder, currentOrders[orderIndex]);
        newOrder.owner = Meteor.userId();
        currentOrders.push(newOrder);
        Pools.update(currentPool._id, { $set: { orders: currentOrders } });
    }
}

OrdersCollection.name = 'Orders';
OrdersCollection.schema = new SimpleSchema({
    poolId: {
        type: String
    },
    items: {
        type: [{
            count: Number,
            id: String
        }]
    },
    userId: {
        type: String
    }
});

export default new OrdersCollection();
