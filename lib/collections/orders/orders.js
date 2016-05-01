import { Meteor } from 'meteor/meteor';

class OrdersCollection extends Mongo.Collection {
    constructor() {
        super(OrdersCollection._name);
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
}

OrderItemSchema = new SimpleSchema({
    count: {
        type: Number
    },
    id: {
        type: String
    }
});

OrdersCollection._name = 'Orders';
OrdersCollection.schema = new SimpleSchema({
    poolId: {
        type: String
    },
    items: {
        type: [OrderItemSchema]
    },
    userId: {
        type: String
    }
});

Orders = new OrdersCollection();
export default Orders;
