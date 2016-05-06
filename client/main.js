import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import ParserClass from './../lib/parser';
import Utils from './../lib/utils';
import moment from 'moment';

Parser = ParserClass;
utils = Utils;

Accounts.ui.config({
    passwordSignupFields: 'EMAIL_ONLY'
});

import './../imports/ui/components/common/common.js';

import './../imports/ui/components/add_pool/add_pool.html';
import './../imports/ui/components/add_pool/add_pool.js';

import './../imports/ui/components/pools_list/pools_list.html';
import './../imports/ui/components/pools_list/pools_list.js';
import './../imports/ui/components/pools_list_item/pools_list_item.html';
import './../imports/ui/components/pools_list_item/pools_list_item.js';
import './../imports/ui/components/orders_list_item/orders_list_item.html';
import './../imports/ui/components/orders_list_item/orders_list_item.js';

import './../imports/ui/components/pool_pending/pool_pending.html';
import './../imports/ui/components/pool_pending/pool_pending.js';
import './../imports/ui/components/pool_summary/pool_summary.html';
import './../imports/ui/components/pool_summary/pool_summary.js';
import './../imports/ui/components/pool_archived/pool_archived.html';
import './../imports/ui/components/pool_archived/pool_archived.js';

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

import './../imports/ui/components/profile/profile.html';
import './../imports/ui/components/profile/profile.js';

import './../imports/ui/components/footer/footer.html';

import './../imports/ui/components/page403/page403.html';
import './../imports/ui/components/page404/page404.html';

import './main.html';
