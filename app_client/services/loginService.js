'use strict';
app.factory('loginService', function ($http, $location, sessionService, $route, $window) {
    return {
        login: function (data, pass) {
            var $promise = $http.post('login/login.php', {
                username: data,
                password: pass
            });
            $promise.then(function (msg) {
                var uid = msg.data
                //console.log(msg);
                if (uid) {
                    sessionService.set('uid', JSON.stringify(uid))
                    alert('¡Logueado con éxito!')
                    $location.path('/home')
                    $window.location.reload()
                } else {
                    alert('Usuario/pass incorrecto')
                    $location.path('/login')
                    $window.location.reload()
                }
            });
        },
        logout: function () {
            //sessionService.destroy('uid');
            var $promise = $http.get('/api/logout')
            $promise.then(function (data) {
                console.log(data)
                $location.path('/login')
                $window.location.reload()
            })

            return $promise
        },
        islogged: function () {
            var $promise = $http.get('/api/obtenerRol')
            return $promise
        }
    }

});
