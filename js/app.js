(function(){
    angular.module('myDirectives', [])
           .directive('contenteditable', function () {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model

                // Specify how UI should be updated
                ngModel.$render = function () {
                    element.html(ngModel.$viewValue || '');
                };

                // Listen for change events to enable binding
                element.on('blur keyup change', function () {
                    scope.$apply(readViewText);
                });

                // No need to initialize, AngularJS will initialize the text based on ng-model attribute

                // Write data to the model
                function readViewText() {
                    var html = element.html();
                    // When we clear the content editable the browser leaves a <br> behind
                    // If strip-br attribute is provided then we strip this out
                    if (attrs.stripBr && html == '<br>') {
                        html = '';
                    }
                    ngModel.$setViewValue(html);
                }
            }
        };
    });

    angular
        .module('Comments', ['backand', 'myDirectives'])
        .config(function (BackandProvider) {
            BackandProvider.setAppName('comments');
            BackandProvider.setSignUpToken('b129e2be-3559-417a-8e5c-1ed2cc9b7d9d');
            BackandProvider.setAnonymousToken('1f8c81a7-ee9a-4552-be54-294ed2380bc8');
            BackandProvider.runSocket(true);
            BackandProvider.runSigninAfterSignup(true);
        })
})();
