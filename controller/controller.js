var models = require('../model/model.js');
var path = require('path');
var bodyParser = require('body-parser');



module.exports = function (app,io){
    app.use( bodyParser.json() );
    app.use(bodyParser.urlencoded({     
        extended: true
    }));
    
    app.get('/',function(req,res){
        res.sendFile(path.resolve(__dirname+"/../web/app/index.html"));
    });
    
    app.post('/register',function(req,res){
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Method","'GET, POST, OPTIONS, PUT, PATCH, DELETE'");
        var user={
            "name":req.body.name,
            "password":req.body.password,
            "email":req.body.email,
        };

        models.user.findOne({"name":req.body.name},function(err,_user){
            if(err){
                res.json(err);
            }
            if(_user === null){
                models.user.findOne({"email":req.body.email},function(err,_user){
                    if(err){
                        res.json(err);
                    }
                    if(_user === null){
                        models.user.create(user,function(err,_user){
                            if(err) res.json(err);
                            else{
                                res.send(_user);
                            }
                        });
                    }else{
                        res.json({error: 'Користувач з данним email вже існує'});
                    }
                });
            }else{
                res.json({error: 'Такий логін вже існує'});
            }
        })

    });

    var handle=null;

    app.post('/login',function(req,res){
        console.log(req.body.handle);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Method","'GET, POST, OPTIONS, PUT, PATCH, DELETE'");
        handle = req.body.handle;
        models.user.findOne({"name":req.body.name, "password":req.body.password},function(err,user){
            if(err){
                res.send(err);
            }
            if(user === null){
                res.send({error: 'Невірний логін чи пароль'});
            }
            else{
                res.send(user);
            }

    });
    });

    var connections = {},
        user_connect = {},
        users = {},
        group_mesages = [];

    io.on('connection',function(socket){

        socket.on('user_connect', function(_user){
            models.user.findOne({_id: _user.id}, function (error, user) {
                if(error){
                    console.log(error);
                    return;
                }

                console.log("Connection : " +socket.id + ' by user: ' + _user.id);

                connections[socket.id] = _user.id;
                user_connect[_user.id] = socket.id;

                users[_user.id] = {
                    _id: user.id,
                    name: user.name,
                    friends: user.friends
                };

                io.sockets.emit('user_online', users);
                io.sockets.emit('group_messages', group_mesages);

                models.messages
                    .find({$or: [{receiver_id: _user.id}, {sender_id: _user.id}]})
                    .sort({date: 1})
                    .exec(function(error, data){
                        if(error){
                            console.log('MONGO DB error: '+ error);
                            return;
                        }

                        var messages = {};

                        data.map(function(msg, index) {
                            var key = msg.sender_id;

                            if(msg.sender_id === _user.id){
                                key = msg.receiver_id
                            }

                            if(!messages[key])
                                messages[key] = [];

                            messages[key].push(msg);
                        });
                        io.to(socket.id).emit('private_messages', messages);
                    })
            })
        });

        socket.on('group_message', function(msg) {
            group_mesages.push(msg);
            io.sockets.emit('new_group_message', msg);
        });

        socket.on('private_msg', function(msg) {
            msg.is_read = false;
            var connect = user_connect[msg.receiver_id];

            models.messages.create(msg, function (error) {
               if(error)
                   console.error(error);
                else if(connect){
                   io.to(connect).emit('new_private_msg', msg);
                   io.to(socket.id).emit('new_private_msg', msg);

               }
            });

        });

        socket.on('disconnect', function(){
            var user_id = connections[socket.id];
            delete users[user_id];
            delete user_connect[user_id];
            console.log('Disconnect ' + socket.id);
            io.sockets.emit('user_online', users);
        });
    });
//
//     app.post('/friend_request',function(req,res){
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.setHeader("Access-Control-Allow-Method","'GET, POST, OPTIONS, PUT, PATCH, DELETE'");
//         friend=true;
//         services.user.find({"handle" : req.body.my_handle,"friends.name":req.body.friend_handle},function(err,doc){
//             if(err){res.json(err);}
//             else if(doc.length!=0){
//                 console.log("Friend request : "+doc.length);
//                 console.log("Friend request : friend request already sent "+doc);
//                 res.send("Friend request already sent ");
//             }
//             else{
//                 console.log("Friend request : "+doc.length);
//                 services.user.update({
//                     handle:req.body.my_handle
//                 },{
//                     $push:{
//                         friends:{
//                             name: req.body.friend_handle,
//                             status: "Pending"
//                         }
//                     }
//                 },{
//                     upsert:true
//                 },function(err,doc){
//                     if(err){res.json(err);}
//                     //            else{
//                     //                console.log(doc);
//                     //            }
//                 });
//                 io.to(users[req.body.friend_handle]).emit('message', req.body);
//             }
//         });
//     });
//
//     app.post('/friend_request/confirmed',function(req,res){
//         console.log("friend request confirmed : "+req.body);
//         if(req.body.confirm=="Yes"){
//             services.user.find({
//                 "handle" : req.body.friend_handle,
//                 "friends.name":req.body.my_handle
//             },function(err,doc){
//                 if(err){
//                     res.json(err);
//                 }
//                 else if(doc.length!=0){
//                     console.log("Friend request confirmed : "+doc.length);
//                     console.log("Friend request confirmed : friend request already sent "+doc);
//                     res.send("Friend request already accepted");
//                 }
//                 else{
//                     services.user.update({
//                         "handle":req.body.my_handle,
//                         "friends.name":req.body.friend_handle
//                     },{
//                         '$set':{
//                             "friends.$.status":"Friend"
//                         }
//                     },function(err,doc){
//                         if(err){res.json(err);}
//                         else{
//
//                             console.log("friend request confirmed : Inside yes confirmed");
//                             io.to(users[req.body.friend_handle]).emit('friend', req.body.my_handle);
//                             io.to(users[req.body.my_handle]).emit('friend', req.body.friend_handle);
//                         }
//                     });
//                     services.user.update({
//                         handle:req.body.friend_handle
//                     },{
//                         $push:{
//                             friends:{
//                                 name: req.body.my_handle,
//                                 status: "Friend"
//                             }
//                         }
//                     },{upsert:true},function(err,doc){
//                         if(err){res.json(err);}
//                         //            else{
//                         //                console.log(doc);
//                         //            }
//                     });
//                 }
//             });
//         }
//         else{
//
//             console.log("friend request confirmed : Inside No confirmed");
//             services.user.update({
//                 "handle":req.body.my_handle
//             },{
//                 '$pull':{
//                     'friends':{
//                         "name":req.body.friend_handle,
//                     }
//                 }
//             },function(err,doc){
//             if(err){res.json(err);}
//             else{
//                 console.log("No");
//             }
//         });
//         }
//     });
    
};