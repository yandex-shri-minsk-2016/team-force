import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor';
import Pools from './../imports/api/pools/pools';
import Items from './../imports/api/items/items';

Meteor.startup(() => {

    Accounts.onCreateUser((options, user) => {
        if (options) {
            user.options = options;
        }
        return user;
    });

});
