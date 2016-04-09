import { Meteor } from 'meteor/meteor';
import Items from './../../../api/items/items';

Template.pool.events({
   'submit #addItem': (event) => {
       event.preventDefault();

       const inputItems = event.target.newItems.value.split(',');

       if (inputItems.length === 0) return;

       let items = [];
       const poolId = ''; //TODO: Get from route
       inputItems.forEach((item, index) => {
           const newItem = {
               shop: 'wok.by',
               link: item,
               poolId: '6hfbAucmrxbtFABAN'
           };
           Items.add(newItem);
       });
   }
});