angular.module('qpx.controllers') 
  .controller('HomeCtrl', ['$scope', '$http', '$mdDialog', '$cookies',
    function($scope, $http, $mdDialog, $cookies) {

      $scope.ranges = [0,1,2,3,4,5,6,7,8,9];
      $scope.request = {
        passengers: {
          adultCount: 1,
          childCount: 0,
          seniorCount: 0,
          infantInLapCount: 0,
          infantInSeatCount: 0
        }
      };
      $scope.minDate = new Date();
      $scope.resultsLimit = 15;
      $scope.pricePattern = /^[A-Z]{3}\d+(\.\d+)?$/;
      $scope.fullDateWithTime = 'EEE, MMM dd yyyy hh:mm a';

      
      /**
       * Validates form to ensure that least one adult or
       * senior passenger is selected in the search form.
       * @return {number} number of passengers
       */
      $scope.validatePassengers = function() {
        return parseInt($scope.request.passengers.adultCount)
                || parseInt($scope.request.passengers.childCount)
                || parseInt($scope.request.passengers.adultCount)
                || parseInt($scope.request.passengers.seniorCount)
                || parseInt($scope.request.passengers.infantInSeatCount)
                || parseInt($scope.request.passengers.infantInLapCount)
      };

      /**
       * Takes unformatted price formats it e.g. EUR2000 to EUR2,000
       * @param  {string} price the total price of that particular flight
       * @return {string} formatted price
       */
      $scope.formatPriceAsMoney = function(price) {
        var currency = price.substring(0, 3);
        var amount = price.substring(3, price.length);

        return currency + Number(amount).toLocaleString();
      };

      /**
       * Gets the name of city where an airport is located at
       * @param  {string} airportCode the 3 letter airport code e.g LHR
       * @return {string} the name of city where the airport is located e.g. London
       */
      $scope.getCityName = function(airportCode) {console.log(airportCode);
        // gets the abrreviated city name e.g. AMS
        var cityShort = _.where($scope.flights.trips.data.airport, {code: airportCode})[0].city;

        // gets full city name e.g. Amsterdam
        var cityName = _.where($scope.flights.trips.data.city, {code: cityShort})[0].name; 

        return cityName;
      };

      /**
       * Opens up modal dialog that shows the details of a flight
       * @param  {object} evt javascript click event
       * @param  {object} flight particular flight in which we want to view extended details
       */
      $scope.launchFlightDetailsDialog = function(evt, flight) {
        $mdDialog.show({
          preserveScope: true,
          scope: $scope,
          controller: function($scope) {
            $scope.flight = flight;
            console.log(flight);

            $scope.close = function() {
              $mdDialog.hide();
            };

            /**
             * Retrieves flight carrier's name
             * @param  {string} abbreviation abbreviation of flight carrier e.g. BA
             * @return {string} full name of flight carrier e.g. British Airways
             */
            $scope.getCarrierName = function(abbreviation) {
              var carrierName = _.where($scope.flights.trips.data.carrier, {code: abbreviation})[0].name;
              return carrierName;
            };
          },
          templateUrl: 'views/flight-details.html',
          targetEvent: evt,
          clickOutsideToClose: true
        });
      };

      var url = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=' + $cookies.get('apiKey');

      /**
       * Searches for flights that match the criteria specified in
       * the search form by making http request to qpxExpress API endpoint
       */
      $scope.searchFlights = function() {
        $scope.searching = true;
        $scope.flights = [];

        var payload = { request: angular.copy($scope.request) };
        
        payload.request.slice = [{
          date: moment($scope.request.date).format('YYYY-MM-DD'),
          origin: $scope.request.origin,
          destination: $scope.request.destination
        }];

        delete payload.request.date;
        delete payload.request.origin;
        delete payload.request.destination;

        $http.post(url, payload).success(function(resp) {
          console.log(resp);
          $scope.searching = false;
          $scope.flights = resp;

          $('html, body').scrollTop($('#results-container').offset().top);
        }).error(function(err) {
          $scope.searching = false;
          toastr.error(err.error.message);
        });
      };

    }
  ]
);
