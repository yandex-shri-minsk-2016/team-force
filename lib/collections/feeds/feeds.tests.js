import { chai } from 'meteor/practicalmeteor:chai';
import Feeds from './feeds';
import { resetDatabase } from 'meteor/xolvio:cleaner';

const expect = chai.expect;

describe('Feeds', () => {
    beforeEach((done) => {
        resetDatabase();
        Meteor.call('test.resetDatabase', done);
    });

    it('name should be Feeds', () => {
        expect(Feeds._name).to.equal('Feeds');
    });

    it('method `add` should insert feed into collection', () => {
        let feed = {
            userId: 'hashhashhash',
            message: 'test message'
        };

        Feeds.add(feed);
        let masterFeed = Feeds.find().fetch()[0];

        expect(masterFeed.userId).to.be.equal(feed.userId);
        expect(masterFeed.message).to.be.equal(feed.message);
        expect(masterFeed.seen).to.be.equal(false);
    });

    // it('feeder', () => {
    //    @TODO :  feeder test
    // });
});
