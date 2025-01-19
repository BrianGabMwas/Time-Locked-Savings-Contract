import {
  __esm,
  __export
} from "./chunk-GIZG7J7H.js";

// node_modules/isows/_esm/utils.js
function getNativeWebSocket() {
  if (typeof WebSocket !== "undefined")
    return WebSocket;
  if (typeof global.WebSocket !== "undefined")
    return global.WebSocket;
  if (typeof window.WebSocket !== "undefined")
    return window.WebSocket;
  if (typeof self.WebSocket !== "undefined")
    return self.WebSocket;
  throw new Error("`WebSocket` is not supported in this environment");
}
var init_utils = __esm({
  "node_modules/isows/_esm/utils.js"() {
  }
});

// node_modules/isows/_esm/native.js
var native_exports = {};
__export(native_exports, {
  WebSocket: () => WebSocket2
});
var WebSocket2;
var init_native = __esm({
  "node_modules/isows/_esm/native.js"() {
    init_utils();
    WebSocket2 = getNativeWebSocket();
  }
});

export {
  WebSocket2 as WebSocket,
  native_exports,
  init_native
};
//# sourceMappingURL=chunk-6Y5HGVS7.js.map
