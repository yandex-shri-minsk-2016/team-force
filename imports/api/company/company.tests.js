import { chai } from 'meteor/practicalmeteor:chai';
import CompanyCollection from './company';
import { resetDatabase } from 'meteor/xolvio:cleaner';

const expect = chai.expect;

describe('CompanyCollection', () => {
    beforeEach((done) => {
        resetDatabase();
        Meteor.call('test.resetDatabase', done);
    });

    it('name should be CompanyCollection', () => {
        expect(CompanyCollection._name).to.equal('CompanyCollection');
    });

    it('method `add` should insert item into collection', () => {
        const item = { title: 'yandex' };
        CompanyCollection.add(item);
        expect(CompanyCollection.find().fetch()[0].data).to.be.equal(item.data);
    });

    it('method `getCompany` should search 1 company into collection', () => {
        const c = { title: 'yandex' };
        CompanyCollection.add(c);
        expect(CompanyCollection.getCompany(c.title).count()).to.be.equal(1);
    });

    it('method `getCompany` should search 2 companies into collection', () => {
        const c1 = { title: 'ya' };
        const c2 = { title: 'yandex' };
        CompanyCollection.add(c1);
        CompanyCollection.add(c2);
        expect(CompanyCollection.getCompany('ya').count()).to.be.equal(2);
    });

    it('method `isExistCompany` should not_exist company into collection', () => {
        expect(CompanyCollection.isExistCompany('xednay')).to.be.equal(false);
    });

    it('method `isExistCompany` should exist company into collection', () => {
        const c = { title: 'yandex' };
        CompanyCollection.add(c);
        expect(CompanyCollection.isExistCompany('yandex')).to.be.equal(true);
    });

});
