angular.module('orderCloud')
    .directive('categoryDropDown', CategoryDropDownDirective)
    .controller('categoryDropDownCtrl', CategoryDropDownController);

function CategoryDropDownDirective(){
    return {
        scope: {
            currentUser: '='
        },
        restrict: 'E',
        templateUrl: 'common/category-dropdown/templates/category-dropdown.tpl.html',
        controller: 'categoryDropDownCtrl',
        controllerAs: 'dropdown'
    };
}

function CategoryDropDownController(OrderCloud){
    var vm = this;

    OrderCloud.Me.ListCategories(null, 1, null, null, null, null, 'all').then(function(data){
        vm.categories = data;
        console.log('categories', vm.categories);
    });
}
