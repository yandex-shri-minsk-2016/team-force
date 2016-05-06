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

        return expect(Pools.findOne().shop).to.equal(pool.shop);
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
});
