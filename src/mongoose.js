const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sample',{useNewUrlParser:true}, ()=>{

}).then(()=>{ 
    

    
})
mongoose.connection
.once('open',()=>console.log("database connected"))
.on('error',(error)=>console.log('Your error', error))