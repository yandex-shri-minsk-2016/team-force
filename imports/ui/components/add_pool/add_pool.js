import {Meteor} from 'meteor/meteor';
import Pools from './../../../api/pools/pools';
import moment from 'moment';

Template.addPool.onRendered(function() {
    this.$('#time').datetimepicker({
        format: 'DD/MM/YYYY HH:mm'
    });
});

Template.addPool.events({
    'submit #add_pool': (event) => {
        event.preventDefault();

        const inputTime = moment(event.target.time.value, 'DD/MM/YYYY HH:mm');

        if (!inputTime) {
            return;
        }

        const newPool = {
            shop: '',
            time: inputTime.toDate(),
            ownerId: Meteor.userId(),
            companyId: Meteor.user().profile.company,
            status: 'pending' //TODO: Move to constants
        };

        Pools.add(newPool)
            .then((poolId) => {
                // @TODO: notify success create newPool
                Router.go(`/pool/${poolId}`);
            })
            .catch((e) => {
                console.log(e);

                //TODO: Show error
            });
    }
});
