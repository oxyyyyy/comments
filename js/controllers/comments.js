(function(){

    angular
        .module("Comments")
        .controller("commentsCtrl", ['$scope', '$http', 'Backand', 'AuthService', CommentsController]);

    function CommentsController($scope, $http, Backand, AuthService){
        var vm = this;

        var baseUrl = Backand.getApiUrl() + '/1/objects/';
        var objectName = 'comments';

        vm.currentUser = AuthService.currentUser;

        vm.error = "";

        //---
        //postcomment-data
        vm.anonymous = false;
        vm.author = vm.currentUser.name || "";
        vm.text = "";
        vm.answerTo = {
                          id:"",
                          name:""
                      }; //accessable from commentslist

        vm.popoverOnAnon = {
            isOpen: true,
            templateUrl: 'myPopoverTemplate.html',
            close : function () {
                vm.popoverOnAnon.isOpen = false;
            },
            auth : function () {
                vm.popoverOnAnon.close();
                vm.showAuth()
            }
        };
        //---

        //---
        //postcomment-methods
        vm.clearError = clearError;

        vm.setAnonymousPost = setAnonymousPost;

        vm.initPostComment = initPostComment;
        vm.addComment = addComment;

        vm.showAuth = AuthService.showAuth;
        vm.logout = AuthService.logout;
        //---

        //---
        //commentlist-data
        vm.data = [];
        vm.commentsOnPage = 4;
        vm.commentsDisplayIndex = 0;
        //---

        //---
        //commentlist-methods
        vm.removeComment = deleteComment;
        vm.readComments = readCommentsList;
        vm.commentOnCreation = initComment;
        vm.allowUpdate = editComment;
        vm.saveUpdatedComment = updateComment;

        vm.setAnswerTo = setAnswerTo;

        vm.validateDate = validateDate;

        vm.setRows = textareaSetSize;

        vm.nextComments = nextComments;
        //---

        //---
        //postcomment-funcs
        function initPostComment() {
            vm.text = "";
            vm.author = "";
            vm.answerTo.name = "";
            vm.answerTo.id = "";
        }

        function setAnonymousPost() {
            vm.anonymous = true;
        }
        function addComment() {
            if(vm.currentUser.name != "" && vm.text != ""){
                sendToServer();
                vm.initPostComment();
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
                    anonymous: vm.anonymous,
                    in_answer_to: vm.answerTo.id
                },
                params: {
                    returnObject: true
                }
            }).then(function(response) {
                console.log(response.data);
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
        //---

        //---
        //commentlist-funcs
        Backand.on('comments_updated', function (data) {
            vm.readComments();
        });

        function errHandler(err) {
            console.error(err);
            vm.error = err.data;
            setTimeout(function() {
                vm.error = null;
            },2000);
        }

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
            vm.error = null;
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
            }, errHandler);
        }

        function deleteComment(singleComment) {
            return $http({
                method: 'DELETE',
                url : baseUrl + objectName + '/' + singleComment.id
            }).then(function(response) {
                return response.data;
            }, errHandler);
        };

        function nextComments(direction) {
            if(direction>0) {
                if((vm.data.length / vm.commentsOnPage) > vm.commentsDisplayIndex+1)
                    vm.commentsDisplayIndex++;
            }
            else {
                if (vm.commentsDisplayIndex > 0)
                    vm.commentsDisplayIndex--;
            }
        }

        function validateDate(date) {
            var newDate = new Date(date.toString());
            //newDate.setTime (newDate.getTime() - newDate.getTimezoneOffset()*60*1000 );
            return newDate.toString().slice(0,21);
        }

        function textareaSetSize(singleComment) {
            var comments = $('.commentPostedText');
            console.log(comments);
            for(var i = 0; i < comments.length; i++){
                var pos = 0;
                var rows = 1;
                while (true) {
                    var foundpos = (singleComment.comment).indexOf('\n', pos);
                    if (foundpos == -1) break;
                    rows += 1;
                    pos = foundpos + 1;
                }
                comments[i].rows = rows;
                console.log(rows);
            }
        }

        function setAnswerTo(singleComment) {
            vm.answerTo.name = singleComment.author;
            vm.answerTo.id = singleComment.id;
        }
        //---

        function clearError() {
            vm.error = null;
        }

    }
})();
