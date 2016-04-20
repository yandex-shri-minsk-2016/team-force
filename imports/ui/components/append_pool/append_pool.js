import {Meteor} from 'meteor/meteor';
import Pools from './../../../api/pools/pools';

Template.appendPool.events({
    'submit #append_pool': (event) => {
        event.preventDefault();

        const target = event.target;
        const inputProducts = target.products.value;

        if (!inputProducts) {
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

        poolId = Router.current().params.poolId;

        CurrentPool = Pools.findOne({ _id: poolId });
        currentOrders = CurrentPool.orders;
        currentOrders.push(newOrder);

        Pools.update(CurrentPool._id, { $set: { orders: currentOrders } });

        // @TODO: notify updated Pool
        Router.go('pool', { poolId: poolId });
    }
});
