import moment from 'moment';
import 'moment/locale/ru';
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
                address: shops[name].address,
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
        const address   = event.target.address.value;
        const distance  = parseInt(event.target.distance.value);
        const shop      = $('input[name="shop"]:checked').val();

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
            distance: distance,
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
        myMap._startPoint = $(event.target).data('address');
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

    ymaps.ready(() => {
        myMap = new ymaps.Map('map', {
            center: [0, 0],
            zoom: 0,
            controls: []
        });
        myMap.behaviors.disable(['drag', 'rightMouseButtonMagnifier']);
    });

    createRoute = () => {
        if (myMap._route) {
            myMap.geoObjects.remove(myMap._route);
        }

        const $mapDelivery = $('#mapDelivery');
        const $distance    = $('#distance');

        myMap._finishPoint = $('#address').val();

        if (myMap._startPoint && myMap._finishPoint) {

            ymaps.route([myMap._startPoint, myMap._finishPoint])
                .then((router) => {
                    myMap._route = router.getPaths();
                    myMap._route.options.set({ strokeWidth: 6, strokeColor: '#16a085', opacity: 0.6 });
                    myMap.geoObjects.add(myMap._route);
                    myMap.setBounds(myMap.geoObjects.getBounds());

                    const distance     = router.getLength();
                    const timeDelivery = Math.round(distance / utils.MEAN_SPEED);
                    let tNow      = parseInt(moment(new Date()).format('X'));
                    let tDelivery = moment(tNow + timeDelivery, 'X');

                    $mapDelivery.html(`Приблизительное время доставки ${moment(tDelivery).fromNow()}`);
                    $distance.val(distance);

                }, myMap)
                .catch(e => {
                    console.log(e);
                });
        }else {
            $mapDelivery.html('');
            $distance.val('');
        }
    };

};
