angular.module('ordercloud-dropdown', [])
    .directive('categoryDropDown', CategoryDropDownDirective)
    .controller('categoryDropDownCtrl', CategoryDropDownController);

function CategoryDropDownDirective(){
    return {
        scope: {

        },
        restrict: 'E',
        templateUrl: 'common/category-dropdown/templates/categoryDropdown.tpl.html',
        controller: 'categoryDropDownCtrl',
        controllerAs: 'categoryDropdown'
    };
}

function CategoryDropDownController(){
    var vm = this;


    //function CategoriesList(){
    //    vm.listCategories = [];
    //    OrderCloud.Me.ListCategories(null, 1, null, null, null, null, 2).then(function(data){
    //        vm.listCategories = data;
    //        return vm.listCategories;
    //    });
    //}
    //
    //vm.list = CategoriesList();
    //console.log('categories', vm.list);
}

