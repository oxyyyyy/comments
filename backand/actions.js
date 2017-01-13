USER.onCreateAfter
    'use strict';
    function backandCallback(userInput, dbRow, parameters, userProfile) {

        if (parameters.sync)
            return {};

        var randomPassword = function (length) {
    	      if (!length) length = 10;
    	      return Math.random().toString(36).slice(-length);
    	  }
        if (!parameters.password) {
            parameters.password = randomPassword();
        }

        var backandUser = {
            password: parameters.password,
            confirmPassword: parameters.password,
            email: userInput.email,
            firstName: userInput.firstName,
            lastName: userInput.lastName,
            parameters: { "sync": true }
        };

        var x = $http({method:"POST",url:CONSTS.apiUrl + "1/user" ,data:backandUser, headers: {"Authorization":userProfile.token, "AppName":userProfile.app}});
        return { };
    }

COMMENT.onCreateBefore
    'use strict';
    function backandCallback(userInput, dbRow, parameters, userProfile) {
        var today = new Date();
        today.setDate(today.getDate());
        userInput.date = today;

        userInput.updated = false;

        if (userProfile.role == "Admin")
          return {};

        userInput.created_by = userProfile.userId;

        return {};
    }

COMMENT.onCreateAfter
    'use strict';
    function backandCallback(userInput, dbRow, parameters, userProfile) {
      socket.emitAll("comments_updated", userInput);
      return {}
    }

COMMENT.onUpdateBefore
    'use strict';
    function backandCallback(userInput, dbRow, parameters, userProfile) {
        var today = new Date();
        today.setDate(today.getDate());
        userInput.date = today;
        userInput.updated = true;
    	return {};
    }

COMMENT.onUpdateDuring
    'use strict';
    function backandCallback(userInput, dbRow, parameters, userProfile) {

        if (userProfile.role != "Admin"){
            if (!dbRow.created_by){
                throw new Error('Todo with no creator can\'t be changed.');
                return {};
            }

            if (dbRow.created_by != userProfile.userId) {
                throw new Error('You can only change your own todo.');
                return {};
            }
        }
        return {};
    }

COMMENT.onUpdateAfter
    'use strict';
    function backandCallback(userInput, dbRow, parameters, userProfile) {
      socket.emitAll("comments_updated", userInput);
      return {}
    }

COMMENT.onDeleteDuring
    'use strict';
    function backandCallback(userInput, dbRow, parameters, userProfile) {
        if (userProfile.role == "Admin")
            return {};

         if (!dbRow.created_by)
            throw new Error(typeof(userProfile.userId)+ " " + userProfile.userId);

        if (dbRow.created_by != userProfile.userId)
            throw new Error('You can only delete your own todo.');

        return {};
    }

COMMENT.onDeleteAfter
    'use strict';
    function backandCallback(userInput, dbRow, parameters, userProfile) {
      socket.emitAll("comments_updated", userInput);
      return {}
    }
