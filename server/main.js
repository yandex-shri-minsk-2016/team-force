import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import Pools from './../imports/api/pools/pools';
import Items from './../imports/api/items/items';
import Feeds from './../imports/api/feeds/feeds';
import Company from './../imports/api/company/company';

Tasks = new Meteor.Collection('tasks');

Meteor.methods({
    addTask: (task) => {
        return addTask(task);
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
    changePoolState: (poolId) => {
        Pools.update({ _id: poolId }, { $set: { state: 'summary' } });
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
};

Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
        user.profile = options.profile;
        try {
            Company.add({ title: user.profile.company });
        }catch (err) {
            throw new Error(err);
        }
    }

    return user;
});
