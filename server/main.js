import { Meteor } from 'meteor/meteor';
import PoolsCollection from './../imports/api/pools/pools';

Pools = PoolsCollection;

Meteor.startup(() => {
  // code to run on server at startup
});
