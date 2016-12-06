angular.module('orderCloud')
    .factory('MyAddressesModal', MyAddressesModalFactory)
    .controller('CreateAddressModalCtrl', CreateAddressModalController)
    .controller('EditAddressModalCtrl', EditAddressModalController)
;

function MyAddressesModalFactory($state, $uibModal, toastr) {
    return {
        Create: _create,
        Edit: _edit
    };

    function _create() {
        var createAddressModalInstance = $uibModal.open({
            templateUrl: 'myAddresses/templates/myAddresses.create.modal.tpl.html',
            controller: 'CreateAddressModalCtrl',
            controllerAs: 'createAddress',
            size: 'md'
        });

        createAddressModalInstance.result.then(function() {
            toastr.success('Address Created', 'Success');
            $state.go($state.current, {}, {
                reload: true
            });
        }, function() {
            console.log('create address cancelled');
        });
    }

    function _edit(address) {
        var addressCopy = angular.copy(address);
        var editAddressModalInstance = $uibModal.open({
            templateUrl: 'myAddresses/templates/myAddresses.edit.modal.tpl.html',
            controller: 'EditAddressModalCtrl',
            controllerAs: 'editAddress',
            size: 'md',
            resolve: {
                SelectedAddress: function() {
                    return addressCopy;
                }
            }
        });

        editAddressModalInstance.result.then(function() {
            toastr.success('Address Edited', 'Success');
            $state.go($state.current, {}, {
                reload: true
            });
        }, function() {
            console.log('edit address cancelled');
        });
    }
}

function CreateAddressModalController($exceptionHandler, $uibModalInstance, OrderCloud, OCGeography) {
    var vm = this;
    vm.countries = OCGeography.Countries;
    vm.states = OCGeography.States;
    vm.address = {
        //defaults selected country to US
        Country: 'US'
    };

    vm.cancel = function() {
        $uibModalInstance.dismiss();
    };

    vm.submit = function() {
        OrderCloud.Me.CreateAddress(vm.address)
            .then(function() {
                $uibModalInstance.close();
            })
            .catch(function(error) {
                $exceptionHandler(error);
            });
    };
}

function EditAddressModalController($exceptionHandler, $uibModalInstance, OrderCloud, OCGeography, SelectedAddress) {
    var vm = this;
    vm.countries = OCGeography.Countries;
    vm.states = OCGeography.States;
    vm.address = SelectedAddress;
    vm.addressID = angular.copy(SelectedAddress.ID);

    vm.cancel = function() {
        $uibModalInstance.dismiss();
    };

    vm.submit = function() {
        OrderCloud.Me.UpdateAddress(vm.addressID, vm.address)
            .then(function() {
                $uibModalInstance.close();
            })
            .catch(function(error) {
                $exceptionHandler(error);
            });
    };
}