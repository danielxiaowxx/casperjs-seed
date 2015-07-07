/**
 * Created by danielxiao on 15/7/4.
 */

var config = require('../../js/constants');
var common = require('../../js/common');
var _ = require('../../node_modules/lodash');

/*========== Test Steps Configuration ==================================================*/

var steps = [
  {
    title: '访问桥页',
    fn: step1
  },
  {
    title: '更改购买数量',
    fn: step2
  },
  {
    title: '选择物流方式',
    fn: step3
  }
];

/*========== Test Case Configuration ==================================================*/

var testCaseConfig = {
  productId: 5727251
};

/*========== Test Steps Implementation ==================================================*/

function step1(test, title) {
  casper.start('http://www.globalmarket.com/order/-/product-info/-/' + testCaseConfig.productId + '.html', function(response) {

    test.assertExists('#product-name', title);

    casper.capture(config.screenshotsDir + '/step1.png');

  });
}

function step2(test, title) {
  casper.then(function() {

    this.evaluate(function() {
      $('#quantity').focus().val(2).change();
    });

    this.waitForResource(/http:\/\/www\.globalmarket\.com\/gmc-order\/gmportal\/order\/component\/product\/\d+\.gm.*/, function then() {

      test.assertExists('#product-name', title);

      casper.capture(config.screenshotsDir + '/step2.png');

    }, function timeout() {
      this.log(title + '加载数据失败', 'error').exit();
    });

  });
}

function step3(test, title) {
  casper.then(function() {

    this.evaluate(function() {
      $('a[data-logisitcs-selector]').click();
    });

    casper.waitFor(function check() {
      return this.evaluate(function() {
        var $dom = $('#shipping-delivery');
        return $dom.css('display') == 'block' && $dom.css('opacity') == 1;
      });
    }, function then() {

      test.assertEval(function() {
        // 有可选的物流方式
        return __utils__.findAll('#shipping-delivery tr').length > 0;
      }, title);

      casper.captureSelector(config.screenshotsDir + '/step3.png', '#shipping-delivery');
    }, function timeout() {
      this.log(title + '加载失败', 'error').exit();
    });

  });
}

/*========== Main ==================================================*/

common.runTest('Test gmc-order product info page', 3, steps);



