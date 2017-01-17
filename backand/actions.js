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
                throw new Error('Комментарий без автора не может быть изменен.');
                return {};
            }

            if (dbRow.created_by != userProfile.userId) {
                throw new Error('Вы не являетесь автором этого комментария');
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
            throw new Error('Комментарий без автора не может быть удален.');

        if (dbRow.created_by != userProfile.userId)
            throw new Error('Вы не являетесь автором этого комментария');

        return {};
    }

COMMENT.onDeleteAfter
    'use strict';
    function backandCallback(userInput, dbRow, parameters, userProfile) {
      socket.emitAll("comments_updated", userInput);
      return {}
    }
