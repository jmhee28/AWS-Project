
'use strict';
module.exports.handler= async (event) => {
   try {
     console.log(event);
     console.log('This Lambda λ function will be executed every Five minutes');
 
   } catch (error) {
     console.log(error);
     
   }
 };