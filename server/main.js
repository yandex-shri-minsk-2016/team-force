import { Accounts } from 'meteor/accounts-base';
import utils from './../lib/utils';
import Email from './email';

Tasks = new Meteor.Collection('tasks');
SSR.compileTemplate('email', Assets.getText('email.html'));

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
        Pools.changePoolState(data.poolId, utils.POOL_STATE.SUMMARY);
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
    if (options.profile) {
        user.profile = options.profile;
        try {
            Company.add({ title: options.profile.company });
        }catch (err) {
            throw new Error(err);
        }

        user.profile.company = Company.findOne({ title: user.profile.company })._id;
    }

    return user;
});

Meteor.publish('PoolsCompany', (company) => {
    return Pools.find({ companyId: company });
});

Meteor.publish('PoolsOne', (poolId) => {
    return Pools.find({ _id: poolId });
});

Meteor.publish('PoolsList', () => {
    return Pools.find();
});

Meteor.publish('PoolsListOwner', (userId) => {
    return Pools.find({ ownerId: userId });
});

Meteor.publish('OrdersListOwner', (userId) => {
    return Orders.find({ userId: userId });
});

Meteor.publish('PoolsOrders', (poolId) => {
    return Orders.find({ poolId: poolId });
});

Meteor.publish('OrdersItems', (poolId) => {
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

Meteor.publish('Feeds', (userId) => {
    return Feeds.find({ userId: userId });
});

Meteor.publish('company', () => {
    return Company.find();
});

