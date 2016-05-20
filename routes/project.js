/*Project controller*/
var pug = require('pug')

/* Project Get all projects api */
exports.list = function(req, res, next) {

	req.collections.projects.find({}, {sort: {"index":-1}}).toArray(function(error, projects){
      if (error) return next(404)
      
      try{
        res.send({projects: projects})
      }catch(err){
        return next(500) 
      }
  })
};

/* Project Get selectedProject api*/
exports.loadProject = function(req, res, next){
	req.collections.projects.find({}, {sort: {"index":-1}}).toArray(function(error, projects){
    if (error) return next(500)
    
    var selectedProject = projects.filter(function(v) {
      return v.url === 'projects/' + req.params.projectUrl
    })[0]
    
    if(selectedProject){
      try{
        res.send(pug.renderFile('./views/projects/' + req.params.projectUrl + '.jade', {selectedProject:selectedProject}))
      } catch(err){
        return next(500) 
      }
    }
  })
};




