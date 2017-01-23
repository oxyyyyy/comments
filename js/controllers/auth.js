'use strict';
(function () {

    angular.module('Comments')
        .controller('authCtrl', ['AuthService', AuthController]);

    function AuthController(AuthService) {

        var vm = this;

        vm.AuthService = AuthService;
        vm.appName = AuthService.appName;
        vm.error = '';

        vm.authenticate = function () {
            vm.AuthService.authError = null;

            if (vm.AuthService.newUser) {
                vm.signup();
            } else {
                vm.signin();
            }
        };

        vm.signup = function () {

            AuthService.signup(vm.firstName, "", vm.username, vm.password)
                .then(
                function (response) {
                    //check status of the sign in
                    console.log(response)
                    if(!vm.AuthService.authError) {
                        $('.authBox').modal('hide');
                        vm.firstName = "";
                        vm.username = "";
                        vm.password = "";
                    }
                }, showError);
        };

        vm.signin = function () {
            AuthService.signin(vm.username, vm.password)
                .then(function (){
                    if(!vm.AuthService.authError) {
                        $('.authBox').modal('hide');
                        vm.firstName = "";
                        vm.username = "";
                    }
                }, showError);
            vm.password = "";
        };

        function showError(error) {
            console.error(error);
            vm.AuthService.authError = error.error_description;
        }

    }


})();
