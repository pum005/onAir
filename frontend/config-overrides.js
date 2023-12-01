/* eslint-disable */

module.exports = function override(config, env) {
  // 'stompjs' 모듈의 경로를 'stomp.js'로 재정의
  config.resolve.alias["stompjs"] = require.resolve("stompjs/lib/stomp.js");
  return config;
};
