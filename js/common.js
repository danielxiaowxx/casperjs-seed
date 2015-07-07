/**
 * Created by danielxiao on 15/7/7.
 */

exports.runTest = function(title, planned, steps) {
  casper.test.begin(title, planned, function suite(test) {

    _.each(steps, function(stepItem) {
      stepItem.fn(test, stepItem.title);
    });

    casper.run(function() {
      test.done();
    });

  });
};
