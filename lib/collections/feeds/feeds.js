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

                data.created = new Date();

                if (!data.seen) {
                    data.seen = false;
                }

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
    notifyEveryoneInPool(poolId, data) {
        Orders.find({ poolId:poolId }).fetch().map(order => {
            data.ownerId = order.userId;
            data.seen    = data.ownerId === data.userId;
            this.add(data);
        });
    }

    /**
     * @param data
     */
    notifyEveryoneInCompany(data) {
        Meteor.users.find({ 'profile.company':data.companyId }).fetch().map(user => {
            data.ownerId = user._id;
            data.seen    = data.ownerId === data.userId;
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
    ownerId: {
        type: String,
        label: 'Id user owner from feed'
    },
    companyId: {
        type: String,
        label: 'Id company from feed'
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
