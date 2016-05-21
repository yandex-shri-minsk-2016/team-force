import { Accounts } from 'meteor/accounts-base';
import utils from './../lib/utils';
import Email from './email';

Tasks = new Meteor.Collection('tasks');
SSR.compileTemplate('email', Assets.getText('email.html'));

Date.prototype.dayOfYear = function() {
    let newDate = new Date(this);
    newDate.setMonth(0, 0);
    return Math.round((this - newDate) / 8.64e7);
};

Meteor.methods({
    addTask: (task) => {
        return addTask(task);
    },

    sendEmail: (to, user, data, shopName) => {
        return Email.send(to, SSR.render('email', { user, data, shopName }));
    }
});

Meteor.startup(() => {
    Tasks.find().forEach((task) => {
        if (task.date <= new Date()) {
            taskFunctions[task.name](task.options);
        } else {
            addTask(task, task._id);
        }
    });
    SyncedCron.start();
});

const taskFunctions = {
    setSummary: (data) => {
        Pools.changePoolState(data.poolId, utils.POOL_STATE.SUMMARY)
            .then(poolId => {
                if (poolId) {
                    const pool = Pools.findOne(poolId);
                    const user = Meteor.users.findOne(pool.ownerId);

                    Feeds.notifyEveryoneInPool(pool._id, {
                        userId:   user._id,
                        ownerId:  user._id,
                        companyId:user.profile.company,
                        type:     'remove-sign',
                        message:  ` сменил статус #pool{${pool._id}} на 'предзаказ'.`
                    }, false);
                }
            });
    }
};

/**
 * Добавляет новую задачу, либо запускает, не добавляя, если время уже прошло
 * @params {Object} task задача с отложенным выполнением
 * @params {Number} id идентификатор задачи в коллекции, если не передан она
 * добавится в коллекцию автоматически
 **/
function addTask(task, id = Tasks.insert(task)) {
    if (task.date <= new Date()) {
        taskFunctions[task.name](task.options);
    } else {
        SyncedCron.add({
            name: id,
            schedule: (parser) => {
                return parser.recur().on(task.date).fullDate();
            },

            job: () => {
                taskFunctions[task.name](task.options);
                Tasks.remove(id);
                SyncedCron.remove(id);
                return id;
            }
        });
    }
}

Accounts.onCreateUser(function(options, user) {
    user.profile = {
        username: '',
        phone:    '',
        address:  '',
        company:  ''
    };

    if (options.profile.company) {
        let companyTitle = options.profile.company;
        try {
            Company.add({ title: companyTitle });
        }catch (err) {
            throw new Error(err);
        }

        user.profile.company = Company.findOne({ title: companyTitle })._id;
    }

    return user;
});

Meteor.publish('PoolsCompany', (company) => {
    return Pools.find({ companyId: company });
});

Meteor.publish('OrdersCompany', company => {
    // @FIXME company related
    return Orders.find();
});

Meteor.publish('PoolsOne', poolId => {
    return Pools.find({ _id: poolId });
});

Meteor.publish('PoolsList', () => {
    return Pools.find();
});

Meteor.publish('PoolsCompanyByDate', function(company) {
    ReactiveAggregate(this, Pools, [
        {
            $match: {
                companyId: company
            }
        },
        {
            $project: {
                _id: 1,
                shop: 1,
                address: 1,
                time: 1,
                distance: 1,
                ownerId: 1,
                state: 1,
                companyId: 1,
                dayOfYear: {
                    $dayOfYear: '$time'
                }
            }
        },
        {
            $match: {
                dayOfYear: {
                    $gte: new Date().dayOfYear()
                }
            }
        },
        {
            $sort: {
                dayOfYear: 1,
                time: 1
            }
        }
    ]);
});

Meteor.publish('PoolsListOwner', userId => {
    return Pools.find({ ownerId: userId });
});

Meteor.publish('OrdersListOwner', userId => {
    return Orders.find({ userId: userId });
});

Meteor.publish('PoolsOrders', poolId => {
    return Orders.find({ poolId: poolId });
});

Meteor.publish('OrdersItems', () => {
    /*
    let itemsIds = [];
    Orders.find({ poolId: poolId }).fetch().forEach(order => {
        order.items.forEach(item => {
            itemsIds.push({ _id: item.id });
        });
    });

    // @TODO autoreload!

    if (itemsIds.length) {
        return Items.find({ $or: itemsIds });
    }else {
        return Items.find({ _id: 'emptyquery' });
    }
    */

    return Items.find();

});

Meteor.publish('Feeds', companyId => {
    return Feeds.find({ companyId: companyId }, { sort: { created: -1 } });
});

Meteor.publish('company', () => {
    return Company.find();
});

Meteor.publish('usersData', function() {
    if (this.userId) {
        return Meteor.users.find({}, {
            fields: {
                _id: 1,
                emails: 1,
                profile: 1
            }
        });
    } else {
        this.ready();
    }
});
