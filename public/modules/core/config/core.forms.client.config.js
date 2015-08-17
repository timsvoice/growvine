'use strict';

// Setting up forms
angular.module('core').config(function(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'input',
      templateUrl: '/modules/core/views/forms/input.html'
    });
    formlyConfigProvider.setType({
      name: 'select',
      templateUrl: '/modules/core/views/forms/select.html'
    });
    formlyConfigProvider.setType({
      name: 'password',
      templateUrl: '/modules/core/views/forms/password.html'
    });
    formlyConfigProvider.setType({
      name: 'date',
      templateUrl: '/modules/core/views/forms/date.html'
    });
    formlyConfigProvider.setType({
      name: 'repeatSection',
      templateUrl: '/modules/core/views/forms/repeatSection.html',
      controller: function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;
        
        $scope.copyFields = copyFields;
        
        function copyFields(fields) {
          return angular.copy(fields);
        }
        
        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};
          if (lastSection) {
            newsection = angular.copy(lastSection);
          }

          repeatsection.push(newsection);
        }
      }
    });
});
