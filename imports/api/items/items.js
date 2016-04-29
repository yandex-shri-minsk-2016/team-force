/**
 * Items collection
 **/
import { Meteor } from 'meteor/meteor';
import utils from '../../../lib/utils';

class ItemsCollection extends Mongo.Collection {
    constructor() {
        super(ItemsCollection.name);
    }

    isValid(data) {
        try {
            ItemsCollection.schema.validate(data);
        } catch (e) {
            throw e;
            return false;
        }

        return true;
    }

    /**
     * @param data
     * @returns {Promise} resolved с id добавленного элемента
     */
    add(data) {
        return new Promise((resolve, reject) => {
            try {
                if (this.isValid(data)) {
                    super.insert(data, (error, id) => {
                        error ? reject(error) : resolve(id);
                    });
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Проверяет, существует ли переданный элемент, и если да, то возвращает его id.
     * Если элемент не существует, то создает запись в коллекции и возвращает ее id
     * @param data
     * @returns {Promise} resolved с id нужного элемента
     */
    findOrInsert(data) {
        return new Promise((resolve, reject) => {
            try {
                if (this.isValid(data)) {
                    let existentItem = super.findOne(data);

                    if (existentItem) {
                        resolve(existentItem._id);
                    } else {
                        resolve(this.add(data));
                    }
                }
            } catch (e) {
                reject(e);
            }
        });
    }
}

ItemsCollection.name = 'Items';
ItemsCollection.schema = new SimpleSchema({
    title: {
        type: String,
        label: 'Short name of the item'
    },
    link: {
        type: String,
        regEx: utils.VALID_URL
    },
    price: {
        type: Number,
        optional: true,
        min: 0.01
    },
    description: {
        type: String,
        label: 'Long description of the item',
        optional: true
    },
    weight: {
        type: String,
        label: 'Type of the dish (e.g. large/small pizza) or weight',
        optional: true
    },
    img: {
        type: String,
        optional: true,
        label: 'Link to the item image'
    }
});

export default new ItemsCollection();
