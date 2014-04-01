'use strict';

describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('bulletiiniApp'));

    var MainCtrl,
        scope,
        $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/bulletins/all')
            .respond(['Bulletin 1', 'Bulletin 2', 'Bulletin 3', 'Bulletin 4']);
        scope = $rootScope.$new();
        MainCtrl = $controller('MainCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of bulletins to the scope', function () {
        expect(scope.bulletins).to.be.an('undefined');
        $httpBackend.flush();
        expect(scope.bulletins.length).to.equal(4);
    });
});
