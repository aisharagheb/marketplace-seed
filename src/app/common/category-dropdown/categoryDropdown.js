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



function CategoryDropDownController(){
    var vm = this;
}

