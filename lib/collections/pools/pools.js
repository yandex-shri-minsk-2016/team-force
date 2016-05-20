/**
  * Pools collection
 **/
import { Meteor } from 'meteor/meteor';
import utils from './../../utils';

class PoolsCollection extends Mongo.Collection {
    constructor() {
        super(PoolsCollection._name);
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

    changePoolState(poolId, poolState) {
        this.update({ _id: poolId }, { $set: { state: poolState } });
    }

    getCompanyPools(companyId) {
        return this.find({ companyId: companyId });
    }

    /**
     * Возвращает полную стоимость пула по poolId
     * @param {String} poolId
     * @retuns {Number} price
     */
    getPoolPrice(poolId) {
        return this.getPoolIsPaidPrice(poolId, true) + this.getPoolIsPaidPrice(poolId, false);
    }

    /**
     * Возвращает isPaid (долговую/оплаченную) часть пула по poolId
     * @param {String} poolId
     * @param {Boolean} isPaid
     * @retuns {Number} price
     */
    getPoolIsPaidPrice(poolId, isPaid) {
        return Orders.find({ poolId:poolId }).fetch()
            .map(order => Orders.getOrderIsPaidPrice(order._id, isPaid))
            .reduce((sum, current) => {
                return sum + current;
            }, 0);
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

                let localItem = ItemsOrder[item.id];

                if (localItem) {
                    localItem.userIds.push({ userId:order.userId });
                    localItem = {
                        poolId: poolId,
                        count: localItem.count + item.count,
                        userIds: localItem.userIds
                    };
                }else {
                    localItem = {
                        poolId: poolId,
                        count: item.count,
                        userIds: [{ userId:order.userId }]
                    };
                }

                ItemsOrder[item.id] = localItem;
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
        for (let itemId in ItemsOrder) {
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
    appendItemForUser(poolId, userId, item, count=1) {
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
                                count: count,
                                id: itemId
                            }]
                        });
                    } else {
                        let existInOrder = false;

                        userOrder.items.forEach((item, index) => {
                            if (item.id === itemId) {
                                userOrder.items[index].count += count;
                                existInOrder = true;
                            }
                        });

                        if (!existInOrder) {
                            userOrder.items.push({
                                count: count,
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

PoolsCollection._name = 'Pools';
PoolsCollection.schema = new SimpleSchema({
    shop: {
        type: String
    },
    address: {
        type: String
    },
    time: {
        type: Date
    },
    distance: {
        type: Number,
        optional: true
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

Pools = new PoolsCollection();
export default Pools;
