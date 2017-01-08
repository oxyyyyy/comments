(function(){

    angular
        .module("Comments")
        .controller("commentCtrl", ['$http', 'Backand', 'AuthService', CommentController]);

    function CommentController($http, Backand, AuthService){
        var vm = this;

        var baseUrl = Backand.getApiUrl() + '/1/objects/';
        var objectName = 'comments';

        vm.currentUser = AuthService.currentUser;

        vm.text = "";

        vm.addComment = addComment;
        vm.logout = AuthService.logout;

        function addComment() {
          if(vm.currentUser.name != "" && vm.text != ""){
            sendToServer();
            vm.text = "";
          }
        };

        function sendToServer() {
            return $http({
                method: 'POST',
                url : baseUrl + objectName,
                data: {
                    author: vm.currentUser.name,
                    comment: vm.text
                },
                params: {
                    returnObject: true
                }
            }).then(function(response) {
                return response.data;
            });
        };
    }
})();
