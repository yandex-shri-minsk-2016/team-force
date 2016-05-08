import { chai } from 'meteor/practicalmeteor:chai';
import Pools from './pools';
import { resetDatabase } from 'meteor/xolvio:cleaner';

const expect = chai.expect;

describe('Pools', () => {
    beforeEach((done) => {
        resetDatabase();
        Meteor.call('test.resetDatabase', done);
    });

    it('name should be Pools', () => {
        expect(Pools._name).to.equal('Pools');
    });

    it('method `add` should throw an error with bad data', () => {
        const item = { title: '123', link: 'http://google.com' };
        return Pools.add(item)
            .catch(e => {
                expect(e).not.to.equal(undefined);
            });
    });

    it('method `add` should create new pool', () => {
        const pool = {
            shop: 'test-03498340932',
            address: 'test-43258764395387',
            time: new Date(),
            ownerId: 'test',
            state: 'test',
            companyId: 'test'
        };
        Pools.add(pool);

        expect(Pools.findOne().shop).to.equal(pool.shop);
    });

    it('method `appendItemForUser` should create new order for new user and append it for the old one', () => {
        const pool = {
            shop: 'test1',
            time: new Date(),
            ownerId: 'test',
            state: 'test',
            companyId: 'test'
        };

        const item = {
            title: 'test',
            price: 244,
            description: 'test',
            weight: 'test',
            link: 'http://keep.google.com'
        };

        const userId = '1';

        //TODO: fix this bullshit
        // return Pools.add(pool)
        //     .then((poolId) => {
        //         return Pools.appendItemForUser(poolId, userId, item)
        //             .then(() => {
        //                 expect(true).to.equal(undefined);
        //             });
        //     })
        //     .catch(e => {
        //         console.log(e);
        //     });
    });

    it('calculation pool price #0', () => {
        const pool = {
            shop: 'shop.test',
            address: 'address.test',
            time: new Date(),
            ownerId: 'owner.test',
            companyId: 'company.test'
        };

        Pools.add(pool);

        expect(Pools.getPoolPrice(Pools.findOne()._id)).to.be.equal(0);

    });

    it('calculation pool price #1', () => {

        const pool = {
            shop: 'shop.test',
            address: 'address.test',
            time: new Date(),
            ownerId: 'owner.test',
            companyId: 'company.test'
        };

        Pools.add(pool);

        let poolId = Pools.findOne()._id;

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
            poolId: poolId,
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
        expect(Pools.getPoolPrice(poolId)).to.be.equal(2100);

    });

    it('calculation pool price #2', () => {

        const pool = {
            shop: 'shop.test',
            address: 'address.test',
            time: new Date(),
            ownerId: 'owner.test',
            companyId: 'company.test'
        };

        Pools.add(pool);

        let poolId = Pools.findOne()._id;

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
            poolId: poolId,
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
            poolId: poolId,
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

        // (item1:(111)*1 + item2:(333)*1 + item2:(555)*1) + (111*2+333*2+555*2) = (111 + 333 + 555) + (222+666+1110) = 2997
        expect(Pools.getPoolPrice(poolId)).to.be.equal(2997);

    });

    it('calculation pool price #3', () => {

        const pool = {
            shop: 'shop.test',
            address: 'address.test',
            time: new Date(),
            ownerId: 'owner.test',
            companyId: 'company.test'
        };

        Pools.add(pool);

        let poolId = Pools.findOne()._id;

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
            poolId: poolId,
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
            poolId: poolId,
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
        expect(Pools.getPoolIsPaidPrice(poolId, false)).to.be.equal(999);
        expect(Pools.getPoolIsPaidPrice(poolId, true)).to.be.equal(1998);
        expect(Pools.getPoolPrice(poolId)).to.be.equal(2997);

    });

});
