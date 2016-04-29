import { chai } from 'meteor/practicalmeteor:chai';
import OrdersCollection from './orders';
import { resetDatabase } from 'meteor/xolvio:cleaner';

const expect = chai.expect;

describe('OrdersCollection', () => {
    beforeEach((done) => {
        resetDatabase();
        Meteor.call('test.resetDatabase', done);
    });

    it('name should be ItemsCollection', () => {
        expect(OrdersCollection._name).to.equal('OrdersCollection');
    });

    it('method `add` should insert item into collection', () => {
        const item = {
            poolId: 'test',
            items: [
                {
                    count: 1,
                    id: 'test'
                }
            ],
            userId: 'test'
        };
        
        OrdersCollection.add(item);
        expect(OrdersCollection.find().fetch()[0].poolId).to.be.equal(item.poolId);
    });
});
