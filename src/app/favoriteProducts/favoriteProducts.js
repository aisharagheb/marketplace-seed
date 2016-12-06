angular.module('orderCloud')
    .config(FavoriteProductsConfig)
    .controller('FavoriteProductsCtrl', FavoriteProductsController)
;

function FavoriteProductsConfig($stateProvider){
    $stateProvider
        .state('favoriteProducts', {
            parent: 'base',
            templateUrl: 'favoriteProducts/templates/favoriteProducts.tpl.html',
            url: '/favoriteProducts',
            controller: 'FavoriteProductsCtrl',
            controllerAs: 'favoriteProducts',
            data: {componentName: 'Favorite Products'},
            resolve: {
                Parameters: function ($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                FavoriteProducts: function(OrderCloud, Parameters, CurrentUser){
                    if (CurrentUser.xp && CurrentUser.xp.FavoriteProducts.length) {
                        return OrderCloud.Me.ListProducts(Parameters.search, Parameters.page, Parameters.pageSize || 12, Parameters.searchOn, Parameters.sortBy, {ID: CurrentUser.xp.FavoriteProducts.join('|')});
                    } else {
                        return null;
                    }

                }
            }
        });


//functions for...
    //adding to favorite
    //removing from favorite
    //listing all products marked as favorite
    //paging
    //filtering
    //searching

    //in resolve, check xp, get product call on that xp

}

function FavoriteProductsController(CurrentUser, FavoriteProducts){
    var vm = this;
    vm.productSelected = [];
    vm.currentUser = CurrentUser;
    vm.list = FavoriteProducts;
}
