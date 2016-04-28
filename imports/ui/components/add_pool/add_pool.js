import {Meteor} from 'meteor/meteor';
import Pools from './../../../api/pools/pools';
import moment from 'moment';
import shops from './../../../../lib/shops.json';
import utils from './../../../../lib/utils';

Template.addPool.onRendered(function() {
    this.$('#time').datetimepicker({
        format: utils.DATETIME_FORMAT
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

        if (!inputTime.isValid() || !(shop in shops)) {
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
                Router.go(`/pool/${poolId}`);
            })
            .catch((e) => {
                console.log(e);

                //TODO: Show error
            });
    }
});
