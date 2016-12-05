angular.module('ordercloud-dropdown', [])
    .directive('categoryDropDown', CategoryDropDownDirective)
    .controller('categoryDropDownCtrl', CategoryDropDownController);

function CategoryDropDownDirective(){
    return {
        scope: {
            categoryList: '='
        },
        restrict: 'E',
        templateUrl: 'common/category-dropdown/templates/categoryDropdown.tpl.html',
        controller: 'categoryDropDownCtrl',
        controllerAs: 'categoryDropdown'
    };
}

function CategoryDropDownController(OrderCloud){
    var vm = this;


    vm.categoriesList = function(){
        OrderCloud.Me.ListCategories(null, 1, null, null, null, null, 2).then(function(data){
            vm.listCategories = data;
            return vm.listCategories;
        });
    };
}

