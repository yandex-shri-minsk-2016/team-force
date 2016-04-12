import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import PoolsCollection from './../imports/api/pools/pools';
import ItemsCollection from './../imports/api/items/items';

Pools = PoolsCollection;
Items = ItemsCollection;

import './../imports/ui/components/add_pool/add_pool.html';
import './../imports/ui/components/add_pool/add_pool.js';

import './../imports/ui/components/pools_list/pools_list.html';
import './../imports/ui/components/pools_list/pools_list.js';

import './../imports/ui/components/pool/pool.html';
import './../imports/ui/components/pool/pool.js';

import './../imports/ui/components/auth/auth.html';
import './../imports/ui/components/auth/auth.js';

import './../imports/ui/components/header/header.html';
import './../imports/ui/components/footer/footer.html';

import './main.html';
