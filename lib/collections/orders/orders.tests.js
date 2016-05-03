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
});
