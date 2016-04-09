import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

    Accounts.onCreateUser((options, user) => {
        if (options) {
            user.options = options;
        }
        return user;
    });

});
