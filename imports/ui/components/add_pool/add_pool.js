import {Meteor} from 'meteor/meteor';
import PoolsCollection from './../../../api/pools/pools';

Pools = PoolsCollection;

Template.addPool.events({
    'submit #add_pool': (event) => {
        event.preventDefault();

        const target = event.target;
        const time = target.time.value;
        const products = target.products.value;

        console.log(time, products);

        // Remove `!` when authorizations will ready
        if (!Meteor.user()) {
            Pools.add('Eda.by', new Date(), 1, 'google', [{shop: 'wok.by', link: 'http://wok.by/menu/full/woks/kuricza-v-souse-teriyaki-s-lapshoj-udon'}], 200);
        } else {
            //TODO: Change state to 404
        }
    }
});