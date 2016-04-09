import { Meteor } from 'meteor/meteor';
import PoolsCollection from './../imports/api/pools/pools';
import ItemsCollection from './../imports/api/items/items';

Pools = PoolsCollection;
Items = ItemsCollection;

Meteor.startup(() => {
  // code to run on server at startup
});
