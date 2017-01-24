(function(){

    angular
        .module("Comments")
        .controller("commentCtrl", ['$http', 'Backand', 'AuthService', CommentController]);

    function CommentController($http, Backand, AuthService){
        var vm = this;

        var baseUrl = Backand.getApiUrl() + '/1/objects/';
        var objectName = 'comments';

        vm.currentUser = AuthService.currentUser;

        vm.anonymous = false;
        vm.author = vm.currentUser.name || "";
        vm.text = "";

        vm.error = "";

        vm.clearError = clearError;

        vm.setAnonymousPost = setAnonymousPost;

        vm.initComment = initComment;
        vm.addComment = addComment;

        vm.showAuth = AuthService.showAuth;
        vm.logout = AuthService.logout;

        function initComment() {
            vm.text = "";
            vm.author = "";
        }

        function clearError() {
            vm.error = null;
        }

        function setAnonymousPost() {
            vm.anonymous = true;
        }
        function addComment() {
            if(vm.currentUser.name != "" && vm.text != ""){
                sendToServer();
                vm.initComment();
                vm.anonymous = false;
            } else {
                errHandler("Пустой комментарий");
            }
        };

        function sendToServer() {
            return $http({
                method: 'POST',
                url : baseUrl + objectName,
                data: {
                    author: vm.currentUser.name || vm.author,
                    comment: vm.text,
                    anonymous: vm.anonymous
                },
                params: {
                    returnObject: true
                }
            }).then(function(response) {
                return response.data;
            }, errHandler);
        };

        function errHandler(err) {
            console.error(err);
            vm.error = err.data || err;
            setTimeout(function() {
                vm.error = null;
            },2000);
        };
    }
})();
