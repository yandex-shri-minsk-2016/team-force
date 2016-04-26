import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import Pools from './../imports/api/pools/pools';
import Items from './../imports/api/items/items';
import Feeds from './../imports/api/feeds/feeds';
import Company from './../imports/api/company/company';

Meteor.startup(() => {

});

Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
        user.profile = options.profile;
        try {
            Company.add({ title: user.profile.company });
        }catch (err) {
            throw new Error(err);
        }
    }

    return user;
});
