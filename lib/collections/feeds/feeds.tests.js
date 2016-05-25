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
            userId:   'user',
            message:  'used',
            companyId:'comp',
            ownerId:  'owner'
        };

        Feeds.add(feed);
        const masterFeed = Feeds.findOne();

        expect(masterFeed.userId).to.be.equal(feed.userId);
        expect(masterFeed.ownerId).to.be.equal(feed.ownerId);
        expect(masterFeed.message).to.be.equal(feed.message);
        expect(masterFeed.companyId).to.be.equal(feed.companyId);
        expect(masterFeed.type).to.be.equal('bell');
        expect(masterFeed.seen).to.be.equal(false);
    });

    // it('feeder', () => {
    //    @TODO :  feeder test
    // });
});
