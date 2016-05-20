function addProjectList(){
  
  $.ajax({
  url: '/api/projects/',
  type: 'GET',
  contentType: 'application/json',
    success: function(dataResponse, status, xhr) {
      for(var i in dataResponse.projects){
        document
        .getElementById('projectSidebarList')
        .innerHTML +=  "<a class=\"button icon fa-file\" onclick=\"getSelectedProject('"+dataResponse.projects[i].url+"')\">"+dataResponse.projects[i].name+"</a>"
      }
    }
  })
}

function getSelectedProject(projectUrl){

  $('#projectContent').empty()

  $('html, body').animate({
        scrollTop: $("#header-wrapper").offset().top
  }, 500);
    
  $.ajax({
    url: './api/' + projectUrl,
    type: 'GET',
    contentType: 'application/json',
      success: function(dataResponse, status, xhr) {
        document
        .getElementById('projectContent')
        .innerHTML +=  dataResponse
      }
    })
}