'use strict';
app.factory('loginService',function($http, $location, sessionService, $route, $window){
	return{
		login:function(data,pass,scope){
			var $promise=$http.post('login/login.php',{username: data,password:pass});
			$promise.then(function(msg){
				var uid = msg.data;
                console.log(msg);
				if(uid){
					//scope.msgtxt='Correct information';
					sessionService.set('uid', JSON.stringify(uid));
                    alert('¡Logueado con éxito!');
					$location.path('/home');
                    $window.location.reload();
				}	       
				else  {
					//scope.msgtxt='incorrect information';
                    alert('Usuario/pass incorrecto');   
					$location.path('/login');
                    $window.location.reload();
				}				   
			});
		},
		logout:function(){
			sessionService.destroy('uid');
			$location.path('/login');
            $window.location.reload();
		},
		islogged:function(){
			var $checkSessionServer=$http.post('check_session.php');
			return $checkSessionServer;
			/*
			if(sessionService.get('user')) return true;
			else return false;
			*/
		}
	}

});