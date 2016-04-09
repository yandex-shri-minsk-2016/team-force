import {Meteor} from 'meteor/meteor';
import PoolsCollection from './../../../api/pools/pools';

Pools = PoolsCollection;

Template.addPool.events({
    'submit #add_pool': (event) => {
        event.preventDefault();

        const target = event.target;
        const time = target.time.value;
        const products = target.products.value;

        if (!time || !products) {
            return;
        }
        
        let prd = [];
        products.split(',').forEach((product) => {
            prd.push({shop: 'wok.by', link: product});
        });

        // Remove `!` when authorizations will ready
        if (!Meteor.user()) {
            Pools.add('wok.by', new Date(), 1, 'google', prd, 200);
        } else {
            //TODO: Change state to 404
        }
    }
});