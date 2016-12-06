angular.module('orderCloud')
    .directive('ocQuantityInput', OCQuantityInput)
;

function OCQuantityInput() {
    return {
        scope: {
            product: '=',
            label:'@'
        },
        templateUrl: 'productDetail/quantityInput/templates/quantityInput.tpl.html',
        replace: true
    }
}


