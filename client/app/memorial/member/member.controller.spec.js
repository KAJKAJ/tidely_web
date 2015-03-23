'use strict';

describe('Controller: MemberCtrl', function () {

  // load the controller's module
  beforeEach(module('doresolApp'));

  var ProfileCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProfileCtrl = $controller('MemberCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
