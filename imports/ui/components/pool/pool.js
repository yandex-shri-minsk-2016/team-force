import { Meteor } from 'meteor/meteor';
import Items from './../../../api/items/items';

Template.pool.helpers({
    item: () => {
        // @TODO return instance if not defined
        // Template.instance();
        return false;
    }
});
