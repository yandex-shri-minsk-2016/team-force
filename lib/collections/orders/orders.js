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

    copyOrder(orderId, userId) {
        const currentOrder = Orders.findOne({ _id: orderId });
        Orders.add({
            userId: userId,
            poolId: currentOrder.poolId,
            items: currentOrder.items
        });
    }

    /**
     * Возвращает isPaid денег (false-долг, true-оплаченную часть) ордера по orderId
     * @param {String} orderId
     * @param {Boolean} isPaid
     * @returns {Number} price
     */
    getOrderIsPaidPrice(orderId, isPaid=false) {
        let order = Orders.findOne({ _id:orderId, isPaid:isPaid });

        if (!order) {
            return 0;
        }

        return order.items
            .map(item => {
                return Items.findOne(item.id).price * item.count;
            })
            .reduce((sum, current) => {
                return sum + current;
            }, 0);
    }

    /**
     * Возвращает полную цену всех ордеров для пользователя userId
     * @param {String} userId
     * @retuns {Number} price
     */
    getOrderPriceForUser(userId) {
        return this.getOrderIsPaidPriceForUser(userId, true) + this.getOrderIsPaidPriceForUser(userId, false);
    }

    /**
     * Возвращает isPaid денег (false-долг, true-оплаченную часть) всех ордеров для пользователя userId
     * @param {String} userId
     * @param {Boolean} isPaid
     * @retuns {Number} price
     */
    getOrderIsPaidPriceForUser(userId, isPaid=false) {
        let userOrders = Orders.find({ userId:userId, isPaid:isPaid }).fetch();
        let allOrdersPrice = 0;

        if (userOrders) {
            userOrders.forEach(order => {
                const orderSum = order.items
                    .map(item => {
                        return Items.findOne(item.id).price * item.count;
                    })
                    .reduce((sum, current) => {
                        return sum + current;
                    }, 0);

                allOrdersPrice += orderSum;
            });
        }

        return allOrdersPrice;
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
