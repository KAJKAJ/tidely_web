'use strict';

describe('Controller: MemorialCtrl', function () {

  // load the controller's module
  beforeEach(module('doresolApp'));

  var MemorialCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MemorialCtrl = $controller('MemorialCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
