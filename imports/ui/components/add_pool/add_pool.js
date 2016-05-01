import moment from 'moment';
import shops from './../../../../lib/shops.json';
import utils from './../../../../lib/utils';

Template.addPool.onRendered(function() {
    this.$('#time').datetimepicker({
        format: utils.DATETIME_FORMAT,
        minDate: moment()
    });
});

Template.addPool.helpers({
    shops: () => {
        let result = [];
        for (let name in shops) {
            result.push({
                name,
                data: shops[name]
            });
        }

        return result;
    }
});

Template.addPool.events({
    'submit #add_pool': (event) => {
        event.preventDefault();

        const inputTime = moment(event.target.time.value, utils.DATETIME_FORMAT);
        const shop = event.target.shop.value;

        //@TODO: add form validation
        if (!inputTime.isValid() || inputTime.isBefore(moment()) || !(shop in shops)) {
            return;
        }

        const newPool = {
            shop: shop,
            time: inputTime.toDate(),
            ownerId: Meteor.userId(),
            companyId: Meteor.user().profile.company
        };

        Pools.add(newPool)
            .then((poolId) => {
                // @TODO: notify success create newPool
                Meteor.call('addTask', {
                    date: newPool.time,
                    name: 'setSummary',
                    options: {
                        poolId: poolId
                    }
                });
                Router.go(`/pool/${poolId}`);
            })
            .catch((e) => {
                console.log(e);

                //TODO: Show error
            });
    }
});
