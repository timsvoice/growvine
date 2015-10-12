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

      generateOrderNumber: function generateOrderNumber (callback) {          
        var orderNumber;

        resource.query(function(orders){
          if (orders.length != 0) {
            orderNumber = orders.length + 2; 
          } else {
            orderNumber = 1
          };
          console.log(orderNumber);
          return callback(orderNumber);
        }, function (error) {
          console.log(error);
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

      plantCalculator: function plantCalculator (plant, quantity) {
        var plantPrice,
            plantTotal,
            unitPrice,
            unitRoyalty;

        unitPrice = Big(plant.unitPrice);
        unitRoyalty = Big(plant.unitRoyalty);
        plantPrice =  unitPrice.add(unitRoyalty);
        plantTotal = plantPrice.times(quantity);
        
        return Number(plantTotal);
      },

      // Find a list of Plants
      findOrgOrders: function findOrgOrders (organizationId, callback) {              
        Organizations.ordersResource.query({ 
          organizationId: organizationId       
        }, function(orders){
          // calculate plants cost
          for (var i = orders.length - 1; i >= 0; i--) {
            for (var x = orders[i].plants.length - 1; x >= 0; x--) {
              orders[i].plants[x].cost = 
                service.plantCalculator(
                  orders[i].plants[x].plant, 
                  orders[i].plants[x].quantity
                )         
            };
          };
          return callback(orders);
        }, function (error) {
          response = {
            message: "Unable to get plants. Please try again later",
            error: error
          }
          return callback(response)          
        });
      },
      
      createOrder: function saveOrder (action, order, user, organizationId, callback) {
        // Create new Order object
        var order = new resource(order);
        // set order variables
        if (action == 'save') {
          order.submitted = false;
        } else if (action == 'submit') {
          order.submitted = true;          
        } 

        order.vendor = organizationId;

        for (var i = order.plants.length - 1; i >= 0; i--) {
          order.plants[i].plant = order.plants[i].plant._id;
        };

        order.$save(function(order) {
          response = {
            order: order,
            message: "Order #" + order._id + " has been saved. Check your orders section to submit or edit."
          }

          $rootScope.$broadcast('orders.update', {message: response.message});
          return callback(response);
        }, function (error) {          
          response = {
            message: "Unable to save your order. Please try again later",
            error: error
          }
          $rootScope.$broadcast('orders.error', {message: response.message});
          return callback(response);
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
          shipDate: availability.date
        });
                
        var remaining = function (a, b) { return a - b };

        availability.quantity = remaining(availability.quantity, quantity);
        
        order.totalCost = service.orderCalculator(order);

        response = {
          message: (plant.commonName || "Plant") + " added to order",
          order: order,
          availability: availability
        }
        $rootScope.$broadcast('order.update', {message: response.message});
        return callback(response);        
      },

      removeFromOrder: function removeFromOrder (order, item, quantity, availability, index, callback) {              

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

      confirmOrder: function confirmOrder (order, callback) {        
        
        order.createdOrganization = order.createdOrganization._id
        order.createdUser = order.createdUser._id
        order.vendor = order.vendor._id

        for (var i = order.plants.length - 1; i >= 0; i--) {
          order.plants[i].plant = order.plants[i].plant._id
        };

        order.confirmed = true;

        resource.update({
          orderId: order._id
        }, order, function(order){                    
          response = {
            message: 'order successfully confirmed',
            order: order
          };
          $rootScope.$broadcast('orders.update', {message: response.message});
          return callback(response);          
        }, function (error) {
          response = {
            message: 'order cannot be confirmed. please try again later',
            error: error
          } 
          $rootScope.$broadcast('orders.error', {message: response.message});
          return callback(response);
        })
      }

    }

    return {
      resource: resource,
      service: service
    }      
  }
]);