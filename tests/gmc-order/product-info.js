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
  },
  {
    title: '更改目标城市',
    fn: step4
  },
  {
    title: '添加到购物车',
    fn: step5
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

    // 打开可选物流
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
        return __utils__.findAll('#shipping-delivery tbody tr').length > 0;
      }, title);

      // 切换任何一种物流方式
      this.evaluate(function() {
        var $dom = $('#shipping-delivery');
        $dom.find('tbody tr[class!="selected"]').click();
        $dom.find('.confirm.button-yellow').click();
      });

      casper.captureSelector(config.screenshotsDir + '/step3-1.png', '#shipping-delivery');

      this.waitForResource(/http:\/\/www\.globalmarket\.com\/gmc-order\/gmportal\/order\/component\/product\/\d+\.gm.*/, function then() {

        test.assertExists('#product-name', title + '页面数据更新');

        casper.capture(config.screenshotsDir + '/step3-2.png');

      }, function timeout() {
        this.log(title + '数据更新失败', 'error').exit();
      });


    }, function timeout() {
      this.log(title + '加载失败', 'error').exit();
    });

  });
}

function step4(test, title) {
  casper.then(function() {

    // 打开国家选择器
    this.evaluate(function() {
      $('#address-selector').click();
    });

    casper.waitFor(function check() {
      return this.evaluate(function() {
        var $dom = $('#shipping-address');
        return $dom.css('display') == 'block' && $dom.css('opacity') == 1;
      });
    }, function then() {

      casper.captureSelector(config.screenshotsDir + '/step4-1.png', '#shipping-address');

      // 切换到随意一个国家
      this.evaluate(function() {
        var $dom = $('#shipping-address');
        var $country = $dom.find('.form-select').eq(0);
        $country.find('.form-select-input').click();
        $country.find('.form-select-list a:last').click();
      });

      // 选择随意一个省份
      this.waitForResource(/fetch\.gm.*/, function then() {

        this.evaluate(function() {
          var $dom = $('#shipping-address');
          var $district = $dom.find('.form-select').eq(1);
          $district.find('.form-select-input').click();
          $district.find('.form-select-list a:last').click();
        });

      }, function timeout() {
        this.log(title + '省份数据加载失败', 'error').exit();
      });

      // 选择随意一个城市
      this.waitForResource(/fetch\.gm.*/, function then() {

        this.evaluate(function() {
          var $dom = $('#shipping-address');
          var $city = $dom.find('.form-select').eq(2);
          $city.find('.form-select-input').click();
          $city.find('.form-select-list a:last').click();
          $dom.find('.confirm').click();
        });

      }, function timeout() {
        this.log(title + '省份数据加载失败', 'error').exit();
      });

      this.waitForResource(/http:\/\/www\.globalmarket\.com\/gmc-order\/gmportal\/order\/component\/product\/\d+\.gm.*/, function then() {

        test.assertExists('#product-name', title + '页面数据更新');

        casper.capture(config.screenshotsDir + '/step4-2.png');

      }, function timeout() {
        this.log(title + '数据更新失败', 'error').exit();
      });


    }, function timeout() {
      this.log(title + '加载失败', 'error').exit();
    });

  });
}

function step5(test, title) {
  casper.then(function() {

    this.evaluate(function() {
      $('a[data-submit-btn="add-to-cart"]').click();
    });

    this.waitForSelector('#edit-cart-btn', function then() {
      test.assertExists('#edit-cart-btn', title);
      this.click('#edit-cart-btn');
      casper.capture(config.screenshotsDir + '/step5.png');
    }, function timeout() {
      this.log(title + '加载失败', 'error').exit();
    });

  });
}

/*========== Main ==================================================*/

common.runTest('Test gmc-order product info page', 6, steps);



