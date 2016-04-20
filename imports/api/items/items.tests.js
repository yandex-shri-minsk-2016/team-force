import { chai } from 'meteor/practicalmeteor:chai';
import ItemsCollection from './items';
import { resetDatabase } from 'meteor/xolvio:cleaner';

const expect = chai.expect;

Meteor.methods({
    'test.resetDatabase': () => resetDatabase()
});

describe('ItemsCollection', () => {
    beforeEach((done) => {
        resetDatabase();
        Meteor.call('test.resetDatabase', done);
    });

    it('name should be ItemsCollection', () => {
        expect(ItemsCollection._name).to.equal('ItemsCollection');
    });

    it('method `add` should insert item into collection', () => {
        const item = { data: 2 };
        ItemsCollection.add(item);
        expect(ItemsCollection.find().fetch()[0].data).to.be.equal(item.data);
    });

    it('method `getPoolItems` should return items for pool', () => {
        const item = { data: 3, poolId: 5 };
        ItemsCollection.add(item);
        expect(ItemsCollection.getPoolItems(5)[0].data).to.be.equal(item.data);
    });
});
