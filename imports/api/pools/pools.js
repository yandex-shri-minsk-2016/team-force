/**
  * Pools collection
 **/
import { Meteor } from 'meteor/meteor';
import utils from './../../../lib/utils';
import Items from './../items/items';
import Orders from './../orders/orders';

class PoolsCollection extends Mongo.Collection {
    constructor() {
        super(PoolsCollection.name);
    }
    
    add(data) {
        return new Promise((resolve, reject) => {
            try {
                if (!data.state) {
                    data.state = utils.POOL_STATE.PENDING;
                }

                PoolsCollection.schema.validate(data);
                super.insert(data, (error, id) => {
                    error ? reject(error) : resolve(id);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    getCompanyPools(companyId) {
        return this.find({ companyId: companyId });
    }

    /**
     * Возвращает объект сгруппированный по item
     * @param {String} poolId
     */
    getGroupByItem(poolId) {
        const PoolOrders = Orders.find({ poolId: poolId }).fetch();
        let ItemsOrder = {};

        PoolOrders.forEach(order => {
            order.items.forEach(item => {

                if (ItemsOrder[item.id]) {
                    ItemsOrder[item.id].userIds.push(order.userId);
                    ItemsOrder[item.id] = {
                        poolId: poolId,
                        count: ItemsOrder[item.id].count + item.count,
                        userIds: ItemsOrder[item.id].userIds
                    };
                }else {
                    ItemsOrder[item.id] = {
                        poolId: poolId,
                        count: item.count,
                        userIds: [order.userId]
                    };
                }
            });
        });

        return ItemsOrder;
    }

    /**
     * Возвращает объект сгруппированный по item
     * @param {String} poolId
     */
    getGroupByItemWithData(poolId) {
        let ItemsOrder = this.getGroupByItem(poolId);
        for (itemId in ItemsOrder) {
            ItemsOrder[itemId].data = Items.findOne({ _id: itemId });
        }

        return ItemsOrder;
    }

    /**
     * Добавляет item в заказ пользователя с userId в пулл с id === poolId
     * @param {String} poolId
     * @param {String} userId
     * @param {Object} item
     */
    appendItemForUser(poolId, userId, item) {
        return new Promise((resolve, reject) => {
            if (!this.findOne({ _id: poolId })) {
                reject('Pool not found');
            }

            const userOrder = Orders.findOne({ poolId: poolId, userId: userId });
            return Items.findOrInsert(item)
                .then((itemId) => {
                    if (!userOrder) {
                        Orders.add({
                            userId: Meteor.userId(),
                            poolId,
                            items: [{
                                count: 1,
                                id: itemId
                            }]
                        });
                    } else {
                        let existInOrder = false;

                        userOrder.items.forEach((item, index) => {
                            if (item.id === itemId) {
                                userOrder.items[index].count++;
                                existInOrder = true;
                            }
                        });

                        if (!existInOrder) {
                            userOrder.items.push({
                                count: 1,
                                id: itemId
                            });
                        }

                        Orders.update(userOrder._id, { $set: { items: userOrder.items } });
                    }

                    resolve(itemId);
                })
                .catch(e => {
                    console.log(e);
                    reject(e);
                });
        });
    }
}

PoolsCollection.name = 'Pools';
PoolsCollection.schema = new SimpleSchema({
    shop: {
        type: String
    },
    time: {
        type: Date
    },
    ownerId: {
        type: String
    },
    state: {
        type: String
    },
    companyId: {
        type: String
    }
});

export default new PoolsCollection();
