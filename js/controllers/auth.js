(function(){
    angular
        .module("Comments")
        .controller("authCtrl", ['$http', 'Backand', 'AuthorizationData', 'AuthService', AuthController]);

        function AuthController($http, Backand, AuthorizationData, AuthService){
            var vm = this;

            var baseUrl = Backand.getApiUrl() + '/1/objects/';
            var objectName = 'users';

            vm.userData = AuthorizationData;

            vm.authorizate = authorization;
            vm.signIn = signIn;
            vm.signUp = signUp;


            function authorization(){
                vm.success = null;
                vm.error = null;
                if(vm.userData.want2reg){
                    vm.signIn();
                } else{
                    vm.signUp();
                }
            };

            function signUp() {
                AuthService.signup(vm.username, vm.lastName, vm.email, vm.pass)
                    .then(
                    function (response) {
                        //check status of the sign in
                        switch (response.data.currentStatus) {
                            case 1: // The user is ready to sign in
                                vm.userData.loggingIn();
                                break;
                            case 2: //The system is now waiting for the user to respond a verification email.
                                vm.success = 'Please check your email to continue';
                                break;
                            case 3: //The user signed up and is now waiting for an administrator approval.
                                vm.success = 'Please wait for the administrator to approve the sign up';
                                break;
                        }
                    }, showError
                );
            };

            function signIn() {
                AuthService.signin(vm.name, vm.pass)
                    .then(
                    function () {
                        vm.userData.loggingIn();
                    },
                    showError
                );
            };

            function showError(error) {
                vm.error = error && error.data || error.error_description || 'Unknown error from server';
            };

        }
})();
