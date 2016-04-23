import {Meteor} from 'meteor/meteor';
import Pools from './../../../api/pools/pools';

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
                link: product,
                createdAt: new Date()
            };
            products.push(newItem);
        });

        let newOrder = {
            owner: Meteor.userId(),
            items: products,
            sum: 0
        };

        const newPool = {
            shop: 'wok.by',
            time: inputTime,
            ownerId: Meteor.userId(),
            company: Meteor.user().profile.company,
            orders: [newOrder],
            price: 0,
            createdAt: new Date(),
            
            // pending -> summary -> closed
            state: 'pending'
        };

        Pools.add(newPool);

        // @TODO: notify success create newPool
        Router.go('/');
    }
});
