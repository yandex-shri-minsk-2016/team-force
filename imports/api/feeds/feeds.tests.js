import { chai } from 'meteor/practicalmeteor:chai';
import FeedsCollection from './feeds';
import { resetDatabase } from 'meteor/xolvio:cleaner';

const expect = chai.expect;

describe('FeedsCollection', () => {
    beforeEach((done) => {
        resetDatabase();
        Meteor.call('test.resetDatabase', done);
    });

    it('name should be FeedsCollection', () => {
        expect(FeedsCollection._name).to.equal('FeedsCollection');
    });

    it('method `add` should insert feed into collection', () => {
        let feed = {
            userId: 'hashhashhash',
            message: 'test message'
        };

        FeedsCollection.add(feed);
        let masterFeed = FeedsCollection.find().fetch()[0];

        expect(masterFeed.userId).to.be.equal(feed.userId);
        expect(masterFeed.message).to.be.equal(feed.message);
        expect(masterFeed.seen).to.be.equal(false);
    });

    // it('feeder', () => {
    //    @TODO :  feeder test
    // });
});
