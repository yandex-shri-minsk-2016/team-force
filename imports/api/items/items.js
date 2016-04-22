/**
 * Items collection
 **/
import { Meteor } from 'meteor/meteor';

class ItemsCollection extends Mongo.Collection {
    constructor() {
        super(ItemsCollection.name);
    }

    add(data) {
        return new Promise((resolve, reject) => {
            try {
                ItemsCollection.schema.validate(data);
                super.insert(data, (error, id) => {
                    error ? reject(error) : resolve(id);
                });
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
        regEx: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
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
    }
});

export default new ItemsCollection();
