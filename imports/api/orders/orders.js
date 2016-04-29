import { Meteor } from 'meteor/meteor';
import Items from './../items/items';

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
}

OrderItemSchema = new SimpleSchema({
    count: {
        type: Number
    },
    id: {
        type: String
    }
});

OrdersCollection.name = 'Orders';
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

export default new OrdersCollection();
