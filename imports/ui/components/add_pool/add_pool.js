import moment from 'moment';
import shops from './../../../../lib/shops.json';
import utils from './../../../../lib/utils';

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
    },

    'change input[name="shop"]': (event) => {
        // myMap._startPoint =
        console.log(myMap);
        console.log(event);
        createRoute();
    }
});

Template.addPool.rendered = () => {

    $('#time').datetimepicker({
        format: utils.DATETIME_FORMAT,
        minDate: moment()
    });

    const $address = $('#address');

    $address.typeahead({
        source: [],
        minLength: 2,
        items: 8,
        matcher: () => { return true; }
    });

    $address.on('paste keyup', function(event) {
        ymaps.geocode(event.target.value, {
            results: 8
        }).then((result) => {
            let resultAddress = [];

            for (var i = 0; i < 8; i++) {
                const item = result.geoObjects.get(i);
                if (item) {
                    resultAddress.push(item.properties.getAll().text);
                }
            }

            $(this).data('typeahead').source = resultAddress;
        }).catch(e => {
            console.log(e);
        });
    });

    $address.on('change', function(event) {
        console.log($(this).val());
    });

    let myMap;
    ymaps.ready(() => {
        myMap = new ymaps.Map('map', {
            center: [0, 0],
            zoom: 0
        });
    });

    createRoute = () => {
        if (myMap._route) {
            myMap.geoObjects.remove(myMap._route);
        }

        console.log(myMap._startPoint, myMap._finishPoint);

        if (myMap._startPoint && myMap._finishPoint) {

            ymaps.route([myMap._startPoint, myMap._finishPoint])
                .then((router) => {
                    let distance = router.getLength();
                    myMap._route = router.getPaths();
                    myMap._route.options.set({ strokeWidth: 6, strokeColor: '#16a085', opacity: 0.6 });
                    myMap.geoObjects.add(myMap._route);
                    myMap.setBounds(myMap.geoObjects.getBounds());
                }, myMap);
        }
    };

};
