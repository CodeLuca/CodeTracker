module.exports = function(app, db) {
	app.get('/login', function(req, res){
		res.render('login')
	});

	app.get('/logout', function(req, res){
    delete req.session.username;
    res.redirect('/login');
	});

	app.post('/register', function(req, res){
		db.users.find({
			'username': req.body.username
		}, function(err, docs){
			if(docs[0]){
				res.render('login', {'err': 'User already exists.'})
			} else {
				cont();
			}
		});

		function cont(){
			var obj = {
				'username': req.body.username,
				'password': req.body.password,
				'score': 0,
				'skills': [],
				'projects': [],
				'voteList': []
			}
			db.users.insert(obj, function(err){
		    res.render('login', {err: 'You were registered successfully! Please login.'})
			});
		};
	});

	app.post('/login', function(req, res){
		if(req.session.username){
			res.redirect('/home');
		}
		var user = req.body.username;
		var pass = req.body.password;
		db.users.find({
			'username': user,
			'password': pass
		}, function(err, docs){
			if(err != null) {
				console.log(err); 
				return;
			}
			if(!docs[0]){
				res.render('login', {'err': 'Incorrect Username or Password'}); return;
			} else {
				req.session.username = user;
				res.redirect('/home')
			}
		});
	});
};