/*
 * IIFE to keep code clean and safe
 */
(function(){

    /*
     * Declaration of main angular module for this appllication.
     *
     * It is named turtleFacts and has no dependencies (hence the
     * empty array as the second argument)
     */
    angular
      .module('Comments', ['backand'])
      .config(function (BackandProvider) {
        BackandProvider.setAppName('comments');
        BackandProvider.setSignUpToken('b129e2be-3559-417a-8e5c-1ed2cc9b7d9d');
        BackandProvider.setAnonymousToken('1f8c81a7-ee9a-4552-be54-294ed2380bc8');
        BackandProvider.runSocket(true);
      })

})();