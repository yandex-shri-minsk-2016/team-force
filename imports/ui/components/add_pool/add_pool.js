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
    userAddress: () => {
        return Meteor.user().profile.address;
    },

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
        const address = event.target.address.value;
        const shop = $('input[name="shop"]:checked').val();

        if (!shop) {
            throwNotification('danger', 'Выберите магазин');
            return;
        }

        if (!inputTime.isValid() || inputTime.isBefore(moment()) || !(shop in shops)) {
            throwNotification('danger', 'Указано недопустимое время');
            return;
        }

        const newPool = {
            shop: shop,
            address: address,
            time: inputTime.toDate(),
            ownerId: Meteor.userId(),
            companyId: Meteor.user().profile.company
        };

        Pools.add(newPool)
            .then((poolId) => {
                Meteor.call('addTask', {
                    date: newPool.time,
                    name: 'setSummary',
                    options: {
                        poolId: poolId
                    }
                });
                throwNotification('success', 'Вы создали пулл, наполняйте.');
                Router.go(`/pool/${poolId}`);
            })
            .catch((error) => {
                console.log(error);
                throwNotification('danger', 'Возникла ошибка, попробуйте ещё раз');
            });
    }
});
