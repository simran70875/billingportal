const mongoose = require('mongoose')

mongoose.connect(process.env.DB_CONNECTION_STRING)
.then(() => {
    console.log('Db Connected Successfully.');        
})
.catch(error => {
    console.log('error connection to database ', error);
})