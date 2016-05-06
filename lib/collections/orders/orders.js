import { Meteor } from 'meteor/meteor';

class OrdersCollection extends Mongo.Collection {
    constructor() {
        super(OrdersCollection._name);
    }

    add(data) {
        return new Promise((resolve, reject) => {
            try {
                data.isPaid = false;
                OrdersCollection.schema.validate(data);
                super.insert(data, (error, id) => {
                    error ? reject(error) : resolve(error);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Возвращает полную цену ордера по orderId
     * @param {String} orderId
     * @retuns {Number} price
     */
    getOrderPrice(orderId) {
        return this.getOrderIsPaidPrice(orderId, true) + this.getOrderIsPaidPrice(orderId, false);
    }

    /**
     * Возвращает isPaid денег (false-долг, true-оплаченную часть) ордера по orderId
     * @param {String} orderId
     * @param {Boolean} isPaid
     * @retuns {Number} price
     */
    getOrderIsPaidPrice(orderId, isPaid=false) {
        let order = Orders.findOne({ _id:orderId, isPaid:isPaid });

        if (!order) {
            return 0;
        }

        let p = order.items
            .map(item => {
                return Items.findOne(item.id).price * item.count;
            })
            .reduce((sum, current) => {
                return sum + current;
            }, 0);

        return p;
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
    },
    isPaid: {
        type: Boolean
    }
});

Orders = new OrdersCollection();
export default Orders;
