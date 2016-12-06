angular.module('orderCloud')
    .config(MyAddressesConfig)
    .controller('MyAddressesCtrl', MyAddressesController)
;

function MyAddressesConfig($stateProvider) {
    $stateProvider
        .state('myAddresses', {
            parent: 'account',
            url: '/myAddresses',
            templateUrl: 'myAddresses/templates/myAddresses.tpl.html',
            controller: 'MyAddressesCtrl',
            controllerAs: 'myAddresses',
            resolve: {
                AddressList: function(OrderCloud) {
                    return OrderCloud.Me.ListAddresses();
                }
            }
        });
}

function MyAddressesController($state, toastr, $exceptionHandler, OrderCloud, MyAddressesModal, AddressList) {
    var vm = this;
    vm.list = AddressList;
    vm.create = function() {
        return MyAddressesModal.Create();
    };
    vm.edit = function(address){
        return MyAddressesModal.Edit(address);
    };

    vm.delete = function(addressID) {
        OrderCloud.Me.DeleteAddress(addressID)
            .then(function() {
                toastr.success('Address Deleted', 'Success');
                $state.go($state.current, {}, {
                    reload: true
                });
            })
            .catch(function(error) {
                $exceptionHandler(error);
            });
    };

}