describe('Component: ProductDetail', function(){
    var scope,
        oc,
        mockOrderID
    ;

    beforeEach(module('orderCloud'));
    beforeEach(module(function($provide) {
        $provide.value('CurrentOrder', {ID: mockOrderID})
    }));
    beforeEach(inject(function($rootScope, OrderCloud, LineItemHelpers){
        scope = $rootScope.$new();
        oc = OrderCloud;
        mockProductID = 'MockProductID123';
        productResolve = {product1: 'fakeProduct1'};
        mockProduct = {
            "ID": mockProductID,
            "Name": "MockProductName",
            "Description": "mockDescription"
        };
        mockOrderID = 'MockOrderID123';
        lineItemHelpers = LineItemHelpers;
    }));

    describe('Configuration: ProductViewConfig', function(){
        var state,
            stateParams;

        describe('State: Product',function(){
            beforeEach(inject(function($stateParams, $state){
                state = $state.get('productDetail',{},{reload:true});
                stateParams = $stateParams;
                stateParams.productid = mockProductID;
                spyOn(oc.Me,'GetProduct');
            }));

            it('should resolve Product', inject(function($injector){
                $injector.invoke(state.resolve.Product);
                expect(oc.Me.GetProduct).toHaveBeenCalledWith(mockProductID);
            }));
        });
    });

    describe('Controller: ProductDetail', function(){
        var productDetailCtrl,
            lineItemHelpers
            ;

        beforeEach(inject(function(LineItemHelpers,$controller, CurrentOrder){
            lineItemHelpers = LineItemHelpers;
            console.log("what is this",lineItemHelpers);
            currentOrder = CurrentOrder;
            productDetailCtrl = $controller('ProductDetailCtrl',{
                Product : productResolve,
                LineItemHelpers: lineItemHelpers,
                CurrentOrder: currentOrder
            });
            spyOn(lineItemHelpers,'AddItem').and.returnValue(defer.promise);
        }));

        describe('addToCart', function(){
           it('should  call the LineItemHelpers AddItem method', function(){
               console.log(productDetailCtrl);
             productDetailCtrl.lineItemHelpers(mockProduct);
             expect(lineItemHelpers.AddItem).toHaveBeeenCalledWith(mockProduct);
           });
        });
    })

});
