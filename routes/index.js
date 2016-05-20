/*Index controller*/

/* require other controllers here */
exports.project = require('./project')
exports.about = require('./about')

/* Get index */
exports.index = function(req, res, next){
  try{  
    res.render('index')
  }catch(err){
    return next(500) 
  }
}
