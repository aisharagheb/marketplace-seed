angular.module('orderCloud')
    .directive('categoryDropDown', CategoryDropDownDirective)
    .controller('categoryDropDownCtrl', CategoryDropDownController);

function CategoryDropDownDirective(){
    return {
        scope: {

        },
        restrict: 'E',
        templateUrl: 'common/category-dropdown/templates/category-dropdown.tpl.html',
        controller: 'CategoryDropDownCtrl',
        controllerAs: 'dropdown'
    };
}

function CategoryDropDownController(OrderCloud, Parameters){
    var vm = this;

    OrderCloud.Me.ListCategories(null, 1, 1, null, null, {ID:Parameters.categoryID}, 1).then(function(data){
        vm.categories = data;
        console.log('categories', vm.categories);
    });
}
