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
        if (Meteor.user()) {
            const newPool = {
                shop: 'wok.by',
                time: inputTime,
                ownerId: Meteor.userId(),
                company: Meteor.user().profile.company,
                items: products,
                price: 200,
                createdAt: new Date()
            };
            Pools.add(newPool);
            
            // @TODO: notify success create newPool
            FlowRouter.go('/');
        } else {
            FlowRouter.go('/login');
        }
    }
});
