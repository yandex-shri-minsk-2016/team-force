import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import Pools from './../imports/api/pools/pools';
import Items from './../imports/api/items/items';
import Feeds from './../imports/api/feeds/feeds';
import Company from './../imports/api/company/company';

Meteor.startup(() => {
    // проверяем пулы каждые 15 мин
    Meteor.setInterval(checkPoolsState, 900000);
});

function checkPoolsState() {
    Pools.find({ state: 'pending', time: { $lte: new Date() } }).forEach((pool) => {
        Pools.update({ _id: pool._id }, { $set: { state: 'summary' } });
    });
}

Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
        user.profile = options.profile;
        try {
            Company.add({ title: user.profile.company });
        } catch (err) {
            throw new Error(err);
        }
    }

    return user;
});
