module.exports = function(app, db){
  app.get('/search', function(req, res){
    db.users.find(function(err, docs){
      res.render('search', {'users': docs});
    });
  });
};