//┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
  //  All controller code for our angular application.
  //  These handle the models (variables/data) that interact with our views
  //
  //  CompanyControl      (dashboard)
  //    ►stuff here 
  //  UserControl         (dashboard)
  //  JobControl          (dashboard)
  //  NotificationControl (dashboard)
  //  DetailControl       (jobDetail)
  //  NewJobControl       (newJob)
  //  HeaderControl       (header)
  //  LoginControl        (header)
  //  RegisterControl     (register)
  //  TestControl         (test)
  //
  //  Notes:
  //
  //  Todo:
  //    -Everything...
  //    - NotificationControl: when we create "crendentials" variable, and ParseJWT() we first need
  //      to verify there actually is a token, otherwise it will spit out an error to the console.
  //
//└───────────────────────────────────────────────────────────────────────────────────────────────────┘

console.log("controllers.js loaded ok thanks");
angular.module('anguApp')
.controller('BodyControl', ['$scope', '$state', function($scope, $state) {
    // Allows us to set a background image based on which $state we are in.
    // For now, we are only showing a background image on the Welcome page.
    $scope.getBackground = function() {
      if ($state.current.name === 'app') {
        return 'images/sup.jpg';
      } 
      else {
        return '';
      }
    }
}])
.controller('CompanyControl', ["$scope", "$stateParams", "apexFactory", function(sc, $stateParams, apexFactory) {
  console.log("companycontrol loaded ok thanks");
  //Error handling
  //0=Loading, 1=Success, -1=Failed
  sc.companiesLoaded = 0;
  sc.message = "Loading companies...";

  //untested
  sc.GetOpenJobsCount = function(company)
  {
    if(!company.jobs || company.jobs.length < 1)
      return 0;

    var count = 0;
    for(var i = 0; i < company.jobs.length; i++)
      if(company.jobs[i].status != "Cancelled" && company.jobs[i].status != "Complete")
        count++;

    return count;
  }
  apexFactory.GetCompanies().query(
    function(response) { sc.companies = response; sc.companiesLoaded = 1;},
    function(response) { sc.message = "Error loading Users: " + response.status + " " + response.statusText; sc.companiesLoaded = -1; });
}])

.controller('UserControl', ["$scope", "$stateParams", "apexFactory", function(sc, $stateParams, apexFactory) {
  console.log("UserControl loaded ok thanks");
  sc.users = [];
  //Error handling
  //0=Loading, 1=Success, -1=Failed
  sc.usersLoaded = 0;
  sc.message = "Loading users...";

  sc.users = apexFactory.GetUsers().query(
    function(response) { sc.users = response; sc.usersLoaded = 1;},
    function(response) { sc.message = "Error loading Users: " + response.status + " " + response.statusText; sc.usersLoaded = -1; });

  sc.LoadUser = function()
  {
    sc.user = apexFactory.GetUsers().get({_id:$stateParams._id})
      .$promise.then(
        function(response) { },
        function(response) { });
  }
  sc.SaveUser = function(data, _id)
  {
    //sc.user not updated yet
    //angular.extend(sc.users[index], data)
    console.log("Going to save new data for user ID# ", _id);
    //put to server
    apexFactory.GetUsers().Update({_id:_id}, data);
  };
  sc.DeleteUser = function(_id)
  {

    console.log("Going to delete user with ID# ", _id);
  };
}])

.controller('JobControl', ["$scope", "$stateParams", "apexFactory", function(sc, $stateParams, apexFactory) {
  console.log("jobControl loaded ok thanks");
  sc.jobs = {};
  //Error handling
  //0=Loading, 1=Success, -1=Failed
  sc.jobsLoaded = 0;
  sc.message = "Loading...";

  sc.jobs = apexFactory.GetJobs().query(
     function(response) { sc.jobs = response; sc.jobsLoaded = 1;},
     function(response) { sc.message = "Error loading Jobs: " + response.status + " " + response.statusText; sc.jobsLoaded = -1});
  
  
  sc.LoadJob = function()
  {
    sc.jobs = apexFactory.GetJobs().get({_id:$stateParams._id})
      .$promise.then(
        function(response) { },
        function(response) { });
  }
  sc.SaveJob = function(data, _id)
  {
    //sc.user not updated yet
    //gular.extend(sc.jobs[index], data)
    //var id = sc.jobs[index]._id;
    console.log("Going to save new data for job ID# ", _id);
    console.log(JSON.stringify(data, undefined, 2));
    console.log("^ json stringify ==== v log string");
    console.log(data);
    //put to server
    apexFactory.GetJobs().Update({_id:_id}, data);

  };
  sc.DeleteJob = function(_id)
  {
    console.log("Going to delete job with ID# ", _id);

  };

   // sc.statuses = [
   //  {'Pending'},
   //  {'Postponed'},
   //  {'Cancelled'},
   //  {'Complete'}];

  sc.statuses = ['Pending', 'Cancelled', 'Complete', 'Postponed', 'In-progress'];
  sc.ShowStatus = function(job) 
  {
    return (job.status);
  };  
}])

.controller('NotificationControl', ["$scope", "$stateParams", "apexFactory", "AuthFactory", function(sc, $stateParams, apexFactory, AuthFactory) {
  console.log("loaded notification controller");
  sc.notifications = {};
  sc.unclaimedUsers = {};  
  //Error handling
  //0=Loading, 1=Success, -1=Failed
  sc.notificationsLoaded = 0;
  sc.message = "Loading...";

  //Check if we're an admin so know to get unclaimed users/jobs
  var credentials = AuthFactory.ParseJwt();


  apexFactory.GetNotifications().query(
     function(response) { sc.notifications = response; sc.notificationsLoaded = 1; },
     function(response) { console.log("notify error: ", response); sc.message = "Error loading notifications: " + response.status + " " + response.statusText; sc.notificationsLoaded = -1});
  
  //For admin only...
  if(credentials.admin)
  {
    apexFactory.GetUnclaimedUsers().query(
       function(response) { sc.unclaimedUsers = response; sc.notificationsLoaded = 1; },
       function(response) { sc.message = "Error loading unclaimed users: " + response.status + " " + response.statusText; sc.notificationsLoaded = -1});
  }

  sc.DeleteNotifications = function()
  {
    apexFactory.GetNotifications().Delete(
      function(response) { alert("Success"); alert(JSON.stringify(response, undefined, 2)); },
      function(response) { alert("FAILURE"); alert(JSON.stringify(response, undefined, 2)); });
  };
}])

.controller('DetailControl', ["$scope", "$stateParams", "apexFactory", function(sc, $stateParams, apexFactory) {
  //console.log("Loading page for DB entry # ", $stateParams._id);
  sc.type = "Loading";
  sc.details;


  sc.LogDetails = function(_id)
  {
    _id = $stateParams._id;
    if(!_id) 
    { 
      //We somehow got here without an _id, the user should just be re-directed to the homepage [?]
      console.log("No ID provided to search with.");

    }
    else
    {

      apexFactory.GetDetails().query({_id:_id}).$promise.then(
        function(response) 
        { 
          // Response returns an array of data
          //response[0] = {type: "User"} or "Job" or "Company"
          //response[1] = Object data

          //So this is kinda interesting. My server is responding with JSON:
            //res.json(data) .. an array of JSON to be specific
            //Anywho, that appears to be automatically parsed into a Javascript object
            //Evident by the code below, showing I can grab a properties value 
            //without having to first parse my response

          // console.log("response[0] RAW: ", response[0]);
          // console.log("response[0].type: ", response[0].type);
          // console.log("response[1] RAW: ", response[1]);
          // console.log("response[1]._id: ", response[1]._id);

          sc.type = response[0].type;

          if(sc.type == "Failed")
          {
            console.log("Database search returned no results.");
            //
          }
          else
          {
            sc.details = response[1];
          }

        },
        function(response) { console.log("The database call was unsuccessful: ", response.status + " " + response.statusText); }
      );
    }
  }

  sc.LogDetails($stateParams._id);
}])

.controller('NewJobControl', ['$scope', function(sc){
  console.log("loaded new job controller");

  //This variable is our model.
  //We can actually add new fields/properties to this object from within the angular HTML code
  //Not everything has to be defined here :0
  sc.newjob = {jobname:"", lotnumber:"", floorplan:""};
  sc.SubmitNewJob = function() { alert("lol"); };
}])

.controller('HeaderControl', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

  $scope.loggedIn = false;
  $scope.username = '';

  if(AuthFactory.IsAuthenticated())
  {
    $scope.loggedIn = true;
    $scope.username = AuthFactory.GetUsername();
  }

  $scope.OpenLogin = function() { 
    ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller: "LoginControl"}); };


  $scope.LogOut = function() 
  {
      AuthFactory.Logout();
      $scope.loggedIn = false;
      $scope.username = '';
  };

  $scope.StateIs = function(currentState) { return $state.is(currentState); };


  //Event handler/listener for a rootScope BROADCAST
  $rootScope.$on('login:Successful', function() {
    $scope.loggedIn = AuthFactory.IsAuthenticated();
    $scope.username = AuthFactory.GetUsername();
  });

  $rootScope.$on('registration:Successful', function() {
    $scope.loggedIn = AuthFactory.IsAuthenticated();
    $scope.username = AuthFactory.GetUsername();
  });
}])

.controller('LoginControl', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    //this should be encrypted
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.Login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.DoRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.Register($scope.registration);
        
        ngDialog.close();

    };
}])

.controller('TestControl', ['$scope', '$localStorage', "apexFactory", function(sc, $localStorage, apexFactory){
  console.log("loaded test controller");
  sc.notes = [];
   apexFactory.GetTestData().query().$promise.then(
    function(response) { sc.notes = response; 
      console.log(response);
      console.log(sc.notes[0].body);
      console.log(sc.notes[1].body);


    },
    function(response) { alert("Error loading Users: " + response.status + " " + response.statusText); });




}])

.controller('RequestController', ['$scope', 'apexFactory', 'AuthFactory', '$localStorage', function(sc, apexFactory, AuthFactory, $localStorage) {

  // Controller for sending a new inquiry. This can probably go in NotificationController later.
  // TODO: Have request.company, .name, and .email populate automatically when user is logged in.

  sc.request = {
    company: "",
    name: "",
    email: "",
    comment: ""
  }

  // If user is logged in, fill in sc.request details automatically.
  if(sc.$parent.loggedIn) {
    console.log('Accessing sc.$parent.loggedIn.');

    // Parse the token to get userId.
    var credentials = AuthFactory.ParseJwt();
    var myDetails = {};

    apexFactory.GetUsers().get({_id: credentials._id}).$promise.then(
      function(response) {
        myDetails = response; 
        console.log('User details: ', myDetails);

        sc.request.company = myDetails.company;
        sc.request.name = myDetails.firstname + ' ' + myDetails.lastname;
        sc.request.email = myDetails.username;
      },
      function(response) {
        console.log('you are bad');
      }
    );
  }

  sc.postRequest = function() {
    console.log('Submitted request: ', sc.request);
    alert(JSON.stringify(sc.request, undefined, 2));
  }

  function init_map() {

    console.log('Creating Google Map.');
    var location = new google.maps.LatLng(47.900268, -122.296205); // Pac West latitude/longitude.

    var mapoptions = {
      center: location,
      zoom: 16,
      scrollwheel: false,
      draggable: false,
      mapTypeId:google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('googleMap'), mapoptions);

    var marker = new google.maps.Marker({
      position: location
    });

    marker.setMap(map);
  }
  
  init_map();

}]);