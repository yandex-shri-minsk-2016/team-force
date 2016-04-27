import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import PoolsCollection from './../imports/api/pools/pools';
import OrdersCollection from './../imports/api/orders/orders';
import ItemsCollection from './../imports/api/items/items';
import FeedsCollection from './../imports/api/feeds/feeds';
import CompanyCollection from './../imports/api/company/company';
import Notifications from './../imports/api/notify/notify';
import ParserClass from './../lib/parser';

Pools = PoolsCollection;
Orders = OrdersCollection;
Items = ItemsCollection;
Feeds = FeedsCollection;
Company = CompanyCollection;
Parser = ParserClass;

import './../imports/ui/components/add_pool/add_pool.html';
import './../imports/ui/components/add_pool/add_pool.js';
import './../imports/ui/components/append_pool/append_pool.html';
import './../imports/ui/components/append_pool/append_pool.js';

import './../imports/ui/components/pools_list/pools_list.html';
import './../imports/ui/components/pools_list/pools_list.js';
import './../imports/ui/components/pools_list_item/pools_list_item.html';
import './../imports/ui/components/pools_list_item/pools_list_item.js';
import './../imports/ui/components/orders_list_item/orders_list_item.html';
import './../imports/ui/components/orders_list_item/orders_list_item.js';

import './../imports/ui/components/pool/pool.html';
import './../imports/ui/components/pool/pool.js';

import './../imports/ui/components/history/history.html';
import './../imports/ui/components/history/history.js';
import './../imports/ui/components/feeds/feeds.html';
import './../imports/ui/components/feeds/feeds.js';

import './../imports/ui/components/auth/auth.html';
import './../imports/ui/components/auth/auth.js';

import './../imports/ui/components/notifications/notifications.html';
import './../imports/ui/components/notifications/notifications.js';

import './../imports/ui/components/header/header.html';
import './../imports/ui/components/header/header.js';

import './../imports/ui/components/footer/footer.html';

import './../imports/ui/components/page403/page403.html';
import './../imports/ui/components/page404/page404.html';

import './main.html';
