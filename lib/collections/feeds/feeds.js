/**
 * Feeds collection
 **/
import { Meteor } from 'meteor/meteor';

class FeedsCollection extends Mongo.Collection {
    constructor() {
        super(FeedsCollection._name);
    }

    /**
     * Проверяет различные упоминания через @ пользователей и рассылает всем уведомления
     *
     * @param {Object} data FeedsCollection
     *
     * @returns {Boolean} Успех?
     */
    feeder(data) {
        // @TODO посмотреть что в message, может кого упомянули
        return true;
    }

    /**
     * @param data
     * @returns {Promise} resolved с id добавленного элемента
     */
    add(data) {
        return new Promise((resolve, reject) => {
            try {
                this.feeder(data);
                data.seen = false;
                data.created = new Date();

                if (!data.type) {
                    data.type = 'bell';
                }

                super.insert(data, (error, id) => {
                    error ? reject(error) : resolve(id);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * @param poolId
     * @param data
     */
    addToPool(poolId, data) {
        const poolOrders = Orders.find({ poolId:poolId }).fetch();

        this.add(data);

        poolOrders.map(order => {
            data.userId = order.userId;
            this.add(data);
        });
    }

}

FeedsCollection._name = 'Feeds';
FeedsCollection.schema = new SimpleSchema({
    userId: {
        type: String,
        label: 'Id user from feed'
    },
    message: {
        type: String,
        label: 'Message of the feed'
    },
    type: {
        type: String,
        label: 'Type of the feed'
    },
    seen: {
        type: Boolean,
        defaultValue: false,
        label: 'Message is readed'
    },
    created: {
        type: Date,
        label: 'Date of feed'
    }
});

Feeds = new FeedsCollection();
export default Feeds;
