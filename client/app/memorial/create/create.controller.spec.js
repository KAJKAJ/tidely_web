'use strict';

describe('Controller: MemorialCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('doresolApp'));

  var CreateCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateCtrl = $controller('CreateCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
