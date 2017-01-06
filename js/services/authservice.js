(function () {
    angular.module('Comments')
        .service('AuthService', ['Backand', AuthService]);

    function AuthService(Backand) {

        var vm = this;
        self.currentUser = {};
        vm.logout = logout;
        vm.signin = signin;
        vm.signup = signup;

        loadUserDetails();

        function loadUserDetails() {

            return Backand.getUserDetails()
                .then(function (data) {
                    vm.currentUser.details = data;
                    if(data !== null)
                        vm.currentUser.name = data.userName;
                        vm.currentUser.email = data.email;
                });

        }

        function signin(username, password) {
            return Backand.signin(email, password)
                .then(function (response) {
                    loadUserDetails();
                    return response;
                });
        };

        function signup(firstName, lastName, email, password) {
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

        function logout() {
            Backand.signout().then(function () {
                angular.copy({}, vm.currentUser);
            });
        };

    }

}());
