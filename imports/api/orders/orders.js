import { Meteor } from 'meteor/meteor';
import Items from './../items/items';

class OrdersCollection extends Mongo.Collection {
    constructor() {
        super(OrdersCollection.name);
    }

    add(data, callback=null) {
        return super.insert(data, function(error, id) {
            if (!error) {
                data.items.forEach((item) => {
                    Items.add({
                        orderId: id,
                        link: item.link
                    });
                });
            }
        });
    }

    findOne(filter, callback) {
        return super.findOne(filter, callback);
    }
}

OrdersCollection.name = 'Orders';

export default new OrdersCollection();
