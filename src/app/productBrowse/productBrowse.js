angular.module('orderCloud')
    .config(ProductBrowseConfig)
    .controller('ProductBrowseCtrl', ProductBrowseController)
    .controller('ProductViewCtrl', ProductViewController)
    .directive('categoryNode', CategoryNode)
    .directive('categoryTree', CategoryTree)
    .directive('preventClick', PreventClick);

function ProductBrowseConfig($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.when('/browse', '/browse/products');
    $stateProvider
        .state('productBrowse', {
            abstract: true,
            parent: 'base',
            url: '/browse?categoryid?favorites',
            templateUrl: 'productBrowse/templates/productBrowse.tpl.html',
            controller: 'ProductBrowseCtrl',
            controllerAs: 'productBrowse',
            resolve: {
                Parameters: function ($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                CategoryList: function(OrderCloud) {
                    return OrderCloud.Me.ListCategories(null, 1, 100, null, null, null, 'all');
                }
            }
        })
        .state('productBrowse.products', {
            url: '/products?search?page?pageSize?searchOn?sortBy?filters?depth',
            templateUrl: 'productBrowse/templates/productView.tpl.html',
            controller: 'ProductViewCtrl',
            controllerAs: 'productView',
            resolve: {
                Parameters: function ($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                ProductList: function(OrderCloud, CurrentUser, Parameters) {
                    console.log(CurrentUser);
                    if (Parameters.favorites && CurrentUser.xp.FavoriteProducts) {
                        Parameters.filters ? Parameters.filters.extend({
                            ID:CurrentUser.xp.FavoriteProducts.join('|')
                        }) : Parameters.filters = {ID:CurrentUser.xp.FavoriteProducts.join('|')}
                    } else {
                        if (Parameters.filters) delete Parameters.filters.ID;
                    }
                    return OrderCloud.Me.ListProducts(Parameters.search, Parameters.page, Parameters.pageSize || 6, Parameters.searchOn, Parameters.sortBy, Parameters.filters, Parameters.categoryid);
                }
            }
        });
}

function ProductBrowseController($state, Underscore, CategoryList, Parameters) {
    var vm = this;
    vm.parameters = Parameters;
    vm.categoryList = CategoryList;

    vm.toggleFavorites = function() {
        if (vm.parameters.filters && vm.parameters.filters.ID) delete vm.parameters.filters.ID;
        if (vm.parameters.favorites) {
            vm.parameters.favorites = '';
        } else {
            vm.parameters.favorites = true;
            vm.parameters.page = '';
        }
        $state.go('productBrowse.products', vm.parameters);
    };

    vm.activeCategory = Underscore.findWhere(vm.categoryList.Items, {ID: Parameters.categoryid});

    vm.breadcrumb = [];
    vm.initBreadcrumbs = function(activeCategoryID) {
        if (!activeCategoryID) vm.breadcrumb = [];
        var activeCategory = Underscore.findWhere(vm.categoryList.Items, {ID: (activeCategoryID ? activeCategoryID : Parameters.categoryid)});
        if (activeCategory) {
            vm.breadcrumb.unshift(activeCategory);
            if (activeCategory.ParentID) vm.initBreadcrumbs(activeCategory.ParentID);
        }

    };


}

function ProductViewController($state, $ocMedia, ProductQuickView, OrderCloudParameters, OrderCloud, CurrentOrder, ProductList, CategoryList, Parameters){
    var vm = this;
    vm.parameters = Parameters;
    vm.categories = CategoryList;
    vm.list = ProductList;

    vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') == 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;

    //Filtering and Search Functionality
    //check if filters are applied
    vm.filtersApplied = vm.parameters.filters || ($ocMedia('max-width: 767px') && vm.sortSelection);
    vm.showFilters = vm.filtersApplied;


    //reload the state with new filters
    vm.filter = function(resetPage) {
        $state.go('.', OrderCloudParameters.Create(vm.parameters, resetPage));
    };

    //clear the relevant filters, reload the state & reset the page
    vm.clearFilters = function() {
        vm.parameters.filters = null;
        $ocMedia('max-width: 767px') ? vm.parameters.sortBy = null : angular.noop();
        vm.filter(true);
    };

    vm.updateSort = function(value) {
        value ? angular.noop() : value = vm.sortSelection;
        switch (vm.parameters.sortBy) {
            case value:
                vm.parameters.sortBy = '!' + value;
                break;
            case '!' + value:
                vm.parameters.sortBy = null;
                break;
            default:
                vm.parameters.sortBy = value;
        }
        vm.filter(false);
    };

    vm.reverseSort = function() {
        Parameters.sortBy.indexOf('!') == 0 ? vm.parameters.sortBy = Parameters.sortBy.split('!')[1] : vm.parameters.sortBy = '!' + Parameters.sortBy;
        vm.filter(false);
    };

    //reload the state with the incremented page parameter
    vm.pageChanged = function() {
        $state.go('.', {
            page: vm.list.Meta.Page
        });
    };

    //load the next page of results with all the same parameters
    vm.loadMore = function() {
        return OrderCloud.Me.ListProducts(Parameters.search, vm.list.Meta.Page + 1, Parameters.pageSize || vm.list.Meta.PageSize, Parameters.searchOn, Parameters.sortBy, Parameters.filters)
            .then(function(data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    };

    vm.quickView = function(product) {
        ProductQuickView.Open(CurrentOrder, product)
            .then(function(data) {

            })
    }
}

function CategoryTree(Underscore) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            tree: '=',
            children: '=',
            activeCategoryId: '='
        },
        link: function(scope, element) {
            if (scope.tree && scope.tree.Items) {
                function initTree(activeCategoryID){
                    var activeCategory = Underscore.findWhere(scope.tree.Items, {ID: activeCategoryID});
                    activeCategory.isActive = true;
                    if (activeCategory.ParentID) initTree(activeCategory.ParentID);
                }

                if (scope.activeCategoryId) initTree(scope.activeCategoryId);

                scope.constructedTree = [];
                angular.forEach(Underscore.where(scope.tree.Items, {ParentID: null}), function(node) {
                    scope.constructedTree.push(getnode(node));
                });

                function getnode(node) {
                    var children = Underscore.where(scope.tree.Items, {ParentID: node.ID});
                    if (children.length > 0) {
                        node.children = children;
                        angular.forEach(children, function(child) {
                            return getnode(child);
                        });
                    } else {
                        node.children = [];
                    }
                    return node;
                }
            } else {
                scope.constructedTree = scope.children;
            }
        },
        template: "<ul ng-class='{\"list-group category-tree\":!constructedTree[0].ParentID}'><category-node ng-repeat='category in constructedTree' category='category' active-category-id='activeCategoryId'></category-node></ul>"
    };
}

function CategoryNode($compile, Underscore) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            category: '=',
            activeCategoryId: '='
        },
        template: '<li class="category-tree-item" ng-class="{selected:category.isActive, \'list-group-item\':!category.ParentID}"><a ui-sref="productBrowse.products({categoryid: category.ID, page:\'\'})" ng-bind-html="category.Name"></a></li>',
        link: function(scope, element) {
            if (scope.category.children.length) {
                element.append("<category-tree ng-show='category.isActive' children='category.children' active-category-id='activeCategoryId' />");
                $compile(element.contents())(scope);
            }
        }
    };
}

function PreventClick(){
    return {
        link: function($scope, element) {
            element.on("click", function(e){
                e.stopPropagation();
            });
        }
    };
}