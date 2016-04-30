import utils from './utils';
import Pools from './../imports/api/pools/pools';
import { Meteor } from 'meteor/meteor';

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'page404'
});

Router.route('/', function() {
    if (Meteor.user()) {
        this.render('appPools');
    }else {
        Router.go('/login');
    }
}, { name: 'index' });

Router.route('/history', function() {
    if (Meteor.user()) {
        this.render('appHistory');
    }else {
        Router.go('/login');
    }
}, { name: 'history' });

Router.route('/feeds', function() {
    if (Meteor.user()) {
        this.render('appFeeds');
    }else {
        Router.go('/login');
    }
}, { name: 'feeds' });

Router.route('/login', function() {
    if (!Meteor.user()) {
        this.render('appLogin');
    } else {
        Router.go('/');
    }
}, { name: 'login' });

Router.route('/pool/add', function() {
    this.render('appPoolAdd');
}, { name: 'pool_add' });

Router.route('/pool/:poolId/append', function() {
    this.render('appPoolAppend', {
        data: () => {
            return Pools.findOne({ _id: this.params.poolId });
        }
    });
}, { name: 'pool_append' });

Router.route('/pool/:poolId', function() {
    const pool = Pools.findOne({ _id: this.params.poolId });
    const data = { data: pool };

    if (pool) {
        switch (pool.state) {
            case utils.POOL_STATE.PENDING:
                this.render('appPoolPending', data);
                break;

            case utils.POOL_STATE.SUMMARY:
                if (pool.ownerId === Meteor.userId()) {
                    this.render('appPoolSummary', data);
                }else {
                    this.render('appPoolArchived', data);
                }

                break;

            case utils.POOL_STATE.ARCHIVED:
                this.render('appPoolArchived', data);
                break;

            default:
                throw new Error('Invalid pool');
        }
    }else {
        throw new Error('Pool not found');
    }
}, { name: 'pool' });

function requireAuth() {
    if (!Meteor.user()) {
        this.render('page403');
    } else {
        this.next();
    }
}

Router.onBeforeAction(requireAuth, { only: 'pool_add' });
Router.onBeforeAction('loading');
Router.before(function() {
    clearNotification();
    this.next();
});
