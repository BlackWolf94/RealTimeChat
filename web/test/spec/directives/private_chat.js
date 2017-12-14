'use strict';

describe('Directive: privateChat', function () {

  // load the directive's module
  beforeEach(module('chatApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<private-chat></private-chat>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the privateChat directive');
  }));
});
