var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID

var app = express();
var db; 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/News',function(req,res){
    db.db().collection('news').find().toArray(function(err, docs){
        if(err){
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(docs)
    })
});

app.get('/News/:id',function(req,res){
    db.db().collection('news').findOne({_id: ObjectID(req.params.id)},function(err,docs){
        if(err){
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(docs)
    })
});//повернення

app.post('/News',function(req,res){
    var news = {
        title: req.body.title,
        desc: req.body.desc,
        image: req.body.image
    };
    db.db().collection('news').insertOne(news,function(err,result){
        if(err){
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(news)
    })
});//добавлення

app.put('/News/:id',function(req,res){
    db.db().collection('news').updateOne(
        {_id: ObjectID(req.params.id)},
        {$set:{title:req.body.title,desc: req.body.desc,image: req.body.image}},
        function(err,result){
            if(err){
                console.log(err)
                return res.sendStatus(500)
            }
            res.sendStatus(200)
        }
    )
});//обновлення

app.delete('/News/:id', function (req, res) {
    db.db().collection('news').deleteOne(
        {_id: ObjectID(req.params.id)},
        function (err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    )
});

//\\\\\\\\\\\\\\\\\\\\\\\\
app.get('/Fans',function(req,res){
    db.db().collection('fans').find().toArray(function(err, docs){
        if(err){
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(docs)
    })
});

app.get('/Fans/:id',function(req,res){
    db.db().collection('fans').findOne({_id: ObjectID(req.params.id)},function(err,docs){
        if(err){
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(docs)
    })
});//повернення

app.post('/Fans',function(req,res){
    var fans = {
        name: req.body.name,
        feedback: req.body.feedback,
        date: req.body.date
    };
    db.db().collection('fans').insertOne(fans,function(err,result){
        if(err){
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(fans)
    })
});//добавлення

app.put('/Fans/:id',function(req,res){
    db.db().collection('fans').updateOne(
        {_id: ObjectID(req.params.id)},
        {$set:{name:req.body.name,feedback: req.body.feedback,date: req.body.date}},
        function(err,result){
            if(err){
                console.log(err)
                return res.sendStatus(500)
            }
            res.sendStatus(200)
        }
    )
});//обновлення

app.delete('/Fans/:id', function (req, res) {
    db.db().collection('fans').deleteOne(
        {_id: ObjectID(req.params.id)},
        function (err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    )
});


//MongoClient.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true })

MongoClient.connect('mongodb://localhost:27017/lab?useNewUrlParser=true',function(err,database){
    if(err){
        return console.log(err)
    }
    db = database;
    app.listen(3012,function(){
        console.log("Conect DB")
    });
});
