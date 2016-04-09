import {Meteor} from 'meteor/meteor';
import PoolsCollection from './../../../api/pools/pools';

Pools = PoolsCollection;

Template.addPool.events({
    'submit #add_pool': (event) => {
        event.preventDefault();

        const target = event.target;
        const inputTime = target.time.value;
        const inputProducts = target.products.value;

        if (!inputTime || !inputProducts) {
            return;
        }
        
        let products = [];
        inputProducts.split(',').forEach((product) => {
            products.push({shop: 'wok.by', link: product});
        });

        // Remove `!` when authorizations will ready
        if (!Meteor.user()) {
            Pools.add({shop: 'wok.by', time: new Date(), ownerId: 1, company: 'google', items: products, price: 200});
        } else {
            //TODO: Change state to 404
        }
    }
});