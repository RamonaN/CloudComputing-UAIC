const url = require('url');
var database=require("mongodb").MongoClient;
const assert=require("assert");
var urldb="mongodb://localhost/Books";
var mongo=require("mongodb");


exports.getRequest = function (req, res) {
    const reqUrl = url.parse(req.url, true);
    var id=""
    if (reqUrl.query.id) {
        id = reqUrl.query.id
    }
    database.connect(urldb,function(err,client){
        var db=client.db();
        const collection = db.collection('Books');
        if (id !== "") {
            var o_id = new mongo.ObjectID(id);
            collection.find({'_id':o_id}).toArray(function(err, docs) {
                if(err) throw err;
                if (docs){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(docs));
                   }
               })
        }
        else{
        collection.find({}).toArray(function(err, docs) {
        if(err) throw err;
        if(docs){
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.end(JSON.stringify(docs));
        }
         
      
        })} client.close();
    })
};
exports.postBooks = function (req, res) {
    var body ="";
    
    req.on('data', (chunk) => {
        body+=chunk;
        }).on('end', () => {
            
            database.connect(urldb, function(err, client) {
                if (err) throw err;
                var db=client.db();
                let parsed=JSON.parse(body)
         
                const collection = db.collection('Books');
                if(parsed.data){
                collection.insertMany(parsed.data, function (error, response) {
                    if(error) {
                      res.statusCode=409;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({"message":"Data already exists"}))
                    } else {
                      
                       res.statusCode = 201;
                       res.setHeader('Content-Type', 'application/json');
                       res.end(JSON.stringify(response.ops));
                    }
                });
                client.close();
              }
            else{
                res.statusCode=400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({"message":"Data is invalid"}));
            }});    
    });
};
exports.postBook = function (req, res) {
    var body ="";
    req.on('data', (chunk) => {
        body+=chunk;
        }).on('end', () => {
            
            database.connect(urldb, function(err, client) {
                if (err) throw err;
                var db=client.db();
                let parsed=JSON.parse(body)
                const collection = db.collection('Books');
                collection.insertOne(parsed, function (error, response) {
                    if(error) {
                        console.log('Error occurred while inserting');
                    } else{
                      
                       res.statusCode = 201;
                       res.setHeader('Content-Type', 'application/json');
                       res.end(JSON.stringify(response.ops));
                    }
                });
                client.close();
              });     
    });
};
exports.dropCollection = function (req, res) {
    const reqUrl = url.parse(req.url, true);
    var id=""
    if (reqUrl.query.id) {
        id = reqUrl.query.id
    }
    database.connect(urldb,function(err,client){
        var db=client.db();
        const collection = db.collection('Books');
        if (id !== "") {
            var o_id = new mongo.ObjectID(id);
            collection.deleteOne({'_id':o_id},function(err,response){

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({"message":"Book deleted"}));
                client.close();
               })
        }
        else{
        collection.drop(function(err, delOK) {
        if(err){
            res.statusCode=204;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({"message":"Collection does not exists!"}));
        }
        if(delOK){
            console.log("Deleted succesfully");
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({"message":"Books deleted"}));
        }
      
         client.close();
        })}
    })
};
exports.updateCollection = function (req, res) {
    const reqUrl = url.parse(req.url, true);
    var id=""
    if (reqUrl.query.id) {
        id = reqUrl.query.id
    }
    var body ="";
    
    req.on('data', (chunk) => {
        body+=chunk;
        }).on('end', () => {
            
    database.connect(urldb,function(err,client){
        let parsed=JSON.parse(body)
        var db=client.db();
        const collection = db.collection('Books');
        if (id !== "") {
            var o_id = new mongo.ObjectID(id);
            var updates={$set:parsed}
            collection.updateOne({"_id":o_id}, updates, function(err, resp) {
                if (err) throw err;
                console.log("1 document updated"+resp);
                res.statusCode = 200;
                 res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({"message":"Update succesfull"}));
                client.close();
              });
           
        }
        else{
        collection.drop(function(err, delOK) {
            
        })
        collection.insertMany(parsed.data, function (error, response) {
            if(error) {
              res.statusCode=409;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({"message":"Data already exists"}))
            } else {
              
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.end(JSON.stringify(response.ops));
            }
            client.close();
        });
    /*     collection.updateMany({ reducere: { $exists: false } }, 
            { $set: parsed},function(err, resp) {
        if(err){
            throw err;
        }
        if(resp){
            console.log("Updated"+resp);
        }
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.end(JSON.stringify({"message":"Collection updated "}));
         client.close();
        }) */}
    })
})};
exports.invalidRequest = function (req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Invalid Request');
};