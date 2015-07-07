
# Run tests.

casperjs --verbose test --includes=common.js tests/gmc-order/product-info.js


# step code template

```javascript

function step(test, title) {
  casper.then(function() {

    // 1. 模拟用户操作
    this.evaluate(function() {
      $('#quantity').focus().val(2).change();
    });

    // 2. 等待资源加载完毕，可通过wait***等方法
    this.waitForResource(/http:\/\/www\.globalmarket\.com\/gmc-order\/gmportal\/order\/component\/product\/5727251\.gm.*/, function then() {

      // 3. 判断结果是否正确
      test.assertExists('#product-name', title);

      // 4. 截图
      casper.capture(config.screenshotsDir + '/step2.png');

    }, function timeout() {
      // 5. 失败日志
      this.log(title + '加载数据失败', 'error').exit();
    });

  });
}

```