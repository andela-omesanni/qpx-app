angular
  .module('qpx.directives', [])
  .directive('capitalize', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelController) {
        var el = element[0];

        ngModelController.$parsers.push(function(val) {
          var cleaned = val && val.toUpperCase().replace(/[^A-Z\d]/g, '');

          // Avoid infinite loop of $setViewValue <-> $parsers
          if(cleaned === val) 
            return val;

          var start = el.selectionStart;
          var end = el.selectionEnd + cleaned.length - val.length;

          // element.val(cleaned) does not behave with
          // repeated invalid elements
          ngModelController.$setViewValue(cleaned);
          ngModelController.$render();

          el.setSelectionRange(start, end);
          return cleaned;
        });
      }
    };
  });