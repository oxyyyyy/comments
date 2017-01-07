(function () {
    angular.module('Comments')
        .service('AuthService', ['Backand', AuthService]);

    function AuthService(Backand) {

        var vm = this;
        vm.currentUser = {};

        loadUserDetails();

        function loadUserDetails() {

            return Backand.getUserDetails()
                .then(function (data) {
                    vm.currentUser.details = data;
                    if(data !== null)
                        vm.currentUser.name = data.email;
                });

        }

        vm.getSocialProviders = function () {
            return Backand.getSocialProviders()
        };

        vm.socialSignin = function (provider) {
            //by default Backand doesn't run sign-in if the user is not sign-up, the 4th parameter true force it to
          // sign-up the user
            return Backand.socialSignin(provider, null, true)
                .then(function (response) {
                    loadUserDetails();
                    return response;
                });
        };

        vm.socialSignup = function (provider, email) {
            return Backand.socialSignUp(provider, null, null, email)
                .then(function (response) {
                  loadUserDetails();
                  return response;
                });
        };

        vm.signin = function (email, password) {
            return Backand.signin(email, password)
                .then(function (response) {
                    loadUserDetails();
                    return response;
                });
        };

        vm.signup = function (firstName, lastName, email, password) {
            return Backand.signup(firstName, lastName, email, password, password)
                .then(function (signUpResponse) {
                    if (signUpResponse.data.currentStatus === 1) {
                        return vm.signin(email, password)
                            .then(function () {
                                return signUpResponse;
                            });

                    } else {
                        return signUpResponse;
                    }
                });
        };

        vm.changePassword = function (oldPassword, newPassword) {
            return Backand.changePassword(oldPassword, newPassword)
        };

        vm.requestResetPassword = function (email) {
            return Backand.requestResetPassword(email)
        };

        vm.resetPassword = function (password, token) {
            return Backand.resetPassword(password, token)
        };

        vm.logout = function () {
            Backand.signout().then(function () {
                angular.copy({}, vm.currentUser);
            });
        };

    }

}());
