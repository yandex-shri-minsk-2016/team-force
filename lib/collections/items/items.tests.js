import { chai } from 'meteor/practicalmeteor:chai';
import Items from './items';
import { resetDatabase } from 'meteor/xolvio:cleaner';

const expect = chai.expect;

Meteor.methods({
    'test.resetDatabase': () => resetDatabase()
});

describe('Items', () => {
    beforeEach((done) => {
        resetDatabase();
        Meteor.call('test.resetDatabase', done);
    });

    it('name should be Items', () => {
        expect(Items._name).to.equal('Items');
    });

    it('method `add` should insert item into collection', () => {
        const item = { title: '123', link: 'http://google.com' };
        Items.add(item);
        expect(Items.findOne().title).to.be.equal(item.title);
        expect(Items.findOne().link).to.be.equal(item.link);
    });
});
