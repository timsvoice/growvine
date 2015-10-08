'use strict';

//Orders service used to communicate Orders REST endpoints
angular.module('orders').factory('Orders', ['$resource', '$rootScope', 'Organizations',
	function($resource, $rootScope, Organizations) {
		var message,
        response,
        error;

    var resource = $resource('orders/:orderId', { orderId: '@_id' }, 
      { 
        update: { 
          method: 'PUT' 
        }
      }
    );

    var service = {

      generateOrderNumber: function generateOrderNumber (order) {          
        resource.query(function(orders){
          if (orders != 0) {
            order.orderNumber = orders + 1; 
          } else {
            order.orderNumber = 1
          };
          return order;
        });
      },

      orderCalculator: function orderCalculator (order) {
        var plantPrice,
            plantTotal,
            orderTotal = [],
            orderPrice,
            unitPrice,
            unitRoyalty;

        for (var i = order.plants.length - 1; i >= 0; i--) {
          unitPrice = Big(order.plants[i].plant.unitPrice);
          unitRoyalty = Big(order.plants[i].plant.unitRoyalty);
          plantPrice =  unitPrice.add(unitRoyalty);
          plantTotal = plantPrice.times(order.plants[i].quantity);
          orderTotal.push(Number(plantTotal));
        };
        
        if (orderTotal.length > 0) {
          orderPrice = orderTotal.reduce(function(a,b){
            return Number(Big(a).add(b));
          })
        };
        return orderPrice;
      },

      saveOrder: function saveOrder (order) {
        // Create new Order object
        var order = new resource(order);
        // set order variables
        order.orderNumber = generateOrderNumber(order);
        order.submitted = false   

        order.$save(function(response) {
          $rootScope.broadcast('orders.update');
          return {
            message: "Order #" + response.orderNumber + " has been saved.",
            order: response
          }
        }, function (error) {
          return {
            message: "Unable to save your order. Please try again later",
            error: error
          }
        }); 
      },

      submitOrder: function submitOrder (order) {     
        // Create new Order object
        var order = new factory.orders(order);           
        // set order variables
        order.orderNumber = generateOrderNumber(order);     
        order.submitted = true
                          
        resource.$save(function(response) {
          Organizations.get({
            organizationId: order.vendor
          }, function (organization) {              
            organization.orders.push(order._id)
            organization.$save();
            // broadcast submitted order
            $rootScope.broadcast('orders.update');
            // flash message
            return {
              message: 'Your order has been submitted. You can check the status in "My Orders"',
              order: order
            }
          })
        }, function(errorResponse) {
          return {
            message: "Unable to submit order. please try again later",
            error: errorResponse.data.message
          }
        });
      },

      removeOrder: function removeOrder (order) {
        resource.$remove({}, function(order) {
          Organizations.get({
            organizationId: order.vendor
          }, function(org){
            for (var i = org.orders.length - 1; i >= 0; i--) {
              if (org.orders[i] === order._id) org.orders.splice(i, 1);
              $rootScope.broadcast('orders.update');
              return {
                message: 'order successfully deleted',
                order: order
              }
            }
          })          
        }, function (error) {
          return {
            message: 'unable to delete order. please try again',
            error: error
          }
        });
      },

      updateOrder: function updateOrder (order) {
        resource.$update(function() {
          $rootScope.broadcast('orders.update');
          return {
            message: 'order successfully updated',
            order: order
          }
        }, function(errorResponse) {
          return {
            message: "Unable to update order. Please try again",
            error: errorResponse.data.message
          }
        });
      },

      addToOrder: function addToOrder (order, plant, quantity, availability, callback) {           

        order.plants.push({
          plant: plant, 
          quantity: quantity,
          availability: availability
        });
                
        var remaining = function (a, b) { return a - b };

        availability.quantity = remaining(availability.quantity, quantity);
        
        order.totalCost = service.orderCalculator(order);

        response = {
          message: (plant.commonName || "Plant") + " added to order",
          order: order
        }
        $rootScope.$broadcast('order.update', {message: response.message});
        return callback(response);        
      },

      removeFromOrder: function removeFromOrder (order, item, quantity, availability, index, callback) {              
        console.log(index);
        var remaining = function (a, b) {
          return Number(a) + Number(b);
        };
                
        availability.quantity = remaining(availability.quantity, quantity);        
        
        order.plants.splice(index, 1);
        
        order.totalCost = service.orderCalculator(order);
        
        response = {
          message: item.plant.commonName || "plant" + " removed from order",
          order: order
        }
        
        $rootScope.$broadcast('order.remove', {message: response.message});
        
        return callback(response);
      },

      updateOrder: function updateOrder (index, plant, quantity) {
        order.plants[index] = {
          plant: plant,
          quantity: quantity
        };

        $rootScope.broadcast('order.update');

        return {
          message: "Your order has been updated",
          order: order
        }
      }

    }

    return {
      resource: resource,
      service: service
    }      
  }
]);