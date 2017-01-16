// require express
var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
// create the express app
var app = express();
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.urlencoded({ extended: true }));
// static content
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route to render the index.ejs view
app.get('/', function(req, res) {
 res.render("index");
})

// tell the express app to listen on port 8000
var server =app.listen(3000, function() {
 console.log("listening on port 3000");
});
// this is a new line we're adding AFTER our server listener
// take special note how we're passing the server
// variable. unless we have the server variable, this line will not work!!
var io = require('socket.io').listen(server);
var user ={};
var users ={};

io.sockets.on('connection', function(socket){
	console.log('connection io');
	console.log('socket id is ', socket.id);
	socket.emit('user_list', users);
	socket.on('new_user', function(data){
		users[data] = socket.id;
		console.log(users);
		console.log(data + " is using socket " + socket.id);
		user.name = data
		user.id = socket.id;
		console.log(user);
		io.emit('add_user', {user: user.name, id: user.id});
	})
	socket.on('text_submitted', function(data){
		console.log('incoming: ',data, 'came from id', socket.id);
		io.emit('update_user_chat_box', {id: socket.id, text: data});
	})

	socket.on('disconnect', function(){
		console.log(socket.id);
		// console.log('before delete ', users);
		// var deleted_user = socket.id
		var name;
		var deletedId;
		console.log(users);
		for(id in users){
			if(users[id] == socket.id){
				name = id;
				deletedId = socket.id;
				console.log('I am going to delete', name) ;

				delete users[id];
	
			}
		}
		console.log('name', name,'id', deletedId);
		// console.log('after', user);
		io.emit('delete_user', {name: name, id: deletedId});

	})	

});

