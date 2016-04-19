import { Meteor } from 'meteor/meteor';

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'page404'
});

Router.route('/',
    () => {
        if (Meteor.user()) {
            this.render('appPools');
        }else {
            Router.go('/login');
        }
    }, { name: 'index' }
);

Router.route('/login',
    () => {
        if (!Meteor.user()) {
            this.render('appLogin');
        } else {
            Router.go('/');
        }
    }, { name: 'login' }
);

Router.route('/pool/add',
    () => {
        this.render('appPoolAdd');
    }, { name: 'pool_add' }
);

Router.route('/pool/:poolId/append',
    () => {
        this.render('appPoolAppend', {
            data: () => {
                return Pools.findOne({ _id: this.params.poolId });
            }
        });
    }, { name: 'pool_append' }
);

Router.route('/pool/:poolId',
    () => {
        this.render('appPool', {
            data: () => {
                return Pools.findOne({ _id: this.params.poolId });
            }
        });
    }, { name: 'pool' }
);

requireAuth = () => {
    if (!Meteor.user()) {
        this.render('page403');
    } else {
        this.next();
    }
};

Router.onBeforeAction(requireAuth, { only: 'pool_add' });
Router.onBeforeAction('loading');
Router.before(function() {
    clearNotification();
    this.next();
});
