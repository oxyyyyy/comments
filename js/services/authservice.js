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
                        vm.currentUser.name = data.firstName;
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

        vm.socialSignup = function (provider, username) {
            return Backand.socialSignUp(provider, null, null, username)
                .then(function (response) {
                  loadUserDetails();
                  return response;
                });
        };

        vm.signin = function (username, password) {
            return Backand.signin(username, password)
                .then(function (response) {
                    loadUserDetails();
                    return response;
                }, function (error) {
      console.log(error);
    });
        };

        vm.signup = function (firstName, lastName, username, password) {
            return Backand.signup(firstName, lastName, username, password, password)
                .then(function (signUpResponse) {
                    if (signUpResponse) {
                        return vm.signin(username, password)
                            .then(function () {
                                return signUpResponse;
                            });

                    } else {
                        return signUpResponse;
                    }
                }, function (error) {
                  console.log(error);
            });
        };

        vm.changePassword = function (oldPassword, newPassword) {
            return Backand.changePassword(oldPassword, newPassword)
        };

        vm.requestResetPassword = function (username) {
            return Backand.requestResetPassword(username)
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
