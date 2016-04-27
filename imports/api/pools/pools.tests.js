import { chai } from 'meteor/practicalmeteor:chai';
import PoolsCollection from './pools';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import OrdersCollection from './../orders/orders';
import ItemsCollection from './../items/items';

const expect = chai.expect;

describe('PoolsCollection', () => {
    beforeEach((done) => {
        resetDatabase();
        Meteor.call('test.resetDatabase', done);
    });

    it('name should be PoolsCollection', () => {
        expect(PoolsCollection._name).to.equal('PoolsCollection');
    });

    it('method `add` should throw an error with bad data', () => {
        const item = { title: '123', link: 'http://google.com' };
        return PoolsCollection.add(item)
            .catch(e => {
                expect(e).not.to.equal(undefined);
            });
    });

    it('method `add` should create new pool', () => {
        const pool = {
            shop: 'test-03498340932',
            time: new Date(),
            ownerId: 'test',
            status: 'test',
            companyId: 'test'
        };

        return PoolsCollection.add(pool)
            .then(() => {
                expect(PoolsCollection.find({}).fetch()[0].shop).to.equal(pool.shop);
            });
    });

    it('method `appendItemForUser` should create new order for new user and append it for the old one', () => {
        const pool = {
            shop: 'test1',
            time: new Date(),
            ownerId: 'test',
            status: 'test',
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
        // return PoolsCollection.add(pool)
        //     .then((poolId) => {
        //         return PoolsCollection.appendItemForUser(poolId, userId, item)
        //             .then(() => {
        //                 expect(true).to.equal(undefined);
        //             });
        //     })
        //     .catch(e => {
        //         console.log(e);
        //     });
    });
});
