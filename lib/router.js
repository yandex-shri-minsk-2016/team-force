import { Meteor } from 'meteor/meteor';

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
});

Router.route('/', function() {
        if (Meteor.user()) {
            this.render('appPools');
        }else {
            Router.go('/login');
        }
    }, { name: 'index' }
);

Router.route('/login', function() {
        if (!Meteor.user()) {
            this.render('appLogin');
        } else {
            Router.go('/');
        }
    }, { name: 'login' }
);

Router.route('/pool/add', function() {
        this.render('appPoolAdd');
    }, { name: 'pool_add' }
);

Router.route('/pool/:poolId/append', function() {
        this.render('appPoolAppend', {
            data: function() {
                return Pools.findOne({ _id: this.params.poolId });
            }
        });
    }, { name: 'pool_append' }
);

Router.route('/pool/:poolId', function() {
        this.render('appPool', {
            data: function() {
                return Pools.findOne({ _id: this.params.poolId });
            }
        });
    }, { name: 'pool' }
);

Router.onBeforeAction('loading');
Router.before(function() {
    clearNotification();
    this.next();
});
