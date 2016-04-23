import {Meteor} from 'meteor/meteor';
import Pools from './../../../api/pools/pools';

Template.addPool.events({
    'submit #add_pool': (event) => {
        event.preventDefault();

        const target = event.target;
        const inputTime = target.time.value;

        if (!inputTime) {
            return;
        }

        const newPool = {
            shop: '',
            time: new Date(),
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
