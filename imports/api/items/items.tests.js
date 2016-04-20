import { chai } from 'meteor/practicalmeteor:chai';
import spies from 'chai-spies';
import ItemsCollection from './items';

chai.use(spies);
const expect = chai.expect;

describe('ItemsCollection', () => {
    it('name should be ItemsCollection', () => {
        expect(ItemsCollection._name).to.equal('ItemsCollection');
    });
});
