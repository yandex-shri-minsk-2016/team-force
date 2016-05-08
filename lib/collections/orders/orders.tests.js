import { chai } from 'meteor/practicalmeteor:chai';
import Orders from './orders';
import { resetDatabase } from 'meteor/xolvio:cleaner';

const expect = chai.expect;

describe('Orders', () => {
    beforeEach((done) => {
        resetDatabase();
        Meteor.call('test.resetDatabase', done);
    });

    it('name should be ItemsCollection', () => {
        expect(Orders._name).to.equal('Orders');
    });

    it('method `add` should insert item into collection', () => {
        const order = {
            poolId: 'test',
            items: [
                {
                    count: 1,
                    id: 'test'
                }
            ],
            userId: 'test'
        };
        
        Orders.add(order);
        expect(Orders.findOne().poolId).to.be.equal(order.poolId);
        expect(Orders.findOne().userId).to.be.equal(order.userId);
        expect(Orders.findOne().isPaid).to.be.equal(false);
    });

    it('calculation order price #0', () => {
        const order = {
            poolId: 'testPoolId',
            items: [
            ],
            userId: 'test'
        };

        Orders.add(order);

        expect(Orders.getOrderPrice(Orders.findOne()._id)).to.be.equal(0);

    });

    it('calculation order price #1', () => {
        const item1 = {
            title: 'item1',
            link: 'http://test.test/test1',
            price: 100,
            description: 'Long description of the item1',
            weight: '100 г.'
        };
        const item2 = {
            title: 'item2',
            link: 'http://test.test/test2',
            price: 300,
            description: 'Long description of the item2',
            weight: '300 г.'
        };
        const item3 = {
            title: 'item3',
            link: 'http://test.test/test3',
            price: 500,
            description: 'Long description of the item3',
            weight: '500 г.'
        };

        Items.add(item1);
        Items.add(item2);
        Items.add(item3);

        itemsAdded = Items.find().fetch();

        const order = {
            poolId: 'testPoolId',
            items: [
                {
                    count: 7,
                    id: itemsAdded[0]._id
                },
                {
                    count: 3,
                    id: itemsAdded[1]._id
                },
                {
                    count: 1,
                    id: itemsAdded[2]._id
                }
            ],
            userId: 'test'
        };

        Orders.add(order);

        // item1:(100)*7 + item2:(300)*3 + item2:(500)*1 = 700 + 900 + 500 = 2100
        expect(Orders.getOrderPrice(Orders.findOne()._id)).to.be.equal(2100);

    });

    it('calculation order price #2', () => {
        const item1 = {
            title: 'item1',
            link: 'http://test.test/test1',
            price: 111,
            description: 'Long description of the item1',
            weight: '100 г.'
        };
        const item2 = {
            title: 'item2',
            link: 'http://test.test/test2',
            price: 333,
            description: 'Long description of the item2',
            weight: '300 г.'
        };
        const item3 = {
            title: 'item3',
            link: 'http://test.test/test3',
            price: 555,
            description: 'Long description of the item3',
            weight: '500 г.'
        };

        Items.add(item1);
        Items.add(item2);
        Items.add(item3);

        itemsAdded = Items.find().fetch();

        const order = {
            poolId: 'testPoolId',
            items: [
                {
                    count: 1,
                    id: itemsAdded[0]._id
                },
                {
                    count: 1,
                    id: itemsAdded[1]._id
                },
                {
                    count: 1,
                    id: itemsAdded[2]._id
                }
            ],
            userId: 'test'
        };

        Orders.add(order);

        // item1:(111)*1 + item2:(333)*1 + item2:(555)*1 + 0 = 111 + 333 + 555 = 999
        expect(Orders.getOrderPrice(Orders.findOne()._id)).to.be.equal(999);

    });

    it('calculation order price #3', () => {
        const item1 = {
            title: 'item1',
            link: 'http://test.test/test1',
            price: 111,
            description: 'Long description of the item1',
            weight: '100 г.'
        };
        const item2 = {
            title: 'item2',
            link: 'http://test.test/test2',
            price: 333,
            description: 'Long description of the item2',
            weight: '300 г.'
        };
        const item3 = {
            title: 'item3',
            link: 'http://test.test/test3',
            price: 555,
            description: 'Long description of the item3',
            weight: '500 г.'
        };

        Items.add(item1);
        Items.add(item2);
        Items.add(item3);

        itemsAdded = Items.find().fetch();

        const order1 = {
            poolId: 'testPoolId1',
            items: [
                {
                    count: 1,
                    id: itemsAdded[0]._id
                },
                {
                    count: 1,
                    id: itemsAdded[1]._id
                },
                {
                    count: 1,
                    id: itemsAdded[2]._id
                }
            ],
            userId: 'test'
        };

        const order2 = {
            poolId: 'testPoolId',
            items: [
                {
                    count: 2,
                    id: itemsAdded[0]._id
                },
                {
                    count: 2,
                    id: itemsAdded[1]._id
                },
                {
                    count: 2,
                    id: itemsAdded[2]._id
                }
            ],
            userId: 'test'
        };

        Orders.add(order1);
        Orders.add(order2);

        Orders.update(Orders.find().fetch()[1]._id, { $set:{ isPaid: true } });

        // item1:(111)*1 + item2:(333)*1 + item2:(555)*1 + 0 = 111 + 333 + 555 = 999
        expect(Orders.getOrderIsPaidPrice(Orders.find().fetch()[0]._id, false)).to.be.equal(999);
        expect(Orders.getOrderIsPaidPrice(Orders.find().fetch()[0]._id, true)).to.be.equal(0);
        expect(Orders.getOrderIsPaidPrice(Orders.find().fetch()[1]._id, false)).to.be.equal(0);
        expect(Orders.getOrderIsPaidPrice(Orders.find().fetch()[1]._id, true)).to.be.equal(1998);

    });

});
