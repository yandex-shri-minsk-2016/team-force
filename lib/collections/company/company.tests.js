import { chai } from 'meteor/practicalmeteor:chai';
import Company from './company';
import { resetDatabase } from 'meteor/xolvio:cleaner';

const expect = chai.expect;

describe('Company', () => {
    beforeEach((done) => {
        resetDatabase();
        Meteor.call('test.resetDatabase', done);
    });

    it('name should be Company', () => {
        expect(Company._name).to.equal('Company');
    });

    it('method `add` should insert item into collection', () => {
        const item = { title: 'yandex' };
        Company.add(item);
        expect(Company.find().fetch()[0].data).to.be.equal(item.data);
    });

    it('method `getCompany` should search 1 company into collection', () => {
        const c = { title: 'yandex' };
        Company.add(c);
        expect(Company.getCompany(c.title).count()).to.be.equal(1);
    });

    it('method `getCompany` should search 2 companies into collection', () => {
        const c1 = { title: 'ya' };
        const c2 = { title: 'yandex' };
        Company.add(c1);
        Company.add(c2);
        expect(Company.getCompany('ya').count()).to.be.equal(2);
    });

    it('method `isExistCompany` should not_exist company into collection', () => {
        expect(Company.isExistCompany('xednay')).to.be.equal(false);
    });

    it('method `isExistCompany` should exist company into collection', () => {
        const c = { title: 'yandex' };
        Company.add(c);
        expect(Company.isExistCompany('yandex')).to.be.equal(true);
    });

});
