'use strict';

describe('Directive: mainContentainer', function () {

  // load the directive's module
  beforeEach(module('chatApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<main-contentainer></main-contentainer>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mainContentainer directive');
  }));
});
