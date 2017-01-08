(function(){

     angular
        .module("Comments")
        .controller("commentsListCtrl", ['$http', 'Backand', 'AuthService', CommentListController]);

     function CommentListController($http, Backand, AuthService){

        var vm = this;

        var baseUrl = Backand.getApiUrl() + '/1/objects/';
        var objectName = 'comments';

        vm.data = [];

        vm.currentUser = AuthService.currentUser;

        vm.removeComment = deleteComment;
        vm.readComments = readCommentsList;
        vm.commentOnCreation = initComment;
        vm.allowUpdate = editComment;
        vm.saveUpdatedComment = updateComment;

        Backand.on('comments_updated', function (data) {
            vm.readComments();
        });

        function readCommentsList() {
            return $http({
                method: 'GET',
                url: baseUrl + objectName
            }).then(function(response) {
                return response.data.data;
            }).then(function(data){
                vm.data = data;
            });
        };

        function initComment() {
            vm.data.editable = false;
        };

        function editComment(singleComment){
            singleComment.editable = true;
        };

        function updateComment(singleComment) {
            singleComment.editable = false;
            return $http({
                method: 'PUT',
                data: {
                    author: singleComment.author,
                    comment: singleComment.comment
                },
                url: baseUrl + objectName + '/' + singleComment.id
            }).then(function (response) {
                return response.data;
            });
        }

        function deleteComment(singleComment) {
            console.log('deleted');
            return $http({
                method: 'DELETE',
                url : baseUrl + objectName + '/' + singleComment.id
            }).then(function(response) {
                return response.data;
            });
        };
    };
})();
