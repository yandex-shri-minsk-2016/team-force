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
        
        Orders.add(item);
        expect(Orders.find().fetch()[0].poolId).to.be.equal(item.poolId);
    });
});
