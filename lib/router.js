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
        this.render('history');
    }else {
        Router.go('/login');
    }
}, { name: 'history' });

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
    this.render('appPool', {
        data: () => {
            return Pools.findOne({ _id: this.params.poolId });
        }
    });
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
