import { Meteor } from 'meteor/meteor';

class OrdersCollection extends Mongo.Collection {
    constructor() {
        super(OrdersCollection.name);
    }

    add(data) {
        return new Promise((resolve, reject) => {
            try {
                OrdersCollection.schema.validate(data);
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

    orderUp(poolId, orderId) {
        let CurrentPool = Pools.findOne({ _id: poolId });
        let currentOrders = CurrentPool.orders;
        let newOrder = {};
        $.extend(newOrder, currentOrders[orderId]);
        newOrder.owner = Meteor.userId();
        currentOrders.push(newOrder);
        Pools.update(CurrentPool._id, { $set: { orders: currentOrders } });
    }
}

OrdersCollection.name = 'Orders';
OrdersCollection.schema = new SimpleSchema({
    poolId: {
        type: Number
    },
    items: {
        type: [Number]
    },
    userId: {
        type: String
    }
});

export default new OrdersCollection();
