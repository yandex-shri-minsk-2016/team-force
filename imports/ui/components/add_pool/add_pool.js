import {Meteor} from 'meteor/meteor';
import Pool from './../../../api/pools/pools';

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
            let newItem = {
                shop: 'wok.by',
                link: product
            };
            products.push(newItem);
        });

        // Remove `!` when authorizations will ready
        if (!Meteor.user()) {
            const newPool = {
                shop: 'wok.by',
                time: new Date(),
                ownerId: 1,
                company: 'google',
                items: products,
                price: 200
            };
            Pools.add(newPool);
        } else {
            //TODO: Change state to 404
        }
    }
});