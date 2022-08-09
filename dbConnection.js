const mongoose = require("mongoose");
mongoose.connect(
    `mongodb+srv://CareerMaster:CareerMaster147258@careermastercluster.ya8lb.mongodb.net/UserRecord?retryWrites=true&w=majority`, 
    {
      useNewUrlParser: true,
    }
  );
  
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
    console.log("Connected successfully");
  });