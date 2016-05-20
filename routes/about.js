
exports.about = function(req, res, next) {
  try{  
    res.render('about')
  }catch(err){
    return next(500) 
  }
};