import {
  require_dist
} from "./chunk-VKZB2FHU.js";
import {
  init_native,
  native_exports
} from "./chunk-6Y5HGVS7.js";
import {
  require_events
} from "./chunk-WMH57NS6.js";
import {
  __commonJS,
  __toCommonJS
} from "./chunk-GIZG7J7H.js";

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/version.js
var require_version = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/version.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSDKVersion = void 0;
    var getSDKVersion = () => "9.1.0";
    exports.getSDKVersion = getSDKVersion;
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/communication/utils.js
var require_utils = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/communication/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.generateRequestId = void 0;
    var dec2hex = (dec) => dec.toString(16).padStart(2, "0");
    var generateId = (len) => {
      const arr = new Uint8Array((len || 40) / 2);
      window.crypto.getRandomValues(arr);
      return Array.from(arr, dec2hex).join("");
    };
    var generateRequestId = () => {
      if (typeof window !== "undefined") {
        return generateId(10);
      }
      return (/* @__PURE__ */ new Date()).getTime().toString(36);
    };
    exports.generateRequestId = generateRequestId;
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/communication/messageFormatter.js
var require_messageFormatter = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/communication/messageFormatter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessageFormatter = void 0;
    var version_js_1 = require_version();
    var utils_js_1 = require_utils();
    var MessageFormatter = class {
    };
    exports.MessageFormatter = MessageFormatter;
    MessageFormatter.makeRequest = (method, params) => {
      const id = (0, utils_js_1.generateRequestId)();
      return {
        id,
        method,
        params,
        env: {
          sdkVersion: (0, version_js_1.getSDKVersion)()
        }
      };
    };
    MessageFormatter.makeResponse = (id, data, version) => ({
      id,
      success: true,
      version,
      data
    });
    MessageFormatter.makeErrorResponse = (id, error, version) => ({
      id,
      success: false,
      error,
      version
    });
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/communication/methods.js
var require_methods = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/communication/methods.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RestrictedMethods = exports.Methods = void 0;
    var Methods;
    (function(Methods2) {
      Methods2["sendTransactions"] = "sendTransactions";
      Methods2["rpcCall"] = "rpcCall";
      Methods2["getChainInfo"] = "getChainInfo";
      Methods2["getSafeInfo"] = "getSafeInfo";
      Methods2["getTxBySafeTxHash"] = "getTxBySafeTxHash";
      Methods2["getSafeBalances"] = "getSafeBalances";
      Methods2["signMessage"] = "signMessage";
      Methods2["signTypedMessage"] = "signTypedMessage";
      Methods2["getEnvironmentInfo"] = "getEnvironmentInfo";
      Methods2["getOffChainSignature"] = "getOffChainSignature";
      Methods2["requestAddressBook"] = "requestAddressBook";
      Methods2["wallet_getPermissions"] = "wallet_getPermissions";
      Methods2["wallet_requestPermissions"] = "wallet_requestPermissions";
    })(Methods || (exports.Methods = Methods = {}));
    var RestrictedMethods;
    (function(RestrictedMethods2) {
      RestrictedMethods2["requestAddressBook"] = "requestAddressBook";
    })(RestrictedMethods || (exports.RestrictedMethods = RestrictedMethods = {}));
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/communication/index.js
var require_communication = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/communication/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var messageFormatter_js_1 = require_messageFormatter();
    var PostMessageCommunicator = class {
      constructor(allowedOrigins = null, debugMode = false) {
        this.allowedOrigins = null;
        this.callbacks = /* @__PURE__ */ new Map();
        this.debugMode = false;
        this.isServer = typeof window === "undefined";
        this.isValidMessage = ({ origin, data, source }) => {
          const emptyOrMalformed = !data;
          const sentFromParentEl = !this.isServer && source === window.parent;
          const majorVersionNumber = typeof data.version !== "undefined" && parseInt(data.version.split(".")[0]);
          const allowedSDKVersion = typeof majorVersionNumber === "number" && majorVersionNumber >= 1;
          let validOrigin = true;
          if (Array.isArray(this.allowedOrigins)) {
            validOrigin = this.allowedOrigins.find((regExp) => regExp.test(origin)) !== void 0;
          }
          return !emptyOrMalformed && sentFromParentEl && allowedSDKVersion && validOrigin;
        };
        this.logIncomingMessage = (msg) => {
          console.info(`Safe Apps SDK v1: A message was received from origin ${msg.origin}. `, msg.data);
        };
        this.onParentMessage = (msg) => {
          if (this.isValidMessage(msg)) {
            this.debugMode && this.logIncomingMessage(msg);
            this.handleIncomingMessage(msg.data);
          }
        };
        this.handleIncomingMessage = (payload) => {
          const { id } = payload;
          const cb = this.callbacks.get(id);
          if (cb) {
            cb(payload);
            this.callbacks.delete(id);
          }
        };
        this.send = (method, params) => {
          const request = messageFormatter_js_1.MessageFormatter.makeRequest(method, params);
          if (this.isServer) {
            throw new Error("Window doesn't exist");
          }
          window.parent.postMessage(request, "*");
          return new Promise((resolve, reject) => {
            this.callbacks.set(request.id, (response) => {
              if (!response.success) {
                reject(new Error(response.error));
                return;
              }
              resolve(response);
            });
          });
        };
        this.allowedOrigins = allowedOrigins;
        this.debugMode = debugMode;
        if (!this.isServer) {
          window.addEventListener("message", this.onParentMessage);
        }
      }
    };
    exports.default = PostMessageCommunicator;
    __exportStar(require_methods(), exports);
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/types/sdk.js
var require_sdk = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/types/sdk.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isObjectEIP712TypedData = void 0;
    var isObjectEIP712TypedData = (obj) => {
      return typeof obj === "object" && obj != null && "domain" in obj && "types" in obj && "message" in obj;
    };
    exports.isObjectEIP712TypedData = isObjectEIP712TypedData;
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/types/rpc.js
var require_rpc = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/types/rpc.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/types/gateway.js
var require_gateway = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/types/gateway.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TransferDirection = exports.TransactionStatus = exports.TokenType = exports.Operation = void 0;
    var safe_gateway_typescript_sdk_1 = require_dist();
    Object.defineProperty(exports, "Operation", { enumerable: true, get: function() {
      return safe_gateway_typescript_sdk_1.Operation;
    } });
    Object.defineProperty(exports, "TokenType", { enumerable: true, get: function() {
      return safe_gateway_typescript_sdk_1.TokenType;
    } });
    Object.defineProperty(exports, "TransactionStatus", { enumerable: true, get: function() {
      return safe_gateway_typescript_sdk_1.TransactionStatus;
    } });
    Object.defineProperty(exports, "TransferDirection", { enumerable: true, get: function() {
      return safe_gateway_typescript_sdk_1.TransferDirection;
    } });
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/types/messaging.js
var require_messaging = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/types/messaging.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var methods_js_1 = require_methods();
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/types/index.js
var require_types = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/types/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_sdk(), exports);
    __exportStar(require_rpc(), exports);
    __exportStar(require_gateway(), exports);
    __exportStar(require_messaging(), exports);
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/txs/index.js
var require_txs = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/txs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TXs = void 0;
    var methods_js_1 = require_methods();
    var index_js_1 = require_types();
    var TXs = class {
      constructor(communicator) {
        this.communicator = communicator;
      }
      async getBySafeTxHash(safeTxHash) {
        if (!safeTxHash) {
          throw new Error("Invalid safeTxHash");
        }
        const response = await this.communicator.send(methods_js_1.Methods.getTxBySafeTxHash, { safeTxHash });
        return response.data;
      }
      async signMessage(message) {
        const messagePayload = {
          message
        };
        const response = await this.communicator.send(methods_js_1.Methods.signMessage, messagePayload);
        return response.data;
      }
      async signTypedMessage(typedData) {
        if (!(0, index_js_1.isObjectEIP712TypedData)(typedData)) {
          throw new Error("Invalid typed data");
        }
        const response = await this.communicator.send(methods_js_1.Methods.signTypedMessage, { typedData });
        return response.data;
      }
      async send({ txs, params }) {
        if (!txs || !txs.length) {
          throw new Error("No transactions were passed");
        }
        const messagePayload = {
          txs,
          params
        };
        const response = await this.communicator.send(methods_js_1.Methods.sendTransactions, messagePayload);
        return response.data;
      }
    };
    exports.TXs = TXs;
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/eth/constants.js
var require_constants = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/eth/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RPC_CALLS = void 0;
    exports.RPC_CALLS = {
      eth_call: "eth_call",
      eth_gasPrice: "eth_gasPrice",
      eth_getLogs: "eth_getLogs",
      eth_getBalance: "eth_getBalance",
      eth_getCode: "eth_getCode",
      eth_getBlockByHash: "eth_getBlockByHash",
      eth_getBlockByNumber: "eth_getBlockByNumber",
      eth_getStorageAt: "eth_getStorageAt",
      eth_getTransactionByHash: "eth_getTransactionByHash",
      eth_getTransactionReceipt: "eth_getTransactionReceipt",
      eth_getTransactionCount: "eth_getTransactionCount",
      eth_estimateGas: "eth_estimateGas",
      safe_setSettings: "safe_setSettings"
    };
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/eth/index.js
var require_eth = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/eth/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Eth = void 0;
    var constants_js_1 = require_constants();
    var methods_js_1 = require_methods();
    var inputFormatters = {
      defaultBlockParam: (arg = "latest") => arg,
      returnFullTxObjectParam: (arg = false) => arg,
      blockNumberToHex: (arg) => Number.isInteger(arg) ? `0x${arg.toString(16)}` : arg
    };
    var Eth = class {
      constructor(communicator) {
        this.communicator = communicator;
        this.call = this.buildRequest({
          call: constants_js_1.RPC_CALLS.eth_call,
          formatters: [null, inputFormatters.defaultBlockParam]
        });
        this.getBalance = this.buildRequest({
          call: constants_js_1.RPC_CALLS.eth_getBalance,
          formatters: [null, inputFormatters.defaultBlockParam]
        });
        this.getCode = this.buildRequest({
          call: constants_js_1.RPC_CALLS.eth_getCode,
          formatters: [null, inputFormatters.defaultBlockParam]
        });
        this.getStorageAt = this.buildRequest({
          call: constants_js_1.RPC_CALLS.eth_getStorageAt,
          formatters: [null, inputFormatters.blockNumberToHex, inputFormatters.defaultBlockParam]
        });
        this.getPastLogs = this.buildRequest({
          call: constants_js_1.RPC_CALLS.eth_getLogs
        });
        this.getBlockByHash = this.buildRequest({
          call: constants_js_1.RPC_CALLS.eth_getBlockByHash,
          formatters: [null, inputFormatters.returnFullTxObjectParam]
        });
        this.getBlockByNumber = this.buildRequest({
          call: constants_js_1.RPC_CALLS.eth_getBlockByNumber,
          formatters: [inputFormatters.blockNumberToHex, inputFormatters.returnFullTxObjectParam]
        });
        this.getTransactionByHash = this.buildRequest({
          call: constants_js_1.RPC_CALLS.eth_getTransactionByHash
        });
        this.getTransactionReceipt = this.buildRequest({
          call: constants_js_1.RPC_CALLS.eth_getTransactionReceipt
        });
        this.getTransactionCount = this.buildRequest({
          call: constants_js_1.RPC_CALLS.eth_getTransactionCount,
          formatters: [null, inputFormatters.defaultBlockParam]
        });
        this.getGasPrice = this.buildRequest({
          call: constants_js_1.RPC_CALLS.eth_gasPrice
        });
        this.getEstimateGas = (transaction) => this.buildRequest({
          call: constants_js_1.RPC_CALLS.eth_estimateGas
        })([transaction]);
        this.setSafeSettings = this.buildRequest({
          call: constants_js_1.RPC_CALLS.safe_setSettings
        });
      }
      buildRequest(args) {
        const { call, formatters } = args;
        return async (params) => {
          if (formatters && Array.isArray(params)) {
            formatters.forEach((formatter, i) => {
              if (formatter) {
                params[i] = formatter(params[i]);
              }
            });
          }
          const payload = {
            call,
            params: params || []
          };
          const response = await this.communicator.send(methods_js_1.Methods.rpcCall, payload);
          return response.data;
        };
      }
    };
    exports.Eth = Eth;
  }
});

// node_modules/abitype/dist/cjs/version.js
var require_version2 = __commonJS({
  "node_modules/abitype/dist/cjs/version.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "1.0.7";
  }
});

// node_modules/abitype/dist/cjs/errors.js
var require_errors = __commonJS({
  "node_modules/abitype/dist/cjs/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseError = void 0;
    var version_js_1 = require_version2();
    var BaseError = class _BaseError extends Error {
      constructor(shortMessage, args = {}) {
        var _a;
        const details = args.cause instanceof _BaseError ? args.cause.details : ((_a = args.cause) == null ? void 0 : _a.message) ? args.cause.message : args.details;
        const docsPath = args.cause instanceof _BaseError ? args.cause.docsPath || args.docsPath : args.docsPath;
        const message = [
          shortMessage || "An error occurred.",
          "",
          ...args.metaMessages ? [...args.metaMessages, ""] : [],
          ...docsPath ? [`Docs: https://abitype.dev${docsPath}`] : [],
          ...details ? [`Details: ${details}`] : [],
          `Version: abitype@${version_js_1.version}`
        ].join("\n");
        super(message);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiTypeError"
        });
        if (args.cause)
          this.cause = args.cause;
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = args.metaMessages;
        this.shortMessage = shortMessage;
      }
    };
    exports.BaseError = BaseError;
  }
});

// node_modules/abitype/dist/cjs/narrow.js
var require_narrow = __commonJS({
  "node_modules/abitype/dist/cjs/narrow.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.narrow = narrow;
    function narrow(value) {
      return value;
    }
  }
});

// node_modules/abitype/dist/cjs/regex.js
var require_regex = __commonJS({
  "node_modules/abitype/dist/cjs/regex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isTupleRegex = exports.integerRegex = exports.bytesRegex = void 0;
    exports.execTyped = execTyped;
    function execTyped(regex, string) {
      const match = regex.exec(string);
      return match == null ? void 0 : match.groups;
    }
    exports.bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
    exports.integerRegex = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
    exports.isTupleRegex = /^\(.+?\).*?$/;
  }
});

// node_modules/abitype/dist/cjs/human-readable/formatAbiParameter.js
var require_formatAbiParameter = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/formatAbiParameter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatAbiParameter = formatAbiParameter;
    var regex_js_1 = require_regex();
    var tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/;
    function formatAbiParameter(abiParameter) {
      let type = abiParameter.type;
      if (tupleRegex.test(abiParameter.type) && "components" in abiParameter) {
        type = "(";
        const length = abiParameter.components.length;
        for (let i = 0; i < length; i++) {
          const component = abiParameter.components[i];
          type += formatAbiParameter(component);
          if (i < length - 1)
            type += ", ";
        }
        const result = (0, regex_js_1.execTyped)(tupleRegex, abiParameter.type);
        type += `)${(result == null ? void 0 : result.array) ?? ""}`;
        return formatAbiParameter({
          ...abiParameter,
          type
        });
      }
      if ("indexed" in abiParameter && abiParameter.indexed)
        type = `${type} indexed`;
      if (abiParameter.name)
        return `${type} ${abiParameter.name}`;
      return type;
    }
  }
});

// node_modules/abitype/dist/cjs/human-readable/formatAbiParameters.js
var require_formatAbiParameters = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/formatAbiParameters.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatAbiParameters = formatAbiParameters;
    var formatAbiParameter_js_1 = require_formatAbiParameter();
    function formatAbiParameters(abiParameters) {
      let params = "";
      const length = abiParameters.length;
      for (let i = 0; i < length; i++) {
        const abiParameter = abiParameters[i];
        params += (0, formatAbiParameter_js_1.formatAbiParameter)(abiParameter);
        if (i !== length - 1)
          params += ", ";
      }
      return params;
    }
  }
});

// node_modules/abitype/dist/cjs/human-readable/formatAbiItem.js
var require_formatAbiItem = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/formatAbiItem.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatAbiItem = formatAbiItem;
    var formatAbiParameters_js_1 = require_formatAbiParameters();
    function formatAbiItem(abiItem) {
      var _a;
      if (abiItem.type === "function")
        return `function ${abiItem.name}(${(0, formatAbiParameters_js_1.formatAbiParameters)(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== "nonpayable" ? ` ${abiItem.stateMutability}` : ""}${((_a = abiItem.outputs) == null ? void 0 : _a.length) ? ` returns (${(0, formatAbiParameters_js_1.formatAbiParameters)(abiItem.outputs)})` : ""}`;
      if (abiItem.type === "event")
        return `event ${abiItem.name}(${(0, formatAbiParameters_js_1.formatAbiParameters)(abiItem.inputs)})`;
      if (abiItem.type === "error")
        return `error ${abiItem.name}(${(0, formatAbiParameters_js_1.formatAbiParameters)(abiItem.inputs)})`;
      if (abiItem.type === "constructor")
        return `constructor(${(0, formatAbiParameters_js_1.formatAbiParameters)(abiItem.inputs)})${abiItem.stateMutability === "payable" ? " payable" : ""}`;
      if (abiItem.type === "fallback")
        return `fallback() external${abiItem.stateMutability === "payable" ? " payable" : ""}`;
      return "receive() external payable";
    }
  }
});

// node_modules/abitype/dist/cjs/human-readable/formatAbi.js
var require_formatAbi = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/formatAbi.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatAbi = formatAbi;
    var formatAbiItem_js_1 = require_formatAbiItem();
    function formatAbi(abi) {
      const signatures = [];
      const length = abi.length;
      for (let i = 0; i < length; i++) {
        const abiItem = abi[i];
        const signature = (0, formatAbiItem_js_1.formatAbiItem)(abiItem);
        signatures.push(signature);
      }
      return signatures;
    }
  }
});

// node_modules/abitype/dist/cjs/human-readable/runtime/signatures.js
var require_signatures = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/runtime/signatures.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.functionModifiers = exports.eventModifiers = exports.modifiers = void 0;
    exports.isErrorSignature = isErrorSignature;
    exports.execErrorSignature = execErrorSignature;
    exports.isEventSignature = isEventSignature;
    exports.execEventSignature = execEventSignature;
    exports.isFunctionSignature = isFunctionSignature;
    exports.execFunctionSignature = execFunctionSignature;
    exports.isStructSignature = isStructSignature;
    exports.execStructSignature = execStructSignature;
    exports.isConstructorSignature = isConstructorSignature;
    exports.execConstructorSignature = execConstructorSignature;
    exports.isFallbackSignature = isFallbackSignature;
    exports.isReceiveSignature = isReceiveSignature;
    var regex_js_1 = require_regex();
    var errorSignatureRegex = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
    function isErrorSignature(signature) {
      return errorSignatureRegex.test(signature);
    }
    function execErrorSignature(signature) {
      return (0, regex_js_1.execTyped)(errorSignatureRegex, signature);
    }
    var eventSignatureRegex = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
    function isEventSignature(signature) {
      return eventSignatureRegex.test(signature);
    }
    function execEventSignature(signature) {
      return (0, regex_js_1.execTyped)(eventSignatureRegex, signature);
    }
    var functionSignatureRegex = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
    function isFunctionSignature(signature) {
      return functionSignatureRegex.test(signature);
    }
    function execFunctionSignature(signature) {
      return (0, regex_js_1.execTyped)(functionSignatureRegex, signature);
    }
    var structSignatureRegex = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
    function isStructSignature(signature) {
      return structSignatureRegex.test(signature);
    }
    function execStructSignature(signature) {
      return (0, regex_js_1.execTyped)(structSignatureRegex, signature);
    }
    var constructorSignatureRegex = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
    function isConstructorSignature(signature) {
      return constructorSignatureRegex.test(signature);
    }
    function execConstructorSignature(signature) {
      return (0, regex_js_1.execTyped)(constructorSignatureRegex, signature);
    }
    var fallbackSignatureRegex = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
    function isFallbackSignature(signature) {
      return fallbackSignatureRegex.test(signature);
    }
    var receiveSignatureRegex = /^receive\(\) external payable$/;
    function isReceiveSignature(signature) {
      return receiveSignatureRegex.test(signature);
    }
    exports.modifiers = /* @__PURE__ */ new Set([
      "memory",
      "indexed",
      "storage",
      "calldata"
    ]);
    exports.eventModifiers = /* @__PURE__ */ new Set(["indexed"]);
    exports.functionModifiers = /* @__PURE__ */ new Set([
      "calldata",
      "memory",
      "storage"
    ]);
  }
});

// node_modules/abitype/dist/cjs/human-readable/errors/abiItem.js
var require_abiItem = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/errors/abiItem.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnknownSolidityTypeError = exports.UnknownTypeError = exports.InvalidAbiItemError = void 0;
    var errors_js_1 = require_errors();
    var InvalidAbiItemError = class extends errors_js_1.BaseError {
      constructor({ signature }) {
        super("Failed to parse ABI item.", {
          details: `parseAbiItem(${JSON.stringify(signature, null, 2)})`,
          docsPath: "/api/human#parseabiitem-1"
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiItemError"
        });
      }
    };
    exports.InvalidAbiItemError = InvalidAbiItemError;
    var UnknownTypeError = class extends errors_js_1.BaseError {
      constructor({ type }) {
        super("Unknown type.", {
          metaMessages: [
            `Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownTypeError"
        });
      }
    };
    exports.UnknownTypeError = UnknownTypeError;
    var UnknownSolidityTypeError = class extends errors_js_1.BaseError {
      constructor({ type }) {
        super("Unknown type.", {
          metaMessages: [`Type "${type}" is not a valid ABI type.`]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownSolidityTypeError"
        });
      }
    };
    exports.UnknownSolidityTypeError = UnknownSolidityTypeError;
  }
});

// node_modules/abitype/dist/cjs/human-readable/errors/abiParameter.js
var require_abiParameter = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/errors/abiParameter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidAbiTypeParameterError = exports.InvalidFunctionModifierError = exports.InvalidModifierError = exports.SolidityProtectedKeywordError = exports.InvalidParameterError = exports.InvalidAbiParametersError = exports.InvalidAbiParameterError = void 0;
    var errors_js_1 = require_errors();
    var InvalidAbiParameterError = class extends errors_js_1.BaseError {
      constructor({ param }) {
        super("Failed to parse ABI parameter.", {
          details: `parseAbiParameter(${JSON.stringify(param, null, 2)})`,
          docsPath: "/api/human#parseabiparameter-1"
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiParameterError"
        });
      }
    };
    exports.InvalidAbiParameterError = InvalidAbiParameterError;
    var InvalidAbiParametersError = class extends errors_js_1.BaseError {
      constructor({ params }) {
        super("Failed to parse ABI parameters.", {
          details: `parseAbiParameters(${JSON.stringify(params, null, 2)})`,
          docsPath: "/api/human#parseabiparameters-1"
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiParametersError"
        });
      }
    };
    exports.InvalidAbiParametersError = InvalidAbiParametersError;
    var InvalidParameterError = class extends errors_js_1.BaseError {
      constructor({ param }) {
        super("Invalid ABI parameter.", {
          details: param
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidParameterError"
        });
      }
    };
    exports.InvalidParameterError = InvalidParameterError;
    var SolidityProtectedKeywordError = class extends errors_js_1.BaseError {
      constructor({ param, name }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "SolidityProtectedKeywordError"
        });
      }
    };
    exports.SolidityProtectedKeywordError = SolidityProtectedKeywordError;
    var InvalidModifierError = class extends errors_js_1.BaseError {
      constructor({ param, type, modifier }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidModifierError"
        });
      }
    };
    exports.InvalidModifierError = InvalidModifierError;
    var InvalidFunctionModifierError = class extends errors_js_1.BaseError {
      constructor({ param, type, modifier }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`,
            `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidFunctionModifierError"
        });
      }
    };
    exports.InvalidFunctionModifierError = InvalidFunctionModifierError;
    var InvalidAbiTypeParameterError = class extends errors_js_1.BaseError {
      constructor({ abiParameter }) {
        super("Invalid ABI parameter.", {
          details: JSON.stringify(abiParameter, null, 2),
          metaMessages: ["ABI parameter type is invalid."]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiTypeParameterError"
        });
      }
    };
    exports.InvalidAbiTypeParameterError = InvalidAbiTypeParameterError;
  }
});

// node_modules/abitype/dist/cjs/human-readable/errors/signature.js
var require_signature = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/errors/signature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidStructSignatureError = exports.UnknownSignatureError = exports.InvalidSignatureError = void 0;
    var errors_js_1 = require_errors();
    var InvalidSignatureError = class extends errors_js_1.BaseError {
      constructor({ signature, type }) {
        super(`Invalid ${type} signature.`, {
          details: signature
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidSignatureError"
        });
      }
    };
    exports.InvalidSignatureError = InvalidSignatureError;
    var UnknownSignatureError = class extends errors_js_1.BaseError {
      constructor({ signature }) {
        super("Unknown signature.", {
          details: signature
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownSignatureError"
        });
      }
    };
    exports.UnknownSignatureError = UnknownSignatureError;
    var InvalidStructSignatureError = class extends errors_js_1.BaseError {
      constructor({ signature }) {
        super("Invalid struct signature.", {
          details: signature,
          metaMessages: ["No properties exist."]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidStructSignatureError"
        });
      }
    };
    exports.InvalidStructSignatureError = InvalidStructSignatureError;
  }
});

// node_modules/abitype/dist/cjs/human-readable/errors/struct.js
var require_struct = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/errors/struct.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CircularReferenceError = void 0;
    var errors_js_1 = require_errors();
    var CircularReferenceError = class extends errors_js_1.BaseError {
      constructor({ type }) {
        super("Circular reference detected.", {
          metaMessages: [`Struct "${type}" is a circular reference.`]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "CircularReferenceError"
        });
      }
    };
    exports.CircularReferenceError = CircularReferenceError;
  }
});

// node_modules/abitype/dist/cjs/human-readable/errors/splitParameters.js
var require_splitParameters = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/errors/splitParameters.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidParenthesisError = void 0;
    var errors_js_1 = require_errors();
    var InvalidParenthesisError = class extends errors_js_1.BaseError {
      constructor({ current, depth }) {
        super("Unbalanced parentheses.", {
          metaMessages: [
            `"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`
          ],
          details: `Depth "${depth}"`
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidParenthesisError"
        });
      }
    };
    exports.InvalidParenthesisError = InvalidParenthesisError;
  }
});

// node_modules/abitype/dist/cjs/human-readable/runtime/cache.js
var require_cache = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/runtime/cache.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parameterCache = void 0;
    exports.getParameterCacheKey = getParameterCacheKey;
    function getParameterCacheKey(param, type, structs) {
      let structKey = "";
      if (structs)
        for (const struct of Object.entries(structs)) {
          if (!struct)
            continue;
          let propertyKey = "";
          for (const property of struct[1]) {
            propertyKey += `[${property.type}${property.name ? `:${property.name}` : ""}]`;
          }
          structKey += `(${struct[0]}{${propertyKey}})`;
        }
      if (type)
        return `${type}:${param}${structKey}`;
      return param;
    }
    exports.parameterCache = /* @__PURE__ */ new Map([
      ["address", { type: "address" }],
      ["bool", { type: "bool" }],
      ["bytes", { type: "bytes" }],
      ["bytes32", { type: "bytes32" }],
      ["int", { type: "int256" }],
      ["int256", { type: "int256" }],
      ["string", { type: "string" }],
      ["uint", { type: "uint256" }],
      ["uint8", { type: "uint8" }],
      ["uint16", { type: "uint16" }],
      ["uint24", { type: "uint24" }],
      ["uint32", { type: "uint32" }],
      ["uint64", { type: "uint64" }],
      ["uint96", { type: "uint96" }],
      ["uint112", { type: "uint112" }],
      ["uint160", { type: "uint160" }],
      ["uint192", { type: "uint192" }],
      ["uint256", { type: "uint256" }],
      ["address owner", { type: "address", name: "owner" }],
      ["address to", { type: "address", name: "to" }],
      ["bool approved", { type: "bool", name: "approved" }],
      ["bytes _data", { type: "bytes", name: "_data" }],
      ["bytes data", { type: "bytes", name: "data" }],
      ["bytes signature", { type: "bytes", name: "signature" }],
      ["bytes32 hash", { type: "bytes32", name: "hash" }],
      ["bytes32 r", { type: "bytes32", name: "r" }],
      ["bytes32 root", { type: "bytes32", name: "root" }],
      ["bytes32 s", { type: "bytes32", name: "s" }],
      ["string name", { type: "string", name: "name" }],
      ["string symbol", { type: "string", name: "symbol" }],
      ["string tokenURI", { type: "string", name: "tokenURI" }],
      ["uint tokenId", { type: "uint256", name: "tokenId" }],
      ["uint8 v", { type: "uint8", name: "v" }],
      ["uint256 balance", { type: "uint256", name: "balance" }],
      ["uint256 tokenId", { type: "uint256", name: "tokenId" }],
      ["uint256 value", { type: "uint256", name: "value" }],
      [
        "event:address indexed from",
        { type: "address", name: "from", indexed: true }
      ],
      ["event:address indexed to", { type: "address", name: "to", indexed: true }],
      [
        "event:uint indexed tokenId",
        { type: "uint256", name: "tokenId", indexed: true }
      ],
      [
        "event:uint256 indexed tokenId",
        { type: "uint256", name: "tokenId", indexed: true }
      ]
    ]);
  }
});

// node_modules/abitype/dist/cjs/human-readable/runtime/utils.js
var require_utils2 = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/runtime/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseSignature = parseSignature;
    exports.parseAbiParameter = parseAbiParameter;
    exports.splitParameters = splitParameters;
    exports.isSolidityType = isSolidityType;
    exports.isSolidityKeyword = isSolidityKeyword;
    exports.isValidDataLocation = isValidDataLocation;
    var regex_js_1 = require_regex();
    var abiItem_js_1 = require_abiItem();
    var abiParameter_js_1 = require_abiParameter();
    var signature_js_1 = require_signature();
    var splitParameters_js_1 = require_splitParameters();
    var cache_js_1 = require_cache();
    var signatures_js_1 = require_signatures();
    function parseSignature(signature, structs = {}) {
      if ((0, signatures_js_1.isFunctionSignature)(signature)) {
        const match = (0, signatures_js_1.execFunctionSignature)(signature);
        if (!match)
          throw new signature_js_1.InvalidSignatureError({ signature, type: "function" });
        const inputParams = splitParameters(match.parameters);
        const inputs = [];
        const inputLength = inputParams.length;
        for (let i = 0; i < inputLength; i++) {
          inputs.push(parseAbiParameter(inputParams[i], {
            modifiers: signatures_js_1.functionModifiers,
            structs,
            type: "function"
          }));
        }
        const outputs = [];
        if (match.returns) {
          const outputParams = splitParameters(match.returns);
          const outputLength = outputParams.length;
          for (let i = 0; i < outputLength; i++) {
            outputs.push(parseAbiParameter(outputParams[i], {
              modifiers: signatures_js_1.functionModifiers,
              structs,
              type: "function"
            }));
          }
        }
        return {
          name: match.name,
          type: "function",
          stateMutability: match.stateMutability ?? "nonpayable",
          inputs,
          outputs
        };
      }
      if ((0, signatures_js_1.isEventSignature)(signature)) {
        const match = (0, signatures_js_1.execEventSignature)(signature);
        if (!match)
          throw new signature_js_1.InvalidSignatureError({ signature, type: "event" });
        const params = splitParameters(match.parameters);
        const abiParameters = [];
        const length = params.length;
        for (let i = 0; i < length; i++) {
          abiParameters.push(parseAbiParameter(params[i], {
            modifiers: signatures_js_1.eventModifiers,
            structs,
            type: "event"
          }));
        }
        return { name: match.name, type: "event", inputs: abiParameters };
      }
      if ((0, signatures_js_1.isErrorSignature)(signature)) {
        const match = (0, signatures_js_1.execErrorSignature)(signature);
        if (!match)
          throw new signature_js_1.InvalidSignatureError({ signature, type: "error" });
        const params = splitParameters(match.parameters);
        const abiParameters = [];
        const length = params.length;
        for (let i = 0; i < length; i++) {
          abiParameters.push(parseAbiParameter(params[i], { structs, type: "error" }));
        }
        return { name: match.name, type: "error", inputs: abiParameters };
      }
      if ((0, signatures_js_1.isConstructorSignature)(signature)) {
        const match = (0, signatures_js_1.execConstructorSignature)(signature);
        if (!match)
          throw new signature_js_1.InvalidSignatureError({ signature, type: "constructor" });
        const params = splitParameters(match.parameters);
        const abiParameters = [];
        const length = params.length;
        for (let i = 0; i < length; i++) {
          abiParameters.push(parseAbiParameter(params[i], { structs, type: "constructor" }));
        }
        return {
          type: "constructor",
          stateMutability: match.stateMutability ?? "nonpayable",
          inputs: abiParameters
        };
      }
      if ((0, signatures_js_1.isFallbackSignature)(signature))
        return { type: "fallback" };
      if ((0, signatures_js_1.isReceiveSignature)(signature))
        return {
          type: "receive",
          stateMutability: "payable"
        };
      throw new signature_js_1.UnknownSignatureError({ signature });
    }
    var abiParameterWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
    var abiParameterWithTupleRegex = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
    var dynamicIntegerRegex = /^u?int$/;
    function parseAbiParameter(param, options) {
      var _a, _b;
      const parameterCacheKey = (0, cache_js_1.getParameterCacheKey)(param, options == null ? void 0 : options.type, options == null ? void 0 : options.structs);
      if (cache_js_1.parameterCache.has(parameterCacheKey))
        return cache_js_1.parameterCache.get(parameterCacheKey);
      const isTuple = regex_js_1.isTupleRegex.test(param);
      const match = (0, regex_js_1.execTyped)(isTuple ? abiParameterWithTupleRegex : abiParameterWithoutTupleRegex, param);
      if (!match)
        throw new abiParameter_js_1.InvalidParameterError({ param });
      if (match.name && isSolidityKeyword(match.name))
        throw new abiParameter_js_1.SolidityProtectedKeywordError({ param, name: match.name });
      const name = match.name ? { name: match.name } : {};
      const indexed = match.modifier === "indexed" ? { indexed: true } : {};
      const structs = (options == null ? void 0 : options.structs) ?? {};
      let type;
      let components = {};
      if (isTuple) {
        type = "tuple";
        const params = splitParameters(match.type);
        const components_ = [];
        const length = params.length;
        for (let i = 0; i < length; i++) {
          components_.push(parseAbiParameter(params[i], { structs }));
        }
        components = { components: components_ };
      } else if (match.type in structs) {
        type = "tuple";
        components = { components: structs[match.type] };
      } else if (dynamicIntegerRegex.test(match.type)) {
        type = `${match.type}256`;
      } else {
        type = match.type;
        if (!((options == null ? void 0 : options.type) === "struct") && !isSolidityType(type))
          throw new abiItem_js_1.UnknownSolidityTypeError({ type });
      }
      if (match.modifier) {
        if (!((_b = (_a = options == null ? void 0 : options.modifiers) == null ? void 0 : _a.has) == null ? void 0 : _b.call(_a, match.modifier)))
          throw new abiParameter_js_1.InvalidModifierError({
            param,
            type: options == null ? void 0 : options.type,
            modifier: match.modifier
          });
        if (signatures_js_1.functionModifiers.has(match.modifier) && !isValidDataLocation(type, !!match.array))
          throw new abiParameter_js_1.InvalidFunctionModifierError({
            param,
            type: options == null ? void 0 : options.type,
            modifier: match.modifier
          });
      }
      const abiParameter = {
        type: `${type}${match.array ?? ""}`,
        ...name,
        ...indexed,
        ...components
      };
      cache_js_1.parameterCache.set(parameterCacheKey, abiParameter);
      return abiParameter;
    }
    function splitParameters(params, result = [], current = "", depth = 0) {
      const length = params.trim().length;
      for (let i = 0; i < length; i++) {
        const char = params[i];
        const tail = params.slice(i + 1);
        switch (char) {
          case ",":
            return depth === 0 ? splitParameters(tail, [...result, current.trim()]) : splitParameters(tail, result, `${current}${char}`, depth);
          case "(":
            return splitParameters(tail, result, `${current}${char}`, depth + 1);
          case ")":
            return splitParameters(tail, result, `${current}${char}`, depth - 1);
          default:
            return splitParameters(tail, result, `${current}${char}`, depth);
        }
      }
      if (current === "")
        return result;
      if (depth !== 0)
        throw new splitParameters_js_1.InvalidParenthesisError({ current, depth });
      result.push(current.trim());
      return result;
    }
    function isSolidityType(type) {
      return type === "address" || type === "bool" || type === "function" || type === "string" || regex_js_1.bytesRegex.test(type) || regex_js_1.integerRegex.test(type);
    }
    var protectedKeywordsRegex = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
    function isSolidityKeyword(name) {
      return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || regex_js_1.bytesRegex.test(name) || regex_js_1.integerRegex.test(name) || protectedKeywordsRegex.test(name);
    }
    function isValidDataLocation(type, isArray) {
      return isArray || type === "bytes" || type === "string" || type === "tuple";
    }
  }
});

// node_modules/abitype/dist/cjs/human-readable/runtime/structs.js
var require_structs = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/runtime/structs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseStructs = parseStructs;
    var regex_js_1 = require_regex();
    var abiItem_js_1 = require_abiItem();
    var abiParameter_js_1 = require_abiParameter();
    var signature_js_1 = require_signature();
    var struct_js_1 = require_struct();
    var signatures_js_1 = require_signatures();
    var utils_js_1 = require_utils2();
    function parseStructs(signatures) {
      const shallowStructs = {};
      const signaturesLength = signatures.length;
      for (let i = 0; i < signaturesLength; i++) {
        const signature = signatures[i];
        if (!(0, signatures_js_1.isStructSignature)(signature))
          continue;
        const match = (0, signatures_js_1.execStructSignature)(signature);
        if (!match)
          throw new signature_js_1.InvalidSignatureError({ signature, type: "struct" });
        const properties = match.properties.split(";");
        const components = [];
        const propertiesLength = properties.length;
        for (let k = 0; k < propertiesLength; k++) {
          const property = properties[k];
          const trimmed = property.trim();
          if (!trimmed)
            continue;
          const abiParameter = (0, utils_js_1.parseAbiParameter)(trimmed, {
            type: "struct"
          });
          components.push(abiParameter);
        }
        if (!components.length)
          throw new signature_js_1.InvalidStructSignatureError({ signature });
        shallowStructs[match.name] = components;
      }
      const resolvedStructs = {};
      const entries = Object.entries(shallowStructs);
      const entriesLength = entries.length;
      for (let i = 0; i < entriesLength; i++) {
        const [name, parameters] = entries[i];
        resolvedStructs[name] = resolveStructs(parameters, shallowStructs);
      }
      return resolvedStructs;
    }
    var typeWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
    function resolveStructs(abiParameters, structs, ancestors = /* @__PURE__ */ new Set()) {
      const components = [];
      const length = abiParameters.length;
      for (let i = 0; i < length; i++) {
        const abiParameter = abiParameters[i];
        const isTuple = regex_js_1.isTupleRegex.test(abiParameter.type);
        if (isTuple)
          components.push(abiParameter);
        else {
          const match = (0, regex_js_1.execTyped)(typeWithoutTupleRegex, abiParameter.type);
          if (!(match == null ? void 0 : match.type))
            throw new abiParameter_js_1.InvalidAbiTypeParameterError({ abiParameter });
          const { array, type } = match;
          if (type in structs) {
            if (ancestors.has(type))
              throw new struct_js_1.CircularReferenceError({ type });
            components.push({
              ...abiParameter,
              type: `tuple${array ?? ""}`,
              components: resolveStructs(structs[type] ?? [], structs, /* @__PURE__ */ new Set([...ancestors, type]))
            });
          } else {
            if ((0, utils_js_1.isSolidityType)(type))
              components.push(abiParameter);
            else
              throw new abiItem_js_1.UnknownTypeError({ type });
          }
        }
      }
      return components;
    }
  }
});

// node_modules/abitype/dist/cjs/human-readable/parseAbi.js
var require_parseAbi = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/parseAbi.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseAbi = parseAbi;
    var signatures_js_1 = require_signatures();
    var structs_js_1 = require_structs();
    var utils_js_1 = require_utils2();
    function parseAbi(signatures) {
      const structs = (0, structs_js_1.parseStructs)(signatures);
      const abi = [];
      const length = signatures.length;
      for (let i = 0; i < length; i++) {
        const signature = signatures[i];
        if ((0, signatures_js_1.isStructSignature)(signature))
          continue;
        abi.push((0, utils_js_1.parseSignature)(signature, structs));
      }
      return abi;
    }
  }
});

// node_modules/abitype/dist/cjs/human-readable/parseAbiItem.js
var require_parseAbiItem = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/parseAbiItem.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseAbiItem = parseAbiItem;
    var abiItem_js_1 = require_abiItem();
    var signatures_js_1 = require_signatures();
    var structs_js_1 = require_structs();
    var utils_js_1 = require_utils2();
    function parseAbiItem(signature) {
      let abiItem;
      if (typeof signature === "string")
        abiItem = (0, utils_js_1.parseSignature)(signature);
      else {
        const structs = (0, structs_js_1.parseStructs)(signature);
        const length = signature.length;
        for (let i = 0; i < length; i++) {
          const signature_ = signature[i];
          if ((0, signatures_js_1.isStructSignature)(signature_))
            continue;
          abiItem = (0, utils_js_1.parseSignature)(signature_, structs);
          break;
        }
      }
      if (!abiItem)
        throw new abiItem_js_1.InvalidAbiItemError({ signature });
      return abiItem;
    }
  }
});

// node_modules/abitype/dist/cjs/human-readable/parseAbiParameter.js
var require_parseAbiParameter = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/parseAbiParameter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseAbiParameter = parseAbiParameter;
    var abiParameter_js_1 = require_abiParameter();
    var signatures_js_1 = require_signatures();
    var structs_js_1 = require_structs();
    var utils_js_1 = require_utils2();
    function parseAbiParameter(param) {
      let abiParameter;
      if (typeof param === "string")
        abiParameter = (0, utils_js_1.parseAbiParameter)(param, {
          modifiers: signatures_js_1.modifiers
        });
      else {
        const structs = (0, structs_js_1.parseStructs)(param);
        const length = param.length;
        for (let i = 0; i < length; i++) {
          const signature = param[i];
          if ((0, signatures_js_1.isStructSignature)(signature))
            continue;
          abiParameter = (0, utils_js_1.parseAbiParameter)(signature, { modifiers: signatures_js_1.modifiers, structs });
          break;
        }
      }
      if (!abiParameter)
        throw new abiParameter_js_1.InvalidAbiParameterError({ param });
      return abiParameter;
    }
  }
});

// node_modules/abitype/dist/cjs/human-readable/parseAbiParameters.js
var require_parseAbiParameters = __commonJS({
  "node_modules/abitype/dist/cjs/human-readable/parseAbiParameters.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseAbiParameters = parseAbiParameters;
    var abiParameter_js_1 = require_abiParameter();
    var signatures_js_1 = require_signatures();
    var structs_js_1 = require_structs();
    var utils_js_1 = require_utils2();
    var utils_js_2 = require_utils2();
    function parseAbiParameters(params) {
      const abiParameters = [];
      if (typeof params === "string") {
        const parameters = (0, utils_js_1.splitParameters)(params);
        const length = parameters.length;
        for (let i = 0; i < length; i++) {
          abiParameters.push((0, utils_js_2.parseAbiParameter)(parameters[i], { modifiers: signatures_js_1.modifiers }));
        }
      } else {
        const structs = (0, structs_js_1.parseStructs)(params);
        const length = params.length;
        for (let i = 0; i < length; i++) {
          const signature = params[i];
          if ((0, signatures_js_1.isStructSignature)(signature))
            continue;
          const parameters = (0, utils_js_1.splitParameters)(signature);
          const length2 = parameters.length;
          for (let k = 0; k < length2; k++) {
            abiParameters.push((0, utils_js_2.parseAbiParameter)(parameters[k], { modifiers: signatures_js_1.modifiers, structs }));
          }
        }
      }
      if (abiParameters.length === 0)
        throw new abiParameter_js_1.InvalidAbiParametersError({ params });
      return abiParameters;
    }
  }
});

// node_modules/abitype/dist/cjs/exports/index.js
var require_exports = __commonJS({
  "node_modules/abitype/dist/cjs/exports/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CircularReferenceError = exports.InvalidParenthesisError = exports.UnknownSignatureError = exports.InvalidSignatureError = exports.InvalidStructSignatureError = exports.InvalidAbiParameterError = exports.InvalidAbiParametersError = exports.InvalidParameterError = exports.SolidityProtectedKeywordError = exports.InvalidModifierError = exports.InvalidFunctionModifierError = exports.InvalidAbiTypeParameterError = exports.UnknownSolidityTypeError = exports.InvalidAbiItemError = exports.UnknownTypeError = exports.parseAbiParameters = exports.parseAbiParameter = exports.parseAbiItem = exports.parseAbi = exports.formatAbiParameters = exports.formatAbiParameter = exports.formatAbiItem = exports.formatAbi = exports.narrow = exports.BaseError = void 0;
    var errors_js_1 = require_errors();
    Object.defineProperty(exports, "BaseError", { enumerable: true, get: function() {
      return errors_js_1.BaseError;
    } });
    var narrow_js_1 = require_narrow();
    Object.defineProperty(exports, "narrow", { enumerable: true, get: function() {
      return narrow_js_1.narrow;
    } });
    var formatAbi_js_1 = require_formatAbi();
    Object.defineProperty(exports, "formatAbi", { enumerable: true, get: function() {
      return formatAbi_js_1.formatAbi;
    } });
    var formatAbiItem_js_1 = require_formatAbiItem();
    Object.defineProperty(exports, "formatAbiItem", { enumerable: true, get: function() {
      return formatAbiItem_js_1.formatAbiItem;
    } });
    var formatAbiParameter_js_1 = require_formatAbiParameter();
    Object.defineProperty(exports, "formatAbiParameter", { enumerable: true, get: function() {
      return formatAbiParameter_js_1.formatAbiParameter;
    } });
    var formatAbiParameters_js_1 = require_formatAbiParameters();
    Object.defineProperty(exports, "formatAbiParameters", { enumerable: true, get: function() {
      return formatAbiParameters_js_1.formatAbiParameters;
    } });
    var parseAbi_js_1 = require_parseAbi();
    Object.defineProperty(exports, "parseAbi", { enumerable: true, get: function() {
      return parseAbi_js_1.parseAbi;
    } });
    var parseAbiItem_js_1 = require_parseAbiItem();
    Object.defineProperty(exports, "parseAbiItem", { enumerable: true, get: function() {
      return parseAbiItem_js_1.parseAbiItem;
    } });
    var parseAbiParameter_js_1 = require_parseAbiParameter();
    Object.defineProperty(exports, "parseAbiParameter", { enumerable: true, get: function() {
      return parseAbiParameter_js_1.parseAbiParameter;
    } });
    var parseAbiParameters_js_1 = require_parseAbiParameters();
    Object.defineProperty(exports, "parseAbiParameters", { enumerable: true, get: function() {
      return parseAbiParameters_js_1.parseAbiParameters;
    } });
    var abiItem_js_1 = require_abiItem();
    Object.defineProperty(exports, "UnknownTypeError", { enumerable: true, get: function() {
      return abiItem_js_1.UnknownTypeError;
    } });
    Object.defineProperty(exports, "InvalidAbiItemError", { enumerable: true, get: function() {
      return abiItem_js_1.InvalidAbiItemError;
    } });
    Object.defineProperty(exports, "UnknownSolidityTypeError", { enumerable: true, get: function() {
      return abiItem_js_1.UnknownSolidityTypeError;
    } });
    var abiParameter_js_1 = require_abiParameter();
    Object.defineProperty(exports, "InvalidAbiTypeParameterError", { enumerable: true, get: function() {
      return abiParameter_js_1.InvalidAbiTypeParameterError;
    } });
    Object.defineProperty(exports, "InvalidFunctionModifierError", { enumerable: true, get: function() {
      return abiParameter_js_1.InvalidFunctionModifierError;
    } });
    Object.defineProperty(exports, "InvalidModifierError", { enumerable: true, get: function() {
      return abiParameter_js_1.InvalidModifierError;
    } });
    Object.defineProperty(exports, "SolidityProtectedKeywordError", { enumerable: true, get: function() {
      return abiParameter_js_1.SolidityProtectedKeywordError;
    } });
    Object.defineProperty(exports, "InvalidParameterError", { enumerable: true, get: function() {
      return abiParameter_js_1.InvalidParameterError;
    } });
    Object.defineProperty(exports, "InvalidAbiParametersError", { enumerable: true, get: function() {
      return abiParameter_js_1.InvalidAbiParametersError;
    } });
    Object.defineProperty(exports, "InvalidAbiParameterError", { enumerable: true, get: function() {
      return abiParameter_js_1.InvalidAbiParameterError;
    } });
    var signature_js_1 = require_signature();
    Object.defineProperty(exports, "InvalidStructSignatureError", { enumerable: true, get: function() {
      return signature_js_1.InvalidStructSignatureError;
    } });
    Object.defineProperty(exports, "InvalidSignatureError", { enumerable: true, get: function() {
      return signature_js_1.InvalidSignatureError;
    } });
    Object.defineProperty(exports, "UnknownSignatureError", { enumerable: true, get: function() {
      return signature_js_1.UnknownSignatureError;
    } });
    var splitParameters_js_1 = require_splitParameters();
    Object.defineProperty(exports, "InvalidParenthesisError", { enumerable: true, get: function() {
      return splitParameters_js_1.InvalidParenthesisError;
    } });
    var struct_js_1 = require_struct();
    Object.defineProperty(exports, "CircularReferenceError", { enumerable: true, get: function() {
      return struct_js_1.CircularReferenceError;
    } });
  }
});

// node_modules/viem/_cjs/utils/getAction.js
var require_getAction = __commonJS({
  "node_modules/viem/_cjs/utils/getAction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAction = getAction;
    function getAction(client, actionFn, name) {
      const action_implicit = client[actionFn.name];
      if (typeof action_implicit === "function")
        return action_implicit;
      const action_explicit = client[name];
      if (typeof action_explicit === "function")
        return action_explicit;
      return (params) => actionFn(client, params);
    }
  }
});

// node_modules/viem/_cjs/utils/abi/formatAbiItem.js
var require_formatAbiItem2 = __commonJS({
  "node_modules/viem/_cjs/utils/abi/formatAbiItem.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatAbiItem = formatAbiItem;
    exports.formatAbiParams = formatAbiParams;
    var abi_js_1 = require_abi();
    function formatAbiItem(abiItem, { includeName = false } = {}) {
      if (abiItem.type !== "function" && abiItem.type !== "event" && abiItem.type !== "error")
        throw new abi_js_1.InvalidDefinitionTypeError(abiItem.type);
      return `${abiItem.name}(${formatAbiParams(abiItem.inputs, { includeName })})`;
    }
    function formatAbiParams(params, { includeName = false } = {}) {
      if (!params)
        return "";
      return params.map((param) => formatAbiParam(param, { includeName })).join(includeName ? ", " : ",");
    }
    function formatAbiParam(param, { includeName }) {
      if (param.type.startsWith("tuple")) {
        return `(${formatAbiParams(param.components, { includeName })})${param.type.slice("tuple".length)}`;
      }
      return param.type + (includeName && param.name ? ` ${param.name}` : "");
    }
  }
});

// node_modules/viem/_cjs/utils/data/isHex.js
var require_isHex = __commonJS({
  "node_modules/viem/_cjs/utils/data/isHex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isHex = isHex;
    function isHex(value, { strict = true } = {}) {
      if (!value)
        return false;
      if (typeof value !== "string")
        return false;
      return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
    }
  }
});

// node_modules/viem/_cjs/utils/data/size.js
var require_size = __commonJS({
  "node_modules/viem/_cjs/utils/data/size.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.size = size;
    var isHex_js_1 = require_isHex();
    function size(value) {
      if ((0, isHex_js_1.isHex)(value, { strict: false }))
        return Math.ceil((value.length - 2) / 2);
      return value.length;
    }
  }
});

// node_modules/viem/_cjs/errors/version.js
var require_version3 = __commonJS({
  "node_modules/viem/_cjs/errors/version.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "2.22.9";
  }
});

// node_modules/viem/_cjs/errors/base.js
var require_base = __commonJS({
  "node_modules/viem/_cjs/errors/base.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseError = void 0;
    exports.setErrorConfig = setErrorConfig;
    var version_js_1 = require_version3();
    var errorConfig = {
      getDocsUrl: ({ docsBaseUrl, docsPath = "", docsSlug }) => docsPath ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
      version: `viem@${version_js_1.version}`
    };
    function setErrorConfig(config) {
      errorConfig = config;
    }
    var BaseError = class _BaseError extends Error {
      constructor(shortMessage, args = {}) {
        var _a;
        const details = (() => {
          var _a2;
          if (args.cause instanceof _BaseError)
            return args.cause.details;
          if ((_a2 = args.cause) == null ? void 0 : _a2.message)
            return args.cause.message;
          return args.details;
        })();
        const docsPath = (() => {
          if (args.cause instanceof _BaseError)
            return args.cause.docsPath || args.docsPath;
          return args.docsPath;
        })();
        const docsUrl = (_a = errorConfig.getDocsUrl) == null ? void 0 : _a.call(errorConfig, { ...args, docsPath });
        const message = [
          shortMessage || "An error occurred.",
          "",
          ...args.metaMessages ? [...args.metaMessages, ""] : [],
          ...docsUrl ? [`Docs: ${docsUrl}`] : [],
          ...details ? [`Details: ${details}`] : [],
          ...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
        ].join("\n");
        super(message, args.cause ? { cause: args.cause } : void 0);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "version", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "BaseError"
        });
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = args.metaMessages;
        this.name = args.name ?? this.name;
        this.shortMessage = shortMessage;
        this.version = version_js_1.version;
      }
      walk(fn) {
        return walk(this, fn);
      }
    };
    exports.BaseError = BaseError;
    function walk(err, fn) {
      if (fn == null ? void 0 : fn(err))
        return err;
      if (err && typeof err === "object" && "cause" in err && err.cause !== void 0)
        return walk(err.cause, fn);
      return fn ? null : err;
    }
  }
});

// node_modules/viem/_cjs/errors/abi.js
var require_abi = __commonJS({
  "node_modules/viem/_cjs/errors/abi.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnsupportedPackedAbiType = exports.InvalidDefinitionTypeError = exports.InvalidArrayError = exports.InvalidAbiDecodingTypeError = exports.InvalidAbiEncodingTypeError = exports.DecodeLogTopicsMismatch = exports.DecodeLogDataMismatch = exports.BytesSizeMismatchError = exports.AbiItemAmbiguityError = exports.AbiFunctionSignatureNotFoundError = exports.AbiFunctionOutputsNotFoundError = exports.AbiFunctionNotFoundError = exports.AbiEventNotFoundError = exports.AbiEventSignatureNotFoundError = exports.AbiEventSignatureEmptyTopicsError = exports.AbiErrorSignatureNotFoundError = exports.AbiErrorNotFoundError = exports.AbiErrorInputsNotFoundError = exports.AbiEncodingLengthMismatchError = exports.AbiEncodingBytesSizeMismatchError = exports.AbiEncodingArrayLengthMismatchError = exports.AbiDecodingZeroDataError = exports.AbiDecodingDataSizeTooSmallError = exports.AbiDecodingDataSizeInvalidError = exports.AbiConstructorParamsNotFoundError = exports.AbiConstructorNotFoundError = void 0;
    var formatAbiItem_js_1 = require_formatAbiItem2();
    var size_js_1 = require_size();
    var base_js_1 = require_base();
    var AbiConstructorNotFoundError = class extends base_js_1.BaseError {
      constructor({ docsPath }) {
        super([
          "A constructor was not found on the ABI.",
          "Make sure you are using the correct ABI and that the constructor exists on it."
        ].join("\n"), {
          docsPath,
          name: "AbiConstructorNotFoundError"
        });
      }
    };
    exports.AbiConstructorNotFoundError = AbiConstructorNotFoundError;
    var AbiConstructorParamsNotFoundError = class extends base_js_1.BaseError {
      constructor({ docsPath }) {
        super([
          "Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.",
          "Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists."
        ].join("\n"), {
          docsPath,
          name: "AbiConstructorParamsNotFoundError"
        });
      }
    };
    exports.AbiConstructorParamsNotFoundError = AbiConstructorParamsNotFoundError;
    var AbiDecodingDataSizeInvalidError = class extends base_js_1.BaseError {
      constructor({ data, size }) {
        super([
          `Data size of ${size} bytes is invalid.`,
          "Size must be in increments of 32 bytes (size % 32 === 0)."
        ].join("\n"), {
          metaMessages: [`Data: ${data} (${size} bytes)`],
          name: "AbiDecodingDataSizeInvalidError"
        });
      }
    };
    exports.AbiDecodingDataSizeInvalidError = AbiDecodingDataSizeInvalidError;
    var AbiDecodingDataSizeTooSmallError = class extends base_js_1.BaseError {
      constructor({ data, params, size }) {
        super([`Data size of ${size} bytes is too small for given parameters.`].join("\n"), {
          metaMessages: [
            `Params: (${(0, formatAbiItem_js_1.formatAbiParams)(params, { includeName: true })})`,
            `Data:   ${data} (${size} bytes)`
          ],
          name: "AbiDecodingDataSizeTooSmallError"
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "params", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "size", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = data;
        this.params = params;
        this.size = size;
      }
    };
    exports.AbiDecodingDataSizeTooSmallError = AbiDecodingDataSizeTooSmallError;
    var AbiDecodingZeroDataError = class extends base_js_1.BaseError {
      constructor() {
        super('Cannot decode zero data ("0x") with ABI parameters.', {
          name: "AbiDecodingZeroDataError"
        });
      }
    };
    exports.AbiDecodingZeroDataError = AbiDecodingZeroDataError;
    var AbiEncodingArrayLengthMismatchError = class extends base_js_1.BaseError {
      constructor({ expectedLength, givenLength, type }) {
        super([
          `ABI encoding array length mismatch for type ${type}.`,
          `Expected length: ${expectedLength}`,
          `Given length: ${givenLength}`
        ].join("\n"), { name: "AbiEncodingArrayLengthMismatchError" });
      }
    };
    exports.AbiEncodingArrayLengthMismatchError = AbiEncodingArrayLengthMismatchError;
    var AbiEncodingBytesSizeMismatchError = class extends base_js_1.BaseError {
      constructor({ expectedSize, value }) {
        super(`Size of bytes "${value}" (bytes${(0, size_js_1.size)(value)}) does not match expected size (bytes${expectedSize}).`, { name: "AbiEncodingBytesSizeMismatchError" });
      }
    };
    exports.AbiEncodingBytesSizeMismatchError = AbiEncodingBytesSizeMismatchError;
    var AbiEncodingLengthMismatchError = class extends base_js_1.BaseError {
      constructor({ expectedLength, givenLength }) {
        super([
          "ABI encoding params/values length mismatch.",
          `Expected length (params): ${expectedLength}`,
          `Given length (values): ${givenLength}`
        ].join("\n"), { name: "AbiEncodingLengthMismatchError" });
      }
    };
    exports.AbiEncodingLengthMismatchError = AbiEncodingLengthMismatchError;
    var AbiErrorInputsNotFoundError = class extends base_js_1.BaseError {
      constructor(errorName, { docsPath }) {
        super([
          `Arguments (\`args\`) were provided to "${errorName}", but "${errorName}" on the ABI does not contain any parameters (\`inputs\`).`,
          "Cannot encode error result without knowing what the parameter types are.",
          "Make sure you are using the correct ABI and that the inputs exist on it."
        ].join("\n"), {
          docsPath,
          name: "AbiErrorInputsNotFoundError"
        });
      }
    };
    exports.AbiErrorInputsNotFoundError = AbiErrorInputsNotFoundError;
    var AbiErrorNotFoundError = class extends base_js_1.BaseError {
      constructor(errorName, { docsPath } = {}) {
        super([
          `Error ${errorName ? `"${errorName}" ` : ""}not found on ABI.`,
          "Make sure you are using the correct ABI and that the error exists on it."
        ].join("\n"), {
          docsPath,
          name: "AbiErrorNotFoundError"
        });
      }
    };
    exports.AbiErrorNotFoundError = AbiErrorNotFoundError;
    var AbiErrorSignatureNotFoundError = class extends base_js_1.BaseError {
      constructor(signature, { docsPath }) {
        super([
          `Encoded error signature "${signature}" not found on ABI.`,
          "Make sure you are using the correct ABI and that the error exists on it.",
          `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`
        ].join("\n"), {
          docsPath,
          name: "AbiErrorSignatureNotFoundError"
        });
        Object.defineProperty(this, "signature", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.signature = signature;
      }
    };
    exports.AbiErrorSignatureNotFoundError = AbiErrorSignatureNotFoundError;
    var AbiEventSignatureEmptyTopicsError = class extends base_js_1.BaseError {
      constructor({ docsPath }) {
        super("Cannot extract event signature from empty topics.", {
          docsPath,
          name: "AbiEventSignatureEmptyTopicsError"
        });
      }
    };
    exports.AbiEventSignatureEmptyTopicsError = AbiEventSignatureEmptyTopicsError;
    var AbiEventSignatureNotFoundError = class extends base_js_1.BaseError {
      constructor(signature, { docsPath }) {
        super([
          `Encoded event signature "${signature}" not found on ABI.`,
          "Make sure you are using the correct ABI and that the event exists on it.",
          `You can look up the signature here: https://openchain.xyz/signatures?query=${signature}.`
        ].join("\n"), {
          docsPath,
          name: "AbiEventSignatureNotFoundError"
        });
      }
    };
    exports.AbiEventSignatureNotFoundError = AbiEventSignatureNotFoundError;
    var AbiEventNotFoundError = class extends base_js_1.BaseError {
      constructor(eventName, { docsPath } = {}) {
        super([
          `Event ${eventName ? `"${eventName}" ` : ""}not found on ABI.`,
          "Make sure you are using the correct ABI and that the event exists on it."
        ].join("\n"), {
          docsPath,
          name: "AbiEventNotFoundError"
        });
      }
    };
    exports.AbiEventNotFoundError = AbiEventNotFoundError;
    var AbiFunctionNotFoundError = class extends base_js_1.BaseError {
      constructor(functionName, { docsPath } = {}) {
        super([
          `Function ${functionName ? `"${functionName}" ` : ""}not found on ABI.`,
          "Make sure you are using the correct ABI and that the function exists on it."
        ].join("\n"), {
          docsPath,
          name: "AbiFunctionNotFoundError"
        });
      }
    };
    exports.AbiFunctionNotFoundError = AbiFunctionNotFoundError;
    var AbiFunctionOutputsNotFoundError = class extends base_js_1.BaseError {
      constructor(functionName, { docsPath }) {
        super([
          `Function "${functionName}" does not contain any \`outputs\` on ABI.`,
          "Cannot decode function result without knowing what the parameter types are.",
          "Make sure you are using the correct ABI and that the function exists on it."
        ].join("\n"), {
          docsPath,
          name: "AbiFunctionOutputsNotFoundError"
        });
      }
    };
    exports.AbiFunctionOutputsNotFoundError = AbiFunctionOutputsNotFoundError;
    var AbiFunctionSignatureNotFoundError = class extends base_js_1.BaseError {
      constructor(signature, { docsPath }) {
        super([
          `Encoded function signature "${signature}" not found on ABI.`,
          "Make sure you are using the correct ABI and that the function exists on it.",
          `You can look up the signature here: https://openchain.xyz/signatures?query=${signature}.`
        ].join("\n"), {
          docsPath,
          name: "AbiFunctionSignatureNotFoundError"
        });
      }
    };
    exports.AbiFunctionSignatureNotFoundError = AbiFunctionSignatureNotFoundError;
    var AbiItemAmbiguityError = class extends base_js_1.BaseError {
      constructor(x, y) {
        super("Found ambiguous types in overloaded ABI items.", {
          metaMessages: [
            `\`${x.type}\` in \`${(0, formatAbiItem_js_1.formatAbiItem)(x.abiItem)}\`, and`,
            `\`${y.type}\` in \`${(0, formatAbiItem_js_1.formatAbiItem)(y.abiItem)}\``,
            "",
            "These types encode differently and cannot be distinguished at runtime.",
            "Remove one of the ambiguous items in the ABI."
          ],
          name: "AbiItemAmbiguityError"
        });
      }
    };
    exports.AbiItemAmbiguityError = AbiItemAmbiguityError;
    var BytesSizeMismatchError = class extends base_js_1.BaseError {
      constructor({ expectedSize, givenSize }) {
        super(`Expected bytes${expectedSize}, got bytes${givenSize}.`, {
          name: "BytesSizeMismatchError"
        });
      }
    };
    exports.BytesSizeMismatchError = BytesSizeMismatchError;
    var DecodeLogDataMismatch = class extends base_js_1.BaseError {
      constructor({ abiItem, data, params, size }) {
        super([
          `Data size of ${size} bytes is too small for non-indexed event parameters.`
        ].join("\n"), {
          metaMessages: [
            `Params: (${(0, formatAbiItem_js_1.formatAbiParams)(params, { includeName: true })})`,
            `Data:   ${data} (${size} bytes)`
          ],
          name: "DecodeLogDataMismatch"
        });
        Object.defineProperty(this, "abiItem", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "params", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "size", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.abiItem = abiItem;
        this.data = data;
        this.params = params;
        this.size = size;
      }
    };
    exports.DecodeLogDataMismatch = DecodeLogDataMismatch;
    var DecodeLogTopicsMismatch = class extends base_js_1.BaseError {
      constructor({ abiItem, param }) {
        super([
          `Expected a topic for indexed event parameter${param.name ? ` "${param.name}"` : ""} on event "${(0, formatAbiItem_js_1.formatAbiItem)(abiItem, { includeName: true })}".`
        ].join("\n"), { name: "DecodeLogTopicsMismatch" });
        Object.defineProperty(this, "abiItem", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.abiItem = abiItem;
      }
    };
    exports.DecodeLogTopicsMismatch = DecodeLogTopicsMismatch;
    var InvalidAbiEncodingTypeError = class extends base_js_1.BaseError {
      constructor(type, { docsPath }) {
        super([
          `Type "${type}" is not a valid encoding type.`,
          "Please provide a valid ABI type."
        ].join("\n"), { docsPath, name: "InvalidAbiEncodingType" });
      }
    };
    exports.InvalidAbiEncodingTypeError = InvalidAbiEncodingTypeError;
    var InvalidAbiDecodingTypeError = class extends base_js_1.BaseError {
      constructor(type, { docsPath }) {
        super([
          `Type "${type}" is not a valid decoding type.`,
          "Please provide a valid ABI type."
        ].join("\n"), { docsPath, name: "InvalidAbiDecodingType" });
      }
    };
    exports.InvalidAbiDecodingTypeError = InvalidAbiDecodingTypeError;
    var InvalidArrayError = class extends base_js_1.BaseError {
      constructor(value) {
        super([`Value "${value}" is not a valid array.`].join("\n"), {
          name: "InvalidArrayError"
        });
      }
    };
    exports.InvalidArrayError = InvalidArrayError;
    var InvalidDefinitionTypeError = class extends base_js_1.BaseError {
      constructor(type) {
        super([
          `"${type}" is not a valid definition type.`,
          'Valid types: "function", "event", "error"'
        ].join("\n"), { name: "InvalidDefinitionTypeError" });
      }
    };
    exports.InvalidDefinitionTypeError = InvalidDefinitionTypeError;
    var UnsupportedPackedAbiType = class extends base_js_1.BaseError {
      constructor(type) {
        super(`Type "${type}" is not supported for packed encoding.`, {
          name: "UnsupportedPackedAbiType"
        });
      }
    };
    exports.UnsupportedPackedAbiType = UnsupportedPackedAbiType;
  }
});

// node_modules/viem/_cjs/errors/log.js
var require_log = __commonJS({
  "node_modules/viem/_cjs/errors/log.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FilterTypeNotSupportedError = void 0;
    var base_js_1 = require_base();
    var FilterTypeNotSupportedError = class extends base_js_1.BaseError {
      constructor(type) {
        super(`Filter type "${type}" is not supported.`, {
          name: "FilterTypeNotSupportedError"
        });
      }
    };
    exports.FilterTypeNotSupportedError = FilterTypeNotSupportedError;
  }
});

// node_modules/viem/_cjs/errors/data.js
var require_data = __commonJS({
  "node_modules/viem/_cjs/errors/data.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidBytesLengthError = exports.SizeExceedsPaddingSizeError = exports.SliceOffsetOutOfBoundsError = void 0;
    var base_js_1 = require_base();
    var SliceOffsetOutOfBoundsError = class extends base_js_1.BaseError {
      constructor({ offset, position, size }) {
        super(`Slice ${position === "start" ? "starting" : "ending"} at offset "${offset}" is out-of-bounds (size: ${size}).`, { name: "SliceOffsetOutOfBoundsError" });
      }
    };
    exports.SliceOffsetOutOfBoundsError = SliceOffsetOutOfBoundsError;
    var SizeExceedsPaddingSizeError = class extends base_js_1.BaseError {
      constructor({ size, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
      }
    };
    exports.SizeExceedsPaddingSizeError = SizeExceedsPaddingSizeError;
    var InvalidBytesLengthError = class extends base_js_1.BaseError {
      constructor({ size, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} is expected to be ${targetSize} ${type} long, but is ${size} ${type} long.`, { name: "InvalidBytesLengthError" });
      }
    };
    exports.InvalidBytesLengthError = InvalidBytesLengthError;
  }
});

// node_modules/viem/_cjs/utils/data/pad.js
var require_pad = __commonJS({
  "node_modules/viem/_cjs/utils/data/pad.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pad = pad;
    exports.padHex = padHex;
    exports.padBytes = padBytes;
    var data_js_1 = require_data();
    function pad(hexOrBytes, { dir, size = 32 } = {}) {
      if (typeof hexOrBytes === "string")
        return padHex(hexOrBytes, { dir, size });
      return padBytes(hexOrBytes, { dir, size });
    }
    function padHex(hex_, { dir, size = 32 } = {}) {
      if (size === null)
        return hex_;
      const hex = hex_.replace("0x", "");
      if (hex.length > size * 2)
        throw new data_js_1.SizeExceedsPaddingSizeError({
          size: Math.ceil(hex.length / 2),
          targetSize: size,
          type: "hex"
        });
      return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size * 2, "0")}`;
    }
    function padBytes(bytes, { dir, size = 32 } = {}) {
      if (size === null)
        return bytes;
      if (bytes.length > size)
        throw new data_js_1.SizeExceedsPaddingSizeError({
          size: bytes.length,
          targetSize: size,
          type: "bytes"
        });
      const paddedBytes = new Uint8Array(size);
      for (let i = 0; i < size; i++) {
        const padEnd = dir === "right";
        paddedBytes[padEnd ? i : size - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
      }
      return paddedBytes;
    }
  }
});

// node_modules/viem/_cjs/errors/encoding.js
var require_encoding = __commonJS({
  "node_modules/viem/_cjs/errors/encoding.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SizeOverflowError = exports.InvalidHexValueError = exports.InvalidHexBooleanError = exports.InvalidBytesBooleanError = exports.IntegerOutOfRangeError = void 0;
    var base_js_1 = require_base();
    var IntegerOutOfRangeError = class extends base_js_1.BaseError {
      constructor({ max, min, signed, size, value }) {
        super(`Number "${value}" is not in safe ${size ? `${size * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
      }
    };
    exports.IntegerOutOfRangeError = IntegerOutOfRangeError;
    var InvalidBytesBooleanError = class extends base_js_1.BaseError {
      constructor(bytes) {
        super(`Bytes value "${bytes}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, {
          name: "InvalidBytesBooleanError"
        });
      }
    };
    exports.InvalidBytesBooleanError = InvalidBytesBooleanError;
    var InvalidHexBooleanError = class extends base_js_1.BaseError {
      constructor(hex) {
        super(`Hex value "${hex}" is not a valid boolean. The hex value must be "0x0" (false) or "0x1" (true).`, { name: "InvalidHexBooleanError" });
      }
    };
    exports.InvalidHexBooleanError = InvalidHexBooleanError;
    var InvalidHexValueError = class extends base_js_1.BaseError {
      constructor(value) {
        super(`Hex value "${value}" is an odd length (${value.length}). It must be an even length.`, { name: "InvalidHexValueError" });
      }
    };
    exports.InvalidHexValueError = InvalidHexValueError;
    var SizeOverflowError = class extends base_js_1.BaseError {
      constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
      }
    };
    exports.SizeOverflowError = SizeOverflowError;
  }
});

// node_modules/viem/_cjs/utils/data/trim.js
var require_trim = __commonJS({
  "node_modules/viem/_cjs/utils/data/trim.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.trim = trim;
    function trim(hexOrBytes, { dir = "left" } = {}) {
      let data = typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;
      let sliceLength = 0;
      for (let i = 0; i < data.length - 1; i++) {
        if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
          sliceLength++;
        else
          break;
      }
      data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
      if (typeof hexOrBytes === "string") {
        if (data.length === 1 && dir === "right")
          data = `${data}0`;
        return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
      }
      return data;
    }
  }
});

// node_modules/viem/_cjs/utils/encoding/fromHex.js
var require_fromHex = __commonJS({
  "node_modules/viem/_cjs/utils/encoding/fromHex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertSize = assertSize;
    exports.fromHex = fromHex;
    exports.hexToBigInt = hexToBigInt;
    exports.hexToBool = hexToBool;
    exports.hexToNumber = hexToNumber;
    exports.hexToString = hexToString;
    var encoding_js_1 = require_encoding();
    var size_js_1 = require_size();
    var trim_js_1 = require_trim();
    var toBytes_js_1 = require_toBytes();
    function assertSize(hexOrBytes, { size }) {
      if ((0, size_js_1.size)(hexOrBytes) > size)
        throw new encoding_js_1.SizeOverflowError({
          givenSize: (0, size_js_1.size)(hexOrBytes),
          maxSize: size
        });
    }
    function fromHex(hex, toOrOpts) {
      const opts = typeof toOrOpts === "string" ? { to: toOrOpts } : toOrOpts;
      const to = opts.to;
      if (to === "number")
        return hexToNumber(hex, opts);
      if (to === "bigint")
        return hexToBigInt(hex, opts);
      if (to === "string")
        return hexToString(hex, opts);
      if (to === "boolean")
        return hexToBool(hex, opts);
      return (0, toBytes_js_1.hexToBytes)(hex, opts);
    }
    function hexToBigInt(hex, opts = {}) {
      const { signed } = opts;
      if (opts.size)
        assertSize(hex, { size: opts.size });
      const value = BigInt(hex);
      if (!signed)
        return value;
      const size = (hex.length - 2) / 2;
      const max = (1n << BigInt(size) * 8n - 1n) - 1n;
      if (value <= max)
        return value;
      return value - BigInt(`0x${"f".padStart(size * 2, "f")}`) - 1n;
    }
    function hexToBool(hex_, opts = {}) {
      let hex = hex_;
      if (opts.size) {
        assertSize(hex, { size: opts.size });
        hex = (0, trim_js_1.trim)(hex);
      }
      if ((0, trim_js_1.trim)(hex) === "0x00")
        return false;
      if ((0, trim_js_1.trim)(hex) === "0x01")
        return true;
      throw new encoding_js_1.InvalidHexBooleanError(hex);
    }
    function hexToNumber(hex, opts = {}) {
      return Number(hexToBigInt(hex, opts));
    }
    function hexToString(hex, opts = {}) {
      let bytes = (0, toBytes_js_1.hexToBytes)(hex);
      if (opts.size) {
        assertSize(bytes, { size: opts.size });
        bytes = (0, trim_js_1.trim)(bytes, { dir: "right" });
      }
      return new TextDecoder().decode(bytes);
    }
  }
});

// node_modules/viem/_cjs/utils/encoding/toHex.js
var require_toHex = __commonJS({
  "node_modules/viem/_cjs/utils/encoding/toHex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toHex = toHex;
    exports.boolToHex = boolToHex;
    exports.bytesToHex = bytesToHex;
    exports.numberToHex = numberToHex;
    exports.stringToHex = stringToHex;
    var encoding_js_1 = require_encoding();
    var pad_js_1 = require_pad();
    var fromHex_js_1 = require_fromHex();
    var hexes = Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
    function toHex(value, opts = {}) {
      if (typeof value === "number" || typeof value === "bigint")
        return numberToHex(value, opts);
      if (typeof value === "string") {
        return stringToHex(value, opts);
      }
      if (typeof value === "boolean")
        return boolToHex(value, opts);
      return bytesToHex(value, opts);
    }
    function boolToHex(value, opts = {}) {
      const hex = `0x${Number(value)}`;
      if (typeof opts.size === "number") {
        (0, fromHex_js_1.assertSize)(hex, { size: opts.size });
        return (0, pad_js_1.pad)(hex, { size: opts.size });
      }
      return hex;
    }
    function bytesToHex(value, opts = {}) {
      let string = "";
      for (let i = 0; i < value.length; i++) {
        string += hexes[value[i]];
      }
      const hex = `0x${string}`;
      if (typeof opts.size === "number") {
        (0, fromHex_js_1.assertSize)(hex, { size: opts.size });
        return (0, pad_js_1.pad)(hex, { dir: "right", size: opts.size });
      }
      return hex;
    }
    function numberToHex(value_, opts = {}) {
      const { signed, size } = opts;
      const value = BigInt(value_);
      let maxValue;
      if (size) {
        if (signed)
          maxValue = (1n << BigInt(size) * 8n - 1n) - 1n;
        else
          maxValue = 2n ** (BigInt(size) * 8n) - 1n;
      } else if (typeof value_ === "number") {
        maxValue = BigInt(Number.MAX_SAFE_INTEGER);
      }
      const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
      if (maxValue && value > maxValue || value < minValue) {
        const suffix = typeof value_ === "bigint" ? "n" : "";
        throw new encoding_js_1.IntegerOutOfRangeError({
          max: maxValue ? `${maxValue}${suffix}` : void 0,
          min: `${minValue}${suffix}`,
          signed,
          size,
          value: `${value_}${suffix}`
        });
      }
      const hex = `0x${(signed && value < 0 ? (1n << BigInt(size * 8)) + BigInt(value) : value).toString(16)}`;
      if (size)
        return (0, pad_js_1.pad)(hex, { size });
      return hex;
    }
    var encoder = new TextEncoder();
    function stringToHex(value_, opts = {}) {
      const value = encoder.encode(value_);
      return bytesToHex(value, opts);
    }
  }
});

// node_modules/viem/_cjs/utils/encoding/toBytes.js
var require_toBytes = __commonJS({
  "node_modules/viem/_cjs/utils/encoding/toBytes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toBytes = toBytes;
    exports.boolToBytes = boolToBytes;
    exports.hexToBytes = hexToBytes;
    exports.numberToBytes = numberToBytes;
    exports.stringToBytes = stringToBytes;
    var base_js_1 = require_base();
    var isHex_js_1 = require_isHex();
    var pad_js_1 = require_pad();
    var fromHex_js_1 = require_fromHex();
    var toHex_js_1 = require_toHex();
    var encoder = new TextEncoder();
    function toBytes(value, opts = {}) {
      if (typeof value === "number" || typeof value === "bigint")
        return numberToBytes(value, opts);
      if (typeof value === "boolean")
        return boolToBytes(value, opts);
      if ((0, isHex_js_1.isHex)(value))
        return hexToBytes(value, opts);
      return stringToBytes(value, opts);
    }
    function boolToBytes(value, opts = {}) {
      const bytes = new Uint8Array(1);
      bytes[0] = Number(value);
      if (typeof opts.size === "number") {
        (0, fromHex_js_1.assertSize)(bytes, { size: opts.size });
        return (0, pad_js_1.pad)(bytes, { size: opts.size });
      }
      return bytes;
    }
    var charCodeMap = {
      zero: 48,
      nine: 57,
      A: 65,
      F: 70,
      a: 97,
      f: 102
    };
    function charCodeToBase16(char) {
      if (char >= charCodeMap.zero && char <= charCodeMap.nine)
        return char - charCodeMap.zero;
      if (char >= charCodeMap.A && char <= charCodeMap.F)
        return char - (charCodeMap.A - 10);
      if (char >= charCodeMap.a && char <= charCodeMap.f)
        return char - (charCodeMap.a - 10);
      return void 0;
    }
    function hexToBytes(hex_, opts = {}) {
      let hex = hex_;
      if (opts.size) {
        (0, fromHex_js_1.assertSize)(hex, { size: opts.size });
        hex = (0, pad_js_1.pad)(hex, { dir: "right", size: opts.size });
      }
      let hexString = hex.slice(2);
      if (hexString.length % 2)
        hexString = `0${hexString}`;
      const length = hexString.length / 2;
      const bytes = new Uint8Array(length);
      for (let index = 0, j = 0; index < length; index++) {
        const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
        const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
        if (nibbleLeft === void 0 || nibbleRight === void 0) {
          throw new base_js_1.BaseError(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
        }
        bytes[index] = nibbleLeft * 16 + nibbleRight;
      }
      return bytes;
    }
    function numberToBytes(value, opts) {
      const hex = (0, toHex_js_1.numberToHex)(value, opts);
      return hexToBytes(hex);
    }
    function stringToBytes(value, opts = {}) {
      const bytes = encoder.encode(value);
      if (typeof opts.size === "number") {
        (0, fromHex_js_1.assertSize)(bytes, { size: opts.size });
        return (0, pad_js_1.pad)(bytes, { dir: "right", size: opts.size });
      }
      return bytes;
    }
  }
});

// node_modules/viem/node_modules/@noble/hashes/_assert.js
var require_assert = __commonJS({
  "node_modules/viem/node_modules/@noble/hashes/_assert.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.anumber = anumber;
    exports.number = anumber;
    exports.abytes = abytes;
    exports.bytes = abytes;
    exports.ahash = ahash;
    exports.aexists = aexists;
    exports.aoutput = aoutput;
    function anumber(n) {
      if (!Number.isSafeInteger(n) || n < 0)
        throw new Error("positive integer expected, got " + n);
    }
    function isBytes(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    function abytes(b, ...lengths) {
      if (!isBytes(b))
        throw new Error("Uint8Array expected");
      if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
    }
    function ahash(h) {
      if (typeof h !== "function" || typeof h.create !== "function")
        throw new Error("Hash should be wrapped by utils.wrapConstructor");
      anumber(h.outputLen);
      anumber(h.blockLen);
    }
    function aexists(instance, checkFinished = true) {
      if (instance.destroyed)
        throw new Error("Hash instance has been destroyed");
      if (checkFinished && instance.finished)
        throw new Error("Hash#digest() has already been called");
    }
    function aoutput(out, instance) {
      abytes(out);
      const min = instance.outputLen;
      if (out.length < min) {
        throw new Error("digestInto() expects output buffer of length at least " + min);
      }
    }
    var assert = {
      number: anumber,
      bytes: abytes,
      hash: ahash,
      exists: aexists,
      output: aoutput
    };
    exports.default = assert;
  }
});

// node_modules/viem/node_modules/@noble/hashes/_u64.js
var require_u64 = __commonJS({
  "node_modules/viem/node_modules/@noble/hashes/_u64.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.add5L = exports.add5H = exports.add4H = exports.add4L = exports.add3H = exports.add3L = exports.rotlBL = exports.rotlBH = exports.rotlSL = exports.rotlSH = exports.rotr32L = exports.rotr32H = exports.rotrBL = exports.rotrBH = exports.rotrSL = exports.rotrSH = exports.shrSL = exports.shrSH = exports.toBig = void 0;
    exports.fromBig = fromBig;
    exports.split = split;
    exports.add = add;
    var U32_MASK64 = BigInt(2 ** 32 - 1);
    var _32n = BigInt(32);
    function fromBig(n, le = false) {
      if (le)
        return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
      return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
    }
    function split(lst, le = false) {
      let Ah = new Uint32Array(lst.length);
      let Al = new Uint32Array(lst.length);
      for (let i = 0; i < lst.length; i++) {
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
      }
      return [Ah, Al];
    }
    var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
    exports.toBig = toBig;
    var shrSH = (h, _l, s) => h >>> s;
    exports.shrSH = shrSH;
    var shrSL = (h, l, s) => h << 32 - s | l >>> s;
    exports.shrSL = shrSL;
    var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
    exports.rotrSH = rotrSH;
    var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
    exports.rotrSL = rotrSL;
    var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
    exports.rotrBH = rotrBH;
    var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
    exports.rotrBL = rotrBL;
    var rotr32H = (_h, l) => l;
    exports.rotr32H = rotr32H;
    var rotr32L = (h, _l) => h;
    exports.rotr32L = rotr32L;
    var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
    exports.rotlSH = rotlSH;
    var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
    exports.rotlSL = rotlSL;
    var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
    exports.rotlBH = rotlBH;
    var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
    exports.rotlBL = rotlBL;
    function add(Ah, Al, Bh, Bl) {
      const l = (Al >>> 0) + (Bl >>> 0);
      return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
    }
    var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
    exports.add3L = add3L;
    var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
    exports.add3H = add3H;
    var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
    exports.add4L = add4L;
    var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
    exports.add4H = add4H;
    var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
    exports.add5L = add5L;
    var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
    exports.add5H = add5H;
    var u64 = {
      fromBig,
      split,
      toBig,
      shrSH,
      shrSL,
      rotrSH,
      rotrSL,
      rotrBH,
      rotrBL,
      rotr32H,
      rotr32L,
      rotlSH,
      rotlSL,
      rotlBH,
      rotlBL,
      add,
      add3L,
      add3H,
      add4L,
      add4H,
      add5H,
      add5L
    };
    exports.default = u64;
  }
});

// node_modules/viem/node_modules/@noble/hashes/crypto.js
var require_crypto = __commonJS({
  "node_modules/viem/node_modules/@noble/hashes/crypto.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.crypto = void 0;
    exports.crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
  }
});

// node_modules/viem/node_modules/@noble/hashes/utils.js
var require_utils3 = __commonJS({
  "node_modules/viem/node_modules/@noble/hashes/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hash = exports.nextTick = exports.byteSwapIfBE = exports.byteSwap = exports.isLE = exports.rotl = exports.rotr = exports.createView = exports.u32 = exports.u8 = void 0;
    exports.isBytes = isBytes;
    exports.byteSwap32 = byteSwap32;
    exports.bytesToHex = bytesToHex;
    exports.hexToBytes = hexToBytes;
    exports.asyncLoop = asyncLoop;
    exports.utf8ToBytes = utf8ToBytes;
    exports.toBytes = toBytes;
    exports.concatBytes = concatBytes;
    exports.checkOpts = checkOpts;
    exports.wrapConstructor = wrapConstructor;
    exports.wrapConstructorWithOpts = wrapConstructorWithOpts;
    exports.wrapXOFConstructorWithOpts = wrapXOFConstructorWithOpts;
    exports.randomBytes = randomBytes;
    var crypto_1 = require_crypto();
    var _assert_js_1 = require_assert();
    function isBytes(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    var u8 = (arr) => new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    exports.u8 = u8;
    var u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    exports.u32 = u32;
    var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    exports.createView = createView;
    var rotr = (word, shift) => word << 32 - shift | word >>> shift;
    exports.rotr = rotr;
    var rotl = (word, shift) => word << shift | word >>> 32 - shift >>> 0;
    exports.rotl = rotl;
    exports.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    var byteSwap = (word) => word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
    exports.byteSwap = byteSwap;
    exports.byteSwapIfBE = exports.isLE ? (n) => n : (n) => (0, exports.byteSwap)(n);
    function byteSwap32(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = (0, exports.byteSwap)(arr[i]);
      }
    }
    var hexes = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex(bytes) {
      (0, _assert_js_1.abytes)(bytes);
      let hex = "";
      for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
      }
      return hex;
    }
    var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    function asciiToBase16(ch) {
      if (ch >= asciis._0 && ch <= asciis._9)
        return ch - asciis._0;
      if (ch >= asciis.A && ch <= asciis.F)
        return ch - (asciis.A - 10);
      if (ch >= asciis.a && ch <= asciis.f)
        return ch - (asciis.a - 10);
      return;
    }
    function hexToBytes(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      const hl = hex.length;
      const al = hl / 2;
      if (hl % 2)
        throw new Error("hex string expected, got unpadded hex of length " + hl);
      const array = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex[hi] + hex[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
      }
      return array;
    }
    var nextTick = async () => {
    };
    exports.nextTick = nextTick;
    async function asyncLoop(iters, tick, cb) {
      let ts = Date.now();
      for (let i = 0; i < iters; i++) {
        cb(i);
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick)
          continue;
        await (0, exports.nextTick)();
        ts += diff;
      }
    }
    function utf8ToBytes(str) {
      if (typeof str !== "string")
        throw new Error("utf8ToBytes expected string, got " + typeof str);
      return new Uint8Array(new TextEncoder().encode(str));
    }
    function toBytes(data) {
      if (typeof data === "string")
        data = utf8ToBytes(data);
      (0, _assert_js_1.abytes)(data);
      return data;
    }
    function concatBytes(...arrays) {
      let sum = 0;
      for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        (0, _assert_js_1.abytes)(a);
        sum += a.length;
      }
      const res = new Uint8Array(sum);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
      }
      return res;
    }
    var Hash = class {
      // Safe version that clones internal state
      clone() {
        return this._cloneInto();
      }
    };
    exports.Hash = Hash;
    function checkOpts(defaults, opts) {
      if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
        throw new Error("Options should be object or undefined");
      const merged = Object.assign(defaults, opts);
      return merged;
    }
    function wrapConstructor(hashCons) {
      const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
      const tmp = hashCons();
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = () => hashCons();
      return hashC;
    }
    function wrapConstructorWithOpts(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    function wrapXOFConstructorWithOpts(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    function randomBytes(bytesLength = 32) {
      if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
        return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
      }
      if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
        return crypto_1.crypto.randomBytes(bytesLength);
      }
      throw new Error("crypto.getRandomValues must be defined");
    }
  }
});

// node_modules/viem/node_modules/@noble/hashes/sha3.js
var require_sha3 = __commonJS({
  "node_modules/viem/node_modules/@noble/hashes/sha3.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shake256 = exports.shake128 = exports.keccak_512 = exports.keccak_384 = exports.keccak_256 = exports.keccak_224 = exports.sha3_512 = exports.sha3_384 = exports.sha3_256 = exports.sha3_224 = exports.Keccak = void 0;
    exports.keccakP = keccakP;
    var _assert_js_1 = require_assert();
    var _u64_js_1 = require_u64();
    var utils_js_1 = require_utils3();
    var SHA3_PI = [];
    var SHA3_ROTL = [];
    var _SHA3_IOTA = [];
    var _0n = BigInt(0);
    var _1n = BigInt(1);
    var _2n = BigInt(2);
    var _7n = BigInt(7);
    var _256n = BigInt(256);
    var _0x71n = BigInt(113);
    for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
      [x, y] = [y, (2 * x + 3 * y) % 5];
      SHA3_PI.push(2 * (5 * y + x));
      SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
      let t = _0n;
      for (let j = 0; j < 7; j++) {
        R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
        if (R & _2n)
          t ^= _1n << (_1n << BigInt(j)) - _1n;
      }
      _SHA3_IOTA.push(t);
    }
    var [SHA3_IOTA_H, SHA3_IOTA_L] = (0, _u64_js_1.split)(_SHA3_IOTA, true);
    var rotlH = (h, l, s) => s > 32 ? (0, _u64_js_1.rotlBH)(h, l, s) : (0, _u64_js_1.rotlSH)(h, l, s);
    var rotlL = (h, l, s) => s > 32 ? (0, _u64_js_1.rotlBL)(h, l, s) : (0, _u64_js_1.rotlSL)(h, l, s);
    function keccakP(s, rounds = 24) {
      const B = new Uint32Array(5 * 2);
      for (let round = 24 - rounds; round < 24; round++) {
        for (let x = 0; x < 10; x++)
          B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
        for (let x = 0; x < 10; x += 2) {
          const idx1 = (x + 8) % 10;
          const idx0 = (x + 2) % 10;
          const B0 = B[idx0];
          const B1 = B[idx0 + 1];
          const Th = rotlH(B0, B1, 1) ^ B[idx1];
          const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
          for (let y = 0; y < 50; y += 10) {
            s[x + y] ^= Th;
            s[x + y + 1] ^= Tl;
          }
        }
        let curH = s[2];
        let curL = s[3];
        for (let t = 0; t < 24; t++) {
          const shift = SHA3_ROTL[t];
          const Th = rotlH(curH, curL, shift);
          const Tl = rotlL(curH, curL, shift);
          const PI = SHA3_PI[t];
          curH = s[PI];
          curL = s[PI + 1];
          s[PI] = Th;
          s[PI + 1] = Tl;
        }
        for (let y = 0; y < 50; y += 10) {
          for (let x = 0; x < 10; x++)
            B[x] = s[y + x];
          for (let x = 0; x < 10; x++)
            s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
        }
        s[0] ^= SHA3_IOTA_H[round];
        s[1] ^= SHA3_IOTA_L[round];
      }
      B.fill(0);
    }
    var Keccak = class _Keccak extends utils_js_1.Hash {
      // NOTE: we accept arguments in bytes instead of bits here.
      constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
        super();
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        (0, _assert_js_1.anumber)(outputLen);
        if (0 >= this.blockLen || this.blockLen >= 200)
          throw new Error("Sha3 supports only keccak-f1600 function");
        this.state = new Uint8Array(200);
        this.state32 = (0, utils_js_1.u32)(this.state);
      }
      keccak() {
        if (!utils_js_1.isLE)
          (0, utils_js_1.byteSwap32)(this.state32);
        keccakP(this.state32, this.rounds);
        if (!utils_js_1.isLE)
          (0, utils_js_1.byteSwap32)(this.state32);
        this.posOut = 0;
        this.pos = 0;
      }
      update(data) {
        (0, _assert_js_1.aexists)(this);
        const { blockLen, state } = this;
        data = (0, utils_js_1.toBytes)(data);
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          for (let i = 0; i < take; i++)
            state[this.pos++] ^= data[pos++];
          if (this.pos === blockLen)
            this.keccak();
        }
        return this;
      }
      finish() {
        if (this.finished)
          return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        state[pos] ^= suffix;
        if ((suffix & 128) !== 0 && pos === blockLen - 1)
          this.keccak();
        state[blockLen - 1] ^= 128;
        this.keccak();
      }
      writeInto(out) {
        (0, _assert_js_1.aexists)(this, false);
        (0, _assert_js_1.abytes)(out);
        this.finish();
        const bufferOut = this.state;
        const { blockLen } = this;
        for (let pos = 0, len = out.length; pos < len; ) {
          if (this.posOut >= blockLen)
            this.keccak();
          const take = Math.min(blockLen - this.posOut, len - pos);
          out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
          this.posOut += take;
          pos += take;
        }
        return out;
      }
      xofInto(out) {
        if (!this.enableXOF)
          throw new Error("XOF is not possible for this instance");
        return this.writeInto(out);
      }
      xof(bytes) {
        (0, _assert_js_1.anumber)(bytes);
        return this.xofInto(new Uint8Array(bytes));
      }
      digestInto(out) {
        (0, _assert_js_1.aoutput)(out, this);
        if (this.finished)
          throw new Error("digest() was already called");
        this.writeInto(out);
        this.destroy();
        return out;
      }
      digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
      }
      destroy() {
        this.destroyed = true;
        this.state.fill(0);
      }
      _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
      }
    };
    exports.Keccak = Keccak;
    var gen = (suffix, blockLen, outputLen) => (0, utils_js_1.wrapConstructor)(() => new Keccak(blockLen, suffix, outputLen));
    exports.sha3_224 = gen(6, 144, 224 / 8);
    exports.sha3_256 = gen(6, 136, 256 / 8);
    exports.sha3_384 = gen(6, 104, 384 / 8);
    exports.sha3_512 = gen(6, 72, 512 / 8);
    exports.keccak_224 = gen(1, 144, 224 / 8);
    exports.keccak_256 = gen(1, 136, 256 / 8);
    exports.keccak_384 = gen(1, 104, 384 / 8);
    exports.keccak_512 = gen(1, 72, 512 / 8);
    var genShake = (suffix, blockLen, outputLen) => (0, utils_js_1.wrapXOFConstructorWithOpts)((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === void 0 ? outputLen : opts.dkLen, true));
    exports.shake128 = genShake(31, 168, 128 / 8);
    exports.shake256 = genShake(31, 136, 256 / 8);
  }
});

// node_modules/viem/_cjs/utils/hash/keccak256.js
var require_keccak256 = __commonJS({
  "node_modules/viem/_cjs/utils/hash/keccak256.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.keccak256 = keccak256;
    var sha3_1 = require_sha3();
    var isHex_js_1 = require_isHex();
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    function keccak256(value, to_) {
      const to = to_ || "hex";
      const bytes = (0, sha3_1.keccak_256)((0, isHex_js_1.isHex)(value, { strict: false }) ? (0, toBytes_js_1.toBytes)(value) : value);
      if (to === "bytes")
        return bytes;
      return (0, toHex_js_1.toHex)(bytes);
    }
  }
});

// node_modules/viem/_cjs/utils/hash/hashSignature.js
var require_hashSignature = __commonJS({
  "node_modules/viem/_cjs/utils/hash/hashSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hashSignature = hashSignature;
    var toBytes_js_1 = require_toBytes();
    var keccak256_js_1 = require_keccak256();
    var hash = (value) => (0, keccak256_js_1.keccak256)((0, toBytes_js_1.toBytes)(value));
    function hashSignature(sig) {
      return hash(sig);
    }
  }
});

// node_modules/viem/_cjs/utils/hash/normalizeSignature.js
var require_normalizeSignature = __commonJS({
  "node_modules/viem/_cjs/utils/hash/normalizeSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.normalizeSignature = normalizeSignature;
    var base_js_1 = require_base();
    function normalizeSignature(signature) {
      let active = true;
      let current = "";
      let level = 0;
      let result = "";
      let valid = false;
      for (let i = 0; i < signature.length; i++) {
        const char = signature[i];
        if (["(", ")", ","].includes(char))
          active = true;
        if (char === "(")
          level++;
        if (char === ")")
          level--;
        if (!active)
          continue;
        if (level === 0) {
          if (char === " " && ["event", "function", ""].includes(result))
            result = "";
          else {
            result += char;
            if (char === ")") {
              valid = true;
              break;
            }
          }
          continue;
        }
        if (char === " ") {
          if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
            current = "";
            active = false;
          }
          continue;
        }
        result += char;
        current += char;
      }
      if (!valid)
        throw new base_js_1.BaseError("Unable to normalize signature.");
      return result;
    }
  }
});

// node_modules/viem/_cjs/utils/hash/toSignature.js
var require_toSignature = __commonJS({
  "node_modules/viem/_cjs/utils/hash/toSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toSignature = void 0;
    var abitype_1 = require_exports();
    var normalizeSignature_js_1 = require_normalizeSignature();
    var toSignature = (def) => {
      const def_ = (() => {
        if (typeof def === "string")
          return def;
        return (0, abitype_1.formatAbiItem)(def);
      })();
      return (0, normalizeSignature_js_1.normalizeSignature)(def_);
    };
    exports.toSignature = toSignature;
  }
});

// node_modules/viem/_cjs/utils/hash/toSignatureHash.js
var require_toSignatureHash = __commonJS({
  "node_modules/viem/_cjs/utils/hash/toSignatureHash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toSignatureHash = toSignatureHash;
    var hashSignature_js_1 = require_hashSignature();
    var toSignature_js_1 = require_toSignature();
    function toSignatureHash(fn) {
      return (0, hashSignature_js_1.hashSignature)((0, toSignature_js_1.toSignature)(fn));
    }
  }
});

// node_modules/viem/_cjs/utils/hash/toEventSelector.js
var require_toEventSelector = __commonJS({
  "node_modules/viem/_cjs/utils/hash/toEventSelector.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toEventSelector = void 0;
    var toSignatureHash_js_1 = require_toSignatureHash();
    exports.toEventSelector = toSignatureHash_js_1.toSignatureHash;
  }
});

// node_modules/viem/_cjs/errors/address.js
var require_address = __commonJS({
  "node_modules/viem/_cjs/errors/address.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidAddressError = void 0;
    var base_js_1 = require_base();
    var InvalidAddressError = class extends base_js_1.BaseError {
      constructor({ address }) {
        super(`Address "${address}" is invalid.`, {
          metaMessages: [
            "- Address must be a hex value of 20 bytes (40 hex characters).",
            "- Address must match its checksum counterpart."
          ],
          name: "InvalidAddressError"
        });
      }
    };
    exports.InvalidAddressError = InvalidAddressError;
  }
});

// node_modules/viem/_cjs/utils/lru.js
var require_lru = __commonJS({
  "node_modules/viem/_cjs/utils/lru.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LruMap = void 0;
    var LruMap = class extends Map {
      constructor(size) {
        super();
        Object.defineProperty(this, "maxSize", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.maxSize = size;
      }
      get(key) {
        const value = super.get(key);
        if (super.has(key) && value !== void 0) {
          this.delete(key);
          super.set(key, value);
        }
        return value;
      }
      set(key, value) {
        super.set(key, value);
        if (this.maxSize && this.size > this.maxSize) {
          const firstKey = this.keys().next().value;
          if (firstKey)
            this.delete(firstKey);
        }
        return this;
      }
    };
    exports.LruMap = LruMap;
  }
});

// node_modules/viem/_cjs/utils/address/getAddress.js
var require_getAddress = __commonJS({
  "node_modules/viem/_cjs/utils/address/getAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checksumAddress = checksumAddress;
    exports.getAddress = getAddress;
    var address_js_1 = require_address();
    var toBytes_js_1 = require_toBytes();
    var keccak256_js_1 = require_keccak256();
    var lru_js_1 = require_lru();
    var isAddress_js_1 = require_isAddress();
    var checksumAddressCache = new lru_js_1.LruMap(8192);
    function checksumAddress(address_, chainId) {
      if (checksumAddressCache.has(`${address_}.${chainId}`))
        return checksumAddressCache.get(`${address_}.${chainId}`);
      const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
      const hash = (0, keccak256_js_1.keccak256)((0, toBytes_js_1.stringToBytes)(hexAddress), "bytes");
      const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
      for (let i = 0; i < 40; i += 2) {
        if (hash[i >> 1] >> 4 >= 8 && address[i]) {
          address[i] = address[i].toUpperCase();
        }
        if ((hash[i >> 1] & 15) >= 8 && address[i + 1]) {
          address[i + 1] = address[i + 1].toUpperCase();
        }
      }
      const result = `0x${address.join("")}`;
      checksumAddressCache.set(`${address_}.${chainId}`, result);
      return result;
    }
    function getAddress(address, chainId) {
      if (!(0, isAddress_js_1.isAddress)(address, { strict: false }))
        throw new address_js_1.InvalidAddressError({ address });
      return checksumAddress(address, chainId);
    }
  }
});

// node_modules/viem/_cjs/utils/address/isAddress.js
var require_isAddress = __commonJS({
  "node_modules/viem/_cjs/utils/address/isAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isAddressCache = void 0;
    exports.isAddress = isAddress;
    var lru_js_1 = require_lru();
    var getAddress_js_1 = require_getAddress();
    var addressRegex = /^0x[a-fA-F0-9]{40}$/;
    exports.isAddressCache = new lru_js_1.LruMap(8192);
    function isAddress(address, options) {
      const { strict = true } = options ?? {};
      const cacheKey = `${address}.${strict}`;
      if (exports.isAddressCache.has(cacheKey))
        return exports.isAddressCache.get(cacheKey);
      const result = (() => {
        if (!addressRegex.test(address))
          return false;
        if (address.toLowerCase() === address)
          return true;
        if (strict)
          return (0, getAddress_js_1.checksumAddress)(address) === address;
        return true;
      })();
      exports.isAddressCache.set(cacheKey, result);
      return result;
    }
  }
});

// node_modules/viem/_cjs/utils/data/concat.js
var require_concat = __commonJS({
  "node_modules/viem/_cjs/utils/data/concat.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.concat = concat;
    exports.concatBytes = concatBytes;
    exports.concatHex = concatHex;
    function concat(values) {
      if (typeof values[0] === "string")
        return concatHex(values);
      return concatBytes(values);
    }
    function concatBytes(values) {
      let length = 0;
      for (const arr of values) {
        length += arr.length;
      }
      const result = new Uint8Array(length);
      let offset = 0;
      for (const arr of values) {
        result.set(arr, offset);
        offset += arr.length;
      }
      return result;
    }
    function concatHex(values) {
      return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
    }
  }
});

// node_modules/viem/_cjs/utils/data/slice.js
var require_slice = __commonJS({
  "node_modules/viem/_cjs/utils/data/slice.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.slice = slice;
    exports.sliceBytes = sliceBytes;
    exports.sliceHex = sliceHex;
    var data_js_1 = require_data();
    var isHex_js_1 = require_isHex();
    var size_js_1 = require_size();
    function slice(value, start, end, { strict } = {}) {
      if ((0, isHex_js_1.isHex)(value, { strict: false }))
        return sliceHex(value, start, end, {
          strict
        });
      return sliceBytes(value, start, end, {
        strict
      });
    }
    function assertStartOffset(value, start) {
      if (typeof start === "number" && start > 0 && start > (0, size_js_1.size)(value) - 1)
        throw new data_js_1.SliceOffsetOutOfBoundsError({
          offset: start,
          position: "start",
          size: (0, size_js_1.size)(value)
        });
    }
    function assertEndOffset(value, start, end) {
      if (typeof start === "number" && typeof end === "number" && (0, size_js_1.size)(value) !== end - start) {
        throw new data_js_1.SliceOffsetOutOfBoundsError({
          offset: end,
          position: "end",
          size: (0, size_js_1.size)(value)
        });
      }
    }
    function sliceBytes(value_, start, end, { strict } = {}) {
      assertStartOffset(value_, start);
      const value = value_.slice(start, end);
      if (strict)
        assertEndOffset(value, start, end);
      return value;
    }
    function sliceHex(value_, start, end, { strict } = {}) {
      assertStartOffset(value_, start);
      const value = `0x${value_.replace("0x", "").slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
      if (strict)
        assertEndOffset(value, start, end);
      return value;
    }
  }
});

// node_modules/viem/_cjs/utils/regex.js
var require_regex2 = __commonJS({
  "node_modules/viem/_cjs/utils/regex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.integerRegex = exports.bytesRegex = exports.arrayRegex = void 0;
    exports.arrayRegex = /^(.*)\[([0-9]*)\]$/;
    exports.bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
    exports.integerRegex = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
  }
});

// node_modules/viem/_cjs/utils/abi/encodeAbiParameters.js
var require_encodeAbiParameters = __commonJS({
  "node_modules/viem/_cjs/utils/abi/encodeAbiParameters.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeAbiParameters = encodeAbiParameters;
    exports.getArrayComponents = getArrayComponents;
    var abi_js_1 = require_abi();
    var address_js_1 = require_address();
    var base_js_1 = require_base();
    var encoding_js_1 = require_encoding();
    var isAddress_js_1 = require_isAddress();
    var concat_js_1 = require_concat();
    var pad_js_1 = require_pad();
    var size_js_1 = require_size();
    var slice_js_1 = require_slice();
    var toHex_js_1 = require_toHex();
    var regex_js_1 = require_regex2();
    function encodeAbiParameters(params, values) {
      if (params.length !== values.length)
        throw new abi_js_1.AbiEncodingLengthMismatchError({
          expectedLength: params.length,
          givenLength: values.length
        });
      const preparedParams = prepareParams({
        params,
        values
      });
      const data = encodeParams(preparedParams);
      if (data.length === 0)
        return "0x";
      return data;
    }
    function prepareParams({ params, values }) {
      const preparedParams = [];
      for (let i = 0; i < params.length; i++) {
        preparedParams.push(prepareParam({ param: params[i], value: values[i] }));
      }
      return preparedParams;
    }
    function prepareParam({ param, value }) {
      const arrayComponents = getArrayComponents(param.type);
      if (arrayComponents) {
        const [length, type] = arrayComponents;
        return encodeArray(value, { length, param: { ...param, type } });
      }
      if (param.type === "tuple") {
        return encodeTuple(value, {
          param
        });
      }
      if (param.type === "address") {
        return encodeAddress(value);
      }
      if (param.type === "bool") {
        return encodeBool(value);
      }
      if (param.type.startsWith("uint") || param.type.startsWith("int")) {
        const signed = param.type.startsWith("int");
        const [, , size = "256"] = regex_js_1.integerRegex.exec(param.type) ?? [];
        return encodeNumber(value, {
          signed,
          size: Number(size)
        });
      }
      if (param.type.startsWith("bytes")) {
        return encodeBytes(value, { param });
      }
      if (param.type === "string") {
        return encodeString(value);
      }
      throw new abi_js_1.InvalidAbiEncodingTypeError(param.type, {
        docsPath: "/docs/contract/encodeAbiParameters"
      });
    }
    function encodeParams(preparedParams) {
      let staticSize = 0;
      for (let i = 0; i < preparedParams.length; i++) {
        const { dynamic, encoded } = preparedParams[i];
        if (dynamic)
          staticSize += 32;
        else
          staticSize += (0, size_js_1.size)(encoded);
      }
      const staticParams = [];
      const dynamicParams = [];
      let dynamicSize = 0;
      for (let i = 0; i < preparedParams.length; i++) {
        const { dynamic, encoded } = preparedParams[i];
        if (dynamic) {
          staticParams.push((0, toHex_js_1.numberToHex)(staticSize + dynamicSize, { size: 32 }));
          dynamicParams.push(encoded);
          dynamicSize += (0, size_js_1.size)(encoded);
        } else {
          staticParams.push(encoded);
        }
      }
      return (0, concat_js_1.concat)([...staticParams, ...dynamicParams]);
    }
    function encodeAddress(value) {
      if (!(0, isAddress_js_1.isAddress)(value))
        throw new address_js_1.InvalidAddressError({ address: value });
      return { dynamic: false, encoded: (0, pad_js_1.padHex)(value.toLowerCase()) };
    }
    function encodeArray(value, { length, param }) {
      const dynamic = length === null;
      if (!Array.isArray(value))
        throw new abi_js_1.InvalidArrayError(value);
      if (!dynamic && value.length !== length)
        throw new abi_js_1.AbiEncodingArrayLengthMismatchError({
          expectedLength: length,
          givenLength: value.length,
          type: `${param.type}[${length}]`
        });
      let dynamicChild = false;
      const preparedParams = [];
      for (let i = 0; i < value.length; i++) {
        const preparedParam = prepareParam({ param, value: value[i] });
        if (preparedParam.dynamic)
          dynamicChild = true;
        preparedParams.push(preparedParam);
      }
      if (dynamic || dynamicChild) {
        const data = encodeParams(preparedParams);
        if (dynamic) {
          const length2 = (0, toHex_js_1.numberToHex)(preparedParams.length, { size: 32 });
          return {
            dynamic: true,
            encoded: preparedParams.length > 0 ? (0, concat_js_1.concat)([length2, data]) : length2
          };
        }
        if (dynamicChild)
          return { dynamic: true, encoded: data };
      }
      return {
        dynamic: false,
        encoded: (0, concat_js_1.concat)(preparedParams.map(({ encoded }) => encoded))
      };
    }
    function encodeBytes(value, { param }) {
      const [, paramSize] = param.type.split("bytes");
      const bytesSize = (0, size_js_1.size)(value);
      if (!paramSize) {
        let value_ = value;
        if (bytesSize % 32 !== 0)
          value_ = (0, pad_js_1.padHex)(value_, {
            dir: "right",
            size: Math.ceil((value.length - 2) / 2 / 32) * 32
          });
        return {
          dynamic: true,
          encoded: (0, concat_js_1.concat)([(0, pad_js_1.padHex)((0, toHex_js_1.numberToHex)(bytesSize, { size: 32 })), value_])
        };
      }
      if (bytesSize !== Number.parseInt(paramSize))
        throw new abi_js_1.AbiEncodingBytesSizeMismatchError({
          expectedSize: Number.parseInt(paramSize),
          value
        });
      return { dynamic: false, encoded: (0, pad_js_1.padHex)(value, { dir: "right" }) };
    }
    function encodeBool(value) {
      if (typeof value !== "boolean")
        throw new base_js_1.BaseError(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
      return { dynamic: false, encoded: (0, pad_js_1.padHex)((0, toHex_js_1.boolToHex)(value)) };
    }
    function encodeNumber(value, { signed, size = 256 }) {
      if (typeof size === "number") {
        const max = 2n ** (BigInt(size) - (signed ? 1n : 0n)) - 1n;
        const min = signed ? -max - 1n : 0n;
        if (value > max || value < min)
          throw new encoding_js_1.IntegerOutOfRangeError({
            max: max.toString(),
            min: min.toString(),
            signed,
            size: size / 8,
            value: value.toString()
          });
      }
      return {
        dynamic: false,
        encoded: (0, toHex_js_1.numberToHex)(value, {
          size: 32,
          signed
        })
      };
    }
    function encodeString(value) {
      const hexValue = (0, toHex_js_1.stringToHex)(value);
      const partsLength = Math.ceil((0, size_js_1.size)(hexValue) / 32);
      const parts = [];
      for (let i = 0; i < partsLength; i++) {
        parts.push((0, pad_js_1.padHex)((0, slice_js_1.slice)(hexValue, i * 32, (i + 1) * 32), {
          dir: "right"
        }));
      }
      return {
        dynamic: true,
        encoded: (0, concat_js_1.concat)([
          (0, pad_js_1.padHex)((0, toHex_js_1.numberToHex)((0, size_js_1.size)(hexValue), { size: 32 })),
          ...parts
        ])
      };
    }
    function encodeTuple(value, { param }) {
      let dynamic = false;
      const preparedParams = [];
      for (let i = 0; i < param.components.length; i++) {
        const param_ = param.components[i];
        const index = Array.isArray(value) ? i : param_.name;
        const preparedParam = prepareParam({
          param: param_,
          value: value[index]
        });
        preparedParams.push(preparedParam);
        if (preparedParam.dynamic)
          dynamic = true;
      }
      return {
        dynamic,
        encoded: dynamic ? encodeParams(preparedParams) : (0, concat_js_1.concat)(preparedParams.map(({ encoded }) => encoded))
      };
    }
    function getArrayComponents(type) {
      const matches = type.match(/^(.*)\[(\d+)?\]$/);
      return matches ? [matches[2] ? Number(matches[2]) : null, matches[1]] : void 0;
    }
  }
});

// node_modules/viem/_cjs/utils/hash/toFunctionSelector.js
var require_toFunctionSelector = __commonJS({
  "node_modules/viem/_cjs/utils/hash/toFunctionSelector.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toFunctionSelector = void 0;
    var slice_js_1 = require_slice();
    var toSignatureHash_js_1 = require_toSignatureHash();
    var toFunctionSelector = (fn) => (0, slice_js_1.slice)((0, toSignatureHash_js_1.toSignatureHash)(fn), 0, 4);
    exports.toFunctionSelector = toFunctionSelector;
  }
});

// node_modules/viem/_cjs/utils/abi/getAbiItem.js
var require_getAbiItem = __commonJS({
  "node_modules/viem/_cjs/utils/abi/getAbiItem.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAbiItem = getAbiItem;
    exports.isArgOfType = isArgOfType;
    exports.getAmbiguousTypes = getAmbiguousTypes;
    var abi_js_1 = require_abi();
    var isHex_js_1 = require_isHex();
    var isAddress_js_1 = require_isAddress();
    var toEventSelector_js_1 = require_toEventSelector();
    var toFunctionSelector_js_1 = require_toFunctionSelector();
    function getAbiItem(parameters) {
      const { abi, args = [], name } = parameters;
      const isSelector = (0, isHex_js_1.isHex)(name, { strict: false });
      const abiItems = abi.filter((abiItem) => {
        if (isSelector) {
          if (abiItem.type === "function")
            return (0, toFunctionSelector_js_1.toFunctionSelector)(abiItem) === name;
          if (abiItem.type === "event")
            return (0, toEventSelector_js_1.toEventSelector)(abiItem) === name;
          return false;
        }
        return "name" in abiItem && abiItem.name === name;
      });
      if (abiItems.length === 0)
        return void 0;
      if (abiItems.length === 1)
        return abiItems[0];
      let matchedAbiItem = void 0;
      for (const abiItem of abiItems) {
        if (!("inputs" in abiItem))
          continue;
        if (!args || args.length === 0) {
          if (!abiItem.inputs || abiItem.inputs.length === 0)
            return abiItem;
          continue;
        }
        if (!abiItem.inputs)
          continue;
        if (abiItem.inputs.length === 0)
          continue;
        if (abiItem.inputs.length !== args.length)
          continue;
        const matched = args.every((arg, index) => {
          const abiParameter = "inputs" in abiItem && abiItem.inputs[index];
          if (!abiParameter)
            return false;
          return isArgOfType(arg, abiParameter);
        });
        if (matched) {
          if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
            const ambiguousTypes = getAmbiguousTypes(abiItem.inputs, matchedAbiItem.inputs, args);
            if (ambiguousTypes)
              throw new abi_js_1.AbiItemAmbiguityError({
                abiItem,
                type: ambiguousTypes[0]
              }, {
                abiItem: matchedAbiItem,
                type: ambiguousTypes[1]
              });
          }
          matchedAbiItem = abiItem;
        }
      }
      if (matchedAbiItem)
        return matchedAbiItem;
      return abiItems[0];
    }
    function isArgOfType(arg, abiParameter) {
      const argType = typeof arg;
      const abiParameterType = abiParameter.type;
      switch (abiParameterType) {
        case "address":
          return (0, isAddress_js_1.isAddress)(arg, { strict: false });
        case "bool":
          return argType === "boolean";
        case "function":
          return argType === "string";
        case "string":
          return argType === "string";
        default: {
          if (abiParameterType === "tuple" && "components" in abiParameter)
            return Object.values(abiParameter.components).every((component, index) => {
              return isArgOfType(Object.values(arg)[index], component);
            });
          if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
            return argType === "number" || argType === "bigint";
          if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
            return argType === "string" || arg instanceof Uint8Array;
          if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
            return Array.isArray(arg) && arg.every((x) => isArgOfType(x, {
              ...abiParameter,
              type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
            }));
          }
          return false;
        }
      }
    }
    function getAmbiguousTypes(sourceParameters, targetParameters, args) {
      for (const parameterIndex in sourceParameters) {
        const sourceParameter = sourceParameters[parameterIndex];
        const targetParameter = targetParameters[parameterIndex];
        if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter)
          return getAmbiguousTypes(sourceParameter.components, targetParameter.components, args[parameterIndex]);
        const types = [sourceParameter.type, targetParameter.type];
        const ambiguous = (() => {
          if (types.includes("address") && types.includes("bytes20"))
            return true;
          if (types.includes("address") && types.includes("string"))
            return (0, isAddress_js_1.isAddress)(args[parameterIndex], { strict: false });
          if (types.includes("address") && types.includes("bytes"))
            return (0, isAddress_js_1.isAddress)(args[parameterIndex], { strict: false });
          return false;
        })();
        if (ambiguous)
          return types;
      }
      return;
    }
  }
});

// node_modules/viem/_cjs/utils/abi/encodeEventTopics.js
var require_encodeEventTopics = __commonJS({
  "node_modules/viem/_cjs/utils/abi/encodeEventTopics.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeEventTopics = encodeEventTopics;
    var abi_js_1 = require_abi();
    var log_js_1 = require_log();
    var toBytes_js_1 = require_toBytes();
    var keccak256_js_1 = require_keccak256();
    var toEventSelector_js_1 = require_toEventSelector();
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    var formatAbiItem_js_1 = require_formatAbiItem2();
    var getAbiItem_js_1 = require_getAbiItem();
    var docsPath = "/docs/contract/encodeEventTopics";
    function encodeEventTopics(parameters) {
      var _a;
      const { abi, eventName, args } = parameters;
      let abiItem = abi[0];
      if (eventName) {
        const item = (0, getAbiItem_js_1.getAbiItem)({ abi, name: eventName });
        if (!item)
          throw new abi_js_1.AbiEventNotFoundError(eventName, { docsPath });
        abiItem = item;
      }
      if (abiItem.type !== "event")
        throw new abi_js_1.AbiEventNotFoundError(void 0, { docsPath });
      const definition = (0, formatAbiItem_js_1.formatAbiItem)(abiItem);
      const signature = (0, toEventSelector_js_1.toEventSelector)(definition);
      let topics = [];
      if (args && "inputs" in abiItem) {
        const indexedInputs = (_a = abiItem.inputs) == null ? void 0 : _a.filter((param) => "indexed" in param && param.indexed);
        const args_ = Array.isArray(args) ? args : Object.values(args).length > 0 ? (indexedInputs == null ? void 0 : indexedInputs.map((x) => args[x.name])) ?? [] : [];
        if (args_.length > 0) {
          topics = (indexedInputs == null ? void 0 : indexedInputs.map((param, i) => {
            if (Array.isArray(args_[i]))
              return args_[i].map((_, j) => encodeArg({ param, value: args_[i][j] }));
            return args_[i] ? encodeArg({ param, value: args_[i] }) : null;
          })) ?? [];
        }
      }
      return [signature, ...topics];
    }
    function encodeArg({ param, value }) {
      if (param.type === "string" || param.type === "bytes")
        return (0, keccak256_js_1.keccak256)((0, toBytes_js_1.toBytes)(value));
      if (param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
        throw new log_js_1.FilterTypeNotSupportedError(param.type);
      return (0, encodeAbiParameters_js_1.encodeAbiParameters)([param], [value]);
    }
  }
});

// node_modules/viem/_cjs/utils/filters/createFilterRequestScope.js
var require_createFilterRequestScope = __commonJS({
  "node_modules/viem/_cjs/utils/filters/createFilterRequestScope.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createFilterRequestScope = createFilterRequestScope;
    function createFilterRequestScope(client, { method }) {
      var _a, _b;
      const requestMap = {};
      if (client.transport.type === "fallback")
        (_b = (_a = client.transport).onResponse) == null ? void 0 : _b.call(_a, ({ method: method_, response: id, status, transport }) => {
          if (status === "success" && method === method_)
            requestMap[id] = transport.request;
        });
      return (id) => requestMap[id] || client.request;
    }
  }
});

// node_modules/viem/_cjs/actions/public/createContractEventFilter.js
var require_createContractEventFilter = __commonJS({
  "node_modules/viem/_cjs/actions/public/createContractEventFilter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createContractEventFilter = createContractEventFilter;
    var encodeEventTopics_js_1 = require_encodeEventTopics();
    var toHex_js_1 = require_toHex();
    var createFilterRequestScope_js_1 = require_createFilterRequestScope();
    async function createContractEventFilter(client, parameters) {
      const { address, abi, args, eventName, fromBlock, strict, toBlock } = parameters;
      const getRequest = (0, createFilterRequestScope_js_1.createFilterRequestScope)(client, {
        method: "eth_newFilter"
      });
      const topics = eventName ? (0, encodeEventTopics_js_1.encodeEventTopics)({
        abi,
        args,
        eventName
      }) : void 0;
      const id = await client.request({
        method: "eth_newFilter",
        params: [
          {
            address,
            fromBlock: typeof fromBlock === "bigint" ? (0, toHex_js_1.numberToHex)(fromBlock) : fromBlock,
            toBlock: typeof toBlock === "bigint" ? (0, toHex_js_1.numberToHex)(toBlock) : toBlock,
            topics
          }
        ]
      });
      return {
        abi,
        args,
        eventName,
        id,
        request: getRequest(id),
        strict: Boolean(strict),
        type: "event"
      };
    }
  }
});

// node_modules/viem/_cjs/accounts/utils/parseAccount.js
var require_parseAccount = __commonJS({
  "node_modules/viem/_cjs/accounts/utils/parseAccount.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseAccount = parseAccount;
    function parseAccount(account) {
      if (typeof account === "string")
        return { address: account, type: "json-rpc" };
      return account;
    }
  }
});

// node_modules/viem/_cjs/utils/abi/prepareEncodeFunctionData.js
var require_prepareEncodeFunctionData = __commonJS({
  "node_modules/viem/_cjs/utils/abi/prepareEncodeFunctionData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prepareEncodeFunctionData = prepareEncodeFunctionData;
    var abi_js_1 = require_abi();
    var toFunctionSelector_js_1 = require_toFunctionSelector();
    var formatAbiItem_js_1 = require_formatAbiItem2();
    var getAbiItem_js_1 = require_getAbiItem();
    var docsPath = "/docs/contract/encodeFunctionData";
    function prepareEncodeFunctionData(parameters) {
      const { abi, args, functionName } = parameters;
      let abiItem = abi[0];
      if (functionName) {
        const item = (0, getAbiItem_js_1.getAbiItem)({
          abi,
          args,
          name: functionName
        });
        if (!item)
          throw new abi_js_1.AbiFunctionNotFoundError(functionName, { docsPath });
        abiItem = item;
      }
      if (abiItem.type !== "function")
        throw new abi_js_1.AbiFunctionNotFoundError(void 0, { docsPath });
      return {
        abi: [abiItem],
        functionName: (0, toFunctionSelector_js_1.toFunctionSelector)((0, formatAbiItem_js_1.formatAbiItem)(abiItem))
      };
    }
  }
});

// node_modules/viem/_cjs/utils/abi/encodeFunctionData.js
var require_encodeFunctionData = __commonJS({
  "node_modules/viem/_cjs/utils/abi/encodeFunctionData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeFunctionData = encodeFunctionData;
    var concat_js_1 = require_concat();
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    var prepareEncodeFunctionData_js_1 = require_prepareEncodeFunctionData();
    function encodeFunctionData(parameters) {
      const { args } = parameters;
      const { abi, functionName } = (() => {
        var _a;
        if (parameters.abi.length === 1 && ((_a = parameters.functionName) == null ? void 0 : _a.startsWith("0x")))
          return parameters;
        return (0, prepareEncodeFunctionData_js_1.prepareEncodeFunctionData)(parameters);
      })();
      const abiItem = abi[0];
      const signature = functionName;
      const data = "inputs" in abiItem && abiItem.inputs ? (0, encodeAbiParameters_js_1.encodeAbiParameters)(abiItem.inputs, args ?? []) : void 0;
      return (0, concat_js_1.concatHex)([signature, data ?? "0x"]);
    }
  }
});

// node_modules/viem/_cjs/constants/solidity.js
var require_solidity = __commonJS({
  "node_modules/viem/_cjs/constants/solidity.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.solidityPanic = exports.solidityError = exports.panicReasons = void 0;
    exports.panicReasons = {
      1: "An `assert` condition failed.",
      17: "Arithmetic operation resulted in underflow or overflow.",
      18: "Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).",
      33: "Attempted to convert to an invalid type.",
      34: "Attempted to access a storage byte array that is incorrectly encoded.",
      49: "Performed `.pop()` on an empty array",
      50: "Array index is out of bounds.",
      65: "Allocated too much memory or created an array which is too large.",
      81: "Attempted to call a zero-initialized variable of internal function type."
    };
    exports.solidityError = {
      inputs: [
        {
          name: "message",
          type: "string"
        }
      ],
      name: "Error",
      type: "error"
    };
    exports.solidityPanic = {
      inputs: [
        {
          name: "reason",
          type: "uint256"
        }
      ],
      name: "Panic",
      type: "error"
    };
  }
});

// node_modules/viem/_cjs/errors/cursor.js
var require_cursor = __commonJS({
  "node_modules/viem/_cjs/errors/cursor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RecursiveReadLimitExceededError = exports.PositionOutOfBoundsError = exports.NegativeOffsetError = void 0;
    var base_js_1 = require_base();
    var NegativeOffsetError = class extends base_js_1.BaseError {
      constructor({ offset }) {
        super(`Offset \`${offset}\` cannot be negative.`, {
          name: "NegativeOffsetError"
        });
      }
    };
    exports.NegativeOffsetError = NegativeOffsetError;
    var PositionOutOfBoundsError = class extends base_js_1.BaseError {
      constructor({ length, position }) {
        super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, { name: "PositionOutOfBoundsError" });
      }
    };
    exports.PositionOutOfBoundsError = PositionOutOfBoundsError;
    var RecursiveReadLimitExceededError = class extends base_js_1.BaseError {
      constructor({ count, limit }) {
        super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, { name: "RecursiveReadLimitExceededError" });
      }
    };
    exports.RecursiveReadLimitExceededError = RecursiveReadLimitExceededError;
  }
});

// node_modules/viem/_cjs/utils/cursor.js
var require_cursor2 = __commonJS({
  "node_modules/viem/_cjs/utils/cursor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createCursor = createCursor;
    var cursor_js_1 = require_cursor();
    var staticCursor = {
      bytes: new Uint8Array(),
      dataView: new DataView(new ArrayBuffer(0)),
      position: 0,
      positionReadCount: /* @__PURE__ */ new Map(),
      recursiveReadCount: 0,
      recursiveReadLimit: Number.POSITIVE_INFINITY,
      assertReadLimit() {
        if (this.recursiveReadCount >= this.recursiveReadLimit)
          throw new cursor_js_1.RecursiveReadLimitExceededError({
            count: this.recursiveReadCount + 1,
            limit: this.recursiveReadLimit
          });
      },
      assertPosition(position) {
        if (position < 0 || position > this.bytes.length - 1)
          throw new cursor_js_1.PositionOutOfBoundsError({
            length: this.bytes.length,
            position
          });
      },
      decrementPosition(offset) {
        if (offset < 0)
          throw new cursor_js_1.NegativeOffsetError({ offset });
        const position = this.position - offset;
        this.assertPosition(position);
        this.position = position;
      },
      getReadCount(position) {
        return this.positionReadCount.get(position || this.position) || 0;
      },
      incrementPosition(offset) {
        if (offset < 0)
          throw new cursor_js_1.NegativeOffsetError({ offset });
        const position = this.position + offset;
        this.assertPosition(position);
        this.position = position;
      },
      inspectByte(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
      },
      inspectBytes(length, position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + length - 1);
        return this.bytes.subarray(position, position + length);
      },
      inspectUint8(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
      },
      inspectUint16(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 1);
        return this.dataView.getUint16(position);
      },
      inspectUint24(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 2);
        return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
      },
      inspectUint32(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 3);
        return this.dataView.getUint32(position);
      },
      pushByte(byte) {
        this.assertPosition(this.position);
        this.bytes[this.position] = byte;
        this.position++;
      },
      pushBytes(bytes) {
        this.assertPosition(this.position + bytes.length - 1);
        this.bytes.set(bytes, this.position);
        this.position += bytes.length;
      },
      pushUint8(value) {
        this.assertPosition(this.position);
        this.bytes[this.position] = value;
        this.position++;
      },
      pushUint16(value) {
        this.assertPosition(this.position + 1);
        this.dataView.setUint16(this.position, value);
        this.position += 2;
      },
      pushUint24(value) {
        this.assertPosition(this.position + 2);
        this.dataView.setUint16(this.position, value >> 8);
        this.dataView.setUint8(this.position + 2, value & ~4294967040);
        this.position += 3;
      },
      pushUint32(value) {
        this.assertPosition(this.position + 3);
        this.dataView.setUint32(this.position, value);
        this.position += 4;
      },
      readByte() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectByte();
        this.position++;
        return value;
      },
      readBytes(length, size) {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectBytes(length);
        this.position += size ?? length;
        return value;
      },
      readUint8() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint8();
        this.position += 1;
        return value;
      },
      readUint16() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint16();
        this.position += 2;
        return value;
      },
      readUint24() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint24();
        this.position += 3;
        return value;
      },
      readUint32() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint32();
        this.position += 4;
        return value;
      },
      get remaining() {
        return this.bytes.length - this.position;
      },
      setPosition(position) {
        const oldPosition = this.position;
        this.assertPosition(position);
        this.position = position;
        return () => this.position = oldPosition;
      },
      _touch() {
        if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
          return;
        const count = this.getReadCount();
        this.positionReadCount.set(this.position, count + 1);
        if (count > 0)
          this.recursiveReadCount++;
      }
    };
    function createCursor(bytes, { recursiveReadLimit = 8192 } = {}) {
      const cursor = Object.create(staticCursor);
      cursor.bytes = bytes;
      cursor.dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      cursor.positionReadCount = /* @__PURE__ */ new Map();
      cursor.recursiveReadLimit = recursiveReadLimit;
      return cursor;
    }
  }
});

// node_modules/viem/_cjs/utils/encoding/fromBytes.js
var require_fromBytes = __commonJS({
  "node_modules/viem/_cjs/utils/encoding/fromBytes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromBytes = fromBytes;
    exports.bytesToBigInt = bytesToBigInt;
    exports.bytesToBool = bytesToBool;
    exports.bytesToNumber = bytesToNumber;
    exports.bytesToString = bytesToString;
    var encoding_js_1 = require_encoding();
    var trim_js_1 = require_trim();
    var fromHex_js_1 = require_fromHex();
    var toHex_js_1 = require_toHex();
    function fromBytes(bytes, toOrOpts) {
      const opts = typeof toOrOpts === "string" ? { to: toOrOpts } : toOrOpts;
      const to = opts.to;
      if (to === "number")
        return bytesToNumber(bytes, opts);
      if (to === "bigint")
        return bytesToBigInt(bytes, opts);
      if (to === "boolean")
        return bytesToBool(bytes, opts);
      if (to === "string")
        return bytesToString(bytes, opts);
      return (0, toHex_js_1.bytesToHex)(bytes, opts);
    }
    function bytesToBigInt(bytes, opts = {}) {
      if (typeof opts.size !== "undefined")
        (0, fromHex_js_1.assertSize)(bytes, { size: opts.size });
      const hex = (0, toHex_js_1.bytesToHex)(bytes, opts);
      return (0, fromHex_js_1.hexToBigInt)(hex, opts);
    }
    function bytesToBool(bytes_, opts = {}) {
      let bytes = bytes_;
      if (typeof opts.size !== "undefined") {
        (0, fromHex_js_1.assertSize)(bytes, { size: opts.size });
        bytes = (0, trim_js_1.trim)(bytes);
      }
      if (bytes.length > 1 || bytes[0] > 1)
        throw new encoding_js_1.InvalidBytesBooleanError(bytes);
      return Boolean(bytes[0]);
    }
    function bytesToNumber(bytes, opts = {}) {
      if (typeof opts.size !== "undefined")
        (0, fromHex_js_1.assertSize)(bytes, { size: opts.size });
      const hex = (0, toHex_js_1.bytesToHex)(bytes, opts);
      return (0, fromHex_js_1.hexToNumber)(hex, opts);
    }
    function bytesToString(bytes_, opts = {}) {
      let bytes = bytes_;
      if (typeof opts.size !== "undefined") {
        (0, fromHex_js_1.assertSize)(bytes, { size: opts.size });
        bytes = (0, trim_js_1.trim)(bytes, { dir: "right" });
      }
      return new TextDecoder().decode(bytes);
    }
  }
});

// node_modules/viem/_cjs/utils/abi/decodeAbiParameters.js
var require_decodeAbiParameters = __commonJS({
  "node_modules/viem/_cjs/utils/abi/decodeAbiParameters.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeAbiParameters = decodeAbiParameters;
    var abi_js_1 = require_abi();
    var getAddress_js_1 = require_getAddress();
    var cursor_js_1 = require_cursor2();
    var size_js_1 = require_size();
    var slice_js_1 = require_slice();
    var trim_js_1 = require_trim();
    var fromBytes_js_1 = require_fromBytes();
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    function decodeAbiParameters(params, data) {
      const bytes = typeof data === "string" ? (0, toBytes_js_1.hexToBytes)(data) : data;
      const cursor = (0, cursor_js_1.createCursor)(bytes);
      if ((0, size_js_1.size)(bytes) === 0 && params.length > 0)
        throw new abi_js_1.AbiDecodingZeroDataError();
      if ((0, size_js_1.size)(data) && (0, size_js_1.size)(data) < 32)
        throw new abi_js_1.AbiDecodingDataSizeTooSmallError({
          data: typeof data === "string" ? data : (0, toHex_js_1.bytesToHex)(data),
          params,
          size: (0, size_js_1.size)(data)
        });
      let consumed = 0;
      const values = [];
      for (let i = 0; i < params.length; ++i) {
        const param = params[i];
        cursor.setPosition(consumed);
        const [data2, consumed_] = decodeParameter(cursor, param, {
          staticPosition: 0
        });
        consumed += consumed_;
        values.push(data2);
      }
      return values;
    }
    function decodeParameter(cursor, param, { staticPosition }) {
      const arrayComponents = (0, encodeAbiParameters_js_1.getArrayComponents)(param.type);
      if (arrayComponents) {
        const [length, type] = arrayComponents;
        return decodeArray(cursor, { ...param, type }, { length, staticPosition });
      }
      if (param.type === "tuple")
        return decodeTuple(cursor, param, { staticPosition });
      if (param.type === "address")
        return decodeAddress(cursor);
      if (param.type === "bool")
        return decodeBool(cursor);
      if (param.type.startsWith("bytes"))
        return decodeBytes(cursor, param, { staticPosition });
      if (param.type.startsWith("uint") || param.type.startsWith("int"))
        return decodeNumber(cursor, param);
      if (param.type === "string")
        return decodeString(cursor, { staticPosition });
      throw new abi_js_1.InvalidAbiDecodingTypeError(param.type, {
        docsPath: "/docs/contract/decodeAbiParameters"
      });
    }
    var sizeOfLength = 32;
    var sizeOfOffset = 32;
    function decodeAddress(cursor) {
      const value = cursor.readBytes(32);
      return [(0, getAddress_js_1.checksumAddress)((0, toHex_js_1.bytesToHex)((0, slice_js_1.sliceBytes)(value, -20))), 32];
    }
    function decodeArray(cursor, param, { length, staticPosition }) {
      if (!length) {
        const offset = (0, fromBytes_js_1.bytesToNumber)(cursor.readBytes(sizeOfOffset));
        const start = staticPosition + offset;
        const startOfData = start + sizeOfLength;
        cursor.setPosition(start);
        const length2 = (0, fromBytes_js_1.bytesToNumber)(cursor.readBytes(sizeOfLength));
        const dynamicChild = hasDynamicChild(param);
        let consumed2 = 0;
        const value2 = [];
        for (let i = 0; i < length2; ++i) {
          cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed2));
          const [data, consumed_] = decodeParameter(cursor, param, {
            staticPosition: startOfData
          });
          consumed2 += consumed_;
          value2.push(data);
        }
        cursor.setPosition(staticPosition + 32);
        return [value2, 32];
      }
      if (hasDynamicChild(param)) {
        const offset = (0, fromBytes_js_1.bytesToNumber)(cursor.readBytes(sizeOfOffset));
        const start = staticPosition + offset;
        const value2 = [];
        for (let i = 0; i < length; ++i) {
          cursor.setPosition(start + i * 32);
          const [data] = decodeParameter(cursor, param, {
            staticPosition: start
          });
          value2.push(data);
        }
        cursor.setPosition(staticPosition + 32);
        return [value2, 32];
      }
      let consumed = 0;
      const value = [];
      for (let i = 0; i < length; ++i) {
        const [data, consumed_] = decodeParameter(cursor, param, {
          staticPosition: staticPosition + consumed
        });
        consumed += consumed_;
        value.push(data);
      }
      return [value, consumed];
    }
    function decodeBool(cursor) {
      return [(0, fromBytes_js_1.bytesToBool)(cursor.readBytes(32), { size: 32 }), 32];
    }
    function decodeBytes(cursor, param, { staticPosition }) {
      const [_, size] = param.type.split("bytes");
      if (!size) {
        const offset = (0, fromBytes_js_1.bytesToNumber)(cursor.readBytes(32));
        cursor.setPosition(staticPosition + offset);
        const length = (0, fromBytes_js_1.bytesToNumber)(cursor.readBytes(32));
        if (length === 0) {
          cursor.setPosition(staticPosition + 32);
          return ["0x", 32];
        }
        const data = cursor.readBytes(length);
        cursor.setPosition(staticPosition + 32);
        return [(0, toHex_js_1.bytesToHex)(data), 32];
      }
      const value = (0, toHex_js_1.bytesToHex)(cursor.readBytes(Number.parseInt(size), 32));
      return [value, 32];
    }
    function decodeNumber(cursor, param) {
      const signed = param.type.startsWith("int");
      const size = Number.parseInt(param.type.split("int")[1] || "256");
      const value = cursor.readBytes(32);
      return [
        size > 48 ? (0, fromBytes_js_1.bytesToBigInt)(value, { signed }) : (0, fromBytes_js_1.bytesToNumber)(value, { signed }),
        32
      ];
    }
    function decodeTuple(cursor, param, { staticPosition }) {
      const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
      const value = hasUnnamedChild ? [] : {};
      let consumed = 0;
      if (hasDynamicChild(param)) {
        const offset = (0, fromBytes_js_1.bytesToNumber)(cursor.readBytes(sizeOfOffset));
        const start = staticPosition + offset;
        for (let i = 0; i < param.components.length; ++i) {
          const component = param.components[i];
          cursor.setPosition(start + consumed);
          const [data, consumed_] = decodeParameter(cursor, component, {
            staticPosition: start
          });
          consumed += consumed_;
          value[hasUnnamedChild ? i : component == null ? void 0 : component.name] = data;
        }
        cursor.setPosition(staticPosition + 32);
        return [value, 32];
      }
      for (let i = 0; i < param.components.length; ++i) {
        const component = param.components[i];
        const [data, consumed_] = decodeParameter(cursor, component, {
          staticPosition
        });
        value[hasUnnamedChild ? i : component == null ? void 0 : component.name] = data;
        consumed += consumed_;
      }
      return [value, consumed];
    }
    function decodeString(cursor, { staticPosition }) {
      const offset = (0, fromBytes_js_1.bytesToNumber)(cursor.readBytes(32));
      const start = staticPosition + offset;
      cursor.setPosition(start);
      const length = (0, fromBytes_js_1.bytesToNumber)(cursor.readBytes(32));
      if (length === 0) {
        cursor.setPosition(staticPosition + 32);
        return ["", 32];
      }
      const data = cursor.readBytes(length, 32);
      const value = (0, fromBytes_js_1.bytesToString)((0, trim_js_1.trim)(data));
      cursor.setPosition(staticPosition + 32);
      return [value, 32];
    }
    function hasDynamicChild(param) {
      var _a;
      const { type } = param;
      if (type === "string")
        return true;
      if (type === "bytes")
        return true;
      if (type.endsWith("[]"))
        return true;
      if (type === "tuple")
        return (_a = param.components) == null ? void 0 : _a.some(hasDynamicChild);
      const arrayComponents = (0, encodeAbiParameters_js_1.getArrayComponents)(param.type);
      if (arrayComponents && hasDynamicChild({ ...param, type: arrayComponents[1] }))
        return true;
      return false;
    }
  }
});

// node_modules/viem/_cjs/utils/abi/decodeErrorResult.js
var require_decodeErrorResult = __commonJS({
  "node_modules/viem/_cjs/utils/abi/decodeErrorResult.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeErrorResult = decodeErrorResult;
    var solidity_js_1 = require_solidity();
    var abi_js_1 = require_abi();
    var slice_js_1 = require_slice();
    var toFunctionSelector_js_1 = require_toFunctionSelector();
    var decodeAbiParameters_js_1 = require_decodeAbiParameters();
    var formatAbiItem_js_1 = require_formatAbiItem2();
    function decodeErrorResult(parameters) {
      const { abi, data } = parameters;
      const signature = (0, slice_js_1.slice)(data, 0, 4);
      if (signature === "0x")
        throw new abi_js_1.AbiDecodingZeroDataError();
      const abi_ = [...abi || [], solidity_js_1.solidityError, solidity_js_1.solidityPanic];
      const abiItem = abi_.find((x) => x.type === "error" && signature === (0, toFunctionSelector_js_1.toFunctionSelector)((0, formatAbiItem_js_1.formatAbiItem)(x)));
      if (!abiItem)
        throw new abi_js_1.AbiErrorSignatureNotFoundError(signature, {
          docsPath: "/docs/contract/decodeErrorResult"
        });
      return {
        abiItem,
        args: "inputs" in abiItem && abiItem.inputs && abiItem.inputs.length > 0 ? (0, decodeAbiParameters_js_1.decodeAbiParameters)(abiItem.inputs, (0, slice_js_1.slice)(data, 4)) : void 0,
        errorName: abiItem.name
      };
    }
  }
});

// node_modules/viem/_cjs/utils/stringify.js
var require_stringify = __commonJS({
  "node_modules/viem/_cjs/utils/stringify.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stringify = void 0;
    var stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
      const value2 = typeof value_ === "bigint" ? value_.toString() : value_;
      return typeof replacer === "function" ? replacer(key, value2) : value2;
    }, space);
    exports.stringify = stringify;
  }
});

// node_modules/viem/_cjs/utils/abi/formatAbiItemWithArgs.js
var require_formatAbiItemWithArgs = __commonJS({
  "node_modules/viem/_cjs/utils/abi/formatAbiItemWithArgs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatAbiItemWithArgs = formatAbiItemWithArgs;
    var stringify_js_1 = require_stringify();
    function formatAbiItemWithArgs({ abiItem, args, includeFunctionName = true, includeName = false }) {
      if (!("name" in abiItem))
        return;
      if (!("inputs" in abiItem))
        return;
      if (!abiItem.inputs)
        return;
      return `${includeFunctionName ? abiItem.name : ""}(${abiItem.inputs.map((input, i) => `${includeName && input.name ? `${input.name}: ` : ""}${typeof args[i] === "object" ? (0, stringify_js_1.stringify)(args[i]) : args[i]}`).join(", ")})`;
    }
  }
});

// node_modules/viem/_cjs/constants/unit.js
var require_unit = __commonJS({
  "node_modules/viem/_cjs/constants/unit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.weiUnits = exports.gweiUnits = exports.etherUnits = void 0;
    exports.etherUnits = {
      gwei: 9,
      wei: 18
    };
    exports.gweiUnits = {
      ether: -9,
      wei: 9
    };
    exports.weiUnits = {
      ether: -18,
      gwei: -9
    };
  }
});

// node_modules/viem/_cjs/utils/unit/formatUnits.js
var require_formatUnits = __commonJS({
  "node_modules/viem/_cjs/utils/unit/formatUnits.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatUnits = formatUnits;
    function formatUnits(value, decimals) {
      let display = value.toString();
      const negative = display.startsWith("-");
      if (negative)
        display = display.slice(1);
      display = display.padStart(decimals, "0");
      let [integer, fraction] = [
        display.slice(0, display.length - decimals),
        display.slice(display.length - decimals)
      ];
      fraction = fraction.replace(/(0+)$/, "");
      return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
    }
  }
});

// node_modules/viem/_cjs/utils/unit/formatEther.js
var require_formatEther = __commonJS({
  "node_modules/viem/_cjs/utils/unit/formatEther.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatEther = formatEther;
    var unit_js_1 = require_unit();
    var formatUnits_js_1 = require_formatUnits();
    function formatEther(wei, unit = "wei") {
      return (0, formatUnits_js_1.formatUnits)(wei, unit_js_1.etherUnits[unit]);
    }
  }
});

// node_modules/viem/_cjs/utils/unit/formatGwei.js
var require_formatGwei = __commonJS({
  "node_modules/viem/_cjs/utils/unit/formatGwei.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatGwei = formatGwei;
    var unit_js_1 = require_unit();
    var formatUnits_js_1 = require_formatUnits();
    function formatGwei(wei, unit = "wei") {
      return (0, formatUnits_js_1.formatUnits)(wei, unit_js_1.gweiUnits[unit]);
    }
  }
});

// node_modules/viem/_cjs/errors/stateOverride.js
var require_stateOverride = __commonJS({
  "node_modules/viem/_cjs/errors/stateOverride.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StateAssignmentConflictError = exports.AccountStateConflictError = void 0;
    exports.prettyStateMapping = prettyStateMapping;
    exports.prettyStateOverride = prettyStateOverride;
    var base_js_1 = require_base();
    var AccountStateConflictError = class extends base_js_1.BaseError {
      constructor({ address }) {
        super(`State for account "${address}" is set multiple times.`, {
          name: "AccountStateConflictError"
        });
      }
    };
    exports.AccountStateConflictError = AccountStateConflictError;
    var StateAssignmentConflictError = class extends base_js_1.BaseError {
      constructor() {
        super("state and stateDiff are set on the same account.", {
          name: "StateAssignmentConflictError"
        });
      }
    };
    exports.StateAssignmentConflictError = StateAssignmentConflictError;
    function prettyStateMapping(stateMapping) {
      return stateMapping.reduce((pretty, { slot, value }) => {
        return `${pretty}        ${slot}: ${value}
`;
      }, "");
    }
    function prettyStateOverride(stateOverride) {
      return stateOverride.reduce((pretty, { address, ...state }) => {
        let val = `${pretty}    ${address}:
`;
        if (state.nonce)
          val += `      nonce: ${state.nonce}
`;
        if (state.balance)
          val += `      balance: ${state.balance}
`;
        if (state.code)
          val += `      code: ${state.code}
`;
        if (state.state) {
          val += "      state:\n";
          val += prettyStateMapping(state.state);
        }
        if (state.stateDiff) {
          val += "      stateDiff:\n";
          val += prettyStateMapping(state.stateDiff);
        }
        return val;
      }, "  State Override:\n").slice(0, -1);
    }
  }
});

// node_modules/viem/_cjs/errors/transaction.js
var require_transaction = __commonJS({
  "node_modules/viem/_cjs/errors/transaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WaitForTransactionReceiptTimeoutError = exports.TransactionReceiptNotFoundError = exports.TransactionNotFoundError = exports.TransactionExecutionError = exports.InvalidStorageKeySizeError = exports.InvalidSerializedTransactionError = exports.InvalidSerializedTransactionTypeError = exports.InvalidSerializableTransactionError = exports.InvalidLegacyVError = exports.FeeConflictError = void 0;
    exports.prettyPrint = prettyPrint;
    var formatEther_js_1 = require_formatEther();
    var formatGwei_js_1 = require_formatGwei();
    var base_js_1 = require_base();
    function prettyPrint(args) {
      const entries = Object.entries(args).map(([key, value]) => {
        if (value === void 0 || value === false)
          return null;
        return [key, value];
      }).filter(Boolean);
      const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
      return entries.map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`).join("\n");
    }
    var FeeConflictError = class extends base_js_1.BaseError {
      constructor() {
        super([
          "Cannot specify both a `gasPrice` and a `maxFeePerGas`/`maxPriorityFeePerGas`.",
          "Use `maxFeePerGas`/`maxPriorityFeePerGas` for EIP-1559 compatible networks, and `gasPrice` for others."
        ].join("\n"), { name: "FeeConflictError" });
      }
    };
    exports.FeeConflictError = FeeConflictError;
    var InvalidLegacyVError = class extends base_js_1.BaseError {
      constructor({ v }) {
        super(`Invalid \`v\` value "${v}". Expected 27 or 28.`, {
          name: "InvalidLegacyVError"
        });
      }
    };
    exports.InvalidLegacyVError = InvalidLegacyVError;
    var InvalidSerializableTransactionError = class extends base_js_1.BaseError {
      constructor({ transaction }) {
        super("Cannot infer a transaction type from provided transaction.", {
          metaMessages: [
            "Provided Transaction:",
            "{",
            prettyPrint(transaction),
            "}",
            "",
            "To infer the type, either provide:",
            "- a `type` to the Transaction, or",
            "- an EIP-1559 Transaction with `maxFeePerGas`, or",
            "- an EIP-2930 Transaction with `gasPrice` & `accessList`, or",
            "- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or",
            "- an EIP-7702 Transaction with `authorizationList`, or",
            "- a Legacy Transaction with `gasPrice`"
          ],
          name: "InvalidSerializableTransactionError"
        });
      }
    };
    exports.InvalidSerializableTransactionError = InvalidSerializableTransactionError;
    var InvalidSerializedTransactionTypeError = class extends base_js_1.BaseError {
      constructor({ serializedType }) {
        super(`Serialized transaction type "${serializedType}" is invalid.`, {
          name: "InvalidSerializedTransactionType"
        });
        Object.defineProperty(this, "serializedType", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.serializedType = serializedType;
      }
    };
    exports.InvalidSerializedTransactionTypeError = InvalidSerializedTransactionTypeError;
    var InvalidSerializedTransactionError = class extends base_js_1.BaseError {
      constructor({ attributes, serializedTransaction, type }) {
        const missing = Object.entries(attributes).map(([key, value]) => typeof value === "undefined" ? key : void 0).filter(Boolean);
        super(`Invalid serialized transaction of type "${type}" was provided.`, {
          metaMessages: [
            `Serialized Transaction: "${serializedTransaction}"`,
            missing.length > 0 ? `Missing Attributes: ${missing.join(", ")}` : ""
          ].filter(Boolean),
          name: "InvalidSerializedTransactionError"
        });
        Object.defineProperty(this, "serializedTransaction", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "type", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.serializedTransaction = serializedTransaction;
        this.type = type;
      }
    };
    exports.InvalidSerializedTransactionError = InvalidSerializedTransactionError;
    var InvalidStorageKeySizeError = class extends base_js_1.BaseError {
      constructor({ storageKey }) {
        super(`Size for storage key "${storageKey}" is invalid. Expected 32 bytes. Got ${Math.floor((storageKey.length - 2) / 2)} bytes.`, { name: "InvalidStorageKeySizeError" });
      }
    };
    exports.InvalidStorageKeySizeError = InvalidStorageKeySizeError;
    var TransactionExecutionError = class extends base_js_1.BaseError {
      constructor(cause, { account, docsPath, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
        var _a;
        const prettyArgs = prettyPrint({
          chain: chain && `${chain == null ? void 0 : chain.name} (id: ${chain == null ? void 0 : chain.id})`,
          from: account == null ? void 0 : account.address,
          to,
          value: typeof value !== "undefined" && `${(0, formatEther_js_1.formatEther)(value)} ${((_a = chain == null ? void 0 : chain.nativeCurrency) == null ? void 0 : _a.symbol) || "ETH"}`,
          data,
          gas,
          gasPrice: typeof gasPrice !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(gasPrice)} gwei`,
          maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(maxFeePerGas)} gwei`,
          maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(maxPriorityFeePerGas)} gwei`,
          nonce
        });
        super(cause.shortMessage, {
          cause,
          docsPath,
          metaMessages: [
            ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
            "Request Arguments:",
            prettyArgs
          ].filter(Boolean),
          name: "TransactionExecutionError"
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.cause = cause;
      }
    };
    exports.TransactionExecutionError = TransactionExecutionError;
    var TransactionNotFoundError = class extends base_js_1.BaseError {
      constructor({ blockHash, blockNumber, blockTag, hash, index }) {
        let identifier = "Transaction";
        if (blockTag && index !== void 0)
          identifier = `Transaction at block time "${blockTag}" at index "${index}"`;
        if (blockHash && index !== void 0)
          identifier = `Transaction at block hash "${blockHash}" at index "${index}"`;
        if (blockNumber && index !== void 0)
          identifier = `Transaction at block number "${blockNumber}" at index "${index}"`;
        if (hash)
          identifier = `Transaction with hash "${hash}"`;
        super(`${identifier} could not be found.`, {
          name: "TransactionNotFoundError"
        });
      }
    };
    exports.TransactionNotFoundError = TransactionNotFoundError;
    var TransactionReceiptNotFoundError = class extends base_js_1.BaseError {
      constructor({ hash }) {
        super(`Transaction receipt with hash "${hash}" could not be found. The Transaction may not be processed on a block yet.`, {
          name: "TransactionReceiptNotFoundError"
        });
      }
    };
    exports.TransactionReceiptNotFoundError = TransactionReceiptNotFoundError;
    var WaitForTransactionReceiptTimeoutError = class extends base_js_1.BaseError {
      constructor({ hash }) {
        super(`Timed out while waiting for transaction with hash "${hash}" to be confirmed.`, { name: "WaitForTransactionReceiptTimeoutError" });
      }
    };
    exports.WaitForTransactionReceiptTimeoutError = WaitForTransactionReceiptTimeoutError;
  }
});

// node_modules/viem/_cjs/errors/utils.js
var require_utils4 = __commonJS({
  "node_modules/viem/_cjs/errors/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getUrl = exports.getContractAddress = void 0;
    var getContractAddress = (address) => address;
    exports.getContractAddress = getContractAddress;
    var getUrl = (url) => url;
    exports.getUrl = getUrl;
  }
});

// node_modules/viem/_cjs/errors/contract.js
var require_contract = __commonJS({
  "node_modules/viem/_cjs/errors/contract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RawContractError = exports.CounterfactualDeploymentFailedError = exports.ContractFunctionZeroDataError = exports.ContractFunctionRevertedError = exports.ContractFunctionExecutionError = exports.CallExecutionError = void 0;
    var parseAccount_js_1 = require_parseAccount();
    var solidity_js_1 = require_solidity();
    var decodeErrorResult_js_1 = require_decodeErrorResult();
    var formatAbiItem_js_1 = require_formatAbiItem2();
    var formatAbiItemWithArgs_js_1 = require_formatAbiItemWithArgs();
    var getAbiItem_js_1 = require_getAbiItem();
    var formatEther_js_1 = require_formatEther();
    var formatGwei_js_1 = require_formatGwei();
    var abi_js_1 = require_abi();
    var base_js_1 = require_base();
    var stateOverride_js_1 = require_stateOverride();
    var transaction_js_1 = require_transaction();
    var utils_js_1 = require_utils4();
    var CallExecutionError = class extends base_js_1.BaseError {
      constructor(cause, { account: account_, docsPath, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride }) {
        var _a;
        const account = account_ ? (0, parseAccount_js_1.parseAccount)(account_) : void 0;
        let prettyArgs = (0, transaction_js_1.prettyPrint)({
          from: account == null ? void 0 : account.address,
          to,
          value: typeof value !== "undefined" && `${(0, formatEther_js_1.formatEther)(value)} ${((_a = chain == null ? void 0 : chain.nativeCurrency) == null ? void 0 : _a.symbol) || "ETH"}`,
          data,
          gas,
          gasPrice: typeof gasPrice !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(gasPrice)} gwei`,
          maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(maxFeePerGas)} gwei`,
          maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(maxPriorityFeePerGas)} gwei`,
          nonce
        });
        if (stateOverride) {
          prettyArgs += `
${(0, stateOverride_js_1.prettyStateOverride)(stateOverride)}`;
        }
        super(cause.shortMessage, {
          cause,
          docsPath,
          metaMessages: [
            ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
            "Raw Call Arguments:",
            prettyArgs
          ].filter(Boolean),
          name: "CallExecutionError"
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.cause = cause;
      }
    };
    exports.CallExecutionError = CallExecutionError;
    var ContractFunctionExecutionError = class extends base_js_1.BaseError {
      constructor(cause, { abi, args, contractAddress, docsPath, functionName, sender }) {
        const abiItem = (0, getAbiItem_js_1.getAbiItem)({ abi, args, name: functionName });
        const formattedArgs = abiItem ? (0, formatAbiItemWithArgs_js_1.formatAbiItemWithArgs)({
          abiItem,
          args,
          includeFunctionName: false,
          includeName: false
        }) : void 0;
        const functionWithParams = abiItem ? (0, formatAbiItem_js_1.formatAbiItem)(abiItem, { includeName: true }) : void 0;
        const prettyArgs = (0, transaction_js_1.prettyPrint)({
          address: contractAddress && (0, utils_js_1.getContractAddress)(contractAddress),
          function: functionWithParams,
          args: formattedArgs && formattedArgs !== "()" && `${[...Array((functionName == null ? void 0 : functionName.length) ?? 0).keys()].map(() => " ").join("")}${formattedArgs}`,
          sender
        });
        super(cause.shortMessage || `An unknown error occurred while executing the contract function "${functionName}".`, {
          cause,
          docsPath,
          metaMessages: [
            ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
            prettyArgs && "Contract Call:",
            prettyArgs
          ].filter(Boolean),
          name: "ContractFunctionExecutionError"
        });
        Object.defineProperty(this, "abi", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "args", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "contractAddress", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "formattedArgs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "functionName", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "sender", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.abi = abi;
        this.args = args;
        this.cause = cause;
        this.contractAddress = contractAddress;
        this.functionName = functionName;
        this.sender = sender;
      }
    };
    exports.ContractFunctionExecutionError = ContractFunctionExecutionError;
    var ContractFunctionRevertedError = class extends base_js_1.BaseError {
      constructor({ abi, data, functionName, message }) {
        let cause;
        let decodedData = void 0;
        let metaMessages;
        let reason;
        if (data && data !== "0x") {
          try {
            decodedData = (0, decodeErrorResult_js_1.decodeErrorResult)({ abi, data });
            const { abiItem, errorName, args: errorArgs } = decodedData;
            if (errorName === "Error") {
              reason = errorArgs[0];
            } else if (errorName === "Panic") {
              const [firstArg] = errorArgs;
              reason = solidity_js_1.panicReasons[firstArg];
            } else {
              const errorWithParams = abiItem ? (0, formatAbiItem_js_1.formatAbiItem)(abiItem, { includeName: true }) : void 0;
              const formattedArgs = abiItem && errorArgs ? (0, formatAbiItemWithArgs_js_1.formatAbiItemWithArgs)({
                abiItem,
                args: errorArgs,
                includeFunctionName: false,
                includeName: false
              }) : void 0;
              metaMessages = [
                errorWithParams ? `Error: ${errorWithParams}` : "",
                formattedArgs && formattedArgs !== "()" ? `       ${[...Array((errorName == null ? void 0 : errorName.length) ?? 0).keys()].map(() => " ").join("")}${formattedArgs}` : ""
              ];
            }
          } catch (err) {
            cause = err;
          }
        } else if (message)
          reason = message;
        let signature;
        if (cause instanceof abi_js_1.AbiErrorSignatureNotFoundError) {
          signature = cause.signature;
          metaMessages = [
            `Unable to decode signature "${signature}" as it was not found on the provided ABI.`,
            "Make sure you are using the correct ABI and that the error exists on it.",
            `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`
          ];
        }
        super(reason && reason !== "execution reverted" || signature ? [
          `The contract function "${functionName}" reverted with the following ${signature ? "signature" : "reason"}:`,
          reason || signature
        ].join("\n") : `The contract function "${functionName}" reverted.`, {
          cause,
          metaMessages,
          name: "ContractFunctionRevertedError"
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "reason", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "signature", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = decodedData;
        this.reason = reason;
        this.signature = signature;
      }
    };
    exports.ContractFunctionRevertedError = ContractFunctionRevertedError;
    var ContractFunctionZeroDataError = class extends base_js_1.BaseError {
      constructor({ functionName }) {
        super(`The contract function "${functionName}" returned no data ("0x").`, {
          metaMessages: [
            "This could be due to any of the following:",
            `  - The contract does not have the function "${functionName}",`,
            "  - The parameters passed to the contract function may be invalid, or",
            "  - The address is not a contract."
          ],
          name: "ContractFunctionZeroDataError"
        });
      }
    };
    exports.ContractFunctionZeroDataError = ContractFunctionZeroDataError;
    var CounterfactualDeploymentFailedError = class extends base_js_1.BaseError {
      constructor({ factory }) {
        super(`Deployment for counterfactual contract call failed${factory ? ` for factory "${factory}".` : ""}`, {
          metaMessages: [
            "Please ensure:",
            "- The `factory` is a valid contract deployment factory (ie. Create2 Factory, ERC-4337 Factory, etc).",
            "- The `factoryData` is a valid encoded function call for contract deployment function on the factory."
          ],
          name: "CounterfactualDeploymentFailedError"
        });
      }
    };
    exports.CounterfactualDeploymentFailedError = CounterfactualDeploymentFailedError;
    var RawContractError = class extends base_js_1.BaseError {
      constructor({ data, message }) {
        super(message || "", { name: "RawContractError" });
        Object.defineProperty(this, "code", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 3
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = data;
      }
    };
    exports.RawContractError = RawContractError;
  }
});

// node_modules/viem/_cjs/errors/request.js
var require_request = __commonJS({
  "node_modules/viem/_cjs/errors/request.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimeoutError = exports.SocketClosedError = exports.RpcRequestError = exports.WebSocketRequestError = exports.HttpRequestError = void 0;
    var stringify_js_1 = require_stringify();
    var base_js_1 = require_base();
    var utils_js_1 = require_utils4();
    var HttpRequestError = class extends base_js_1.BaseError {
      constructor({ body, cause, details, headers, status, url }) {
        super("HTTP request failed.", {
          cause,
          details,
          metaMessages: [
            status && `Status: ${status}`,
            `URL: ${(0, utils_js_1.getUrl)(url)}`,
            body && `Request body: ${(0, stringify_js_1.stringify)(body)}`
          ].filter(Boolean),
          name: "HttpRequestError"
        });
        Object.defineProperty(this, "body", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "headers", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "status", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "url", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.body = body;
        this.headers = headers;
        this.status = status;
        this.url = url;
      }
    };
    exports.HttpRequestError = HttpRequestError;
    var WebSocketRequestError = class extends base_js_1.BaseError {
      constructor({ body, cause, details, url }) {
        super("WebSocket request failed.", {
          cause,
          details,
          metaMessages: [
            `URL: ${(0, utils_js_1.getUrl)(url)}`,
            body && `Request body: ${(0, stringify_js_1.stringify)(body)}`
          ].filter(Boolean),
          name: "WebSocketRequestError"
        });
      }
    };
    exports.WebSocketRequestError = WebSocketRequestError;
    var RpcRequestError = class extends base_js_1.BaseError {
      constructor({ body, error, url }) {
        super("RPC Request failed.", {
          cause: error,
          details: error.message,
          metaMessages: [`URL: ${(0, utils_js_1.getUrl)(url)}`, `Request body: ${(0, stringify_js_1.stringify)(body)}`],
          name: "RpcRequestError"
        });
        Object.defineProperty(this, "code", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.code = error.code;
        this.data = error.data;
      }
    };
    exports.RpcRequestError = RpcRequestError;
    var SocketClosedError = class extends base_js_1.BaseError {
      constructor({ url } = {}) {
        super("The socket has been closed.", {
          metaMessages: [url && `URL: ${(0, utils_js_1.getUrl)(url)}`].filter(Boolean),
          name: "SocketClosedError"
        });
      }
    };
    exports.SocketClosedError = SocketClosedError;
    var TimeoutError = class extends base_js_1.BaseError {
      constructor({ body, url }) {
        super("The request took too long to respond.", {
          details: "The request timed out.",
          metaMessages: [`URL: ${(0, utils_js_1.getUrl)(url)}`, `Request body: ${(0, stringify_js_1.stringify)(body)}`],
          name: "TimeoutError"
        });
      }
    };
    exports.TimeoutError = TimeoutError;
  }
});

// node_modules/viem/_cjs/errors/rpc.js
var require_rpc2 = __commonJS({
  "node_modules/viem/_cjs/errors/rpc.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnknownRpcError = exports.SwitchChainError = exports.ChainDisconnectedError = exports.ProviderDisconnectedError = exports.UnsupportedProviderMethodError = exports.UnauthorizedProviderError = exports.UserRejectedRequestError = exports.JsonRpcVersionUnsupportedError = exports.LimitExceededRpcError = exports.MethodNotSupportedRpcError = exports.TransactionRejectedRpcError = exports.ResourceUnavailableRpcError = exports.ResourceNotFoundRpcError = exports.InvalidInputRpcError = exports.InternalRpcError = exports.InvalidParamsRpcError = exports.MethodNotFoundRpcError = exports.InvalidRequestRpcError = exports.ParseRpcError = exports.ProviderRpcError = exports.RpcError = void 0;
    var base_js_1 = require_base();
    var request_js_1 = require_request();
    var unknownErrorCode = -1;
    var RpcError = class extends base_js_1.BaseError {
      constructor(cause, { code, docsPath, metaMessages, name, shortMessage }) {
        super(shortMessage, {
          cause,
          docsPath,
          metaMessages: metaMessages || (cause == null ? void 0 : cause.metaMessages),
          name: name || "RpcError"
        });
        Object.defineProperty(this, "code", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.name = name || cause.name;
        this.code = cause instanceof request_js_1.RpcRequestError ? cause.code : code ?? unknownErrorCode;
      }
    };
    exports.RpcError = RpcError;
    var ProviderRpcError = class extends RpcError {
      constructor(cause, options) {
        super(cause, options);
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = options.data;
      }
    };
    exports.ProviderRpcError = ProviderRpcError;
    var ParseRpcError = class _ParseRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _ParseRpcError.code,
          name: "ParseRpcError",
          shortMessage: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
        });
      }
    };
    exports.ParseRpcError = ParseRpcError;
    Object.defineProperty(ParseRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32700
    });
    var InvalidRequestRpcError = class _InvalidRequestRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InvalidRequestRpcError.code,
          name: "InvalidRequestRpcError",
          shortMessage: "JSON is not a valid request object."
        });
      }
    };
    exports.InvalidRequestRpcError = InvalidRequestRpcError;
    Object.defineProperty(InvalidRequestRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32600
    });
    var MethodNotFoundRpcError = class _MethodNotFoundRpcError extends RpcError {
      constructor(cause, { method } = {}) {
        super(cause, {
          code: _MethodNotFoundRpcError.code,
          name: "MethodNotFoundRpcError",
          shortMessage: `The method${method ? ` "${method}"` : ""} does not exist / is not available.`
        });
      }
    };
    exports.MethodNotFoundRpcError = MethodNotFoundRpcError;
    Object.defineProperty(MethodNotFoundRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32601
    });
    var InvalidParamsRpcError = class _InvalidParamsRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InvalidParamsRpcError.code,
          name: "InvalidParamsRpcError",
          shortMessage: [
            "Invalid parameters were provided to the RPC method.",
            "Double check you have provided the correct parameters."
          ].join("\n")
        });
      }
    };
    exports.InvalidParamsRpcError = InvalidParamsRpcError;
    Object.defineProperty(InvalidParamsRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32602
    });
    var InternalRpcError = class _InternalRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InternalRpcError.code,
          name: "InternalRpcError",
          shortMessage: "An internal error was received."
        });
      }
    };
    exports.InternalRpcError = InternalRpcError;
    Object.defineProperty(InternalRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32603
    });
    var InvalidInputRpcError = class _InvalidInputRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InvalidInputRpcError.code,
          name: "InvalidInputRpcError",
          shortMessage: [
            "Missing or invalid parameters.",
            "Double check you have provided the correct parameters."
          ].join("\n")
        });
      }
    };
    exports.InvalidInputRpcError = InvalidInputRpcError;
    Object.defineProperty(InvalidInputRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32e3
    });
    var ResourceNotFoundRpcError = class _ResourceNotFoundRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _ResourceNotFoundRpcError.code,
          name: "ResourceNotFoundRpcError",
          shortMessage: "Requested resource not found."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ResourceNotFoundRpcError"
        });
      }
    };
    exports.ResourceNotFoundRpcError = ResourceNotFoundRpcError;
    Object.defineProperty(ResourceNotFoundRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32001
    });
    var ResourceUnavailableRpcError = class _ResourceUnavailableRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _ResourceUnavailableRpcError.code,
          name: "ResourceUnavailableRpcError",
          shortMessage: "Requested resource not available."
        });
      }
    };
    exports.ResourceUnavailableRpcError = ResourceUnavailableRpcError;
    Object.defineProperty(ResourceUnavailableRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32002
    });
    var TransactionRejectedRpcError = class _TransactionRejectedRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _TransactionRejectedRpcError.code,
          name: "TransactionRejectedRpcError",
          shortMessage: "Transaction creation failed."
        });
      }
    };
    exports.TransactionRejectedRpcError = TransactionRejectedRpcError;
    Object.defineProperty(TransactionRejectedRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32003
    });
    var MethodNotSupportedRpcError = class _MethodNotSupportedRpcError extends RpcError {
      constructor(cause, { method } = {}) {
        super(cause, {
          code: _MethodNotSupportedRpcError.code,
          name: "MethodNotSupportedRpcError",
          shortMessage: `Method${method ? ` "${method}"` : ""} is not implemented.`
        });
      }
    };
    exports.MethodNotSupportedRpcError = MethodNotSupportedRpcError;
    Object.defineProperty(MethodNotSupportedRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32004
    });
    var LimitExceededRpcError = class _LimitExceededRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _LimitExceededRpcError.code,
          name: "LimitExceededRpcError",
          shortMessage: "Request exceeds defined limit."
        });
      }
    };
    exports.LimitExceededRpcError = LimitExceededRpcError;
    Object.defineProperty(LimitExceededRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32005
    });
    var JsonRpcVersionUnsupportedError = class _JsonRpcVersionUnsupportedError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _JsonRpcVersionUnsupportedError.code,
          name: "JsonRpcVersionUnsupportedError",
          shortMessage: "Version of JSON-RPC protocol is not supported."
        });
      }
    };
    exports.JsonRpcVersionUnsupportedError = JsonRpcVersionUnsupportedError;
    Object.defineProperty(JsonRpcVersionUnsupportedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32006
    });
    var UserRejectedRequestError = class _UserRejectedRequestError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _UserRejectedRequestError.code,
          name: "UserRejectedRequestError",
          shortMessage: "User rejected the request."
        });
      }
    };
    exports.UserRejectedRequestError = UserRejectedRequestError;
    Object.defineProperty(UserRejectedRequestError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4001
    });
    var UnauthorizedProviderError = class _UnauthorizedProviderError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _UnauthorizedProviderError.code,
          name: "UnauthorizedProviderError",
          shortMessage: "The requested method and/or account has not been authorized by the user."
        });
      }
    };
    exports.UnauthorizedProviderError = UnauthorizedProviderError;
    Object.defineProperty(UnauthorizedProviderError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4100
    });
    var UnsupportedProviderMethodError = class _UnsupportedProviderMethodError extends ProviderRpcError {
      constructor(cause, { method } = {}) {
        super(cause, {
          code: _UnsupportedProviderMethodError.code,
          name: "UnsupportedProviderMethodError",
          shortMessage: `The Provider does not support the requested method${method ? ` " ${method}"` : ""}.`
        });
      }
    };
    exports.UnsupportedProviderMethodError = UnsupportedProviderMethodError;
    Object.defineProperty(UnsupportedProviderMethodError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4200
    });
    var ProviderDisconnectedError = class _ProviderDisconnectedError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _ProviderDisconnectedError.code,
          name: "ProviderDisconnectedError",
          shortMessage: "The Provider is disconnected from all chains."
        });
      }
    };
    exports.ProviderDisconnectedError = ProviderDisconnectedError;
    Object.defineProperty(ProviderDisconnectedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4900
    });
    var ChainDisconnectedError = class _ChainDisconnectedError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _ChainDisconnectedError.code,
          name: "ChainDisconnectedError",
          shortMessage: "The Provider is not connected to the requested chain."
        });
      }
    };
    exports.ChainDisconnectedError = ChainDisconnectedError;
    Object.defineProperty(ChainDisconnectedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4901
    });
    var SwitchChainError = class _SwitchChainError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _SwitchChainError.code,
          name: "SwitchChainError",
          shortMessage: "An error occurred when attempting to switch chain."
        });
      }
    };
    exports.SwitchChainError = SwitchChainError;
    Object.defineProperty(SwitchChainError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4902
    });
    var UnknownRpcError = class extends RpcError {
      constructor(cause) {
        super(cause, {
          name: "UnknownRpcError",
          shortMessage: "An unknown RPC error occurred."
        });
      }
    };
    exports.UnknownRpcError = UnknownRpcError;
  }
});

// node_modules/viem/_cjs/utils/errors/getContractError.js
var require_getContractError = __commonJS({
  "node_modules/viem/_cjs/utils/errors/getContractError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getContractError = getContractError;
    var abi_js_1 = require_abi();
    var base_js_1 = require_base();
    var contract_js_1 = require_contract();
    var request_js_1 = require_request();
    var rpc_js_1 = require_rpc2();
    var EXECUTION_REVERTED_ERROR_CODE = 3;
    function getContractError(err, { abi, address, args, docsPath, functionName, sender }) {
      const error = err instanceof contract_js_1.RawContractError ? err : err instanceof base_js_1.BaseError ? err.walk((err2) => "data" in err2) || err.walk() : {};
      const { code, data, details, message, shortMessage } = error;
      const cause = (() => {
        if (err instanceof abi_js_1.AbiDecodingZeroDataError)
          return new contract_js_1.ContractFunctionZeroDataError({ functionName });
        if ([EXECUTION_REVERTED_ERROR_CODE, rpc_js_1.InternalRpcError.code].includes(code) && (data || details || message || shortMessage)) {
          return new contract_js_1.ContractFunctionRevertedError({
            abi,
            data: typeof data === "object" ? data.data : data,
            functionName,
            message: error instanceof request_js_1.RpcRequestError ? details : shortMessage ?? message
          });
        }
        return err;
      })();
      return new contract_js_1.ContractFunctionExecutionError(cause, {
        abi,
        args,
        contractAddress: address,
        docsPath,
        functionName,
        sender
      });
    }
  }
});

// node_modules/viem/_cjs/accounts/utils/publicKeyToAddress.js
var require_publicKeyToAddress = __commonJS({
  "node_modules/viem/_cjs/accounts/utils/publicKeyToAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.publicKeyToAddress = publicKeyToAddress;
    var getAddress_js_1 = require_getAddress();
    var keccak256_js_1 = require_keccak256();
    function publicKeyToAddress(publicKey) {
      const address = (0, keccak256_js_1.keccak256)(`0x${publicKey.substring(4)}`).substring(26);
      return (0, getAddress_js_1.checksumAddress)(`0x${address}`);
    }
  }
});

// node_modules/viem/node_modules/@noble/curves/node_modules/@noble/hashes/_assert.js
var require_assert2 = __commonJS({
  "node_modules/viem/node_modules/@noble/curves/node_modules/@noble/hashes/_assert.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.anumber = anumber;
    exports.number = anumber;
    exports.abytes = abytes;
    exports.bytes = abytes;
    exports.ahash = ahash;
    exports.aexists = aexists;
    exports.aoutput = aoutput;
    function anumber(n) {
      if (!Number.isSafeInteger(n) || n < 0)
        throw new Error("positive integer expected, got " + n);
    }
    function isBytes(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    function abytes(b, ...lengths) {
      if (!isBytes(b))
        throw new Error("Uint8Array expected");
      if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
    }
    function ahash(h) {
      if (typeof h !== "function" || typeof h.create !== "function")
        throw new Error("Hash should be wrapped by utils.wrapConstructor");
      anumber(h.outputLen);
      anumber(h.blockLen);
    }
    function aexists(instance, checkFinished = true) {
      if (instance.destroyed)
        throw new Error("Hash instance has been destroyed");
      if (checkFinished && instance.finished)
        throw new Error("Hash#digest() has already been called");
    }
    function aoutput(out, instance) {
      abytes(out);
      const min = instance.outputLen;
      if (out.length < min) {
        throw new Error("digestInto() expects output buffer of length at least " + min);
      }
    }
    var assert = {
      number: anumber,
      bytes: abytes,
      hash: ahash,
      exists: aexists,
      output: aoutput
    };
    exports.default = assert;
  }
});

// node_modules/viem/node_modules/@noble/curves/node_modules/@noble/hashes/crypto.js
var require_crypto2 = __commonJS({
  "node_modules/viem/node_modules/@noble/curves/node_modules/@noble/hashes/crypto.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.crypto = void 0;
    exports.crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
  }
});

// node_modules/viem/node_modules/@noble/curves/node_modules/@noble/hashes/utils.js
var require_utils5 = __commonJS({
  "node_modules/viem/node_modules/@noble/curves/node_modules/@noble/hashes/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hash = exports.nextTick = exports.byteSwapIfBE = exports.byteSwap = exports.isLE = exports.rotl = exports.rotr = exports.createView = exports.u32 = exports.u8 = void 0;
    exports.isBytes = isBytes;
    exports.byteSwap32 = byteSwap32;
    exports.bytesToHex = bytesToHex;
    exports.hexToBytes = hexToBytes;
    exports.asyncLoop = asyncLoop;
    exports.utf8ToBytes = utf8ToBytes;
    exports.toBytes = toBytes;
    exports.concatBytes = concatBytes;
    exports.checkOpts = checkOpts;
    exports.wrapConstructor = wrapConstructor;
    exports.wrapConstructorWithOpts = wrapConstructorWithOpts;
    exports.wrapXOFConstructorWithOpts = wrapXOFConstructorWithOpts;
    exports.randomBytes = randomBytes;
    var crypto_1 = require_crypto2();
    var _assert_js_1 = require_assert2();
    function isBytes(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    var u8 = (arr) => new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    exports.u8 = u8;
    var u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    exports.u32 = u32;
    var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    exports.createView = createView;
    var rotr = (word, shift) => word << 32 - shift | word >>> shift;
    exports.rotr = rotr;
    var rotl = (word, shift) => word << shift | word >>> 32 - shift >>> 0;
    exports.rotl = rotl;
    exports.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    var byteSwap = (word) => word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
    exports.byteSwap = byteSwap;
    exports.byteSwapIfBE = exports.isLE ? (n) => n : (n) => (0, exports.byteSwap)(n);
    function byteSwap32(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = (0, exports.byteSwap)(arr[i]);
      }
    }
    var hexes = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex(bytes) {
      (0, _assert_js_1.abytes)(bytes);
      let hex = "";
      for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
      }
      return hex;
    }
    var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    function asciiToBase16(ch) {
      if (ch >= asciis._0 && ch <= asciis._9)
        return ch - asciis._0;
      if (ch >= asciis.A && ch <= asciis.F)
        return ch - (asciis.A - 10);
      if (ch >= asciis.a && ch <= asciis.f)
        return ch - (asciis.a - 10);
      return;
    }
    function hexToBytes(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      const hl = hex.length;
      const al = hl / 2;
      if (hl % 2)
        throw new Error("padded hex string expected, got unpadded hex of length " + hl);
      const array = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex[hi] + hex[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
      }
      return array;
    }
    var nextTick = async () => {
    };
    exports.nextTick = nextTick;
    async function asyncLoop(iters, tick, cb) {
      let ts = Date.now();
      for (let i = 0; i < iters; i++) {
        cb(i);
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick)
          continue;
        await (0, exports.nextTick)();
        ts += diff;
      }
    }
    function utf8ToBytes(str) {
      if (typeof str !== "string")
        throw new Error("utf8ToBytes expected string, got " + typeof str);
      return new Uint8Array(new TextEncoder().encode(str));
    }
    function toBytes(data) {
      if (typeof data === "string")
        data = utf8ToBytes(data);
      (0, _assert_js_1.abytes)(data);
      return data;
    }
    function concatBytes(...arrays) {
      let sum = 0;
      for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        (0, _assert_js_1.abytes)(a);
        sum += a.length;
      }
      const res = new Uint8Array(sum);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
      }
      return res;
    }
    var Hash = class {
      // Safe version that clones internal state
      clone() {
        return this._cloneInto();
      }
    };
    exports.Hash = Hash;
    function checkOpts(defaults, opts) {
      if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
        throw new Error("Options should be object or undefined");
      const merged = Object.assign(defaults, opts);
      return merged;
    }
    function wrapConstructor(hashCons) {
      const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
      const tmp = hashCons();
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = () => hashCons();
      return hashC;
    }
    function wrapConstructorWithOpts(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    function wrapXOFConstructorWithOpts(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    function randomBytes(bytesLength = 32) {
      if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
        return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
      }
      if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
        return crypto_1.crypto.randomBytes(bytesLength);
      }
      throw new Error("crypto.getRandomValues must be defined");
    }
  }
});

// node_modules/viem/node_modules/@noble/curves/node_modules/@noble/hashes/_md.js
var require_md = __commonJS({
  "node_modules/viem/node_modules/@noble/curves/node_modules/@noble/hashes/_md.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HashMD = exports.Maj = exports.Chi = void 0;
    var _assert_js_1 = require_assert2();
    var utils_js_1 = require_utils5();
    function setBigUint64(view, byteOffset, value, isLE) {
      if (typeof view.setBigUint64 === "function")
        return view.setBigUint64(byteOffset, value, isLE);
      const _32n = BigInt(32);
      const _u32_max = BigInt(4294967295);
      const wh = Number(value >> _32n & _u32_max);
      const wl = Number(value & _u32_max);
      const h = isLE ? 4 : 0;
      const l = isLE ? 0 : 4;
      view.setUint32(byteOffset + h, wh, isLE);
      view.setUint32(byteOffset + l, wl, isLE);
    }
    var Chi = (a, b, c) => a & b ^ ~a & c;
    exports.Chi = Chi;
    var Maj = (a, b, c) => a & b ^ a & c ^ b & c;
    exports.Maj = Maj;
    var HashMD = class extends utils_js_1.Hash {
      constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.buffer = new Uint8Array(blockLen);
        this.view = (0, utils_js_1.createView)(this.buffer);
      }
      update(data) {
        (0, _assert_js_1.aexists)(this);
        const { view, buffer, blockLen } = this;
        data = (0, utils_js_1.toBytes)(data);
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = (0, utils_js_1.createView)(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            continue;
          }
          buffer.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
            this.pos = 0;
          }
        }
        this.length += data.length;
        this.roundClean();
        return this;
      }
      digestInto(out) {
        (0, _assert_js_1.aexists)(this);
        (0, _assert_js_1.aoutput)(out, this);
        this.finished = true;
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        this.buffer.subarray(pos).fill(0);
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          pos = 0;
        }
        for (let i = pos; i < blockLen; i++)
          buffer[i] = 0;
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = (0, utils_js_1.createView)(out);
        const len = this.outputLen;
        if (len % 4)
          throw new Error("_sha2: outputLen should be aligned to 32bit");
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
          throw new Error("_sha2: outputLen bigger than state");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.length = length;
        to.pos = pos;
        to.finished = finished;
        to.destroyed = destroyed;
        if (length % blockLen)
          to.buffer.set(buffer);
        return to;
      }
    };
    exports.HashMD = HashMD;
  }
});

// node_modules/viem/node_modules/@noble/curves/node_modules/@noble/hashes/sha256.js
var require_sha256 = __commonJS({
  "node_modules/viem/node_modules/@noble/curves/node_modules/@noble/hashes/sha256.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha224 = exports.sha256 = exports.SHA256 = void 0;
    var _md_js_1 = require_md();
    var utils_js_1 = require_utils5();
    var SHA256_K = new Uint32Array([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    var SHA256_IV = new Uint32Array([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    var SHA256_W = new Uint32Array(64);
    var SHA256 = class extends _md_js_1.HashMD {
      constructor() {
        super(64, 32, 8, false);
        this.A = SHA256_IV[0] | 0;
        this.B = SHA256_IV[1] | 0;
        this.C = SHA256_IV[2] | 0;
        this.D = SHA256_IV[3] | 0;
        this.E = SHA256_IV[4] | 0;
        this.F = SHA256_IV[5] | 0;
        this.G = SHA256_IV[6] | 0;
        this.H = SHA256_IV[7] | 0;
      }
      get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
      }
      // prettier-ignore
      set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
          const W15 = SHA256_W[i - 15];
          const W2 = SHA256_W[i - 2];
          const s0 = (0, utils_js_1.rotr)(W15, 7) ^ (0, utils_js_1.rotr)(W15, 18) ^ W15 >>> 3;
          const s1 = (0, utils_js_1.rotr)(W2, 17) ^ (0, utils_js_1.rotr)(W2, 19) ^ W2 >>> 10;
          SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
        }
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
          const sigma1 = (0, utils_js_1.rotr)(E, 6) ^ (0, utils_js_1.rotr)(E, 11) ^ (0, utils_js_1.rotr)(E, 25);
          const T1 = H + sigma1 + (0, _md_js_1.Chi)(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
          const sigma0 = (0, utils_js_1.rotr)(A, 2) ^ (0, utils_js_1.rotr)(A, 13) ^ (0, utils_js_1.rotr)(A, 22);
          const T2 = sigma0 + (0, _md_js_1.Maj)(A, B, C) | 0;
          H = G;
          G = F;
          F = E;
          E = D + T1 | 0;
          D = C;
          C = B;
          B = A;
          A = T1 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
      }
      roundClean() {
        SHA256_W.fill(0);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        this.buffer.fill(0);
      }
    };
    exports.SHA256 = SHA256;
    var SHA224 = class extends SHA256 {
      constructor() {
        super();
        this.A = 3238371032 | 0;
        this.B = 914150663 | 0;
        this.C = 812702999 | 0;
        this.D = 4144912697 | 0;
        this.E = 4290775857 | 0;
        this.F = 1750603025 | 0;
        this.G = 1694076839 | 0;
        this.H = 3204075428 | 0;
        this.outputLen = 28;
      }
    };
    exports.sha256 = (0, utils_js_1.wrapConstructor)(() => new SHA256());
    exports.sha224 = (0, utils_js_1.wrapConstructor)(() => new SHA224());
  }
});

// node_modules/viem/node_modules/@noble/curves/node_modules/@noble/hashes/hmac.js
var require_hmac = __commonJS({
  "node_modules/viem/node_modules/@noble/curves/node_modules/@noble/hashes/hmac.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hmac = exports.HMAC = void 0;
    var _assert_js_1 = require_assert2();
    var utils_js_1 = require_utils5();
    var HMAC = class extends utils_js_1.Hash {
      constructor(hash, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        (0, _assert_js_1.ahash)(hash);
        const key = (0, utils_js_1.toBytes)(_key);
        this.iHash = hash.create();
        if (typeof this.iHash.update !== "function")
          throw new Error("Expected instance of class which extends utils.Hash");
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54;
        this.iHash.update(pad);
        this.oHash = hash.create();
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54 ^ 92;
        this.oHash.update(pad);
        pad.fill(0);
      }
      update(buf) {
        (0, _assert_js_1.aexists)(this);
        this.iHash.update(buf);
        return this;
      }
      digestInto(out) {
        (0, _assert_js_1.aexists)(this);
        (0, _assert_js_1.abytes)(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
      }
      digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
      }
      _cloneInto(to) {
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
      }
      destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
      }
    };
    exports.HMAC = HMAC;
    var hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
    exports.hmac = hmac;
    exports.hmac.create = (hash, key) => new HMAC(hash, key);
  }
});

// node_modules/viem/node_modules/@noble/curves/abstract/utils.js
var require_utils6 = __commonJS({
  "node_modules/viem/node_modules/@noble/curves/abstract/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.notImplemented = exports.bitMask = void 0;
    exports.isBytes = isBytes;
    exports.abytes = abytes;
    exports.abool = abool;
    exports.bytesToHex = bytesToHex;
    exports.numberToHexUnpadded = numberToHexUnpadded;
    exports.hexToNumber = hexToNumber;
    exports.hexToBytes = hexToBytes;
    exports.bytesToNumberBE = bytesToNumberBE;
    exports.bytesToNumberLE = bytesToNumberLE;
    exports.numberToBytesBE = numberToBytesBE;
    exports.numberToBytesLE = numberToBytesLE;
    exports.numberToVarBytesBE = numberToVarBytesBE;
    exports.ensureBytes = ensureBytes;
    exports.concatBytes = concatBytes;
    exports.equalBytes = equalBytes;
    exports.utf8ToBytes = utf8ToBytes;
    exports.inRange = inRange;
    exports.aInRange = aInRange;
    exports.bitLen = bitLen;
    exports.bitGet = bitGet;
    exports.bitSet = bitSet;
    exports.createHmacDrbg = createHmacDrbg;
    exports.validateObject = validateObject;
    exports.memoized = memoized;
    var _0n = BigInt(0);
    var _1n = BigInt(1);
    var _2n = BigInt(2);
    function isBytes(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    function abytes(item) {
      if (!isBytes(item))
        throw new Error("Uint8Array expected");
    }
    function abool(title, value) {
      if (typeof value !== "boolean")
        throw new Error(title + " boolean expected, got " + value);
    }
    var hexes = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex(bytes) {
      abytes(bytes);
      let hex = "";
      for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
      }
      return hex;
    }
    function numberToHexUnpadded(num) {
      const hex = num.toString(16);
      return hex.length & 1 ? "0" + hex : hex;
    }
    function hexToNumber(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      return hex === "" ? _0n : BigInt("0x" + hex);
    }
    var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    function asciiToBase16(ch) {
      if (ch >= asciis._0 && ch <= asciis._9)
        return ch - asciis._0;
      if (ch >= asciis.A && ch <= asciis.F)
        return ch - (asciis.A - 10);
      if (ch >= asciis.a && ch <= asciis.f)
        return ch - (asciis.a - 10);
      return;
    }
    function hexToBytes(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      const hl = hex.length;
      const al = hl / 2;
      if (hl % 2)
        throw new Error("hex string expected, got unpadded hex of length " + hl);
      const array = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex[hi] + hex[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
      }
      return array;
    }
    function bytesToNumberBE(bytes) {
      return hexToNumber(bytesToHex(bytes));
    }
    function bytesToNumberLE(bytes) {
      abytes(bytes);
      return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
    }
    function numberToBytesBE(n, len) {
      return hexToBytes(n.toString(16).padStart(len * 2, "0"));
    }
    function numberToBytesLE(n, len) {
      return numberToBytesBE(n, len).reverse();
    }
    function numberToVarBytesBE(n) {
      return hexToBytes(numberToHexUnpadded(n));
    }
    function ensureBytes(title, hex, expectedLength) {
      let res;
      if (typeof hex === "string") {
        try {
          res = hexToBytes(hex);
        } catch (e) {
          throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
        }
      } else if (isBytes(hex)) {
        res = Uint8Array.from(hex);
      } else {
        throw new Error(title + " must be hex string or Uint8Array");
      }
      const len = res.length;
      if (typeof expectedLength === "number" && len !== expectedLength)
        throw new Error(title + " of length " + expectedLength + " expected, got " + len);
      return res;
    }
    function concatBytes(...arrays) {
      let sum = 0;
      for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        abytes(a);
        sum += a.length;
      }
      const res = new Uint8Array(sum);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
      }
      return res;
    }
    function equalBytes(a, b) {
      if (a.length !== b.length)
        return false;
      let diff = 0;
      for (let i = 0; i < a.length; i++)
        diff |= a[i] ^ b[i];
      return diff === 0;
    }
    function utf8ToBytes(str) {
      if (typeof str !== "string")
        throw new Error("string expected");
      return new Uint8Array(new TextEncoder().encode(str));
    }
    var isPosBig = (n) => typeof n === "bigint" && _0n <= n;
    function inRange(n, min, max) {
      return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
    }
    function aInRange(title, n, min, max) {
      if (!inRange(n, min, max))
        throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
    }
    function bitLen(n) {
      let len;
      for (len = 0; n > _0n; n >>= _1n, len += 1)
        ;
      return len;
    }
    function bitGet(n, pos) {
      return n >> BigInt(pos) & _1n;
    }
    function bitSet(n, pos, value) {
      return n | (value ? _1n : _0n) << BigInt(pos);
    }
    var bitMask = (n) => (_2n << BigInt(n - 1)) - _1n;
    exports.bitMask = bitMask;
    var u8n = (data) => new Uint8Array(data);
    var u8fr = (arr) => Uint8Array.from(arr);
    function createHmacDrbg(hashLen, qByteLen, hmacFn) {
      if (typeof hashLen !== "number" || hashLen < 2)
        throw new Error("hashLen must be a number");
      if (typeof qByteLen !== "number" || qByteLen < 2)
        throw new Error("qByteLen must be a number");
      if (typeof hmacFn !== "function")
        throw new Error("hmacFn must be a function");
      let v = u8n(hashLen);
      let k = u8n(hashLen);
      let i = 0;
      const reset = () => {
        v.fill(1);
        k.fill(0);
        i = 0;
      };
      const h = (...b) => hmacFn(k, v, ...b);
      const reseed = (seed = u8n()) => {
        k = h(u8fr([0]), seed);
        v = h();
        if (seed.length === 0)
          return;
        k = h(u8fr([1]), seed);
        v = h();
      };
      const gen = () => {
        if (i++ >= 1e3)
          throw new Error("drbg: tried 1000 values");
        let len = 0;
        const out = [];
        while (len < qByteLen) {
          v = h();
          const sl = v.slice();
          out.push(sl);
          len += v.length;
        }
        return concatBytes(...out);
      };
      const genUntil = (seed, pred) => {
        reset();
        reseed(seed);
        let res = void 0;
        while (!(res = pred(gen())))
          reseed();
        reset();
        return res;
      };
      return genUntil;
    }
    var validatorFns = {
      bigint: (val) => typeof val === "bigint",
      function: (val) => typeof val === "function",
      boolean: (val) => typeof val === "boolean",
      string: (val) => typeof val === "string",
      stringOrUint8Array: (val) => typeof val === "string" || isBytes(val),
      isSafeInteger: (val) => Number.isSafeInteger(val),
      array: (val) => Array.isArray(val),
      field: (val, object) => object.Fp.isValid(val),
      hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
    };
    function validateObject(object, validators, optValidators = {}) {
      const checkField = (fieldName, type, isOptional) => {
        const checkVal = validatorFns[type];
        if (typeof checkVal !== "function")
          throw new Error("invalid validator function");
        const val = object[fieldName];
        if (isOptional && val === void 0)
          return;
        if (!checkVal(val, object)) {
          throw new Error("param " + String(fieldName) + " is invalid. Expected " + type + ", got " + val);
        }
      };
      for (const [fieldName, type] of Object.entries(validators))
        checkField(fieldName, type, false);
      for (const [fieldName, type] of Object.entries(optValidators))
        checkField(fieldName, type, true);
      return object;
    }
    var notImplemented = () => {
      throw new Error("not implemented");
    };
    exports.notImplemented = notImplemented;
    function memoized(fn) {
      const map = /* @__PURE__ */ new WeakMap();
      return (arg, ...args) => {
        const val = map.get(arg);
        if (val !== void 0)
          return val;
        const computed = fn(arg, ...args);
        map.set(arg, computed);
        return computed;
      };
    }
  }
});

// node_modules/viem/node_modules/@noble/curves/abstract/modular.js
var require_modular = __commonJS({
  "node_modules/viem/node_modules/@noble/curves/abstract/modular.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isNegativeLE = void 0;
    exports.mod = mod;
    exports.pow = pow;
    exports.pow2 = pow2;
    exports.invert = invert;
    exports.tonelliShanks = tonelliShanks;
    exports.FpSqrt = FpSqrt;
    exports.validateField = validateField;
    exports.FpPow = FpPow;
    exports.FpInvertBatch = FpInvertBatch;
    exports.FpDiv = FpDiv;
    exports.FpLegendre = FpLegendre;
    exports.FpIsSquare = FpIsSquare;
    exports.nLength = nLength;
    exports.Field = Field;
    exports.FpSqrtOdd = FpSqrtOdd;
    exports.FpSqrtEven = FpSqrtEven;
    exports.hashToPrivateScalar = hashToPrivateScalar;
    exports.getFieldBytesLength = getFieldBytesLength;
    exports.getMinHashLength = getMinHashLength;
    exports.mapHashToField = mapHashToField;
    var utils_js_1 = require_utils6();
    var _0n = BigInt(0);
    var _1n = BigInt(1);
    var _2n = BigInt(2);
    var _3n = BigInt(3);
    var _4n = BigInt(4);
    var _5n = BigInt(5);
    var _8n = BigInt(8);
    var _9n = BigInt(9);
    var _16n = BigInt(16);
    function mod(a, b) {
      const result = a % b;
      return result >= _0n ? result : b + result;
    }
    function pow(num, power, modulo) {
      if (power < _0n)
        throw new Error("invalid exponent, negatives unsupported");
      if (modulo <= _0n)
        throw new Error("invalid modulus");
      if (modulo === _1n)
        return _0n;
      let res = _1n;
      while (power > _0n) {
        if (power & _1n)
          res = res * num % modulo;
        num = num * num % modulo;
        power >>= _1n;
      }
      return res;
    }
    function pow2(x, power, modulo) {
      let res = x;
      while (power-- > _0n) {
        res *= res;
        res %= modulo;
      }
      return res;
    }
    function invert(number, modulo) {
      if (number === _0n)
        throw new Error("invert: expected non-zero number");
      if (modulo <= _0n)
        throw new Error("invert: expected positive modulus, got " + modulo);
      let a = mod(number, modulo);
      let b = modulo;
      let x = _0n, y = _1n, u = _1n, v = _0n;
      while (a !== _0n) {
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        const n = y - v * q;
        b = a, a = r, x = u, y = v, u = m, v = n;
      }
      const gcd = b;
      if (gcd !== _1n)
        throw new Error("invert: does not exist");
      return mod(x, modulo);
    }
    function tonelliShanks(P) {
      const legendreC = (P - _1n) / _2n;
      let Q, S, Z;
      for (Q = P - _1n, S = 0; Q % _2n === _0n; Q /= _2n, S++)
        ;
      for (Z = _2n; Z < P && pow(Z, legendreC, P) !== P - _1n; Z++) {
        if (Z > 1e3)
          throw new Error("Cannot find square root: likely non-prime P");
      }
      if (S === 1) {
        const p1div4 = (P + _1n) / _4n;
        return function tonelliFast(Fp, n) {
          const root = Fp.pow(n, p1div4);
          if (!Fp.eql(Fp.sqr(root), n))
            throw new Error("Cannot find square root");
          return root;
        };
      }
      const Q1div2 = (Q + _1n) / _2n;
      return function tonelliSlow(Fp, n) {
        if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE))
          throw new Error("Cannot find square root");
        let r = S;
        let g = Fp.pow(Fp.mul(Fp.ONE, Z), Q);
        let x = Fp.pow(n, Q1div2);
        let b = Fp.pow(n, Q);
        while (!Fp.eql(b, Fp.ONE)) {
          if (Fp.eql(b, Fp.ZERO))
            return Fp.ZERO;
          let m = 1;
          for (let t2 = Fp.sqr(b); m < r; m++) {
            if (Fp.eql(t2, Fp.ONE))
              break;
            t2 = Fp.sqr(t2);
          }
          const ge = Fp.pow(g, _1n << BigInt(r - m - 1));
          g = Fp.sqr(ge);
          x = Fp.mul(x, ge);
          b = Fp.mul(b, g);
          r = m;
        }
        return x;
      };
    }
    function FpSqrt(P) {
      if (P % _4n === _3n) {
        const p1div4 = (P + _1n) / _4n;
        return function sqrt3mod4(Fp, n) {
          const root = Fp.pow(n, p1div4);
          if (!Fp.eql(Fp.sqr(root), n))
            throw new Error("Cannot find square root");
          return root;
        };
      }
      if (P % _8n === _5n) {
        const c1 = (P - _5n) / _8n;
        return function sqrt5mod8(Fp, n) {
          const n2 = Fp.mul(n, _2n);
          const v = Fp.pow(n2, c1);
          const nv = Fp.mul(n, v);
          const i = Fp.mul(Fp.mul(nv, _2n), v);
          const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
          if (!Fp.eql(Fp.sqr(root), n))
            throw new Error("Cannot find square root");
          return root;
        };
      }
      if (P % _16n === _9n) {
      }
      return tonelliShanks(P);
    }
    var isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n) === _1n;
    exports.isNegativeLE = isNegativeLE;
    var FIELD_FIELDS = [
      "create",
      "isValid",
      "is0",
      "neg",
      "inv",
      "sqrt",
      "sqr",
      "eql",
      "add",
      "sub",
      "mul",
      "pow",
      "div",
      "addN",
      "subN",
      "mulN",
      "sqrN"
    ];
    function validateField(field) {
      const initial = {
        ORDER: "bigint",
        MASK: "bigint",
        BYTES: "isSafeInteger",
        BITS: "isSafeInteger"
      };
      const opts = FIELD_FIELDS.reduce((map, val) => {
        map[val] = "function";
        return map;
      }, initial);
      return (0, utils_js_1.validateObject)(field, opts);
    }
    function FpPow(f, num, power) {
      if (power < _0n)
        throw new Error("invalid exponent, negatives unsupported");
      if (power === _0n)
        return f.ONE;
      if (power === _1n)
        return num;
      let p = f.ONE;
      let d = num;
      while (power > _0n) {
        if (power & _1n)
          p = f.mul(p, d);
        d = f.sqr(d);
        power >>= _1n;
      }
      return p;
    }
    function FpInvertBatch(f, nums) {
      const tmp = new Array(nums.length);
      const lastMultiplied = nums.reduce((acc, num, i) => {
        if (f.is0(num))
          return acc;
        tmp[i] = acc;
        return f.mul(acc, num);
      }, f.ONE);
      const inverted = f.inv(lastMultiplied);
      nums.reduceRight((acc, num, i) => {
        if (f.is0(num))
          return acc;
        tmp[i] = f.mul(acc, tmp[i]);
        return f.mul(acc, num);
      }, inverted);
      return tmp;
    }
    function FpDiv(f, lhs, rhs) {
      return f.mul(lhs, typeof rhs === "bigint" ? invert(rhs, f.ORDER) : f.inv(rhs));
    }
    function FpLegendre(order) {
      const legendreConst = (order - _1n) / _2n;
      return (f, x) => f.pow(x, legendreConst);
    }
    function FpIsSquare(f) {
      const legendre = FpLegendre(f.ORDER);
      return (x) => {
        const p = legendre(f, x);
        return f.eql(p, f.ZERO) || f.eql(p, f.ONE);
      };
    }
    function nLength(n, nBitLength) {
      const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
      const nByteLength = Math.ceil(_nBitLength / 8);
      return { nBitLength: _nBitLength, nByteLength };
    }
    function Field(ORDER, bitLen, isLE = false, redef = {}) {
      if (ORDER <= _0n)
        throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
      const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen);
      if (BYTES > 2048)
        throw new Error("invalid field: expected ORDER of <= 2048 bytes");
      let sqrtP;
      const f = Object.freeze({
        ORDER,
        BITS,
        BYTES,
        MASK: (0, utils_js_1.bitMask)(BITS),
        ZERO: _0n,
        ONE: _1n,
        create: (num) => mod(num, ORDER),
        isValid: (num) => {
          if (typeof num !== "bigint")
            throw new Error("invalid field element: expected bigint, got " + typeof num);
          return _0n <= num && num < ORDER;
        },
        is0: (num) => num === _0n,
        isOdd: (num) => (num & _1n) === _1n,
        neg: (num) => mod(-num, ORDER),
        eql: (lhs, rhs) => lhs === rhs,
        sqr: (num) => mod(num * num, ORDER),
        add: (lhs, rhs) => mod(lhs + rhs, ORDER),
        sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
        mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
        pow: (num, power) => FpPow(f, num, power),
        div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
        // Same as above, but doesn't normalize
        sqrN: (num) => num * num,
        addN: (lhs, rhs) => lhs + rhs,
        subN: (lhs, rhs) => lhs - rhs,
        mulN: (lhs, rhs) => lhs * rhs,
        inv: (num) => invert(num, ORDER),
        sqrt: redef.sqrt || ((n) => {
          if (!sqrtP)
            sqrtP = FpSqrt(ORDER);
          return sqrtP(f, n);
        }),
        invertBatch: (lst) => FpInvertBatch(f, lst),
        // TODO: do we really need constant cmov?
        // We don't have const-time bigints anyway, so probably will be not very useful
        cmov: (a, b, c) => c ? b : a,
        toBytes: (num) => isLE ? (0, utils_js_1.numberToBytesLE)(num, BYTES) : (0, utils_js_1.numberToBytesBE)(num, BYTES),
        fromBytes: (bytes) => {
          if (bytes.length !== BYTES)
            throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
          return isLE ? (0, utils_js_1.bytesToNumberLE)(bytes) : (0, utils_js_1.bytesToNumberBE)(bytes);
        }
      });
      return Object.freeze(f);
    }
    function FpSqrtOdd(Fp, elm) {
      if (!Fp.isOdd)
        throw new Error("Field doesn't have isOdd");
      const root = Fp.sqrt(elm);
      return Fp.isOdd(root) ? root : Fp.neg(root);
    }
    function FpSqrtEven(Fp, elm) {
      if (!Fp.isOdd)
        throw new Error("Field doesn't have isOdd");
      const root = Fp.sqrt(elm);
      return Fp.isOdd(root) ? Fp.neg(root) : root;
    }
    function hashToPrivateScalar(hash, groupOrder, isLE = false) {
      hash = (0, utils_js_1.ensureBytes)("privateHash", hash);
      const hashLen = hash.length;
      const minLen = nLength(groupOrder).nByteLength + 8;
      if (minLen < 24 || hashLen < minLen || hashLen > 1024)
        throw new Error("hashToPrivateScalar: expected " + minLen + "-1024 bytes of input, got " + hashLen);
      const num = isLE ? (0, utils_js_1.bytesToNumberLE)(hash) : (0, utils_js_1.bytesToNumberBE)(hash);
      return mod(num, groupOrder - _1n) + _1n;
    }
    function getFieldBytesLength(fieldOrder) {
      if (typeof fieldOrder !== "bigint")
        throw new Error("field order must be bigint");
      const bitLength = fieldOrder.toString(2).length;
      return Math.ceil(bitLength / 8);
    }
    function getMinHashLength(fieldOrder) {
      const length = getFieldBytesLength(fieldOrder);
      return length + Math.ceil(length / 2);
    }
    function mapHashToField(key, fieldOrder, isLE = false) {
      const len = key.length;
      const fieldLen = getFieldBytesLength(fieldOrder);
      const minLen = getMinHashLength(fieldOrder);
      if (len < 16 || len < minLen || len > 1024)
        throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
      const num = isLE ? (0, utils_js_1.bytesToNumberBE)(key) : (0, utils_js_1.bytesToNumberLE)(key);
      const reduced = mod(num, fieldOrder - _1n) + _1n;
      return isLE ? (0, utils_js_1.numberToBytesLE)(reduced, fieldLen) : (0, utils_js_1.numberToBytesBE)(reduced, fieldLen);
    }
  }
});

// node_modules/viem/node_modules/@noble/curves/abstract/curve.js
var require_curve = __commonJS({
  "node_modules/viem/node_modules/@noble/curves/abstract/curve.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wNAF = wNAF;
    exports.pippenger = pippenger;
    exports.precomputeMSMUnsafe = precomputeMSMUnsafe;
    exports.validateBasic = validateBasic;
    var modular_js_1 = require_modular();
    var utils_js_1 = require_utils6();
    var _0n = BigInt(0);
    var _1n = BigInt(1);
    function constTimeNegate(condition, item) {
      const neg = item.negate();
      return condition ? neg : item;
    }
    function validateW(W, bits) {
      if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
        throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
    }
    function calcWOpts(W, bits) {
      validateW(W, bits);
      const windows = Math.ceil(bits / W) + 1;
      const windowSize = 2 ** (W - 1);
      return { windows, windowSize };
    }
    function validateMSMPoints(points, c) {
      if (!Array.isArray(points))
        throw new Error("array expected");
      points.forEach((p, i) => {
        if (!(p instanceof c))
          throw new Error("invalid point at index " + i);
      });
    }
    function validateMSMScalars(scalars, field) {
      if (!Array.isArray(scalars))
        throw new Error("array of scalars expected");
      scalars.forEach((s, i) => {
        if (!field.isValid(s))
          throw new Error("invalid scalar at index " + i);
      });
    }
    var pointPrecomputes = /* @__PURE__ */ new WeakMap();
    var pointWindowSizes = /* @__PURE__ */ new WeakMap();
    function getW(P) {
      return pointWindowSizes.get(P) || 1;
    }
    function wNAF(c, bits) {
      return {
        constTimeNegate,
        hasPrecomputes(elm) {
          return getW(elm) !== 1;
        },
        // non-const time multiplication ladder
        unsafeLadder(elm, n, p = c.ZERO) {
          let d = elm;
          while (n > _0n) {
            if (n & _1n)
              p = p.add(d);
            d = d.double();
            n >>= _1n;
          }
          return p;
        },
        /**
         * Creates a wNAF precomputation window. Used for caching.
         * Default window size is set by `utils.precompute()` and is equal to 8.
         * Number of precomputed points depends on the curve size:
         * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
         * - 𝑊 is the window size
         * - 𝑛 is the bitlength of the curve order.
         * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
         * @param elm Point instance
         * @param W window size
         * @returns precomputed point tables flattened to a single array
         */
        precomputeWindow(elm, W) {
          const { windows, windowSize } = calcWOpts(W, bits);
          const points = [];
          let p = elm;
          let base = p;
          for (let window2 = 0; window2 < windows; window2++) {
            base = p;
            points.push(base);
            for (let i = 1; i < windowSize; i++) {
              base = base.add(p);
              points.push(base);
            }
            p = base.double();
          }
          return points;
        },
        /**
         * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
         * @param W window size
         * @param precomputes precomputed tables
         * @param n scalar (we don't check here, but should be less than curve order)
         * @returns real and fake (for const-time) points
         */
        wNAF(W, precomputes, n) {
          const { windows, windowSize } = calcWOpts(W, bits);
          let p = c.ZERO;
          let f = c.BASE;
          const mask = BigInt(2 ** W - 1);
          const maxNumber = 2 ** W;
          const shiftBy = BigInt(W);
          for (let window2 = 0; window2 < windows; window2++) {
            const offset = window2 * windowSize;
            let wbits = Number(n & mask);
            n >>= shiftBy;
            if (wbits > windowSize) {
              wbits -= maxNumber;
              n += _1n;
            }
            const offset1 = offset;
            const offset2 = offset + Math.abs(wbits) - 1;
            const cond1 = window2 % 2 !== 0;
            const cond2 = wbits < 0;
            if (wbits === 0) {
              f = f.add(constTimeNegate(cond1, precomputes[offset1]));
            } else {
              p = p.add(constTimeNegate(cond2, precomputes[offset2]));
            }
          }
          return { p, f };
        },
        /**
         * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
         * @param W window size
         * @param precomputes precomputed tables
         * @param n scalar (we don't check here, but should be less than curve order)
         * @param acc accumulator point to add result of multiplication
         * @returns point
         */
        wNAFUnsafe(W, precomputes, n, acc = c.ZERO) {
          const { windows, windowSize } = calcWOpts(W, bits);
          const mask = BigInt(2 ** W - 1);
          const maxNumber = 2 ** W;
          const shiftBy = BigInt(W);
          for (let window2 = 0; window2 < windows; window2++) {
            const offset = window2 * windowSize;
            if (n === _0n)
              break;
            let wbits = Number(n & mask);
            n >>= shiftBy;
            if (wbits > windowSize) {
              wbits -= maxNumber;
              n += _1n;
            }
            if (wbits === 0)
              continue;
            let curr = precomputes[offset + Math.abs(wbits) - 1];
            if (wbits < 0)
              curr = curr.negate();
            acc = acc.add(curr);
          }
          return acc;
        },
        getPrecomputes(W, P, transform) {
          let comp = pointPrecomputes.get(P);
          if (!comp) {
            comp = this.precomputeWindow(P, W);
            if (W !== 1)
              pointPrecomputes.set(P, transform(comp));
          }
          return comp;
        },
        wNAFCached(P, n, transform) {
          const W = getW(P);
          return this.wNAF(W, this.getPrecomputes(W, P, transform), n);
        },
        wNAFCachedUnsafe(P, n, transform, prev) {
          const W = getW(P);
          if (W === 1)
            return this.unsafeLadder(P, n, prev);
          return this.wNAFUnsafe(W, this.getPrecomputes(W, P, transform), n, prev);
        },
        // We calculate precomputes for elliptic curve point multiplication
        // using windowed method. This specifies window size and
        // stores precomputed values. Usually only base point would be precomputed.
        setWindowSize(P, W) {
          validateW(W, bits);
          pointWindowSizes.set(P, W);
          pointPrecomputes.delete(P);
        }
      };
    }
    function pippenger(c, fieldN, points, scalars) {
      validateMSMPoints(points, c);
      validateMSMScalars(scalars, fieldN);
      if (points.length !== scalars.length)
        throw new Error("arrays of points and scalars must have equal length");
      const zero = c.ZERO;
      const wbits = (0, utils_js_1.bitLen)(BigInt(points.length));
      const windowSize = wbits > 12 ? wbits - 3 : wbits > 4 ? wbits - 2 : wbits ? 2 : 1;
      const MASK = (1 << windowSize) - 1;
      const buckets = new Array(MASK + 1).fill(zero);
      const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
      let sum = zero;
      for (let i = lastBits; i >= 0; i -= windowSize) {
        buckets.fill(zero);
        for (let j = 0; j < scalars.length; j++) {
          const scalar = scalars[j];
          const wbits2 = Number(scalar >> BigInt(i) & BigInt(MASK));
          buckets[wbits2] = buckets[wbits2].add(points[j]);
        }
        let resI = zero;
        for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
          sumI = sumI.add(buckets[j]);
          resI = resI.add(sumI);
        }
        sum = sum.add(resI);
        if (i !== 0)
          for (let j = 0; j < windowSize; j++)
            sum = sum.double();
      }
      return sum;
    }
    function precomputeMSMUnsafe(c, fieldN, points, windowSize) {
      validateW(windowSize, fieldN.BITS);
      validateMSMPoints(points, c);
      const zero = c.ZERO;
      const tableSize = 2 ** windowSize - 1;
      const chunks = Math.ceil(fieldN.BITS / windowSize);
      const MASK = BigInt((1 << windowSize) - 1);
      const tables = points.map((p) => {
        const res = [];
        for (let i = 0, acc = p; i < tableSize; i++) {
          res.push(acc);
          acc = acc.add(p);
        }
        return res;
      });
      return (scalars) => {
        validateMSMScalars(scalars, fieldN);
        if (scalars.length > points.length)
          throw new Error("array of scalars must be smaller than array of points");
        let res = zero;
        for (let i = 0; i < chunks; i++) {
          if (res !== zero)
            for (let j = 0; j < windowSize; j++)
              res = res.double();
          const shiftBy = BigInt(chunks * windowSize - (i + 1) * windowSize);
          for (let j = 0; j < scalars.length; j++) {
            const n = scalars[j];
            const curr = Number(n >> shiftBy & MASK);
            if (!curr)
              continue;
            res = res.add(tables[j][curr - 1]);
          }
        }
        return res;
      };
    }
    function validateBasic(curve) {
      (0, modular_js_1.validateField)(curve.Fp);
      (0, utils_js_1.validateObject)(curve, {
        n: "bigint",
        h: "bigint",
        Gx: "field",
        Gy: "field"
      }, {
        nBitLength: "isSafeInteger",
        nByteLength: "isSafeInteger"
      });
      return Object.freeze({
        ...(0, modular_js_1.nLength)(curve.n, curve.nBitLength),
        ...curve,
        ...{ p: curve.Fp.ORDER }
      });
    }
  }
});

// node_modules/viem/node_modules/@noble/curves/abstract/weierstrass.js
var require_weierstrass = __commonJS({
  "node_modules/viem/node_modules/@noble/curves/abstract/weierstrass.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DER = void 0;
    exports.weierstrassPoints = weierstrassPoints;
    exports.weierstrass = weierstrass;
    exports.SWUFpSqrtRatio = SWUFpSqrtRatio;
    exports.mapToCurveSimpleSWU = mapToCurveSimpleSWU;
    var curve_js_1 = require_curve();
    var mod = require_modular();
    var ut = require_utils6();
    var utils_js_1 = require_utils6();
    function validateSigVerOpts(opts) {
      if (opts.lowS !== void 0)
        (0, utils_js_1.abool)("lowS", opts.lowS);
      if (opts.prehash !== void 0)
        (0, utils_js_1.abool)("prehash", opts.prehash);
    }
    function validatePointOpts(curve) {
      const opts = (0, curve_js_1.validateBasic)(curve);
      ut.validateObject(opts, {
        a: "field",
        b: "field"
      }, {
        allowedPrivateKeyLengths: "array",
        wrapPrivateKey: "boolean",
        isTorsionFree: "function",
        clearCofactor: "function",
        allowInfinityPoint: "boolean",
        fromBytes: "function",
        toBytes: "function"
      });
      const { endo, Fp, a } = opts;
      if (endo) {
        if (!Fp.eql(a, Fp.ZERO)) {
          throw new Error("invalid endomorphism, can only be defined for Koblitz curves that have a=0");
        }
        if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
          throw new Error("invalid endomorphism, expected beta: bigint and splitScalar: function");
        }
      }
      return Object.freeze({ ...opts });
    }
    var { bytesToNumberBE: b2n, hexToBytes: h2b } = ut;
    exports.DER = {
      // asn.1 DER encoding utils
      Err: class DERErr extends Error {
        constructor(m = "") {
          super(m);
        }
      },
      // Basic building block is TLV (Tag-Length-Value)
      _tlv: {
        encode: (tag, data) => {
          const { Err: E } = exports.DER;
          if (tag < 0 || tag > 256)
            throw new E("tlv.encode: wrong tag");
          if (data.length & 1)
            throw new E("tlv.encode: unpadded data");
          const dataLen = data.length / 2;
          const len = ut.numberToHexUnpadded(dataLen);
          if (len.length / 2 & 128)
            throw new E("tlv.encode: long form length too big");
          const lenLen = dataLen > 127 ? ut.numberToHexUnpadded(len.length / 2 | 128) : "";
          const t = ut.numberToHexUnpadded(tag);
          return t + lenLen + len + data;
        },
        // v - value, l - left bytes (unparsed)
        decode(tag, data) {
          const { Err: E } = exports.DER;
          let pos = 0;
          if (tag < 0 || tag > 256)
            throw new E("tlv.encode: wrong tag");
          if (data.length < 2 || data[pos++] !== tag)
            throw new E("tlv.decode: wrong tlv");
          const first = data[pos++];
          const isLong = !!(first & 128);
          let length = 0;
          if (!isLong)
            length = first;
          else {
            const lenLen = first & 127;
            if (!lenLen)
              throw new E("tlv.decode(long): indefinite length not supported");
            if (lenLen > 4)
              throw new E("tlv.decode(long): byte length is too big");
            const lengthBytes = data.subarray(pos, pos + lenLen);
            if (lengthBytes.length !== lenLen)
              throw new E("tlv.decode: length bytes not complete");
            if (lengthBytes[0] === 0)
              throw new E("tlv.decode(long): zero leftmost byte");
            for (const b of lengthBytes)
              length = length << 8 | b;
            pos += lenLen;
            if (length < 128)
              throw new E("tlv.decode(long): not minimal encoding");
          }
          const v = data.subarray(pos, pos + length);
          if (v.length !== length)
            throw new E("tlv.decode: wrong value length");
          return { v, l: data.subarray(pos + length) };
        }
      },
      // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
      // since we always use positive integers here. It must always be empty:
      // - add zero byte if exists
      // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
      _int: {
        encode(num) {
          const { Err: E } = exports.DER;
          if (num < _0n)
            throw new E("integer: negative integers are not allowed");
          let hex = ut.numberToHexUnpadded(num);
          if (Number.parseInt(hex[0], 16) & 8)
            hex = "00" + hex;
          if (hex.length & 1)
            throw new E("unexpected DER parsing assertion: unpadded hex");
          return hex;
        },
        decode(data) {
          const { Err: E } = exports.DER;
          if (data[0] & 128)
            throw new E("invalid signature integer: negative");
          if (data[0] === 0 && !(data[1] & 128))
            throw new E("invalid signature integer: unnecessary leading zero");
          return b2n(data);
        }
      },
      toSig(hex) {
        const { Err: E, _int: int, _tlv: tlv } = exports.DER;
        const data = typeof hex === "string" ? h2b(hex) : hex;
        ut.abytes(data);
        const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
        if (seqLeftBytes.length)
          throw new E("invalid signature: left bytes after parsing");
        const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
        const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
        if (sLeftBytes.length)
          throw new E("invalid signature: left bytes after parsing");
        return { r: int.decode(rBytes), s: int.decode(sBytes) };
      },
      hexFromSig(sig) {
        const { _tlv: tlv, _int: int } = exports.DER;
        const rs = tlv.encode(2, int.encode(sig.r));
        const ss = tlv.encode(2, int.encode(sig.s));
        const seq = rs + ss;
        return tlv.encode(48, seq);
      }
    };
    var _0n = BigInt(0);
    var _1n = BigInt(1);
    var _2n = BigInt(2);
    var _3n = BigInt(3);
    var _4n = BigInt(4);
    function weierstrassPoints(opts) {
      const CURVE = validatePointOpts(opts);
      const { Fp } = CURVE;
      const Fn = mod.Field(CURVE.n, CURVE.nBitLength);
      const toBytes = CURVE.toBytes || ((_c, point, _isCompressed) => {
        const a = point.toAffine();
        return ut.concatBytes(Uint8Array.from([4]), Fp.toBytes(a.x), Fp.toBytes(a.y));
      });
      const fromBytes = CURVE.fromBytes || ((bytes) => {
        const tail = bytes.subarray(1);
        const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
        const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
        return { x, y };
      });
      function weierstrassEquation(x) {
        const { a, b } = CURVE;
        const x2 = Fp.sqr(x);
        const x3 = Fp.mul(x2, x);
        return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
      }
      if (!Fp.eql(Fp.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx)))
        throw new Error("bad generator point: equation left != right");
      function isWithinCurveOrder(num) {
        return ut.inRange(num, _1n, CURVE.n);
      }
      function normPrivateKeyToScalar(key) {
        const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N } = CURVE;
        if (lengths && typeof key !== "bigint") {
          if (ut.isBytes(key))
            key = ut.bytesToHex(key);
          if (typeof key !== "string" || !lengths.includes(key.length))
            throw new Error("invalid private key");
          key = key.padStart(nByteLength * 2, "0");
        }
        let num;
        try {
          num = typeof key === "bigint" ? key : ut.bytesToNumberBE((0, utils_js_1.ensureBytes)("private key", key, nByteLength));
        } catch (error) {
          throw new Error("invalid private key, expected hex or " + nByteLength + " bytes, got " + typeof key);
        }
        if (wrapPrivateKey)
          num = mod.mod(num, N);
        ut.aInRange("private key", num, _1n, N);
        return num;
      }
      function assertPrjPoint(other) {
        if (!(other instanceof Point))
          throw new Error("ProjectivePoint expected");
      }
      const toAffineMemo = (0, utils_js_1.memoized)((p, iz) => {
        const { px: x, py: y, pz: z } = p;
        if (Fp.eql(z, Fp.ONE))
          return { x, y };
        const is0 = p.is0();
        if (iz == null)
          iz = is0 ? Fp.ONE : Fp.inv(z);
        const ax = Fp.mul(x, iz);
        const ay = Fp.mul(y, iz);
        const zz = Fp.mul(z, iz);
        if (is0)
          return { x: Fp.ZERO, y: Fp.ZERO };
        if (!Fp.eql(zz, Fp.ONE))
          throw new Error("invZ was invalid");
        return { x: ax, y: ay };
      });
      const assertValidMemo = (0, utils_js_1.memoized)((p) => {
        if (p.is0()) {
          if (CURVE.allowInfinityPoint && !Fp.is0(p.py))
            return;
          throw new Error("bad point: ZERO");
        }
        const { x, y } = p.toAffine();
        if (!Fp.isValid(x) || !Fp.isValid(y))
          throw new Error("bad point: x or y not FE");
        const left = Fp.sqr(y);
        const right = weierstrassEquation(x);
        if (!Fp.eql(left, right))
          throw new Error("bad point: equation left != right");
        if (!p.isTorsionFree())
          throw new Error("bad point: not in prime-order subgroup");
        return true;
      });
      class Point {
        constructor(px, py, pz) {
          this.px = px;
          this.py = py;
          this.pz = pz;
          if (px == null || !Fp.isValid(px))
            throw new Error("x required");
          if (py == null || !Fp.isValid(py))
            throw new Error("y required");
          if (pz == null || !Fp.isValid(pz))
            throw new Error("z required");
          Object.freeze(this);
        }
        // Does not validate if the point is on-curve.
        // Use fromHex instead, or call assertValidity() later.
        static fromAffine(p) {
          const { x, y } = p || {};
          if (!p || !Fp.isValid(x) || !Fp.isValid(y))
            throw new Error("invalid affine point");
          if (p instanceof Point)
            throw new Error("projective point not allowed");
          const is0 = (i) => Fp.eql(i, Fp.ZERO);
          if (is0(x) && is0(y))
            return Point.ZERO;
          return new Point(x, y, Fp.ONE);
        }
        get x() {
          return this.toAffine().x;
        }
        get y() {
          return this.toAffine().y;
        }
        /**
         * Takes a bunch of Projective Points but executes only one
         * inversion on all of them. Inversion is very slow operation,
         * so this improves performance massively.
         * Optimization: converts a list of projective points to a list of identical points with Z=1.
         */
        static normalizeZ(points) {
          const toInv = Fp.invertBatch(points.map((p) => p.pz));
          return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
        }
        /**
         * Converts hash string or Uint8Array to Point.
         * @param hex short/long ECDSA hex
         */
        static fromHex(hex) {
          const P = Point.fromAffine(fromBytes((0, utils_js_1.ensureBytes)("pointHex", hex)));
          P.assertValidity();
          return P;
        }
        // Multiplies generator point by privateKey.
        static fromPrivateKey(privateKey) {
          return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
        }
        // Multiscalar Multiplication
        static msm(points, scalars) {
          return (0, curve_js_1.pippenger)(Point, Fn, points, scalars);
        }
        // "Private method", don't use it directly
        _setWindowSize(windowSize) {
          wnaf.setWindowSize(this, windowSize);
        }
        // A point on curve is valid if it conforms to equation.
        assertValidity() {
          assertValidMemo(this);
        }
        hasEvenY() {
          const { y } = this.toAffine();
          if (Fp.isOdd)
            return !Fp.isOdd(y);
          throw new Error("Field doesn't support isOdd");
        }
        /**
         * Compare one point to another.
         */
        equals(other) {
          assertPrjPoint(other);
          const { px: X1, py: Y1, pz: Z1 } = this;
          const { px: X2, py: Y2, pz: Z2 } = other;
          const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
          const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
          return U1 && U2;
        }
        /**
         * Flips point to one corresponding to (x, -y) in Affine coordinates.
         */
        negate() {
          return new Point(this.px, Fp.neg(this.py), this.pz);
        }
        // Renes-Costello-Batina exception-free doubling formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 3
        // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
        double() {
          const { a, b } = CURVE;
          const b3 = Fp.mul(b, _3n);
          const { px: X1, py: Y1, pz: Z1 } = this;
          let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
          let t0 = Fp.mul(X1, X1);
          let t1 = Fp.mul(Y1, Y1);
          let t2 = Fp.mul(Z1, Z1);
          let t3 = Fp.mul(X1, Y1);
          t3 = Fp.add(t3, t3);
          Z3 = Fp.mul(X1, Z1);
          Z3 = Fp.add(Z3, Z3);
          X3 = Fp.mul(a, Z3);
          Y3 = Fp.mul(b3, t2);
          Y3 = Fp.add(X3, Y3);
          X3 = Fp.sub(t1, Y3);
          Y3 = Fp.add(t1, Y3);
          Y3 = Fp.mul(X3, Y3);
          X3 = Fp.mul(t3, X3);
          Z3 = Fp.mul(b3, Z3);
          t2 = Fp.mul(a, t2);
          t3 = Fp.sub(t0, t2);
          t3 = Fp.mul(a, t3);
          t3 = Fp.add(t3, Z3);
          Z3 = Fp.add(t0, t0);
          t0 = Fp.add(Z3, t0);
          t0 = Fp.add(t0, t2);
          t0 = Fp.mul(t0, t3);
          Y3 = Fp.add(Y3, t0);
          t2 = Fp.mul(Y1, Z1);
          t2 = Fp.add(t2, t2);
          t0 = Fp.mul(t2, t3);
          X3 = Fp.sub(X3, t0);
          Z3 = Fp.mul(t2, t1);
          Z3 = Fp.add(Z3, Z3);
          Z3 = Fp.add(Z3, Z3);
          return new Point(X3, Y3, Z3);
        }
        // Renes-Costello-Batina exception-free addition formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 1
        // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
        add(other) {
          assertPrjPoint(other);
          const { px: X1, py: Y1, pz: Z1 } = this;
          const { px: X2, py: Y2, pz: Z2 } = other;
          let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
          const a = CURVE.a;
          const b3 = Fp.mul(CURVE.b, _3n);
          let t0 = Fp.mul(X1, X2);
          let t1 = Fp.mul(Y1, Y2);
          let t2 = Fp.mul(Z1, Z2);
          let t3 = Fp.add(X1, Y1);
          let t4 = Fp.add(X2, Y2);
          t3 = Fp.mul(t3, t4);
          t4 = Fp.add(t0, t1);
          t3 = Fp.sub(t3, t4);
          t4 = Fp.add(X1, Z1);
          let t5 = Fp.add(X2, Z2);
          t4 = Fp.mul(t4, t5);
          t5 = Fp.add(t0, t2);
          t4 = Fp.sub(t4, t5);
          t5 = Fp.add(Y1, Z1);
          X3 = Fp.add(Y2, Z2);
          t5 = Fp.mul(t5, X3);
          X3 = Fp.add(t1, t2);
          t5 = Fp.sub(t5, X3);
          Z3 = Fp.mul(a, t4);
          X3 = Fp.mul(b3, t2);
          Z3 = Fp.add(X3, Z3);
          X3 = Fp.sub(t1, Z3);
          Z3 = Fp.add(t1, Z3);
          Y3 = Fp.mul(X3, Z3);
          t1 = Fp.add(t0, t0);
          t1 = Fp.add(t1, t0);
          t2 = Fp.mul(a, t2);
          t4 = Fp.mul(b3, t4);
          t1 = Fp.add(t1, t2);
          t2 = Fp.sub(t0, t2);
          t2 = Fp.mul(a, t2);
          t4 = Fp.add(t4, t2);
          t0 = Fp.mul(t1, t4);
          Y3 = Fp.add(Y3, t0);
          t0 = Fp.mul(t5, t4);
          X3 = Fp.mul(t3, X3);
          X3 = Fp.sub(X3, t0);
          t0 = Fp.mul(t3, t1);
          Z3 = Fp.mul(t5, Z3);
          Z3 = Fp.add(Z3, t0);
          return new Point(X3, Y3, Z3);
        }
        subtract(other) {
          return this.add(other.negate());
        }
        is0() {
          return this.equals(Point.ZERO);
        }
        wNAF(n) {
          return wnaf.wNAFCached(this, n, Point.normalizeZ);
        }
        /**
         * Non-constant-time multiplication. Uses double-and-add algorithm.
         * It's faster, but should only be used when you don't care about
         * an exposed private key e.g. sig verification, which works over *public* keys.
         */
        multiplyUnsafe(sc) {
          const { endo, n: N } = CURVE;
          ut.aInRange("scalar", sc, _0n, N);
          const I = Point.ZERO;
          if (sc === _0n)
            return I;
          if (this.is0() || sc === _1n)
            return this;
          if (!endo || wnaf.hasPrecomputes(this))
            return wnaf.wNAFCachedUnsafe(this, sc, Point.normalizeZ);
          let { k1neg, k1, k2neg, k2 } = endo.splitScalar(sc);
          let k1p = I;
          let k2p = I;
          let d = this;
          while (k1 > _0n || k2 > _0n) {
            if (k1 & _1n)
              k1p = k1p.add(d);
            if (k2 & _1n)
              k2p = k2p.add(d);
            d = d.double();
            k1 >>= _1n;
            k2 >>= _1n;
          }
          if (k1neg)
            k1p = k1p.negate();
          if (k2neg)
            k2p = k2p.negate();
          k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
          return k1p.add(k2p);
        }
        /**
         * Constant time multiplication.
         * Uses wNAF method. Windowed method may be 10% faster,
         * but takes 2x longer to generate and consumes 2x memory.
         * Uses precomputes when available.
         * Uses endomorphism for Koblitz curves.
         * @param scalar by which the point would be multiplied
         * @returns New point
         */
        multiply(scalar) {
          const { endo, n: N } = CURVE;
          ut.aInRange("scalar", scalar, _1n, N);
          let point, fake;
          if (endo) {
            const { k1neg, k1, k2neg, k2 } = endo.splitScalar(scalar);
            let { p: k1p, f: f1p } = this.wNAF(k1);
            let { p: k2p, f: f2p } = this.wNAF(k2);
            k1p = wnaf.constTimeNegate(k1neg, k1p);
            k2p = wnaf.constTimeNegate(k2neg, k2p);
            k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
            point = k1p.add(k2p);
            fake = f1p.add(f2p);
          } else {
            const { p, f } = this.wNAF(scalar);
            point = p;
            fake = f;
          }
          return Point.normalizeZ([point, fake])[0];
        }
        /**
         * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
         * Not using Strauss-Shamir trick: precomputation tables are faster.
         * The trick could be useful if both P and Q are not G (not in our case).
         * @returns non-zero affine point
         */
        multiplyAndAddUnsafe(Q, a, b) {
          const G = Point.BASE;
          const mul = (P, a2) => a2 === _0n || a2 === _1n || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2);
          const sum = mul(this, a).add(mul(Q, b));
          return sum.is0() ? void 0 : sum;
        }
        // Converts Projective point to affine (x, y) coordinates.
        // Can accept precomputed Z^-1 - for example, from invertBatch.
        // (x, y, z) ∋ (x=x/z, y=y/z)
        toAffine(iz) {
          return toAffineMemo(this, iz);
        }
        isTorsionFree() {
          const { h: cofactor, isTorsionFree } = CURVE;
          if (cofactor === _1n)
            return true;
          if (isTorsionFree)
            return isTorsionFree(Point, this);
          throw new Error("isTorsionFree() has not been declared for the elliptic curve");
        }
        clearCofactor() {
          const { h: cofactor, clearCofactor } = CURVE;
          if (cofactor === _1n)
            return this;
          if (clearCofactor)
            return clearCofactor(Point, this);
          return this.multiplyUnsafe(CURVE.h);
        }
        toRawBytes(isCompressed = true) {
          (0, utils_js_1.abool)("isCompressed", isCompressed);
          this.assertValidity();
          return toBytes(Point, this, isCompressed);
        }
        toHex(isCompressed = true) {
          (0, utils_js_1.abool)("isCompressed", isCompressed);
          return ut.bytesToHex(this.toRawBytes(isCompressed));
        }
      }
      Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
      Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
      const _bits = CURVE.nBitLength;
      const wnaf = (0, curve_js_1.wNAF)(Point, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
      return {
        CURVE,
        ProjectivePoint: Point,
        normPrivateKeyToScalar,
        weierstrassEquation,
        isWithinCurveOrder
      };
    }
    function validateOpts(curve) {
      const opts = (0, curve_js_1.validateBasic)(curve);
      ut.validateObject(opts, {
        hash: "hash",
        hmac: "function",
        randomBytes: "function"
      }, {
        bits2int: "function",
        bits2int_modN: "function",
        lowS: "boolean"
      });
      return Object.freeze({ lowS: true, ...opts });
    }
    function weierstrass(curveDef) {
      const CURVE = validateOpts(curveDef);
      const { Fp, n: CURVE_ORDER } = CURVE;
      const compressedLen = Fp.BYTES + 1;
      const uncompressedLen = 2 * Fp.BYTES + 1;
      function modN(a) {
        return mod.mod(a, CURVE_ORDER);
      }
      function invN(a) {
        return mod.invert(a, CURVE_ORDER);
      }
      const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
        ...CURVE,
        toBytes(_c, point, isCompressed) {
          const a = point.toAffine();
          const x = Fp.toBytes(a.x);
          const cat = ut.concatBytes;
          (0, utils_js_1.abool)("isCompressed", isCompressed);
          if (isCompressed) {
            return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
          } else {
            return cat(Uint8Array.from([4]), x, Fp.toBytes(a.y));
          }
        },
        fromBytes(bytes) {
          const len = bytes.length;
          const head = bytes[0];
          const tail = bytes.subarray(1);
          if (len === compressedLen && (head === 2 || head === 3)) {
            const x = ut.bytesToNumberBE(tail);
            if (!ut.inRange(x, _1n, Fp.ORDER))
              throw new Error("Point is not on curve");
            const y2 = weierstrassEquation(x);
            let y;
            try {
              y = Fp.sqrt(y2);
            } catch (sqrtError) {
              const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
              throw new Error("Point is not on curve" + suffix);
            }
            const isYOdd = (y & _1n) === _1n;
            const isHeadOdd = (head & 1) === 1;
            if (isHeadOdd !== isYOdd)
              y = Fp.neg(y);
            return { x, y };
          } else if (len === uncompressedLen && head === 4) {
            const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
            const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
            return { x, y };
          } else {
            const cl = compressedLen;
            const ul = uncompressedLen;
            throw new Error("invalid Point, expected length of " + cl + ", or uncompressed " + ul + ", got " + len);
          }
        }
      });
      const numToNByteStr = (num) => ut.bytesToHex(ut.numberToBytesBE(num, CURVE.nByteLength));
      function isBiggerThanHalfOrder(number) {
        const HALF = CURVE_ORDER >> _1n;
        return number > HALF;
      }
      function normalizeS(s) {
        return isBiggerThanHalfOrder(s) ? modN(-s) : s;
      }
      const slcNum = (b, from, to) => ut.bytesToNumberBE(b.slice(from, to));
      class Signature {
        constructor(r, s, recovery) {
          this.r = r;
          this.s = s;
          this.recovery = recovery;
          this.assertValidity();
        }
        // pair (bytes of r, bytes of s)
        static fromCompact(hex) {
          const l = CURVE.nByteLength;
          hex = (0, utils_js_1.ensureBytes)("compactSignature", hex, l * 2);
          return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
        }
        // DER encoded ECDSA signature
        // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
        static fromDER(hex) {
          const { r, s } = exports.DER.toSig((0, utils_js_1.ensureBytes)("DER", hex));
          return new Signature(r, s);
        }
        assertValidity() {
          ut.aInRange("r", this.r, _1n, CURVE_ORDER);
          ut.aInRange("s", this.s, _1n, CURVE_ORDER);
        }
        addRecoveryBit(recovery) {
          return new Signature(this.r, this.s, recovery);
        }
        recoverPublicKey(msgHash) {
          const { r, s, recovery: rec } = this;
          const h = bits2int_modN((0, utils_js_1.ensureBytes)("msgHash", msgHash));
          if (rec == null || ![0, 1, 2, 3].includes(rec))
            throw new Error("recovery id invalid");
          const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
          if (radj >= Fp.ORDER)
            throw new Error("recovery id 2 or 3 invalid");
          const prefix = (rec & 1) === 0 ? "02" : "03";
          const R = Point.fromHex(prefix + numToNByteStr(radj));
          const ir = invN(radj);
          const u1 = modN(-h * ir);
          const u2 = modN(s * ir);
          const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
          if (!Q)
            throw new Error("point at infinify");
          Q.assertValidity();
          return Q;
        }
        // Signatures should be low-s, to prevent malleability.
        hasHighS() {
          return isBiggerThanHalfOrder(this.s);
        }
        normalizeS() {
          return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
        }
        // DER-encoded
        toDERRawBytes() {
          return ut.hexToBytes(this.toDERHex());
        }
        toDERHex() {
          return exports.DER.hexFromSig({ r: this.r, s: this.s });
        }
        // padded bytes of r, then padded bytes of s
        toCompactRawBytes() {
          return ut.hexToBytes(this.toCompactHex());
        }
        toCompactHex() {
          return numToNByteStr(this.r) + numToNByteStr(this.s);
        }
      }
      const utils = {
        isValidPrivateKey(privateKey) {
          try {
            normPrivateKeyToScalar(privateKey);
            return true;
          } catch (error) {
            return false;
          }
        },
        normPrivateKeyToScalar,
        /**
         * Produces cryptographically secure private key from random of size
         * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
         */
        randomPrivateKey: () => {
          const length = mod.getMinHashLength(CURVE.n);
          return mod.mapHashToField(CURVE.randomBytes(length), CURVE.n);
        },
        /**
         * Creates precompute table for an arbitrary EC point. Makes point "cached".
         * Allows to massively speed-up `point.multiply(scalar)`.
         * @returns cached point
         * @example
         * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
         * fast.multiply(privKey); // much faster ECDH now
         */
        precompute(windowSize = 8, point = Point.BASE) {
          point._setWindowSize(windowSize);
          point.multiply(BigInt(3));
          return point;
        }
      };
      function getPublicKey(privateKey, isCompressed = true) {
        return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
      }
      function isProbPub(item) {
        const arr = ut.isBytes(item);
        const str = typeof item === "string";
        const len = (arr || str) && item.length;
        if (arr)
          return len === compressedLen || len === uncompressedLen;
        if (str)
          return len === 2 * compressedLen || len === 2 * uncompressedLen;
        if (item instanceof Point)
          return true;
        return false;
      }
      function getSharedSecret(privateA, publicB, isCompressed = true) {
        if (isProbPub(privateA))
          throw new Error("first arg must be private key");
        if (!isProbPub(publicB))
          throw new Error("second arg must be public key");
        const b = Point.fromHex(publicB);
        return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
      }
      const bits2int = CURVE.bits2int || function(bytes) {
        if (bytes.length > 8192)
          throw new Error("input is too large");
        const num = ut.bytesToNumberBE(bytes);
        const delta = bytes.length * 8 - CURVE.nBitLength;
        return delta > 0 ? num >> BigInt(delta) : num;
      };
      const bits2int_modN = CURVE.bits2int_modN || function(bytes) {
        return modN(bits2int(bytes));
      };
      const ORDER_MASK = ut.bitMask(CURVE.nBitLength);
      function int2octets(num) {
        ut.aInRange("num < 2^" + CURVE.nBitLength, num, _0n, ORDER_MASK);
        return ut.numberToBytesBE(num, CURVE.nByteLength);
      }
      function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
        if (["recovered", "canonical"].some((k) => k in opts))
          throw new Error("sign() legacy options not supported");
        const { hash, randomBytes } = CURVE;
        let { lowS, prehash, extraEntropy: ent } = opts;
        if (lowS == null)
          lowS = true;
        msgHash = (0, utils_js_1.ensureBytes)("msgHash", msgHash);
        validateSigVerOpts(opts);
        if (prehash)
          msgHash = (0, utils_js_1.ensureBytes)("prehashed msgHash", hash(msgHash));
        const h1int = bits2int_modN(msgHash);
        const d = normPrivateKeyToScalar(privateKey);
        const seedArgs = [int2octets(d), int2octets(h1int)];
        if (ent != null && ent !== false) {
          const e = ent === true ? randomBytes(Fp.BYTES) : ent;
          seedArgs.push((0, utils_js_1.ensureBytes)("extraEntropy", e));
        }
        const seed = ut.concatBytes(...seedArgs);
        const m = h1int;
        function k2sig(kBytes) {
          const k = bits2int(kBytes);
          if (!isWithinCurveOrder(k))
            return;
          const ik = invN(k);
          const q = Point.BASE.multiply(k).toAffine();
          const r = modN(q.x);
          if (r === _0n)
            return;
          const s = modN(ik * modN(m + r * d));
          if (s === _0n)
            return;
          let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n);
          let normS = s;
          if (lowS && isBiggerThanHalfOrder(s)) {
            normS = normalizeS(s);
            recovery ^= 1;
          }
          return new Signature(r, normS, recovery);
        }
        return { seed, k2sig };
      }
      const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
      const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
      function sign(msgHash, privKey, opts = defaultSigOpts) {
        const { seed, k2sig } = prepSig(msgHash, privKey, opts);
        const C = CURVE;
        const drbg = ut.createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
        return drbg(seed, k2sig);
      }
      Point.BASE._setWindowSize(8);
      function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
        var _a;
        const sg = signature;
        msgHash = (0, utils_js_1.ensureBytes)("msgHash", msgHash);
        publicKey = (0, utils_js_1.ensureBytes)("publicKey", publicKey);
        const { lowS, prehash, format } = opts;
        validateSigVerOpts(opts);
        if ("strict" in opts)
          throw new Error("options.strict was renamed to lowS");
        if (format !== void 0 && format !== "compact" && format !== "der")
          throw new Error("format must be compact or der");
        const isHex = typeof sg === "string" || ut.isBytes(sg);
        const isObj = !isHex && !format && typeof sg === "object" && sg !== null && typeof sg.r === "bigint" && typeof sg.s === "bigint";
        if (!isHex && !isObj)
          throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
        let _sig = void 0;
        let P;
        try {
          if (isObj)
            _sig = new Signature(sg.r, sg.s);
          if (isHex) {
            try {
              if (format !== "compact")
                _sig = Signature.fromDER(sg);
            } catch (derError) {
              if (!(derError instanceof exports.DER.Err))
                throw derError;
            }
            if (!_sig && format !== "der")
              _sig = Signature.fromCompact(sg);
          }
          P = Point.fromHex(publicKey);
        } catch (error) {
          return false;
        }
        if (!_sig)
          return false;
        if (lowS && _sig.hasHighS())
          return false;
        if (prehash)
          msgHash = CURVE.hash(msgHash);
        const { r, s } = _sig;
        const h = bits2int_modN(msgHash);
        const is = invN(s);
        const u1 = modN(h * is);
        const u2 = modN(r * is);
        const R = (_a = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)) == null ? void 0 : _a.toAffine();
        if (!R)
          return false;
        const v = modN(R.x);
        return v === r;
      }
      return {
        CURVE,
        getPublicKey,
        getSharedSecret,
        sign,
        verify,
        ProjectivePoint: Point,
        Signature,
        utils
      };
    }
    function SWUFpSqrtRatio(Fp, Z) {
      const q = Fp.ORDER;
      let l = _0n;
      for (let o = q - _1n; o % _2n === _0n; o /= _2n)
        l += _1n;
      const c1 = l;
      const _2n_pow_c1_1 = _2n << c1 - _1n - _1n;
      const _2n_pow_c1 = _2n_pow_c1_1 * _2n;
      const c2 = (q - _1n) / _2n_pow_c1;
      const c3 = (c2 - _1n) / _2n;
      const c4 = _2n_pow_c1 - _1n;
      const c5 = _2n_pow_c1_1;
      const c6 = Fp.pow(Z, c2);
      const c7 = Fp.pow(Z, (c2 + _1n) / _2n);
      let sqrtRatio = (u, v) => {
        let tv1 = c6;
        let tv2 = Fp.pow(v, c4);
        let tv3 = Fp.sqr(tv2);
        tv3 = Fp.mul(tv3, v);
        let tv5 = Fp.mul(u, tv3);
        tv5 = Fp.pow(tv5, c3);
        tv5 = Fp.mul(tv5, tv2);
        tv2 = Fp.mul(tv5, v);
        tv3 = Fp.mul(tv5, u);
        let tv4 = Fp.mul(tv3, tv2);
        tv5 = Fp.pow(tv4, c5);
        let isQR = Fp.eql(tv5, Fp.ONE);
        tv2 = Fp.mul(tv3, c7);
        tv5 = Fp.mul(tv4, tv1);
        tv3 = Fp.cmov(tv2, tv3, isQR);
        tv4 = Fp.cmov(tv5, tv4, isQR);
        for (let i = c1; i > _1n; i--) {
          let tv52 = i - _2n;
          tv52 = _2n << tv52 - _1n;
          let tvv5 = Fp.pow(tv4, tv52);
          const e1 = Fp.eql(tvv5, Fp.ONE);
          tv2 = Fp.mul(tv3, tv1);
          tv1 = Fp.mul(tv1, tv1);
          tvv5 = Fp.mul(tv4, tv1);
          tv3 = Fp.cmov(tv2, tv3, e1);
          tv4 = Fp.cmov(tvv5, tv4, e1);
        }
        return { isValid: isQR, value: tv3 };
      };
      if (Fp.ORDER % _4n === _3n) {
        const c12 = (Fp.ORDER - _3n) / _4n;
        const c22 = Fp.sqrt(Fp.neg(Z));
        sqrtRatio = (u, v) => {
          let tv1 = Fp.sqr(v);
          const tv2 = Fp.mul(u, v);
          tv1 = Fp.mul(tv1, tv2);
          let y1 = Fp.pow(tv1, c12);
          y1 = Fp.mul(y1, tv2);
          const y2 = Fp.mul(y1, c22);
          const tv3 = Fp.mul(Fp.sqr(y1), v);
          const isQR = Fp.eql(tv3, u);
          let y = Fp.cmov(y2, y1, isQR);
          return { isValid: isQR, value: y };
        };
      }
      return sqrtRatio;
    }
    function mapToCurveSimpleSWU(Fp, opts) {
      mod.validateField(Fp);
      if (!Fp.isValid(opts.A) || !Fp.isValid(opts.B) || !Fp.isValid(opts.Z))
        throw new Error("mapToCurveSimpleSWU: invalid opts");
      const sqrtRatio = SWUFpSqrtRatio(Fp, opts.Z);
      if (!Fp.isOdd)
        throw new Error("Fp.isOdd is not implemented!");
      return (u) => {
        let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
        tv1 = Fp.sqr(u);
        tv1 = Fp.mul(tv1, opts.Z);
        tv2 = Fp.sqr(tv1);
        tv2 = Fp.add(tv2, tv1);
        tv3 = Fp.add(tv2, Fp.ONE);
        tv3 = Fp.mul(tv3, opts.B);
        tv4 = Fp.cmov(opts.Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
        tv4 = Fp.mul(tv4, opts.A);
        tv2 = Fp.sqr(tv3);
        tv6 = Fp.sqr(tv4);
        tv5 = Fp.mul(tv6, opts.A);
        tv2 = Fp.add(tv2, tv5);
        tv2 = Fp.mul(tv2, tv3);
        tv6 = Fp.mul(tv6, tv4);
        tv5 = Fp.mul(tv6, opts.B);
        tv2 = Fp.add(tv2, tv5);
        x = Fp.mul(tv1, tv3);
        const { isValid, value } = sqrtRatio(tv2, tv6);
        y = Fp.mul(tv1, u);
        y = Fp.mul(y, value);
        x = Fp.cmov(x, tv3, isValid);
        y = Fp.cmov(y, value, isValid);
        const e1 = Fp.isOdd(u) === Fp.isOdd(y);
        y = Fp.cmov(Fp.neg(y), y, e1);
        x = Fp.div(x, tv4);
        return { x, y };
      };
    }
  }
});

// node_modules/viem/node_modules/@noble/curves/_shortw_utils.js
var require_shortw_utils = __commonJS({
  "node_modules/viem/node_modules/@noble/curves/_shortw_utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getHash = getHash;
    exports.createCurve = createCurve;
    var hmac_1 = require_hmac();
    var utils_1 = require_utils5();
    var weierstrass_js_1 = require_weierstrass();
    function getHash(hash) {
      return {
        hash,
        hmac: (key, ...msgs) => (0, hmac_1.hmac)(hash, key, (0, utils_1.concatBytes)(...msgs)),
        randomBytes: utils_1.randomBytes
      };
    }
    function createCurve(curveDef, defHash) {
      const create = (hash) => (0, weierstrass_js_1.weierstrass)({ ...curveDef, ...getHash(hash) });
      return Object.freeze({ ...create(defHash), create });
    }
  }
});

// node_modules/viem/node_modules/@noble/curves/abstract/hash-to-curve.js
var require_hash_to_curve = __commonJS({
  "node_modules/viem/node_modules/@noble/curves/abstract/hash-to-curve.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.expand_message_xmd = expand_message_xmd;
    exports.expand_message_xof = expand_message_xof;
    exports.hash_to_field = hash_to_field;
    exports.isogenyMap = isogenyMap;
    exports.createHasher = createHasher;
    var modular_js_1 = require_modular();
    var utils_js_1 = require_utils6();
    var os2ip = utils_js_1.bytesToNumberBE;
    function i2osp(value, length) {
      anum(value);
      anum(length);
      if (value < 0 || value >= 1 << 8 * length)
        throw new Error("invalid I2OSP input: " + value);
      const res = Array.from({ length }).fill(0);
      for (let i = length - 1; i >= 0; i--) {
        res[i] = value & 255;
        value >>>= 8;
      }
      return new Uint8Array(res);
    }
    function strxor(a, b) {
      const arr = new Uint8Array(a.length);
      for (let i = 0; i < a.length; i++) {
        arr[i] = a[i] ^ b[i];
      }
      return arr;
    }
    function anum(item) {
      if (!Number.isSafeInteger(item))
        throw new Error("number expected");
    }
    function expand_message_xmd(msg, DST, lenInBytes, H) {
      (0, utils_js_1.abytes)(msg);
      (0, utils_js_1.abytes)(DST);
      anum(lenInBytes);
      if (DST.length > 255)
        DST = H((0, utils_js_1.concatBytes)((0, utils_js_1.utf8ToBytes)("H2C-OVERSIZE-DST-"), DST));
      const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
      const ell = Math.ceil(lenInBytes / b_in_bytes);
      if (lenInBytes > 65535 || ell > 255)
        throw new Error("expand_message_xmd: invalid lenInBytes");
      const DST_prime = (0, utils_js_1.concatBytes)(DST, i2osp(DST.length, 1));
      const Z_pad = i2osp(0, r_in_bytes);
      const l_i_b_str = i2osp(lenInBytes, 2);
      const b = new Array(ell);
      const b_0 = H((0, utils_js_1.concatBytes)(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
      b[0] = H((0, utils_js_1.concatBytes)(b_0, i2osp(1, 1), DST_prime));
      for (let i = 1; i <= ell; i++) {
        const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
        b[i] = H((0, utils_js_1.concatBytes)(...args));
      }
      const pseudo_random_bytes = (0, utils_js_1.concatBytes)(...b);
      return pseudo_random_bytes.slice(0, lenInBytes);
    }
    function expand_message_xof(msg, DST, lenInBytes, k, H) {
      (0, utils_js_1.abytes)(msg);
      (0, utils_js_1.abytes)(DST);
      anum(lenInBytes);
      if (DST.length > 255) {
        const dkLen = Math.ceil(2 * k / 8);
        DST = H.create({ dkLen }).update((0, utils_js_1.utf8ToBytes)("H2C-OVERSIZE-DST-")).update(DST).digest();
      }
      if (lenInBytes > 65535 || DST.length > 255)
        throw new Error("expand_message_xof: invalid lenInBytes");
      return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
    }
    function hash_to_field(msg, count, options) {
      (0, utils_js_1.validateObject)(options, {
        DST: "stringOrUint8Array",
        p: "bigint",
        m: "isSafeInteger",
        k: "isSafeInteger",
        hash: "hash"
      });
      const { p, k, m, hash, expand, DST: _DST } = options;
      (0, utils_js_1.abytes)(msg);
      anum(count);
      const DST = typeof _DST === "string" ? (0, utils_js_1.utf8ToBytes)(_DST) : _DST;
      const log2p = p.toString(2).length;
      const L = Math.ceil((log2p + k) / 8);
      const len_in_bytes = count * m * L;
      let prb;
      if (expand === "xmd") {
        prb = expand_message_xmd(msg, DST, len_in_bytes, hash);
      } else if (expand === "xof") {
        prb = expand_message_xof(msg, DST, len_in_bytes, k, hash);
      } else if (expand === "_internal_pass") {
        prb = msg;
      } else {
        throw new Error('expand must be "xmd" or "xof"');
      }
      const u = new Array(count);
      for (let i = 0; i < count; i++) {
        const e = new Array(m);
        for (let j = 0; j < m; j++) {
          const elm_offset = L * (j + i * m);
          const tv = prb.subarray(elm_offset, elm_offset + L);
          e[j] = (0, modular_js_1.mod)(os2ip(tv), p);
        }
        u[i] = e;
      }
      return u;
    }
    function isogenyMap(field, map) {
      const COEFF = map.map((i) => Array.from(i).reverse());
      return (x, y) => {
        const [xNum, xDen, yNum, yDen] = COEFF.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
        x = field.div(xNum, xDen);
        y = field.mul(y, field.div(yNum, yDen));
        return { x, y };
      };
    }
    function createHasher(Point, mapToCurve, def) {
      if (typeof mapToCurve !== "function")
        throw new Error("mapToCurve() must be defined");
      return {
        // Encodes byte string to elliptic curve.
        // hash_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
        hashToCurve(msg, options) {
          const u = hash_to_field(msg, 2, { ...def, DST: def.DST, ...options });
          const u0 = Point.fromAffine(mapToCurve(u[0]));
          const u1 = Point.fromAffine(mapToCurve(u[1]));
          const P = u0.add(u1).clearCofactor();
          P.assertValidity();
          return P;
        },
        // Encodes byte string to elliptic curve.
        // encode_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
        encodeToCurve(msg, options) {
          const u = hash_to_field(msg, 1, { ...def, DST: def.encodeDST, ...options });
          const P = Point.fromAffine(mapToCurve(u[0])).clearCofactor();
          P.assertValidity();
          return P;
        },
        // Same as encodeToCurve, but without hash
        mapToCurve(scalars) {
          if (!Array.isArray(scalars))
            throw new Error("mapToCurve: expected array of bigints");
          for (const i of scalars)
            if (typeof i !== "bigint")
              throw new Error("mapToCurve: expected array of bigints");
          const P = Point.fromAffine(mapToCurve(scalars)).clearCofactor();
          P.assertValidity();
          return P;
        }
      };
    }
  }
});

// node_modules/viem/node_modules/@noble/curves/secp256k1.js
var require_secp256k1 = __commonJS({
  "node_modules/viem/node_modules/@noble/curves/secp256k1.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeToCurve = exports.hashToCurve = exports.schnorr = exports.secp256k1 = void 0;
    var sha256_1 = require_sha256();
    var utils_1 = require_utils5();
    var _shortw_utils_js_1 = require_shortw_utils();
    var hash_to_curve_js_1 = require_hash_to_curve();
    var modular_js_1 = require_modular();
    var utils_js_1 = require_utils6();
    var weierstrass_js_1 = require_weierstrass();
    var secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
    var secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
    var _1n = BigInt(1);
    var _2n = BigInt(2);
    var divNearest = (a, b) => (a + b / _2n) / b;
    function sqrtMod(y) {
      const P = secp256k1P;
      const _3n = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
      const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
      const b2 = y * y * y % P;
      const b3 = b2 * b2 * y % P;
      const b6 = (0, modular_js_1.pow2)(b3, _3n, P) * b3 % P;
      const b9 = (0, modular_js_1.pow2)(b6, _3n, P) * b3 % P;
      const b11 = (0, modular_js_1.pow2)(b9, _2n, P) * b2 % P;
      const b22 = (0, modular_js_1.pow2)(b11, _11n, P) * b11 % P;
      const b44 = (0, modular_js_1.pow2)(b22, _22n, P) * b22 % P;
      const b88 = (0, modular_js_1.pow2)(b44, _44n, P) * b44 % P;
      const b176 = (0, modular_js_1.pow2)(b88, _88n, P) * b88 % P;
      const b220 = (0, modular_js_1.pow2)(b176, _44n, P) * b44 % P;
      const b223 = (0, modular_js_1.pow2)(b220, _3n, P) * b3 % P;
      const t1 = (0, modular_js_1.pow2)(b223, _23n, P) * b22 % P;
      const t2 = (0, modular_js_1.pow2)(t1, _6n, P) * b2 % P;
      const root = (0, modular_js_1.pow2)(t2, _2n, P);
      if (!Fpk1.eql(Fpk1.sqr(root), y))
        throw new Error("Cannot find square root");
      return root;
    }
    var Fpk1 = (0, modular_js_1.Field)(secp256k1P, void 0, void 0, { sqrt: sqrtMod });
    exports.secp256k1 = (0, _shortw_utils_js_1.createCurve)({
      a: BigInt(0),
      // equation params: a, b
      b: BigInt(7),
      // Seem to be rigid: bitcointalk.org/index.php?topic=289795.msg3183975#msg3183975
      Fp: Fpk1,
      // Field's prime: 2n**256n - 2n**32n - 2n**9n - 2n**8n - 2n**7n - 2n**6n - 2n**4n - 1n
      n: secp256k1N,
      // Curve order, total count of valid points in the field
      // Base point (x, y) aka generator point
      Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
      Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
      h: BigInt(1),
      // Cofactor
      lowS: true,
      // Allow only low-S signatures by default in sign() and verify()
      /**
       * secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
       * Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
       * For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
       * Explanation: https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066
       */
      endo: {
        beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
        splitScalar: (k) => {
          const n = secp256k1N;
          const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
          const b1 = -_1n * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
          const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
          const b2 = a1;
          const POW_2_128 = BigInt("0x100000000000000000000000000000000");
          const c1 = divNearest(b2 * k, n);
          const c2 = divNearest(-b1 * k, n);
          let k1 = (0, modular_js_1.mod)(k - c1 * a1 - c2 * a2, n);
          let k2 = (0, modular_js_1.mod)(-c1 * b1 - c2 * b2, n);
          const k1neg = k1 > POW_2_128;
          const k2neg = k2 > POW_2_128;
          if (k1neg)
            k1 = n - k1;
          if (k2neg)
            k2 = n - k2;
          if (k1 > POW_2_128 || k2 > POW_2_128) {
            throw new Error("splitScalar: Endomorphism failed, k=" + k);
          }
          return { k1neg, k1, k2neg, k2 };
        }
      }
    }, sha256_1.sha256);
    var _0n = BigInt(0);
    var TAGGED_HASH_PREFIXES = {};
    function taggedHash(tag, ...messages) {
      let tagP = TAGGED_HASH_PREFIXES[tag];
      if (tagP === void 0) {
        const tagH = (0, sha256_1.sha256)(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
        tagP = (0, utils_js_1.concatBytes)(tagH, tagH);
        TAGGED_HASH_PREFIXES[tag] = tagP;
      }
      return (0, sha256_1.sha256)((0, utils_js_1.concatBytes)(tagP, ...messages));
    }
    var pointToBytes = (point) => point.toRawBytes(true).slice(1);
    var numTo32b = (n) => (0, utils_js_1.numberToBytesBE)(n, 32);
    var modP = (x) => (0, modular_js_1.mod)(x, secp256k1P);
    var modN = (x) => (0, modular_js_1.mod)(x, secp256k1N);
    var Point = exports.secp256k1.ProjectivePoint;
    var GmulAdd = (Q, a, b) => Point.BASE.multiplyAndAddUnsafe(Q, a, b);
    function schnorrGetExtPubKey(priv) {
      let d_ = exports.secp256k1.utils.normPrivateKeyToScalar(priv);
      let p = Point.fromPrivateKey(d_);
      const scalar = p.hasEvenY() ? d_ : modN(-d_);
      return { scalar, bytes: pointToBytes(p) };
    }
    function lift_x(x) {
      (0, utils_js_1.aInRange)("x", x, _1n, secp256k1P);
      const xx = modP(x * x);
      const c = modP(xx * x + BigInt(7));
      let y = sqrtMod(c);
      if (y % _2n !== _0n)
        y = modP(-y);
      const p = new Point(x, y, _1n);
      p.assertValidity();
      return p;
    }
    var num = utils_js_1.bytesToNumberBE;
    function challenge(...args) {
      return modN(num(taggedHash("BIP0340/challenge", ...args)));
    }
    function schnorrGetPublicKey(privateKey) {
      return schnorrGetExtPubKey(privateKey).bytes;
    }
    function schnorrSign(message, privateKey, auxRand = (0, utils_1.randomBytes)(32)) {
      const m = (0, utils_js_1.ensureBytes)("message", message);
      const { bytes: px, scalar: d } = schnorrGetExtPubKey(privateKey);
      const a = (0, utils_js_1.ensureBytes)("auxRand", auxRand, 32);
      const t = numTo32b(d ^ num(taggedHash("BIP0340/aux", a)));
      const rand = taggedHash("BIP0340/nonce", t, px, m);
      const k_ = modN(num(rand));
      if (k_ === _0n)
        throw new Error("sign failed: k is zero");
      const { bytes: rx, scalar: k } = schnorrGetExtPubKey(k_);
      const e = challenge(rx, px, m);
      const sig = new Uint8Array(64);
      sig.set(rx, 0);
      sig.set(numTo32b(modN(k + e * d)), 32);
      if (!schnorrVerify(sig, m, px))
        throw new Error("sign: Invalid signature produced");
      return sig;
    }
    function schnorrVerify(signature, message, publicKey) {
      const sig = (0, utils_js_1.ensureBytes)("signature", signature, 64);
      const m = (0, utils_js_1.ensureBytes)("message", message);
      const pub = (0, utils_js_1.ensureBytes)("publicKey", publicKey, 32);
      try {
        const P = lift_x(num(pub));
        const r = num(sig.subarray(0, 32));
        if (!(0, utils_js_1.inRange)(r, _1n, secp256k1P))
          return false;
        const s = num(sig.subarray(32, 64));
        if (!(0, utils_js_1.inRange)(s, _1n, secp256k1N))
          return false;
        const e = challenge(numTo32b(r), pointToBytes(P), m);
        const R = GmulAdd(P, s, modN(-e));
        if (!R || !R.hasEvenY() || R.toAffine().x !== r)
          return false;
        return true;
      } catch (error) {
        return false;
      }
    }
    exports.schnorr = (() => ({
      getPublicKey: schnorrGetPublicKey,
      sign: schnorrSign,
      verify: schnorrVerify,
      utils: {
        randomPrivateKey: exports.secp256k1.utils.randomPrivateKey,
        lift_x,
        pointToBytes,
        numberToBytesBE: utils_js_1.numberToBytesBE,
        bytesToNumberBE: utils_js_1.bytesToNumberBE,
        taggedHash,
        mod: modular_js_1.mod
      }
    }))();
    var isoMap = (() => (0, hash_to_curve_js_1.isogenyMap)(Fpk1, [
      // xNum
      [
        "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7",
        "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581",
        "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262",
        "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"
      ],
      // xDen
      [
        "0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b",
        "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
        // LAST 1
      ],
      // yNum
      [
        "0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c",
        "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3",
        "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931",
        "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"
      ],
      // yDen
      [
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b",
        "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573",
        "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
        // LAST 1
      ]
    ].map((i) => i.map((j) => BigInt(j)))))();
    var mapSWU = (() => (0, weierstrass_js_1.mapToCurveSimpleSWU)(Fpk1, {
      A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
      B: BigInt("1771"),
      Z: Fpk1.create(BigInt("-11"))
    }))();
    var htf = (() => (0, hash_to_curve_js_1.createHasher)(exports.secp256k1.ProjectivePoint, (scalars) => {
      const { x, y } = mapSWU(Fpk1.create(scalars[0]));
      return isoMap(x, y);
    }, {
      DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
      encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
      p: Fpk1.ORDER,
      m: 1,
      k: 128,
      expand: "xmd",
      hash: sha256_1.sha256
    }))();
    exports.hashToCurve = (() => htf.hashToCurve)();
    exports.encodeToCurve = (() => htf.encodeToCurve)();
  }
});

// node_modules/viem/_cjs/utils/signature/recoverPublicKey.js
var require_recoverPublicKey = __commonJS({
  "node_modules/viem/_cjs/utils/signature/recoverPublicKey.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.recoverPublicKey = recoverPublicKey;
    var isHex_js_1 = require_isHex();
    var fromHex_js_1 = require_fromHex();
    var toHex_js_1 = require_toHex();
    async function recoverPublicKey({ hash, signature }) {
      const hashHex = (0, isHex_js_1.isHex)(hash) ? hash : (0, toHex_js_1.toHex)(hash);
      const { secp256k1 } = await Promise.resolve().then(() => require_secp256k1());
      const signature_ = (() => {
        if (typeof signature === "object" && "r" in signature && "s" in signature) {
          const { r, s, v, yParity } = signature;
          const yParityOrV2 = Number(yParity ?? v);
          const recoveryBit2 = toRecoveryBit(yParityOrV2);
          return new secp256k1.Signature((0, fromHex_js_1.hexToBigInt)(r), (0, fromHex_js_1.hexToBigInt)(s)).addRecoveryBit(recoveryBit2);
        }
        const signatureHex = (0, isHex_js_1.isHex)(signature) ? signature : (0, toHex_js_1.toHex)(signature);
        const yParityOrV = (0, fromHex_js_1.hexToNumber)(`0x${signatureHex.slice(130)}`);
        const recoveryBit = toRecoveryBit(yParityOrV);
        return secp256k1.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
      })();
      const publicKey = signature_.recoverPublicKey(hashHex.substring(2)).toHex(false);
      return `0x${publicKey}`;
    }
    function toRecoveryBit(yParityOrV) {
      if (yParityOrV === 0 || yParityOrV === 1)
        return yParityOrV;
      if (yParityOrV === 27)
        return 0;
      if (yParityOrV === 28)
        return 1;
      throw new Error("Invalid yParityOrV value");
    }
  }
});

// node_modules/viem/_cjs/utils/signature/recoverAddress.js
var require_recoverAddress = __commonJS({
  "node_modules/viem/_cjs/utils/signature/recoverAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.recoverAddress = recoverAddress;
    var publicKeyToAddress_js_1 = require_publicKeyToAddress();
    var recoverPublicKey_js_1 = require_recoverPublicKey();
    async function recoverAddress({ hash, signature }) {
      return (0, publicKeyToAddress_js_1.publicKeyToAddress)(await (0, recoverPublicKey_js_1.recoverPublicKey)({ hash, signature }));
    }
  }
});

// node_modules/viem/_cjs/utils/encoding/toRlp.js
var require_toRlp = __commonJS({
  "node_modules/viem/_cjs/utils/encoding/toRlp.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toRlp = toRlp;
    exports.bytesToRlp = bytesToRlp;
    exports.hexToRlp = hexToRlp;
    var base_js_1 = require_base();
    var cursor_js_1 = require_cursor2();
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    function toRlp(bytes, to = "hex") {
      const encodable = getEncodable(bytes);
      const cursor = (0, cursor_js_1.createCursor)(new Uint8Array(encodable.length));
      encodable.encode(cursor);
      if (to === "hex")
        return (0, toHex_js_1.bytesToHex)(cursor.bytes);
      return cursor.bytes;
    }
    function bytesToRlp(bytes, to = "bytes") {
      return toRlp(bytes, to);
    }
    function hexToRlp(hex, to = "hex") {
      return toRlp(hex, to);
    }
    function getEncodable(bytes) {
      if (Array.isArray(bytes))
        return getEncodableList(bytes.map((x) => getEncodable(x)));
      return getEncodableBytes(bytes);
    }
    function getEncodableList(list) {
      const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
      const sizeOfBodyLength = getSizeOfLength(bodyLength);
      const length = (() => {
        if (bodyLength <= 55)
          return 1 + bodyLength;
        return 1 + sizeOfBodyLength + bodyLength;
      })();
      return {
        length,
        encode(cursor) {
          if (bodyLength <= 55) {
            cursor.pushByte(192 + bodyLength);
          } else {
            cursor.pushByte(192 + 55 + sizeOfBodyLength);
            if (sizeOfBodyLength === 1)
              cursor.pushUint8(bodyLength);
            else if (sizeOfBodyLength === 2)
              cursor.pushUint16(bodyLength);
            else if (sizeOfBodyLength === 3)
              cursor.pushUint24(bodyLength);
            else
              cursor.pushUint32(bodyLength);
          }
          for (const { encode } of list) {
            encode(cursor);
          }
        }
      };
    }
    function getEncodableBytes(bytesOrHex) {
      const bytes = typeof bytesOrHex === "string" ? (0, toBytes_js_1.hexToBytes)(bytesOrHex) : bytesOrHex;
      const sizeOfBytesLength = getSizeOfLength(bytes.length);
      const length = (() => {
        if (bytes.length === 1 && bytes[0] < 128)
          return 1;
        if (bytes.length <= 55)
          return 1 + bytes.length;
        return 1 + sizeOfBytesLength + bytes.length;
      })();
      return {
        length,
        encode(cursor) {
          if (bytes.length === 1 && bytes[0] < 128) {
            cursor.pushBytes(bytes);
          } else if (bytes.length <= 55) {
            cursor.pushByte(128 + bytes.length);
            cursor.pushBytes(bytes);
          } else {
            cursor.pushByte(128 + 55 + sizeOfBytesLength);
            if (sizeOfBytesLength === 1)
              cursor.pushUint8(bytes.length);
            else if (sizeOfBytesLength === 2)
              cursor.pushUint16(bytes.length);
            else if (sizeOfBytesLength === 3)
              cursor.pushUint24(bytes.length);
            else
              cursor.pushUint32(bytes.length);
            cursor.pushBytes(bytes);
          }
        }
      };
    }
    function getSizeOfLength(length) {
      if (length < 2 ** 8)
        return 1;
      if (length < 2 ** 16)
        return 2;
      if (length < 2 ** 24)
        return 3;
      if (length < 2 ** 32)
        return 4;
      throw new base_js_1.BaseError("Length is too large.");
    }
  }
});

// node_modules/viem/_cjs/experimental/eip7702/utils/hashAuthorization.js
var require_hashAuthorization = __commonJS({
  "node_modules/viem/_cjs/experimental/eip7702/utils/hashAuthorization.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hashAuthorization = hashAuthorization;
    var concat_js_1 = require_concat();
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    var toRlp_js_1 = require_toRlp();
    var keccak256_js_1 = require_keccak256();
    function hashAuthorization(parameters) {
      const { chainId, contractAddress, nonce, to } = parameters;
      const hash = (0, keccak256_js_1.keccak256)((0, concat_js_1.concatHex)([
        "0x05",
        (0, toRlp_js_1.toRlp)([
          chainId ? (0, toHex_js_1.numberToHex)(chainId) : "0x",
          contractAddress,
          nonce ? (0, toHex_js_1.numberToHex)(nonce) : "0x"
        ])
      ]));
      if (to === "bytes")
        return (0, toBytes_js_1.hexToBytes)(hash);
      return hash;
    }
  }
});

// node_modules/viem/_cjs/experimental/eip7702/utils/recoverAuthorizationAddress.js
var require_recoverAuthorizationAddress = __commonJS({
  "node_modules/viem/_cjs/experimental/eip7702/utils/recoverAuthorizationAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.recoverAuthorizationAddress = recoverAuthorizationAddress;
    var recoverAddress_js_1 = require_recoverAddress();
    var hashAuthorization_js_1 = require_hashAuthorization();
    async function recoverAuthorizationAddress(parameters) {
      const { authorization, signature } = parameters;
      return (0, recoverAddress_js_1.recoverAddress)({
        hash: (0, hashAuthorization_js_1.hashAuthorization)(authorization),
        signature: signature ?? authorization
      });
    }
  }
});

// node_modules/viem/_cjs/errors/estimateGas.js
var require_estimateGas = __commonJS({
  "node_modules/viem/_cjs/errors/estimateGas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EstimateGasExecutionError = void 0;
    var formatEther_js_1 = require_formatEther();
    var formatGwei_js_1 = require_formatGwei();
    var base_js_1 = require_base();
    var transaction_js_1 = require_transaction();
    var EstimateGasExecutionError = class extends base_js_1.BaseError {
      constructor(cause, { account, docsPath, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
        var _a;
        const prettyArgs = (0, transaction_js_1.prettyPrint)({
          from: account == null ? void 0 : account.address,
          to,
          value: typeof value !== "undefined" && `${(0, formatEther_js_1.formatEther)(value)} ${((_a = chain == null ? void 0 : chain.nativeCurrency) == null ? void 0 : _a.symbol) || "ETH"}`,
          data,
          gas,
          gasPrice: typeof gasPrice !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(gasPrice)} gwei`,
          maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(maxFeePerGas)} gwei`,
          maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${(0, formatGwei_js_1.formatGwei)(maxPriorityFeePerGas)} gwei`,
          nonce
        });
        super(cause.shortMessage, {
          cause,
          docsPath,
          metaMessages: [
            ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
            "Estimate Gas Arguments:",
            prettyArgs
          ].filter(Boolean),
          name: "EstimateGasExecutionError"
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.cause = cause;
      }
    };
    exports.EstimateGasExecutionError = EstimateGasExecutionError;
  }
});

// node_modules/viem/_cjs/errors/node.js
var require_node = __commonJS({
  "node_modules/viem/_cjs/errors/node.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnknownNodeError = exports.TipAboveFeeCapError = exports.TransactionTypeNotSupportedError = exports.IntrinsicGasTooLowError = exports.IntrinsicGasTooHighError = exports.InsufficientFundsError = exports.NonceMaxValueError = exports.NonceTooLowError = exports.NonceTooHighError = exports.FeeCapTooLowError = exports.FeeCapTooHighError = exports.ExecutionRevertedError = void 0;
    var formatGwei_js_1 = require_formatGwei();
    var base_js_1 = require_base();
    var ExecutionRevertedError = class extends base_js_1.BaseError {
      constructor({ cause, message } = {}) {
        var _a;
        const reason = (_a = message == null ? void 0 : message.replace("execution reverted: ", "")) == null ? void 0 : _a.replace("execution reverted", "");
        super(`Execution reverted ${reason ? `with reason: ${reason}` : "for an unknown reason"}.`, {
          cause,
          name: "ExecutionRevertedError"
        });
      }
    };
    exports.ExecutionRevertedError = ExecutionRevertedError;
    Object.defineProperty(ExecutionRevertedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 3
    });
    Object.defineProperty(ExecutionRevertedError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /execution reverted/
    });
    var FeeCapTooHighError = class extends base_js_1.BaseError {
      constructor({ cause, maxFeePerGas } = {}) {
        super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${(0, formatGwei_js_1.formatGwei)(maxFeePerGas)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`, {
          cause,
          name: "FeeCapTooHighError"
        });
      }
    };
    exports.FeeCapTooHighError = FeeCapTooHighError;
    Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
    });
    var FeeCapTooLowError = class extends base_js_1.BaseError {
      constructor({ cause, maxFeePerGas } = {}) {
        super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${(0, formatGwei_js_1.formatGwei)(maxFeePerGas)}` : ""} gwei) cannot be lower than the block base fee.`, {
          cause,
          name: "FeeCapTooLowError"
        });
      }
    };
    exports.FeeCapTooLowError = FeeCapTooLowError;
    Object.defineProperty(FeeCapTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
    });
    var NonceTooHighError = class extends base_js_1.BaseError {
      constructor({ cause, nonce } = {}) {
        super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is higher than the next one expected.`, { cause, name: "NonceTooHighError" });
      }
    };
    exports.NonceTooHighError = NonceTooHighError;
    Object.defineProperty(NonceTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce too high/
    });
    var NonceTooLowError = class extends base_js_1.BaseError {
      constructor({ cause, nonce } = {}) {
        super([
          `Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is lower than the current nonce of the account.`,
          "Try increasing the nonce or find the latest nonce with `getTransactionCount`."
        ].join("\n"), { cause, name: "NonceTooLowError" });
      }
    };
    exports.NonceTooLowError = NonceTooLowError;
    Object.defineProperty(NonceTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce too low|transaction already imported|already known/
    });
    var NonceMaxValueError = class extends base_js_1.BaseError {
      constructor({ cause, nonce } = {}) {
        super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}exceeds the maximum allowed nonce.`, { cause, name: "NonceMaxValueError" });
      }
    };
    exports.NonceMaxValueError = NonceMaxValueError;
    Object.defineProperty(NonceMaxValueError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce has max value/
    });
    var InsufficientFundsError = class extends base_js_1.BaseError {
      constructor({ cause } = {}) {
        super([
          "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
        ].join("\n"), {
          cause,
          metaMessages: [
            "This error could arise when the account does not have enough funds to:",
            " - pay for the total gas fee,",
            " - pay for the value to send.",
            " ",
            "The cost of the transaction is calculated as `gas * gas fee + value`, where:",
            " - `gas` is the amount of gas needed for transaction to execute,",
            " - `gas fee` is the gas fee,",
            " - `value` is the amount of ether to send to the recipient."
          ],
          name: "InsufficientFundsError"
        });
      }
    };
    exports.InsufficientFundsError = InsufficientFundsError;
    Object.defineProperty(InsufficientFundsError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /insufficient funds|exceeds transaction sender account balance/
    });
    var IntrinsicGasTooHighError = class extends base_js_1.BaseError {
      constructor({ cause, gas } = {}) {
        super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`, {
          cause,
          name: "IntrinsicGasTooHighError"
        });
      }
    };
    exports.IntrinsicGasTooHighError = IntrinsicGasTooHighError;
    Object.defineProperty(IntrinsicGasTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /intrinsic gas too high|gas limit reached/
    });
    var IntrinsicGasTooLowError = class extends base_js_1.BaseError {
      constructor({ cause, gas } = {}) {
        super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction is too low.`, {
          cause,
          name: "IntrinsicGasTooLowError"
        });
      }
    };
    exports.IntrinsicGasTooLowError = IntrinsicGasTooLowError;
    Object.defineProperty(IntrinsicGasTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /intrinsic gas too low/
    });
    var TransactionTypeNotSupportedError = class extends base_js_1.BaseError {
      constructor({ cause }) {
        super("The transaction type is not supported for this chain.", {
          cause,
          name: "TransactionTypeNotSupportedError"
        });
      }
    };
    exports.TransactionTypeNotSupportedError = TransactionTypeNotSupportedError;
    Object.defineProperty(TransactionTypeNotSupportedError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /transaction type not valid/
    });
    var TipAboveFeeCapError = class extends base_js_1.BaseError {
      constructor({ cause, maxPriorityFeePerGas, maxFeePerGas } = {}) {
        super([
          `The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${(0, formatGwei_js_1.formatGwei)(maxPriorityFeePerGas)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${(0, formatGwei_js_1.formatGwei)(maxFeePerGas)} gwei` : ""}).`
        ].join("\n"), {
          cause,
          name: "TipAboveFeeCapError"
        });
      }
    };
    exports.TipAboveFeeCapError = TipAboveFeeCapError;
    Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
    });
    var UnknownNodeError = class extends base_js_1.BaseError {
      constructor({ cause }) {
        super(`An error occurred while executing: ${cause == null ? void 0 : cause.shortMessage}`, {
          cause,
          name: "UnknownNodeError"
        });
      }
    };
    exports.UnknownNodeError = UnknownNodeError;
  }
});

// node_modules/viem/_cjs/utils/errors/getNodeError.js
var require_getNodeError = __commonJS({
  "node_modules/viem/_cjs/utils/errors/getNodeError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.containsNodeError = containsNodeError;
    exports.getNodeError = getNodeError;
    var base_js_1 = require_base();
    var node_js_1 = require_node();
    var request_js_1 = require_request();
    var rpc_js_1 = require_rpc2();
    function containsNodeError(err) {
      return err instanceof rpc_js_1.TransactionRejectedRpcError || err instanceof rpc_js_1.InvalidInputRpcError || err instanceof request_js_1.RpcRequestError && err.code === node_js_1.ExecutionRevertedError.code;
    }
    function getNodeError(err, args) {
      const message = (err.details || "").toLowerCase();
      const executionRevertedError = err instanceof base_js_1.BaseError ? err.walk((e) => (e == null ? void 0 : e.code) === node_js_1.ExecutionRevertedError.code) : err;
      if (executionRevertedError instanceof base_js_1.BaseError)
        return new node_js_1.ExecutionRevertedError({
          cause: err,
          message: executionRevertedError.details
        });
      if (node_js_1.ExecutionRevertedError.nodeMessage.test(message))
        return new node_js_1.ExecutionRevertedError({
          cause: err,
          message: err.details
        });
      if (node_js_1.FeeCapTooHighError.nodeMessage.test(message))
        return new node_js_1.FeeCapTooHighError({
          cause: err,
          maxFeePerGas: args == null ? void 0 : args.maxFeePerGas
        });
      if (node_js_1.FeeCapTooLowError.nodeMessage.test(message))
        return new node_js_1.FeeCapTooLowError({
          cause: err,
          maxFeePerGas: args == null ? void 0 : args.maxFeePerGas
        });
      if (node_js_1.NonceTooHighError.nodeMessage.test(message))
        return new node_js_1.NonceTooHighError({ cause: err, nonce: args == null ? void 0 : args.nonce });
      if (node_js_1.NonceTooLowError.nodeMessage.test(message))
        return new node_js_1.NonceTooLowError({ cause: err, nonce: args == null ? void 0 : args.nonce });
      if (node_js_1.NonceMaxValueError.nodeMessage.test(message))
        return new node_js_1.NonceMaxValueError({ cause: err, nonce: args == null ? void 0 : args.nonce });
      if (node_js_1.InsufficientFundsError.nodeMessage.test(message))
        return new node_js_1.InsufficientFundsError({ cause: err });
      if (node_js_1.IntrinsicGasTooHighError.nodeMessage.test(message))
        return new node_js_1.IntrinsicGasTooHighError({ cause: err, gas: args == null ? void 0 : args.gas });
      if (node_js_1.IntrinsicGasTooLowError.nodeMessage.test(message))
        return new node_js_1.IntrinsicGasTooLowError({ cause: err, gas: args == null ? void 0 : args.gas });
      if (node_js_1.TransactionTypeNotSupportedError.nodeMessage.test(message))
        return new node_js_1.TransactionTypeNotSupportedError({ cause: err });
      if (node_js_1.TipAboveFeeCapError.nodeMessage.test(message))
        return new node_js_1.TipAboveFeeCapError({
          cause: err,
          maxFeePerGas: args == null ? void 0 : args.maxFeePerGas,
          maxPriorityFeePerGas: args == null ? void 0 : args.maxPriorityFeePerGas
        });
      return new node_js_1.UnknownNodeError({
        cause: err
      });
    }
  }
});

// node_modules/viem/_cjs/utils/errors/getEstimateGasError.js
var require_getEstimateGasError = __commonJS({
  "node_modules/viem/_cjs/utils/errors/getEstimateGasError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEstimateGasError = getEstimateGasError;
    var estimateGas_js_1 = require_estimateGas();
    var node_js_1 = require_node();
    var getNodeError_js_1 = require_getNodeError();
    function getEstimateGasError(err, { docsPath, ...args }) {
      const cause = (() => {
        const cause2 = (0, getNodeError_js_1.getNodeError)(err, args);
        if (cause2 instanceof node_js_1.UnknownNodeError)
          return err;
        return cause2;
      })();
      return new estimateGas_js_1.EstimateGasExecutionError(cause, {
        docsPath,
        ...args
      });
    }
  }
});

// node_modules/viem/_cjs/utils/formatters/extract.js
var require_extract = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/extract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extract = extract;
    function extract(value_, { format }) {
      if (!format)
        return {};
      const value = {};
      function extract_(formatted2) {
        const keys = Object.keys(formatted2);
        for (const key of keys) {
          if (key in value_)
            value[key] = value_[key];
          if (formatted2[key] && typeof formatted2[key] === "object" && !Array.isArray(formatted2[key]))
            extract_(formatted2[key]);
        }
      }
      const formatted = format(value_ || {});
      extract_(formatted);
      return value;
    }
  }
});

// node_modules/viem/_cjs/utils/formatters/formatter.js
var require_formatter = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/formatter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defineFormatter = defineFormatter;
    function defineFormatter(type, format) {
      return ({ exclude, format: overrides }) => {
        return {
          exclude,
          format: (args) => {
            const formatted = format(args);
            if (exclude) {
              for (const key of exclude) {
                delete formatted[key];
              }
            }
            return {
              ...formatted,
              ...overrides(args)
            };
          },
          type
        };
      };
    }
  }
});

// node_modules/viem/_cjs/utils/formatters/transactionRequest.js
var require_transactionRequest = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/transactionRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defineTransactionRequest = exports.rpcTransactionType = void 0;
    exports.formatTransactionRequest = formatTransactionRequest;
    var toHex_js_1 = require_toHex();
    var formatter_js_1 = require_formatter();
    exports.rpcTransactionType = {
      legacy: "0x0",
      eip2930: "0x1",
      eip1559: "0x2",
      eip4844: "0x3",
      eip7702: "0x4"
    };
    function formatTransactionRequest(request) {
      const rpcRequest = {};
      if (typeof request.authorizationList !== "undefined")
        rpcRequest.authorizationList = formatAuthorizationList(request.authorizationList);
      if (typeof request.accessList !== "undefined")
        rpcRequest.accessList = request.accessList;
      if (typeof request.blobVersionedHashes !== "undefined")
        rpcRequest.blobVersionedHashes = request.blobVersionedHashes;
      if (typeof request.blobs !== "undefined") {
        if (typeof request.blobs[0] !== "string")
          rpcRequest.blobs = request.blobs.map((x) => (0, toHex_js_1.bytesToHex)(x));
        else
          rpcRequest.blobs = request.blobs;
      }
      if (typeof request.data !== "undefined")
        rpcRequest.data = request.data;
      if (typeof request.from !== "undefined")
        rpcRequest.from = request.from;
      if (typeof request.gas !== "undefined")
        rpcRequest.gas = (0, toHex_js_1.numberToHex)(request.gas);
      if (typeof request.gasPrice !== "undefined")
        rpcRequest.gasPrice = (0, toHex_js_1.numberToHex)(request.gasPrice);
      if (typeof request.maxFeePerBlobGas !== "undefined")
        rpcRequest.maxFeePerBlobGas = (0, toHex_js_1.numberToHex)(request.maxFeePerBlobGas);
      if (typeof request.maxFeePerGas !== "undefined")
        rpcRequest.maxFeePerGas = (0, toHex_js_1.numberToHex)(request.maxFeePerGas);
      if (typeof request.maxPriorityFeePerGas !== "undefined")
        rpcRequest.maxPriorityFeePerGas = (0, toHex_js_1.numberToHex)(request.maxPriorityFeePerGas);
      if (typeof request.nonce !== "undefined")
        rpcRequest.nonce = (0, toHex_js_1.numberToHex)(request.nonce);
      if (typeof request.to !== "undefined")
        rpcRequest.to = request.to;
      if (typeof request.type !== "undefined")
        rpcRequest.type = exports.rpcTransactionType[request.type];
      if (typeof request.value !== "undefined")
        rpcRequest.value = (0, toHex_js_1.numberToHex)(request.value);
      return rpcRequest;
    }
    exports.defineTransactionRequest = (0, formatter_js_1.defineFormatter)("transactionRequest", formatTransactionRequest);
    function formatAuthorizationList(authorizationList) {
      return authorizationList.map((authorization) => ({
        address: authorization.contractAddress,
        r: authorization.r,
        s: authorization.s,
        chainId: (0, toHex_js_1.numberToHex)(authorization.chainId),
        nonce: (0, toHex_js_1.numberToHex)(authorization.nonce),
        ...typeof authorization.yParity !== "undefined" ? { yParity: (0, toHex_js_1.numberToHex)(authorization.yParity) } : {},
        ...typeof authorization.v !== "undefined" && typeof authorization.yParity === "undefined" ? { v: (0, toHex_js_1.numberToHex)(authorization.v) } : {}
      }));
    }
  }
});

// node_modules/viem/_cjs/utils/stateOverride.js
var require_stateOverride2 = __commonJS({
  "node_modules/viem/_cjs/utils/stateOverride.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serializeStateMapping = serializeStateMapping;
    exports.serializeAccountStateOverride = serializeAccountStateOverride;
    exports.serializeStateOverride = serializeStateOverride;
    var address_js_1 = require_address();
    var data_js_1 = require_data();
    var stateOverride_js_1 = require_stateOverride();
    var isAddress_js_1 = require_isAddress();
    var toHex_js_1 = require_toHex();
    function serializeStateMapping(stateMapping) {
      if (!stateMapping || stateMapping.length === 0)
        return void 0;
      return stateMapping.reduce((acc, { slot, value }) => {
        if (slot.length !== 66)
          throw new data_js_1.InvalidBytesLengthError({
            size: slot.length,
            targetSize: 66,
            type: "hex"
          });
        if (value.length !== 66)
          throw new data_js_1.InvalidBytesLengthError({
            size: value.length,
            targetSize: 66,
            type: "hex"
          });
        acc[slot] = value;
        return acc;
      }, {});
    }
    function serializeAccountStateOverride(parameters) {
      const { balance, nonce, state, stateDiff, code } = parameters;
      const rpcAccountStateOverride = {};
      if (code !== void 0)
        rpcAccountStateOverride.code = code;
      if (balance !== void 0)
        rpcAccountStateOverride.balance = (0, toHex_js_1.numberToHex)(balance);
      if (nonce !== void 0)
        rpcAccountStateOverride.nonce = (0, toHex_js_1.numberToHex)(nonce);
      if (state !== void 0)
        rpcAccountStateOverride.state = serializeStateMapping(state);
      if (stateDiff !== void 0) {
        if (rpcAccountStateOverride.state)
          throw new stateOverride_js_1.StateAssignmentConflictError();
        rpcAccountStateOverride.stateDiff = serializeStateMapping(stateDiff);
      }
      return rpcAccountStateOverride;
    }
    function serializeStateOverride(parameters) {
      if (!parameters)
        return void 0;
      const rpcStateOverride = {};
      for (const { address, ...accountState } of parameters) {
        if (!(0, isAddress_js_1.isAddress)(address, { strict: false }))
          throw new address_js_1.InvalidAddressError({ address });
        if (rpcStateOverride[address])
          throw new stateOverride_js_1.AccountStateConflictError({ address });
        rpcStateOverride[address] = serializeAccountStateOverride(accountState);
      }
      return rpcStateOverride;
    }
  }
});

// node_modules/viem/_cjs/constants/number.js
var require_number = __commonJS({
  "node_modules/viem/_cjs/constants/number.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.minInt144 = exports.minInt136 = exports.minInt128 = exports.minInt120 = exports.minInt112 = exports.minInt104 = exports.minInt96 = exports.minInt88 = exports.minInt80 = exports.minInt72 = exports.minInt64 = exports.minInt56 = exports.minInt48 = exports.minInt40 = exports.minInt32 = exports.minInt24 = exports.minInt16 = exports.minInt8 = exports.maxInt256 = exports.maxInt248 = exports.maxInt240 = exports.maxInt232 = exports.maxInt224 = exports.maxInt216 = exports.maxInt208 = exports.maxInt200 = exports.maxInt192 = exports.maxInt184 = exports.maxInt176 = exports.maxInt168 = exports.maxInt160 = exports.maxInt152 = exports.maxInt144 = exports.maxInt136 = exports.maxInt128 = exports.maxInt120 = exports.maxInt112 = exports.maxInt104 = exports.maxInt96 = exports.maxInt88 = exports.maxInt80 = exports.maxInt72 = exports.maxInt64 = exports.maxInt56 = exports.maxInt48 = exports.maxInt40 = exports.maxInt32 = exports.maxInt24 = exports.maxInt16 = exports.maxInt8 = void 0;
    exports.maxUint256 = exports.maxUint248 = exports.maxUint240 = exports.maxUint232 = exports.maxUint224 = exports.maxUint216 = exports.maxUint208 = exports.maxUint200 = exports.maxUint192 = exports.maxUint184 = exports.maxUint176 = exports.maxUint168 = exports.maxUint160 = exports.maxUint152 = exports.maxUint144 = exports.maxUint136 = exports.maxUint128 = exports.maxUint120 = exports.maxUint112 = exports.maxUint104 = exports.maxUint96 = exports.maxUint88 = exports.maxUint80 = exports.maxUint72 = exports.maxUint64 = exports.maxUint56 = exports.maxUint48 = exports.maxUint40 = exports.maxUint32 = exports.maxUint24 = exports.maxUint16 = exports.maxUint8 = exports.minInt256 = exports.minInt248 = exports.minInt240 = exports.minInt232 = exports.minInt224 = exports.minInt216 = exports.minInt208 = exports.minInt200 = exports.minInt192 = exports.minInt184 = exports.minInt176 = exports.minInt168 = exports.minInt160 = exports.minInt152 = void 0;
    exports.maxInt8 = 2n ** (8n - 1n) - 1n;
    exports.maxInt16 = 2n ** (16n - 1n) - 1n;
    exports.maxInt24 = 2n ** (24n - 1n) - 1n;
    exports.maxInt32 = 2n ** (32n - 1n) - 1n;
    exports.maxInt40 = 2n ** (40n - 1n) - 1n;
    exports.maxInt48 = 2n ** (48n - 1n) - 1n;
    exports.maxInt56 = 2n ** (56n - 1n) - 1n;
    exports.maxInt64 = 2n ** (64n - 1n) - 1n;
    exports.maxInt72 = 2n ** (72n - 1n) - 1n;
    exports.maxInt80 = 2n ** (80n - 1n) - 1n;
    exports.maxInt88 = 2n ** (88n - 1n) - 1n;
    exports.maxInt96 = 2n ** (96n - 1n) - 1n;
    exports.maxInt104 = 2n ** (104n - 1n) - 1n;
    exports.maxInt112 = 2n ** (112n - 1n) - 1n;
    exports.maxInt120 = 2n ** (120n - 1n) - 1n;
    exports.maxInt128 = 2n ** (128n - 1n) - 1n;
    exports.maxInt136 = 2n ** (136n - 1n) - 1n;
    exports.maxInt144 = 2n ** (144n - 1n) - 1n;
    exports.maxInt152 = 2n ** (152n - 1n) - 1n;
    exports.maxInt160 = 2n ** (160n - 1n) - 1n;
    exports.maxInt168 = 2n ** (168n - 1n) - 1n;
    exports.maxInt176 = 2n ** (176n - 1n) - 1n;
    exports.maxInt184 = 2n ** (184n - 1n) - 1n;
    exports.maxInt192 = 2n ** (192n - 1n) - 1n;
    exports.maxInt200 = 2n ** (200n - 1n) - 1n;
    exports.maxInt208 = 2n ** (208n - 1n) - 1n;
    exports.maxInt216 = 2n ** (216n - 1n) - 1n;
    exports.maxInt224 = 2n ** (224n - 1n) - 1n;
    exports.maxInt232 = 2n ** (232n - 1n) - 1n;
    exports.maxInt240 = 2n ** (240n - 1n) - 1n;
    exports.maxInt248 = 2n ** (248n - 1n) - 1n;
    exports.maxInt256 = 2n ** (256n - 1n) - 1n;
    exports.minInt8 = -(2n ** (8n - 1n));
    exports.minInt16 = -(2n ** (16n - 1n));
    exports.minInt24 = -(2n ** (24n - 1n));
    exports.minInt32 = -(2n ** (32n - 1n));
    exports.minInt40 = -(2n ** (40n - 1n));
    exports.minInt48 = -(2n ** (48n - 1n));
    exports.minInt56 = -(2n ** (56n - 1n));
    exports.minInt64 = -(2n ** (64n - 1n));
    exports.minInt72 = -(2n ** (72n - 1n));
    exports.minInt80 = -(2n ** (80n - 1n));
    exports.minInt88 = -(2n ** (88n - 1n));
    exports.minInt96 = -(2n ** (96n - 1n));
    exports.minInt104 = -(2n ** (104n - 1n));
    exports.minInt112 = -(2n ** (112n - 1n));
    exports.minInt120 = -(2n ** (120n - 1n));
    exports.minInt128 = -(2n ** (128n - 1n));
    exports.minInt136 = -(2n ** (136n - 1n));
    exports.minInt144 = -(2n ** (144n - 1n));
    exports.minInt152 = -(2n ** (152n - 1n));
    exports.minInt160 = -(2n ** (160n - 1n));
    exports.minInt168 = -(2n ** (168n - 1n));
    exports.minInt176 = -(2n ** (176n - 1n));
    exports.minInt184 = -(2n ** (184n - 1n));
    exports.minInt192 = -(2n ** (192n - 1n));
    exports.minInt200 = -(2n ** (200n - 1n));
    exports.minInt208 = -(2n ** (208n - 1n));
    exports.minInt216 = -(2n ** (216n - 1n));
    exports.minInt224 = -(2n ** (224n - 1n));
    exports.minInt232 = -(2n ** (232n - 1n));
    exports.minInt240 = -(2n ** (240n - 1n));
    exports.minInt248 = -(2n ** (248n - 1n));
    exports.minInt256 = -(2n ** (256n - 1n));
    exports.maxUint8 = 2n ** 8n - 1n;
    exports.maxUint16 = 2n ** 16n - 1n;
    exports.maxUint24 = 2n ** 24n - 1n;
    exports.maxUint32 = 2n ** 32n - 1n;
    exports.maxUint40 = 2n ** 40n - 1n;
    exports.maxUint48 = 2n ** 48n - 1n;
    exports.maxUint56 = 2n ** 56n - 1n;
    exports.maxUint64 = 2n ** 64n - 1n;
    exports.maxUint72 = 2n ** 72n - 1n;
    exports.maxUint80 = 2n ** 80n - 1n;
    exports.maxUint88 = 2n ** 88n - 1n;
    exports.maxUint96 = 2n ** 96n - 1n;
    exports.maxUint104 = 2n ** 104n - 1n;
    exports.maxUint112 = 2n ** 112n - 1n;
    exports.maxUint120 = 2n ** 120n - 1n;
    exports.maxUint128 = 2n ** 128n - 1n;
    exports.maxUint136 = 2n ** 136n - 1n;
    exports.maxUint144 = 2n ** 144n - 1n;
    exports.maxUint152 = 2n ** 152n - 1n;
    exports.maxUint160 = 2n ** 160n - 1n;
    exports.maxUint168 = 2n ** 168n - 1n;
    exports.maxUint176 = 2n ** 176n - 1n;
    exports.maxUint184 = 2n ** 184n - 1n;
    exports.maxUint192 = 2n ** 192n - 1n;
    exports.maxUint200 = 2n ** 200n - 1n;
    exports.maxUint208 = 2n ** 208n - 1n;
    exports.maxUint216 = 2n ** 216n - 1n;
    exports.maxUint224 = 2n ** 224n - 1n;
    exports.maxUint232 = 2n ** 232n - 1n;
    exports.maxUint240 = 2n ** 240n - 1n;
    exports.maxUint248 = 2n ** 248n - 1n;
    exports.maxUint256 = 2n ** 256n - 1n;
  }
});

// node_modules/viem/_cjs/utils/transaction/assertRequest.js
var require_assertRequest = __commonJS({
  "node_modules/viem/_cjs/utils/transaction/assertRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertRequest = assertRequest;
    var parseAccount_js_1 = require_parseAccount();
    var number_js_1 = require_number();
    var address_js_1 = require_address();
    var node_js_1 = require_node();
    var transaction_js_1 = require_transaction();
    var isAddress_js_1 = require_isAddress();
    function assertRequest(args) {
      const { account: account_, gasPrice, maxFeePerGas, maxPriorityFeePerGas, to } = args;
      const account = account_ ? (0, parseAccount_js_1.parseAccount)(account_) : void 0;
      if (account && !(0, isAddress_js_1.isAddress)(account.address))
        throw new address_js_1.InvalidAddressError({ address: account.address });
      if (to && !(0, isAddress_js_1.isAddress)(to))
        throw new address_js_1.InvalidAddressError({ address: to });
      if (typeof gasPrice !== "undefined" && (typeof maxFeePerGas !== "undefined" || typeof maxPriorityFeePerGas !== "undefined"))
        throw new transaction_js_1.FeeConflictError();
      if (maxFeePerGas && maxFeePerGas > number_js_1.maxUint256)
        throw new node_js_1.FeeCapTooHighError({ maxFeePerGas });
      if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
        throw new node_js_1.TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
    }
  }
});

// node_modules/viem/_cjs/errors/fee.js
var require_fee = __commonJS({
  "node_modules/viem/_cjs/errors/fee.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MaxFeePerGasTooLowError = exports.Eip1559FeesNotSupportedError = exports.BaseFeeScalarError = void 0;
    var formatGwei_js_1 = require_formatGwei();
    var base_js_1 = require_base();
    var BaseFeeScalarError = class extends base_js_1.BaseError {
      constructor() {
        super("`baseFeeMultiplier` must be greater than 1.", {
          name: "BaseFeeScalarError"
        });
      }
    };
    exports.BaseFeeScalarError = BaseFeeScalarError;
    var Eip1559FeesNotSupportedError = class extends base_js_1.BaseError {
      constructor() {
        super("Chain does not support EIP-1559 fees.", {
          name: "Eip1559FeesNotSupportedError"
        });
      }
    };
    exports.Eip1559FeesNotSupportedError = Eip1559FeesNotSupportedError;
    var MaxFeePerGasTooLowError = class extends base_js_1.BaseError {
      constructor({ maxPriorityFeePerGas }) {
        super(`\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${(0, formatGwei_js_1.formatGwei)(maxPriorityFeePerGas)} gwei).`, { name: "MaxFeePerGasTooLowError" });
      }
    };
    exports.MaxFeePerGasTooLowError = MaxFeePerGasTooLowError;
  }
});

// node_modules/viem/_cjs/errors/block.js
var require_block = __commonJS({
  "node_modules/viem/_cjs/errors/block.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BlockNotFoundError = void 0;
    var base_js_1 = require_base();
    var BlockNotFoundError = class extends base_js_1.BaseError {
      constructor({ blockHash, blockNumber }) {
        let identifier = "Block";
        if (blockHash)
          identifier = `Block at hash "${blockHash}"`;
        if (blockNumber)
          identifier = `Block at number "${blockNumber}"`;
        super(`${identifier} could not be found.`, { name: "BlockNotFoundError" });
      }
    };
    exports.BlockNotFoundError = BlockNotFoundError;
  }
});

// node_modules/viem/_cjs/utils/formatters/transaction.js
var require_transaction2 = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/transaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defineTransaction = exports.transactionType = void 0;
    exports.formatTransaction = formatTransaction;
    var fromHex_js_1 = require_fromHex();
    var formatter_js_1 = require_formatter();
    exports.transactionType = {
      "0x0": "legacy",
      "0x1": "eip2930",
      "0x2": "eip1559",
      "0x3": "eip4844",
      "0x4": "eip7702"
    };
    function formatTransaction(transaction) {
      const transaction_ = {
        ...transaction,
        blockHash: transaction.blockHash ? transaction.blockHash : null,
        blockNumber: transaction.blockNumber ? BigInt(transaction.blockNumber) : null,
        chainId: transaction.chainId ? (0, fromHex_js_1.hexToNumber)(transaction.chainId) : void 0,
        gas: transaction.gas ? BigInt(transaction.gas) : void 0,
        gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : void 0,
        maxFeePerBlobGas: transaction.maxFeePerBlobGas ? BigInt(transaction.maxFeePerBlobGas) : void 0,
        maxFeePerGas: transaction.maxFeePerGas ? BigInt(transaction.maxFeePerGas) : void 0,
        maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ? BigInt(transaction.maxPriorityFeePerGas) : void 0,
        nonce: transaction.nonce ? (0, fromHex_js_1.hexToNumber)(transaction.nonce) : void 0,
        to: transaction.to ? transaction.to : null,
        transactionIndex: transaction.transactionIndex ? Number(transaction.transactionIndex) : null,
        type: transaction.type ? exports.transactionType[transaction.type] : void 0,
        typeHex: transaction.type ? transaction.type : void 0,
        value: transaction.value ? BigInt(transaction.value) : void 0,
        v: transaction.v ? BigInt(transaction.v) : void 0
      };
      if (transaction.authorizationList)
        transaction_.authorizationList = formatAuthorizationList(transaction.authorizationList);
      transaction_.yParity = (() => {
        if (transaction.yParity)
          return Number(transaction.yParity);
        if (typeof transaction_.v === "bigint") {
          if (transaction_.v === 0n || transaction_.v === 27n)
            return 0;
          if (transaction_.v === 1n || transaction_.v === 28n)
            return 1;
          if (transaction_.v >= 35n)
            return transaction_.v % 2n === 0n ? 1 : 0;
        }
        return void 0;
      })();
      if (transaction_.type === "legacy") {
        delete transaction_.accessList;
        delete transaction_.maxFeePerBlobGas;
        delete transaction_.maxFeePerGas;
        delete transaction_.maxPriorityFeePerGas;
        delete transaction_.yParity;
      }
      if (transaction_.type === "eip2930") {
        delete transaction_.maxFeePerBlobGas;
        delete transaction_.maxFeePerGas;
        delete transaction_.maxPriorityFeePerGas;
      }
      if (transaction_.type === "eip1559") {
        delete transaction_.maxFeePerBlobGas;
      }
      return transaction_;
    }
    exports.defineTransaction = (0, formatter_js_1.defineFormatter)("transaction", formatTransaction);
    function formatAuthorizationList(authorizationList) {
      return authorizationList.map((authorization) => ({
        contractAddress: authorization.address,
        chainId: Number(authorization.chainId),
        nonce: Number(authorization.nonce),
        r: authorization.r,
        s: authorization.s,
        yParity: Number(authorization.yParity)
      }));
    }
  }
});

// node_modules/viem/_cjs/utils/formatters/block.js
var require_block2 = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/block.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defineBlock = void 0;
    exports.formatBlock = formatBlock;
    var formatter_js_1 = require_formatter();
    var transaction_js_1 = require_transaction2();
    function formatBlock(block) {
      const transactions = (block.transactions ?? []).map((transaction) => {
        if (typeof transaction === "string")
          return transaction;
        return (0, transaction_js_1.formatTransaction)(transaction);
      });
      return {
        ...block,
        baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
        blobGasUsed: block.blobGasUsed ? BigInt(block.blobGasUsed) : void 0,
        difficulty: block.difficulty ? BigInt(block.difficulty) : void 0,
        excessBlobGas: block.excessBlobGas ? BigInt(block.excessBlobGas) : void 0,
        gasLimit: block.gasLimit ? BigInt(block.gasLimit) : void 0,
        gasUsed: block.gasUsed ? BigInt(block.gasUsed) : void 0,
        hash: block.hash ? block.hash : null,
        logsBloom: block.logsBloom ? block.logsBloom : null,
        nonce: block.nonce ? block.nonce : null,
        number: block.number ? BigInt(block.number) : null,
        size: block.size ? BigInt(block.size) : void 0,
        timestamp: block.timestamp ? BigInt(block.timestamp) : void 0,
        transactions,
        totalDifficulty: block.totalDifficulty ? BigInt(block.totalDifficulty) : null
      };
    }
    exports.defineBlock = (0, formatter_js_1.defineFormatter)("block", formatBlock);
  }
});

// node_modules/viem/_cjs/actions/public/getBlock.js
var require_getBlock = __commonJS({
  "node_modules/viem/_cjs/actions/public/getBlock.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBlock = getBlock;
    var block_js_1 = require_block();
    var toHex_js_1 = require_toHex();
    var block_js_2 = require_block2();
    async function getBlock(client, { blockHash, blockNumber, blockTag: blockTag_, includeTransactions: includeTransactions_ } = {}) {
      var _a, _b, _c;
      const blockTag = blockTag_ ?? "latest";
      const includeTransactions = includeTransactions_ ?? false;
      const blockNumberHex = blockNumber !== void 0 ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      let block = null;
      if (blockHash) {
        block = await client.request({
          method: "eth_getBlockByHash",
          params: [blockHash, includeTransactions]
        }, { dedupe: true });
      } else {
        block = await client.request({
          method: "eth_getBlockByNumber",
          params: [blockNumberHex || blockTag, includeTransactions]
        }, { dedupe: Boolean(blockNumberHex) });
      }
      if (!block)
        throw new block_js_1.BlockNotFoundError({ blockHash, blockNumber });
      const format = ((_c = (_b = (_a = client.chain) == null ? void 0 : _a.formatters) == null ? void 0 : _b.block) == null ? void 0 : _c.format) || block_js_2.formatBlock;
      return format(block);
    }
  }
});

// node_modules/viem/_cjs/actions/public/getGasPrice.js
var require_getGasPrice = __commonJS({
  "node_modules/viem/_cjs/actions/public/getGasPrice.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getGasPrice = getGasPrice;
    async function getGasPrice(client) {
      const gasPrice = await client.request({
        method: "eth_gasPrice"
      });
      return BigInt(gasPrice);
    }
  }
});

// node_modules/viem/_cjs/actions/public/estimateMaxPriorityFeePerGas.js
var require_estimateMaxPriorityFeePerGas = __commonJS({
  "node_modules/viem/_cjs/actions/public/estimateMaxPriorityFeePerGas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.estimateMaxPriorityFeePerGas = estimateMaxPriorityFeePerGas;
    exports.internal_estimateMaxPriorityFeePerGas = internal_estimateMaxPriorityFeePerGas;
    var fee_js_1 = require_fee();
    var fromHex_js_1 = require_fromHex();
    var getAction_js_1 = require_getAction();
    var getBlock_js_1 = require_getBlock();
    var getGasPrice_js_1 = require_getGasPrice();
    async function estimateMaxPriorityFeePerGas(client, args) {
      return internal_estimateMaxPriorityFeePerGas(client, args);
    }
    async function internal_estimateMaxPriorityFeePerGas(client, args) {
      var _a, _b;
      const { block: block_, chain = client.chain, request } = args || {};
      try {
        const maxPriorityFeePerGas = ((_a = chain == null ? void 0 : chain.fees) == null ? void 0 : _a.maxPriorityFeePerGas) ?? ((_b = chain == null ? void 0 : chain.fees) == null ? void 0 : _b.defaultPriorityFee);
        if (typeof maxPriorityFeePerGas === "function") {
          const block = block_ || await (0, getAction_js_1.getAction)(client, getBlock_js_1.getBlock, "getBlock")({});
          const maxPriorityFeePerGas_ = await maxPriorityFeePerGas({
            block,
            client,
            request
          });
          if (maxPriorityFeePerGas_ === null)
            throw new Error();
          return maxPriorityFeePerGas_;
        }
        if (typeof maxPriorityFeePerGas !== "undefined")
          return maxPriorityFeePerGas;
        const maxPriorityFeePerGasHex = await client.request({
          method: "eth_maxPriorityFeePerGas"
        });
        return (0, fromHex_js_1.hexToBigInt)(maxPriorityFeePerGasHex);
      } catch {
        const [block, gasPrice] = await Promise.all([
          block_ ? Promise.resolve(block_) : (0, getAction_js_1.getAction)(client, getBlock_js_1.getBlock, "getBlock")({}),
          (0, getAction_js_1.getAction)(client, getGasPrice_js_1.getGasPrice, "getGasPrice")({})
        ]);
        if (typeof block.baseFeePerGas !== "bigint")
          throw new fee_js_1.Eip1559FeesNotSupportedError();
        const maxPriorityFeePerGas = gasPrice - block.baseFeePerGas;
        if (maxPriorityFeePerGas < 0n)
          return 0n;
        return maxPriorityFeePerGas;
      }
    }
  }
});

// node_modules/viem/_cjs/actions/public/estimateFeesPerGas.js
var require_estimateFeesPerGas = __commonJS({
  "node_modules/viem/_cjs/actions/public/estimateFeesPerGas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.estimateFeesPerGas = estimateFeesPerGas;
    exports.internal_estimateFeesPerGas = internal_estimateFeesPerGas;
    var fee_js_1 = require_fee();
    var getAction_js_1 = require_getAction();
    var estimateMaxPriorityFeePerGas_js_1 = require_estimateMaxPriorityFeePerGas();
    var getBlock_js_1 = require_getBlock();
    var getGasPrice_js_1 = require_getGasPrice();
    async function estimateFeesPerGas(client, args) {
      return internal_estimateFeesPerGas(client, args);
    }
    async function internal_estimateFeesPerGas(client, args) {
      var _a, _b;
      const { block: block_, chain = client.chain, request, type = "eip1559" } = args || {};
      const baseFeeMultiplier = await (async () => {
        var _a2, _b2;
        if (typeof ((_a2 = chain == null ? void 0 : chain.fees) == null ? void 0 : _a2.baseFeeMultiplier) === "function")
          return chain.fees.baseFeeMultiplier({
            block: block_,
            client,
            request
          });
        return ((_b2 = chain == null ? void 0 : chain.fees) == null ? void 0 : _b2.baseFeeMultiplier) ?? 1.2;
      })();
      if (baseFeeMultiplier < 1)
        throw new fee_js_1.BaseFeeScalarError();
      const decimals = ((_a = baseFeeMultiplier.toString().split(".")[1]) == null ? void 0 : _a.length) ?? 0;
      const denominator = 10 ** decimals;
      const multiply = (base) => base * BigInt(Math.ceil(baseFeeMultiplier * denominator)) / BigInt(denominator);
      const block = block_ ? block_ : await (0, getAction_js_1.getAction)(client, getBlock_js_1.getBlock, "getBlock")({});
      if (typeof ((_b = chain == null ? void 0 : chain.fees) == null ? void 0 : _b.estimateFeesPerGas) === "function") {
        const fees = await chain.fees.estimateFeesPerGas({
          block: block_,
          client,
          multiply,
          request,
          type
        });
        if (fees !== null)
          return fees;
      }
      if (type === "eip1559") {
        if (typeof block.baseFeePerGas !== "bigint")
          throw new fee_js_1.Eip1559FeesNotSupportedError();
        const maxPriorityFeePerGas = typeof (request == null ? void 0 : request.maxPriorityFeePerGas) === "bigint" ? request.maxPriorityFeePerGas : await (0, estimateMaxPriorityFeePerGas_js_1.internal_estimateMaxPriorityFeePerGas)(client, {
          block,
          chain,
          request
        });
        const baseFeePerGas = multiply(block.baseFeePerGas);
        const maxFeePerGas = (request == null ? void 0 : request.maxFeePerGas) ?? baseFeePerGas + maxPriorityFeePerGas;
        return {
          maxFeePerGas,
          maxPriorityFeePerGas
        };
      }
      const gasPrice = (request == null ? void 0 : request.gasPrice) ?? multiply(await (0, getAction_js_1.getAction)(client, getGasPrice_js_1.getGasPrice, "getGasPrice")({}));
      return {
        gasPrice
      };
    }
  }
});

// node_modules/viem/_cjs/actions/public/getTransactionCount.js
var require_getTransactionCount = __commonJS({
  "node_modules/viem/_cjs/actions/public/getTransactionCount.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTransactionCount = getTransactionCount;
    var fromHex_js_1 = require_fromHex();
    var toHex_js_1 = require_toHex();
    async function getTransactionCount(client, { address, blockTag = "latest", blockNumber }) {
      const count = await client.request({
        method: "eth_getTransactionCount",
        params: [address, blockNumber ? (0, toHex_js_1.numberToHex)(blockNumber) : blockTag]
      }, { dedupe: Boolean(blockNumber) });
      return (0, fromHex_js_1.hexToNumber)(count);
    }
  }
});

// node_modules/viem/_cjs/utils/blob/blobsToCommitments.js
var require_blobsToCommitments = __commonJS({
  "node_modules/viem/_cjs/utils/blob/blobsToCommitments.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.blobsToCommitments = blobsToCommitments;
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    function blobsToCommitments(parameters) {
      const { kzg } = parameters;
      const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
      const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => (0, toBytes_js_1.hexToBytes)(x)) : parameters.blobs;
      const commitments = [];
      for (const blob of blobs)
        commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
      return to === "bytes" ? commitments : commitments.map((x) => (0, toHex_js_1.bytesToHex)(x));
    }
  }
});

// node_modules/viem/_cjs/utils/blob/blobsToProofs.js
var require_blobsToProofs = __commonJS({
  "node_modules/viem/_cjs/utils/blob/blobsToProofs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.blobsToProofs = blobsToProofs;
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    function blobsToProofs(parameters) {
      const { kzg } = parameters;
      const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
      const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => (0, toBytes_js_1.hexToBytes)(x)) : parameters.blobs;
      const commitments = typeof parameters.commitments[0] === "string" ? parameters.commitments.map((x) => (0, toBytes_js_1.hexToBytes)(x)) : parameters.commitments;
      const proofs = [];
      for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];
        const commitment = commitments[i];
        proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
      }
      return to === "bytes" ? proofs : proofs.map((x) => (0, toHex_js_1.bytesToHex)(x));
    }
  }
});

// node_modules/viem/node_modules/@noble/hashes/_md.js
var require_md2 = __commonJS({
  "node_modules/viem/node_modules/@noble/hashes/_md.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HashMD = exports.Maj = exports.Chi = void 0;
    var _assert_js_1 = require_assert();
    var utils_js_1 = require_utils3();
    function setBigUint64(view, byteOffset, value, isLE) {
      if (typeof view.setBigUint64 === "function")
        return view.setBigUint64(byteOffset, value, isLE);
      const _32n = BigInt(32);
      const _u32_max = BigInt(4294967295);
      const wh = Number(value >> _32n & _u32_max);
      const wl = Number(value & _u32_max);
      const h = isLE ? 4 : 0;
      const l = isLE ? 0 : 4;
      view.setUint32(byteOffset + h, wh, isLE);
      view.setUint32(byteOffset + l, wl, isLE);
    }
    var Chi = (a, b, c) => a & b ^ ~a & c;
    exports.Chi = Chi;
    var Maj = (a, b, c) => a & b ^ a & c ^ b & c;
    exports.Maj = Maj;
    var HashMD = class extends utils_js_1.Hash {
      constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.buffer = new Uint8Array(blockLen);
        this.view = (0, utils_js_1.createView)(this.buffer);
      }
      update(data) {
        (0, _assert_js_1.aexists)(this);
        const { view, buffer, blockLen } = this;
        data = (0, utils_js_1.toBytes)(data);
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = (0, utils_js_1.createView)(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            continue;
          }
          buffer.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
            this.pos = 0;
          }
        }
        this.length += data.length;
        this.roundClean();
        return this;
      }
      digestInto(out) {
        (0, _assert_js_1.aexists)(this);
        (0, _assert_js_1.aoutput)(out, this);
        this.finished = true;
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        this.buffer.subarray(pos).fill(0);
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          pos = 0;
        }
        for (let i = pos; i < blockLen; i++)
          buffer[i] = 0;
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = (0, utils_js_1.createView)(out);
        const len = this.outputLen;
        if (len % 4)
          throw new Error("_sha2: outputLen should be aligned to 32bit");
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
          throw new Error("_sha2: outputLen bigger than state");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.length = length;
        to.pos = pos;
        to.finished = finished;
        to.destroyed = destroyed;
        if (length % blockLen)
          to.buffer.set(buffer);
        return to;
      }
    };
    exports.HashMD = HashMD;
  }
});

// node_modules/viem/node_modules/@noble/hashes/sha256.js
var require_sha2562 = __commonJS({
  "node_modules/viem/node_modules/@noble/hashes/sha256.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha224 = exports.sha256 = exports.SHA256 = void 0;
    var _md_js_1 = require_md2();
    var utils_js_1 = require_utils3();
    var SHA256_K = new Uint32Array([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    var SHA256_IV = new Uint32Array([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    var SHA256_W = new Uint32Array(64);
    var SHA256 = class extends _md_js_1.HashMD {
      constructor() {
        super(64, 32, 8, false);
        this.A = SHA256_IV[0] | 0;
        this.B = SHA256_IV[1] | 0;
        this.C = SHA256_IV[2] | 0;
        this.D = SHA256_IV[3] | 0;
        this.E = SHA256_IV[4] | 0;
        this.F = SHA256_IV[5] | 0;
        this.G = SHA256_IV[6] | 0;
        this.H = SHA256_IV[7] | 0;
      }
      get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
      }
      // prettier-ignore
      set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
          const W15 = SHA256_W[i - 15];
          const W2 = SHA256_W[i - 2];
          const s0 = (0, utils_js_1.rotr)(W15, 7) ^ (0, utils_js_1.rotr)(W15, 18) ^ W15 >>> 3;
          const s1 = (0, utils_js_1.rotr)(W2, 17) ^ (0, utils_js_1.rotr)(W2, 19) ^ W2 >>> 10;
          SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
        }
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
          const sigma1 = (0, utils_js_1.rotr)(E, 6) ^ (0, utils_js_1.rotr)(E, 11) ^ (0, utils_js_1.rotr)(E, 25);
          const T1 = H + sigma1 + (0, _md_js_1.Chi)(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
          const sigma0 = (0, utils_js_1.rotr)(A, 2) ^ (0, utils_js_1.rotr)(A, 13) ^ (0, utils_js_1.rotr)(A, 22);
          const T2 = sigma0 + (0, _md_js_1.Maj)(A, B, C) | 0;
          H = G;
          G = F;
          F = E;
          E = D + T1 | 0;
          D = C;
          C = B;
          B = A;
          A = T1 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
      }
      roundClean() {
        SHA256_W.fill(0);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        this.buffer.fill(0);
      }
    };
    exports.SHA256 = SHA256;
    var SHA224 = class extends SHA256 {
      constructor() {
        super();
        this.A = 3238371032 | 0;
        this.B = 914150663 | 0;
        this.C = 812702999 | 0;
        this.D = 4144912697 | 0;
        this.E = 4290775857 | 0;
        this.F = 1750603025 | 0;
        this.G = 1694076839 | 0;
        this.H = 3204075428 | 0;
        this.outputLen = 28;
      }
    };
    exports.sha256 = (0, utils_js_1.wrapConstructor)(() => new SHA256());
    exports.sha224 = (0, utils_js_1.wrapConstructor)(() => new SHA224());
  }
});

// node_modules/viem/_cjs/utils/hash/sha256.js
var require_sha2563 = __commonJS({
  "node_modules/viem/_cjs/utils/hash/sha256.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha256 = sha256;
    var sha256_1 = require_sha2562();
    var isHex_js_1 = require_isHex();
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    function sha256(value, to_) {
      const to = to_ || "hex";
      const bytes = (0, sha256_1.sha256)((0, isHex_js_1.isHex)(value, { strict: false }) ? (0, toBytes_js_1.toBytes)(value) : value);
      if (to === "bytes")
        return bytes;
      return (0, toHex_js_1.toHex)(bytes);
    }
  }
});

// node_modules/viem/_cjs/utils/blob/commitmentToVersionedHash.js
var require_commitmentToVersionedHash = __commonJS({
  "node_modules/viem/_cjs/utils/blob/commitmentToVersionedHash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.commitmentToVersionedHash = commitmentToVersionedHash;
    var toHex_js_1 = require_toHex();
    var sha256_js_1 = require_sha2563();
    function commitmentToVersionedHash(parameters) {
      const { commitment, version = 1 } = parameters;
      const to = parameters.to ?? (typeof commitment === "string" ? "hex" : "bytes");
      const versionedHash = (0, sha256_js_1.sha256)(commitment, "bytes");
      versionedHash.set([version], 0);
      return to === "bytes" ? versionedHash : (0, toHex_js_1.bytesToHex)(versionedHash);
    }
  }
});

// node_modules/viem/_cjs/utils/blob/commitmentsToVersionedHashes.js
var require_commitmentsToVersionedHashes = __commonJS({
  "node_modules/viem/_cjs/utils/blob/commitmentsToVersionedHashes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.commitmentsToVersionedHashes = commitmentsToVersionedHashes;
    var commitmentToVersionedHash_js_1 = require_commitmentToVersionedHash();
    function commitmentsToVersionedHashes(parameters) {
      const { commitments, version } = parameters;
      const to = parameters.to ?? (typeof commitments[0] === "string" ? "hex" : "bytes");
      const hashes = [];
      for (const commitment of commitments) {
        hashes.push((0, commitmentToVersionedHash_js_1.commitmentToVersionedHash)({
          commitment,
          to,
          version
        }));
      }
      return hashes;
    }
  }
});

// node_modules/viem/_cjs/constants/blob.js
var require_blob = __commonJS({
  "node_modules/viem/_cjs/constants/blob.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.maxBytesPerTransaction = exports.bytesPerBlob = exports.fieldElementsPerBlob = exports.bytesPerFieldElement = void 0;
    var blobsPerTransaction = 6;
    exports.bytesPerFieldElement = 32;
    exports.fieldElementsPerBlob = 4096;
    exports.bytesPerBlob = exports.bytesPerFieldElement * exports.fieldElementsPerBlob;
    exports.maxBytesPerTransaction = exports.bytesPerBlob * blobsPerTransaction - 1 - 1 * exports.fieldElementsPerBlob * blobsPerTransaction;
  }
});

// node_modules/viem/_cjs/constants/kzg.js
var require_kzg = __commonJS({
  "node_modules/viem/_cjs/constants/kzg.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.versionedHashVersionKzg = void 0;
    exports.versionedHashVersionKzg = 1;
  }
});

// node_modules/viem/_cjs/errors/blob.js
var require_blob2 = __commonJS({
  "node_modules/viem/_cjs/errors/blob.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidVersionedHashVersionError = exports.InvalidVersionedHashSizeError = exports.EmptyBlobError = exports.BlobSizeTooLargeError = void 0;
    var kzg_js_1 = require_kzg();
    var base_js_1 = require_base();
    var BlobSizeTooLargeError = class extends base_js_1.BaseError {
      constructor({ maxSize, size }) {
        super("Blob size is too large.", {
          metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size} bytes`],
          name: "BlobSizeTooLargeError"
        });
      }
    };
    exports.BlobSizeTooLargeError = BlobSizeTooLargeError;
    var EmptyBlobError = class extends base_js_1.BaseError {
      constructor() {
        super("Blob data must not be empty.", { name: "EmptyBlobError" });
      }
    };
    exports.EmptyBlobError = EmptyBlobError;
    var InvalidVersionedHashSizeError = class extends base_js_1.BaseError {
      constructor({ hash, size }) {
        super(`Versioned hash "${hash}" size is invalid.`, {
          metaMessages: ["Expected: 32", `Received: ${size}`],
          name: "InvalidVersionedHashSizeError"
        });
      }
    };
    exports.InvalidVersionedHashSizeError = InvalidVersionedHashSizeError;
    var InvalidVersionedHashVersionError = class extends base_js_1.BaseError {
      constructor({ hash, version }) {
        super(`Versioned hash "${hash}" version is invalid.`, {
          metaMessages: [
            `Expected: ${kzg_js_1.versionedHashVersionKzg}`,
            `Received: ${version}`
          ],
          name: "InvalidVersionedHashVersionError"
        });
      }
    };
    exports.InvalidVersionedHashVersionError = InvalidVersionedHashVersionError;
  }
});

// node_modules/viem/_cjs/utils/blob/toBlobs.js
var require_toBlobs = __commonJS({
  "node_modules/viem/_cjs/utils/blob/toBlobs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toBlobs = toBlobs;
    var blob_js_1 = require_blob();
    var blob_js_2 = require_blob2();
    var cursor_js_1 = require_cursor2();
    var size_js_1 = require_size();
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    function toBlobs(parameters) {
      const to = parameters.to ?? (typeof parameters.data === "string" ? "hex" : "bytes");
      const data = typeof parameters.data === "string" ? (0, toBytes_js_1.hexToBytes)(parameters.data) : parameters.data;
      const size_ = (0, size_js_1.size)(data);
      if (!size_)
        throw new blob_js_2.EmptyBlobError();
      if (size_ > blob_js_1.maxBytesPerTransaction)
        throw new blob_js_2.BlobSizeTooLargeError({
          maxSize: blob_js_1.maxBytesPerTransaction,
          size: size_
        });
      const blobs = [];
      let active = true;
      let position = 0;
      while (active) {
        const blob = (0, cursor_js_1.createCursor)(new Uint8Array(blob_js_1.bytesPerBlob));
        let size = 0;
        while (size < blob_js_1.fieldElementsPerBlob) {
          const bytes = data.slice(position, position + (blob_js_1.bytesPerFieldElement - 1));
          blob.pushByte(0);
          blob.pushBytes(bytes);
          if (bytes.length < 31) {
            blob.pushByte(128);
            active = false;
            break;
          }
          size++;
          position += 31;
        }
        blobs.push(blob);
      }
      return to === "bytes" ? blobs.map((x) => x.bytes) : blobs.map((x) => (0, toHex_js_1.bytesToHex)(x.bytes));
    }
  }
});

// node_modules/viem/_cjs/utils/blob/toBlobSidecars.js
var require_toBlobSidecars = __commonJS({
  "node_modules/viem/_cjs/utils/blob/toBlobSidecars.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toBlobSidecars = toBlobSidecars;
    var blobsToCommitments_js_1 = require_blobsToCommitments();
    var blobsToProofs_js_1 = require_blobsToProofs();
    var toBlobs_js_1 = require_toBlobs();
    function toBlobSidecars(parameters) {
      const { data, kzg, to } = parameters;
      const blobs = parameters.blobs ?? (0, toBlobs_js_1.toBlobs)({ data, to });
      const commitments = parameters.commitments ?? (0, blobsToCommitments_js_1.blobsToCommitments)({ blobs, kzg, to });
      const proofs = parameters.proofs ?? (0, blobsToProofs_js_1.blobsToProofs)({ blobs, commitments, kzg, to });
      const sidecars = [];
      for (let i = 0; i < blobs.length; i++)
        sidecars.push({
          blob: blobs[i],
          commitment: commitments[i],
          proof: proofs[i]
        });
      return sidecars;
    }
  }
});

// node_modules/viem/_cjs/utils/transaction/getTransactionType.js
var require_getTransactionType = __commonJS({
  "node_modules/viem/_cjs/utils/transaction/getTransactionType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTransactionType = getTransactionType;
    var transaction_js_1 = require_transaction();
    function getTransactionType(transaction) {
      if (transaction.type)
        return transaction.type;
      if (typeof transaction.authorizationList !== "undefined")
        return "eip7702";
      if (typeof transaction.blobs !== "undefined" || typeof transaction.blobVersionedHashes !== "undefined" || typeof transaction.maxFeePerBlobGas !== "undefined" || typeof transaction.sidecars !== "undefined")
        return "eip4844";
      if (typeof transaction.maxFeePerGas !== "undefined" || typeof transaction.maxPriorityFeePerGas !== "undefined") {
        return "eip1559";
      }
      if (typeof transaction.gasPrice !== "undefined") {
        if (typeof transaction.accessList !== "undefined")
          return "eip2930";
        return "legacy";
      }
      throw new transaction_js_1.InvalidSerializableTransactionError({ transaction });
    }
  }
});

// node_modules/viem/_cjs/actions/public/getChainId.js
var require_getChainId = __commonJS({
  "node_modules/viem/_cjs/actions/public/getChainId.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getChainId = getChainId;
    var fromHex_js_1 = require_fromHex();
    async function getChainId(client) {
      const chainIdHex = await client.request({
        method: "eth_chainId"
      }, { dedupe: true });
      return (0, fromHex_js_1.hexToNumber)(chainIdHex);
    }
  }
});

// node_modules/viem/_cjs/actions/wallet/prepareTransactionRequest.js
var require_prepareTransactionRequest = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/prepareTransactionRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultParameters = void 0;
    exports.prepareTransactionRequest = prepareTransactionRequest;
    var parseAccount_js_1 = require_parseAccount();
    var estimateFeesPerGas_js_1 = require_estimateFeesPerGas();
    var estimateGas_js_1 = require_estimateGas2();
    var getBlock_js_1 = require_getBlock();
    var getTransactionCount_js_1 = require_getTransactionCount();
    var fee_js_1 = require_fee();
    var blobsToCommitments_js_1 = require_blobsToCommitments();
    var blobsToProofs_js_1 = require_blobsToProofs();
    var commitmentsToVersionedHashes_js_1 = require_commitmentsToVersionedHashes();
    var toBlobSidecars_js_1 = require_toBlobSidecars();
    var getAction_js_1 = require_getAction();
    var assertRequest_js_1 = require_assertRequest();
    var getTransactionType_js_1 = require_getTransactionType();
    var getChainId_js_1 = require_getChainId();
    exports.defaultParameters = [
      "blobVersionedHashes",
      "chainId",
      "fees",
      "gas",
      "nonce",
      "type"
    ];
    async function prepareTransactionRequest(client, args) {
      const { account: account_ = client.account, blobs, chain, gas, kzg, nonce, nonceManager, parameters = exports.defaultParameters, type } = args;
      const account = account_ ? (0, parseAccount_js_1.parseAccount)(account_) : account_;
      const request = { ...args, ...account ? { from: account == null ? void 0 : account.address } : {} };
      let block;
      async function getBlock() {
        if (block)
          return block;
        block = await (0, getAction_js_1.getAction)(client, getBlock_js_1.getBlock, "getBlock")({ blockTag: "latest" });
        return block;
      }
      let chainId;
      async function getChainId() {
        if (chainId)
          return chainId;
        if (chain)
          return chain.id;
        if (typeof args.chainId !== "undefined")
          return args.chainId;
        const chainId_ = await (0, getAction_js_1.getAction)(client, getChainId_js_1.getChainId, "getChainId")({});
        chainId = chainId_;
        return chainId;
      }
      if ((parameters.includes("blobVersionedHashes") || parameters.includes("sidecars")) && blobs && kzg) {
        const commitments = (0, blobsToCommitments_js_1.blobsToCommitments)({ blobs, kzg });
        if (parameters.includes("blobVersionedHashes")) {
          const versionedHashes = (0, commitmentsToVersionedHashes_js_1.commitmentsToVersionedHashes)({
            commitments,
            to: "hex"
          });
          request.blobVersionedHashes = versionedHashes;
        }
        if (parameters.includes("sidecars")) {
          const proofs = (0, blobsToProofs_js_1.blobsToProofs)({ blobs, commitments, kzg });
          const sidecars = (0, toBlobSidecars_js_1.toBlobSidecars)({
            blobs,
            commitments,
            proofs,
            to: "hex"
          });
          request.sidecars = sidecars;
        }
      }
      if (parameters.includes("chainId"))
        request.chainId = await getChainId();
      if ((parameters.includes("fees") || parameters.includes("type")) && typeof type === "undefined") {
        try {
          request.type = (0, getTransactionType_js_1.getTransactionType)(request);
        } catch {
          const block2 = await getBlock();
          request.type = typeof (block2 == null ? void 0 : block2.baseFeePerGas) === "bigint" ? "eip1559" : "legacy";
        }
      }
      if (parameters.includes("fees")) {
        if (request.type !== "legacy" && request.type !== "eip2930") {
          if (typeof request.maxFeePerGas === "undefined" || typeof request.maxPriorityFeePerGas === "undefined") {
            const block2 = await getBlock();
            const { maxFeePerGas, maxPriorityFeePerGas } = await (0, estimateFeesPerGas_js_1.internal_estimateFeesPerGas)(client, {
              block: block2,
              chain,
              request
            });
            if (typeof args.maxPriorityFeePerGas === "undefined" && args.maxFeePerGas && args.maxFeePerGas < maxPriorityFeePerGas)
              throw new fee_js_1.MaxFeePerGasTooLowError({
                maxPriorityFeePerGas
              });
            request.maxPriorityFeePerGas = maxPriorityFeePerGas;
            request.maxFeePerGas = maxFeePerGas;
          }
        } else {
          if (typeof args.maxFeePerGas !== "undefined" || typeof args.maxPriorityFeePerGas !== "undefined")
            throw new fee_js_1.Eip1559FeesNotSupportedError();
          const block2 = await getBlock();
          const { gasPrice: gasPrice_ } = await (0, estimateFeesPerGas_js_1.internal_estimateFeesPerGas)(client, {
            block: block2,
            chain,
            request,
            type: "legacy"
          });
          request.gasPrice = gasPrice_;
        }
      }
      if (parameters.includes("gas") && typeof gas === "undefined")
        request.gas = await (0, getAction_js_1.getAction)(client, estimateGas_js_1.estimateGas, "estimateGas")({
          ...request,
          account: account ? { address: account.address, type: "json-rpc" } : account
        });
      if (parameters.includes("nonce") && typeof nonce === "undefined" && account) {
        if (nonceManager) {
          const chainId2 = await getChainId();
          request.nonce = await nonceManager.consume({
            address: account.address,
            chainId: chainId2,
            client
          });
        } else {
          request.nonce = await (0, getAction_js_1.getAction)(client, getTransactionCount_js_1.getTransactionCount, "getTransactionCount")({
            address: account.address,
            blockTag: "pending"
          });
        }
      }
      (0, assertRequest_js_1.assertRequest)(request);
      delete request.parameters;
      return request;
    }
  }
});

// node_modules/viem/_cjs/actions/public/getBalance.js
var require_getBalance = __commonJS({
  "node_modules/viem/_cjs/actions/public/getBalance.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBalance = getBalance;
    var toHex_js_1 = require_toHex();
    async function getBalance(client, { address, blockNumber, blockTag = "latest" }) {
      const blockNumberHex = blockNumber ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      const balance = await client.request({
        method: "eth_getBalance",
        params: [address, blockNumberHex || blockTag]
      });
      return BigInt(balance);
    }
  }
});

// node_modules/viem/_cjs/actions/public/estimateGas.js
var require_estimateGas2 = __commonJS({
  "node_modules/viem/_cjs/actions/public/estimateGas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.estimateGas = estimateGas;
    var parseAccount_js_1 = require_parseAccount();
    var base_js_1 = require_base();
    var recoverAuthorizationAddress_js_1 = require_recoverAuthorizationAddress();
    var toHex_js_1 = require_toHex();
    var getEstimateGasError_js_1 = require_getEstimateGasError();
    var extract_js_1 = require_extract();
    var transactionRequest_js_1 = require_transactionRequest();
    var stateOverride_js_1 = require_stateOverride2();
    var assertRequest_js_1 = require_assertRequest();
    var prepareTransactionRequest_js_1 = require_prepareTransactionRequest();
    var getBalance_js_1 = require_getBalance();
    async function estimateGas(client, args) {
      var _a, _b, _c;
      const { account: account_ = client.account } = args;
      const account = account_ ? (0, parseAccount_js_1.parseAccount)(account_) : void 0;
      try {
        let estimateGas_rpc = function(parameters) {
          const { block: block2, request: request2, rpcStateOverride: rpcStateOverride2 } = parameters;
          return client.request({
            method: "eth_estimateGas",
            params: rpcStateOverride2 ? [request2, block2 ?? "latest", rpcStateOverride2] : block2 ? [request2, block2] : [request2]
          });
        };
        const { accessList, authorizationList, blobs, blobVersionedHashes, blockNumber, blockTag, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, value, stateOverride, ...rest } = await (0, prepareTransactionRequest_js_1.prepareTransactionRequest)(client, {
          ...args,
          parameters: (account == null ? void 0 : account.type) === "local" ? void 0 : ["blobVersionedHashes"]
        });
        const blockNumberHex = blockNumber ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
        const block = blockNumberHex || blockTag;
        const rpcStateOverride = (0, stateOverride_js_1.serializeStateOverride)(stateOverride);
        const to = await (async () => {
          if (rest.to)
            return rest.to;
          if (authorizationList && authorizationList.length > 0)
            return await (0, recoverAuthorizationAddress_js_1.recoverAuthorizationAddress)({
              authorization: authorizationList[0]
            }).catch(() => {
              throw new base_js_1.BaseError("`to` is required. Could not infer from `authorizationList`");
            });
          return void 0;
        })();
        (0, assertRequest_js_1.assertRequest)(args);
        const chainFormat = (_c = (_b = (_a = client.chain) == null ? void 0 : _a.formatters) == null ? void 0 : _b.transactionRequest) == null ? void 0 : _c.format;
        const format = chainFormat || transactionRequest_js_1.formatTransactionRequest;
        const request = format({
          ...(0, extract_js_1.extract)(rest, { format: chainFormat }),
          from: account == null ? void 0 : account.address,
          accessList,
          authorizationList,
          blobs,
          blobVersionedHashes,
          data,
          gas,
          gasPrice,
          maxFeePerBlobGas,
          maxFeePerGas,
          maxPriorityFeePerGas,
          nonce,
          to,
          value
        });
        let estimate = BigInt(await estimateGas_rpc({ block, request, rpcStateOverride }));
        if (authorizationList) {
          const value2 = await (0, getBalance_js_1.getBalance)(client, { address: request.from });
          const estimates = await Promise.all(authorizationList.map(async (authorization) => {
            const { contractAddress } = authorization;
            const estimate2 = await estimateGas_rpc({
              block,
              request: {
                authorizationList: void 0,
                data,
                from: account == null ? void 0 : account.address,
                to: contractAddress,
                value: (0, toHex_js_1.numberToHex)(value2)
              },
              rpcStateOverride
            }).catch(() => 100000n);
            return 2n * BigInt(estimate2);
          }));
          estimate += estimates.reduce((acc, curr) => acc + curr, 0n);
        }
        return estimate;
      } catch (err) {
        throw (0, getEstimateGasError_js_1.getEstimateGasError)(err, {
          ...args,
          account,
          chain: client.chain
        });
      }
    }
  }
});

// node_modules/viem/_cjs/actions/public/estimateContractGas.js
var require_estimateContractGas = __commonJS({
  "node_modules/viem/_cjs/actions/public/estimateContractGas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.estimateContractGas = estimateContractGas;
    var parseAccount_js_1 = require_parseAccount();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var getContractError_js_1 = require_getContractError();
    var getAction_js_1 = require_getAction();
    var estimateGas_js_1 = require_estimateGas2();
    async function estimateContractGas(client, parameters) {
      const { abi, address, args, functionName, dataSuffix, ...request } = parameters;
      const data = (0, encodeFunctionData_js_1.encodeFunctionData)({
        abi,
        args,
        functionName
      });
      try {
        const gas = await (0, getAction_js_1.getAction)(client, estimateGas_js_1.estimateGas, "estimateGas")({
          data: `${data}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
          to: address,
          ...request
        });
        return gas;
      } catch (error) {
        const account = request.account ? (0, parseAccount_js_1.parseAccount)(request.account) : void 0;
        throw (0, getContractError_js_1.getContractError)(error, {
          abi,
          address,
          args,
          docsPath: "/docs/contract/estimateContractGas",
          functionName,
          sender: account == null ? void 0 : account.address
        });
      }
    }
  }
});

// node_modules/viem/_cjs/utils/address/isAddressEqual.js
var require_isAddressEqual = __commonJS({
  "node_modules/viem/_cjs/utils/address/isAddressEqual.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isAddressEqual = isAddressEqual;
    var address_js_1 = require_address();
    var isAddress_js_1 = require_isAddress();
    function isAddressEqual(a, b) {
      if (!(0, isAddress_js_1.isAddress)(a, { strict: false }))
        throw new address_js_1.InvalidAddressError({ address: a });
      if (!(0, isAddress_js_1.isAddress)(b, { strict: false }))
        throw new address_js_1.InvalidAddressError({ address: b });
      return a.toLowerCase() === b.toLowerCase();
    }
  }
});

// node_modules/viem/_cjs/utils/abi/decodeEventLog.js
var require_decodeEventLog = __commonJS({
  "node_modules/viem/_cjs/utils/abi/decodeEventLog.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeEventLog = decodeEventLog;
    var abi_js_1 = require_abi();
    var size_js_1 = require_size();
    var toEventSelector_js_1 = require_toEventSelector();
    var cursor_js_1 = require_cursor();
    var decodeAbiParameters_js_1 = require_decodeAbiParameters();
    var formatAbiItem_js_1 = require_formatAbiItem2();
    var docsPath = "/docs/contract/decodeEventLog";
    function decodeEventLog(parameters) {
      const { abi, data, strict: strict_, topics } = parameters;
      const strict = strict_ ?? true;
      const [signature, ...argTopics] = topics;
      if (!signature)
        throw new abi_js_1.AbiEventSignatureEmptyTopicsError({ docsPath });
      const abiItem = (() => {
        if (abi.length === 1)
          return abi[0];
        return abi.find((x) => x.type === "event" && signature === (0, toEventSelector_js_1.toEventSelector)((0, formatAbiItem_js_1.formatAbiItem)(x)));
      })();
      if (!(abiItem && "name" in abiItem) || abiItem.type !== "event")
        throw new abi_js_1.AbiEventSignatureNotFoundError(signature, { docsPath });
      const { name, inputs } = abiItem;
      const isUnnamed = inputs == null ? void 0 : inputs.some((x) => !("name" in x && x.name));
      let args = isUnnamed ? [] : {};
      const indexedInputs = inputs.filter((x) => "indexed" in x && x.indexed);
      for (let i = 0; i < indexedInputs.length; i++) {
        const param = indexedInputs[i];
        const topic = argTopics[i];
        if (!topic)
          throw new abi_js_1.DecodeLogTopicsMismatch({
            abiItem,
            param
          });
        args[isUnnamed ? i : param.name || i] = decodeTopic({ param, value: topic });
      }
      const nonIndexedInputs = inputs.filter((x) => !("indexed" in x && x.indexed));
      if (nonIndexedInputs.length > 0) {
        if (data && data !== "0x") {
          try {
            const decodedData = (0, decodeAbiParameters_js_1.decodeAbiParameters)(nonIndexedInputs, data);
            if (decodedData) {
              if (isUnnamed)
                args = [...args, ...decodedData];
              else {
                for (let i = 0; i < nonIndexedInputs.length; i++) {
                  args[nonIndexedInputs[i].name] = decodedData[i];
                }
              }
            }
          } catch (err) {
            if (strict) {
              if (err instanceof abi_js_1.AbiDecodingDataSizeTooSmallError || err instanceof cursor_js_1.PositionOutOfBoundsError)
                throw new abi_js_1.DecodeLogDataMismatch({
                  abiItem,
                  data,
                  params: nonIndexedInputs,
                  size: (0, size_js_1.size)(data)
                });
              throw err;
            }
          }
        } else if (strict) {
          throw new abi_js_1.DecodeLogDataMismatch({
            abiItem,
            data: "0x",
            params: nonIndexedInputs,
            size: 0
          });
        }
      }
      return {
        eventName: name,
        args: Object.values(args).length > 0 ? args : void 0
      };
    }
    function decodeTopic({ param, value }) {
      if (param.type === "string" || param.type === "bytes" || param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
        return value;
      const decodedArg = (0, decodeAbiParameters_js_1.decodeAbiParameters)([param], value) || [];
      return decodedArg[0];
    }
  }
});

// node_modules/viem/_cjs/utils/abi/parseEventLogs.js
var require_parseEventLogs = __commonJS({
  "node_modules/viem/_cjs/utils/abi/parseEventLogs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseEventLogs = parseEventLogs;
    var abi_js_1 = require_abi();
    var isAddressEqual_js_1 = require_isAddressEqual();
    var toBytes_js_1 = require_toBytes();
    var keccak256_js_1 = require_keccak256();
    var toEventSelector_js_1 = require_toEventSelector();
    var decodeEventLog_js_1 = require_decodeEventLog();
    function parseEventLogs(parameters) {
      const { abi, args, logs, strict = true } = parameters;
      const eventName = (() => {
        if (!parameters.eventName)
          return void 0;
        if (Array.isArray(parameters.eventName))
          return parameters.eventName;
        return [parameters.eventName];
      })();
      return logs.map((log) => {
        var _a;
        try {
          const abiItem = abi.find((abiItem2) => abiItem2.type === "event" && log.topics[0] === (0, toEventSelector_js_1.toEventSelector)(abiItem2));
          if (!abiItem)
            return null;
          const event = (0, decodeEventLog_js_1.decodeEventLog)({
            ...log,
            abi: [abiItem],
            strict
          });
          if (eventName && !eventName.includes(event.eventName))
            return null;
          if (!includesArgs({
            args: event.args,
            inputs: abiItem.inputs,
            matchArgs: args
          }))
            return null;
          return { ...event, ...log };
        } catch (err) {
          let eventName2;
          let isUnnamed;
          if (err instanceof abi_js_1.AbiEventSignatureNotFoundError)
            return null;
          if (err instanceof abi_js_1.DecodeLogDataMismatch || err instanceof abi_js_1.DecodeLogTopicsMismatch) {
            if (strict)
              return null;
            eventName2 = err.abiItem.name;
            isUnnamed = (_a = err.abiItem.inputs) == null ? void 0 : _a.some((x) => !("name" in x && x.name));
          }
          return { ...log, args: isUnnamed ? [] : {}, eventName: eventName2 };
        }
      }).filter(Boolean);
    }
    function includesArgs(parameters) {
      const { args, inputs, matchArgs } = parameters;
      if (!matchArgs)
        return true;
      if (!args)
        return false;
      function isEqual(input, value, arg) {
        try {
          if (input.type === "address")
            return (0, isAddressEqual_js_1.isAddressEqual)(value, arg);
          if (input.type === "string" || input.type === "bytes")
            return (0, keccak256_js_1.keccak256)((0, toBytes_js_1.toBytes)(value)) === arg;
          return value === arg;
        } catch {
          return false;
        }
      }
      if (Array.isArray(args) && Array.isArray(matchArgs)) {
        return matchArgs.every((value, index) => {
          if (value === null || value === void 0)
            return true;
          const input = inputs[index];
          if (!input)
            return false;
          const value_ = Array.isArray(value) ? value : [value];
          return value_.some((value2) => isEqual(input, value2, args[index]));
        });
      }
      if (typeof args === "object" && !Array.isArray(args) && typeof matchArgs === "object" && !Array.isArray(matchArgs))
        return Object.entries(matchArgs).every(([key, value]) => {
          if (value === null || value === void 0)
            return true;
          const input = inputs.find((input2) => input2.name === key);
          if (!input)
            return false;
          const value_ = Array.isArray(value) ? value : [value];
          return value_.some((value2) => isEqual(input, value2, args[key]));
        });
      return false;
    }
  }
});

// node_modules/viem/_cjs/utils/formatters/log.js
var require_log2 = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/log.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatLog = formatLog;
    function formatLog(log, { args, eventName } = {}) {
      return {
        ...log,
        blockHash: log.blockHash ? log.blockHash : null,
        blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
        logIndex: log.logIndex ? Number(log.logIndex) : null,
        transactionHash: log.transactionHash ? log.transactionHash : null,
        transactionIndex: log.transactionIndex ? Number(log.transactionIndex) : null,
        ...eventName ? { args, eventName } : {}
      };
    }
  }
});

// node_modules/viem/_cjs/actions/public/getLogs.js
var require_getLogs = __commonJS({
  "node_modules/viem/_cjs/actions/public/getLogs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getLogs = getLogs;
    var encodeEventTopics_js_1 = require_encodeEventTopics();
    var parseEventLogs_js_1 = require_parseEventLogs();
    var toHex_js_1 = require_toHex();
    var log_js_1 = require_log2();
    async function getLogs(client, { address, blockHash, fromBlock, toBlock, event, events: events_, args, strict: strict_ } = {}) {
      const strict = strict_ ?? false;
      const events = events_ ?? (event ? [event] : void 0);
      let topics = [];
      if (events) {
        const encoded = events.flatMap((event2) => (0, encodeEventTopics_js_1.encodeEventTopics)({
          abi: [event2],
          eventName: event2.name,
          args: events_ ? void 0 : args
        }));
        topics = [encoded];
        if (event)
          topics = topics[0];
      }
      let logs;
      if (blockHash) {
        logs = await client.request({
          method: "eth_getLogs",
          params: [{ address, topics, blockHash }]
        });
      } else {
        logs = await client.request({
          method: "eth_getLogs",
          params: [
            {
              address,
              topics,
              fromBlock: typeof fromBlock === "bigint" ? (0, toHex_js_1.numberToHex)(fromBlock) : fromBlock,
              toBlock: typeof toBlock === "bigint" ? (0, toHex_js_1.numberToHex)(toBlock) : toBlock
            }
          ]
        });
      }
      const formattedLogs = logs.map((log) => (0, log_js_1.formatLog)(log));
      if (!events)
        return formattedLogs;
      return (0, parseEventLogs_js_1.parseEventLogs)({
        abi: events,
        args,
        logs: formattedLogs,
        strict
      });
    }
  }
});

// node_modules/viem/_cjs/actions/public/getContractEvents.js
var require_getContractEvents = __commonJS({
  "node_modules/viem/_cjs/actions/public/getContractEvents.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getContractEvents = getContractEvents;
    var getAbiItem_js_1 = require_getAbiItem();
    var getAction_js_1 = require_getAction();
    var getLogs_js_1 = require_getLogs();
    async function getContractEvents(client, parameters) {
      const { abi, address, args, blockHash, eventName, fromBlock, toBlock, strict } = parameters;
      const event = eventName ? (0, getAbiItem_js_1.getAbiItem)({ abi, name: eventName }) : void 0;
      const events = !event ? abi.filter((x) => x.type === "event") : void 0;
      return (0, getAction_js_1.getAction)(client, getLogs_js_1.getLogs, "getLogs")({
        address,
        args,
        blockHash,
        event,
        events,
        fromBlock,
        toBlock,
        strict
      });
    }
  }
});

// node_modules/viem/_cjs/utils/abi/decodeFunctionResult.js
var require_decodeFunctionResult = __commonJS({
  "node_modules/viem/_cjs/utils/abi/decodeFunctionResult.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeFunctionResult = decodeFunctionResult;
    var abi_js_1 = require_abi();
    var decodeAbiParameters_js_1 = require_decodeAbiParameters();
    var getAbiItem_js_1 = require_getAbiItem();
    var docsPath = "/docs/contract/decodeFunctionResult";
    function decodeFunctionResult(parameters) {
      const { abi, args, functionName, data } = parameters;
      let abiItem = abi[0];
      if (functionName) {
        const item = (0, getAbiItem_js_1.getAbiItem)({ abi, args, name: functionName });
        if (!item)
          throw new abi_js_1.AbiFunctionNotFoundError(functionName, { docsPath });
        abiItem = item;
      }
      if (abiItem.type !== "function")
        throw new abi_js_1.AbiFunctionNotFoundError(void 0, { docsPath });
      if (!abiItem.outputs)
        throw new abi_js_1.AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath });
      const values = (0, decodeAbiParameters_js_1.decodeAbiParameters)(abiItem.outputs, data);
      if (values && values.length > 1)
        return values;
      if (values && values.length === 1)
        return values[0];
      return void 0;
    }
  }
});

// node_modules/viem/_cjs/constants/abis.js
var require_abis = __commonJS({
  "node_modules/viem/_cjs/constants/abis.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.erc4626Abi = exports.erc721Abi = exports.erc20Abi_bytes32 = exports.erc20Abi = exports.universalSignatureValidatorAbi = exports.smartAccountAbi = exports.addressResolverAbi = exports.textResolverAbi = exports.universalResolverReverseAbi = exports.universalResolverResolveAbi = exports.multicall3Abi = void 0;
    exports.multicall3Abi = [
      {
        inputs: [
          {
            components: [
              {
                name: "target",
                type: "address"
              },
              {
                name: "allowFailure",
                type: "bool"
              },
              {
                name: "callData",
                type: "bytes"
              }
            ],
            name: "calls",
            type: "tuple[]"
          }
        ],
        name: "aggregate3",
        outputs: [
          {
            components: [
              {
                name: "success",
                type: "bool"
              },
              {
                name: "returnData",
                type: "bytes"
              }
            ],
            name: "returnData",
            type: "tuple[]"
          }
        ],
        stateMutability: "view",
        type: "function"
      }
    ];
    var universalResolverErrors = [
      {
        inputs: [],
        name: "ResolverNotFound",
        type: "error"
      },
      {
        inputs: [],
        name: "ResolverWildcardNotSupported",
        type: "error"
      },
      {
        inputs: [],
        name: "ResolverNotContract",
        type: "error"
      },
      {
        inputs: [
          {
            name: "returnData",
            type: "bytes"
          }
        ],
        name: "ResolverError",
        type: "error"
      },
      {
        inputs: [
          {
            components: [
              {
                name: "status",
                type: "uint16"
              },
              {
                name: "message",
                type: "string"
              }
            ],
            name: "errors",
            type: "tuple[]"
          }
        ],
        name: "HttpError",
        type: "error"
      }
    ];
    exports.universalResolverResolveAbi = [
      ...universalResolverErrors,
      {
        name: "resolve",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "name", type: "bytes" },
          { name: "data", type: "bytes" }
        ],
        outputs: [
          { name: "", type: "bytes" },
          { name: "address", type: "address" }
        ]
      },
      {
        name: "resolve",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "name", type: "bytes" },
          { name: "data", type: "bytes" },
          { name: "gateways", type: "string[]" }
        ],
        outputs: [
          { name: "", type: "bytes" },
          { name: "address", type: "address" }
        ]
      }
    ];
    exports.universalResolverReverseAbi = [
      ...universalResolverErrors,
      {
        name: "reverse",
        type: "function",
        stateMutability: "view",
        inputs: [{ type: "bytes", name: "reverseName" }],
        outputs: [
          { type: "string", name: "resolvedName" },
          { type: "address", name: "resolvedAddress" },
          { type: "address", name: "reverseResolver" },
          { type: "address", name: "resolver" }
        ]
      },
      {
        name: "reverse",
        type: "function",
        stateMutability: "view",
        inputs: [
          { type: "bytes", name: "reverseName" },
          { type: "string[]", name: "gateways" }
        ],
        outputs: [
          { type: "string", name: "resolvedName" },
          { type: "address", name: "resolvedAddress" },
          { type: "address", name: "reverseResolver" },
          { type: "address", name: "resolver" }
        ]
      }
    ];
    exports.textResolverAbi = [
      {
        name: "text",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "name", type: "bytes32" },
          { name: "key", type: "string" }
        ],
        outputs: [{ name: "", type: "string" }]
      }
    ];
    exports.addressResolverAbi = [
      {
        name: "addr",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "name", type: "bytes32" }],
        outputs: [{ name: "", type: "address" }]
      },
      {
        name: "addr",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "name", type: "bytes32" },
          { name: "coinType", type: "uint256" }
        ],
        outputs: [{ name: "", type: "bytes" }]
      }
    ];
    exports.smartAccountAbi = [
      {
        name: "isValidSignature",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "hash", type: "bytes32" },
          { name: "signature", type: "bytes" }
        ],
        outputs: [{ name: "", type: "bytes4" }]
      }
    ];
    exports.universalSignatureValidatorAbi = [
      {
        inputs: [
          {
            name: "_signer",
            type: "address"
          },
          {
            name: "_hash",
            type: "bytes32"
          },
          {
            name: "_signature",
            type: "bytes"
          }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        inputs: [
          {
            name: "_signer",
            type: "address"
          },
          {
            name: "_hash",
            type: "bytes32"
          },
          {
            name: "_signature",
            type: "bytes"
          }
        ],
        outputs: [
          {
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "isValidSig"
      }
    ];
    exports.erc20Abi = [
      {
        type: "event",
        name: "Approval",
        inputs: [
          {
            indexed: true,
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            name: "spender",
            type: "address"
          },
          {
            indexed: false,
            name: "value",
            type: "uint256"
          }
        ]
      },
      {
        type: "event",
        name: "Transfer",
        inputs: [
          {
            indexed: true,
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            name: "to",
            type: "address"
          },
          {
            indexed: false,
            name: "value",
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "allowance",
        stateMutability: "view",
        inputs: [
          {
            name: "owner",
            type: "address"
          },
          {
            name: "spender",
            type: "address"
          }
        ],
        outputs: [
          {
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "approve",
        stateMutability: "nonpayable",
        inputs: [
          {
            name: "spender",
            type: "address"
          },
          {
            name: "amount",
            type: "uint256"
          }
        ],
        outputs: [
          {
            type: "bool"
          }
        ]
      },
      {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [
          {
            name: "account",
            type: "address"
          }
        ],
        outputs: [
          {
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "decimals",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "uint8"
          }
        ]
      },
      {
        type: "function",
        name: "name",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "string"
          }
        ]
      },
      {
        type: "function",
        name: "symbol",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "string"
          }
        ]
      },
      {
        type: "function",
        name: "totalSupply",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "transfer",
        stateMutability: "nonpayable",
        inputs: [
          {
            name: "recipient",
            type: "address"
          },
          {
            name: "amount",
            type: "uint256"
          }
        ],
        outputs: [
          {
            type: "bool"
          }
        ]
      },
      {
        type: "function",
        name: "transferFrom",
        stateMutability: "nonpayable",
        inputs: [
          {
            name: "sender",
            type: "address"
          },
          {
            name: "recipient",
            type: "address"
          },
          {
            name: "amount",
            type: "uint256"
          }
        ],
        outputs: [
          {
            type: "bool"
          }
        ]
      }
    ];
    exports.erc20Abi_bytes32 = [
      {
        type: "event",
        name: "Approval",
        inputs: [
          {
            indexed: true,
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            name: "spender",
            type: "address"
          },
          {
            indexed: false,
            name: "value",
            type: "uint256"
          }
        ]
      },
      {
        type: "event",
        name: "Transfer",
        inputs: [
          {
            indexed: true,
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            name: "to",
            type: "address"
          },
          {
            indexed: false,
            name: "value",
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "allowance",
        stateMutability: "view",
        inputs: [
          {
            name: "owner",
            type: "address"
          },
          {
            name: "spender",
            type: "address"
          }
        ],
        outputs: [
          {
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "approve",
        stateMutability: "nonpayable",
        inputs: [
          {
            name: "spender",
            type: "address"
          },
          {
            name: "amount",
            type: "uint256"
          }
        ],
        outputs: [
          {
            type: "bool"
          }
        ]
      },
      {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [
          {
            name: "account",
            type: "address"
          }
        ],
        outputs: [
          {
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "decimals",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "uint8"
          }
        ]
      },
      {
        type: "function",
        name: "name",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "bytes32"
          }
        ]
      },
      {
        type: "function",
        name: "symbol",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "bytes32"
          }
        ]
      },
      {
        type: "function",
        name: "totalSupply",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "transfer",
        stateMutability: "nonpayable",
        inputs: [
          {
            name: "recipient",
            type: "address"
          },
          {
            name: "amount",
            type: "uint256"
          }
        ],
        outputs: [
          {
            type: "bool"
          }
        ]
      },
      {
        type: "function",
        name: "transferFrom",
        stateMutability: "nonpayable",
        inputs: [
          {
            name: "sender",
            type: "address"
          },
          {
            name: "recipient",
            type: "address"
          },
          {
            name: "amount",
            type: "uint256"
          }
        ],
        outputs: [
          {
            type: "bool"
          }
        ]
      }
    ];
    exports.erc721Abi = [
      {
        type: "event",
        name: "Approval",
        inputs: [
          {
            indexed: true,
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            name: "spender",
            type: "address"
          },
          {
            indexed: true,
            name: "tokenId",
            type: "uint256"
          }
        ]
      },
      {
        type: "event",
        name: "ApprovalForAll",
        inputs: [
          {
            indexed: true,
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            name: "operator",
            type: "address"
          },
          {
            indexed: false,
            name: "approved",
            type: "bool"
          }
        ]
      },
      {
        type: "event",
        name: "Transfer",
        inputs: [
          {
            indexed: true,
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            name: "to",
            type: "address"
          },
          {
            indexed: true,
            name: "tokenId",
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "approve",
        stateMutability: "payable",
        inputs: [
          {
            name: "spender",
            type: "address"
          },
          {
            name: "tokenId",
            type: "uint256"
          }
        ],
        outputs: []
      },
      {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [
          {
            name: "account",
            type: "address"
          }
        ],
        outputs: [
          {
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "getApproved",
        stateMutability: "view",
        inputs: [
          {
            name: "tokenId",
            type: "uint256"
          }
        ],
        outputs: [
          {
            type: "address"
          }
        ]
      },
      {
        type: "function",
        name: "isApprovedForAll",
        stateMutability: "view",
        inputs: [
          {
            name: "owner",
            type: "address"
          },
          {
            name: "operator",
            type: "address"
          }
        ],
        outputs: [
          {
            type: "bool"
          }
        ]
      },
      {
        type: "function",
        name: "name",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "string"
          }
        ]
      },
      {
        type: "function",
        name: "ownerOf",
        stateMutability: "view",
        inputs: [
          {
            name: "tokenId",
            type: "uint256"
          }
        ],
        outputs: [
          {
            name: "owner",
            type: "address"
          }
        ]
      },
      {
        type: "function",
        name: "safeTransferFrom",
        stateMutability: "payable",
        inputs: [
          {
            name: "from",
            type: "address"
          },
          {
            name: "to",
            type: "address"
          },
          {
            name: "tokenId",
            type: "uint256"
          }
        ],
        outputs: []
      },
      {
        type: "function",
        name: "safeTransferFrom",
        stateMutability: "nonpayable",
        inputs: [
          {
            name: "from",
            type: "address"
          },
          {
            name: "to",
            type: "address"
          },
          {
            name: "id",
            type: "uint256"
          },
          {
            name: "data",
            type: "bytes"
          }
        ],
        outputs: []
      },
      {
        type: "function",
        name: "setApprovalForAll",
        stateMutability: "nonpayable",
        inputs: [
          {
            name: "operator",
            type: "address"
          },
          {
            name: "approved",
            type: "bool"
          }
        ],
        outputs: []
      },
      {
        type: "function",
        name: "symbol",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "string"
          }
        ]
      },
      {
        type: "function",
        name: "tokenByIndex",
        stateMutability: "view",
        inputs: [
          {
            name: "index",
            type: "uint256"
          }
        ],
        outputs: [
          {
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "tokenByIndex",
        stateMutability: "view",
        inputs: [
          {
            name: "owner",
            type: "address"
          },
          {
            name: "index",
            type: "uint256"
          }
        ],
        outputs: [
          {
            name: "tokenId",
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "tokenURI",
        stateMutability: "view",
        inputs: [
          {
            name: "tokenId",
            type: "uint256"
          }
        ],
        outputs: [
          {
            type: "string"
          }
        ]
      },
      {
        type: "function",
        name: "totalSupply",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "uint256"
          }
        ]
      },
      {
        type: "function",
        name: "transferFrom",
        stateMutability: "payable",
        inputs: [
          {
            name: "sender",
            type: "address"
          },
          {
            name: "recipient",
            type: "address"
          },
          {
            name: "tokeId",
            type: "uint256"
          }
        ],
        outputs: []
      }
    ];
    exports.erc4626Abi = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            name: "spender",
            type: "address"
          },
          {
            indexed: false,
            name: "value",
            type: "uint256"
          }
        ],
        name: "Approval",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: "sender",
            type: "address"
          },
          {
            indexed: true,
            name: "receiver",
            type: "address"
          },
          {
            indexed: false,
            name: "assets",
            type: "uint256"
          },
          {
            indexed: false,
            name: "shares",
            type: "uint256"
          }
        ],
        name: "Deposit",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            name: "to",
            type: "address"
          },
          {
            indexed: false,
            name: "value",
            type: "uint256"
          }
        ],
        name: "Transfer",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: "sender",
            type: "address"
          },
          {
            indexed: true,
            name: "receiver",
            type: "address"
          },
          {
            indexed: true,
            name: "owner",
            type: "address"
          },
          {
            indexed: false,
            name: "assets",
            type: "uint256"
          },
          {
            indexed: false,
            name: "shares",
            type: "uint256"
          }
        ],
        name: "Withdraw",
        type: "event"
      },
      {
        inputs: [
          {
            name: "owner",
            type: "address"
          },
          {
            name: "spender",
            type: "address"
          }
        ],
        name: "allowance",
        outputs: [
          {
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            name: "spender",
            type: "address"
          },
          {
            name: "amount",
            type: "uint256"
          }
        ],
        name: "approve",
        outputs: [
          {
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "asset",
        outputs: [
          {
            name: "assetTokenAddress",
            type: "address"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            name: "account",
            type: "address"
          }
        ],
        name: "balanceOf",
        outputs: [
          {
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            name: "shares",
            type: "uint256"
          }
        ],
        name: "convertToAssets",
        outputs: [
          {
            name: "assets",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            name: "assets",
            type: "uint256"
          }
        ],
        name: "convertToShares",
        outputs: [
          {
            name: "shares",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            name: "assets",
            type: "uint256"
          },
          {
            name: "receiver",
            type: "address"
          }
        ],
        name: "deposit",
        outputs: [
          {
            name: "shares",
            type: "uint256"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            name: "caller",
            type: "address"
          }
        ],
        name: "maxDeposit",
        outputs: [
          {
            name: "maxAssets",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            name: "caller",
            type: "address"
          }
        ],
        name: "maxMint",
        outputs: [
          {
            name: "maxShares",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            name: "owner",
            type: "address"
          }
        ],
        name: "maxRedeem",
        outputs: [
          {
            name: "maxShares",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            name: "owner",
            type: "address"
          }
        ],
        name: "maxWithdraw",
        outputs: [
          {
            name: "maxAssets",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            name: "shares",
            type: "uint256"
          },
          {
            name: "receiver",
            type: "address"
          }
        ],
        name: "mint",
        outputs: [
          {
            name: "assets",
            type: "uint256"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            name: "assets",
            type: "uint256"
          }
        ],
        name: "previewDeposit",
        outputs: [
          {
            name: "shares",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            name: "shares",
            type: "uint256"
          }
        ],
        name: "previewMint",
        outputs: [
          {
            name: "assets",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            name: "shares",
            type: "uint256"
          }
        ],
        name: "previewRedeem",
        outputs: [
          {
            name: "assets",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            name: "assets",
            type: "uint256"
          }
        ],
        name: "previewWithdraw",
        outputs: [
          {
            name: "shares",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            name: "shares",
            type: "uint256"
          },
          {
            name: "receiver",
            type: "address"
          },
          {
            name: "owner",
            type: "address"
          }
        ],
        name: "redeem",
        outputs: [
          {
            name: "assets",
            type: "uint256"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        name: "totalAssets",
        outputs: [
          {
            name: "totalManagedAssets",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            name: "to",
            type: "address"
          },
          {
            name: "amount",
            type: "uint256"
          }
        ],
        name: "transfer",
        outputs: [
          {
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            name: "from",
            type: "address"
          },
          {
            name: "to",
            type: "address"
          },
          {
            name: "amount",
            type: "uint256"
          }
        ],
        name: "transferFrom",
        outputs: [
          {
            type: "bool"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          {
            name: "assets",
            type: "uint256"
          },
          {
            name: "receiver",
            type: "address"
          },
          {
            name: "owner",
            type: "address"
          }
        ],
        name: "withdraw",
        outputs: [
          {
            name: "shares",
            type: "uint256"
          }
        ],
        stateMutability: "nonpayable",
        type: "function"
      }
    ];
  }
});

// node_modules/viem/_cjs/constants/contract.js
var require_contract2 = __commonJS({
  "node_modules/viem/_cjs/constants/contract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.aggregate3Signature = void 0;
    exports.aggregate3Signature = "0x82ad56cb";
  }
});

// node_modules/viem/_cjs/constants/contracts.js
var require_contracts = __commonJS({
  "node_modules/viem/_cjs/constants/contracts.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.universalSignatureValidatorByteCode = exports.deploylessCallViaFactoryBytecode = exports.deploylessCallViaBytecodeBytecode = void 0;
    exports.deploylessCallViaBytecodeBytecode = "0x608060405234801561001057600080fd5b5060405161018e38038061018e83398101604081905261002f91610124565b6000808351602085016000f59050803b61004857600080fd5b6000808351602085016000855af16040513d6000823e81610067573d81fd5b3d81f35b634e487b7160e01b600052604160045260246000fd5b600082601f83011261009257600080fd5b81516001600160401b038111156100ab576100ab61006b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100d9576100d961006b565b6040528181528382016020018510156100f157600080fd5b60005b82811015610110576020818601810151838301820152016100f4565b506000918101602001919091529392505050565b6000806040838503121561013757600080fd5b82516001600160401b0381111561014d57600080fd5b61015985828601610081565b602085015190935090506001600160401b0381111561017757600080fd5b61018385828601610081565b915050925092905056fe";
    exports.deploylessCallViaFactoryBytecode = "0x608060405234801561001057600080fd5b506040516102c03803806102c083398101604081905261002f916101e6565b836001600160a01b03163b6000036100e457600080836001600160a01b03168360405161005c9190610270565b6000604051808303816000865af19150503d8060008114610099576040519150601f19603f3d011682016040523d82523d6000602084013e61009e565b606091505b50915091508115806100b857506001600160a01b0386163b155b156100e1578060405163101bb98d60e01b81526004016100d8919061028c565b60405180910390fd5b50505b6000808451602086016000885af16040513d6000823e81610103573d81fd5b3d81f35b80516001600160a01b038116811461011e57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561015457818101518382015260200161013c565b50506000910152565b600082601f83011261016e57600080fd5b81516001600160401b0381111561018757610187610123565b604051601f8201601f19908116603f011681016001600160401b03811182821017156101b5576101b5610123565b6040528181528382016020018510156101cd57600080fd5b6101de826020830160208701610139565b949350505050565b600080600080608085870312156101fc57600080fd5b61020585610107565b60208601519094506001600160401b0381111561022157600080fd5b61022d8782880161015d565b93505061023c60408601610107565b60608601519092506001600160401b0381111561025857600080fd5b6102648782880161015d565b91505092959194509250565b60008251610282818460208701610139565b9190910192915050565b60208152600082518060208401526102ab816040850160208701610139565b601f01601f1916919091016040019291505056fe";
    exports.universalSignatureValidatorByteCode = "0x608060405234801561001057600080fd5b5060405161069438038061069483398101604081905261002f9161051e565b600061003c848484610048565b9050806000526001601ff35b60007f64926492649264926492649264926492649264926492649264926492649264926100748361040c565b036101e7576000606080848060200190518101906100929190610577565b60405192955090935091506000906001600160a01b038516906100b69085906105dd565b6000604051808303816000865af19150503d80600081146100f3576040519150601f19603f3d011682016040523d82523d6000602084013e6100f8565b606091505b50509050876001600160a01b03163b60000361016057806101605760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90610190908b9087906004016105f9565b602060405180830381865afa1580156101ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d19190610633565b6001600160e01b03191614945050505050610405565b6001600160a01b0384163b1561027a57604051630b135d3f60e11b808252906001600160a01b03861690631626ba7e9061022790879087906004016105f9565b602060405180830381865afa158015610244573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102689190610633565b6001600160e01b031916149050610405565b81516041146102df5760405162461bcd60e51b815260206004820152603a602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e6774680000000000006064820152608401610157565b6102e7610425565b5060208201516040808401518451859392600091859190811061030c5761030c61065d565b016020015160f81c9050601b811480159061032b57508060ff16601c14155b1561038c5760405162461bcd60e51b815260206004820152603b602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c756500000000006064820152608401610157565b60408051600081526020810180835289905260ff83169181019190915260608101849052608081018390526001600160a01b0389169060019060a0016020604051602081039080840390855afa1580156103ea573d6000803e3d6000fd5b505050602060405103516001600160a01b0316149450505050505b9392505050565b600060208251101561041d57600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b038116811461045857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561048c578181015183820152602001610474565b50506000910152565b600082601f8301126104a657600080fd5b81516001600160401b038111156104bf576104bf61045b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104ed576104ed61045b565b60405281815283820160200185101561050557600080fd5b610516826020830160208701610471565b949350505050565b60008060006060848603121561053357600080fd5b835161053e81610443565b6020850151604086015191945092506001600160401b0381111561056157600080fd5b61056d86828701610495565b9150509250925092565b60008060006060848603121561058c57600080fd5b835161059781610443565b60208501519093506001600160401b038111156105b357600080fd5b6105bf86828701610495565b604086015190935090506001600160401b0381111561056157600080fd5b600082516105ef818460208701610471565b9190910192915050565b828152604060208201526000825180604084015261061e816060850160208701610471565b601f01601f1916919091016060019392505050565b60006020828403121561064557600080fd5b81516001600160e01b03198116811461040557600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572";
  }
});

// node_modules/viem/_cjs/errors/chain.js
var require_chain = __commonJS({
  "node_modules/viem/_cjs/errors/chain.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidChainIdError = exports.ClientChainNotConfiguredError = exports.ChainNotFoundError = exports.ChainMismatchError = exports.ChainDoesNotSupportContract = void 0;
    var base_js_1 = require_base();
    var ChainDoesNotSupportContract = class extends base_js_1.BaseError {
      constructor({ blockNumber, chain, contract }) {
        super(`Chain "${chain.name}" does not support contract "${contract.name}".`, {
          metaMessages: [
            "This could be due to any of the following:",
            ...blockNumber && contract.blockCreated && contract.blockCreated > blockNumber ? [
              `- The contract "${contract.name}" was not deployed until block ${contract.blockCreated} (current block ${blockNumber}).`
            ] : [
              `- The chain does not have the contract "${contract.name}" configured.`
            ]
          ],
          name: "ChainDoesNotSupportContract"
        });
      }
    };
    exports.ChainDoesNotSupportContract = ChainDoesNotSupportContract;
    var ChainMismatchError = class extends base_js_1.BaseError {
      constructor({ chain, currentChainId }) {
        super(`The current chain of the wallet (id: ${currentChainId}) does not match the target chain for the transaction (id: ${chain.id} – ${chain.name}).`, {
          metaMessages: [
            `Current Chain ID:  ${currentChainId}`,
            `Expected Chain ID: ${chain.id} – ${chain.name}`
          ],
          name: "ChainMismatchError"
        });
      }
    };
    exports.ChainMismatchError = ChainMismatchError;
    var ChainNotFoundError = class extends base_js_1.BaseError {
      constructor() {
        super([
          "No chain was provided to the request.",
          "Please provide a chain with the `chain` argument on the Action, or by supplying a `chain` to WalletClient."
        ].join("\n"), {
          name: "ChainNotFoundError"
        });
      }
    };
    exports.ChainNotFoundError = ChainNotFoundError;
    var ClientChainNotConfiguredError = class extends base_js_1.BaseError {
      constructor() {
        super("No chain was provided to the Client.", {
          name: "ClientChainNotConfiguredError"
        });
      }
    };
    exports.ClientChainNotConfiguredError = ClientChainNotConfiguredError;
    var InvalidChainIdError = class extends base_js_1.BaseError {
      constructor({ chainId }) {
        super(typeof chainId === "number" ? `Chain ID "${chainId}" is invalid.` : "Chain ID is invalid.", { name: "InvalidChainIdError" });
      }
    };
    exports.InvalidChainIdError = InvalidChainIdError;
  }
});

// node_modules/viem/_cjs/utils/abi/encodeDeployData.js
var require_encodeDeployData = __commonJS({
  "node_modules/viem/_cjs/utils/abi/encodeDeployData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeDeployData = encodeDeployData;
    var abi_js_1 = require_abi();
    var concat_js_1 = require_concat();
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    var docsPath = "/docs/contract/encodeDeployData";
    function encodeDeployData(parameters) {
      const { abi, args, bytecode } = parameters;
      if (!args || args.length === 0)
        return bytecode;
      const description = abi.find((x) => "type" in x && x.type === "constructor");
      if (!description)
        throw new abi_js_1.AbiConstructorNotFoundError({ docsPath });
      if (!("inputs" in description))
        throw new abi_js_1.AbiConstructorParamsNotFoundError({ docsPath });
      if (!description.inputs || description.inputs.length === 0)
        throw new abi_js_1.AbiConstructorParamsNotFoundError({ docsPath });
      const data = (0, encodeAbiParameters_js_1.encodeAbiParameters)(description.inputs, args);
      return (0, concat_js_1.concatHex)([bytecode, data]);
    }
  }
});

// node_modules/viem/_cjs/utils/chain/getChainContractAddress.js
var require_getChainContractAddress = __commonJS({
  "node_modules/viem/_cjs/utils/chain/getChainContractAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getChainContractAddress = getChainContractAddress;
    var chain_js_1 = require_chain();
    function getChainContractAddress({ blockNumber, chain, contract: name }) {
      var _a;
      const contract = (_a = chain == null ? void 0 : chain.contracts) == null ? void 0 : _a[name];
      if (!contract)
        throw new chain_js_1.ChainDoesNotSupportContract({
          chain,
          contract: { name }
        });
      if (blockNumber && contract.blockCreated && contract.blockCreated > blockNumber)
        throw new chain_js_1.ChainDoesNotSupportContract({
          blockNumber,
          chain,
          contract: {
            name,
            blockCreated: contract.blockCreated
          }
        });
      return contract.address;
    }
  }
});

// node_modules/viem/_cjs/utils/errors/getCallError.js
var require_getCallError = __commonJS({
  "node_modules/viem/_cjs/utils/errors/getCallError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCallError = getCallError;
    var contract_js_1 = require_contract();
    var node_js_1 = require_node();
    var getNodeError_js_1 = require_getNodeError();
    function getCallError(err, { docsPath, ...args }) {
      const cause = (() => {
        const cause2 = (0, getNodeError_js_1.getNodeError)(err, args);
        if (cause2 instanceof node_js_1.UnknownNodeError)
          return err;
        return cause2;
      })();
      return new contract_js_1.CallExecutionError(cause, {
        docsPath,
        ...args
      });
    }
  }
});

// node_modules/viem/_cjs/utils/promise/withResolvers.js
var require_withResolvers = __commonJS({
  "node_modules/viem/_cjs/utils/promise/withResolvers.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.withResolvers = withResolvers;
    function withResolvers() {
      let resolve = () => void 0;
      let reject = () => void 0;
      const promise = new Promise((resolve_, reject_) => {
        resolve = resolve_;
        reject = reject_;
      });
      return { promise, resolve, reject };
    }
  }
});

// node_modules/viem/_cjs/utils/promise/createBatchScheduler.js
var require_createBatchScheduler = __commonJS({
  "node_modules/viem/_cjs/utils/promise/createBatchScheduler.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createBatchScheduler = createBatchScheduler;
    var withResolvers_js_1 = require_withResolvers();
    var schedulerCache = /* @__PURE__ */ new Map();
    function createBatchScheduler({ fn, id, shouldSplitBatch, wait = 0, sort }) {
      const exec = async () => {
        const scheduler = getScheduler();
        flush();
        const args = scheduler.map(({ args: args2 }) => args2);
        if (args.length === 0)
          return;
        fn(args).then((data) => {
          if (sort && Array.isArray(data))
            data.sort(sort);
          for (let i = 0; i < scheduler.length; i++) {
            const { resolve } = scheduler[i];
            resolve == null ? void 0 : resolve([data[i], data]);
          }
        }).catch((err) => {
          for (let i = 0; i < scheduler.length; i++) {
            const { reject } = scheduler[i];
            reject == null ? void 0 : reject(err);
          }
        });
      };
      const flush = () => schedulerCache.delete(id);
      const getBatchedArgs = () => getScheduler().map(({ args }) => args);
      const getScheduler = () => schedulerCache.get(id) || [];
      const setScheduler = (item) => schedulerCache.set(id, [...getScheduler(), item]);
      return {
        flush,
        async schedule(args) {
          const { promise, resolve, reject } = (0, withResolvers_js_1.withResolvers)();
          const split = shouldSplitBatch == null ? void 0 : shouldSplitBatch([...getBatchedArgs(), args]);
          if (split)
            exec();
          const hasActiveScheduler = getScheduler().length > 0;
          if (hasActiveScheduler) {
            setScheduler({ args, resolve, reject });
            return promise;
          }
          setScheduler({ args, resolve, reject });
          setTimeout(exec, wait);
          return promise;
        }
      };
    }
  }
});

// node_modules/viem/_cjs/errors/ccip.js
var require_ccip = __commonJS({
  "node_modules/viem/_cjs/errors/ccip.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OffchainLookupSenderMismatchError = exports.OffchainLookupResponseMalformedError = exports.OffchainLookupError = void 0;
    var stringify_js_1 = require_stringify();
    var base_js_1 = require_base();
    var utils_js_1 = require_utils4();
    var OffchainLookupError = class extends base_js_1.BaseError {
      constructor({ callbackSelector, cause, data, extraData, sender, urls }) {
        var _a;
        super(cause.shortMessage || "An error occurred while fetching for an offchain result.", {
          cause,
          metaMessages: [
            ...cause.metaMessages || [],
            ((_a = cause.metaMessages) == null ? void 0 : _a.length) ? "" : [],
            "Offchain Gateway Call:",
            urls && [
              "  Gateway URL(s):",
              ...urls.map((url) => `    ${(0, utils_js_1.getUrl)(url)}`)
            ],
            `  Sender: ${sender}`,
            `  Data: ${data}`,
            `  Callback selector: ${callbackSelector}`,
            `  Extra data: ${extraData}`
          ].flat(),
          name: "OffchainLookupError"
        });
      }
    };
    exports.OffchainLookupError = OffchainLookupError;
    var OffchainLookupResponseMalformedError = class extends base_js_1.BaseError {
      constructor({ result, url }) {
        super("Offchain gateway response is malformed. Response data must be a hex value.", {
          metaMessages: [
            `Gateway URL: ${(0, utils_js_1.getUrl)(url)}`,
            `Response: ${(0, stringify_js_1.stringify)(result)}`
          ],
          name: "OffchainLookupResponseMalformedError"
        });
      }
    };
    exports.OffchainLookupResponseMalformedError = OffchainLookupResponseMalformedError;
    var OffchainLookupSenderMismatchError = class extends base_js_1.BaseError {
      constructor({ sender, to }) {
        super("Reverted sender address does not match target contract address (`to`).", {
          metaMessages: [
            `Contract address: ${to}`,
            `OffchainLookup sender address: ${sender}`
          ],
          name: "OffchainLookupSenderMismatchError"
        });
      }
    };
    exports.OffchainLookupSenderMismatchError = OffchainLookupSenderMismatchError;
  }
});

// node_modules/viem/_cjs/utils/ccip.js
var require_ccip2 = __commonJS({
  "node_modules/viem/_cjs/utils/ccip.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.offchainLookupAbiItem = exports.offchainLookupSignature = void 0;
    exports.offchainLookup = offchainLookup;
    exports.ccipRequest = ccipRequest;
    var call_js_1 = require_call();
    var ccip_js_1 = require_ccip();
    var request_js_1 = require_request();
    var decodeErrorResult_js_1 = require_decodeErrorResult();
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    var isAddressEqual_js_1 = require_isAddressEqual();
    var concat_js_1 = require_concat();
    var isHex_js_1 = require_isHex();
    var stringify_js_1 = require_stringify();
    exports.offchainLookupSignature = "0x556f1830";
    exports.offchainLookupAbiItem = {
      name: "OffchainLookup",
      type: "error",
      inputs: [
        {
          name: "sender",
          type: "address"
        },
        {
          name: "urls",
          type: "string[]"
        },
        {
          name: "callData",
          type: "bytes"
        },
        {
          name: "callbackFunction",
          type: "bytes4"
        },
        {
          name: "extraData",
          type: "bytes"
        }
      ]
    };
    async function offchainLookup(client, { blockNumber, blockTag, data, to }) {
      const { args } = (0, decodeErrorResult_js_1.decodeErrorResult)({
        data,
        abi: [exports.offchainLookupAbiItem]
      });
      const [sender, urls, callData, callbackSelector, extraData] = args;
      const { ccipRead } = client;
      const ccipRequest_ = ccipRead && typeof (ccipRead == null ? void 0 : ccipRead.request) === "function" ? ccipRead.request : ccipRequest;
      try {
        if (!(0, isAddressEqual_js_1.isAddressEqual)(to, sender))
          throw new ccip_js_1.OffchainLookupSenderMismatchError({ sender, to });
        const result = await ccipRequest_({ data: callData, sender, urls });
        const { data: data_ } = await (0, call_js_1.call)(client, {
          blockNumber,
          blockTag,
          data: (0, concat_js_1.concat)([
            callbackSelector,
            (0, encodeAbiParameters_js_1.encodeAbiParameters)([{ type: "bytes" }, { type: "bytes" }], [result, extraData])
          ]),
          to
        });
        return data_;
      } catch (err) {
        throw new ccip_js_1.OffchainLookupError({
          callbackSelector,
          cause: err,
          data,
          extraData,
          sender,
          urls
        });
      }
    }
    async function ccipRequest({ data, sender, urls }) {
      var _a;
      let error = new Error("An unknown error occurred.");
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const method = url.includes("{data}") ? "GET" : "POST";
        const body = method === "POST" ? { data, sender } : void 0;
        const headers = method === "POST" ? { "Content-Type": "application/json" } : {};
        try {
          const response = await fetch(url.replace("{sender}", sender).replace("{data}", data), {
            body: JSON.stringify(body),
            headers,
            method
          });
          let result;
          if ((_a = response.headers.get("Content-Type")) == null ? void 0 : _a.startsWith("application/json")) {
            result = (await response.json()).data;
          } else {
            result = await response.text();
          }
          if (!response.ok) {
            error = new request_js_1.HttpRequestError({
              body,
              details: (result == null ? void 0 : result.error) ? (0, stringify_js_1.stringify)(result.error) : response.statusText,
              headers: response.headers,
              status: response.status,
              url
            });
            continue;
          }
          if (!(0, isHex_js_1.isHex)(result)) {
            error = new ccip_js_1.OffchainLookupResponseMalformedError({
              result,
              url
            });
            continue;
          }
          return result;
        } catch (err) {
          error = new request_js_1.HttpRequestError({
            body,
            details: err.message,
            url
          });
        }
      }
      throw error;
    }
  }
});

// node_modules/viem/_cjs/actions/public/call.js
var require_call = __commonJS({
  "node_modules/viem/_cjs/actions/public/call.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.call = call;
    exports.getRevertErrorData = getRevertErrorData;
    var abitype_1 = require_exports();
    var parseAccount_js_1 = require_parseAccount();
    var abis_js_1 = require_abis();
    var contract_js_1 = require_contract2();
    var contracts_js_1 = require_contracts();
    var base_js_1 = require_base();
    var chain_js_1 = require_chain();
    var contract_js_2 = require_contract();
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    var encodeDeployData_js_1 = require_encodeDeployData();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var getChainContractAddress_js_1 = require_getChainContractAddress();
    var toHex_js_1 = require_toHex();
    var getCallError_js_1 = require_getCallError();
    var extract_js_1 = require_extract();
    var transactionRequest_js_1 = require_transactionRequest();
    var createBatchScheduler_js_1 = require_createBatchScheduler();
    var stateOverride_js_1 = require_stateOverride2();
    var assertRequest_js_1 = require_assertRequest();
    async function call(client, args) {
      var _a, _b, _c, _d;
      const { account: account_ = client.account, batch = Boolean((_a = client.batch) == null ? void 0 : _a.multicall), blockNumber, blockTag = "latest", accessList, blobs, code, data: data_, factory, factoryData, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride, ...rest } = args;
      const account = account_ ? (0, parseAccount_js_1.parseAccount)(account_) : void 0;
      if (code && (factory || factoryData))
        throw new base_js_1.BaseError("Cannot provide both `code` & `factory`/`factoryData` as parameters.");
      if (code && to)
        throw new base_js_1.BaseError("Cannot provide both `code` & `to` as parameters.");
      const deploylessCallViaBytecode = code && data_;
      const deploylessCallViaFactory = factory && factoryData && to && data_;
      const deploylessCall = deploylessCallViaBytecode || deploylessCallViaFactory;
      const data = (() => {
        if (deploylessCallViaBytecode)
          return toDeploylessCallViaBytecodeData({
            code,
            data: data_
          });
        if (deploylessCallViaFactory)
          return toDeploylessCallViaFactoryData({
            data: data_,
            factory,
            factoryData,
            to
          });
        return data_;
      })();
      try {
        (0, assertRequest_js_1.assertRequest)(args);
        const blockNumberHex = blockNumber ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
        const block = blockNumberHex || blockTag;
        const rpcStateOverride = (0, stateOverride_js_1.serializeStateOverride)(stateOverride);
        const chainFormat = (_d = (_c = (_b = client.chain) == null ? void 0 : _b.formatters) == null ? void 0 : _c.transactionRequest) == null ? void 0 : _d.format;
        const format = chainFormat || transactionRequest_js_1.formatTransactionRequest;
        const request = format({
          ...(0, extract_js_1.extract)(rest, { format: chainFormat }),
          from: account == null ? void 0 : account.address,
          accessList,
          blobs,
          data,
          gas,
          gasPrice,
          maxFeePerBlobGas,
          maxFeePerGas,
          maxPriorityFeePerGas,
          nonce,
          to: deploylessCall ? void 0 : to,
          value
        });
        if (batch && shouldPerformMulticall({ request }) && !rpcStateOverride) {
          try {
            return await scheduleMulticall(client, {
              ...request,
              blockNumber,
              blockTag
            });
          } catch (err) {
            if (!(err instanceof chain_js_1.ClientChainNotConfiguredError) && !(err instanceof chain_js_1.ChainDoesNotSupportContract))
              throw err;
          }
        }
        const response = await client.request({
          method: "eth_call",
          params: rpcStateOverride ? [
            request,
            block,
            rpcStateOverride
          ] : [request, block]
        });
        if (response === "0x")
          return { data: void 0 };
        return { data: response };
      } catch (err) {
        const data2 = getRevertErrorData(err);
        const { offchainLookup, offchainLookupSignature } = await Promise.resolve().then(() => require_ccip2());
        if (client.ccipRead !== false && (data2 == null ? void 0 : data2.slice(0, 10)) === offchainLookupSignature && to)
          return { data: await offchainLookup(client, { data: data2, to }) };
        if (deploylessCall && (data2 == null ? void 0 : data2.slice(0, 10)) === "0x101bb98d")
          throw new contract_js_2.CounterfactualDeploymentFailedError({ factory });
        throw (0, getCallError_js_1.getCallError)(err, {
          ...args,
          account,
          chain: client.chain
        });
      }
    }
    function shouldPerformMulticall({ request }) {
      const { data, to, ...request_ } = request;
      if (!data)
        return false;
      if (data.startsWith(contract_js_1.aggregate3Signature))
        return false;
      if (!to)
        return false;
      if (Object.values(request_).filter((x) => typeof x !== "undefined").length > 0)
        return false;
      return true;
    }
    async function scheduleMulticall(client, args) {
      var _a;
      const { batchSize = 1024, wait = 0 } = typeof ((_a = client.batch) == null ? void 0 : _a.multicall) === "object" ? client.batch.multicall : {};
      const { blockNumber, blockTag = "latest", data, multicallAddress: multicallAddress_, to } = args;
      let multicallAddress = multicallAddress_;
      if (!multicallAddress) {
        if (!client.chain)
          throw new chain_js_1.ClientChainNotConfiguredError();
        multicallAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
          blockNumber,
          chain: client.chain,
          contract: "multicall3"
        });
      }
      const blockNumberHex = blockNumber ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      const block = blockNumberHex || blockTag;
      const { schedule } = (0, createBatchScheduler_js_1.createBatchScheduler)({
        id: `${client.uid}.${block}`,
        wait,
        shouldSplitBatch(args2) {
          const size = args2.reduce((size2, { data: data2 }) => size2 + (data2.length - 2), 0);
          return size > batchSize * 2;
        },
        fn: async (requests) => {
          const calls = requests.map((request) => ({
            allowFailure: true,
            callData: request.data,
            target: request.to
          }));
          const calldata = (0, encodeFunctionData_js_1.encodeFunctionData)({
            abi: abis_js_1.multicall3Abi,
            args: [calls],
            functionName: "aggregate3"
          });
          const data2 = await client.request({
            method: "eth_call",
            params: [
              {
                data: calldata,
                to: multicallAddress
              },
              block
            ]
          });
          return (0, decodeFunctionResult_js_1.decodeFunctionResult)({
            abi: abis_js_1.multicall3Abi,
            args: [calls],
            functionName: "aggregate3",
            data: data2 || "0x"
          });
        }
      });
      const [{ returnData, success }] = await schedule({ data, to });
      if (!success)
        throw new contract_js_2.RawContractError({ data: returnData });
      if (returnData === "0x")
        return { data: void 0 };
      return { data: returnData };
    }
    function toDeploylessCallViaBytecodeData(parameters) {
      const { code, data } = parameters;
      return (0, encodeDeployData_js_1.encodeDeployData)({
        abi: (0, abitype_1.parseAbi)(["constructor(bytes, bytes)"]),
        bytecode: contracts_js_1.deploylessCallViaBytecodeBytecode,
        args: [code, data]
      });
    }
    function toDeploylessCallViaFactoryData(parameters) {
      const { data, factory, factoryData, to } = parameters;
      return (0, encodeDeployData_js_1.encodeDeployData)({
        abi: (0, abitype_1.parseAbi)(["constructor(address, bytes, address, bytes)"]),
        bytecode: contracts_js_1.deploylessCallViaFactoryBytecode,
        args: [to, data, factory, factoryData]
      });
    }
    function getRevertErrorData(err) {
      var _a;
      if (!(err instanceof base_js_1.BaseError))
        return void 0;
      const error = err.walk();
      return typeof (error == null ? void 0 : error.data) === "object" ? (_a = error.data) == null ? void 0 : _a.data : error.data;
    }
  }
});

// node_modules/viem/_cjs/actions/public/readContract.js
var require_readContract = __commonJS({
  "node_modules/viem/_cjs/actions/public/readContract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.readContract = readContract;
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var getContractError_js_1 = require_getContractError();
    var getAction_js_1 = require_getAction();
    var call_js_1 = require_call();
    async function readContract(client, parameters) {
      const { abi, address, args, functionName, ...rest } = parameters;
      const calldata = (0, encodeFunctionData_js_1.encodeFunctionData)({
        abi,
        args,
        functionName
      });
      try {
        const { data } = await (0, getAction_js_1.getAction)(client, call_js_1.call, "call")({
          ...rest,
          data: calldata,
          to: address
        });
        return (0, decodeFunctionResult_js_1.decodeFunctionResult)({
          abi,
          args,
          functionName,
          data: data || "0x"
        });
      } catch (error) {
        throw (0, getContractError_js_1.getContractError)(error, {
          abi,
          address,
          args,
          docsPath: "/docs/contract/readContract",
          functionName
        });
      }
    }
  }
});

// node_modules/viem/_cjs/actions/public/simulateContract.js
var require_simulateContract = __commonJS({
  "node_modules/viem/_cjs/actions/public/simulateContract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.simulateContract = simulateContract;
    var parseAccount_js_1 = require_parseAccount();
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var getContractError_js_1 = require_getContractError();
    var getAction_js_1 = require_getAction();
    var call_js_1 = require_call();
    async function simulateContract(client, parameters) {
      const { abi, address, args, dataSuffix, functionName, ...callRequest } = parameters;
      const account = callRequest.account ? (0, parseAccount_js_1.parseAccount)(callRequest.account) : client.account;
      const calldata = (0, encodeFunctionData_js_1.encodeFunctionData)({ abi, args, functionName });
      try {
        const { data } = await (0, getAction_js_1.getAction)(client, call_js_1.call, "call")({
          batch: false,
          data: `${calldata}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
          to: address,
          ...callRequest,
          account
        });
        const result = (0, decodeFunctionResult_js_1.decodeFunctionResult)({
          abi,
          args,
          functionName,
          data: data || "0x"
        });
        const minimizedAbi = abi.filter((abiItem) => "name" in abiItem && abiItem.name === parameters.functionName);
        return {
          result,
          request: {
            abi: minimizedAbi,
            address,
            args,
            dataSuffix,
            functionName,
            ...callRequest,
            account
          }
        };
      } catch (error) {
        throw (0, getContractError_js_1.getContractError)(error, {
          abi,
          address,
          args,
          docsPath: "/docs/contract/simulateContract",
          functionName,
          sender: account == null ? void 0 : account.address
        });
      }
    }
  }
});

// node_modules/viem/_cjs/utils/observe.js
var require_observe = __commonJS({
  "node_modules/viem/_cjs/utils/observe.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cleanupCache = exports.listenersCache = void 0;
    exports.observe = observe;
    exports.listenersCache = /* @__PURE__ */ new Map();
    exports.cleanupCache = /* @__PURE__ */ new Map();
    var callbackCount = 0;
    function observe(observerId, callbacks, fn) {
      const callbackId = ++callbackCount;
      const getListeners = () => exports.listenersCache.get(observerId) || [];
      const unsubscribe = () => {
        const listeners2 = getListeners();
        exports.listenersCache.set(observerId, listeners2.filter((cb) => cb.id !== callbackId));
      };
      const unwatch = () => {
        const listeners2 = getListeners();
        if (!listeners2.some((cb) => cb.id === callbackId))
          return;
        const cleanup2 = exports.cleanupCache.get(observerId);
        if (listeners2.length === 1 && cleanup2)
          cleanup2();
        unsubscribe();
      };
      const listeners = getListeners();
      exports.listenersCache.set(observerId, [
        ...listeners,
        { id: callbackId, fns: callbacks }
      ]);
      if (listeners && listeners.length > 0)
        return unwatch;
      const emit = {};
      for (const key in callbacks) {
        emit[key] = (...args) => {
          var _a, _b;
          const listeners2 = getListeners();
          if (listeners2.length === 0)
            return;
          for (const listener of listeners2)
            (_b = (_a = listener.fns)[key]) == null ? void 0 : _b.call(_a, ...args);
        };
      }
      const cleanup = fn(emit);
      if (typeof cleanup === "function")
        exports.cleanupCache.set(observerId, cleanup);
      return unwatch;
    }
  }
});

// node_modules/viem/_cjs/utils/wait.js
var require_wait = __commonJS({
  "node_modules/viem/_cjs/utils/wait.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wait = wait;
    async function wait(time) {
      return new Promise((res) => setTimeout(res, time));
    }
  }
});

// node_modules/viem/_cjs/utils/poll.js
var require_poll = __commonJS({
  "node_modules/viem/_cjs/utils/poll.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.poll = poll;
    var wait_js_1 = require_wait();
    function poll(fn, { emitOnBegin, initialWaitTime, interval }) {
      let active = true;
      const unwatch = () => active = false;
      const watch = async () => {
        let data = void 0;
        if (emitOnBegin)
          data = await fn({ unpoll: unwatch });
        const initialWait = await (initialWaitTime == null ? void 0 : initialWaitTime(data)) ?? interval;
        await (0, wait_js_1.wait)(initialWait);
        const poll2 = async () => {
          if (!active)
            return;
          await fn({ unpoll: unwatch });
          await (0, wait_js_1.wait)(interval);
          poll2();
        };
        poll2();
      };
      watch();
      return unwatch;
    }
  }
});

// node_modules/viem/_cjs/utils/promise/withCache.js
var require_withCache = __commonJS({
  "node_modules/viem/_cjs/utils/promise/withCache.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.responseCache = exports.promiseCache = void 0;
    exports.getCache = getCache;
    exports.withCache = withCache;
    exports.promiseCache = /* @__PURE__ */ new Map();
    exports.responseCache = /* @__PURE__ */ new Map();
    function getCache(cacheKey) {
      const buildCache = (cacheKey2, cache) => ({
        clear: () => cache.delete(cacheKey2),
        get: () => cache.get(cacheKey2),
        set: (data) => cache.set(cacheKey2, data)
      });
      const promise = buildCache(cacheKey, exports.promiseCache);
      const response = buildCache(cacheKey, exports.responseCache);
      return {
        clear: () => {
          promise.clear();
          response.clear();
        },
        promise,
        response
      };
    }
    async function withCache(fn, { cacheKey, cacheTime = Number.POSITIVE_INFINITY }) {
      const cache = getCache(cacheKey);
      const response = cache.response.get();
      if (response && cacheTime > 0) {
        const age = (/* @__PURE__ */ new Date()).getTime() - response.created.getTime();
        if (age < cacheTime)
          return response.data;
      }
      let promise = cache.promise.get();
      if (!promise) {
        promise = fn();
        cache.promise.set(promise);
      }
      try {
        const data = await promise;
        cache.response.set({ created: /* @__PURE__ */ new Date(), data });
        return data;
      } finally {
        cache.promise.clear();
      }
    }
  }
});

// node_modules/viem/_cjs/actions/public/getBlockNumber.js
var require_getBlockNumber = __commonJS({
  "node_modules/viem/_cjs/actions/public/getBlockNumber.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBlockNumberCache = getBlockNumberCache;
    exports.getBlockNumber = getBlockNumber;
    var withCache_js_1 = require_withCache();
    var cacheKey = (id) => `blockNumber.${id}`;
    function getBlockNumberCache(id) {
      return (0, withCache_js_1.getCache)(cacheKey(id));
    }
    async function getBlockNumber(client, { cacheTime = client.cacheTime } = {}) {
      const blockNumberHex = await (0, withCache_js_1.withCache)(() => client.request({
        method: "eth_blockNumber"
      }), { cacheKey: cacheKey(client.uid), cacheTime });
      return BigInt(blockNumberHex);
    }
  }
});

// node_modules/viem/_cjs/actions/public/getFilterChanges.js
var require_getFilterChanges = __commonJS({
  "node_modules/viem/_cjs/actions/public/getFilterChanges.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getFilterChanges = getFilterChanges;
    var parseEventLogs_js_1 = require_parseEventLogs();
    var log_js_1 = require_log2();
    async function getFilterChanges(_client, { filter }) {
      const strict = "strict" in filter && filter.strict;
      const logs = await filter.request({
        method: "eth_getFilterChanges",
        params: [filter.id]
      });
      if (typeof logs[0] === "string")
        return logs;
      const formattedLogs = logs.map((log) => (0, log_js_1.formatLog)(log));
      if (!("abi" in filter) || !filter.abi)
        return formattedLogs;
      return (0, parseEventLogs_js_1.parseEventLogs)({
        abi: filter.abi,
        logs: formattedLogs,
        strict
      });
    }
  }
});

// node_modules/viem/_cjs/actions/public/uninstallFilter.js
var require_uninstallFilter = __commonJS({
  "node_modules/viem/_cjs/actions/public/uninstallFilter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uninstallFilter = uninstallFilter;
    async function uninstallFilter(_client, { filter }) {
      return filter.request({
        method: "eth_uninstallFilter",
        params: [filter.id]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/public/watchContractEvent.js
var require_watchContractEvent = __commonJS({
  "node_modules/viem/_cjs/actions/public/watchContractEvent.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.watchContractEvent = watchContractEvent;
    var abi_js_1 = require_abi();
    var rpc_js_1 = require_rpc2();
    var decodeEventLog_js_1 = require_decodeEventLog();
    var encodeEventTopics_js_1 = require_encodeEventTopics();
    var log_js_1 = require_log2();
    var getAction_js_1 = require_getAction();
    var observe_js_1 = require_observe();
    var poll_js_1 = require_poll();
    var stringify_js_1 = require_stringify();
    var createContractEventFilter_js_1 = require_createContractEventFilter();
    var getBlockNumber_js_1 = require_getBlockNumber();
    var getContractEvents_js_1 = require_getContractEvents();
    var getFilterChanges_js_1 = require_getFilterChanges();
    var uninstallFilter_js_1 = require_uninstallFilter();
    function watchContractEvent(client, parameters) {
      const { abi, address, args, batch = true, eventName, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ } = parameters;
      const enablePolling = (() => {
        if (typeof poll_ !== "undefined")
          return poll_;
        if (typeof fromBlock === "bigint")
          return true;
        if (client.transport.type === "webSocket")
          return false;
        if (client.transport.type === "fallback" && client.transport.transports[0].config.type === "webSocket")
          return false;
        return true;
      })();
      const pollContractEvent = () => {
        const strict = strict_ ?? false;
        const observerId = (0, stringify_js_1.stringify)([
          "watchContractEvent",
          address,
          args,
          batch,
          client.uid,
          eventName,
          pollingInterval,
          strict,
          fromBlock
        ]);
        return (0, observe_js_1.observe)(observerId, { onLogs, onError }, (emit) => {
          let previousBlockNumber;
          if (fromBlock !== void 0)
            previousBlockNumber = fromBlock - 1n;
          let filter;
          let initialized = false;
          const unwatch = (0, poll_js_1.poll)(async () => {
            var _a;
            if (!initialized) {
              try {
                filter = await (0, getAction_js_1.getAction)(client, createContractEventFilter_js_1.createContractEventFilter, "createContractEventFilter")({
                  abi,
                  address,
                  args,
                  eventName,
                  strict,
                  fromBlock
                });
              } catch {
              }
              initialized = true;
              return;
            }
            try {
              let logs;
              if (filter) {
                logs = await (0, getAction_js_1.getAction)(client, getFilterChanges_js_1.getFilterChanges, "getFilterChanges")({ filter });
              } else {
                const blockNumber = await (0, getAction_js_1.getAction)(client, getBlockNumber_js_1.getBlockNumber, "getBlockNumber")({});
                if (previousBlockNumber && previousBlockNumber < blockNumber) {
                  logs = await (0, getAction_js_1.getAction)(client, getContractEvents_js_1.getContractEvents, "getContractEvents")({
                    abi,
                    address,
                    args,
                    eventName,
                    fromBlock: previousBlockNumber + 1n,
                    toBlock: blockNumber,
                    strict
                  });
                } else {
                  logs = [];
                }
                previousBlockNumber = blockNumber;
              }
              if (logs.length === 0)
                return;
              if (batch)
                emit.onLogs(logs);
              else
                for (const log of logs)
                  emit.onLogs([log]);
            } catch (err) {
              if (filter && err instanceof rpc_js_1.InvalidInputRpcError)
                initialized = false;
              (_a = emit.onError) == null ? void 0 : _a.call(emit, err);
            }
          }, {
            emitOnBegin: true,
            interval: pollingInterval
          });
          return async () => {
            if (filter)
              await (0, getAction_js_1.getAction)(client, uninstallFilter_js_1.uninstallFilter, "uninstallFilter")({ filter });
            unwatch();
          };
        });
      };
      const subscribeContractEvent = () => {
        const strict = strict_ ?? false;
        const observerId = (0, stringify_js_1.stringify)([
          "watchContractEvent",
          address,
          args,
          batch,
          client.uid,
          eventName,
          pollingInterval,
          strict
        ]);
        let active = true;
        let unsubscribe = () => active = false;
        return (0, observe_js_1.observe)(observerId, { onLogs, onError }, (emit) => {
          ;
          (async () => {
            try {
              const transport = (() => {
                if (client.transport.type === "fallback") {
                  const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket");
                  if (!transport2)
                    return client.transport;
                  return transport2.value;
                }
                return client.transport;
              })();
              const topics = eventName ? (0, encodeEventTopics_js_1.encodeEventTopics)({
                abi,
                eventName,
                args
              }) : [];
              const { unsubscribe: unsubscribe_ } = await transport.subscribe({
                params: ["logs", { address, topics }],
                onData(data) {
                  var _a;
                  if (!active)
                    return;
                  const log = data.result;
                  try {
                    const { eventName: eventName2, args: args2 } = (0, decodeEventLog_js_1.decodeEventLog)({
                      abi,
                      data: log.data,
                      topics: log.topics,
                      strict: strict_
                    });
                    const formatted = (0, log_js_1.formatLog)(log, {
                      args: args2,
                      eventName: eventName2
                    });
                    emit.onLogs([formatted]);
                  } catch (err) {
                    let eventName2;
                    let isUnnamed;
                    if (err instanceof abi_js_1.DecodeLogDataMismatch || err instanceof abi_js_1.DecodeLogTopicsMismatch) {
                      if (strict_)
                        return;
                      eventName2 = err.abiItem.name;
                      isUnnamed = (_a = err.abiItem.inputs) == null ? void 0 : _a.some((x) => !("name" in x && x.name));
                    }
                    const formatted = (0, log_js_1.formatLog)(log, {
                      args: isUnnamed ? [] : {},
                      eventName: eventName2
                    });
                    emit.onLogs([formatted]);
                  }
                },
                onError(error) {
                  var _a;
                  (_a = emit.onError) == null ? void 0 : _a.call(emit, error);
                }
              });
              unsubscribe = unsubscribe_;
              if (!active)
                unsubscribe();
            } catch (err) {
              onError == null ? void 0 : onError(err);
            }
          })();
          return () => unsubscribe();
        });
      };
      return enablePolling ? pollContractEvent() : subscribeContractEvent();
    }
  }
});

// node_modules/viem/_cjs/errors/account.js
var require_account = __commonJS({
  "node_modules/viem/_cjs/errors/account.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AccountTypeNotSupportedError = exports.AccountNotFoundError = void 0;
    var base_js_1 = require_base();
    var AccountNotFoundError = class extends base_js_1.BaseError {
      constructor({ docsPath } = {}) {
        super([
          "Could not find an Account to execute with this Action.",
          "Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the Client."
        ].join("\n"), {
          docsPath,
          docsSlug: "account",
          name: "AccountNotFoundError"
        });
      }
    };
    exports.AccountNotFoundError = AccountNotFoundError;
    var AccountTypeNotSupportedError = class extends base_js_1.BaseError {
      constructor({ docsPath, metaMessages, type }) {
        super(`Account type "${type}" is not supported.`, {
          docsPath,
          metaMessages,
          name: "AccountTypeNotSupportedError"
        });
      }
    };
    exports.AccountTypeNotSupportedError = AccountTypeNotSupportedError;
  }
});

// node_modules/viem/_cjs/utils/chain/assertCurrentChain.js
var require_assertCurrentChain = __commonJS({
  "node_modules/viem/_cjs/utils/chain/assertCurrentChain.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertCurrentChain = assertCurrentChain;
    var chain_js_1 = require_chain();
    function assertCurrentChain({ chain, currentChainId }) {
      if (!chain)
        throw new chain_js_1.ChainNotFoundError();
      if (currentChainId !== chain.id)
        throw new chain_js_1.ChainMismatchError({ chain, currentChainId });
    }
  }
});

// node_modules/viem/_cjs/utils/errors/getTransactionError.js
var require_getTransactionError = __commonJS({
  "node_modules/viem/_cjs/utils/errors/getTransactionError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTransactionError = getTransactionError;
    var node_js_1 = require_node();
    var transaction_js_1 = require_transaction();
    var getNodeError_js_1 = require_getNodeError();
    function getTransactionError(err, { docsPath, ...args }) {
      const cause = (() => {
        const cause2 = (0, getNodeError_js_1.getNodeError)(err, args);
        if (cause2 instanceof node_js_1.UnknownNodeError)
          return err;
        return cause2;
      })();
      return new transaction_js_1.TransactionExecutionError(cause, {
        docsPath,
        ...args
      });
    }
  }
});

// node_modules/viem/_cjs/actions/wallet/sendRawTransaction.js
var require_sendRawTransaction = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/sendRawTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sendRawTransaction = sendRawTransaction;
    async function sendRawTransaction(client, { serializedTransaction }) {
      return client.request({
        method: "eth_sendRawTransaction",
        params: [serializedTransaction]
      }, { retryCount: 0 });
    }
  }
});

// node_modules/viem/_cjs/actions/wallet/sendTransaction.js
var require_sendTransaction = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/sendTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sendTransaction = sendTransaction;
    var parseAccount_js_1 = require_parseAccount();
    var account_js_1 = require_account();
    var base_js_1 = require_base();
    var recoverAuthorizationAddress_js_1 = require_recoverAuthorizationAddress();
    var assertCurrentChain_js_1 = require_assertCurrentChain();
    var getTransactionError_js_1 = require_getTransactionError();
    var extract_js_1 = require_extract();
    var transactionRequest_js_1 = require_transactionRequest();
    var getAction_js_1 = require_getAction();
    var lru_js_1 = require_lru();
    var assertRequest_js_1 = require_assertRequest();
    var getChainId_js_1 = require_getChainId();
    var prepareTransactionRequest_js_1 = require_prepareTransactionRequest();
    var sendRawTransaction_js_1 = require_sendRawTransaction();
    var supportsWalletNamespace = new lru_js_1.LruMap(128);
    async function sendTransaction(client, parameters) {
      var _a, _b, _c, _d;
      const { account: account_ = client.account, chain = client.chain, accessList, authorizationList, blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, value, ...rest } = parameters;
      if (typeof account_ === "undefined")
        throw new account_js_1.AccountNotFoundError({
          docsPath: "/docs/actions/wallet/sendTransaction"
        });
      const account = account_ ? (0, parseAccount_js_1.parseAccount)(account_) : null;
      try {
        (0, assertRequest_js_1.assertRequest)(parameters);
        const to = await (async () => {
          if (parameters.to)
            return parameters.to;
          if (authorizationList && authorizationList.length > 0)
            return await (0, recoverAuthorizationAddress_js_1.recoverAuthorizationAddress)({
              authorization: authorizationList[0]
            }).catch(() => {
              throw new base_js_1.BaseError("`to` is required. Could not infer from `authorizationList`.");
            });
          return void 0;
        })();
        if ((account == null ? void 0 : account.type) === "json-rpc" || account === null) {
          let chainId;
          if (chain !== null) {
            chainId = await (0, getAction_js_1.getAction)(client, getChainId_js_1.getChainId, "getChainId")({});
            (0, assertCurrentChain_js_1.assertCurrentChain)({
              currentChainId: chainId,
              chain
            });
          }
          const chainFormat = (_c = (_b = (_a = client.chain) == null ? void 0 : _a.formatters) == null ? void 0 : _b.transactionRequest) == null ? void 0 : _c.format;
          const format = chainFormat || transactionRequest_js_1.formatTransactionRequest;
          const request = format({
            ...(0, extract_js_1.extract)(rest, { format: chainFormat }),
            accessList,
            authorizationList,
            blobs,
            chainId,
            data,
            from: account == null ? void 0 : account.address,
            gas,
            gasPrice,
            maxFeePerBlobGas,
            maxFeePerGas,
            maxPriorityFeePerGas,
            nonce,
            to,
            value
          });
          const isWalletNamespaceSupported = supportsWalletNamespace.get(client.uid);
          const method = isWalletNamespaceSupported ? "wallet_sendTransaction" : "eth_sendTransaction";
          try {
            return await client.request({
              method,
              params: [request]
            }, { retryCount: 0 });
          } catch (e) {
            if (isWalletNamespaceSupported === false)
              throw e;
            const error = e;
            if (error.name === "InvalidInputRpcError" || error.name === "InvalidParamsRpcError" || error.name === "MethodNotFoundRpcError" || error.name === "MethodNotSupportedRpcError") {
              return await client.request({
                method: "wallet_sendTransaction",
                params: [request]
              }, { retryCount: 0 }).then((hash) => {
                supportsWalletNamespace.set(client.uid, true);
                return hash;
              }).catch((e2) => {
                const walletNamespaceError = e2;
                if (walletNamespaceError.name === "MethodNotFoundRpcError" || walletNamespaceError.name === "MethodNotSupportedRpcError") {
                  supportsWalletNamespace.set(client.uid, false);
                  throw error;
                }
                throw walletNamespaceError;
              });
            }
            throw error;
          }
        }
        if ((account == null ? void 0 : account.type) === "local") {
          const request = await (0, getAction_js_1.getAction)(client, prepareTransactionRequest_js_1.prepareTransactionRequest, "prepareTransactionRequest")({
            account,
            accessList,
            authorizationList,
            blobs,
            chain,
            data,
            gas,
            gasPrice,
            maxFeePerBlobGas,
            maxFeePerGas,
            maxPriorityFeePerGas,
            nonce,
            nonceManager: account.nonceManager,
            parameters: [...prepareTransactionRequest_js_1.defaultParameters, "sidecars"],
            value,
            ...rest,
            to
          });
          const serializer = (_d = chain == null ? void 0 : chain.serializers) == null ? void 0 : _d.transaction;
          const serializedTransaction = await account.signTransaction(request, {
            serializer
          });
          return await (0, getAction_js_1.getAction)(client, sendRawTransaction_js_1.sendRawTransaction, "sendRawTransaction")({
            serializedTransaction
          });
        }
        if ((account == null ? void 0 : account.type) === "smart")
          throw new account_js_1.AccountTypeNotSupportedError({
            metaMessages: [
              "Consider using the `sendUserOperation` Action instead."
            ],
            docsPath: "/docs/actions/bundler/sendUserOperation",
            type: "smart"
          });
        throw new account_js_1.AccountTypeNotSupportedError({
          docsPath: "/docs/actions/wallet/sendTransaction",
          type: account == null ? void 0 : account.type
        });
      } catch (err) {
        if (err instanceof account_js_1.AccountTypeNotSupportedError)
          throw err;
        throw (0, getTransactionError_js_1.getTransactionError)(err, {
          ...parameters,
          account,
          chain: parameters.chain || void 0
        });
      }
    }
  }
});

// node_modules/viem/_cjs/actions/wallet/writeContract.js
var require_writeContract = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/writeContract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.writeContract = writeContract;
    var parseAccount_js_1 = require_parseAccount();
    var account_js_1 = require_account();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var getContractError_js_1 = require_getContractError();
    var getAction_js_1 = require_getAction();
    var sendTransaction_js_1 = require_sendTransaction();
    async function writeContract(client, parameters) {
      const { abi, account: account_ = client.account, address, args, dataSuffix, functionName, ...request } = parameters;
      if (typeof account_ === "undefined")
        throw new account_js_1.AccountNotFoundError({
          docsPath: "/docs/contract/writeContract"
        });
      const account = account_ ? (0, parseAccount_js_1.parseAccount)(account_) : null;
      const data = (0, encodeFunctionData_js_1.encodeFunctionData)({
        abi,
        args,
        functionName
      });
      try {
        return await (0, getAction_js_1.getAction)(client, sendTransaction_js_1.sendTransaction, "sendTransaction")({
          data: `${data}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
          to: address,
          account,
          ...request
        });
      } catch (error) {
        throw (0, getContractError_js_1.getContractError)(error, {
          abi,
          address,
          args,
          docsPath: "/docs/contract/writeContract",
          functionName,
          sender: account == null ? void 0 : account.address
        });
      }
    }
  }
});

// node_modules/viem/_cjs/actions/getContract.js
var require_getContract = __commonJS({
  "node_modules/viem/_cjs/actions/getContract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getContract = getContract;
    exports.getFunctionParameters = getFunctionParameters;
    exports.getEventParameters = getEventParameters;
    var getAction_js_1 = require_getAction();
    var createContractEventFilter_js_1 = require_createContractEventFilter();
    var estimateContractGas_js_1 = require_estimateContractGas();
    var getContractEvents_js_1 = require_getContractEvents();
    var readContract_js_1 = require_readContract();
    var simulateContract_js_1 = require_simulateContract();
    var watchContractEvent_js_1 = require_watchContractEvent();
    var writeContract_js_1 = require_writeContract();
    function getContract({ abi, address, client: client_ }) {
      const client = client_;
      const [publicClient, walletClient] = (() => {
        if (!client)
          return [void 0, void 0];
        if ("public" in client && "wallet" in client)
          return [client.public, client.wallet];
        if ("public" in client)
          return [client.public, void 0];
        if ("wallet" in client)
          return [void 0, client.wallet];
        return [client, client];
      })();
      const hasPublicClient = publicClient !== void 0 && publicClient !== null;
      const hasWalletClient = walletClient !== void 0 && walletClient !== null;
      const contract = {};
      let hasReadFunction = false;
      let hasWriteFunction = false;
      let hasEvent = false;
      for (const item of abi) {
        if (item.type === "function")
          if (item.stateMutability === "view" || item.stateMutability === "pure")
            hasReadFunction = true;
          else
            hasWriteFunction = true;
        else if (item.type === "event")
          hasEvent = true;
        if (hasReadFunction && hasWriteFunction && hasEvent)
          break;
      }
      if (hasPublicClient) {
        if (hasReadFunction)
          contract.read = new Proxy({}, {
            get(_, functionName) {
              return (...parameters) => {
                const { args, options } = getFunctionParameters(parameters);
                return (0, getAction_js_1.getAction)(publicClient, readContract_js_1.readContract, "readContract")({
                  abi,
                  address,
                  functionName,
                  args,
                  ...options
                });
              };
            }
          });
        if (hasWriteFunction)
          contract.simulate = new Proxy({}, {
            get(_, functionName) {
              return (...parameters) => {
                const { args, options } = getFunctionParameters(parameters);
                return (0, getAction_js_1.getAction)(publicClient, simulateContract_js_1.simulateContract, "simulateContract")({
                  abi,
                  address,
                  functionName,
                  args,
                  ...options
                });
              };
            }
          });
        if (hasEvent) {
          contract.createEventFilter = new Proxy({}, {
            get(_, eventName) {
              return (...parameters) => {
                const abiEvent = abi.find((x) => x.type === "event" && x.name === eventName);
                const { args, options } = getEventParameters(parameters, abiEvent);
                return (0, getAction_js_1.getAction)(publicClient, createContractEventFilter_js_1.createContractEventFilter, "createContractEventFilter")({
                  abi,
                  address,
                  eventName,
                  args,
                  ...options
                });
              };
            }
          });
          contract.getEvents = new Proxy({}, {
            get(_, eventName) {
              return (...parameters) => {
                const abiEvent = abi.find((x) => x.type === "event" && x.name === eventName);
                const { args, options } = getEventParameters(parameters, abiEvent);
                return (0, getAction_js_1.getAction)(publicClient, getContractEvents_js_1.getContractEvents, "getContractEvents")({
                  abi,
                  address,
                  eventName,
                  args,
                  ...options
                });
              };
            }
          });
          contract.watchEvent = new Proxy({}, {
            get(_, eventName) {
              return (...parameters) => {
                const abiEvent = abi.find((x) => x.type === "event" && x.name === eventName);
                const { args, options } = getEventParameters(parameters, abiEvent);
                return (0, getAction_js_1.getAction)(publicClient, watchContractEvent_js_1.watchContractEvent, "watchContractEvent")({
                  abi,
                  address,
                  eventName,
                  args,
                  ...options
                });
              };
            }
          });
        }
      }
      if (hasWalletClient) {
        if (hasWriteFunction)
          contract.write = new Proxy({}, {
            get(_, functionName) {
              return (...parameters) => {
                const { args, options } = getFunctionParameters(parameters);
                return (0, getAction_js_1.getAction)(walletClient, writeContract_js_1.writeContract, "writeContract")({
                  abi,
                  address,
                  functionName,
                  args,
                  ...options
                });
              };
            }
          });
      }
      if (hasPublicClient || hasWalletClient) {
        if (hasWriteFunction)
          contract.estimateGas = new Proxy({}, {
            get(_, functionName) {
              return (...parameters) => {
                const { args, options } = getFunctionParameters(parameters);
                const client2 = publicClient ?? walletClient;
                return (0, getAction_js_1.getAction)(client2, estimateContractGas_js_1.estimateContractGas, "estimateContractGas")({
                  abi,
                  address,
                  functionName,
                  args,
                  ...options,
                  account: options.account ?? walletClient.account
                });
              };
            }
          });
      }
      contract.address = address;
      contract.abi = abi;
      return contract;
    }
    function getFunctionParameters(values) {
      const hasArgs = values.length && Array.isArray(values[0]);
      const args = hasArgs ? values[0] : [];
      const options = (hasArgs ? values[1] : values[0]) ?? {};
      return { args, options };
    }
    function getEventParameters(values, abiEvent) {
      let hasArgs = false;
      if (Array.isArray(values[0]))
        hasArgs = true;
      else if (values.length === 1) {
        hasArgs = abiEvent.inputs.some((x) => x.indexed);
      } else if (values.length === 2) {
        hasArgs = true;
      }
      const args = hasArgs ? values[0] : void 0;
      const options = (hasArgs ? values[1] : values[0]) ?? {};
      return { args, options };
    }
  }
});

// node_modules/viem/_cjs/utils/uid.js
var require_uid = __commonJS({
  "node_modules/viem/_cjs/utils/uid.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uid = uid;
    var size = 256;
    var index = size;
    var buffer;
    function uid(length = 11) {
      if (!buffer || index + length > size * 2) {
        buffer = "";
        index = 0;
        for (let i = 0; i < size; i++) {
          buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
        }
      }
      return buffer.substring(index, index++ + length);
    }
  }
});

// node_modules/viem/_cjs/clients/createClient.js
var require_createClient = __commonJS({
  "node_modules/viem/_cjs/clients/createClient.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createClient = createClient;
    exports.rpcSchema = rpcSchema;
    var parseAccount_js_1 = require_parseAccount();
    var uid_js_1 = require_uid();
    function createClient(parameters) {
      const { batch, cacheTime = parameters.pollingInterval ?? 4e3, ccipRead, key = "base", name = "Base Client", pollingInterval = 4e3, type = "base" } = parameters;
      const chain = parameters.chain;
      const account = parameters.account ? (0, parseAccount_js_1.parseAccount)(parameters.account) : void 0;
      const { config, request, value } = parameters.transport({
        chain,
        pollingInterval
      });
      const transport = { ...config, ...value };
      const client = {
        account,
        batch,
        cacheTime,
        ccipRead,
        chain,
        key,
        name,
        pollingInterval,
        request,
        transport,
        type,
        uid: (0, uid_js_1.uid)()
      };
      function extend(base) {
        return (extendFn) => {
          const extended = extendFn(base);
          for (const key2 in client)
            delete extended[key2];
          const combined = { ...base, ...extended };
          return Object.assign(combined, { extend: extend(combined) });
        };
      }
      return Object.assign(client, { extend: extend(client) });
    }
    function rpcSchema() {
      return null;
    }
  }
});

// node_modules/viem/_cjs/utils/promise/withDedupe.js
var require_withDedupe = __commonJS({
  "node_modules/viem/_cjs/utils/promise/withDedupe.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.promiseCache = void 0;
    exports.withDedupe = withDedupe;
    var lru_js_1 = require_lru();
    exports.promiseCache = new lru_js_1.LruMap(8192);
    function withDedupe(fn, { enabled = true, id }) {
      if (!enabled || !id)
        return fn();
      if (exports.promiseCache.get(id))
        return exports.promiseCache.get(id);
      const promise = fn().finally(() => exports.promiseCache.delete(id));
      exports.promiseCache.set(id, promise);
      return promise;
    }
  }
});

// node_modules/viem/_cjs/utils/promise/withRetry.js
var require_withRetry = __commonJS({
  "node_modules/viem/_cjs/utils/promise/withRetry.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.withRetry = withRetry;
    var wait_js_1 = require_wait();
    function withRetry(fn, { delay: delay_ = 100, retryCount = 2, shouldRetry = () => true } = {}) {
      return new Promise((resolve, reject) => {
        const attemptRetry = async ({ count = 0 } = {}) => {
          const retry = async ({ error }) => {
            const delay = typeof delay_ === "function" ? delay_({ count, error }) : delay_;
            if (delay)
              await (0, wait_js_1.wait)(delay);
            attemptRetry({ count: count + 1 });
          };
          try {
            const data = await fn();
            resolve(data);
          } catch (err) {
            if (count < retryCount && await shouldRetry({ count, error: err }))
              return retry({ error: err });
            reject(err);
          }
        };
        attemptRetry();
      });
    }
  }
});

// node_modules/viem/_cjs/utils/buildRequest.js
var require_buildRequest = __commonJS({
  "node_modules/viem/_cjs/utils/buildRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildRequest = buildRequest;
    exports.shouldRetry = shouldRetry;
    var base_js_1 = require_base();
    var request_js_1 = require_request();
    var rpc_js_1 = require_rpc2();
    var toHex_js_1 = require_toHex();
    var keccak256_js_1 = require_keccak256();
    var withDedupe_js_1 = require_withDedupe();
    var withRetry_js_1 = require_withRetry();
    var stringify_js_1 = require_stringify();
    function buildRequest(request, options = {}) {
      return async (args, overrideOptions = {}) => {
        const { dedupe = false, retryDelay = 150, retryCount = 3, uid } = {
          ...options,
          ...overrideOptions
        };
        const requestId = dedupe ? (0, keccak256_js_1.keccak256)((0, toHex_js_1.stringToHex)(`${uid}.${(0, stringify_js_1.stringify)(args)}`)) : void 0;
        return (0, withDedupe_js_1.withDedupe)(() => (0, withRetry_js_1.withRetry)(async () => {
          try {
            return await request(args);
          } catch (err_) {
            const err = err_;
            switch (err.code) {
              case rpc_js_1.ParseRpcError.code:
                throw new rpc_js_1.ParseRpcError(err);
              case rpc_js_1.InvalidRequestRpcError.code:
                throw new rpc_js_1.InvalidRequestRpcError(err);
              case rpc_js_1.MethodNotFoundRpcError.code:
                throw new rpc_js_1.MethodNotFoundRpcError(err, { method: args.method });
              case rpc_js_1.InvalidParamsRpcError.code:
                throw new rpc_js_1.InvalidParamsRpcError(err);
              case rpc_js_1.InternalRpcError.code:
                throw new rpc_js_1.InternalRpcError(err);
              case rpc_js_1.InvalidInputRpcError.code:
                throw new rpc_js_1.InvalidInputRpcError(err);
              case rpc_js_1.ResourceNotFoundRpcError.code:
                throw new rpc_js_1.ResourceNotFoundRpcError(err);
              case rpc_js_1.ResourceUnavailableRpcError.code:
                throw new rpc_js_1.ResourceUnavailableRpcError(err);
              case rpc_js_1.TransactionRejectedRpcError.code:
                throw new rpc_js_1.TransactionRejectedRpcError(err);
              case rpc_js_1.MethodNotSupportedRpcError.code:
                throw new rpc_js_1.MethodNotSupportedRpcError(err, {
                  method: args.method
                });
              case rpc_js_1.LimitExceededRpcError.code:
                throw new rpc_js_1.LimitExceededRpcError(err);
              case rpc_js_1.JsonRpcVersionUnsupportedError.code:
                throw new rpc_js_1.JsonRpcVersionUnsupportedError(err);
              case rpc_js_1.UserRejectedRequestError.code:
                throw new rpc_js_1.UserRejectedRequestError(err);
              case rpc_js_1.UnauthorizedProviderError.code:
                throw new rpc_js_1.UnauthorizedProviderError(err);
              case rpc_js_1.UnsupportedProviderMethodError.code:
                throw new rpc_js_1.UnsupportedProviderMethodError(err);
              case rpc_js_1.ProviderDisconnectedError.code:
                throw new rpc_js_1.ProviderDisconnectedError(err);
              case rpc_js_1.ChainDisconnectedError.code:
                throw new rpc_js_1.ChainDisconnectedError(err);
              case rpc_js_1.SwitchChainError.code:
                throw new rpc_js_1.SwitchChainError(err);
              case 5e3:
                throw new rpc_js_1.UserRejectedRequestError(err);
              default:
                if (err_ instanceof base_js_1.BaseError)
                  throw err_;
                throw new rpc_js_1.UnknownRpcError(err);
            }
          }
        }, {
          delay: ({ count, error }) => {
            var _a;
            if (error && error instanceof request_js_1.HttpRequestError) {
              const retryAfter = (_a = error == null ? void 0 : error.headers) == null ? void 0 : _a.get("Retry-After");
              if (retryAfter == null ? void 0 : retryAfter.match(/\d/))
                return Number.parseInt(retryAfter) * 1e3;
            }
            return ~~(1 << count) * retryDelay;
          },
          retryCount,
          shouldRetry: ({ error }) => shouldRetry(error)
        }), { enabled: dedupe, id: requestId });
      };
    }
    function shouldRetry(error) {
      if ("code" in error && typeof error.code === "number") {
        if (error.code === -1)
          return true;
        if (error.code === rpc_js_1.LimitExceededRpcError.code)
          return true;
        if (error.code === rpc_js_1.InternalRpcError.code)
          return true;
        return false;
      }
      if (error instanceof request_js_1.HttpRequestError && error.status) {
        if (error.status === 403)
          return true;
        if (error.status === 408)
          return true;
        if (error.status === 413)
          return true;
        if (error.status === 429)
          return true;
        if (error.status === 500)
          return true;
        if (error.status === 502)
          return true;
        if (error.status === 503)
          return true;
        if (error.status === 504)
          return true;
        return false;
      }
      return true;
    }
  }
});

// node_modules/viem/_cjs/clients/transports/createTransport.js
var require_createTransport = __commonJS({
  "node_modules/viem/_cjs/clients/transports/createTransport.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createTransport = createTransport;
    var buildRequest_js_1 = require_buildRequest();
    var uid_js_1 = require_uid();
    function createTransport({ key, name, request, retryCount = 3, retryDelay = 150, timeout, type }, value) {
      const uid = (0, uid_js_1.uid)();
      return {
        config: {
          key,
          name,
          request,
          retryCount,
          retryDelay,
          timeout,
          type
        },
        request: (0, buildRequest_js_1.buildRequest)(request, { retryCount, retryDelay, uid }),
        value
      };
    }
  }
});

// node_modules/viem/_cjs/clients/transports/custom.js
var require_custom = __commonJS({
  "node_modules/viem/_cjs/clients/transports/custom.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.custom = custom;
    var createTransport_js_1 = require_createTransport();
    function custom(provider, config = {}) {
      const { key = "custom", name = "Custom Provider", retryDelay } = config;
      return ({ retryCount: defaultRetryCount }) => (0, createTransport_js_1.createTransport)({
        key,
        name,
        request: provider.request.bind(provider),
        retryCount: config.retryCount ?? defaultRetryCount,
        retryDelay,
        type: "custom"
      });
    }
  }
});

// node_modules/viem/_cjs/clients/transports/fallback.js
var require_fallback = __commonJS({
  "node_modules/viem/_cjs/clients/transports/fallback.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fallback = fallback;
    exports.rankTransports = rankTransports;
    var rpc_js_1 = require_rpc2();
    var wait_js_1 = require_wait();
    var createTransport_js_1 = require_createTransport();
    function fallback(transports_, config = {}) {
      const { key = "fallback", name = "Fallback", rank = false, retryCount, retryDelay } = config;
      return ({ chain, pollingInterval = 4e3, timeout, ...rest }) => {
        let transports = transports_;
        let onResponse = () => {
        };
        const transport = (0, createTransport_js_1.createTransport)({
          key,
          name,
          async request({ method, params }) {
            const fetch2 = async (i = 0) => {
              const transport2 = transports[i]({
                ...rest,
                chain,
                retryCount: 0,
                timeout
              });
              try {
                const response = await transport2.request({
                  method,
                  params
                });
                onResponse({
                  method,
                  params,
                  response,
                  transport: transport2,
                  status: "success"
                });
                return response;
              } catch (err) {
                onResponse({
                  error: err,
                  method,
                  params,
                  transport: transport2,
                  status: "error"
                });
                if (shouldThrow(err))
                  throw err;
                if (i === transports.length - 1)
                  throw err;
                return fetch2(i + 1);
              }
            };
            return fetch2();
          },
          retryCount,
          retryDelay,
          type: "fallback"
        }, {
          onResponse: (fn) => onResponse = fn,
          transports: transports.map((fn) => fn({ chain, retryCount: 0 }))
        });
        if (rank) {
          const rankOptions = typeof rank === "object" ? rank : {};
          rankTransports({
            chain,
            interval: rankOptions.interval ?? pollingInterval,
            onTransports: (transports_2) => transports = transports_2,
            ping: rankOptions.ping,
            sampleCount: rankOptions.sampleCount,
            timeout: rankOptions.timeout,
            transports,
            weights: rankOptions.weights
          });
        }
        return transport;
      };
    }
    function shouldThrow(error) {
      if ("code" in error && typeof error.code === "number") {
        if (error.code === rpc_js_1.TransactionRejectedRpcError.code || error.code === rpc_js_1.UserRejectedRequestError.code || error.code === 5e3)
          return true;
      }
      return false;
    }
    function rankTransports({ chain, interval = 4e3, onTransports, ping, sampleCount = 10, timeout = 1e3, transports, weights = {} }) {
      const { stability: stabilityWeight = 0.7, latency: latencyWeight = 0.3 } = weights;
      const samples = [];
      const rankTransports_ = async () => {
        const sample = await Promise.all(transports.map(async (transport) => {
          const transport_ = transport({ chain, retryCount: 0, timeout });
          const start = Date.now();
          let end;
          let success;
          try {
            await (ping ? ping({ transport: transport_ }) : transport_.request({ method: "net_listening" }));
            success = 1;
          } catch {
            success = 0;
          } finally {
            end = Date.now();
          }
          const latency = end - start;
          return { latency, success };
        }));
        samples.push(sample);
        if (samples.length > sampleCount)
          samples.shift();
        const maxLatency = Math.max(...samples.map((sample2) => Math.max(...sample2.map(({ latency }) => latency))));
        const scores = transports.map((_, i) => {
          const latencies = samples.map((sample2) => sample2[i].latency);
          const meanLatency = latencies.reduce((acc, latency) => acc + latency, 0) / latencies.length;
          const latencyScore = 1 - meanLatency / maxLatency;
          const successes = samples.map((sample2) => sample2[i].success);
          const stabilityScore = successes.reduce((acc, success) => acc + success, 0) / successes.length;
          if (stabilityScore === 0)
            return [0, i];
          return [
            latencyWeight * latencyScore + stabilityWeight * stabilityScore,
            i
          ];
        }).sort((a, b) => b[0] - a[0]);
        onTransports(scores.map(([, i]) => transports[i]));
        await (0, wait_js_1.wait)(interval);
        rankTransports_();
      };
      rankTransports_();
    }
  }
});

// node_modules/viem/_cjs/errors/transport.js
var require_transport = __commonJS({
  "node_modules/viem/_cjs/errors/transport.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UrlRequiredError = void 0;
    var base_js_1 = require_base();
    var UrlRequiredError = class extends base_js_1.BaseError {
      constructor() {
        super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.", {
          docsPath: "/docs/clients/intro",
          name: "UrlRequiredError"
        });
      }
    };
    exports.UrlRequiredError = UrlRequiredError;
  }
});

// node_modules/viem/_cjs/utils/promise/withTimeout.js
var require_withTimeout = __commonJS({
  "node_modules/viem/_cjs/utils/promise/withTimeout.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.withTimeout = withTimeout;
    function withTimeout(fn, { errorInstance = new Error("timed out"), timeout, signal }) {
      return new Promise((resolve, reject) => {
        ;
        (async () => {
          let timeoutId;
          try {
            const controller = new AbortController();
            if (timeout > 0) {
              timeoutId = setTimeout(() => {
                if (signal) {
                  controller.abort();
                } else {
                  reject(errorInstance);
                }
              }, timeout);
            }
            resolve(await fn({ signal: (controller == null ? void 0 : controller.signal) || null }));
          } catch (err) {
            if ((err == null ? void 0 : err.name) === "AbortError")
              reject(errorInstance);
            reject(err);
          } finally {
            clearTimeout(timeoutId);
          }
        })();
      });
    }
  }
});

// node_modules/viem/_cjs/utils/rpc/id.js
var require_id = __commonJS({
  "node_modules/viem/_cjs/utils/rpc/id.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.idCache = void 0;
    function createIdStore() {
      return {
        current: 0,
        take() {
          return this.current++;
        },
        reset() {
          this.current = 0;
        }
      };
    }
    exports.idCache = createIdStore();
  }
});

// node_modules/viem/_cjs/utils/rpc/http.js
var require_http = __commonJS({
  "node_modules/viem/_cjs/utils/rpc/http.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getHttpRpcClient = getHttpRpcClient;
    var request_js_1 = require_request();
    var withTimeout_js_1 = require_withTimeout();
    var stringify_js_1 = require_stringify();
    var id_js_1 = require_id();
    function getHttpRpcClient(url, options = {}) {
      return {
        async request(params) {
          var _a;
          const { body, onRequest = options.onRequest, onResponse = options.onResponse, timeout = options.timeout ?? 1e4 } = params;
          const fetchOptions = {
            ...options.fetchOptions ?? {},
            ...params.fetchOptions ?? {}
          };
          const { headers, method, signal: signal_ } = fetchOptions;
          try {
            const response = await (0, withTimeout_js_1.withTimeout)(async ({ signal }) => {
              const init = {
                ...fetchOptions,
                body: Array.isArray(body) ? (0, stringify_js_1.stringify)(body.map((body2) => ({
                  jsonrpc: "2.0",
                  id: body2.id ?? id_js_1.idCache.take(),
                  ...body2
                }))) : (0, stringify_js_1.stringify)({
                  jsonrpc: "2.0",
                  id: body.id ?? id_js_1.idCache.take(),
                  ...body
                }),
                headers: {
                  "Content-Type": "application/json",
                  ...headers
                },
                method: method || "POST",
                signal: signal_ || (timeout > 0 ? signal : null)
              };
              const request = new Request(url, init);
              const args = await (onRequest == null ? void 0 : onRequest(request, init)) ?? { ...init, url };
              const response2 = await fetch(args.url ?? url, args);
              return response2;
            }, {
              errorInstance: new request_js_1.TimeoutError({ body, url }),
              timeout,
              signal: true
            });
            if (onResponse)
              await onResponse(response);
            let data;
            if ((_a = response.headers.get("Content-Type")) == null ? void 0 : _a.startsWith("application/json"))
              data = await response.json();
            else {
              data = await response.text();
              try {
                data = JSON.parse(data || "{}");
              } catch (err) {
                if (response.ok)
                  throw err;
                data = { error: data };
              }
            }
            if (!response.ok) {
              throw new request_js_1.HttpRequestError({
                body,
                details: (0, stringify_js_1.stringify)(data.error) || response.statusText,
                headers: response.headers,
                status: response.status,
                url
              });
            }
            return data;
          } catch (err) {
            if (err instanceof request_js_1.HttpRequestError)
              throw err;
            if (err instanceof request_js_1.TimeoutError)
              throw err;
            throw new request_js_1.HttpRequestError({
              body,
              cause: err,
              url
            });
          }
        }
      };
    }
  }
});

// node_modules/viem/_cjs/clients/transports/http.js
var require_http2 = __commonJS({
  "node_modules/viem/_cjs/clients/transports/http.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.http = http;
    var request_js_1 = require_request();
    var transport_js_1 = require_transport();
    var createBatchScheduler_js_1 = require_createBatchScheduler();
    var http_js_1 = require_http();
    var createTransport_js_1 = require_createTransport();
    function http(url, config = {}) {
      const { batch, fetchOptions, key = "http", name = "HTTP JSON-RPC", onFetchRequest, onFetchResponse, retryDelay } = config;
      return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
        const { batchSize = 1e3, wait = 0 } = typeof batch === "object" ? batch : {};
        const retryCount = config.retryCount ?? retryCount_;
        const timeout = timeout_ ?? config.timeout ?? 1e4;
        const url_ = url || (chain == null ? void 0 : chain.rpcUrls.default.http[0]);
        if (!url_)
          throw new transport_js_1.UrlRequiredError();
        const rpcClient = (0, http_js_1.getHttpRpcClient)(url_, {
          fetchOptions,
          onRequest: onFetchRequest,
          onResponse: onFetchResponse,
          timeout
        });
        return (0, createTransport_js_1.createTransport)({
          key,
          name,
          async request({ method, params }) {
            const body = { method, params };
            const { schedule } = (0, createBatchScheduler_js_1.createBatchScheduler)({
              id: url_,
              wait,
              shouldSplitBatch(requests) {
                return requests.length > batchSize;
              },
              fn: (body2) => rpcClient.request({
                body: body2
              }),
              sort: (a, b) => a.id - b.id
            });
            const fn = async (body2) => batch ? schedule(body2) : [
              await rpcClient.request({
                body: body2
              })
            ];
            const [{ error, result }] = await fn(body);
            if (error)
              throw new request_js_1.RpcRequestError({
                body,
                error,
                url: url_
              });
            return result;
          },
          retryCount,
          retryDelay,
          timeout,
          type: "http"
        }, {
          fetchOptions,
          url: url_
        });
      };
    }
  }
});

// node_modules/viem/_cjs/utils/ens/errors.js
var require_errors2 = __commonJS({
  "node_modules/viem/_cjs/utils/ens/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isNullUniversalResolverError = isNullUniversalResolverError;
    var solidity_js_1 = require_solidity();
    var base_js_1 = require_base();
    var contract_js_1 = require_contract();
    function isNullUniversalResolverError(err, callType) {
      var _a, _b, _c, _d, _e, _f;
      if (!(err instanceof base_js_1.BaseError))
        return false;
      const cause = err.walk((e) => e instanceof contract_js_1.ContractFunctionRevertedError);
      if (!(cause instanceof contract_js_1.ContractFunctionRevertedError))
        return false;
      if (((_a = cause.data) == null ? void 0 : _a.errorName) === "ResolverNotFound")
        return true;
      if (((_b = cause.data) == null ? void 0 : _b.errorName) === "ResolverWildcardNotSupported")
        return true;
      if (((_c = cause.data) == null ? void 0 : _c.errorName) === "ResolverNotContract")
        return true;
      if (((_d = cause.data) == null ? void 0 : _d.errorName) === "ResolverError")
        return true;
      if (((_e = cause.data) == null ? void 0 : _e.errorName) === "HttpError")
        return true;
      if ((_f = cause.reason) == null ? void 0 : _f.includes("Wildcard on non-extended resolvers is not supported"))
        return true;
      if (callType === "reverse" && cause.reason === solidity_js_1.panicReasons[50])
        return true;
      return false;
    }
  }
});

// node_modules/viem/_cjs/utils/ens/encodedLabelToLabelhash.js
var require_encodedLabelToLabelhash = __commonJS({
  "node_modules/viem/_cjs/utils/ens/encodedLabelToLabelhash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodedLabelToLabelhash = encodedLabelToLabelhash;
    var isHex_js_1 = require_isHex();
    function encodedLabelToLabelhash(label) {
      if (label.length !== 66)
        return null;
      if (label.indexOf("[") !== 0)
        return null;
      if (label.indexOf("]") !== 65)
        return null;
      const hash = `0x${label.slice(1, 65)}`;
      if (!(0, isHex_js_1.isHex)(hash))
        return null;
      return hash;
    }
  }
});

// node_modules/viem/_cjs/utils/ens/namehash.js
var require_namehash = __commonJS({
  "node_modules/viem/_cjs/utils/ens/namehash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.namehash = namehash;
    var concat_js_1 = require_concat();
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    var keccak256_js_1 = require_keccak256();
    var encodedLabelToLabelhash_js_1 = require_encodedLabelToLabelhash();
    function namehash(name) {
      let result = new Uint8Array(32).fill(0);
      if (!name)
        return (0, toHex_js_1.bytesToHex)(result);
      const labels = name.split(".");
      for (let i = labels.length - 1; i >= 0; i -= 1) {
        const hashFromEncodedLabel = (0, encodedLabelToLabelhash_js_1.encodedLabelToLabelhash)(labels[i]);
        const hashed = hashFromEncodedLabel ? (0, toBytes_js_1.toBytes)(hashFromEncodedLabel) : (0, keccak256_js_1.keccak256)((0, toBytes_js_1.stringToBytes)(labels[i]), "bytes");
        result = (0, keccak256_js_1.keccak256)((0, concat_js_1.concat)([result, hashed]), "bytes");
      }
      return (0, toHex_js_1.bytesToHex)(result);
    }
  }
});

// node_modules/viem/_cjs/utils/ens/encodeLabelhash.js
var require_encodeLabelhash = __commonJS({
  "node_modules/viem/_cjs/utils/ens/encodeLabelhash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeLabelhash = encodeLabelhash;
    function encodeLabelhash(hash) {
      return `[${hash.slice(2)}]`;
    }
  }
});

// node_modules/viem/_cjs/utils/ens/labelhash.js
var require_labelhash = __commonJS({
  "node_modules/viem/_cjs/utils/ens/labelhash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.labelhash = labelhash;
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    var keccak256_js_1 = require_keccak256();
    var encodedLabelToLabelhash_js_1 = require_encodedLabelToLabelhash();
    function labelhash(label) {
      const result = new Uint8Array(32).fill(0);
      if (!label)
        return (0, toHex_js_1.bytesToHex)(result);
      return (0, encodedLabelToLabelhash_js_1.encodedLabelToLabelhash)(label) || (0, keccak256_js_1.keccak256)((0, toBytes_js_1.stringToBytes)(label));
    }
  }
});

// node_modules/viem/_cjs/utils/ens/packetToBytes.js
var require_packetToBytes = __commonJS({
  "node_modules/viem/_cjs/utils/ens/packetToBytes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.packetToBytes = packetToBytes;
    var toBytes_js_1 = require_toBytes();
    var encodeLabelhash_js_1 = require_encodeLabelhash();
    var labelhash_js_1 = require_labelhash();
    function packetToBytes(packet) {
      const value = packet.replace(/^\.|\.$/gm, "");
      if (value.length === 0)
        return new Uint8Array(1);
      const bytes = new Uint8Array((0, toBytes_js_1.stringToBytes)(value).byteLength + 2);
      let offset = 0;
      const list = value.split(".");
      for (let i = 0; i < list.length; i++) {
        let encoded = (0, toBytes_js_1.stringToBytes)(list[i]);
        if (encoded.byteLength > 255)
          encoded = (0, toBytes_js_1.stringToBytes)((0, encodeLabelhash_js_1.encodeLabelhash)((0, labelhash_js_1.labelhash)(list[i])));
        bytes[offset] = encoded.length;
        bytes.set(encoded, offset + 1);
        offset += encoded.length + 1;
      }
      if (bytes.byteLength !== offset + 1)
        return bytes.slice(0, offset + 1);
      return bytes;
    }
  }
});

// node_modules/viem/_cjs/actions/ens/getEnsAddress.js
var require_getEnsAddress = __commonJS({
  "node_modules/viem/_cjs/actions/ens/getEnsAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEnsAddress = getEnsAddress;
    var abis_js_1 = require_abis();
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var getChainContractAddress_js_1 = require_getChainContractAddress();
    var trim_js_1 = require_trim();
    var toHex_js_1 = require_toHex();
    var errors_js_1 = require_errors2();
    var namehash_js_1 = require_namehash();
    var packetToBytes_js_1 = require_packetToBytes();
    var getAction_js_1 = require_getAction();
    var readContract_js_1 = require_readContract();
    async function getEnsAddress(client, { blockNumber, blockTag, coinType, name, gatewayUrls, strict, universalResolverAddress: universalResolverAddress_ }) {
      let universalResolverAddress = universalResolverAddress_;
      if (!universalResolverAddress) {
        if (!client.chain)
          throw new Error("client chain not configured. universalResolverAddress is required.");
        universalResolverAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
          blockNumber,
          chain: client.chain,
          contract: "ensUniversalResolver"
        });
      }
      try {
        const functionData = (0, encodeFunctionData_js_1.encodeFunctionData)({
          abi: abis_js_1.addressResolverAbi,
          functionName: "addr",
          ...coinType != null ? { args: [(0, namehash_js_1.namehash)(name), BigInt(coinType)] } : { args: [(0, namehash_js_1.namehash)(name)] }
        });
        const readContractParameters = {
          address: universalResolverAddress,
          abi: abis_js_1.universalResolverResolveAbi,
          functionName: "resolve",
          args: [(0, toHex_js_1.toHex)((0, packetToBytes_js_1.packetToBytes)(name)), functionData],
          blockNumber,
          blockTag
        };
        const readContractAction = (0, getAction_js_1.getAction)(client, readContract_js_1.readContract, "readContract");
        const res = gatewayUrls ? await readContractAction({
          ...readContractParameters,
          args: [...readContractParameters.args, gatewayUrls]
        }) : await readContractAction(readContractParameters);
        if (res[0] === "0x")
          return null;
        const address = (0, decodeFunctionResult_js_1.decodeFunctionResult)({
          abi: abis_js_1.addressResolverAbi,
          args: coinType != null ? [(0, namehash_js_1.namehash)(name), BigInt(coinType)] : void 0,
          functionName: "addr",
          data: res[0]
        });
        if (address === "0x")
          return null;
        if ((0, trim_js_1.trim)(address) === "0x00")
          return null;
        return address;
      } catch (err) {
        if (strict)
          throw err;
        if ((0, errors_js_1.isNullUniversalResolverError)(err, "resolve"))
          return null;
        throw err;
      }
    }
  }
});

// node_modules/viem/_cjs/errors/ens.js
var require_ens = __commonJS({
  "node_modules/viem/_cjs/errors/ens.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EnsAvatarUnsupportedNamespaceError = exports.EnsAvatarUriResolutionError = exports.EnsAvatarInvalidNftUriError = exports.EnsAvatarInvalidMetadataError = void 0;
    var base_js_1 = require_base();
    var EnsAvatarInvalidMetadataError = class extends base_js_1.BaseError {
      constructor({ data }) {
        super("Unable to extract image from metadata. The metadata may be malformed or invalid.", {
          metaMessages: [
            "- Metadata must be a JSON object with at least an `image`, `image_url` or `image_data` property.",
            "",
            `Provided data: ${JSON.stringify(data)}`
          ],
          name: "EnsAvatarInvalidMetadataError"
        });
      }
    };
    exports.EnsAvatarInvalidMetadataError = EnsAvatarInvalidMetadataError;
    var EnsAvatarInvalidNftUriError = class extends base_js_1.BaseError {
      constructor({ reason }) {
        super(`ENS NFT avatar URI is invalid. ${reason}`, {
          name: "EnsAvatarInvalidNftUriError"
        });
      }
    };
    exports.EnsAvatarInvalidNftUriError = EnsAvatarInvalidNftUriError;
    var EnsAvatarUriResolutionError = class extends base_js_1.BaseError {
      constructor({ uri }) {
        super(`Unable to resolve ENS avatar URI "${uri}". The URI may be malformed, invalid, or does not respond with a valid image.`, { name: "EnsAvatarUriResolutionError" });
      }
    };
    exports.EnsAvatarUriResolutionError = EnsAvatarUriResolutionError;
    var EnsAvatarUnsupportedNamespaceError = class extends base_js_1.BaseError {
      constructor({ namespace }) {
        super(`ENS NFT avatar namespace "${namespace}" is not supported. Must be "erc721" or "erc1155".`, { name: "EnsAvatarUnsupportedNamespaceError" });
      }
    };
    exports.EnsAvatarUnsupportedNamespaceError = EnsAvatarUnsupportedNamespaceError;
  }
});

// node_modules/viem/_cjs/utils/ens/avatar/utils.js
var require_utils7 = __commonJS({
  "node_modules/viem/_cjs/utils/ens/avatar/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isImageUri = isImageUri;
    exports.getGateway = getGateway;
    exports.resolveAvatarUri = resolveAvatarUri;
    exports.getJsonImage = getJsonImage;
    exports.getMetadataAvatarUri = getMetadataAvatarUri;
    exports.parseAvatarUri = parseAvatarUri;
    exports.parseNftUri = parseNftUri;
    exports.getNftTokenUri = getNftTokenUri;
    var readContract_js_1 = require_readContract();
    var ens_js_1 = require_ens();
    var networkRegex = /(?<protocol>https?:\/\/[^\/]*|ipfs:\/|ipns:\/|ar:\/)?(?<root>\/)?(?<subpath>ipfs\/|ipns\/)?(?<target>[\w\-.]+)(?<subtarget>\/.*)?/;
    var ipfsHashRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})(\/(?<target>[\w\-.]+))?(?<subtarget>\/.*)?$/;
    var base64Regex = /^data:([a-zA-Z\-/+]*);base64,([^"].*)/;
    var dataURIRegex = /^data:([a-zA-Z\-/+]*)?(;[a-zA-Z0-9].*?)?(,)/;
    async function isImageUri(uri) {
      try {
        const res = await fetch(uri, { method: "HEAD" });
        if (res.status === 200) {
          const contentType = res.headers.get("content-type");
          return contentType == null ? void 0 : contentType.startsWith("image/");
        }
        return false;
      } catch (error) {
        if (typeof error === "object" && typeof error.response !== "undefined") {
          return false;
        }
        if (!globalThis.hasOwnProperty("Image"))
          return false;
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            resolve(true);
          };
          img.onerror = () => {
            resolve(false);
          };
          img.src = uri;
        });
      }
    }
    function getGateway(custom, defaultGateway) {
      if (!custom)
        return defaultGateway;
      if (custom.endsWith("/"))
        return custom.slice(0, -1);
      return custom;
    }
    function resolveAvatarUri({ uri, gatewayUrls }) {
      const isEncoded = base64Regex.test(uri);
      if (isEncoded)
        return { uri, isOnChain: true, isEncoded };
      const ipfsGateway = getGateway(gatewayUrls == null ? void 0 : gatewayUrls.ipfs, "https://ipfs.io");
      const arweaveGateway = getGateway(gatewayUrls == null ? void 0 : gatewayUrls.arweave, "https://arweave.net");
      const networkRegexMatch = uri.match(networkRegex);
      const { protocol, subpath, target, subtarget = "" } = (networkRegexMatch == null ? void 0 : networkRegexMatch.groups) || {};
      const isIPNS = protocol === "ipns:/" || subpath === "ipns/";
      const isIPFS = protocol === "ipfs:/" || subpath === "ipfs/" || ipfsHashRegex.test(uri);
      if (uri.startsWith("http") && !isIPNS && !isIPFS) {
        let replacedUri = uri;
        if (gatewayUrls == null ? void 0 : gatewayUrls.arweave)
          replacedUri = uri.replace(/https:\/\/arweave.net/g, gatewayUrls == null ? void 0 : gatewayUrls.arweave);
        return { uri: replacedUri, isOnChain: false, isEncoded: false };
      }
      if ((isIPNS || isIPFS) && target) {
        return {
          uri: `${ipfsGateway}/${isIPNS ? "ipns" : "ipfs"}/${target}${subtarget}`,
          isOnChain: false,
          isEncoded: false
        };
      }
      if (protocol === "ar:/" && target) {
        return {
          uri: `${arweaveGateway}/${target}${subtarget || ""}`,
          isOnChain: false,
          isEncoded: false
        };
      }
      let parsedUri = uri.replace(dataURIRegex, "");
      if (parsedUri.startsWith("<svg")) {
        parsedUri = `data:image/svg+xml;base64,${btoa(parsedUri)}`;
      }
      if (parsedUri.startsWith("data:") || parsedUri.startsWith("{")) {
        return {
          uri: parsedUri,
          isOnChain: true,
          isEncoded: false
        };
      }
      throw new ens_js_1.EnsAvatarUriResolutionError({ uri });
    }
    function getJsonImage(data) {
      if (typeof data !== "object" || !("image" in data) && !("image_url" in data) && !("image_data" in data)) {
        throw new ens_js_1.EnsAvatarInvalidMetadataError({ data });
      }
      return data.image || data.image_url || data.image_data;
    }
    async function getMetadataAvatarUri({ gatewayUrls, uri }) {
      try {
        const res = await fetch(uri).then((res2) => res2.json());
        const image = await parseAvatarUri({
          gatewayUrls,
          uri: getJsonImage(res)
        });
        return image;
      } catch {
        throw new ens_js_1.EnsAvatarUriResolutionError({ uri });
      }
    }
    async function parseAvatarUri({ gatewayUrls, uri }) {
      const { uri: resolvedURI, isOnChain } = resolveAvatarUri({ uri, gatewayUrls });
      if (isOnChain)
        return resolvedURI;
      const isImage = await isImageUri(resolvedURI);
      if (isImage)
        return resolvedURI;
      throw new ens_js_1.EnsAvatarUriResolutionError({ uri });
    }
    function parseNftUri(uri_) {
      let uri = uri_;
      if (uri.startsWith("did:nft:")) {
        uri = uri.replace("did:nft:", "").replace(/_/g, "/");
      }
      const [reference, asset_namespace, tokenID] = uri.split("/");
      const [eip_namespace, chainID] = reference.split(":");
      const [erc_namespace, contractAddress] = asset_namespace.split(":");
      if (!eip_namespace || eip_namespace.toLowerCase() !== "eip155")
        throw new ens_js_1.EnsAvatarInvalidNftUriError({ reason: "Only EIP-155 supported" });
      if (!chainID)
        throw new ens_js_1.EnsAvatarInvalidNftUriError({ reason: "Chain ID not found" });
      if (!contractAddress)
        throw new ens_js_1.EnsAvatarInvalidNftUriError({
          reason: "Contract address not found"
        });
      if (!tokenID)
        throw new ens_js_1.EnsAvatarInvalidNftUriError({ reason: "Token ID not found" });
      if (!erc_namespace)
        throw new ens_js_1.EnsAvatarInvalidNftUriError({ reason: "ERC namespace not found" });
      return {
        chainID: Number.parseInt(chainID),
        namespace: erc_namespace.toLowerCase(),
        contractAddress,
        tokenID
      };
    }
    async function getNftTokenUri(client, { nft }) {
      if (nft.namespace === "erc721") {
        return (0, readContract_js_1.readContract)(client, {
          address: nft.contractAddress,
          abi: [
            {
              name: "tokenURI",
              type: "function",
              stateMutability: "view",
              inputs: [{ name: "tokenId", type: "uint256" }],
              outputs: [{ name: "", type: "string" }]
            }
          ],
          functionName: "tokenURI",
          args: [BigInt(nft.tokenID)]
        });
      }
      if (nft.namespace === "erc1155") {
        return (0, readContract_js_1.readContract)(client, {
          address: nft.contractAddress,
          abi: [
            {
              name: "uri",
              type: "function",
              stateMutability: "view",
              inputs: [{ name: "_id", type: "uint256" }],
              outputs: [{ name: "", type: "string" }]
            }
          ],
          functionName: "uri",
          args: [BigInt(nft.tokenID)]
        });
      }
      throw new ens_js_1.EnsAvatarUnsupportedNamespaceError({ namespace: nft.namespace });
    }
  }
});

// node_modules/viem/_cjs/utils/ens/avatar/parseAvatarRecord.js
var require_parseAvatarRecord = __commonJS({
  "node_modules/viem/_cjs/utils/ens/avatar/parseAvatarRecord.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseAvatarRecord = parseAvatarRecord;
    var utils_js_1 = require_utils7();
    async function parseAvatarRecord(client, { gatewayUrls, record }) {
      if (/eip155:/i.test(record))
        return parseNftAvatarUri(client, { gatewayUrls, record });
      return (0, utils_js_1.parseAvatarUri)({ uri: record, gatewayUrls });
    }
    async function parseNftAvatarUri(client, { gatewayUrls, record }) {
      const nft = (0, utils_js_1.parseNftUri)(record);
      const nftUri = await (0, utils_js_1.getNftTokenUri)(client, { nft });
      const { uri: resolvedNftUri, isOnChain, isEncoded } = (0, utils_js_1.resolveAvatarUri)({ uri: nftUri, gatewayUrls });
      if (isOnChain && (resolvedNftUri.includes("data:application/json;base64,") || resolvedNftUri.startsWith("{"))) {
        const encodedJson = isEncoded ? atob(resolvedNftUri.replace("data:application/json;base64,", "")) : resolvedNftUri;
        const decoded = JSON.parse(encodedJson);
        return (0, utils_js_1.parseAvatarUri)({ uri: (0, utils_js_1.getJsonImage)(decoded), gatewayUrls });
      }
      let uriTokenId = nft.tokenID;
      if (nft.namespace === "erc1155")
        uriTokenId = uriTokenId.replace("0x", "").padStart(64, "0");
      return (0, utils_js_1.getMetadataAvatarUri)({
        gatewayUrls,
        uri: resolvedNftUri.replace(/(?:0x)?{id}/, uriTokenId)
      });
    }
  }
});

// node_modules/viem/_cjs/actions/ens/getEnsText.js
var require_getEnsText = __commonJS({
  "node_modules/viem/_cjs/actions/ens/getEnsText.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEnsText = getEnsText;
    var abis_js_1 = require_abis();
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var getChainContractAddress_js_1 = require_getChainContractAddress();
    var toHex_js_1 = require_toHex();
    var errors_js_1 = require_errors2();
    var namehash_js_1 = require_namehash();
    var packetToBytes_js_1 = require_packetToBytes();
    var getAction_js_1 = require_getAction();
    var readContract_js_1 = require_readContract();
    async function getEnsText(client, { blockNumber, blockTag, name, key, gatewayUrls, strict, universalResolverAddress: universalResolverAddress_ }) {
      let universalResolverAddress = universalResolverAddress_;
      if (!universalResolverAddress) {
        if (!client.chain)
          throw new Error("client chain not configured. universalResolverAddress is required.");
        universalResolverAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
          blockNumber,
          chain: client.chain,
          contract: "ensUniversalResolver"
        });
      }
      try {
        const readContractParameters = {
          address: universalResolverAddress,
          abi: abis_js_1.universalResolverResolveAbi,
          functionName: "resolve",
          args: [
            (0, toHex_js_1.toHex)((0, packetToBytes_js_1.packetToBytes)(name)),
            (0, encodeFunctionData_js_1.encodeFunctionData)({
              abi: abis_js_1.textResolverAbi,
              functionName: "text",
              args: [(0, namehash_js_1.namehash)(name), key]
            })
          ],
          blockNumber,
          blockTag
        };
        const readContractAction = (0, getAction_js_1.getAction)(client, readContract_js_1.readContract, "readContract");
        const res = gatewayUrls ? await readContractAction({
          ...readContractParameters,
          args: [...readContractParameters.args, gatewayUrls]
        }) : await readContractAction(readContractParameters);
        if (res[0] === "0x")
          return null;
        const record = (0, decodeFunctionResult_js_1.decodeFunctionResult)({
          abi: abis_js_1.textResolverAbi,
          functionName: "text",
          data: res[0]
        });
        return record === "" ? null : record;
      } catch (err) {
        if (strict)
          throw err;
        if ((0, errors_js_1.isNullUniversalResolverError)(err, "resolve"))
          return null;
        throw err;
      }
    }
  }
});

// node_modules/viem/_cjs/actions/ens/getEnsAvatar.js
var require_getEnsAvatar = __commonJS({
  "node_modules/viem/_cjs/actions/ens/getEnsAvatar.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEnsAvatar = getEnsAvatar;
    var parseAvatarRecord_js_1 = require_parseAvatarRecord();
    var getAction_js_1 = require_getAction();
    var getEnsText_js_1 = require_getEnsText();
    async function getEnsAvatar(client, { blockNumber, blockTag, assetGatewayUrls, name, gatewayUrls, strict, universalResolverAddress }) {
      const record = await (0, getAction_js_1.getAction)(client, getEnsText_js_1.getEnsText, "getEnsText")({
        blockNumber,
        blockTag,
        key: "avatar",
        name,
        universalResolverAddress,
        gatewayUrls,
        strict
      });
      if (!record)
        return null;
      try {
        return await (0, parseAvatarRecord_js_1.parseAvatarRecord)(client, {
          record,
          gatewayUrls: assetGatewayUrls
        });
      } catch {
        return null;
      }
    }
  }
});

// node_modules/viem/_cjs/actions/ens/getEnsName.js
var require_getEnsName = __commonJS({
  "node_modules/viem/_cjs/actions/ens/getEnsName.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEnsName = getEnsName;
    var abis_js_1 = require_abis();
    var getChainContractAddress_js_1 = require_getChainContractAddress();
    var toHex_js_1 = require_toHex();
    var errors_js_1 = require_errors2();
    var packetToBytes_js_1 = require_packetToBytes();
    var getAction_js_1 = require_getAction();
    var readContract_js_1 = require_readContract();
    async function getEnsName(client, { address, blockNumber, blockTag, gatewayUrls, strict, universalResolverAddress: universalResolverAddress_ }) {
      let universalResolverAddress = universalResolverAddress_;
      if (!universalResolverAddress) {
        if (!client.chain)
          throw new Error("client chain not configured. universalResolverAddress is required.");
        universalResolverAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
          blockNumber,
          chain: client.chain,
          contract: "ensUniversalResolver"
        });
      }
      const reverseNode = `${address.toLowerCase().substring(2)}.addr.reverse`;
      try {
        const readContractParameters = {
          address: universalResolverAddress,
          abi: abis_js_1.universalResolverReverseAbi,
          functionName: "reverse",
          args: [(0, toHex_js_1.toHex)((0, packetToBytes_js_1.packetToBytes)(reverseNode))],
          blockNumber,
          blockTag
        };
        const readContractAction = (0, getAction_js_1.getAction)(client, readContract_js_1.readContract, "readContract");
        const [name, resolvedAddress] = gatewayUrls ? await readContractAction({
          ...readContractParameters,
          args: [...readContractParameters.args, gatewayUrls]
        }) : await readContractAction(readContractParameters);
        if (address.toLowerCase() !== resolvedAddress.toLowerCase())
          return null;
        return name;
      } catch (err) {
        if (strict)
          throw err;
        if ((0, errors_js_1.isNullUniversalResolverError)(err, "reverse"))
          return null;
        throw err;
      }
    }
  }
});

// node_modules/viem/_cjs/actions/ens/getEnsResolver.js
var require_getEnsResolver = __commonJS({
  "node_modules/viem/_cjs/actions/ens/getEnsResolver.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEnsResolver = getEnsResolver;
    var getChainContractAddress_js_1 = require_getChainContractAddress();
    var toHex_js_1 = require_toHex();
    var packetToBytes_js_1 = require_packetToBytes();
    var getAction_js_1 = require_getAction();
    var readContract_js_1 = require_readContract();
    async function getEnsResolver(client, { blockNumber, blockTag, name, universalResolverAddress: universalResolverAddress_ }) {
      let universalResolverAddress = universalResolverAddress_;
      if (!universalResolverAddress) {
        if (!client.chain)
          throw new Error("client chain not configured. universalResolverAddress is required.");
        universalResolverAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
          blockNumber,
          chain: client.chain,
          contract: "ensUniversalResolver"
        });
      }
      const [resolverAddress] = await (0, getAction_js_1.getAction)(client, readContract_js_1.readContract, "readContract")({
        address: universalResolverAddress,
        abi: [
          {
            inputs: [{ type: "bytes" }],
            name: "findResolver",
            outputs: [{ type: "address" }, { type: "bytes32" }],
            stateMutability: "view",
            type: "function"
          }
        ],
        functionName: "findResolver",
        args: [(0, toHex_js_1.toHex)((0, packetToBytes_js_1.packetToBytes)(name))],
        blockNumber,
        blockTag
      });
      return resolverAddress;
    }
  }
});

// node_modules/viem/_cjs/actions/public/createAccessList.js
var require_createAccessList = __commonJS({
  "node_modules/viem/_cjs/actions/public/createAccessList.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createAccessList = createAccessList;
    var parseAccount_js_1 = require_parseAccount();
    var toHex_js_1 = require_toHex();
    var getCallError_js_1 = require_getCallError();
    var extract_js_1 = require_extract();
    var transactionRequest_js_1 = require_transactionRequest();
    var assertRequest_js_1 = require_assertRequest();
    async function createAccessList(client, args) {
      var _a, _b, _c;
      const { account: account_ = client.account, blockNumber, blockTag = "latest", blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, to, value, ...rest } = args;
      const account = account_ ? (0, parseAccount_js_1.parseAccount)(account_) : void 0;
      try {
        (0, assertRequest_js_1.assertRequest)(args);
        const blockNumberHex = blockNumber ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
        const block = blockNumberHex || blockTag;
        const chainFormat = (_c = (_b = (_a = client.chain) == null ? void 0 : _a.formatters) == null ? void 0 : _b.transactionRequest) == null ? void 0 : _c.format;
        const format = chainFormat || transactionRequest_js_1.formatTransactionRequest;
        const request = format({
          ...(0, extract_js_1.extract)(rest, { format: chainFormat }),
          from: account == null ? void 0 : account.address,
          blobs,
          data,
          gas,
          gasPrice,
          maxFeePerBlobGas,
          maxFeePerGas,
          maxPriorityFeePerGas,
          to,
          value
        });
        const response = await client.request({
          method: "eth_createAccessList",
          params: [request, block]
        });
        return {
          accessList: response.accessList,
          gasUsed: BigInt(response.gasUsed)
        };
      } catch (err) {
        throw (0, getCallError_js_1.getCallError)(err, {
          ...args,
          account,
          chain: client.chain
        });
      }
    }
  }
});

// node_modules/viem/_cjs/actions/public/createBlockFilter.js
var require_createBlockFilter = __commonJS({
  "node_modules/viem/_cjs/actions/public/createBlockFilter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createBlockFilter = createBlockFilter;
    var createFilterRequestScope_js_1 = require_createFilterRequestScope();
    async function createBlockFilter(client) {
      const getRequest = (0, createFilterRequestScope_js_1.createFilterRequestScope)(client, {
        method: "eth_newBlockFilter"
      });
      const id = await client.request({
        method: "eth_newBlockFilter"
      });
      return { id, request: getRequest(id), type: "block" };
    }
  }
});

// node_modules/viem/_cjs/actions/public/createEventFilter.js
var require_createEventFilter = __commonJS({
  "node_modules/viem/_cjs/actions/public/createEventFilter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createEventFilter = createEventFilter;
    var encodeEventTopics_js_1 = require_encodeEventTopics();
    var toHex_js_1 = require_toHex();
    var createFilterRequestScope_js_1 = require_createFilterRequestScope();
    async function createEventFilter(client, { address, args, event, events: events_, fromBlock, strict, toBlock } = {}) {
      const events = events_ ?? (event ? [event] : void 0);
      const getRequest = (0, createFilterRequestScope_js_1.createFilterRequestScope)(client, {
        method: "eth_newFilter"
      });
      let topics = [];
      if (events) {
        const encoded = events.flatMap((event2) => (0, encodeEventTopics_js_1.encodeEventTopics)({
          abi: [event2],
          eventName: event2.name,
          args
        }));
        topics = [encoded];
        if (event)
          topics = topics[0];
      }
      const id = await client.request({
        method: "eth_newFilter",
        params: [
          {
            address,
            fromBlock: typeof fromBlock === "bigint" ? (0, toHex_js_1.numberToHex)(fromBlock) : fromBlock,
            toBlock: typeof toBlock === "bigint" ? (0, toHex_js_1.numberToHex)(toBlock) : toBlock,
            ...topics.length ? { topics } : {}
          }
        ]
      });
      return {
        abi: events,
        args,
        eventName: event ? event.name : void 0,
        fromBlock,
        id,
        request: getRequest(id),
        strict: Boolean(strict),
        toBlock,
        type: "event"
      };
    }
  }
});

// node_modules/viem/_cjs/actions/public/createPendingTransactionFilter.js
var require_createPendingTransactionFilter = __commonJS({
  "node_modules/viem/_cjs/actions/public/createPendingTransactionFilter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createPendingTransactionFilter = createPendingTransactionFilter;
    var createFilterRequestScope_js_1 = require_createFilterRequestScope();
    async function createPendingTransactionFilter(client) {
      const getRequest = (0, createFilterRequestScope_js_1.createFilterRequestScope)(client, {
        method: "eth_newPendingTransactionFilter"
      });
      const id = await client.request({
        method: "eth_newPendingTransactionFilter"
      });
      return { id, request: getRequest(id), type: "transaction" };
    }
  }
});

// node_modules/viem/_cjs/actions/public/getBlobBaseFee.js
var require_getBlobBaseFee = __commonJS({
  "node_modules/viem/_cjs/actions/public/getBlobBaseFee.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBlobBaseFee = getBlobBaseFee;
    async function getBlobBaseFee(client) {
      const baseFee = await client.request({
        method: "eth_blobBaseFee"
      });
      return BigInt(baseFee);
    }
  }
});

// node_modules/viem/_cjs/actions/public/getBlockTransactionCount.js
var require_getBlockTransactionCount = __commonJS({
  "node_modules/viem/_cjs/actions/public/getBlockTransactionCount.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBlockTransactionCount = getBlockTransactionCount;
    var fromHex_js_1 = require_fromHex();
    var toHex_js_1 = require_toHex();
    async function getBlockTransactionCount(client, { blockHash, blockNumber, blockTag = "latest" } = {}) {
      const blockNumberHex = blockNumber !== void 0 ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      let count;
      if (blockHash) {
        count = await client.request({
          method: "eth_getBlockTransactionCountByHash",
          params: [blockHash]
        }, { dedupe: true });
      } else {
        count = await client.request({
          method: "eth_getBlockTransactionCountByNumber",
          params: [blockNumberHex || blockTag]
        }, { dedupe: Boolean(blockNumberHex) });
      }
      return (0, fromHex_js_1.hexToNumber)(count);
    }
  }
});

// node_modules/viem/_cjs/actions/public/getCode.js
var require_getCode = __commonJS({
  "node_modules/viem/_cjs/actions/public/getCode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCode = getCode;
    var toHex_js_1 = require_toHex();
    async function getCode(client, { address, blockNumber, blockTag = "latest" }) {
      const blockNumberHex = blockNumber !== void 0 ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      const hex = await client.request({
        method: "eth_getCode",
        params: [address, blockNumberHex || blockTag]
      }, { dedupe: Boolean(blockNumberHex) });
      if (hex === "0x")
        return void 0;
      return hex;
    }
  }
});

// node_modules/viem/_cjs/errors/eip712.js
var require_eip712 = __commonJS({
  "node_modules/viem/_cjs/errors/eip712.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Eip712DomainNotFoundError = void 0;
    var base_js_1 = require_base();
    var Eip712DomainNotFoundError = class extends base_js_1.BaseError {
      constructor({ address }) {
        super(`No EIP-712 domain found on contract "${address}".`, {
          metaMessages: [
            "Ensure that:",
            `- The contract is deployed at the address "${address}".`,
            "- `eip712Domain()` function exists on the contract.",
            "- `eip712Domain()` function matches signature to ERC-5267 specification."
          ],
          name: "Eip712DomainNotFoundError"
        });
      }
    };
    exports.Eip712DomainNotFoundError = Eip712DomainNotFoundError;
  }
});

// node_modules/viem/_cjs/actions/public/getEip712Domain.js
var require_getEip712Domain = __commonJS({
  "node_modules/viem/_cjs/actions/public/getEip712Domain.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEip712Domain = getEip712Domain;
    var eip712_js_1 = require_eip712();
    var getAction_js_1 = require_getAction();
    var readContract_js_1 = require_readContract();
    async function getEip712Domain(client, parameters) {
      const { address, factory, factoryData } = parameters;
      try {
        const [fields, name, version, chainId, verifyingContract, salt, extensions] = await (0, getAction_js_1.getAction)(client, readContract_js_1.readContract, "readContract")({
          abi,
          address,
          functionName: "eip712Domain",
          factory,
          factoryData
        });
        return {
          domain: {
            name,
            version,
            chainId: Number(chainId),
            verifyingContract,
            salt
          },
          extensions,
          fields
        };
      } catch (e) {
        const error = e;
        if (error.name === "ContractFunctionExecutionError" && error.cause.name === "ContractFunctionZeroDataError") {
          throw new eip712_js_1.Eip712DomainNotFoundError({ address });
        }
        throw error;
      }
    }
    var abi = [
      {
        inputs: [],
        name: "eip712Domain",
        outputs: [
          { name: "fields", type: "bytes1" },
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
          { name: "salt", type: "bytes32" },
          { name: "extensions", type: "uint256[]" }
        ],
        stateMutability: "view",
        type: "function"
      }
    ];
  }
});

// node_modules/viem/_cjs/utils/formatters/feeHistory.js
var require_feeHistory = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/feeHistory.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatFeeHistory = formatFeeHistory;
    function formatFeeHistory(feeHistory) {
      var _a;
      return {
        baseFeePerGas: feeHistory.baseFeePerGas.map((value) => BigInt(value)),
        gasUsedRatio: feeHistory.gasUsedRatio,
        oldestBlock: BigInt(feeHistory.oldestBlock),
        reward: (_a = feeHistory.reward) == null ? void 0 : _a.map((reward) => reward.map((value) => BigInt(value)))
      };
    }
  }
});

// node_modules/viem/_cjs/actions/public/getFeeHistory.js
var require_getFeeHistory = __commonJS({
  "node_modules/viem/_cjs/actions/public/getFeeHistory.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getFeeHistory = getFeeHistory;
    var toHex_js_1 = require_toHex();
    var feeHistory_js_1 = require_feeHistory();
    async function getFeeHistory(client, { blockCount, blockNumber, blockTag = "latest", rewardPercentiles }) {
      const blockNumberHex = blockNumber ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      const feeHistory = await client.request({
        method: "eth_feeHistory",
        params: [
          (0, toHex_js_1.numberToHex)(blockCount),
          blockNumberHex || blockTag,
          rewardPercentiles
        ]
      }, { dedupe: Boolean(blockNumberHex) });
      return (0, feeHistory_js_1.formatFeeHistory)(feeHistory);
    }
  }
});

// node_modules/viem/_cjs/actions/public/getFilterLogs.js
var require_getFilterLogs = __commonJS({
  "node_modules/viem/_cjs/actions/public/getFilterLogs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getFilterLogs = getFilterLogs;
    var parseEventLogs_js_1 = require_parseEventLogs();
    var log_js_1 = require_log2();
    async function getFilterLogs(_client, { filter }) {
      const strict = filter.strict ?? false;
      const logs = await filter.request({
        method: "eth_getFilterLogs",
        params: [filter.id]
      });
      const formattedLogs = logs.map((log) => (0, log_js_1.formatLog)(log));
      if (!filter.abi)
        return formattedLogs;
      return (0, parseEventLogs_js_1.parseEventLogs)({
        abi: filter.abi,
        logs: formattedLogs,
        strict
      });
    }
  }
});

// node_modules/viem/_cjs/utils/chain/defineChain.js
var require_defineChain = __commonJS({
  "node_modules/viem/_cjs/utils/chain/defineChain.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defineChain = defineChain;
    function defineChain(chain) {
      return {
        formatters: void 0,
        fees: void 0,
        serializers: void 0,
        ...chain
      };
    }
  }
});

// node_modules/viem/_cjs/utils/chain/extractChain.js
var require_extractChain = __commonJS({
  "node_modules/viem/_cjs/utils/chain/extractChain.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extractChain = extractChain;
    function extractChain({ chains, id }) {
      return chains.find((chain) => chain.id === id);
    }
  }
});

// node_modules/viem/_cjs/utils/rpc/socket.js
var require_socket = __commonJS({
  "node_modules/viem/_cjs/utils/rpc/socket.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.socketClientCache = void 0;
    exports.getSocketRpcClient = getSocketRpcClient;
    var request_js_1 = require_request();
    var createBatchScheduler_js_1 = require_createBatchScheduler();
    var withTimeout_js_1 = require_withTimeout();
    var id_js_1 = require_id();
    exports.socketClientCache = /* @__PURE__ */ new Map();
    async function getSocketRpcClient(parameters) {
      const { getSocket, keepAlive = true, key = "socket", reconnect = true, url } = parameters;
      const { interval: keepAliveInterval = 3e4 } = typeof keepAlive === "object" ? keepAlive : {};
      const { attempts = 5, delay = 2e3 } = typeof reconnect === "object" ? reconnect : {};
      let socketClient = exports.socketClientCache.get(`${key}:${url}`);
      if (socketClient)
        return socketClient;
      let reconnectCount = 0;
      const { schedule } = (0, createBatchScheduler_js_1.createBatchScheduler)({
        id: `${key}:${url}`,
        fn: async () => {
          const requests = /* @__PURE__ */ new Map();
          const subscriptions = /* @__PURE__ */ new Map();
          let error;
          let socket;
          let keepAliveTimer;
          async function setup() {
            const result = await getSocket({
              onClose() {
                var _a, _b;
                for (const request of requests.values())
                  (_a = request.onError) == null ? void 0 : _a.call(request, new request_js_1.SocketClosedError({ url }));
                for (const subscription of subscriptions.values())
                  (_b = subscription.onError) == null ? void 0 : _b.call(subscription, new request_js_1.SocketClosedError({ url }));
                requests.clear();
                subscriptions.clear();
                if (reconnect && reconnectCount < attempts)
                  setTimeout(async () => {
                    reconnectCount++;
                    await setup().catch(console.error);
                  }, delay);
              },
              onError(error_) {
                var _a, _b;
                error = error_;
                for (const request of requests.values())
                  (_a = request.onError) == null ? void 0 : _a.call(request, error);
                for (const subscription of subscriptions.values())
                  (_b = subscription.onError) == null ? void 0 : _b.call(subscription, error);
                requests.clear();
                subscriptions.clear();
                if (reconnect && reconnectCount < attempts)
                  setTimeout(async () => {
                    reconnectCount++;
                    await setup().catch(console.error);
                  }, delay);
              },
              onOpen() {
                error = void 0;
                reconnectCount = 0;
              },
              onResponse(data) {
                const isSubscription = data.method === "eth_subscription";
                const id = isSubscription ? data.params.subscription : data.id;
                const cache = isSubscription ? subscriptions : requests;
                const callback = cache.get(id);
                if (callback)
                  callback.onResponse(data);
                if (!isSubscription)
                  cache.delete(id);
              }
            });
            socket = result;
            if (keepAlive) {
              if (keepAliveTimer)
                clearInterval(keepAliveTimer);
              keepAliveTimer = setInterval(() => {
                var _a;
                return (_a = socket.ping) == null ? void 0 : _a.call(socket);
              }, keepAliveInterval);
            }
            return result;
          }
          await setup();
          error = void 0;
          socketClient = {
            close() {
              keepAliveTimer && clearInterval(keepAliveTimer);
              socket.close();
              exports.socketClientCache.delete(`${key}:${url}`);
            },
            get socket() {
              return socket;
            },
            request({ body, onError, onResponse }) {
              if (error && onError)
                onError(error);
              const id = body.id ?? id_js_1.idCache.take();
              const callback = (response) => {
                var _a;
                if (typeof response.id === "number" && id !== response.id)
                  return;
                if (body.method === "eth_subscribe" && typeof response.result === "string")
                  subscriptions.set(response.result, {
                    onResponse: callback,
                    onError
                  });
                if (body.method === "eth_unsubscribe")
                  subscriptions.delete((_a = body.params) == null ? void 0 : _a[0]);
                onResponse(response);
              };
              requests.set(id, { onResponse: callback, onError });
              try {
                socket.request({
                  body: {
                    jsonrpc: "2.0",
                    id,
                    ...body
                  }
                });
              } catch (error2) {
                onError == null ? void 0 : onError(error2);
              }
            },
            requestAsync({ body, timeout = 1e4 }) {
              return (0, withTimeout_js_1.withTimeout)(() => new Promise((onResponse, onError) => this.request({
                body,
                onError,
                onResponse
              })), {
                errorInstance: new request_js_1.TimeoutError({ body, url }),
                timeout
              });
            },
            requests,
            subscriptions,
            url
          };
          exports.socketClientCache.set(`${key}:${url}`, socketClient);
          return [socketClient];
        }
      });
      const [_, [socketClient_]] = await schedule();
      return socketClient_;
    }
  }
});

// node_modules/viem/_cjs/utils/rpc/webSocket.js
var require_webSocket = __commonJS({
  "node_modules/viem/_cjs/utils/rpc/webSocket.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getWebSocketRpcClient = getWebSocketRpcClient;
    var request_js_1 = require_request();
    var socket_js_1 = require_socket();
    async function getWebSocketRpcClient(url, options = {}) {
      const { keepAlive, reconnect } = options;
      return (0, socket_js_1.getSocketRpcClient)({
        async getSocket({ onClose, onError, onOpen, onResponse }) {
          const WebSocket = await Promise.resolve().then(() => (init_native(), __toCommonJS(native_exports))).then((module2) => module2.WebSocket);
          const socket = new WebSocket(url);
          function onClose_() {
            onClose();
            socket.removeEventListener("close", onClose_);
            socket.removeEventListener("message", onMessage);
            socket.removeEventListener("error", onError);
            socket.removeEventListener("open", onOpen);
          }
          function onMessage({ data }) {
            onResponse(JSON.parse(data));
          }
          socket.addEventListener("close", onClose_);
          socket.addEventListener("message", onMessage);
          socket.addEventListener("error", onError);
          socket.addEventListener("open", onOpen);
          if (socket.readyState === WebSocket.CONNECTING) {
            await new Promise((resolve, reject) => {
              if (!socket)
                return;
              socket.onopen = resolve;
              socket.onerror = reject;
            });
          }
          const { close: close_ } = socket;
          return Object.assign(socket, {
            close() {
              close_.bind(socket)();
              onClose();
            },
            ping() {
              try {
                if (socket.readyState === socket.CLOSED || socket.readyState === socket.CLOSING)
                  throw new request_js_1.WebSocketRequestError({
                    url: socket.url,
                    cause: new request_js_1.SocketClosedError({ url: socket.url })
                  });
                const body = {
                  jsonrpc: "2.0",
                  method: "net_version",
                  params: []
                };
                socket.send(JSON.stringify(body));
              } catch (error) {
                onError(error);
              }
            },
            request({ body }) {
              if (socket.readyState === socket.CLOSED || socket.readyState === socket.CLOSING)
                throw new request_js_1.WebSocketRequestError({
                  body,
                  url: socket.url,
                  cause: new request_js_1.SocketClosedError({ url: socket.url })
                });
              return socket.send(JSON.stringify(body));
            }
          });
        },
        keepAlive,
        reconnect,
        url
      });
    }
  }
});

// node_modules/viem/_cjs/utils/rpc/compat.js
var require_compat = __commonJS({
  "node_modules/viem/_cjs/utils/rpc/compat.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rpc = void 0;
    exports.getSocket = getSocket;
    var http_js_1 = require_http();
    var webSocket_js_1 = require_webSocket();
    function webSocket(socketClient, { body, onError, onResponse }) {
      socketClient.request({
        body,
        onError,
        onResponse
      });
      return socketClient;
    }
    async function webSocketAsync(socketClient, { body, timeout = 1e4 }) {
      return socketClient.requestAsync({
        body,
        timeout
      });
    }
    async function getSocket(url) {
      const client = await (0, webSocket_js_1.getWebSocketRpcClient)(url);
      return Object.assign(client.socket, {
        requests: client.requests,
        subscriptions: client.subscriptions
      });
    }
    exports.rpc = {
      http(url, params) {
        return (0, http_js_1.getHttpRpcClient)(url).request(params);
      },
      webSocket,
      webSocketAsync
    };
  }
});

// node_modules/viem/_cjs/errors/typedData.js
var require_typedData = __commonJS({
  "node_modules/viem/_cjs/errors/typedData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidStructTypeError = exports.InvalidPrimaryTypeError = exports.InvalidDomainError = void 0;
    var stringify_js_1 = require_stringify();
    var base_js_1 = require_base();
    var InvalidDomainError = class extends base_js_1.BaseError {
      constructor({ domain }) {
        super(`Invalid domain "${(0, stringify_js_1.stringify)(domain)}".`, {
          metaMessages: ["Must be a valid EIP-712 domain."]
        });
      }
    };
    exports.InvalidDomainError = InvalidDomainError;
    var InvalidPrimaryTypeError = class extends base_js_1.BaseError {
      constructor({ primaryType, types }) {
        super(`Invalid primary type \`${primaryType}\` must be one of \`${JSON.stringify(Object.keys(types))}\`.`, {
          docsPath: "/api/glossary/Errors#typeddatainvalidprimarytypeerror",
          metaMessages: ["Check that the primary type is a key in `types`."]
        });
      }
    };
    exports.InvalidPrimaryTypeError = InvalidPrimaryTypeError;
    var InvalidStructTypeError = class extends base_js_1.BaseError {
      constructor({ type }) {
        super(`Struct type "${type}" is invalid.`, {
          metaMessages: ["Struct type must not be a Solidity type."],
          name: "InvalidStructTypeError"
        });
      }
    };
    exports.InvalidStructTypeError = InvalidStructTypeError;
  }
});

// node_modules/viem/_cjs/utils/signature/hashTypedData.js
var require_hashTypedData = __commonJS({
  "node_modules/viem/_cjs/utils/signature/hashTypedData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hashTypedData = hashTypedData;
    exports.hashDomain = hashDomain;
    exports.hashStruct = hashStruct;
    exports.encodeType = encodeType;
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    var concat_js_1 = require_concat();
    var toHex_js_1 = require_toHex();
    var keccak256_js_1 = require_keccak256();
    var typedData_js_1 = require_typedData2();
    function hashTypedData(parameters) {
      const { domain = {}, message, primaryType } = parameters;
      const types = {
        EIP712Domain: (0, typedData_js_1.getTypesForEIP712Domain)({ domain }),
        ...parameters.types
      };
      (0, typedData_js_1.validateTypedData)({
        domain,
        message,
        primaryType,
        types
      });
      const parts = ["0x1901"];
      if (domain)
        parts.push(hashDomain({
          domain,
          types
        }));
      if (primaryType !== "EIP712Domain")
        parts.push(hashStruct({
          data: message,
          primaryType,
          types
        }));
      return (0, keccak256_js_1.keccak256)((0, concat_js_1.concat)(parts));
    }
    function hashDomain({ domain, types }) {
      return hashStruct({
        data: domain,
        primaryType: "EIP712Domain",
        types
      });
    }
    function hashStruct({ data, primaryType, types }) {
      const encoded = encodeData({
        data,
        primaryType,
        types
      });
      return (0, keccak256_js_1.keccak256)(encoded);
    }
    function encodeData({ data, primaryType, types }) {
      const encodedTypes = [{ type: "bytes32" }];
      const encodedValues = [hashType({ primaryType, types })];
      for (const field of types[primaryType]) {
        const [type, value] = encodeField({
          types,
          name: field.name,
          type: field.type,
          value: data[field.name]
        });
        encodedTypes.push(type);
        encodedValues.push(value);
      }
      return (0, encodeAbiParameters_js_1.encodeAbiParameters)(encodedTypes, encodedValues);
    }
    function hashType({ primaryType, types }) {
      const encodedHashType = (0, toHex_js_1.toHex)(encodeType({ primaryType, types }));
      return (0, keccak256_js_1.keccak256)(encodedHashType);
    }
    function encodeType({ primaryType, types }) {
      let result = "";
      const unsortedDeps = findTypeDependencies({ primaryType, types });
      unsortedDeps.delete(primaryType);
      const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
      for (const type of deps) {
        result += `${type}(${types[type].map(({ name, type: t }) => `${t} ${name}`).join(",")})`;
      }
      return result;
    }
    function findTypeDependencies({ primaryType: primaryType_, types }, results = /* @__PURE__ */ new Set()) {
      const match = primaryType_.match(/^\w*/u);
      const primaryType = match == null ? void 0 : match[0];
      if (results.has(primaryType) || types[primaryType] === void 0) {
        return results;
      }
      results.add(primaryType);
      for (const field of types[primaryType]) {
        findTypeDependencies({ primaryType: field.type, types }, results);
      }
      return results;
    }
    function encodeField({ types, name, type, value }) {
      if (types[type] !== void 0) {
        return [
          { type: "bytes32" },
          (0, keccak256_js_1.keccak256)(encodeData({ data: value, primaryType: type, types }))
        ];
      }
      if (type === "bytes") {
        const prepend = value.length % 2 ? "0" : "";
        value = `0x${prepend + value.slice(2)}`;
        return [{ type: "bytes32" }, (0, keccak256_js_1.keccak256)(value)];
      }
      if (type === "string")
        return [{ type: "bytes32" }, (0, keccak256_js_1.keccak256)((0, toHex_js_1.toHex)(value))];
      if (type.lastIndexOf("]") === type.length - 1) {
        const parsedType = type.slice(0, type.lastIndexOf("["));
        const typeValuePairs = value.map((item) => encodeField({
          name,
          type: parsedType,
          types,
          value: item
        }));
        return [
          { type: "bytes32" },
          (0, keccak256_js_1.keccak256)((0, encodeAbiParameters_js_1.encodeAbiParameters)(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))
        ];
      }
      return [{ type }, value];
    }
  }
});

// node_modules/viem/_cjs/utils/typedData.js
var require_typedData2 = __commonJS({
  "node_modules/viem/_cjs/utils/typedData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serializeTypedData = serializeTypedData;
    exports.validateTypedData = validateTypedData;
    exports.getTypesForEIP712Domain = getTypesForEIP712Domain;
    exports.domainSeparator = domainSeparator;
    var abi_js_1 = require_abi();
    var address_js_1 = require_address();
    var typedData_js_1 = require_typedData();
    var isAddress_js_1 = require_isAddress();
    var size_js_1 = require_size();
    var toHex_js_1 = require_toHex();
    var regex_js_1 = require_regex2();
    var hashTypedData_js_1 = require_hashTypedData();
    var stringify_js_1 = require_stringify();
    function serializeTypedData(parameters) {
      const { domain: domain_, message: message_, primaryType, types } = parameters;
      const normalizeData = (struct, data_) => {
        const data = { ...data_ };
        for (const param of struct) {
          const { name, type } = param;
          if (type === "address")
            data[name] = data[name].toLowerCase();
        }
        return data;
      };
      const domain = (() => {
        if (!types.EIP712Domain)
          return {};
        if (!domain_)
          return {};
        return normalizeData(types.EIP712Domain, domain_);
      })();
      const message = (() => {
        if (primaryType === "EIP712Domain")
          return void 0;
        return normalizeData(types[primaryType], message_);
      })();
      return (0, stringify_js_1.stringify)({ domain, message, primaryType, types });
    }
    function validateTypedData(parameters) {
      const { domain, message, primaryType, types } = parameters;
      const validateData = (struct, data) => {
        for (const param of struct) {
          const { name, type } = param;
          const value = data[name];
          const integerMatch = type.match(regex_js_1.integerRegex);
          if (integerMatch && (typeof value === "number" || typeof value === "bigint")) {
            const [_type, base, size_] = integerMatch;
            (0, toHex_js_1.numberToHex)(value, {
              signed: base === "int",
              size: Number.parseInt(size_) / 8
            });
          }
          if (type === "address" && typeof value === "string" && !(0, isAddress_js_1.isAddress)(value))
            throw new address_js_1.InvalidAddressError({ address: value });
          const bytesMatch = type.match(regex_js_1.bytesRegex);
          if (bytesMatch) {
            const [_type, size_] = bytesMatch;
            if (size_ && (0, size_js_1.size)(value) !== Number.parseInt(size_))
              throw new abi_js_1.BytesSizeMismatchError({
                expectedSize: Number.parseInt(size_),
                givenSize: (0, size_js_1.size)(value)
              });
          }
          const struct2 = types[type];
          if (struct2) {
            validateReference(type);
            validateData(struct2, value);
          }
        }
      };
      if (types.EIP712Domain && domain) {
        if (typeof domain !== "object")
          throw new typedData_js_1.InvalidDomainError({ domain });
        validateData(types.EIP712Domain, domain);
      }
      if (primaryType !== "EIP712Domain") {
        if (types[primaryType])
          validateData(types[primaryType], message);
        else
          throw new typedData_js_1.InvalidPrimaryTypeError({ primaryType, types });
      }
    }
    function getTypesForEIP712Domain({ domain }) {
      return [
        typeof (domain == null ? void 0 : domain.name) === "string" && { name: "name", type: "string" },
        (domain == null ? void 0 : domain.version) && { name: "version", type: "string" },
        (typeof (domain == null ? void 0 : domain.chainId) === "number" || typeof (domain == null ? void 0 : domain.chainId) === "bigint") && {
          name: "chainId",
          type: "uint256"
        },
        (domain == null ? void 0 : domain.verifyingContract) && {
          name: "verifyingContract",
          type: "address"
        },
        (domain == null ? void 0 : domain.salt) && { name: "salt", type: "bytes32" }
      ].filter(Boolean);
    }
    function domainSeparator({ domain }) {
      return (0, hashTypedData_js_1.hashDomain)({
        domain,
        types: {
          EIP712Domain: getTypesForEIP712Domain({ domain })
        }
      });
    }
    function validateReference(type) {
      if (type === "address" || type === "bool" || type === "string" || type.startsWith("bytes") || type.startsWith("uint") || type.startsWith("int"))
        throw new typedData_js_1.InvalidStructTypeError({ type });
    }
  }
});

// node_modules/viem/_cjs/utils/abi/decodeFunctionData.js
var require_decodeFunctionData = __commonJS({
  "node_modules/viem/_cjs/utils/abi/decodeFunctionData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeFunctionData = decodeFunctionData;
    var abi_js_1 = require_abi();
    var slice_js_1 = require_slice();
    var toFunctionSelector_js_1 = require_toFunctionSelector();
    var decodeAbiParameters_js_1 = require_decodeAbiParameters();
    var formatAbiItem_js_1 = require_formatAbiItem2();
    function decodeFunctionData(parameters) {
      const { abi, data } = parameters;
      const signature = (0, slice_js_1.slice)(data, 0, 4);
      const description = abi.find((x) => x.type === "function" && signature === (0, toFunctionSelector_js_1.toFunctionSelector)((0, formatAbiItem_js_1.formatAbiItem)(x)));
      if (!description)
        throw new abi_js_1.AbiFunctionSignatureNotFoundError(signature, {
          docsPath: "/docs/contract/decodeFunctionData"
        });
      return {
        functionName: description.name,
        args: "inputs" in description && description.inputs && description.inputs.length > 0 ? (0, decodeAbiParameters_js_1.decodeAbiParameters)(description.inputs, (0, slice_js_1.slice)(data, 4)) : void 0
      };
    }
  }
});

// node_modules/viem/_cjs/utils/abi/encodeErrorResult.js
var require_encodeErrorResult = __commonJS({
  "node_modules/viem/_cjs/utils/abi/encodeErrorResult.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeErrorResult = encodeErrorResult;
    var abi_js_1 = require_abi();
    var concat_js_1 = require_concat();
    var toFunctionSelector_js_1 = require_toFunctionSelector();
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    var formatAbiItem_js_1 = require_formatAbiItem2();
    var getAbiItem_js_1 = require_getAbiItem();
    var docsPath = "/docs/contract/encodeErrorResult";
    function encodeErrorResult(parameters) {
      const { abi, errorName, args } = parameters;
      let abiItem = abi[0];
      if (errorName) {
        const item = (0, getAbiItem_js_1.getAbiItem)({ abi, args, name: errorName });
        if (!item)
          throw new abi_js_1.AbiErrorNotFoundError(errorName, { docsPath });
        abiItem = item;
      }
      if (abiItem.type !== "error")
        throw new abi_js_1.AbiErrorNotFoundError(void 0, { docsPath });
      const definition = (0, formatAbiItem_js_1.formatAbiItem)(abiItem);
      const signature = (0, toFunctionSelector_js_1.toFunctionSelector)(definition);
      let data = "0x";
      if (args && args.length > 0) {
        if (!abiItem.inputs)
          throw new abi_js_1.AbiErrorInputsNotFoundError(abiItem.name, { docsPath });
        data = (0, encodeAbiParameters_js_1.encodeAbiParameters)(abiItem.inputs, args);
      }
      return (0, concat_js_1.concatHex)([signature, data]);
    }
  }
});

// node_modules/viem/_cjs/utils/abi/encodeFunctionResult.js
var require_encodeFunctionResult = __commonJS({
  "node_modules/viem/_cjs/utils/abi/encodeFunctionResult.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeFunctionResult = encodeFunctionResult;
    var abi_js_1 = require_abi();
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    var getAbiItem_js_1 = require_getAbiItem();
    var docsPath = "/docs/contract/encodeFunctionResult";
    function encodeFunctionResult(parameters) {
      const { abi, functionName, result } = parameters;
      let abiItem = abi[0];
      if (functionName) {
        const item = (0, getAbiItem_js_1.getAbiItem)({ abi, name: functionName });
        if (!item)
          throw new abi_js_1.AbiFunctionNotFoundError(functionName, { docsPath });
        abiItem = item;
      }
      if (abiItem.type !== "function")
        throw new abi_js_1.AbiFunctionNotFoundError(void 0, { docsPath });
      if (!abiItem.outputs)
        throw new abi_js_1.AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath });
      let values = Array.isArray(result) ? result : [result];
      if (abiItem.outputs.length === 0 && !values[0])
        values = [];
      return (0, encodeAbiParameters_js_1.encodeAbiParameters)(abiItem.outputs, values);
    }
  }
});

// node_modules/viem/_cjs/utils/abi/encodePacked.js
var require_encodePacked = __commonJS({
  "node_modules/viem/_cjs/utils/abi/encodePacked.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodePacked = encodePacked;
    var abi_js_1 = require_abi();
    var address_js_1 = require_address();
    var isAddress_js_1 = require_isAddress();
    var concat_js_1 = require_concat();
    var pad_js_1 = require_pad();
    var toHex_js_1 = require_toHex();
    var regex_js_1 = require_regex2();
    function encodePacked(types, values) {
      if (types.length !== values.length)
        throw new abi_js_1.AbiEncodingLengthMismatchError({
          expectedLength: types.length,
          givenLength: values.length
        });
      const data = [];
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        const value = values[i];
        data.push(encode(type, value));
      }
      return (0, concat_js_1.concatHex)(data);
    }
    function encode(type, value, isArray = false) {
      if (type === "address") {
        const address = value;
        if (!(0, isAddress_js_1.isAddress)(address))
          throw new address_js_1.InvalidAddressError({ address });
        return (0, pad_js_1.pad)(address.toLowerCase(), {
          size: isArray ? 32 : null
        });
      }
      if (type === "string")
        return (0, toHex_js_1.stringToHex)(value);
      if (type === "bytes")
        return value;
      if (type === "bool")
        return (0, pad_js_1.pad)((0, toHex_js_1.boolToHex)(value), { size: isArray ? 32 : 1 });
      const intMatch = type.match(regex_js_1.integerRegex);
      if (intMatch) {
        const [_type, baseType, bits = "256"] = intMatch;
        const size = Number.parseInt(bits) / 8;
        return (0, toHex_js_1.numberToHex)(value, {
          size: isArray ? 32 : size,
          signed: baseType === "int"
        });
      }
      const bytesMatch = type.match(regex_js_1.bytesRegex);
      if (bytesMatch) {
        const [_type, size] = bytesMatch;
        if (Number.parseInt(size) !== (value.length - 2) / 2)
          throw new abi_js_1.BytesSizeMismatchError({
            expectedSize: Number.parseInt(size),
            givenSize: (value.length - 2) / 2
          });
        return (0, pad_js_1.pad)(value, { dir: "right", size: isArray ? 32 : null });
      }
      const arrayMatch = type.match(regex_js_1.arrayRegex);
      if (arrayMatch && Array.isArray(value)) {
        const [_type, childType] = arrayMatch;
        const data = [];
        for (let i = 0; i < value.length; i++) {
          data.push(encode(childType, value[i], true));
        }
        if (data.length === 0)
          return "0x";
        return (0, concat_js_1.concatHex)(data);
      }
      throw new abi_js_1.UnsupportedPackedAbiType(type);
    }
  }
});

// node_modules/viem/_cjs/utils/data/isBytes.js
var require_isBytes = __commonJS({
  "node_modules/viem/_cjs/utils/data/isBytes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isBytes = isBytes;
    function isBytes(value) {
      if (!value)
        return false;
      if (typeof value !== "object")
        return false;
      if (!("BYTES_PER_ELEMENT" in value))
        return false;
      return value.BYTES_PER_ELEMENT === 1 && value.constructor.name === "Uint8Array";
    }
  }
});

// node_modules/viem/_cjs/utils/address/getContractAddress.js
var require_getContractAddress = __commonJS({
  "node_modules/viem/_cjs/utils/address/getContractAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getContractAddress = getContractAddress;
    exports.getCreateAddress = getCreateAddress;
    exports.getCreate2Address = getCreate2Address;
    var concat_js_1 = require_concat();
    var isBytes_js_1 = require_isBytes();
    var pad_js_1 = require_pad();
    var slice_js_1 = require_slice();
    var toBytes_js_1 = require_toBytes();
    var toRlp_js_1 = require_toRlp();
    var keccak256_js_1 = require_keccak256();
    var getAddress_js_1 = require_getAddress();
    function getContractAddress(opts) {
      if (opts.opcode === "CREATE2")
        return getCreate2Address(opts);
      return getCreateAddress(opts);
    }
    function getCreateAddress(opts) {
      const from = (0, toBytes_js_1.toBytes)((0, getAddress_js_1.getAddress)(opts.from));
      let nonce = (0, toBytes_js_1.toBytes)(opts.nonce);
      if (nonce[0] === 0)
        nonce = new Uint8Array([]);
      return (0, getAddress_js_1.getAddress)(`0x${(0, keccak256_js_1.keccak256)((0, toRlp_js_1.toRlp)([from, nonce], "bytes")).slice(26)}`);
    }
    function getCreate2Address(opts) {
      const from = (0, toBytes_js_1.toBytes)((0, getAddress_js_1.getAddress)(opts.from));
      const salt = (0, pad_js_1.pad)((0, isBytes_js_1.isBytes)(opts.salt) ? opts.salt : (0, toBytes_js_1.toBytes)(opts.salt), {
        size: 32
      });
      const bytecodeHash = (() => {
        if ("bytecodeHash" in opts) {
          if ((0, isBytes_js_1.isBytes)(opts.bytecodeHash))
            return opts.bytecodeHash;
          return (0, toBytes_js_1.toBytes)(opts.bytecodeHash);
        }
        return (0, keccak256_js_1.keccak256)(opts.bytecode, "bytes");
      })();
      return (0, getAddress_js_1.getAddress)((0, slice_js_1.slice)((0, keccak256_js_1.keccak256)((0, concat_js_1.concat)([(0, toBytes_js_1.toBytes)("0xff"), from, salt, bytecodeHash])), 12));
    }
  }
});

// node_modules/viem/_cjs/utils/formatters/transactionReceipt.js
var require_transactionReceipt = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/transactionReceipt.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defineTransactionReceipt = exports.receiptStatuses = void 0;
    exports.formatTransactionReceipt = formatTransactionReceipt;
    var fromHex_js_1 = require_fromHex();
    var formatter_js_1 = require_formatter();
    var log_js_1 = require_log2();
    var transaction_js_1 = require_transaction2();
    exports.receiptStatuses = {
      "0x0": "reverted",
      "0x1": "success"
    };
    function formatTransactionReceipt(transactionReceipt) {
      const receipt = {
        ...transactionReceipt,
        blockNumber: transactionReceipt.blockNumber ? BigInt(transactionReceipt.blockNumber) : null,
        contractAddress: transactionReceipt.contractAddress ? transactionReceipt.contractAddress : null,
        cumulativeGasUsed: transactionReceipt.cumulativeGasUsed ? BigInt(transactionReceipt.cumulativeGasUsed) : null,
        effectiveGasPrice: transactionReceipt.effectiveGasPrice ? BigInt(transactionReceipt.effectiveGasPrice) : null,
        gasUsed: transactionReceipt.gasUsed ? BigInt(transactionReceipt.gasUsed) : null,
        logs: transactionReceipt.logs ? transactionReceipt.logs.map((log) => (0, log_js_1.formatLog)(log)) : null,
        to: transactionReceipt.to ? transactionReceipt.to : null,
        transactionIndex: transactionReceipt.transactionIndex ? (0, fromHex_js_1.hexToNumber)(transactionReceipt.transactionIndex) : null,
        status: transactionReceipt.status ? exports.receiptStatuses[transactionReceipt.status] : null,
        type: transactionReceipt.type ? transaction_js_1.transactionType[transactionReceipt.type] || transactionReceipt.type : null
      };
      if (transactionReceipt.blobGasPrice)
        receipt.blobGasPrice = BigInt(transactionReceipt.blobGasPrice);
      if (transactionReceipt.blobGasUsed)
        receipt.blobGasUsed = BigInt(transactionReceipt.blobGasUsed);
      return receipt;
    }
    exports.defineTransactionReceipt = (0, formatter_js_1.defineFormatter)("transactionReceipt", formatTransactionReceipt);
  }
});

// node_modules/viem/_cjs/utils/encoding/fromRlp.js
var require_fromRlp = __commonJS({
  "node_modules/viem/_cjs/utils/encoding/fromRlp.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromRlp = fromRlp;
    var base_js_1 = require_base();
    var encoding_js_1 = require_encoding();
    var cursor_js_1 = require_cursor2();
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    function fromRlp(value, to = "hex") {
      const bytes = (() => {
        if (typeof value === "string") {
          if (value.length > 3 && value.length % 2 !== 0)
            throw new encoding_js_1.InvalidHexValueError(value);
          return (0, toBytes_js_1.hexToBytes)(value);
        }
        return value;
      })();
      const cursor = (0, cursor_js_1.createCursor)(bytes, {
        recursiveReadLimit: Number.POSITIVE_INFINITY
      });
      const result = fromRlpCursor(cursor, to);
      return result;
    }
    function fromRlpCursor(cursor, to = "hex") {
      if (cursor.bytes.length === 0)
        return to === "hex" ? (0, toHex_js_1.bytesToHex)(cursor.bytes) : cursor.bytes;
      const prefix = cursor.readByte();
      if (prefix < 128)
        cursor.decrementPosition(1);
      if (prefix < 192) {
        const length2 = readLength(cursor, prefix, 128);
        const bytes = cursor.readBytes(length2);
        return to === "hex" ? (0, toHex_js_1.bytesToHex)(bytes) : bytes;
      }
      const length = readLength(cursor, prefix, 192);
      return readList(cursor, length, to);
    }
    function readLength(cursor, prefix, offset) {
      if (offset === 128 && prefix < 128)
        return 1;
      if (prefix <= offset + 55)
        return prefix - offset;
      if (prefix === offset + 55 + 1)
        return cursor.readUint8();
      if (prefix === offset + 55 + 2)
        return cursor.readUint16();
      if (prefix === offset + 55 + 3)
        return cursor.readUint24();
      if (prefix === offset + 55 + 4)
        return cursor.readUint32();
      throw new base_js_1.BaseError("Invalid RLP prefix");
    }
    function readList(cursor, length, to) {
      const position = cursor.position;
      const value = [];
      while (cursor.position - position < length)
        value.push(fromRlpCursor(cursor, to));
      return value;
    }
  }
});

// node_modules/viem/_cjs/utils/hash/toEventSignature.js
var require_toEventSignature = __commonJS({
  "node_modules/viem/_cjs/utils/hash/toEventSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toEventSignature = void 0;
    var toSignature_js_1 = require_toSignature();
    Object.defineProperty(exports, "toEventSignature", { enumerable: true, get: function() {
      return toSignature_js_1.toSignature;
    } });
  }
});

// node_modules/viem/_cjs/utils/hash/toFunctionSignature.js
var require_toFunctionSignature = __commonJS({
  "node_modules/viem/_cjs/utils/hash/toFunctionSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toFunctionSignature = void 0;
    var toSignature_js_1 = require_toSignature();
    Object.defineProperty(exports, "toFunctionSignature", { enumerable: true, get: function() {
      return toSignature_js_1.toSignature;
    } });
  }
});

// node_modules/viem/_cjs/utils/hash/toEventHash.js
var require_toEventHash = __commonJS({
  "node_modules/viem/_cjs/utils/hash/toEventHash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toEventHash = void 0;
    var toSignatureHash_js_1 = require_toSignatureHash();
    Object.defineProperty(exports, "toEventHash", { enumerable: true, get: function() {
      return toSignatureHash_js_1.toSignatureHash;
    } });
  }
});

// node_modules/viem/_cjs/utils/hash/toFunctionHash.js
var require_toFunctionHash = __commonJS({
  "node_modules/viem/_cjs/utils/hash/toFunctionHash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toFunctionHash = void 0;
    var toSignatureHash_js_1 = require_toSignatureHash();
    Object.defineProperty(exports, "toFunctionHash", { enumerable: true, get: function() {
      return toSignatureHash_js_1.toSignatureHash;
    } });
  }
});

// node_modules/viem/_cjs/utils/hash/isHash.js
var require_isHash = __commonJS({
  "node_modules/viem/_cjs/utils/hash/isHash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isHash = isHash;
    var isHex_js_1 = require_isHex();
    var size_js_1 = require_size();
    function isHash(hash) {
      return (0, isHex_js_1.isHex)(hash) && (0, size_js_1.size)(hash) === 32;
    }
  }
});

// node_modules/viem/node_modules/@noble/hashes/ripemd160.js
var require_ripemd160 = __commonJS({
  "node_modules/viem/node_modules/@noble/hashes/ripemd160.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ripemd160 = exports.RIPEMD160 = void 0;
    var _md_js_1 = require_md2();
    var utils_js_1 = require_utils3();
    var Rho = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]);
    var Id = new Uint8Array(new Array(16).fill(0).map((_, i) => i));
    var Pi = Id.map((i) => (9 * i + 5) % 16);
    var idxL = [Id];
    var idxR = [Pi];
    for (let i = 0; i < 4; i++)
      for (let j of [idxL, idxR])
        j.push(j[i].map((k) => Rho[k]));
    var shifts = [
      [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
      [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
      [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
      [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
      [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
    ].map((i) => new Uint8Array(i));
    var shiftsL = idxL.map((idx, i) => idx.map((j) => shifts[i][j]));
    var shiftsR = idxR.map((idx, i) => idx.map((j) => shifts[i][j]));
    var Kl = new Uint32Array([
      0,
      1518500249,
      1859775393,
      2400959708,
      2840853838
    ]);
    var Kr = new Uint32Array([
      1352829926,
      1548603684,
      1836072691,
      2053994217,
      0
    ]);
    function f(group, x, y, z) {
      if (group === 0)
        return x ^ y ^ z;
      else if (group === 1)
        return x & y | ~x & z;
      else if (group === 2)
        return (x | ~y) ^ z;
      else if (group === 3)
        return x & z | y & ~z;
      else
        return x ^ (y | ~z);
    }
    var R_BUF = new Uint32Array(16);
    var RIPEMD160 = class extends _md_js_1.HashMD {
      constructor() {
        super(64, 20, 8, true);
        this.h0 = 1732584193 | 0;
        this.h1 = 4023233417 | 0;
        this.h2 = 2562383102 | 0;
        this.h3 = 271733878 | 0;
        this.h4 = 3285377520 | 0;
      }
      get() {
        const { h0, h1, h2, h3, h4 } = this;
        return [h0, h1, h2, h3, h4];
      }
      set(h0, h1, h2, h3, h4) {
        this.h0 = h0 | 0;
        this.h1 = h1 | 0;
        this.h2 = h2 | 0;
        this.h3 = h3 | 0;
        this.h4 = h4 | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          R_BUF[i] = view.getUint32(offset, true);
        let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
        for (let group = 0; group < 5; group++) {
          const rGroup = 4 - group;
          const hbl = Kl[group], hbr = Kr[group];
          const rl = idxL[group], rr = idxR[group];
          const sl = shiftsL[group], sr = shiftsR[group];
          for (let i = 0; i < 16; i++) {
            const tl = (0, utils_js_1.rotl)(al + f(group, bl, cl, dl) + R_BUF[rl[i]] + hbl, sl[i]) + el | 0;
            al = el, el = dl, dl = (0, utils_js_1.rotl)(cl, 10) | 0, cl = bl, bl = tl;
          }
          for (let i = 0; i < 16; i++) {
            const tr = (0, utils_js_1.rotl)(ar + f(rGroup, br, cr, dr) + R_BUF[rr[i]] + hbr, sr[i]) + er | 0;
            ar = er, er = dr, dr = (0, utils_js_1.rotl)(cr, 10) | 0, cr = br, br = tr;
          }
        }
        this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr | 0);
      }
      roundClean() {
        R_BUF.fill(0);
      }
      destroy() {
        this.destroyed = true;
        this.buffer.fill(0);
        this.set(0, 0, 0, 0, 0);
      }
    };
    exports.RIPEMD160 = RIPEMD160;
    exports.ripemd160 = (0, utils_js_1.wrapConstructor)(() => new RIPEMD160());
  }
});

// node_modules/viem/_cjs/utils/hash/ripemd160.js
var require_ripemd1602 = __commonJS({
  "node_modules/viem/_cjs/utils/hash/ripemd160.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ripemd160 = ripemd160;
    var ripemd160_1 = require_ripemd160();
    var isHex_js_1 = require_isHex();
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    function ripemd160(value, to_) {
      const to = to_ || "hex";
      const bytes = (0, ripemd160_1.ripemd160)((0, isHex_js_1.isHex)(value, { strict: false }) ? (0, toBytes_js_1.toBytes)(value) : value);
      if (to === "bytes")
        return bytes;
      return (0, toHex_js_1.toHex)(bytes);
    }
  }
});

// node_modules/viem/_cjs/constants/strings.js
var require_strings = __commonJS({
  "node_modules/viem/_cjs/constants/strings.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.presignMessagePrefix = void 0;
    exports.presignMessagePrefix = "Ethereum Signed Message:\n";
  }
});

// node_modules/viem/_cjs/utils/signature/toPrefixedMessage.js
var require_toPrefixedMessage = __commonJS({
  "node_modules/viem/_cjs/utils/signature/toPrefixedMessage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toPrefixedMessage = toPrefixedMessage;
    var strings_js_1 = require_strings();
    var concat_js_1 = require_concat();
    var size_js_1 = require_size();
    var toHex_js_1 = require_toHex();
    function toPrefixedMessage(message_) {
      const message = (() => {
        if (typeof message_ === "string")
          return (0, toHex_js_1.stringToHex)(message_);
        if (typeof message_.raw === "string")
          return message_.raw;
        return (0, toHex_js_1.bytesToHex)(message_.raw);
      })();
      const prefix = (0, toHex_js_1.stringToHex)(`${strings_js_1.presignMessagePrefix}${(0, size_js_1.size)(message)}`);
      return (0, concat_js_1.concat)([prefix, message]);
    }
  }
});

// node_modules/viem/_cjs/utils/signature/hashMessage.js
var require_hashMessage = __commonJS({
  "node_modules/viem/_cjs/utils/signature/hashMessage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hashMessage = hashMessage;
    var keccak256_js_1 = require_keccak256();
    var toPrefixedMessage_js_1 = require_toPrefixedMessage();
    function hashMessage(message, to_) {
      return (0, keccak256_js_1.keccak256)((0, toPrefixedMessage_js_1.toPrefixedMessage)(message), to_);
    }
  }
});

// node_modules/viem/_cjs/utils/signature/recoverMessageAddress.js
var require_recoverMessageAddress = __commonJS({
  "node_modules/viem/_cjs/utils/signature/recoverMessageAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.recoverMessageAddress = recoverMessageAddress;
    var hashMessage_js_1 = require_hashMessage();
    var recoverAddress_js_1 = require_recoverAddress();
    async function recoverMessageAddress({ message, signature }) {
      return (0, recoverAddress_js_1.recoverAddress)({ hash: (0, hashMessage_js_1.hashMessage)(message), signature });
    }
  }
});

// node_modules/viem/_cjs/utils/signature/recoverTypedDataAddress.js
var require_recoverTypedDataAddress = __commonJS({
  "node_modules/viem/_cjs/utils/signature/recoverTypedDataAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.recoverTypedDataAddress = recoverTypedDataAddress;
    var hashTypedData_js_1 = require_hashTypedData();
    var recoverAddress_js_1 = require_recoverAddress();
    async function recoverTypedDataAddress(parameters) {
      const { domain, message, primaryType, signature, types } = parameters;
      return (0, recoverAddress_js_1.recoverAddress)({
        hash: (0, hashTypedData_js_1.hashTypedData)({
          domain,
          message,
          primaryType,
          types
        }),
        signature
      });
    }
  }
});

// node_modules/viem/_cjs/utils/signature/verifyHash.js
var require_verifyHash = __commonJS({
  "node_modules/viem/_cjs/utils/signature/verifyHash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifyHash = verifyHash;
    var getAddress_js_1 = require_getAddress();
    var isAddressEqual_js_1 = require_isAddressEqual();
    var recoverAddress_js_1 = require_recoverAddress();
    async function verifyHash({ address, hash, signature }) {
      return (0, isAddressEqual_js_1.isAddressEqual)((0, getAddress_js_1.getAddress)(address), await (0, recoverAddress_js_1.recoverAddress)({ hash, signature }));
    }
  }
});

// node_modules/viem/_cjs/utils/signature/verifyMessage.js
var require_verifyMessage = __commonJS({
  "node_modules/viem/_cjs/utils/signature/verifyMessage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifyMessage = verifyMessage;
    var getAddress_js_1 = require_getAddress();
    var isAddressEqual_js_1 = require_isAddressEqual();
    var recoverMessageAddress_js_1 = require_recoverMessageAddress();
    async function verifyMessage({ address, message, signature }) {
      return (0, isAddressEqual_js_1.isAddressEqual)((0, getAddress_js_1.getAddress)(address), await (0, recoverMessageAddress_js_1.recoverMessageAddress)({ message, signature }));
    }
  }
});

// node_modules/viem/_cjs/utils/signature/verifyTypedData.js
var require_verifyTypedData = __commonJS({
  "node_modules/viem/_cjs/utils/signature/verifyTypedData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifyTypedData = verifyTypedData;
    var getAddress_js_1 = require_getAddress();
    var isAddressEqual_js_1 = require_isAddressEqual();
    var recoverTypedDataAddress_js_1 = require_recoverTypedDataAddress();
    async function verifyTypedData(parameters) {
      const { address, domain, message, primaryType, signature, types } = parameters;
      return (0, isAddressEqual_js_1.isAddressEqual)((0, getAddress_js_1.getAddress)(address), await (0, recoverTypedDataAddress_js_1.recoverTypedDataAddress)({
        domain,
        message,
        primaryType,
        signature,
        types
      }));
    }
  }
});

// node_modules/viem/_cjs/constants/bytes.js
var require_bytes = __commonJS({
  "node_modules/viem/_cjs/constants/bytes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.zeroHash = exports.erc6492MagicBytes = void 0;
    exports.erc6492MagicBytes = "0x6492649264926492649264926492649264926492649264926492649264926492";
    exports.zeroHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
  }
});

// node_modules/viem/_cjs/utils/signature/isErc6492Signature.js
var require_isErc6492Signature = __commonJS({
  "node_modules/viem/_cjs/utils/signature/isErc6492Signature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isErc6492Signature = isErc6492Signature;
    var bytes_js_1 = require_bytes();
    var slice_js_1 = require_slice();
    function isErc6492Signature(signature) {
      return (0, slice_js_1.sliceHex)(signature, -32) === bytes_js_1.erc6492MagicBytes;
    }
  }
});

// node_modules/viem/_cjs/utils/signature/parseErc6492Signature.js
var require_parseErc6492Signature = __commonJS({
  "node_modules/viem/_cjs/utils/signature/parseErc6492Signature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseErc6492Signature = parseErc6492Signature;
    var decodeAbiParameters_js_1 = require_decodeAbiParameters();
    var isErc6492Signature_js_1 = require_isErc6492Signature();
    function parseErc6492Signature(signature) {
      if (!(0, isErc6492Signature_js_1.isErc6492Signature)(signature))
        return { signature };
      const [address, data, signature_] = (0, decodeAbiParameters_js_1.decodeAbiParameters)([{ type: "address" }, { type: "bytes" }, { type: "bytes" }], signature);
      return { address, data, signature: signature_ };
    }
  }
});

// node_modules/viem/_cjs/utils/signature/serializeErc6492Signature.js
var require_serializeErc6492Signature = __commonJS({
  "node_modules/viem/_cjs/utils/signature/serializeErc6492Signature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serializeErc6492Signature = serializeErc6492Signature;
    var bytes_js_1 = require_bytes();
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    var concat_js_1 = require_concat();
    var toBytes_js_1 = require_toBytes();
    function serializeErc6492Signature(parameters) {
      const { address, data, signature, to = "hex" } = parameters;
      const signature_ = (0, concat_js_1.concatHex)([
        (0, encodeAbiParameters_js_1.encodeAbiParameters)([{ type: "address" }, { type: "bytes" }, { type: "bytes" }], [address, data, signature]),
        bytes_js_1.erc6492MagicBytes
      ]);
      if (to === "hex")
        return signature_;
      return (0, toBytes_js_1.hexToBytes)(signature_);
    }
  }
});

// node_modules/viem/_cjs/utils/transaction/getSerializedTransactionType.js
var require_getSerializedTransactionType = __commonJS({
  "node_modules/viem/_cjs/utils/transaction/getSerializedTransactionType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSerializedTransactionType = getSerializedTransactionType;
    var transaction_js_1 = require_transaction();
    var slice_js_1 = require_slice();
    var fromHex_js_1 = require_fromHex();
    function getSerializedTransactionType(serializedTransaction) {
      const serializedType = (0, slice_js_1.sliceHex)(serializedTransaction, 0, 1);
      if (serializedType === "0x04")
        return "eip7702";
      if (serializedType === "0x03")
        return "eip4844";
      if (serializedType === "0x02")
        return "eip1559";
      if (serializedType === "0x01")
        return "eip2930";
      if (serializedType !== "0x" && (0, fromHex_js_1.hexToNumber)(serializedType) >= 192)
        return "legacy";
      throw new transaction_js_1.InvalidSerializedTransactionTypeError({ serializedType });
    }
  }
});

// node_modules/viem/_cjs/utils/transaction/assertTransaction.js
var require_assertTransaction = __commonJS({
  "node_modules/viem/_cjs/utils/transaction/assertTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertTransactionEIP7702 = assertTransactionEIP7702;
    exports.assertTransactionEIP4844 = assertTransactionEIP4844;
    exports.assertTransactionEIP1559 = assertTransactionEIP1559;
    exports.assertTransactionEIP2930 = assertTransactionEIP2930;
    exports.assertTransactionLegacy = assertTransactionLegacy;
    var kzg_js_1 = require_kzg();
    var number_js_1 = require_number();
    var address_js_1 = require_address();
    var base_js_1 = require_base();
    var blob_js_1 = require_blob2();
    var chain_js_1 = require_chain();
    var node_js_1 = require_node();
    var isAddress_js_1 = require_isAddress();
    var size_js_1 = require_size();
    var slice_js_1 = require_slice();
    var fromHex_js_1 = require_fromHex();
    function assertTransactionEIP7702(transaction) {
      const { authorizationList } = transaction;
      if (authorizationList) {
        for (const authorization of authorizationList) {
          const { contractAddress, chainId } = authorization;
          if (!(0, isAddress_js_1.isAddress)(contractAddress))
            throw new address_js_1.InvalidAddressError({ address: contractAddress });
          if (chainId < 0)
            throw new chain_js_1.InvalidChainIdError({ chainId });
        }
      }
      assertTransactionEIP1559(transaction);
    }
    function assertTransactionEIP4844(transaction) {
      const { blobVersionedHashes } = transaction;
      if (blobVersionedHashes) {
        if (blobVersionedHashes.length === 0)
          throw new blob_js_1.EmptyBlobError();
        for (const hash of blobVersionedHashes) {
          const size_ = (0, size_js_1.size)(hash);
          const version = (0, fromHex_js_1.hexToNumber)((0, slice_js_1.slice)(hash, 0, 1));
          if (size_ !== 32)
            throw new blob_js_1.InvalidVersionedHashSizeError({ hash, size: size_ });
          if (version !== kzg_js_1.versionedHashVersionKzg)
            throw new blob_js_1.InvalidVersionedHashVersionError({
              hash,
              version
            });
        }
      }
      assertTransactionEIP1559(transaction);
    }
    function assertTransactionEIP1559(transaction) {
      const { chainId, maxPriorityFeePerGas, maxFeePerGas, to } = transaction;
      if (chainId <= 0)
        throw new chain_js_1.InvalidChainIdError({ chainId });
      if (to && !(0, isAddress_js_1.isAddress)(to))
        throw new address_js_1.InvalidAddressError({ address: to });
      if (maxFeePerGas && maxFeePerGas > number_js_1.maxUint256)
        throw new node_js_1.FeeCapTooHighError({ maxFeePerGas });
      if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
        throw new node_js_1.TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
    }
    function assertTransactionEIP2930(transaction) {
      const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
      if (chainId <= 0)
        throw new chain_js_1.InvalidChainIdError({ chainId });
      if (to && !(0, isAddress_js_1.isAddress)(to))
        throw new address_js_1.InvalidAddressError({ address: to });
      if (maxPriorityFeePerGas || maxFeePerGas)
        throw new base_js_1.BaseError("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid EIP-2930 Transaction attribute.");
      if (gasPrice && gasPrice > number_js_1.maxUint256)
        throw new node_js_1.FeeCapTooHighError({ maxFeePerGas: gasPrice });
    }
    function assertTransactionLegacy(transaction) {
      const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
      if (to && !(0, isAddress_js_1.isAddress)(to))
        throw new address_js_1.InvalidAddressError({ address: to });
      if (typeof chainId !== "undefined" && chainId <= 0)
        throw new chain_js_1.InvalidChainIdError({ chainId });
      if (maxPriorityFeePerGas || maxFeePerGas)
        throw new base_js_1.BaseError("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid Legacy Transaction attribute.");
      if (gasPrice && gasPrice > number_js_1.maxUint256)
        throw new node_js_1.FeeCapTooHighError({ maxFeePerGas: gasPrice });
    }
  }
});

// node_modules/viem/_cjs/utils/transaction/parseTransaction.js
var require_parseTransaction = __commonJS({
  "node_modules/viem/_cjs/utils/transaction/parseTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseTransaction = parseTransaction;
    exports.toTransactionArray = toTransactionArray;
    exports.parseAccessList = parseAccessList;
    var address_js_1 = require_address();
    var transaction_js_1 = require_transaction();
    var isAddress_js_1 = require_isAddress();
    var toBlobSidecars_js_1 = require_toBlobSidecars();
    var isHex_js_1 = require_isHex();
    var pad_js_1 = require_pad();
    var trim_js_1 = require_trim();
    var fromHex_js_1 = require_fromHex();
    var fromRlp_js_1 = require_fromRlp();
    var isHash_js_1 = require_isHash();
    var assertTransaction_js_1 = require_assertTransaction();
    var getSerializedTransactionType_js_1 = require_getSerializedTransactionType();
    function parseTransaction(serializedTransaction) {
      const type = (0, getSerializedTransactionType_js_1.getSerializedTransactionType)(serializedTransaction);
      if (type === "eip1559")
        return parseTransactionEIP1559(serializedTransaction);
      if (type === "eip2930")
        return parseTransactionEIP2930(serializedTransaction);
      if (type === "eip4844")
        return parseTransactionEIP4844(serializedTransaction);
      if (type === "eip7702")
        return parseTransactionEIP7702(serializedTransaction);
      return parseTransactionLegacy(serializedTransaction);
    }
    function parseTransactionEIP7702(serializedTransaction) {
      const transactionArray = toTransactionArray(serializedTransaction);
      const [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList, authorizationList, v, r, s] = transactionArray;
      if (transactionArray.length !== 10 && transactionArray.length !== 13)
        throw new transaction_js_1.InvalidSerializedTransactionError({
          attributes: {
            chainId,
            nonce,
            maxPriorityFeePerGas,
            maxFeePerGas,
            gas,
            to,
            value,
            data,
            accessList,
            authorizationList,
            ...transactionArray.length > 9 ? {
              v,
              r,
              s
            } : {}
          },
          serializedTransaction,
          type: "eip7702"
        });
      const transaction = {
        chainId: (0, fromHex_js_1.hexToNumber)(chainId),
        type: "eip7702"
      };
      if ((0, isHex_js_1.isHex)(to) && to !== "0x")
        transaction.to = to;
      if ((0, isHex_js_1.isHex)(gas) && gas !== "0x")
        transaction.gas = (0, fromHex_js_1.hexToBigInt)(gas);
      if ((0, isHex_js_1.isHex)(data) && data !== "0x")
        transaction.data = data;
      if ((0, isHex_js_1.isHex)(nonce) && nonce !== "0x")
        transaction.nonce = (0, fromHex_js_1.hexToNumber)(nonce);
      if ((0, isHex_js_1.isHex)(value) && value !== "0x")
        transaction.value = (0, fromHex_js_1.hexToBigInt)(value);
      if ((0, isHex_js_1.isHex)(maxFeePerGas) && maxFeePerGas !== "0x")
        transaction.maxFeePerGas = (0, fromHex_js_1.hexToBigInt)(maxFeePerGas);
      if ((0, isHex_js_1.isHex)(maxPriorityFeePerGas) && maxPriorityFeePerGas !== "0x")
        transaction.maxPriorityFeePerGas = (0, fromHex_js_1.hexToBigInt)(maxPriorityFeePerGas);
      if (accessList.length !== 0 && accessList !== "0x")
        transaction.accessList = parseAccessList(accessList);
      if (authorizationList.length !== 0 && authorizationList !== "0x")
        transaction.authorizationList = parseAuthorizationList(authorizationList);
      (0, assertTransaction_js_1.assertTransactionEIP7702)(transaction);
      const signature = transactionArray.length === 13 ? parseEIP155Signature(transactionArray) : void 0;
      return { ...signature, ...transaction };
    }
    function parseTransactionEIP4844(serializedTransaction) {
      const transactionOrWrapperArray = toTransactionArray(serializedTransaction);
      const hasNetworkWrapper = transactionOrWrapperArray.length === 4;
      const transactionArray = hasNetworkWrapper ? transactionOrWrapperArray[0] : transactionOrWrapperArray;
      const wrapperArray = hasNetworkWrapper ? transactionOrWrapperArray.slice(1) : [];
      const [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList, maxFeePerBlobGas, blobVersionedHashes, v, r, s] = transactionArray;
      const [blobs, commitments, proofs] = wrapperArray;
      if (!(transactionArray.length === 11 || transactionArray.length === 14))
        throw new transaction_js_1.InvalidSerializedTransactionError({
          attributes: {
            chainId,
            nonce,
            maxPriorityFeePerGas,
            maxFeePerGas,
            gas,
            to,
            value,
            data,
            accessList,
            ...transactionArray.length > 9 ? {
              v,
              r,
              s
            } : {}
          },
          serializedTransaction,
          type: "eip4844"
        });
      const transaction = {
        blobVersionedHashes,
        chainId: (0, fromHex_js_1.hexToNumber)(chainId),
        type: "eip4844"
      };
      if ((0, isHex_js_1.isHex)(to) && to !== "0x")
        transaction.to = to;
      if ((0, isHex_js_1.isHex)(gas) && gas !== "0x")
        transaction.gas = (0, fromHex_js_1.hexToBigInt)(gas);
      if ((0, isHex_js_1.isHex)(data) && data !== "0x")
        transaction.data = data;
      if ((0, isHex_js_1.isHex)(nonce) && nonce !== "0x")
        transaction.nonce = (0, fromHex_js_1.hexToNumber)(nonce);
      if ((0, isHex_js_1.isHex)(value) && value !== "0x")
        transaction.value = (0, fromHex_js_1.hexToBigInt)(value);
      if ((0, isHex_js_1.isHex)(maxFeePerBlobGas) && maxFeePerBlobGas !== "0x")
        transaction.maxFeePerBlobGas = (0, fromHex_js_1.hexToBigInt)(maxFeePerBlobGas);
      if ((0, isHex_js_1.isHex)(maxFeePerGas) && maxFeePerGas !== "0x")
        transaction.maxFeePerGas = (0, fromHex_js_1.hexToBigInt)(maxFeePerGas);
      if ((0, isHex_js_1.isHex)(maxPriorityFeePerGas) && maxPriorityFeePerGas !== "0x")
        transaction.maxPriorityFeePerGas = (0, fromHex_js_1.hexToBigInt)(maxPriorityFeePerGas);
      if (accessList.length !== 0 && accessList !== "0x")
        transaction.accessList = parseAccessList(accessList);
      if (blobs && commitments && proofs)
        transaction.sidecars = (0, toBlobSidecars_js_1.toBlobSidecars)({
          blobs,
          commitments,
          proofs
        });
      (0, assertTransaction_js_1.assertTransactionEIP4844)(transaction);
      const signature = transactionArray.length === 14 ? parseEIP155Signature(transactionArray) : void 0;
      return { ...signature, ...transaction };
    }
    function parseTransactionEIP1559(serializedTransaction) {
      const transactionArray = toTransactionArray(serializedTransaction);
      const [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList, v, r, s] = transactionArray;
      if (!(transactionArray.length === 9 || transactionArray.length === 12))
        throw new transaction_js_1.InvalidSerializedTransactionError({
          attributes: {
            chainId,
            nonce,
            maxPriorityFeePerGas,
            maxFeePerGas,
            gas,
            to,
            value,
            data,
            accessList,
            ...transactionArray.length > 9 ? {
              v,
              r,
              s
            } : {}
          },
          serializedTransaction,
          type: "eip1559"
        });
      const transaction = {
        chainId: (0, fromHex_js_1.hexToNumber)(chainId),
        type: "eip1559"
      };
      if ((0, isHex_js_1.isHex)(to) && to !== "0x")
        transaction.to = to;
      if ((0, isHex_js_1.isHex)(gas) && gas !== "0x")
        transaction.gas = (0, fromHex_js_1.hexToBigInt)(gas);
      if ((0, isHex_js_1.isHex)(data) && data !== "0x")
        transaction.data = data;
      if ((0, isHex_js_1.isHex)(nonce) && nonce !== "0x")
        transaction.nonce = (0, fromHex_js_1.hexToNumber)(nonce);
      if ((0, isHex_js_1.isHex)(value) && value !== "0x")
        transaction.value = (0, fromHex_js_1.hexToBigInt)(value);
      if ((0, isHex_js_1.isHex)(maxFeePerGas) && maxFeePerGas !== "0x")
        transaction.maxFeePerGas = (0, fromHex_js_1.hexToBigInt)(maxFeePerGas);
      if ((0, isHex_js_1.isHex)(maxPriorityFeePerGas) && maxPriorityFeePerGas !== "0x")
        transaction.maxPriorityFeePerGas = (0, fromHex_js_1.hexToBigInt)(maxPriorityFeePerGas);
      if (accessList.length !== 0 && accessList !== "0x")
        transaction.accessList = parseAccessList(accessList);
      (0, assertTransaction_js_1.assertTransactionEIP1559)(transaction);
      const signature = transactionArray.length === 12 ? parseEIP155Signature(transactionArray) : void 0;
      return { ...signature, ...transaction };
    }
    function parseTransactionEIP2930(serializedTransaction) {
      const transactionArray = toTransactionArray(serializedTransaction);
      const [chainId, nonce, gasPrice, gas, to, value, data, accessList, v, r, s] = transactionArray;
      if (!(transactionArray.length === 8 || transactionArray.length === 11))
        throw new transaction_js_1.InvalidSerializedTransactionError({
          attributes: {
            chainId,
            nonce,
            gasPrice,
            gas,
            to,
            value,
            data,
            accessList,
            ...transactionArray.length > 8 ? {
              v,
              r,
              s
            } : {}
          },
          serializedTransaction,
          type: "eip2930"
        });
      const transaction = {
        chainId: (0, fromHex_js_1.hexToNumber)(chainId),
        type: "eip2930"
      };
      if ((0, isHex_js_1.isHex)(to) && to !== "0x")
        transaction.to = to;
      if ((0, isHex_js_1.isHex)(gas) && gas !== "0x")
        transaction.gas = (0, fromHex_js_1.hexToBigInt)(gas);
      if ((0, isHex_js_1.isHex)(data) && data !== "0x")
        transaction.data = data;
      if ((0, isHex_js_1.isHex)(nonce) && nonce !== "0x")
        transaction.nonce = (0, fromHex_js_1.hexToNumber)(nonce);
      if ((0, isHex_js_1.isHex)(value) && value !== "0x")
        transaction.value = (0, fromHex_js_1.hexToBigInt)(value);
      if ((0, isHex_js_1.isHex)(gasPrice) && gasPrice !== "0x")
        transaction.gasPrice = (0, fromHex_js_1.hexToBigInt)(gasPrice);
      if (accessList.length !== 0 && accessList !== "0x")
        transaction.accessList = parseAccessList(accessList);
      (0, assertTransaction_js_1.assertTransactionEIP2930)(transaction);
      const signature = transactionArray.length === 11 ? parseEIP155Signature(transactionArray) : void 0;
      return { ...signature, ...transaction };
    }
    function parseTransactionLegacy(serializedTransaction) {
      const transactionArray = (0, fromRlp_js_1.fromRlp)(serializedTransaction, "hex");
      const [nonce, gasPrice, gas, to, value, data, chainIdOrV_, r, s] = transactionArray;
      if (!(transactionArray.length === 6 || transactionArray.length === 9))
        throw new transaction_js_1.InvalidSerializedTransactionError({
          attributes: {
            nonce,
            gasPrice,
            gas,
            to,
            value,
            data,
            ...transactionArray.length > 6 ? {
              v: chainIdOrV_,
              r,
              s
            } : {}
          },
          serializedTransaction,
          type: "legacy"
        });
      const transaction = {
        type: "legacy"
      };
      if ((0, isHex_js_1.isHex)(to) && to !== "0x")
        transaction.to = to;
      if ((0, isHex_js_1.isHex)(gas) && gas !== "0x")
        transaction.gas = (0, fromHex_js_1.hexToBigInt)(gas);
      if ((0, isHex_js_1.isHex)(data) && data !== "0x")
        transaction.data = data;
      if ((0, isHex_js_1.isHex)(nonce) && nonce !== "0x")
        transaction.nonce = (0, fromHex_js_1.hexToNumber)(nonce);
      if ((0, isHex_js_1.isHex)(value) && value !== "0x")
        transaction.value = (0, fromHex_js_1.hexToBigInt)(value);
      if ((0, isHex_js_1.isHex)(gasPrice) && gasPrice !== "0x")
        transaction.gasPrice = (0, fromHex_js_1.hexToBigInt)(gasPrice);
      (0, assertTransaction_js_1.assertTransactionLegacy)(transaction);
      if (transactionArray.length === 6)
        return transaction;
      const chainIdOrV = (0, isHex_js_1.isHex)(chainIdOrV_) && chainIdOrV_ !== "0x" ? (0, fromHex_js_1.hexToBigInt)(chainIdOrV_) : 0n;
      if (s === "0x" && r === "0x") {
        if (chainIdOrV > 0)
          transaction.chainId = Number(chainIdOrV);
        return transaction;
      }
      const v = chainIdOrV;
      const chainId = Number((v - 35n) / 2n);
      if (chainId > 0)
        transaction.chainId = chainId;
      else if (v !== 27n && v !== 28n)
        throw new transaction_js_1.InvalidLegacyVError({ v });
      transaction.v = v;
      transaction.s = s;
      transaction.r = r;
      transaction.yParity = v % 2n === 0n ? 1 : 0;
      return transaction;
    }
    function toTransactionArray(serializedTransaction) {
      return (0, fromRlp_js_1.fromRlp)(`0x${serializedTransaction.slice(4)}`, "hex");
    }
    function parseAccessList(accessList_) {
      const accessList = [];
      for (let i = 0; i < accessList_.length; i++) {
        const [address, storageKeys] = accessList_[i];
        if (!(0, isAddress_js_1.isAddress)(address, { strict: false }))
          throw new address_js_1.InvalidAddressError({ address });
        accessList.push({
          address,
          storageKeys: storageKeys.map((key) => (0, isHash_js_1.isHash)(key) ? key : (0, trim_js_1.trim)(key))
        });
      }
      return accessList;
    }
    function parseAuthorizationList(serializedAuthorizationList) {
      const authorizationList = [];
      for (let i = 0; i < serializedAuthorizationList.length; i++) {
        const [chainId, contractAddress, nonce, yParity, r, s] = serializedAuthorizationList[i];
        authorizationList.push({
          chainId: (0, fromHex_js_1.hexToNumber)(chainId),
          contractAddress,
          nonce: (0, fromHex_js_1.hexToNumber)(nonce),
          ...parseEIP155Signature([yParity, r, s])
        });
      }
      return authorizationList;
    }
    function parseEIP155Signature(transactionArray) {
      const signature = transactionArray.slice(-3);
      const v = signature[0] === "0x" || (0, fromHex_js_1.hexToBigInt)(signature[0]) === 0n ? 27n : 28n;
      return {
        r: (0, pad_js_1.padHex)(signature[1], { size: 32 }),
        s: (0, pad_js_1.padHex)(signature[2], { size: 32 }),
        v,
        yParity: v === 27n ? 0 : 1
      };
    }
  }
});

// node_modules/viem/_cjs/experimental/eip7702/utils/serializeAuthorizationList.js
var require_serializeAuthorizationList = __commonJS({
  "node_modules/viem/_cjs/experimental/eip7702/utils/serializeAuthorizationList.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serializeAuthorizationList = serializeAuthorizationList;
    var toHex_js_1 = require_toHex();
    var serializeTransaction_js_1 = require_serializeTransaction();
    function serializeAuthorizationList(authorizationList) {
      if (!authorizationList || authorizationList.length === 0)
        return [];
      const serializedAuthorizationList = [];
      for (const authorization of authorizationList) {
        const { contractAddress, chainId, nonce, ...signature } = authorization;
        serializedAuthorizationList.push([
          chainId ? (0, toHex_js_1.toHex)(chainId) : "0x",
          contractAddress,
          nonce ? (0, toHex_js_1.toHex)(nonce) : "0x",
          ...(0, serializeTransaction_js_1.toYParitySignatureArray)({}, signature)
        ]);
      }
      return serializedAuthorizationList;
    }
  }
});

// node_modules/viem/_cjs/utils/transaction/serializeAccessList.js
var require_serializeAccessList = __commonJS({
  "node_modules/viem/_cjs/utils/transaction/serializeAccessList.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serializeAccessList = serializeAccessList;
    var address_js_1 = require_address();
    var transaction_js_1 = require_transaction();
    var isAddress_js_1 = require_isAddress();
    function serializeAccessList(accessList) {
      if (!accessList || accessList.length === 0)
        return [];
      const serializedAccessList = [];
      for (let i = 0; i < accessList.length; i++) {
        const { address, storageKeys } = accessList[i];
        for (let j = 0; j < storageKeys.length; j++) {
          if (storageKeys[j].length - 2 !== 64) {
            throw new transaction_js_1.InvalidStorageKeySizeError({ storageKey: storageKeys[j] });
          }
        }
        if (!(0, isAddress_js_1.isAddress)(address, { strict: false })) {
          throw new address_js_1.InvalidAddressError({ address });
        }
        serializedAccessList.push([address, storageKeys]);
      }
      return serializedAccessList;
    }
  }
});

// node_modules/viem/_cjs/utils/transaction/serializeTransaction.js
var require_serializeTransaction = __commonJS({
  "node_modules/viem/_cjs/utils/transaction/serializeTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serializeTransaction = serializeTransaction;
    exports.toYParitySignatureArray = toYParitySignatureArray;
    var transaction_js_1 = require_transaction();
    var blobsToCommitments_js_1 = require_blobsToCommitments();
    var blobsToProofs_js_1 = require_blobsToProofs();
    var commitmentsToVersionedHashes_js_1 = require_commitmentsToVersionedHashes();
    var toBlobSidecars_js_1 = require_toBlobSidecars();
    var concat_js_1 = require_concat();
    var trim_js_1 = require_trim();
    var toHex_js_1 = require_toHex();
    var toRlp_js_1 = require_toRlp();
    var serializeAuthorizationList_js_1 = require_serializeAuthorizationList();
    var assertTransaction_js_1 = require_assertTransaction();
    var getTransactionType_js_1 = require_getTransactionType();
    var serializeAccessList_js_1 = require_serializeAccessList();
    function serializeTransaction(transaction, signature) {
      const type = (0, getTransactionType_js_1.getTransactionType)(transaction);
      if (type === "eip1559")
        return serializeTransactionEIP1559(transaction, signature);
      if (type === "eip2930")
        return serializeTransactionEIP2930(transaction, signature);
      if (type === "eip4844")
        return serializeTransactionEIP4844(transaction, signature);
      if (type === "eip7702")
        return serializeTransactionEIP7702(transaction, signature);
      return serializeTransactionLegacy(transaction, signature);
    }
    function serializeTransactionEIP7702(transaction, signature) {
      const { authorizationList, chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
      (0, assertTransaction_js_1.assertTransactionEIP7702)(transaction);
      const serializedAccessList = (0, serializeAccessList_js_1.serializeAccessList)(accessList);
      const serializedAuthorizationList = (0, serializeAuthorizationList_js_1.serializeAuthorizationList)(authorizationList);
      return (0, concat_js_1.concatHex)([
        "0x04",
        (0, toRlp_js_1.toRlp)([
          (0, toHex_js_1.toHex)(chainId),
          nonce ? (0, toHex_js_1.toHex)(nonce) : "0x",
          maxPriorityFeePerGas ? (0, toHex_js_1.toHex)(maxPriorityFeePerGas) : "0x",
          maxFeePerGas ? (0, toHex_js_1.toHex)(maxFeePerGas) : "0x",
          gas ? (0, toHex_js_1.toHex)(gas) : "0x",
          to ?? "0x",
          value ? (0, toHex_js_1.toHex)(value) : "0x",
          data ?? "0x",
          serializedAccessList,
          serializedAuthorizationList,
          ...toYParitySignatureArray(transaction, signature)
        ])
      ]);
    }
    function serializeTransactionEIP4844(transaction, signature) {
      const { chainId, gas, nonce, to, value, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
      (0, assertTransaction_js_1.assertTransactionEIP4844)(transaction);
      let blobVersionedHashes = transaction.blobVersionedHashes;
      let sidecars = transaction.sidecars;
      if (transaction.blobs && (typeof blobVersionedHashes === "undefined" || typeof sidecars === "undefined")) {
        const blobs2 = typeof transaction.blobs[0] === "string" ? transaction.blobs : transaction.blobs.map((x) => (0, toHex_js_1.bytesToHex)(x));
        const kzg = transaction.kzg;
        const commitments2 = (0, blobsToCommitments_js_1.blobsToCommitments)({
          blobs: blobs2,
          kzg
        });
        if (typeof blobVersionedHashes === "undefined")
          blobVersionedHashes = (0, commitmentsToVersionedHashes_js_1.commitmentsToVersionedHashes)({
            commitments: commitments2
          });
        if (typeof sidecars === "undefined") {
          const proofs2 = (0, blobsToProofs_js_1.blobsToProofs)({ blobs: blobs2, commitments: commitments2, kzg });
          sidecars = (0, toBlobSidecars_js_1.toBlobSidecars)({ blobs: blobs2, commitments: commitments2, proofs: proofs2 });
        }
      }
      const serializedAccessList = (0, serializeAccessList_js_1.serializeAccessList)(accessList);
      const serializedTransaction = [
        (0, toHex_js_1.toHex)(chainId),
        nonce ? (0, toHex_js_1.toHex)(nonce) : "0x",
        maxPriorityFeePerGas ? (0, toHex_js_1.toHex)(maxPriorityFeePerGas) : "0x",
        maxFeePerGas ? (0, toHex_js_1.toHex)(maxFeePerGas) : "0x",
        gas ? (0, toHex_js_1.toHex)(gas) : "0x",
        to ?? "0x",
        value ? (0, toHex_js_1.toHex)(value) : "0x",
        data ?? "0x",
        serializedAccessList,
        maxFeePerBlobGas ? (0, toHex_js_1.toHex)(maxFeePerBlobGas) : "0x",
        blobVersionedHashes ?? [],
        ...toYParitySignatureArray(transaction, signature)
      ];
      const blobs = [];
      const commitments = [];
      const proofs = [];
      if (sidecars)
        for (let i = 0; i < sidecars.length; i++) {
          const { blob, commitment, proof } = sidecars[i];
          blobs.push(blob);
          commitments.push(commitment);
          proofs.push(proof);
        }
      return (0, concat_js_1.concatHex)([
        "0x03",
        sidecars ? (0, toRlp_js_1.toRlp)([serializedTransaction, blobs, commitments, proofs]) : (0, toRlp_js_1.toRlp)(serializedTransaction)
      ]);
    }
    function serializeTransactionEIP1559(transaction, signature) {
      const { chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
      (0, assertTransaction_js_1.assertTransactionEIP1559)(transaction);
      const serializedAccessList = (0, serializeAccessList_js_1.serializeAccessList)(accessList);
      const serializedTransaction = [
        (0, toHex_js_1.toHex)(chainId),
        nonce ? (0, toHex_js_1.toHex)(nonce) : "0x",
        maxPriorityFeePerGas ? (0, toHex_js_1.toHex)(maxPriorityFeePerGas) : "0x",
        maxFeePerGas ? (0, toHex_js_1.toHex)(maxFeePerGas) : "0x",
        gas ? (0, toHex_js_1.toHex)(gas) : "0x",
        to ?? "0x",
        value ? (0, toHex_js_1.toHex)(value) : "0x",
        data ?? "0x",
        serializedAccessList,
        ...toYParitySignatureArray(transaction, signature)
      ];
      return (0, concat_js_1.concatHex)([
        "0x02",
        (0, toRlp_js_1.toRlp)(serializedTransaction)
      ]);
    }
    function serializeTransactionEIP2930(transaction, signature) {
      const { chainId, gas, data, nonce, to, value, accessList, gasPrice } = transaction;
      (0, assertTransaction_js_1.assertTransactionEIP2930)(transaction);
      const serializedAccessList = (0, serializeAccessList_js_1.serializeAccessList)(accessList);
      const serializedTransaction = [
        (0, toHex_js_1.toHex)(chainId),
        nonce ? (0, toHex_js_1.toHex)(nonce) : "0x",
        gasPrice ? (0, toHex_js_1.toHex)(gasPrice) : "0x",
        gas ? (0, toHex_js_1.toHex)(gas) : "0x",
        to ?? "0x",
        value ? (0, toHex_js_1.toHex)(value) : "0x",
        data ?? "0x",
        serializedAccessList,
        ...toYParitySignatureArray(transaction, signature)
      ];
      return (0, concat_js_1.concatHex)([
        "0x01",
        (0, toRlp_js_1.toRlp)(serializedTransaction)
      ]);
    }
    function serializeTransactionLegacy(transaction, signature) {
      const { chainId = 0, gas, data, nonce, to, value, gasPrice } = transaction;
      (0, assertTransaction_js_1.assertTransactionLegacy)(transaction);
      let serializedTransaction = [
        nonce ? (0, toHex_js_1.toHex)(nonce) : "0x",
        gasPrice ? (0, toHex_js_1.toHex)(gasPrice) : "0x",
        gas ? (0, toHex_js_1.toHex)(gas) : "0x",
        to ?? "0x",
        value ? (0, toHex_js_1.toHex)(value) : "0x",
        data ?? "0x"
      ];
      if (signature) {
        const v = (() => {
          if (signature.v >= 35n) {
            const inferredChainId = (signature.v - 35n) / 2n;
            if (inferredChainId > 0)
              return signature.v;
            return 27n + (signature.v === 35n ? 0n : 1n);
          }
          if (chainId > 0)
            return BigInt(chainId * 2) + BigInt(35n + signature.v - 27n);
          const v2 = 27n + (signature.v === 27n ? 0n : 1n);
          if (signature.v !== v2)
            throw new transaction_js_1.InvalidLegacyVError({ v: signature.v });
          return v2;
        })();
        const r = (0, trim_js_1.trim)(signature.r);
        const s = (0, trim_js_1.trim)(signature.s);
        serializedTransaction = [
          ...serializedTransaction,
          (0, toHex_js_1.toHex)(v),
          r === "0x00" ? "0x" : r,
          s === "0x00" ? "0x" : s
        ];
      } else if (chainId > 0) {
        serializedTransaction = [
          ...serializedTransaction,
          (0, toHex_js_1.toHex)(chainId),
          "0x",
          "0x"
        ];
      }
      return (0, toRlp_js_1.toRlp)(serializedTransaction);
    }
    function toYParitySignatureArray(transaction, signature_) {
      const signature = signature_ ?? transaction;
      const { v, yParity } = signature;
      if (typeof signature.r === "undefined")
        return [];
      if (typeof signature.s === "undefined")
        return [];
      if (typeof v === "undefined" && typeof yParity === "undefined")
        return [];
      const r = (0, trim_js_1.trim)(signature.r);
      const s = (0, trim_js_1.trim)(signature.s);
      const yParity_ = (() => {
        if (typeof yParity === "number")
          return yParity ? (0, toHex_js_1.toHex)(1) : "0x";
        if (v === 0n)
          return "0x";
        if (v === 1n)
          return (0, toHex_js_1.toHex)(1);
        return v === 27n ? "0x" : (0, toHex_js_1.toHex)(1);
      })();
      return [yParity_, r === "0x00" ? "0x" : r, s === "0x00" ? "0x" : s];
    }
  }
});

// node_modules/viem/_cjs/errors/unit.js
var require_unit2 = __commonJS({
  "node_modules/viem/_cjs/errors/unit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidDecimalNumberError = void 0;
    var base_js_1 = require_base();
    var InvalidDecimalNumberError = class extends base_js_1.BaseError {
      constructor({ value }) {
        super(`Number \`${value}\` is not a valid decimal number.`, {
          name: "InvalidDecimalNumberError"
        });
      }
    };
    exports.InvalidDecimalNumberError = InvalidDecimalNumberError;
  }
});

// node_modules/viem/_cjs/utils/unit/parseUnits.js
var require_parseUnits = __commonJS({
  "node_modules/viem/_cjs/utils/unit/parseUnits.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseUnits = parseUnits;
    var unit_js_1 = require_unit2();
    function parseUnits(value, decimals) {
      if (!/^(-?)([0-9]*)\.?([0-9]*)$/.test(value))
        throw new unit_js_1.InvalidDecimalNumberError({ value });
      let [integer, fraction = "0"] = value.split(".");
      const negative = integer.startsWith("-");
      if (negative)
        integer = integer.slice(1);
      fraction = fraction.replace(/(0+)$/, "");
      if (decimals === 0) {
        if (Math.round(Number(`.${fraction}`)) === 1)
          integer = `${BigInt(integer) + 1n}`;
        fraction = "";
      } else if (fraction.length > decimals) {
        const [left, unit, right] = [
          fraction.slice(0, decimals - 1),
          fraction.slice(decimals - 1, decimals),
          fraction.slice(decimals)
        ];
        const rounded = Math.round(Number(`${unit}.${right}`));
        if (rounded > 9)
          fraction = `${BigInt(left) + BigInt(1)}0`.padStart(left.length + 1, "0");
        else
          fraction = `${left}${rounded}`;
        if (fraction.length > decimals) {
          fraction = fraction.slice(1);
          integer = `${BigInt(integer) + 1n}`;
        }
        fraction = fraction.slice(0, decimals);
      } else {
        fraction = fraction.padEnd(decimals, "0");
      }
      return BigInt(`${negative ? "-" : ""}${integer}${fraction}`);
    }
  }
});

// node_modules/viem/_cjs/utils/unit/parseEther.js
var require_parseEther = __commonJS({
  "node_modules/viem/_cjs/utils/unit/parseEther.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseEther = parseEther;
    var unit_js_1 = require_unit();
    var parseUnits_js_1 = require_parseUnits();
    function parseEther(ether, unit = "wei") {
      return (0, parseUnits_js_1.parseUnits)(ether, unit_js_1.etherUnits[unit]);
    }
  }
});

// node_modules/viem/_cjs/utils/unit/parseGwei.js
var require_parseGwei = __commonJS({
  "node_modules/viem/_cjs/utils/unit/parseGwei.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseGwei = parseGwei;
    var unit_js_1 = require_unit();
    var parseUnits_js_1 = require_parseUnits();
    function parseGwei(ether, unit = "wei") {
      return (0, parseUnits_js_1.parseUnits)(ether, unit_js_1.gweiUnits[unit]);
    }
  }
});

// node_modules/viem/_cjs/utils/nonceManager.js
var require_nonceManager = __commonJS({
  "node_modules/viem/_cjs/utils/nonceManager.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.nonceManager = void 0;
    exports.createNonceManager = createNonceManager;
    exports.jsonRpc = jsonRpc;
    var getTransactionCount_js_1 = require_getTransactionCount();
    var lru_js_1 = require_lru();
    function createNonceManager(parameters) {
      const { source } = parameters;
      const deltaMap = /* @__PURE__ */ new Map();
      const nonceMap = new lru_js_1.LruMap(8192);
      const promiseMap = /* @__PURE__ */ new Map();
      const getKey = ({ address, chainId }) => `${address}.${chainId}`;
      return {
        async consume({ address, chainId, client }) {
          const key = getKey({ address, chainId });
          const promise = this.get({ address, chainId, client });
          this.increment({ address, chainId });
          const nonce = await promise;
          await source.set({ address, chainId }, nonce);
          nonceMap.set(key, nonce);
          return nonce;
        },
        async increment({ address, chainId }) {
          const key = getKey({ address, chainId });
          const delta = deltaMap.get(key) ?? 0;
          deltaMap.set(key, delta + 1);
        },
        async get({ address, chainId, client }) {
          const key = getKey({ address, chainId });
          let promise = promiseMap.get(key);
          if (!promise) {
            promise = (async () => {
              try {
                const nonce = await source.get({ address, chainId, client });
                const previousNonce = nonceMap.get(key) ?? 0;
                if (previousNonce > 0 && nonce <= previousNonce)
                  return previousNonce + 1;
                nonceMap.delete(key);
                return nonce;
              } finally {
                this.reset({ address, chainId });
              }
            })();
            promiseMap.set(key, promise);
          }
          const delta = deltaMap.get(key) ?? 0;
          return delta + await promise;
        },
        reset({ address, chainId }) {
          const key = getKey({ address, chainId });
          deltaMap.delete(key);
          promiseMap.delete(key);
        }
      };
    }
    function jsonRpc() {
      return {
        async get(parameters) {
          const { address, client } = parameters;
          return (0, getTransactionCount_js_1.getTransactionCount)(client, {
            address,
            blockTag: "pending"
          });
        },
        set() {
        }
      };
    }
    exports.nonceManager = createNonceManager({
      source: jsonRpc()
    });
  }
});

// node_modules/viem/_cjs/utils/index.js
var require_utils8 = __commonJS({
  "node_modules/viem/_cjs/utils/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isAddress = exports.getAddress = exports.getCreate2Address = exports.getCreateAddress = exports.getContractAddress = exports.publicKeyToAddress = exports.parseAccount = exports.formatAbiParams = exports.formatAbiItem = exports.formatAbiItemWithArgs = exports.encodePacked = exports.parseAbiParameters = exports.parseAbiParameter = exports.parseAbiItem = exports.parseAbi = exports.getAbiItem = exports.parseEventLogs = exports.encodeFunctionResult = exports.encodeFunctionData = exports.encodeEventTopics = exports.encodeErrorResult = exports.encodeDeployData = exports.encodeAbiParameters = exports.decodeFunctionResult = exports.decodeFunctionData = exports.decodeEventLog = exports.decodeErrorResult = exports.decodeAbiParameters = exports.validateTypedData = exports.serializeTypedData = exports.stringify = exports.getWebSocketRpcClient = exports.socketClientCache = exports.getSocketRpcClient = exports.getHttpRpcClient = exports.rpc = exports.getSocket = exports.integerRegex = exports.bytesRegex = exports.arrayRegex = exports.getChainContractAddress = exports.extractChain = exports.defineChain = exports.assertCurrentChain = exports.offchainLookupSignature = exports.offchainLookupAbiItem = exports.offchainLookup = exports.ccipFetch = exports.ccipRequest = exports.buildRequest = void 0;
    exports.getCallError = exports.getNodeError = exports.containsNodeError = exports.fromRlp = exports.hexToString = exports.hexToNumber = exports.hexToBigInt = exports.hexToBool = exports.fromHex = exports.fromBytes = exports.bytesToString = exports.bytesToNumber = exports.bytesToBool = exports.bytesToBigint = exports.bytesToBigInt = exports.stringToHex = exports.numberToHex = exports.toHex = exports.bytesToHex = exports.boolToHex = exports.stringToBytes = exports.numberToBytes = exports.hexToBytes = exports.toBytes = exports.boolToBytes = exports.toRlp = exports.extract = exports.formatTransactionRequest = exports.defineTransactionRequest = exports.defineTransactionReceipt = exports.formatLog = exports.transactionType = exports.formatTransaction = exports.defineTransaction = exports.formatBlock = exports.defineBlock = exports.trim = exports.sliceHex = exports.sliceBytes = exports.slice = exports.size = exports.padHex = exports.padBytes = exports.pad = exports.isHex = exports.isBytes = exports.concatHex = exports.concatBytes = exports.concat = exports.isAddressEqual = void 0;
    exports.nonceManager = exports.createNonceManager = exports.parseGwei = exports.parseEther = exports.parseUnits = exports.formatUnits = exports.formatGwei = exports.formatEther = exports.serializeAccessList = exports.serializeTransaction = exports.parseTransaction = exports.assertTransactionLegacy = exports.assertTransactionEIP2930 = exports.assertTransactionEIP1559 = exports.assertRequest = exports.getTransactionType = exports.getSerializedTransactionType = exports.serializeErc6492Signature = exports.isErc6492Signature = exports.parseErc6492Signature = exports.hashMessage = exports.verifyTypedData = exports.verifyMessage = exports.verifyHash = exports.recoverTypedDataAddress = exports.recoverPublicKey = exports.recoverMessageAddress = exports.recoverAddress = exports.hashTypedData = exports.hashStruct = exports.ripemd160 = exports.sha256 = exports.keccak256 = exports.isHash = exports.toFunctionHash = exports.toEventHash = exports.getFunctionSignature = exports.toFunctionSignature = exports.getEventSignature = exports.toEventSignature = exports.getFunctionSelector = exports.toFunctionSelector = exports.getEventSelector = exports.toEventSelector = exports.defineFormatter = exports.getAction = exports.getTransactionError = exports.getEstimateGasError = exports.getContractError = void 0;
    var buildRequest_js_1 = require_buildRequest();
    Object.defineProperty(exports, "buildRequest", { enumerable: true, get: function() {
      return buildRequest_js_1.buildRequest;
    } });
    var ccip_js_1 = require_ccip2();
    Object.defineProperty(exports, "ccipRequest", { enumerable: true, get: function() {
      return ccip_js_1.ccipRequest;
    } });
    Object.defineProperty(exports, "ccipFetch", { enumerable: true, get: function() {
      return ccip_js_1.ccipRequest;
    } });
    Object.defineProperty(exports, "offchainLookup", { enumerable: true, get: function() {
      return ccip_js_1.offchainLookup;
    } });
    Object.defineProperty(exports, "offchainLookupAbiItem", { enumerable: true, get: function() {
      return ccip_js_1.offchainLookupAbiItem;
    } });
    Object.defineProperty(exports, "offchainLookupSignature", { enumerable: true, get: function() {
      return ccip_js_1.offchainLookupSignature;
    } });
    var assertCurrentChain_js_1 = require_assertCurrentChain();
    Object.defineProperty(exports, "assertCurrentChain", { enumerable: true, get: function() {
      return assertCurrentChain_js_1.assertCurrentChain;
    } });
    var defineChain_js_1 = require_defineChain();
    Object.defineProperty(exports, "defineChain", { enumerable: true, get: function() {
      return defineChain_js_1.defineChain;
    } });
    var extractChain_js_1 = require_extractChain();
    Object.defineProperty(exports, "extractChain", { enumerable: true, get: function() {
      return extractChain_js_1.extractChain;
    } });
    var getChainContractAddress_js_1 = require_getChainContractAddress();
    Object.defineProperty(exports, "getChainContractAddress", { enumerable: true, get: function() {
      return getChainContractAddress_js_1.getChainContractAddress;
    } });
    var regex_js_1 = require_regex2();
    Object.defineProperty(exports, "arrayRegex", { enumerable: true, get: function() {
      return regex_js_1.arrayRegex;
    } });
    Object.defineProperty(exports, "bytesRegex", { enumerable: true, get: function() {
      return regex_js_1.bytesRegex;
    } });
    Object.defineProperty(exports, "integerRegex", { enumerable: true, get: function() {
      return regex_js_1.integerRegex;
    } });
    var compat_js_1 = require_compat();
    Object.defineProperty(exports, "getSocket", { enumerable: true, get: function() {
      return compat_js_1.getSocket;
    } });
    Object.defineProperty(exports, "rpc", { enumerable: true, get: function() {
      return compat_js_1.rpc;
    } });
    var http_js_1 = require_http();
    Object.defineProperty(exports, "getHttpRpcClient", { enumerable: true, get: function() {
      return http_js_1.getHttpRpcClient;
    } });
    var socket_js_1 = require_socket();
    Object.defineProperty(exports, "getSocketRpcClient", { enumerable: true, get: function() {
      return socket_js_1.getSocketRpcClient;
    } });
    Object.defineProperty(exports, "socketClientCache", { enumerable: true, get: function() {
      return socket_js_1.socketClientCache;
    } });
    var webSocket_js_1 = require_webSocket();
    Object.defineProperty(exports, "getWebSocketRpcClient", { enumerable: true, get: function() {
      return webSocket_js_1.getWebSocketRpcClient;
    } });
    var stringify_js_1 = require_stringify();
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return stringify_js_1.stringify;
    } });
    var typedData_js_1 = require_typedData2();
    Object.defineProperty(exports, "serializeTypedData", { enumerable: true, get: function() {
      return typedData_js_1.serializeTypedData;
    } });
    Object.defineProperty(exports, "validateTypedData", { enumerable: true, get: function() {
      return typedData_js_1.validateTypedData;
    } });
    var decodeAbiParameters_js_1 = require_decodeAbiParameters();
    Object.defineProperty(exports, "decodeAbiParameters", { enumerable: true, get: function() {
      return decodeAbiParameters_js_1.decodeAbiParameters;
    } });
    var decodeErrorResult_js_1 = require_decodeErrorResult();
    Object.defineProperty(exports, "decodeErrorResult", { enumerable: true, get: function() {
      return decodeErrorResult_js_1.decodeErrorResult;
    } });
    var decodeEventLog_js_1 = require_decodeEventLog();
    Object.defineProperty(exports, "decodeEventLog", { enumerable: true, get: function() {
      return decodeEventLog_js_1.decodeEventLog;
    } });
    var decodeFunctionData_js_1 = require_decodeFunctionData();
    Object.defineProperty(exports, "decodeFunctionData", { enumerable: true, get: function() {
      return decodeFunctionData_js_1.decodeFunctionData;
    } });
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    Object.defineProperty(exports, "decodeFunctionResult", { enumerable: true, get: function() {
      return decodeFunctionResult_js_1.decodeFunctionResult;
    } });
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    Object.defineProperty(exports, "encodeAbiParameters", { enumerable: true, get: function() {
      return encodeAbiParameters_js_1.encodeAbiParameters;
    } });
    var encodeDeployData_js_1 = require_encodeDeployData();
    Object.defineProperty(exports, "encodeDeployData", { enumerable: true, get: function() {
      return encodeDeployData_js_1.encodeDeployData;
    } });
    var encodeErrorResult_js_1 = require_encodeErrorResult();
    Object.defineProperty(exports, "encodeErrorResult", { enumerable: true, get: function() {
      return encodeErrorResult_js_1.encodeErrorResult;
    } });
    var encodeEventTopics_js_1 = require_encodeEventTopics();
    Object.defineProperty(exports, "encodeEventTopics", { enumerable: true, get: function() {
      return encodeEventTopics_js_1.encodeEventTopics;
    } });
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    Object.defineProperty(exports, "encodeFunctionData", { enumerable: true, get: function() {
      return encodeFunctionData_js_1.encodeFunctionData;
    } });
    var encodeFunctionResult_js_1 = require_encodeFunctionResult();
    Object.defineProperty(exports, "encodeFunctionResult", { enumerable: true, get: function() {
      return encodeFunctionResult_js_1.encodeFunctionResult;
    } });
    var parseEventLogs_js_1 = require_parseEventLogs();
    Object.defineProperty(exports, "parseEventLogs", { enumerable: true, get: function() {
      return parseEventLogs_js_1.parseEventLogs;
    } });
    var getAbiItem_js_1 = require_getAbiItem();
    Object.defineProperty(exports, "getAbiItem", { enumerable: true, get: function() {
      return getAbiItem_js_1.getAbiItem;
    } });
    var abitype_1 = require_exports();
    Object.defineProperty(exports, "parseAbi", { enumerable: true, get: function() {
      return abitype_1.parseAbi;
    } });
    Object.defineProperty(exports, "parseAbiItem", { enumerable: true, get: function() {
      return abitype_1.parseAbiItem;
    } });
    Object.defineProperty(exports, "parseAbiParameter", { enumerable: true, get: function() {
      return abitype_1.parseAbiParameter;
    } });
    Object.defineProperty(exports, "parseAbiParameters", { enumerable: true, get: function() {
      return abitype_1.parseAbiParameters;
    } });
    var encodePacked_js_1 = require_encodePacked();
    Object.defineProperty(exports, "encodePacked", { enumerable: true, get: function() {
      return encodePacked_js_1.encodePacked;
    } });
    var formatAbiItemWithArgs_js_1 = require_formatAbiItemWithArgs();
    Object.defineProperty(exports, "formatAbiItemWithArgs", { enumerable: true, get: function() {
      return formatAbiItemWithArgs_js_1.formatAbiItemWithArgs;
    } });
    var formatAbiItem_js_1 = require_formatAbiItem2();
    Object.defineProperty(exports, "formatAbiItem", { enumerable: true, get: function() {
      return formatAbiItem_js_1.formatAbiItem;
    } });
    Object.defineProperty(exports, "formatAbiParams", { enumerable: true, get: function() {
      return formatAbiItem_js_1.formatAbiParams;
    } });
    var parseAccount_js_1 = require_parseAccount();
    Object.defineProperty(exports, "parseAccount", { enumerable: true, get: function() {
      return parseAccount_js_1.parseAccount;
    } });
    var publicKeyToAddress_js_1 = require_publicKeyToAddress();
    Object.defineProperty(exports, "publicKeyToAddress", { enumerable: true, get: function() {
      return publicKeyToAddress_js_1.publicKeyToAddress;
    } });
    var getContractAddress_js_1 = require_getContractAddress();
    Object.defineProperty(exports, "getContractAddress", { enumerable: true, get: function() {
      return getContractAddress_js_1.getContractAddress;
    } });
    Object.defineProperty(exports, "getCreateAddress", { enumerable: true, get: function() {
      return getContractAddress_js_1.getCreateAddress;
    } });
    Object.defineProperty(exports, "getCreate2Address", { enumerable: true, get: function() {
      return getContractAddress_js_1.getCreate2Address;
    } });
    var getAddress_js_1 = require_getAddress();
    Object.defineProperty(exports, "getAddress", { enumerable: true, get: function() {
      return getAddress_js_1.getAddress;
    } });
    var isAddress_js_1 = require_isAddress();
    Object.defineProperty(exports, "isAddress", { enumerable: true, get: function() {
      return isAddress_js_1.isAddress;
    } });
    var isAddressEqual_js_1 = require_isAddressEqual();
    Object.defineProperty(exports, "isAddressEqual", { enumerable: true, get: function() {
      return isAddressEqual_js_1.isAddressEqual;
    } });
    var concat_js_1 = require_concat();
    Object.defineProperty(exports, "concat", { enumerable: true, get: function() {
      return concat_js_1.concat;
    } });
    Object.defineProperty(exports, "concatBytes", { enumerable: true, get: function() {
      return concat_js_1.concatBytes;
    } });
    Object.defineProperty(exports, "concatHex", { enumerable: true, get: function() {
      return concat_js_1.concatHex;
    } });
    var isBytes_js_1 = require_isBytes();
    Object.defineProperty(exports, "isBytes", { enumerable: true, get: function() {
      return isBytes_js_1.isBytes;
    } });
    var isHex_js_1 = require_isHex();
    Object.defineProperty(exports, "isHex", { enumerable: true, get: function() {
      return isHex_js_1.isHex;
    } });
    var pad_js_1 = require_pad();
    Object.defineProperty(exports, "pad", { enumerable: true, get: function() {
      return pad_js_1.pad;
    } });
    Object.defineProperty(exports, "padBytes", { enumerable: true, get: function() {
      return pad_js_1.padBytes;
    } });
    Object.defineProperty(exports, "padHex", { enumerable: true, get: function() {
      return pad_js_1.padHex;
    } });
    var size_js_1 = require_size();
    Object.defineProperty(exports, "size", { enumerable: true, get: function() {
      return size_js_1.size;
    } });
    var slice_js_1 = require_slice();
    Object.defineProperty(exports, "slice", { enumerable: true, get: function() {
      return slice_js_1.slice;
    } });
    Object.defineProperty(exports, "sliceBytes", { enumerable: true, get: function() {
      return slice_js_1.sliceBytes;
    } });
    Object.defineProperty(exports, "sliceHex", { enumerable: true, get: function() {
      return slice_js_1.sliceHex;
    } });
    var trim_js_1 = require_trim();
    Object.defineProperty(exports, "trim", { enumerable: true, get: function() {
      return trim_js_1.trim;
    } });
    var block_js_1 = require_block2();
    Object.defineProperty(exports, "defineBlock", { enumerable: true, get: function() {
      return block_js_1.defineBlock;
    } });
    Object.defineProperty(exports, "formatBlock", { enumerable: true, get: function() {
      return block_js_1.formatBlock;
    } });
    var transaction_js_1 = require_transaction2();
    Object.defineProperty(exports, "defineTransaction", { enumerable: true, get: function() {
      return transaction_js_1.defineTransaction;
    } });
    Object.defineProperty(exports, "formatTransaction", { enumerable: true, get: function() {
      return transaction_js_1.formatTransaction;
    } });
    Object.defineProperty(exports, "transactionType", { enumerable: true, get: function() {
      return transaction_js_1.transactionType;
    } });
    var log_js_1 = require_log2();
    Object.defineProperty(exports, "formatLog", { enumerable: true, get: function() {
      return log_js_1.formatLog;
    } });
    var transactionReceipt_js_1 = require_transactionReceipt();
    Object.defineProperty(exports, "defineTransactionReceipt", { enumerable: true, get: function() {
      return transactionReceipt_js_1.defineTransactionReceipt;
    } });
    var transactionRequest_js_1 = require_transactionRequest();
    Object.defineProperty(exports, "defineTransactionRequest", { enumerable: true, get: function() {
      return transactionRequest_js_1.defineTransactionRequest;
    } });
    Object.defineProperty(exports, "formatTransactionRequest", { enumerable: true, get: function() {
      return transactionRequest_js_1.formatTransactionRequest;
    } });
    var extract_js_1 = require_extract();
    Object.defineProperty(exports, "extract", { enumerable: true, get: function() {
      return extract_js_1.extract;
    } });
    var toRlp_js_1 = require_toRlp();
    Object.defineProperty(exports, "toRlp", { enumerable: true, get: function() {
      return toRlp_js_1.toRlp;
    } });
    var toBytes_js_1 = require_toBytes();
    Object.defineProperty(exports, "boolToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.boolToBytes;
    } });
    Object.defineProperty(exports, "toBytes", { enumerable: true, get: function() {
      return toBytes_js_1.toBytes;
    } });
    Object.defineProperty(exports, "hexToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.hexToBytes;
    } });
    Object.defineProperty(exports, "numberToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.numberToBytes;
    } });
    Object.defineProperty(exports, "stringToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.stringToBytes;
    } });
    var toHex_js_1 = require_toHex();
    Object.defineProperty(exports, "boolToHex", { enumerable: true, get: function() {
      return toHex_js_1.boolToHex;
    } });
    Object.defineProperty(exports, "bytesToHex", { enumerable: true, get: function() {
      return toHex_js_1.bytesToHex;
    } });
    Object.defineProperty(exports, "toHex", { enumerable: true, get: function() {
      return toHex_js_1.toHex;
    } });
    Object.defineProperty(exports, "numberToHex", { enumerable: true, get: function() {
      return toHex_js_1.numberToHex;
    } });
    Object.defineProperty(exports, "stringToHex", { enumerable: true, get: function() {
      return toHex_js_1.stringToHex;
    } });
    var fromBytes_js_1 = require_fromBytes();
    Object.defineProperty(exports, "bytesToBigInt", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToBigInt;
    } });
    Object.defineProperty(exports, "bytesToBigint", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToBigInt;
    } });
    Object.defineProperty(exports, "bytesToBool", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToBool;
    } });
    Object.defineProperty(exports, "bytesToNumber", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToNumber;
    } });
    Object.defineProperty(exports, "bytesToString", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToString;
    } });
    Object.defineProperty(exports, "fromBytes", { enumerable: true, get: function() {
      return fromBytes_js_1.fromBytes;
    } });
    var fromHex_js_1 = require_fromHex();
    Object.defineProperty(exports, "fromHex", { enumerable: true, get: function() {
      return fromHex_js_1.fromHex;
    } });
    Object.defineProperty(exports, "hexToBool", { enumerable: true, get: function() {
      return fromHex_js_1.hexToBool;
    } });
    Object.defineProperty(exports, "hexToBigInt", { enumerable: true, get: function() {
      return fromHex_js_1.hexToBigInt;
    } });
    Object.defineProperty(exports, "hexToNumber", { enumerable: true, get: function() {
      return fromHex_js_1.hexToNumber;
    } });
    Object.defineProperty(exports, "hexToString", { enumerable: true, get: function() {
      return fromHex_js_1.hexToString;
    } });
    var fromRlp_js_1 = require_fromRlp();
    Object.defineProperty(exports, "fromRlp", { enumerable: true, get: function() {
      return fromRlp_js_1.fromRlp;
    } });
    var getNodeError_js_1 = require_getNodeError();
    Object.defineProperty(exports, "containsNodeError", { enumerable: true, get: function() {
      return getNodeError_js_1.containsNodeError;
    } });
    Object.defineProperty(exports, "getNodeError", { enumerable: true, get: function() {
      return getNodeError_js_1.getNodeError;
    } });
    var getCallError_js_1 = require_getCallError();
    Object.defineProperty(exports, "getCallError", { enumerable: true, get: function() {
      return getCallError_js_1.getCallError;
    } });
    var getContractError_js_1 = require_getContractError();
    Object.defineProperty(exports, "getContractError", { enumerable: true, get: function() {
      return getContractError_js_1.getContractError;
    } });
    var getEstimateGasError_js_1 = require_getEstimateGasError();
    Object.defineProperty(exports, "getEstimateGasError", { enumerable: true, get: function() {
      return getEstimateGasError_js_1.getEstimateGasError;
    } });
    var getTransactionError_js_1 = require_getTransactionError();
    Object.defineProperty(exports, "getTransactionError", { enumerable: true, get: function() {
      return getTransactionError_js_1.getTransactionError;
    } });
    var getAction_js_1 = require_getAction();
    Object.defineProperty(exports, "getAction", { enumerable: true, get: function() {
      return getAction_js_1.getAction;
    } });
    var formatter_js_1 = require_formatter();
    Object.defineProperty(exports, "defineFormatter", { enumerable: true, get: function() {
      return formatter_js_1.defineFormatter;
    } });
    var toEventSelector_js_1 = require_toEventSelector();
    Object.defineProperty(exports, "toEventSelector", { enumerable: true, get: function() {
      return toEventSelector_js_1.toEventSelector;
    } });
    Object.defineProperty(exports, "getEventSelector", { enumerable: true, get: function() {
      return toEventSelector_js_1.toEventSelector;
    } });
    var toFunctionSelector_js_1 = require_toFunctionSelector();
    Object.defineProperty(exports, "toFunctionSelector", { enumerable: true, get: function() {
      return toFunctionSelector_js_1.toFunctionSelector;
    } });
    Object.defineProperty(exports, "getFunctionSelector", { enumerable: true, get: function() {
      return toFunctionSelector_js_1.toFunctionSelector;
    } });
    var toEventSignature_js_1 = require_toEventSignature();
    Object.defineProperty(exports, "toEventSignature", { enumerable: true, get: function() {
      return toEventSignature_js_1.toEventSignature;
    } });
    Object.defineProperty(exports, "getEventSignature", { enumerable: true, get: function() {
      return toEventSignature_js_1.toEventSignature;
    } });
    var toFunctionSignature_js_1 = require_toFunctionSignature();
    Object.defineProperty(exports, "toFunctionSignature", { enumerable: true, get: function() {
      return toFunctionSignature_js_1.toFunctionSignature;
    } });
    Object.defineProperty(exports, "getFunctionSignature", { enumerable: true, get: function() {
      return toFunctionSignature_js_1.toFunctionSignature;
    } });
    var toEventHash_js_1 = require_toEventHash();
    Object.defineProperty(exports, "toEventHash", { enumerable: true, get: function() {
      return toEventHash_js_1.toEventHash;
    } });
    var toFunctionHash_js_1 = require_toFunctionHash();
    Object.defineProperty(exports, "toFunctionHash", { enumerable: true, get: function() {
      return toFunctionHash_js_1.toFunctionHash;
    } });
    var isHash_js_1 = require_isHash();
    Object.defineProperty(exports, "isHash", { enumerable: true, get: function() {
      return isHash_js_1.isHash;
    } });
    var keccak256_js_1 = require_keccak256();
    Object.defineProperty(exports, "keccak256", { enumerable: true, get: function() {
      return keccak256_js_1.keccak256;
    } });
    var sha256_js_1 = require_sha2563();
    Object.defineProperty(exports, "sha256", { enumerable: true, get: function() {
      return sha256_js_1.sha256;
    } });
    var ripemd160_js_1 = require_ripemd1602();
    Object.defineProperty(exports, "ripemd160", { enumerable: true, get: function() {
      return ripemd160_js_1.ripemd160;
    } });
    var hashTypedData_js_1 = require_hashTypedData();
    Object.defineProperty(exports, "hashStruct", { enumerable: true, get: function() {
      return hashTypedData_js_1.hashStruct;
    } });
    Object.defineProperty(exports, "hashTypedData", { enumerable: true, get: function() {
      return hashTypedData_js_1.hashTypedData;
    } });
    var recoverAddress_js_1 = require_recoverAddress();
    Object.defineProperty(exports, "recoverAddress", { enumerable: true, get: function() {
      return recoverAddress_js_1.recoverAddress;
    } });
    var recoverMessageAddress_js_1 = require_recoverMessageAddress();
    Object.defineProperty(exports, "recoverMessageAddress", { enumerable: true, get: function() {
      return recoverMessageAddress_js_1.recoverMessageAddress;
    } });
    var recoverPublicKey_js_1 = require_recoverPublicKey();
    Object.defineProperty(exports, "recoverPublicKey", { enumerable: true, get: function() {
      return recoverPublicKey_js_1.recoverPublicKey;
    } });
    var recoverTypedDataAddress_js_1 = require_recoverTypedDataAddress();
    Object.defineProperty(exports, "recoverTypedDataAddress", { enumerable: true, get: function() {
      return recoverTypedDataAddress_js_1.recoverTypedDataAddress;
    } });
    var verifyHash_js_1 = require_verifyHash();
    Object.defineProperty(exports, "verifyHash", { enumerable: true, get: function() {
      return verifyHash_js_1.verifyHash;
    } });
    var verifyMessage_js_1 = require_verifyMessage();
    Object.defineProperty(exports, "verifyMessage", { enumerable: true, get: function() {
      return verifyMessage_js_1.verifyMessage;
    } });
    var verifyTypedData_js_1 = require_verifyTypedData();
    Object.defineProperty(exports, "verifyTypedData", { enumerable: true, get: function() {
      return verifyTypedData_js_1.verifyTypedData;
    } });
    var hashMessage_js_1 = require_hashMessage();
    Object.defineProperty(exports, "hashMessage", { enumerable: true, get: function() {
      return hashMessage_js_1.hashMessage;
    } });
    var parseErc6492Signature_js_1 = require_parseErc6492Signature();
    Object.defineProperty(exports, "parseErc6492Signature", { enumerable: true, get: function() {
      return parseErc6492Signature_js_1.parseErc6492Signature;
    } });
    var isErc6492Signature_js_1 = require_isErc6492Signature();
    Object.defineProperty(exports, "isErc6492Signature", { enumerable: true, get: function() {
      return isErc6492Signature_js_1.isErc6492Signature;
    } });
    var serializeErc6492Signature_js_1 = require_serializeErc6492Signature();
    Object.defineProperty(exports, "serializeErc6492Signature", { enumerable: true, get: function() {
      return serializeErc6492Signature_js_1.serializeErc6492Signature;
    } });
    var getSerializedTransactionType_js_1 = require_getSerializedTransactionType();
    Object.defineProperty(exports, "getSerializedTransactionType", { enumerable: true, get: function() {
      return getSerializedTransactionType_js_1.getSerializedTransactionType;
    } });
    var getTransactionType_js_1 = require_getTransactionType();
    Object.defineProperty(exports, "getTransactionType", { enumerable: true, get: function() {
      return getTransactionType_js_1.getTransactionType;
    } });
    var assertRequest_js_1 = require_assertRequest();
    Object.defineProperty(exports, "assertRequest", { enumerable: true, get: function() {
      return assertRequest_js_1.assertRequest;
    } });
    var assertTransaction_js_1 = require_assertTransaction();
    Object.defineProperty(exports, "assertTransactionEIP1559", { enumerable: true, get: function() {
      return assertTransaction_js_1.assertTransactionEIP1559;
    } });
    Object.defineProperty(exports, "assertTransactionEIP2930", { enumerable: true, get: function() {
      return assertTransaction_js_1.assertTransactionEIP2930;
    } });
    Object.defineProperty(exports, "assertTransactionLegacy", { enumerable: true, get: function() {
      return assertTransaction_js_1.assertTransactionLegacy;
    } });
    var parseTransaction_js_1 = require_parseTransaction();
    Object.defineProperty(exports, "parseTransaction", { enumerable: true, get: function() {
      return parseTransaction_js_1.parseTransaction;
    } });
    var serializeTransaction_js_1 = require_serializeTransaction();
    Object.defineProperty(exports, "serializeTransaction", { enumerable: true, get: function() {
      return serializeTransaction_js_1.serializeTransaction;
    } });
    var serializeAccessList_js_1 = require_serializeAccessList();
    Object.defineProperty(exports, "serializeAccessList", { enumerable: true, get: function() {
      return serializeAccessList_js_1.serializeAccessList;
    } });
    var formatEther_js_1 = require_formatEther();
    Object.defineProperty(exports, "formatEther", { enumerable: true, get: function() {
      return formatEther_js_1.formatEther;
    } });
    var formatGwei_js_1 = require_formatGwei();
    Object.defineProperty(exports, "formatGwei", { enumerable: true, get: function() {
      return formatGwei_js_1.formatGwei;
    } });
    var formatUnits_js_1 = require_formatUnits();
    Object.defineProperty(exports, "formatUnits", { enumerable: true, get: function() {
      return formatUnits_js_1.formatUnits;
    } });
    var parseUnits_js_1 = require_parseUnits();
    Object.defineProperty(exports, "parseUnits", { enumerable: true, get: function() {
      return parseUnits_js_1.parseUnits;
    } });
    var parseEther_js_1 = require_parseEther();
    Object.defineProperty(exports, "parseEther", { enumerable: true, get: function() {
      return parseEther_js_1.parseEther;
    } });
    var parseGwei_js_1 = require_parseGwei();
    Object.defineProperty(exports, "parseGwei", { enumerable: true, get: function() {
      return parseGwei_js_1.parseGwei;
    } });
    var nonceManager_js_1 = require_nonceManager();
    Object.defineProperty(exports, "createNonceManager", { enumerable: true, get: function() {
      return nonceManager_js_1.createNonceManager;
    } });
    Object.defineProperty(exports, "nonceManager", { enumerable: true, get: function() {
      return nonceManager_js_1.nonceManager;
    } });
  }
});

// node_modules/viem/_cjs/utils/formatters/proof.js
var require_proof = __commonJS({
  "node_modules/viem/_cjs/utils/formatters/proof.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatProof = formatProof;
    var index_js_1 = require_utils8();
    function formatStorageProof(storageProof) {
      return storageProof.map((proof) => ({
        ...proof,
        value: BigInt(proof.value)
      }));
    }
    function formatProof(proof) {
      return {
        ...proof,
        balance: proof.balance ? BigInt(proof.balance) : void 0,
        nonce: proof.nonce ? (0, index_js_1.hexToNumber)(proof.nonce) : void 0,
        storageProof: proof.storageProof ? formatStorageProof(proof.storageProof) : void 0
      };
    }
  }
});

// node_modules/viem/_cjs/actions/public/getProof.js
var require_getProof = __commonJS({
  "node_modules/viem/_cjs/actions/public/getProof.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProof = getProof;
    var toHex_js_1 = require_toHex();
    var proof_js_1 = require_proof();
    async function getProof(client, { address, blockNumber, blockTag: blockTag_, storageKeys }) {
      const blockTag = blockTag_ ?? "latest";
      const blockNumberHex = blockNumber !== void 0 ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      const proof = await client.request({
        method: "eth_getProof",
        params: [address, storageKeys, blockNumberHex || blockTag]
      });
      return (0, proof_js_1.formatProof)(proof);
    }
  }
});

// node_modules/viem/_cjs/actions/public/getStorageAt.js
var require_getStorageAt = __commonJS({
  "node_modules/viem/_cjs/actions/public/getStorageAt.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getStorageAt = getStorageAt;
    var toHex_js_1 = require_toHex();
    async function getStorageAt(client, { address, blockNumber, blockTag = "latest", slot }) {
      const blockNumberHex = blockNumber !== void 0 ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      const data = await client.request({
        method: "eth_getStorageAt",
        params: [address, slot, blockNumberHex || blockTag]
      });
      return data;
    }
  }
});

// node_modules/viem/_cjs/actions/public/getTransaction.js
var require_getTransaction = __commonJS({
  "node_modules/viem/_cjs/actions/public/getTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTransaction = getTransaction;
    var transaction_js_1 = require_transaction();
    var toHex_js_1 = require_toHex();
    var transaction_js_2 = require_transaction2();
    async function getTransaction(client, { blockHash, blockNumber, blockTag: blockTag_, hash, index }) {
      var _a, _b, _c;
      const blockTag = blockTag_ || "latest";
      const blockNumberHex = blockNumber !== void 0 ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
      let transaction = null;
      if (hash) {
        transaction = await client.request({
          method: "eth_getTransactionByHash",
          params: [hash]
        }, { dedupe: true });
      } else if (blockHash) {
        transaction = await client.request({
          method: "eth_getTransactionByBlockHashAndIndex",
          params: [blockHash, (0, toHex_js_1.numberToHex)(index)]
        }, { dedupe: true });
      } else if (blockNumberHex || blockTag) {
        transaction = await client.request({
          method: "eth_getTransactionByBlockNumberAndIndex",
          params: [blockNumberHex || blockTag, (0, toHex_js_1.numberToHex)(index)]
        }, { dedupe: Boolean(blockNumberHex) });
      }
      if (!transaction)
        throw new transaction_js_1.TransactionNotFoundError({
          blockHash,
          blockNumber,
          blockTag,
          hash,
          index
        });
      const format = ((_c = (_b = (_a = client.chain) == null ? void 0 : _a.formatters) == null ? void 0 : _b.transaction) == null ? void 0 : _c.format) || transaction_js_2.formatTransaction;
      return format(transaction);
    }
  }
});

// node_modules/viem/_cjs/actions/public/getTransactionConfirmations.js
var require_getTransactionConfirmations = __commonJS({
  "node_modules/viem/_cjs/actions/public/getTransactionConfirmations.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTransactionConfirmations = getTransactionConfirmations;
    var getAction_js_1 = require_getAction();
    var getBlockNumber_js_1 = require_getBlockNumber();
    var getTransaction_js_1 = require_getTransaction();
    async function getTransactionConfirmations(client, { hash, transactionReceipt }) {
      const [blockNumber, transaction] = await Promise.all([
        (0, getAction_js_1.getAction)(client, getBlockNumber_js_1.getBlockNumber, "getBlockNumber")({}),
        hash ? (0, getAction_js_1.getAction)(client, getTransaction_js_1.getTransaction, "getTransaction")({ hash }) : void 0
      ]);
      const transactionBlockNumber = (transactionReceipt == null ? void 0 : transactionReceipt.blockNumber) || (transaction == null ? void 0 : transaction.blockNumber);
      if (!transactionBlockNumber)
        return 0n;
      return blockNumber - transactionBlockNumber + 1n;
    }
  }
});

// node_modules/viem/_cjs/actions/public/getTransactionReceipt.js
var require_getTransactionReceipt = __commonJS({
  "node_modules/viem/_cjs/actions/public/getTransactionReceipt.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTransactionReceipt = getTransactionReceipt;
    var transaction_js_1 = require_transaction();
    var transactionReceipt_js_1 = require_transactionReceipt();
    async function getTransactionReceipt(client, { hash }) {
      var _a, _b, _c;
      const receipt = await client.request({
        method: "eth_getTransactionReceipt",
        params: [hash]
      }, { dedupe: true });
      if (!receipt)
        throw new transaction_js_1.TransactionReceiptNotFoundError({ hash });
      const format = ((_c = (_b = (_a = client.chain) == null ? void 0 : _a.formatters) == null ? void 0 : _b.transactionReceipt) == null ? void 0 : _c.format) || transactionReceipt_js_1.formatTransactionReceipt;
      return format(receipt);
    }
  }
});

// node_modules/viem/_cjs/actions/public/multicall.js
var require_multicall = __commonJS({
  "node_modules/viem/_cjs/actions/public/multicall.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.multicall = multicall;
    var abis_js_1 = require_abis();
    var abi_js_1 = require_abi();
    var base_js_1 = require_base();
    var contract_js_1 = require_contract();
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var getChainContractAddress_js_1 = require_getChainContractAddress();
    var getContractError_js_1 = require_getContractError();
    var getAction_js_1 = require_getAction();
    var readContract_js_1 = require_readContract();
    async function multicall(client, parameters) {
      var _a;
      const { allowFailure = true, batchSize: batchSize_, blockNumber, blockTag, multicallAddress: multicallAddress_, stateOverride } = parameters;
      const contracts = parameters.contracts;
      const batchSize = batchSize_ ?? (typeof ((_a = client.batch) == null ? void 0 : _a.multicall) === "object" && client.batch.multicall.batchSize || 1024);
      let multicallAddress = multicallAddress_;
      if (!multicallAddress) {
        if (!client.chain)
          throw new Error("client chain not configured. multicallAddress is required.");
        multicallAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
          blockNumber,
          chain: client.chain,
          contract: "multicall3"
        });
      }
      const chunkedCalls = [[]];
      let currentChunk = 0;
      let currentChunkSize = 0;
      for (let i = 0; i < contracts.length; i++) {
        const { abi, address, args, functionName } = contracts[i];
        try {
          const callData = (0, encodeFunctionData_js_1.encodeFunctionData)({ abi, args, functionName });
          currentChunkSize += (callData.length - 2) / 2;
          if (batchSize > 0 && currentChunkSize > batchSize && chunkedCalls[currentChunk].length > 0) {
            currentChunk++;
            currentChunkSize = (callData.length - 2) / 2;
            chunkedCalls[currentChunk] = [];
          }
          chunkedCalls[currentChunk] = [
            ...chunkedCalls[currentChunk],
            {
              allowFailure: true,
              callData,
              target: address
            }
          ];
        } catch (err) {
          const error = (0, getContractError_js_1.getContractError)(err, {
            abi,
            address,
            args,
            docsPath: "/docs/contract/multicall",
            functionName
          });
          if (!allowFailure)
            throw error;
          chunkedCalls[currentChunk] = [
            ...chunkedCalls[currentChunk],
            {
              allowFailure: true,
              callData: "0x",
              target: address
            }
          ];
        }
      }
      const aggregate3Results = await Promise.allSettled(chunkedCalls.map((calls) => (0, getAction_js_1.getAction)(client, readContract_js_1.readContract, "readContract")({
        abi: abis_js_1.multicall3Abi,
        address: multicallAddress,
        args: [calls],
        blockNumber,
        blockTag,
        functionName: "aggregate3",
        stateOverride
      })));
      const results = [];
      for (let i = 0; i < aggregate3Results.length; i++) {
        const result = aggregate3Results[i];
        if (result.status === "rejected") {
          if (!allowFailure)
            throw result.reason;
          for (let j = 0; j < chunkedCalls[i].length; j++) {
            results.push({
              status: "failure",
              error: result.reason,
              result: void 0
            });
          }
          continue;
        }
        const aggregate3Result = result.value;
        for (let j = 0; j < aggregate3Result.length; j++) {
          const { returnData, success } = aggregate3Result[j];
          const { callData } = chunkedCalls[i][j];
          const { abi, address, functionName, args } = contracts[results.length];
          try {
            if (callData === "0x")
              throw new abi_js_1.AbiDecodingZeroDataError();
            if (!success)
              throw new contract_js_1.RawContractError({ data: returnData });
            const result2 = (0, decodeFunctionResult_js_1.decodeFunctionResult)({
              abi,
              args,
              data: returnData,
              functionName
            });
            results.push(allowFailure ? { result: result2, status: "success" } : result2);
          } catch (err) {
            const error = (0, getContractError_js_1.getContractError)(err, {
              abi,
              address,
              args,
              docsPath: "/docs/contract/multicall",
              functionName
            });
            if (!allowFailure)
              throw error;
            results.push({ error, result: void 0, status: "failure" });
          }
        }
      }
      if (results.length !== contracts.length)
        throw new base_js_1.BaseError("multicall results mismatch");
      return results;
    }
  }
});

// node_modules/@noble/curves/abstract/utils.js
var require_utils9 = __commonJS({
  "node_modules/@noble/curves/abstract/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.notImplemented = exports.bitMask = void 0;
    exports.isBytes = isBytes;
    exports.abytes = abytes;
    exports.abool = abool;
    exports.bytesToHex = bytesToHex;
    exports.numberToHexUnpadded = numberToHexUnpadded;
    exports.hexToNumber = hexToNumber;
    exports.hexToBytes = hexToBytes;
    exports.bytesToNumberBE = bytesToNumberBE;
    exports.bytesToNumberLE = bytesToNumberLE;
    exports.numberToBytesBE = numberToBytesBE;
    exports.numberToBytesLE = numberToBytesLE;
    exports.numberToVarBytesBE = numberToVarBytesBE;
    exports.ensureBytes = ensureBytes;
    exports.concatBytes = concatBytes;
    exports.equalBytes = equalBytes;
    exports.utf8ToBytes = utf8ToBytes;
    exports.inRange = inRange;
    exports.aInRange = aInRange;
    exports.bitLen = bitLen;
    exports.bitGet = bitGet;
    exports.bitSet = bitSet;
    exports.createHmacDrbg = createHmacDrbg;
    exports.validateObject = validateObject;
    exports.memoized = memoized;
    var _0n = BigInt(0);
    var _1n = BigInt(1);
    var _2n = BigInt(2);
    function isBytes(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    function abytes(item) {
      if (!isBytes(item))
        throw new Error("Uint8Array expected");
    }
    function abool(title, value) {
      if (typeof value !== "boolean")
        throw new Error(title + " boolean expected, got " + value);
    }
    var hexes = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex(bytes) {
      abytes(bytes);
      let hex = "";
      for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
      }
      return hex;
    }
    function numberToHexUnpadded(num) {
      const hex = num.toString(16);
      return hex.length & 1 ? "0" + hex : hex;
    }
    function hexToNumber(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      return hex === "" ? _0n : BigInt("0x" + hex);
    }
    var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    function asciiToBase16(ch) {
      if (ch >= asciis._0 && ch <= asciis._9)
        return ch - asciis._0;
      if (ch >= asciis.A && ch <= asciis.F)
        return ch - (asciis.A - 10);
      if (ch >= asciis.a && ch <= asciis.f)
        return ch - (asciis.a - 10);
      return;
    }
    function hexToBytes(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      const hl = hex.length;
      const al = hl / 2;
      if (hl % 2)
        throw new Error("hex string expected, got unpadded hex of length " + hl);
      const array = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex[hi] + hex[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
      }
      return array;
    }
    function bytesToNumberBE(bytes) {
      return hexToNumber(bytesToHex(bytes));
    }
    function bytesToNumberLE(bytes) {
      abytes(bytes);
      return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
    }
    function numberToBytesBE(n, len) {
      return hexToBytes(n.toString(16).padStart(len * 2, "0"));
    }
    function numberToBytesLE(n, len) {
      return numberToBytesBE(n, len).reverse();
    }
    function numberToVarBytesBE(n) {
      return hexToBytes(numberToHexUnpadded(n));
    }
    function ensureBytes(title, hex, expectedLength) {
      let res;
      if (typeof hex === "string") {
        try {
          res = hexToBytes(hex);
        } catch (e) {
          throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
        }
      } else if (isBytes(hex)) {
        res = Uint8Array.from(hex);
      } else {
        throw new Error(title + " must be hex string or Uint8Array");
      }
      const len = res.length;
      if (typeof expectedLength === "number" && len !== expectedLength)
        throw new Error(title + " of length " + expectedLength + " expected, got " + len);
      return res;
    }
    function concatBytes(...arrays) {
      let sum = 0;
      for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        abytes(a);
        sum += a.length;
      }
      const res = new Uint8Array(sum);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
      }
      return res;
    }
    function equalBytes(a, b) {
      if (a.length !== b.length)
        return false;
      let diff = 0;
      for (let i = 0; i < a.length; i++)
        diff |= a[i] ^ b[i];
      return diff === 0;
    }
    function utf8ToBytes(str) {
      if (typeof str !== "string")
        throw new Error("string expected");
      return new Uint8Array(new TextEncoder().encode(str));
    }
    var isPosBig = (n) => typeof n === "bigint" && _0n <= n;
    function inRange(n, min, max) {
      return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
    }
    function aInRange(title, n, min, max) {
      if (!inRange(n, min, max))
        throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
    }
    function bitLen(n) {
      let len;
      for (len = 0; n > _0n; n >>= _1n, len += 1)
        ;
      return len;
    }
    function bitGet(n, pos) {
      return n >> BigInt(pos) & _1n;
    }
    function bitSet(n, pos, value) {
      return n | (value ? _1n : _0n) << BigInt(pos);
    }
    var bitMask = (n) => (_2n << BigInt(n - 1)) - _1n;
    exports.bitMask = bitMask;
    var u8n = (data) => new Uint8Array(data);
    var u8fr = (arr) => Uint8Array.from(arr);
    function createHmacDrbg(hashLen, qByteLen, hmacFn) {
      if (typeof hashLen !== "number" || hashLen < 2)
        throw new Error("hashLen must be a number");
      if (typeof qByteLen !== "number" || qByteLen < 2)
        throw new Error("qByteLen must be a number");
      if (typeof hmacFn !== "function")
        throw new Error("hmacFn must be a function");
      let v = u8n(hashLen);
      let k = u8n(hashLen);
      let i = 0;
      const reset = () => {
        v.fill(1);
        k.fill(0);
        i = 0;
      };
      const h = (...b) => hmacFn(k, v, ...b);
      const reseed = (seed = u8n()) => {
        k = h(u8fr([0]), seed);
        v = h();
        if (seed.length === 0)
          return;
        k = h(u8fr([1]), seed);
        v = h();
      };
      const gen = () => {
        if (i++ >= 1e3)
          throw new Error("drbg: tried 1000 values");
        let len = 0;
        const out = [];
        while (len < qByteLen) {
          v = h();
          const sl = v.slice();
          out.push(sl);
          len += v.length;
        }
        return concatBytes(...out);
      };
      const genUntil = (seed, pred) => {
        reset();
        reseed(seed);
        let res = void 0;
        while (!(res = pred(gen())))
          reseed();
        reset();
        return res;
      };
      return genUntil;
    }
    var validatorFns = {
      bigint: (val) => typeof val === "bigint",
      function: (val) => typeof val === "function",
      boolean: (val) => typeof val === "boolean",
      string: (val) => typeof val === "string",
      stringOrUint8Array: (val) => typeof val === "string" || isBytes(val),
      isSafeInteger: (val) => Number.isSafeInteger(val),
      array: (val) => Array.isArray(val),
      field: (val, object) => object.Fp.isValid(val),
      hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
    };
    function validateObject(object, validators, optValidators = {}) {
      const checkField = (fieldName, type, isOptional) => {
        const checkVal = validatorFns[type];
        if (typeof checkVal !== "function")
          throw new Error("invalid validator function");
        const val = object[fieldName];
        if (isOptional && val === void 0)
          return;
        if (!checkVal(val, object)) {
          throw new Error("param " + String(fieldName) + " is invalid. Expected " + type + ", got " + val);
        }
      };
      for (const [fieldName, type] of Object.entries(validators))
        checkField(fieldName, type, false);
      for (const [fieldName, type] of Object.entries(optValidators))
        checkField(fieldName, type, true);
      return object;
    }
    var notImplemented = () => {
      throw new Error("not implemented");
    };
    exports.notImplemented = notImplemented;
    function memoized(fn) {
      const map = /* @__PURE__ */ new WeakMap();
      return (arg, ...args) => {
        const val = map.get(arg);
        if (val !== void 0)
          return val;
        const computed = fn(arg, ...args);
        map.set(arg, computed);
        return computed;
      };
    }
  }
});

// node_modules/ox/_cjs/core/version.js
var require_version4 = __commonJS({
  "node_modules/ox/_cjs/core/version.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "0.1.1";
  }
});

// node_modules/ox/_cjs/core/internal/errors.js
var require_errors3 = __commonJS({
  "node_modules/ox/_cjs/core/internal/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getUrl = getUrl;
    exports.getVersion = getVersion;
    exports.prettyPrint = prettyPrint;
    var version_js_1 = require_version4();
    function getUrl(url) {
      return url;
    }
    function getVersion() {
      return version_js_1.version;
    }
    function prettyPrint(args) {
      if (!args)
        return "";
      const entries = Object.entries(args).map(([key, value]) => {
        if (value === void 0 || value === false)
          return null;
        return [key, value];
      }).filter(Boolean);
      const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
      return entries.map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`).join("\n");
    }
  }
});

// node_modules/ox/_cjs/core/Errors.js
var require_Errors = __commonJS({
  "node_modules/ox/_cjs/core/Errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseError = void 0;
    var errors_js_1 = require_errors3();
    var BaseError = class _BaseError extends Error {
      constructor(shortMessage, options = {}) {
        const details = (() => {
          var _a;
          if (options.cause instanceof _BaseError) {
            if (options.cause.details)
              return options.cause.details;
            if (options.cause.shortMessage)
              return options.cause.shortMessage;
          }
          if ((_a = options.cause) == null ? void 0 : _a.message)
            return options.cause.message;
          return options.details;
        })();
        const docsPath = (() => {
          if (options.cause instanceof _BaseError)
            return options.cause.docsPath || options.docsPath;
          return options.docsPath;
        })();
        const docsBaseUrl = "https://oxlib.sh";
        const docs = `${docsBaseUrl}${docsPath ?? ""}`;
        const message = [
          shortMessage || "An error occurred.",
          ...options.metaMessages ? ["", ...options.metaMessages] : [],
          ...details || docsPath ? [
            "",
            details ? `Details: ${details}` : void 0,
            docsPath ? `See: ${docs}` : void 0
          ] : []
        ].filter((x) => typeof x === "string").join("\n");
        super(message, options.cause ? { cause: options.cause } : void 0);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "BaseError"
        });
        Object.defineProperty(this, "version", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: `ox@${(0, errors_js_1.getVersion)()}`
        });
        this.cause = options.cause;
        this.details = details;
        this.docs = docs;
        this.docsPath = docsPath;
        this.shortMessage = shortMessage;
      }
      walk(fn) {
        return walk(this, fn);
      }
    };
    exports.BaseError = BaseError;
    function walk(err, fn) {
      if (fn == null ? void 0 : fn(err))
        return err;
      if (err && typeof err === "object" && "cause" in err && err.cause)
        return walk(err.cause, fn);
      return fn ? null : err;
    }
  }
});

// node_modules/ox/_cjs/core/Json.js
var require_Json = __commonJS({
  "node_modules/ox/_cjs/core/Json.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = parse;
    exports.stringify = stringify;
    var bigIntSuffix = "#__bigint";
    function parse(string, reviver) {
      return JSON.parse(string, (key, value_) => {
        const value = value_;
        if (typeof value === "string" && value.endsWith(bigIntSuffix))
          return BigInt(value.slice(0, -bigIntSuffix.length));
        return typeof reviver === "function" ? reviver(key, value) : value;
      });
    }
    function stringify(value, replacer, space) {
      return JSON.stringify(value, (key, value2) => {
        if (typeof replacer === "function")
          return replacer(key, value2);
        if (typeof value2 === "bigint")
          return value2.toString() + bigIntSuffix;
        return value2;
      }, space);
    }
  }
});

// node_modules/ox/_cjs/core/internal/bytes.js
var require_bytes2 = __commonJS({
  "node_modules/ox/_cjs/core/internal/bytes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.charCodeMap = void 0;
    exports.assertSize = assertSize;
    exports.assertStartOffset = assertStartOffset;
    exports.assertEndOffset = assertEndOffset;
    exports.charCodeToBase16 = charCodeToBase16;
    exports.pad = pad;
    exports.trim = trim;
    var Bytes = require_Bytes();
    function assertSize(bytes, size_) {
      if (Bytes.size(bytes) > size_)
        throw new Bytes.SizeOverflowError({
          givenSize: Bytes.size(bytes),
          maxSize: size_
        });
    }
    function assertStartOffset(value, start) {
      if (typeof start === "number" && start > 0 && start > Bytes.size(value) - 1)
        throw new Bytes.SliceOffsetOutOfBoundsError({
          offset: start,
          position: "start",
          size: Bytes.size(value)
        });
    }
    function assertEndOffset(value, start, end) {
      if (typeof start === "number" && typeof end === "number" && Bytes.size(value) !== end - start) {
        throw new Bytes.SliceOffsetOutOfBoundsError({
          offset: end,
          position: "end",
          size: Bytes.size(value)
        });
      }
    }
    exports.charCodeMap = {
      zero: 48,
      nine: 57,
      A: 65,
      F: 70,
      a: 97,
      f: 102
    };
    function charCodeToBase16(char) {
      if (char >= exports.charCodeMap.zero && char <= exports.charCodeMap.nine)
        return char - exports.charCodeMap.zero;
      if (char >= exports.charCodeMap.A && char <= exports.charCodeMap.F)
        return char - (exports.charCodeMap.A - 10);
      if (char >= exports.charCodeMap.a && char <= exports.charCodeMap.f)
        return char - (exports.charCodeMap.a - 10);
      return void 0;
    }
    function pad(bytes, options = {}) {
      const { dir, size = 32 } = options;
      if (size === 0)
        return bytes;
      if (bytes.length > size)
        throw new Bytes.SizeExceedsPaddingSizeError({
          size: bytes.length,
          targetSize: size,
          type: "Bytes"
        });
      const paddedBytes = new Uint8Array(size);
      for (let i = 0; i < size; i++) {
        const padEnd = dir === "right";
        paddedBytes[padEnd ? i : size - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
      }
      return paddedBytes;
    }
    function trim(value, options = {}) {
      const { dir = "left" } = options;
      let data = value;
      let sliceLength = 0;
      for (let i = 0; i < data.length - 1; i++) {
        if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
          sliceLength++;
        else
          break;
      }
      data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
      return data;
    }
  }
});

// node_modules/ox/_cjs/core/internal/hex.js
var require_hex = __commonJS({
  "node_modules/ox/_cjs/core/internal/hex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertSize = assertSize;
    exports.assertStartOffset = assertStartOffset;
    exports.assertEndOffset = assertEndOffset;
    exports.pad = pad;
    exports.trim = trim;
    var Hex = require_Hex();
    function assertSize(hex, size_) {
      if (Hex.size(hex) > size_)
        throw new Hex.SizeOverflowError({
          givenSize: Hex.size(hex),
          maxSize: size_
        });
    }
    function assertStartOffset(value, start) {
      if (typeof start === "number" && start > 0 && start > Hex.size(value) - 1)
        throw new Hex.SliceOffsetOutOfBoundsError({
          offset: start,
          position: "start",
          size: Hex.size(value)
        });
    }
    function assertEndOffset(value, start, end) {
      if (typeof start === "number" && typeof end === "number" && Hex.size(value) !== end - start) {
        throw new Hex.SliceOffsetOutOfBoundsError({
          offset: end,
          position: "end",
          size: Hex.size(value)
        });
      }
    }
    function pad(hex_, options = {}) {
      const { dir, size = 32 } = options;
      if (size === 0)
        return hex_;
      const hex = hex_.replace("0x", "");
      if (hex.length > size * 2)
        throw new Hex.SizeExceedsPaddingSizeError({
          size: Math.ceil(hex.length / 2),
          targetSize: size,
          type: "Hex"
        });
      return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size * 2, "0")}`;
    }
    function trim(value, options = {}) {
      const { dir = "left" } = options;
      let data = value.replace("0x", "");
      let sliceLength = 0;
      for (let i = 0; i < data.length - 1; i++) {
        if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
          sliceLength++;
        else
          break;
      }
      data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
      if (data === "0")
        return "0x";
      if (dir === "right" && data.length % 2 === 1)
        return `0x${data}0`;
      return `0x${data}`;
    }
  }
});

// node_modules/ox/_cjs/core/Bytes.js
var require_Bytes = __commonJS({
  "node_modules/ox/_cjs/core/Bytes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SizeExceedsPaddingSizeError = exports.SliceOffsetOutOfBoundsError = exports.SizeOverflowError = exports.InvalidBytesTypeError = exports.InvalidBytesBooleanError = void 0;
    exports.assert = assert;
    exports.concat = concat;
    exports.from = from;
    exports.fromArray = fromArray;
    exports.fromBoolean = fromBoolean;
    exports.fromHex = fromHex;
    exports.fromNumber = fromNumber;
    exports.fromString = fromString;
    exports.isEqual = isEqual;
    exports.padLeft = padLeft;
    exports.padRight = padRight;
    exports.random = random;
    exports.size = size;
    exports.slice = slice;
    exports.toBigInt = toBigInt;
    exports.toBoolean = toBoolean;
    exports.toHex = toHex;
    exports.toNumber = toNumber;
    exports.toString = toString;
    exports.trimLeft = trimLeft;
    exports.trimRight = trimRight;
    exports.validate = validate;
    var utils_1 = require_utils9();
    var Errors = require_Errors();
    var Hex = require_Hex();
    var Json = require_Json();
    var internal = require_bytes2();
    var internal_hex = require_hex();
    var decoder = new TextDecoder();
    var encoder = new TextEncoder();
    function assert(value) {
      if (value instanceof Uint8Array)
        return;
      if (!value)
        throw new InvalidBytesTypeError(value);
      if (typeof value !== "object")
        throw new InvalidBytesTypeError(value);
      if (!("BYTES_PER_ELEMENT" in value))
        throw new InvalidBytesTypeError(value);
      if (value.BYTES_PER_ELEMENT !== 1 || value.constructor.name !== "Uint8Array")
        throw new InvalidBytesTypeError(value);
    }
    function concat(...values) {
      let length = 0;
      for (const arr of values) {
        length += arr.length;
      }
      const result = new Uint8Array(length);
      for (let i = 0, index = 0; i < values.length; i++) {
        const arr = values[i];
        result.set(arr, index);
        index += arr.length;
      }
      return result;
    }
    function from(value) {
      if (value instanceof Uint8Array)
        return value;
      if (typeof value === "string")
        return fromHex(value);
      return fromArray(value);
    }
    function fromArray(value) {
      return value instanceof Uint8Array ? value : new Uint8Array(value);
    }
    function fromBoolean(value, options = {}) {
      const { size: size2 } = options;
      const bytes = new Uint8Array(1);
      bytes[0] = Number(value);
      if (typeof size2 === "number") {
        internal.assertSize(bytes, size2);
        return padLeft(bytes, size2);
      }
      return bytes;
    }
    function fromHex(value, options = {}) {
      const { size: size2 } = options;
      let hex = value;
      if (size2) {
        internal_hex.assertSize(value, size2);
        hex = Hex.padRight(value, size2);
      }
      let hexString = hex.slice(2);
      if (hexString.length % 2)
        hexString = `0${hexString}`;
      const length = hexString.length / 2;
      const bytes = new Uint8Array(length);
      for (let index = 0, j = 0; index < length; index++) {
        const nibbleLeft = internal.charCodeToBase16(hexString.charCodeAt(j++));
        const nibbleRight = internal.charCodeToBase16(hexString.charCodeAt(j++));
        if (nibbleLeft === void 0 || nibbleRight === void 0) {
          throw new Errors.BaseError(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
        }
        bytes[index] = nibbleLeft * 16 + nibbleRight;
      }
      return bytes;
    }
    function fromNumber(value, options) {
      const hex = Hex.fromNumber(value, options);
      return fromHex(hex);
    }
    function fromString(value, options = {}) {
      const { size: size2 } = options;
      const bytes = encoder.encode(value);
      if (typeof size2 === "number") {
        internal.assertSize(bytes, size2);
        return padRight(bytes, size2);
      }
      return bytes;
    }
    function isEqual(bytesA, bytesB) {
      return (0, utils_1.equalBytes)(bytesA, bytesB);
    }
    function padLeft(value, size2) {
      return internal.pad(value, { dir: "left", size: size2 });
    }
    function padRight(value, size2) {
      return internal.pad(value, { dir: "right", size: size2 });
    }
    function random(length) {
      return crypto.getRandomValues(new Uint8Array(length));
    }
    function size(value) {
      return value.length;
    }
    function slice(value, start, end, options = {}) {
      const { strict } = options;
      internal.assertStartOffset(value, start);
      const value_ = value.slice(start, end);
      if (strict)
        internal.assertEndOffset(value_, start, end);
      return value_;
    }
    function toBigInt(bytes, options = {}) {
      const { size: size2 } = options;
      if (typeof size2 !== "undefined")
        internal.assertSize(bytes, size2);
      const hex = Hex.fromBytes(bytes, options);
      return Hex.toBigInt(hex, options);
    }
    function toBoolean(bytes, options = {}) {
      const { size: size2 } = options;
      let bytes_ = bytes;
      if (typeof size2 !== "undefined") {
        internal.assertSize(bytes_, size2);
        bytes_ = trimLeft(bytes_);
      }
      if (bytes_.length > 1 || bytes_[0] > 1)
        throw new InvalidBytesBooleanError(bytes_);
      return Boolean(bytes_[0]);
    }
    function toHex(value, options = {}) {
      return Hex.fromBytes(value, options);
    }
    function toNumber(bytes, options = {}) {
      const { size: size2 } = options;
      if (typeof size2 !== "undefined")
        internal.assertSize(bytes, size2);
      const hex = Hex.fromBytes(bytes, options);
      return Hex.toNumber(hex, options);
    }
    function toString(bytes, options = {}) {
      const { size: size2 } = options;
      let bytes_ = bytes;
      if (typeof size2 !== "undefined") {
        internal.assertSize(bytes_, size2);
        bytes_ = trimRight(bytes_);
      }
      return decoder.decode(bytes_);
    }
    function trimLeft(value) {
      return internal.trim(value, { dir: "left" });
    }
    function trimRight(value) {
      return internal.trim(value, { dir: "right" });
    }
    function validate(value) {
      try {
        assert(value);
        return true;
      } catch {
        return false;
      }
    }
    var InvalidBytesBooleanError = class extends Errors.BaseError {
      constructor(bytes) {
        super(`Bytes value \`${bytes}\` is not a valid boolean.`, {
          metaMessages: [
            "The bytes array must contain a single byte of either a `0` or `1` value."
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Bytes.InvalidBytesBooleanError"
        });
      }
    };
    exports.InvalidBytesBooleanError = InvalidBytesBooleanError;
    var InvalidBytesTypeError = class extends Errors.BaseError {
      constructor(value) {
        super(`Value \`${typeof value === "object" ? Json.stringify(value) : value}\` of type \`${typeof value}\` is an invalid Bytes value.`, {
          metaMessages: ["Bytes values must be of type `Bytes`."]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Bytes.InvalidBytesTypeError"
        });
      }
    };
    exports.InvalidBytesTypeError = InvalidBytesTypeError;
    var SizeOverflowError = class extends Errors.BaseError {
      constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Bytes.SizeOverflowError"
        });
      }
    };
    exports.SizeOverflowError = SizeOverflowError;
    var SliceOffsetOutOfBoundsError = class extends Errors.BaseError {
      constructor({ offset, position, size: size2 }) {
        super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size2}\`).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Bytes.SliceOffsetOutOfBoundsError"
        });
      }
    };
    exports.SliceOffsetOutOfBoundsError = SliceOffsetOutOfBoundsError;
    var SizeExceedsPaddingSizeError = class extends Errors.BaseError {
      constructor({ size: size2, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size2}\`) exceeds padding size (\`${targetSize}\`).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Bytes.SizeExceedsPaddingSizeError"
        });
      }
    };
    exports.SizeExceedsPaddingSizeError = SizeExceedsPaddingSizeError;
  }
});

// node_modules/ox/_cjs/core/Hex.js
var require_Hex = __commonJS({
  "node_modules/ox/_cjs/core/Hex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SizeExceedsPaddingSizeError = exports.SliceOffsetOutOfBoundsError = exports.SizeOverflowError = exports.InvalidLengthError = exports.InvalidHexValueError = exports.InvalidHexTypeError = exports.InvalidHexBooleanError = exports.IntegerOutOfRangeError = void 0;
    exports.assert = assert;
    exports.concat = concat;
    exports.from = from;
    exports.fromBoolean = fromBoolean;
    exports.fromBytes = fromBytes;
    exports.fromNumber = fromNumber;
    exports.fromString = fromString;
    exports.isEqual = isEqual;
    exports.padLeft = padLeft;
    exports.padRight = padRight;
    exports.random = random;
    exports.slice = slice;
    exports.size = size;
    exports.trimLeft = trimLeft;
    exports.trimRight = trimRight;
    exports.toBigInt = toBigInt;
    exports.toBoolean = toBoolean;
    exports.toBytes = toBytes;
    exports.toNumber = toNumber;
    exports.toString = toString;
    exports.validate = validate;
    var utils_1 = require_utils9();
    var Bytes = require_Bytes();
    var Errors = require_Errors();
    var Json = require_Json();
    var internal_bytes = require_bytes2();
    var internal = require_hex();
    var encoder = new TextEncoder();
    var hexes = Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
    function assert(value, options = {}) {
      const { strict = false } = options;
      if (!value)
        throw new InvalidHexTypeError(value);
      if (typeof value !== "string")
        throw new InvalidHexTypeError(value);
      if (strict) {
        if (!/^0x[0-9a-fA-F]*$/.test(value))
          throw new InvalidHexValueError(value);
      }
      if (!value.startsWith("0x"))
        throw new InvalidHexValueError(value);
    }
    function concat(...values) {
      return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
    }
    function from(value) {
      if (value instanceof Uint8Array)
        return fromBytes(value);
      if (Array.isArray(value))
        return fromBytes(new Uint8Array(value));
      return value;
    }
    function fromBoolean(value, options = {}) {
      const hex = `0x${Number(value)}`;
      if (typeof options.size === "number") {
        internal.assertSize(hex, options.size);
        return padLeft(hex, options.size);
      }
      return hex;
    }
    function fromBytes(value, options = {}) {
      let string = "";
      for (let i = 0; i < value.length; i++)
        string += hexes[value[i]];
      const hex = `0x${string}`;
      if (typeof options.size === "number") {
        internal.assertSize(hex, options.size);
        return padRight(hex, options.size);
      }
      return hex;
    }
    function fromNumber(value, options = {}) {
      const { signed, size: size2 } = options;
      const value_ = BigInt(value);
      let maxValue;
      if (size2) {
        if (signed)
          maxValue = (1n << BigInt(size2) * 8n - 1n) - 1n;
        else
          maxValue = 2n ** (BigInt(size2) * 8n) - 1n;
      } else if (typeof value === "number") {
        maxValue = BigInt(Number.MAX_SAFE_INTEGER);
      }
      const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
      if (maxValue && value_ > maxValue || value_ < minValue) {
        const suffix = typeof value === "bigint" ? "n" : "";
        throw new IntegerOutOfRangeError({
          max: maxValue ? `${maxValue}${suffix}` : void 0,
          min: `${minValue}${suffix}`,
          signed,
          size: size2,
          value: `${value}${suffix}`
        });
      }
      const stringValue = (signed && value_ < 0 ? (1n << BigInt(size2 * 8)) + BigInt(value_) : value_).toString(16);
      const hex = `0x${stringValue}`;
      if (size2)
        return padLeft(hex, size2);
      return hex;
    }
    function fromString(value, options = {}) {
      return fromBytes(encoder.encode(value), options);
    }
    function isEqual(hexA, hexB) {
      return (0, utils_1.equalBytes)(Bytes.fromHex(hexA), Bytes.fromHex(hexB));
    }
    function padLeft(value, size2) {
      return internal.pad(value, { dir: "left", size: size2 });
    }
    function padRight(value, size2) {
      return internal.pad(value, { dir: "right", size: size2 });
    }
    function random(length) {
      return fromBytes(Bytes.random(length));
    }
    function slice(value, start, end, options = {}) {
      const { strict } = options;
      internal.assertStartOffset(value, start);
      const value_ = `0x${value.replace("0x", "").slice((start ?? 0) * 2, (end ?? value.length) * 2)}`;
      if (strict)
        internal.assertEndOffset(value_, start, end);
      return value_;
    }
    function size(value) {
      return Math.ceil((value.length - 2) / 2);
    }
    function trimLeft(value) {
      return internal.trim(value, { dir: "left" });
    }
    function trimRight(value) {
      return internal.trim(value, { dir: "right" });
    }
    function toBigInt(hex, options = {}) {
      const { signed } = options;
      if (options.size)
        internal.assertSize(hex, options.size);
      const value = BigInt(hex);
      if (!signed)
        return value;
      const size2 = (hex.length - 2) / 2;
      const max_unsigned = (1n << BigInt(size2) * 8n) - 1n;
      const max_signed = max_unsigned >> 1n;
      if (value <= max_signed)
        return value;
      return value - max_unsigned - 1n;
    }
    function toBoolean(hex, options = {}) {
      if (options.size)
        internal.assertSize(hex, options.size);
      const hex_ = trimLeft(hex);
      if (hex_ === "0x")
        return false;
      if (hex_ === "0x1")
        return true;
      throw new InvalidHexBooleanError(hex);
    }
    function toBytes(hex, options = {}) {
      return Bytes.fromHex(hex, options);
    }
    function toNumber(hex, options = {}) {
      const { signed, size: size2 } = options;
      if (!signed && !size2)
        return Number(hex);
      return Number(toBigInt(hex, options));
    }
    function toString(hex, options = {}) {
      const { size: size2 } = options;
      let bytes = Bytes.fromHex(hex);
      if (size2) {
        internal_bytes.assertSize(bytes, size2);
        bytes = Bytes.trimRight(bytes);
      }
      return new TextDecoder().decode(bytes);
    }
    function validate(value, options = {}) {
      const { strict = false } = options;
      try {
        assert(value, { strict });
        return true;
      } catch {
        return false;
      }
    }
    var IntegerOutOfRangeError = class extends Errors.BaseError {
      constructor({ max, min, signed, size: size2, value }) {
        super(`Number \`${value}\` is not in safe${size2 ? ` ${size2 * 8}-bit` : ""}${signed ? " signed" : " unsigned"} integer range ${max ? `(\`${min}\` to \`${max}\`)` : `(above \`${min}\`)`}`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.IntegerOutOfRangeError"
        });
      }
    };
    exports.IntegerOutOfRangeError = IntegerOutOfRangeError;
    var InvalidHexBooleanError = class extends Errors.BaseError {
      constructor(hex) {
        super(`Hex value \`"${hex}"\` is not a valid boolean.`, {
          metaMessages: [
            'The hex value must be `"0x0"` (false) or `"0x1"` (true).'
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.InvalidHexBooleanError"
        });
      }
    };
    exports.InvalidHexBooleanError = InvalidHexBooleanError;
    var InvalidHexTypeError = class extends Errors.BaseError {
      constructor(value) {
        super(`Value \`${typeof value === "object" ? Json.stringify(value) : value}\` of type \`${typeof value}\` is an invalid hex type.`, {
          metaMessages: ['Hex types must be represented as `"0x${string}"`.']
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.InvalidHexTypeError"
        });
      }
    };
    exports.InvalidHexTypeError = InvalidHexTypeError;
    var InvalidHexValueError = class extends Errors.BaseError {
      constructor(value) {
        super(`Value \`${value}\` is an invalid hex value.`, {
          metaMessages: [
            'Hex values must start with `"0x"` and contain only hexadecimal characters (0-9, a-f, A-F).'
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.InvalidHexValueError"
        });
      }
    };
    exports.InvalidHexValueError = InvalidHexValueError;
    var InvalidLengthError = class extends Errors.BaseError {
      constructor(value) {
        super(`Hex value \`"${value}"\` is an odd length (${value.length - 2} nibbles).`, {
          metaMessages: ["It must be an even length."]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.InvalidLengthError"
        });
      }
    };
    exports.InvalidLengthError = InvalidLengthError;
    var SizeOverflowError = class extends Errors.BaseError {
      constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.SizeOverflowError"
        });
      }
    };
    exports.SizeOverflowError = SizeOverflowError;
    var SliceOffsetOutOfBoundsError = class extends Errors.BaseError {
      constructor({ offset, position, size: size2 }) {
        super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size2}\`).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.SliceOffsetOutOfBoundsError"
        });
      }
    };
    exports.SliceOffsetOutOfBoundsError = SliceOffsetOutOfBoundsError;
    var SizeExceedsPaddingSizeError = class extends Errors.BaseError {
      constructor({ size: size2, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size2}\`) exceeds padding size (\`${targetSize}\`).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.SizeExceedsPaddingSizeError"
        });
      }
    };
    exports.SizeExceedsPaddingSizeError = SizeExceedsPaddingSizeError;
  }
});

// node_modules/ox/_cjs/core/Withdrawal.js
var require_Withdrawal = __commonJS({
  "node_modules/ox/_cjs/core/Withdrawal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromRpc = fromRpc;
    exports.toRpc = toRpc;
    var Hex = require_Hex();
    function fromRpc(withdrawal) {
      return {
        ...withdrawal,
        amount: BigInt(withdrawal.amount),
        index: Number(withdrawal.index),
        validatorIndex: Number(withdrawal.validatorIndex)
      };
    }
    function toRpc(withdrawal) {
      return {
        address: withdrawal.address,
        amount: Hex.fromNumber(withdrawal.amount),
        index: Hex.fromNumber(withdrawal.index),
        validatorIndex: Hex.fromNumber(withdrawal.validatorIndex)
      };
    }
  }
});

// node_modules/ox/_cjs/core/BlockOverrides.js
var require_BlockOverrides = __commonJS({
  "node_modules/ox/_cjs/core/BlockOverrides.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromRpc = fromRpc;
    exports.toRpc = toRpc;
    var Hex = require_Hex();
    var Withdrawal = require_Withdrawal();
    function fromRpc(rpcBlockOverrides) {
      return {
        ...rpcBlockOverrides.baseFeePerGas && {
          baseFeePerGas: BigInt(rpcBlockOverrides.baseFeePerGas)
        },
        ...rpcBlockOverrides.blobBaseFee && {
          blobBaseFee: BigInt(rpcBlockOverrides.blobBaseFee)
        },
        ...rpcBlockOverrides.feeRecipient && {
          feeRecipient: rpcBlockOverrides.feeRecipient
        },
        ...rpcBlockOverrides.gasLimit && {
          gasLimit: BigInt(rpcBlockOverrides.gasLimit)
        },
        ...rpcBlockOverrides.number && {
          number: BigInt(rpcBlockOverrides.number)
        },
        ...rpcBlockOverrides.prevRandao && {
          prevRandao: BigInt(rpcBlockOverrides.prevRandao)
        },
        ...rpcBlockOverrides.time && {
          time: BigInt(rpcBlockOverrides.time)
        },
        ...rpcBlockOverrides.withdrawals && {
          withdrawals: rpcBlockOverrides.withdrawals.map(Withdrawal.fromRpc)
        }
      };
    }
    function toRpc(blockOverrides) {
      return {
        ...typeof blockOverrides.baseFeePerGas === "bigint" && {
          baseFeePerGas: Hex.fromNumber(blockOverrides.baseFeePerGas)
        },
        ...typeof blockOverrides.blobBaseFee === "bigint" && {
          blobBaseFee: Hex.fromNumber(blockOverrides.blobBaseFee)
        },
        ...typeof blockOverrides.feeRecipient === "string" && {
          feeRecipient: blockOverrides.feeRecipient
        },
        ...typeof blockOverrides.gasLimit === "bigint" && {
          gasLimit: Hex.fromNumber(blockOverrides.gasLimit)
        },
        ...typeof blockOverrides.number === "bigint" && {
          number: Hex.fromNumber(blockOverrides.number)
        },
        ...typeof blockOverrides.prevRandao === "bigint" && {
          prevRandao: Hex.fromNumber(blockOverrides.prevRandao)
        },
        ...typeof blockOverrides.time === "bigint" && {
          time: Hex.fromNumber(blockOverrides.time)
        },
        ...blockOverrides.withdrawals && {
          withdrawals: blockOverrides.withdrawals.map(Withdrawal.toRpc)
        }
      };
    }
  }
});

// node_modules/viem/_cjs/actions/public/simulate.js
var require_simulate = __commonJS({
  "node_modules/viem/_cjs/actions/public/simulate.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.simulate = simulate;
    var BlockOverrides = require_BlockOverrides();
    var parseAccount_js_1 = require_parseAccount();
    var abi_js_1 = require_abi();
    var contract_js_1 = require_contract();
    var node_js_1 = require_node();
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    var toHex_js_1 = require_toHex();
    var getContractError_js_1 = require_getContractError();
    var getNodeError_js_1 = require_getNodeError();
    var block_js_1 = require_block2();
    var log_js_1 = require_log2();
    var transactionRequest_js_1 = require_transactionRequest();
    var stateOverride_js_1 = require_stateOverride2();
    var assertRequest_js_1 = require_assertRequest();
    async function simulate(client, parameters) {
      const { blockNumber, blockTag = "latest", blocks, returnFullTransactions, traceTransfers, validation } = parameters;
      try {
        const blockStateCalls = [];
        for (const block2 of blocks) {
          const blockOverrides = block2.blockOverrides ? BlockOverrides.toRpc(block2.blockOverrides) : void 0;
          const calls = block2.calls.map((call_) => {
            const call = call_;
            const account = call.account ? (0, parseAccount_js_1.parseAccount)(call.account) : void 0;
            const request = {
              ...call,
              data: call.abi ? (0, encodeFunctionData_js_1.encodeFunctionData)(call) : call.data,
              from: call.from ?? (account == null ? void 0 : account.address)
            };
            (0, assertRequest_js_1.assertRequest)(request);
            return (0, transactionRequest_js_1.formatTransactionRequest)(request);
          });
          const stateOverrides = block2.stateOverrides ? (0, stateOverride_js_1.serializeStateOverride)(block2.stateOverrides) : void 0;
          blockStateCalls.push({
            blockOverrides,
            calls,
            stateOverrides
          });
        }
        const blockNumberHex = blockNumber ? (0, toHex_js_1.numberToHex)(blockNumber) : void 0;
        const block = blockNumberHex || blockTag;
        const result = await client.request({
          method: "eth_simulateV1",
          params: [
            { blockStateCalls, returnFullTransactions, traceTransfers, validation },
            block
          ]
        });
        return result.map((block2, i) => ({
          ...(0, block_js_1.formatBlock)(block2),
          calls: block2.calls.map((call, j) => {
            var _a, _b;
            const { abi, args, functionName, to } = blocks[i].calls[j];
            const data = ((_a = call.error) == null ? void 0 : _a.data) ?? call.returnData;
            const gasUsed = BigInt(call.gasUsed);
            const logs = (_b = call.logs) == null ? void 0 : _b.map((log) => (0, log_js_1.formatLog)(log));
            const status = call.status === "0x1" ? "success" : "failure";
            const result2 = abi ? (0, decodeFunctionResult_js_1.decodeFunctionResult)({
              abi,
              data,
              functionName
            }) : null;
            const error = (() => {
              var _a2;
              if (status === "success")
                return void 0;
              let error2 = void 0;
              if (((_a2 = call.error) == null ? void 0 : _a2.data) === "0x")
                error2 = new abi_js_1.AbiDecodingZeroDataError();
              else if (call.error)
                error2 = new contract_js_1.RawContractError(call.error);
              if (!error2)
                return void 0;
              return (0, getContractError_js_1.getContractError)(error2, {
                abi: abi ?? [],
                address: to,
                args,
                functionName: functionName ?? "<unknown>"
              });
            })();
            return {
              data,
              gasUsed,
              logs,
              status,
              ...status === "success" ? {
                result: result2
              } : {
                error
              }
            };
          })
        }));
      } catch (e) {
        const cause = e;
        const error = (0, getNodeError_js_1.getNodeError)(cause, {});
        if (error instanceof node_js_1.UnknownNodeError)
          throw cause;
        throw error;
      }
    }
  }
});

// node_modules/viem/_cjs/utils/signature/serializeSignature.js
var require_serializeSignature = __commonJS({
  "node_modules/viem/_cjs/utils/signature/serializeSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serializeSignature = serializeSignature;
    var secp256k1_1 = require_secp256k1();
    var fromHex_js_1 = require_fromHex();
    var toBytes_js_1 = require_toBytes();
    function serializeSignature({ r, s, to = "hex", v, yParity }) {
      const yParity_ = (() => {
        if (yParity === 0 || yParity === 1)
          return yParity;
        if (v && (v === 27n || v === 28n || v >= 35n))
          return v % 2n === 0n ? 1 : 0;
        throw new Error("Invalid `v` or `yParity` value");
      })();
      const signature = `0x${new secp256k1_1.secp256k1.Signature((0, fromHex_js_1.hexToBigInt)(r), (0, fromHex_js_1.hexToBigInt)(s)).toCompactHex()}${yParity_ === 0 ? "1b" : "1c"}`;
      if (to === "hex")
        return signature;
      return (0, toBytes_js_1.hexToBytes)(signature);
    }
  }
});

// node_modules/viem/_cjs/actions/public/verifyHash.js
var require_verifyHash2 = __commonJS({
  "node_modules/viem/_cjs/actions/public/verifyHash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifyHash = verifyHash;
    var abis_js_1 = require_abis();
    var contracts_js_1 = require_contracts();
    var contract_js_1 = require_contract();
    var encodeDeployData_js_1 = require_encodeDeployData();
    var getAddress_js_1 = require_getAddress();
    var isAddressEqual_js_1 = require_isAddressEqual();
    var isHex_js_1 = require_isHex();
    var toHex_js_1 = require_toHex();
    var getAction_js_1 = require_getAction();
    var index_js_1 = require_utils8();
    var isErc6492Signature_js_1 = require_isErc6492Signature();
    var recoverAddress_js_1 = require_recoverAddress();
    var serializeErc6492Signature_js_1 = require_serializeErc6492Signature();
    var serializeSignature_js_1 = require_serializeSignature();
    var call_js_1 = require_call();
    async function verifyHash(client, parameters) {
      var _a, _b, _c;
      const { address, factory, factoryData, hash, signature, universalSignatureVerifierAddress = (_c = (_b = (_a = client.chain) == null ? void 0 : _a.contracts) == null ? void 0 : _b.universalSignatureVerifier) == null ? void 0 : _c.address, ...rest } = parameters;
      const signatureHex = (() => {
        if ((0, isHex_js_1.isHex)(signature))
          return signature;
        if (typeof signature === "object" && "r" in signature && "s" in signature)
          return (0, serializeSignature_js_1.serializeSignature)(signature);
        return (0, toHex_js_1.bytesToHex)(signature);
      })();
      const wrappedSignature = await (async () => {
        if (!factory && !factoryData)
          return signatureHex;
        if ((0, isErc6492Signature_js_1.isErc6492Signature)(signatureHex))
          return signatureHex;
        return (0, serializeErc6492Signature_js_1.serializeErc6492Signature)({
          address: factory,
          data: factoryData,
          signature: signatureHex
        });
      })();
      try {
        const args = universalSignatureVerifierAddress ? {
          to: universalSignatureVerifierAddress,
          data: (0, index_js_1.encodeFunctionData)({
            abi: abis_js_1.universalSignatureValidatorAbi,
            functionName: "isValidSig",
            args: [address, hash, wrappedSignature]
          }),
          ...rest
        } : {
          data: (0, encodeDeployData_js_1.encodeDeployData)({
            abi: abis_js_1.universalSignatureValidatorAbi,
            args: [address, hash, wrappedSignature],
            bytecode: contracts_js_1.universalSignatureValidatorByteCode
          }),
          ...rest
        };
        const { data } = await (0, getAction_js_1.getAction)(client, call_js_1.call, "call")(args);
        return (0, index_js_1.hexToBool)(data ?? "0x0");
      } catch (error) {
        try {
          const verified = (0, isAddressEqual_js_1.isAddressEqual)((0, getAddress_js_1.getAddress)(address), await (0, recoverAddress_js_1.recoverAddress)({ hash, signature }));
          if (verified)
            return true;
        } catch {
        }
        if (error instanceof contract_js_1.CallExecutionError) {
          return false;
        }
        throw error;
      }
    }
  }
});

// node_modules/viem/_cjs/actions/public/verifyMessage.js
var require_verifyMessage2 = __commonJS({
  "node_modules/viem/_cjs/actions/public/verifyMessage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifyMessage = verifyMessage;
    var hashMessage_js_1 = require_hashMessage();
    var verifyHash_js_1 = require_verifyHash2();
    async function verifyMessage(client, { address, message, factory, factoryData, signature, ...callRequest }) {
      const hash = (0, hashMessage_js_1.hashMessage)(message);
      return (0, verifyHash_js_1.verifyHash)(client, {
        address,
        factory,
        factoryData,
        hash,
        signature,
        ...callRequest
      });
    }
  }
});

// node_modules/viem/_cjs/actions/public/verifyTypedData.js
var require_verifyTypedData2 = __commonJS({
  "node_modules/viem/_cjs/actions/public/verifyTypedData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifyTypedData = verifyTypedData;
    var hashTypedData_js_1 = require_hashTypedData();
    var verifyHash_js_1 = require_verifyHash2();
    async function verifyTypedData(client, parameters) {
      const { address, factory, factoryData, signature, message, primaryType, types, domain, ...callRequest } = parameters;
      const hash = (0, hashTypedData_js_1.hashTypedData)({ message, primaryType, types, domain });
      return (0, verifyHash_js_1.verifyHash)(client, {
        address,
        factory,
        factoryData,
        hash,
        signature,
        ...callRequest
      });
    }
  }
});

// node_modules/viem/_cjs/actions/public/watchBlockNumber.js
var require_watchBlockNumber = __commonJS({
  "node_modules/viem/_cjs/actions/public/watchBlockNumber.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.watchBlockNumber = watchBlockNumber;
    var fromHex_js_1 = require_fromHex();
    var getAction_js_1 = require_getAction();
    var observe_js_1 = require_observe();
    var poll_js_1 = require_poll();
    var stringify_js_1 = require_stringify();
    var getBlockNumber_js_1 = require_getBlockNumber();
    function watchBlockNumber(client, { emitOnBegin = false, emitMissed = false, onBlockNumber, onError, poll: poll_, pollingInterval = client.pollingInterval }) {
      const enablePolling = (() => {
        if (typeof poll_ !== "undefined")
          return poll_;
        if (client.transport.type === "webSocket")
          return false;
        if (client.transport.type === "fallback" && client.transport.transports[0].config.type === "webSocket")
          return false;
        return true;
      })();
      let prevBlockNumber;
      const pollBlockNumber = () => {
        const observerId = (0, stringify_js_1.stringify)([
          "watchBlockNumber",
          client.uid,
          emitOnBegin,
          emitMissed,
          pollingInterval
        ]);
        return (0, observe_js_1.observe)(observerId, { onBlockNumber, onError }, (emit) => (0, poll_js_1.poll)(async () => {
          var _a;
          try {
            const blockNumber = await (0, getAction_js_1.getAction)(client, getBlockNumber_js_1.getBlockNumber, "getBlockNumber")({ cacheTime: 0 });
            if (prevBlockNumber) {
              if (blockNumber === prevBlockNumber)
                return;
              if (blockNumber - prevBlockNumber > 1 && emitMissed) {
                for (let i = prevBlockNumber + 1n; i < blockNumber; i++) {
                  emit.onBlockNumber(i, prevBlockNumber);
                  prevBlockNumber = i;
                }
              }
            }
            if (!prevBlockNumber || blockNumber > prevBlockNumber) {
              emit.onBlockNumber(blockNumber, prevBlockNumber);
              prevBlockNumber = blockNumber;
            }
          } catch (err) {
            (_a = emit.onError) == null ? void 0 : _a.call(emit, err);
          }
        }, {
          emitOnBegin,
          interval: pollingInterval
        }));
      };
      const subscribeBlockNumber = () => {
        const observerId = (0, stringify_js_1.stringify)([
          "watchBlockNumber",
          client.uid,
          emitOnBegin,
          emitMissed
        ]);
        return (0, observe_js_1.observe)(observerId, { onBlockNumber, onError }, (emit) => {
          let active = true;
          let unsubscribe = () => active = false;
          (async () => {
            try {
              const transport = (() => {
                if (client.transport.type === "fallback") {
                  const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket");
                  if (!transport2)
                    return client.transport;
                  return transport2.value;
                }
                return client.transport;
              })();
              const { unsubscribe: unsubscribe_ } = await transport.subscribe({
                params: ["newHeads"],
                onData(data) {
                  var _a;
                  if (!active)
                    return;
                  const blockNumber = (0, fromHex_js_1.hexToBigInt)((_a = data.result) == null ? void 0 : _a.number);
                  emit.onBlockNumber(blockNumber, prevBlockNumber);
                  prevBlockNumber = blockNumber;
                },
                onError(error) {
                  var _a;
                  (_a = emit.onError) == null ? void 0 : _a.call(emit, error);
                }
              });
              unsubscribe = unsubscribe_;
              if (!active)
                unsubscribe();
            } catch (err) {
              onError == null ? void 0 : onError(err);
            }
          })();
          return () => unsubscribe();
        });
      };
      return enablePolling ? pollBlockNumber() : subscribeBlockNumber();
    }
  }
});

// node_modules/viem/_cjs/actions/public/waitForTransactionReceipt.js
var require_waitForTransactionReceipt = __commonJS({
  "node_modules/viem/_cjs/actions/public/waitForTransactionReceipt.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.waitForTransactionReceipt = waitForTransactionReceipt;
    var block_js_1 = require_block();
    var transaction_js_1 = require_transaction();
    var getAction_js_1 = require_getAction();
    var observe_js_1 = require_observe();
    var withResolvers_js_1 = require_withResolvers();
    var withRetry_js_1 = require_withRetry();
    var stringify_js_1 = require_stringify();
    var getBlock_js_1 = require_getBlock();
    var getTransaction_js_1 = require_getTransaction();
    var getTransactionReceipt_js_1 = require_getTransactionReceipt();
    var watchBlockNumber_js_1 = require_watchBlockNumber();
    async function waitForTransactionReceipt(client, { confirmations = 1, hash, onReplaced, pollingInterval = client.pollingInterval, retryCount = 6, retryDelay = ({ count }) => ~~(1 << count) * 200, timeout = 18e4 }) {
      const observerId = (0, stringify_js_1.stringify)(["waitForTransactionReceipt", client.uid, hash]);
      let transaction;
      let replacedTransaction;
      let receipt;
      let retrying = false;
      const { promise, resolve, reject } = (0, withResolvers_js_1.withResolvers)();
      const timer = timeout ? setTimeout(() => reject(new transaction_js_1.WaitForTransactionReceiptTimeoutError({ hash })), timeout) : void 0;
      const _unobserve = (0, observe_js_1.observe)(observerId, { onReplaced, resolve, reject }, (emit) => {
        const _unwatch = (0, getAction_js_1.getAction)(client, watchBlockNumber_js_1.watchBlockNumber, "watchBlockNumber")({
          emitMissed: true,
          emitOnBegin: true,
          poll: true,
          pollingInterval,
          async onBlockNumber(blockNumber_) {
            const done = (fn) => {
              clearTimeout(timer);
              _unwatch();
              fn();
              _unobserve();
            };
            let blockNumber = blockNumber_;
            if (retrying)
              return;
            try {
              if (receipt) {
                if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                  return;
                done(() => emit.resolve(receipt));
                return;
              }
              if (!transaction) {
                retrying = true;
                await (0, withRetry_js_1.withRetry)(async () => {
                  transaction = await (0, getAction_js_1.getAction)(client, getTransaction_js_1.getTransaction, "getTransaction")({ hash });
                  if (transaction.blockNumber)
                    blockNumber = transaction.blockNumber;
                }, {
                  delay: retryDelay,
                  retryCount
                });
                retrying = false;
              }
              receipt = await (0, getAction_js_1.getAction)(client, getTransactionReceipt_js_1.getTransactionReceipt, "getTransactionReceipt")({ hash });
              if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                return;
              done(() => emit.resolve(receipt));
            } catch (err) {
              if (err instanceof transaction_js_1.TransactionNotFoundError || err instanceof transaction_js_1.TransactionReceiptNotFoundError) {
                if (!transaction) {
                  retrying = false;
                  return;
                }
                try {
                  replacedTransaction = transaction;
                  retrying = true;
                  const block = await (0, withRetry_js_1.withRetry)(() => (0, getAction_js_1.getAction)(client, getBlock_js_1.getBlock, "getBlock")({
                    blockNumber,
                    includeTransactions: true
                  }), {
                    delay: retryDelay,
                    retryCount,
                    shouldRetry: ({ error }) => error instanceof block_js_1.BlockNotFoundError
                  });
                  retrying = false;
                  const replacementTransaction = block.transactions.find(({ from, nonce }) => from === replacedTransaction.from && nonce === replacedTransaction.nonce);
                  if (!replacementTransaction)
                    return;
                  receipt = await (0, getAction_js_1.getAction)(client, getTransactionReceipt_js_1.getTransactionReceipt, "getTransactionReceipt")({
                    hash: replacementTransaction.hash
                  });
                  if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                    return;
                  let reason = "replaced";
                  if (replacementTransaction.to === replacedTransaction.to && replacementTransaction.value === replacedTransaction.value && replacementTransaction.input === replacedTransaction.input) {
                    reason = "repriced";
                  } else if (replacementTransaction.from === replacementTransaction.to && replacementTransaction.value === 0n) {
                    reason = "cancelled";
                  }
                  done(() => {
                    var _a;
                    (_a = emit.onReplaced) == null ? void 0 : _a.call(emit, {
                      reason,
                      replacedTransaction,
                      transaction: replacementTransaction,
                      transactionReceipt: receipt
                    });
                    emit.resolve(receipt);
                  });
                } catch (err_) {
                  done(() => emit.reject(err_));
                }
              } else {
                done(() => emit.reject(err));
              }
            }
          }
        });
      });
      return promise;
    }
  }
});

// node_modules/viem/_cjs/actions/public/watchBlocks.js
var require_watchBlocks = __commonJS({
  "node_modules/viem/_cjs/actions/public/watchBlocks.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.watchBlocks = watchBlocks;
    var getAction_js_1 = require_getAction();
    var observe_js_1 = require_observe();
    var poll_js_1 = require_poll();
    var stringify_js_1 = require_stringify();
    var getBlock_js_1 = require_getBlock();
    function watchBlocks(client, { blockTag = "latest", emitMissed = false, emitOnBegin = false, onBlock, onError, includeTransactions: includeTransactions_, poll: poll_, pollingInterval = client.pollingInterval }) {
      const enablePolling = (() => {
        if (typeof poll_ !== "undefined")
          return poll_;
        if (client.transport.type === "webSocket")
          return false;
        if (client.transport.type === "fallback" && client.transport.transports[0].config.type === "webSocket")
          return false;
        return true;
      })();
      const includeTransactions = includeTransactions_ ?? false;
      let prevBlock;
      const pollBlocks = () => {
        const observerId = (0, stringify_js_1.stringify)([
          "watchBlocks",
          client.uid,
          blockTag,
          emitMissed,
          emitOnBegin,
          includeTransactions,
          pollingInterval
        ]);
        return (0, observe_js_1.observe)(observerId, { onBlock, onError }, (emit) => (0, poll_js_1.poll)(async () => {
          var _a;
          try {
            const block = await (0, getAction_js_1.getAction)(client, getBlock_js_1.getBlock, "getBlock")({
              blockTag,
              includeTransactions
            });
            if (block.number && (prevBlock == null ? void 0 : prevBlock.number)) {
              if (block.number === prevBlock.number)
                return;
              if (block.number - prevBlock.number > 1 && emitMissed) {
                for (let i = (prevBlock == null ? void 0 : prevBlock.number) + 1n; i < block.number; i++) {
                  const block2 = await (0, getAction_js_1.getAction)(client, getBlock_js_1.getBlock, "getBlock")({
                    blockNumber: i,
                    includeTransactions
                  });
                  emit.onBlock(block2, prevBlock);
                  prevBlock = block2;
                }
              }
            }
            if (!(prevBlock == null ? void 0 : prevBlock.number) || blockTag === "pending" && !(block == null ? void 0 : block.number) || block.number && block.number > prevBlock.number) {
              emit.onBlock(block, prevBlock);
              prevBlock = block;
            }
          } catch (err) {
            (_a = emit.onError) == null ? void 0 : _a.call(emit, err);
          }
        }, {
          emitOnBegin,
          interval: pollingInterval
        }));
      };
      const subscribeBlocks = () => {
        let active = true;
        let emitFetched = true;
        let unsubscribe = () => active = false;
        (async () => {
          try {
            if (emitOnBegin) {
              (0, getAction_js_1.getAction)(client, getBlock_js_1.getBlock, "getBlock")({
                blockTag,
                includeTransactions
              }).then((block) => {
                if (!active)
                  return;
                if (!emitFetched)
                  return;
                onBlock(block, void 0);
                emitFetched = false;
              });
            }
            const transport = (() => {
              if (client.transport.type === "fallback") {
                const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket");
                if (!transport2)
                  return client.transport;
                return transport2.value;
              }
              return client.transport;
            })();
            const { unsubscribe: unsubscribe_ } = await transport.subscribe({
              params: ["newHeads"],
              async onData(data) {
                if (!active)
                  return;
                const block = await (0, getAction_js_1.getAction)(client, getBlock_js_1.getBlock, "getBlock")({
                  blockNumber: data.blockNumber,
                  includeTransactions
                }).catch(() => {
                });
                if (!active)
                  return;
                onBlock(block, prevBlock);
                emitFetched = false;
                prevBlock = block;
              },
              onError(error) {
                onError == null ? void 0 : onError(error);
              }
            });
            unsubscribe = unsubscribe_;
            if (!active)
              unsubscribe();
          } catch (err) {
            onError == null ? void 0 : onError(err);
          }
        })();
        return () => unsubscribe();
      };
      return enablePolling ? pollBlocks() : subscribeBlocks();
    }
  }
});

// node_modules/viem/_cjs/actions/public/watchEvent.js
var require_watchEvent = __commonJS({
  "node_modules/viem/_cjs/actions/public/watchEvent.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.watchEvent = watchEvent;
    var encodeEventTopics_js_1 = require_encodeEventTopics();
    var observe_js_1 = require_observe();
    var poll_js_1 = require_poll();
    var stringify_js_1 = require_stringify();
    var abi_js_1 = require_abi();
    var rpc_js_1 = require_rpc2();
    var decodeEventLog_js_1 = require_decodeEventLog();
    var log_js_1 = require_log2();
    var getAction_js_1 = require_getAction();
    var createEventFilter_js_1 = require_createEventFilter();
    var getBlockNumber_js_1 = require_getBlockNumber();
    var getFilterChanges_js_1 = require_getFilterChanges();
    var getLogs_js_1 = require_getLogs();
    var uninstallFilter_js_1 = require_uninstallFilter();
    function watchEvent(client, { address, args, batch = true, event, events, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ }) {
      const enablePolling = (() => {
        if (typeof poll_ !== "undefined")
          return poll_;
        if (typeof fromBlock === "bigint")
          return true;
        if (client.transport.type === "webSocket")
          return false;
        if (client.transport.type === "fallback" && client.transport.transports[0].config.type === "webSocket")
          return false;
        return true;
      })();
      const strict = strict_ ?? false;
      const pollEvent = () => {
        const observerId = (0, stringify_js_1.stringify)([
          "watchEvent",
          address,
          args,
          batch,
          client.uid,
          event,
          pollingInterval,
          fromBlock
        ]);
        return (0, observe_js_1.observe)(observerId, { onLogs, onError }, (emit) => {
          let previousBlockNumber;
          if (fromBlock !== void 0)
            previousBlockNumber = fromBlock - 1n;
          let filter;
          let initialized = false;
          const unwatch = (0, poll_js_1.poll)(async () => {
            var _a;
            if (!initialized) {
              try {
                filter = await (0, getAction_js_1.getAction)(client, createEventFilter_js_1.createEventFilter, "createEventFilter")({
                  address,
                  args,
                  event,
                  events,
                  strict,
                  fromBlock
                });
              } catch {
              }
              initialized = true;
              return;
            }
            try {
              let logs;
              if (filter) {
                logs = await (0, getAction_js_1.getAction)(client, getFilterChanges_js_1.getFilterChanges, "getFilterChanges")({ filter });
              } else {
                const blockNumber = await (0, getAction_js_1.getAction)(client, getBlockNumber_js_1.getBlockNumber, "getBlockNumber")({});
                if (previousBlockNumber && previousBlockNumber !== blockNumber) {
                  logs = await (0, getAction_js_1.getAction)(client, getLogs_js_1.getLogs, "getLogs")({
                    address,
                    args,
                    event,
                    events,
                    fromBlock: previousBlockNumber + 1n,
                    toBlock: blockNumber
                  });
                } else {
                  logs = [];
                }
                previousBlockNumber = blockNumber;
              }
              if (logs.length === 0)
                return;
              if (batch)
                emit.onLogs(logs);
              else
                for (const log of logs)
                  emit.onLogs([log]);
            } catch (err) {
              if (filter && err instanceof rpc_js_1.InvalidInputRpcError)
                initialized = false;
              (_a = emit.onError) == null ? void 0 : _a.call(emit, err);
            }
          }, {
            emitOnBegin: true,
            interval: pollingInterval
          });
          return async () => {
            if (filter)
              await (0, getAction_js_1.getAction)(client, uninstallFilter_js_1.uninstallFilter, "uninstallFilter")({ filter });
            unwatch();
          };
        });
      };
      const subscribeEvent = () => {
        let active = true;
        let unsubscribe = () => active = false;
        (async () => {
          try {
            const transport = (() => {
              if (client.transport.type === "fallback") {
                const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket");
                if (!transport2)
                  return client.transport;
                return transport2.value;
              }
              return client.transport;
            })();
            const events_ = events ?? (event ? [event] : void 0);
            let topics = [];
            if (events_) {
              const encoded = events_.flatMap((event2) => (0, encodeEventTopics_js_1.encodeEventTopics)({
                abi: [event2],
                eventName: event2.name,
                args
              }));
              topics = [encoded];
              if (event)
                topics = topics[0];
            }
            const { unsubscribe: unsubscribe_ } = await transport.subscribe({
              params: ["logs", { address, topics }],
              onData(data) {
                var _a;
                if (!active)
                  return;
                const log = data.result;
                try {
                  const { eventName, args: args2 } = (0, decodeEventLog_js_1.decodeEventLog)({
                    abi: events_ ?? [],
                    data: log.data,
                    topics: log.topics,
                    strict
                  });
                  const formatted = (0, log_js_1.formatLog)(log, { args: args2, eventName });
                  onLogs([formatted]);
                } catch (err) {
                  let eventName;
                  let isUnnamed;
                  if (err instanceof abi_js_1.DecodeLogDataMismatch || err instanceof abi_js_1.DecodeLogTopicsMismatch) {
                    if (strict_)
                      return;
                    eventName = err.abiItem.name;
                    isUnnamed = (_a = err.abiItem.inputs) == null ? void 0 : _a.some((x) => !("name" in x && x.name));
                  }
                  const formatted = (0, log_js_1.formatLog)(log, {
                    args: isUnnamed ? [] : {},
                    eventName
                  });
                  onLogs([formatted]);
                }
              },
              onError(error) {
                onError == null ? void 0 : onError(error);
              }
            });
            unsubscribe = unsubscribe_;
            if (!active)
              unsubscribe();
          } catch (err) {
            onError == null ? void 0 : onError(err);
          }
        })();
        return () => unsubscribe();
      };
      return enablePolling ? pollEvent() : subscribeEvent();
    }
  }
});

// node_modules/viem/_cjs/actions/public/watchPendingTransactions.js
var require_watchPendingTransactions = __commonJS({
  "node_modules/viem/_cjs/actions/public/watchPendingTransactions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.watchPendingTransactions = watchPendingTransactions;
    var getAction_js_1 = require_getAction();
    var observe_js_1 = require_observe();
    var poll_js_1 = require_poll();
    var stringify_js_1 = require_stringify();
    var createPendingTransactionFilter_js_1 = require_createPendingTransactionFilter();
    var getFilterChanges_js_1 = require_getFilterChanges();
    var uninstallFilter_js_1 = require_uninstallFilter();
    function watchPendingTransactions(client, { batch = true, onError, onTransactions, poll: poll_, pollingInterval = client.pollingInterval }) {
      const enablePolling = typeof poll_ !== "undefined" ? poll_ : client.transport.type !== "webSocket";
      const pollPendingTransactions = () => {
        const observerId = (0, stringify_js_1.stringify)([
          "watchPendingTransactions",
          client.uid,
          batch,
          pollingInterval
        ]);
        return (0, observe_js_1.observe)(observerId, { onTransactions, onError }, (emit) => {
          let filter;
          const unwatch = (0, poll_js_1.poll)(async () => {
            var _a;
            try {
              if (!filter) {
                try {
                  filter = await (0, getAction_js_1.getAction)(client, createPendingTransactionFilter_js_1.createPendingTransactionFilter, "createPendingTransactionFilter")({});
                  return;
                } catch (err) {
                  unwatch();
                  throw err;
                }
              }
              const hashes = await (0, getAction_js_1.getAction)(client, getFilterChanges_js_1.getFilterChanges, "getFilterChanges")({ filter });
              if (hashes.length === 0)
                return;
              if (batch)
                emit.onTransactions(hashes);
              else
                for (const hash of hashes)
                  emit.onTransactions([hash]);
            } catch (err) {
              (_a = emit.onError) == null ? void 0 : _a.call(emit, err);
            }
          }, {
            emitOnBegin: true,
            interval: pollingInterval
          });
          return async () => {
            if (filter)
              await (0, getAction_js_1.getAction)(client, uninstallFilter_js_1.uninstallFilter, "uninstallFilter")({ filter });
            unwatch();
          };
        });
      };
      const subscribePendingTransactions = () => {
        let active = true;
        let unsubscribe = () => active = false;
        (async () => {
          try {
            const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
              params: ["newPendingTransactions"],
              onData(data) {
                if (!active)
                  return;
                const transaction = data.result;
                onTransactions([transaction]);
              },
              onError(error) {
                onError == null ? void 0 : onError(error);
              }
            });
            unsubscribe = unsubscribe_;
            if (!active)
              unsubscribe();
          } catch (err) {
            onError == null ? void 0 : onError(err);
          }
        })();
        return () => unsubscribe();
      };
      return enablePolling ? pollPendingTransactions() : subscribePendingTransactions();
    }
  }
});

// node_modules/viem/_cjs/utils/siwe/parseSiweMessage.js
var require_parseSiweMessage = __commonJS({
  "node_modules/viem/_cjs/utils/siwe/parseSiweMessage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseSiweMessage = parseSiweMessage;
    function parseSiweMessage(message) {
      var _a, _b, _c;
      const { scheme, statement, ...prefix } = ((_a = message.match(prefixRegex)) == null ? void 0 : _a.groups) ?? {};
      const { chainId, expirationTime, issuedAt, notBefore, requestId, ...suffix } = ((_b = message.match(suffixRegex)) == null ? void 0 : _b.groups) ?? {};
      const resources = (_c = message.split("Resources:")[1]) == null ? void 0 : _c.split("\n- ").slice(1);
      return {
        ...prefix,
        ...suffix,
        ...chainId ? { chainId: Number(chainId) } : {},
        ...expirationTime ? { expirationTime: new Date(expirationTime) } : {},
        ...issuedAt ? { issuedAt: new Date(issuedAt) } : {},
        ...notBefore ? { notBefore: new Date(notBefore) } : {},
        ...requestId ? { requestId } : {},
        ...resources ? { resources } : {},
        ...scheme ? { scheme } : {},
        ...statement ? { statement } : {}
      };
    }
    var prefixRegex = /^(?:(?<scheme>[a-zA-Z][a-zA-Z0-9+-.]*):\/\/)?(?<domain>[a-zA-Z0-9+-.]*(?::[0-9]{1,5})?) (?:wants you to sign in with your Ethereum account:\n)(?<address>0x[a-fA-F0-9]{40})\n\n(?:(?<statement>.*)\n\n)?/;
    var suffixRegex = /(?:URI: (?<uri>.+))\n(?:Version: (?<version>.+))\n(?:Chain ID: (?<chainId>\d+))\n(?:Nonce: (?<nonce>[a-zA-Z0-9]+))\n(?:Issued At: (?<issuedAt>.+))(?:\nExpiration Time: (?<expirationTime>.+))?(?:\nNot Before: (?<notBefore>.+))?(?:\nRequest ID: (?<requestId>.+))?/;
  }
});

// node_modules/viem/_cjs/utils/siwe/validateSiweMessage.js
var require_validateSiweMessage = __commonJS({
  "node_modules/viem/_cjs/utils/siwe/validateSiweMessage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateSiweMessage = validateSiweMessage;
    var isAddressEqual_js_1 = require_isAddressEqual();
    function validateSiweMessage(parameters) {
      const { address, domain, message, nonce, scheme, time = /* @__PURE__ */ new Date() } = parameters;
      if (domain && message.domain !== domain)
        return false;
      if (nonce && message.nonce !== nonce)
        return false;
      if (scheme && message.scheme !== scheme)
        return false;
      if (message.expirationTime && time >= message.expirationTime)
        return false;
      if (message.notBefore && time < message.notBefore)
        return false;
      try {
        if (!message.address)
          return false;
        if (address && !(0, isAddressEqual_js_1.isAddressEqual)(message.address, address))
          return false;
      } catch {
        return false;
      }
      return true;
    }
  }
});

// node_modules/viem/_cjs/actions/siwe/verifySiweMessage.js
var require_verifySiweMessage = __commonJS({
  "node_modules/viem/_cjs/actions/siwe/verifySiweMessage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifySiweMessage = verifySiweMessage;
    var hashMessage_js_1 = require_hashMessage();
    var parseSiweMessage_js_1 = require_parseSiweMessage();
    var validateSiweMessage_js_1 = require_validateSiweMessage();
    var verifyHash_js_1 = require_verifyHash2();
    async function verifySiweMessage(client, parameters) {
      const { address, domain, message, nonce, scheme, signature, time = /* @__PURE__ */ new Date(), ...callRequest } = parameters;
      const parsed = (0, parseSiweMessage_js_1.parseSiweMessage)(message);
      if (!parsed.address)
        return false;
      const isValid = (0, validateSiweMessage_js_1.validateSiweMessage)({
        address,
        domain,
        message: parsed,
        nonce,
        scheme,
        time
      });
      if (!isValid)
        return false;
      const hash = (0, hashMessage_js_1.hashMessage)(message);
      return (0, verifyHash_js_1.verifyHash)(client, {
        address: parsed.address,
        hash,
        signature,
        ...callRequest
      });
    }
  }
});

// node_modules/viem/_cjs/clients/decorators/public.js
var require_public = __commonJS({
  "node_modules/viem/_cjs/clients/decorators/public.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.publicActions = publicActions;
    var getEnsAddress_js_1 = require_getEnsAddress();
    var getEnsAvatar_js_1 = require_getEnsAvatar();
    var getEnsName_js_1 = require_getEnsName();
    var getEnsResolver_js_1 = require_getEnsResolver();
    var getEnsText_js_1 = require_getEnsText();
    var call_js_1 = require_call();
    var createAccessList_js_1 = require_createAccessList();
    var createBlockFilter_js_1 = require_createBlockFilter();
    var createContractEventFilter_js_1 = require_createContractEventFilter();
    var createEventFilter_js_1 = require_createEventFilter();
    var createPendingTransactionFilter_js_1 = require_createPendingTransactionFilter();
    var estimateContractGas_js_1 = require_estimateContractGas();
    var estimateFeesPerGas_js_1 = require_estimateFeesPerGas();
    var estimateGas_js_1 = require_estimateGas2();
    var estimateMaxPriorityFeePerGas_js_1 = require_estimateMaxPriorityFeePerGas();
    var getBalance_js_1 = require_getBalance();
    var getBlobBaseFee_js_1 = require_getBlobBaseFee();
    var getBlock_js_1 = require_getBlock();
    var getBlockNumber_js_1 = require_getBlockNumber();
    var getBlockTransactionCount_js_1 = require_getBlockTransactionCount();
    var getChainId_js_1 = require_getChainId();
    var getCode_js_1 = require_getCode();
    var getContractEvents_js_1 = require_getContractEvents();
    var getEip712Domain_js_1 = require_getEip712Domain();
    var getFeeHistory_js_1 = require_getFeeHistory();
    var getFilterChanges_js_1 = require_getFilterChanges();
    var getFilterLogs_js_1 = require_getFilterLogs();
    var getGasPrice_js_1 = require_getGasPrice();
    var getLogs_js_1 = require_getLogs();
    var getProof_js_1 = require_getProof();
    var getStorageAt_js_1 = require_getStorageAt();
    var getTransaction_js_1 = require_getTransaction();
    var getTransactionConfirmations_js_1 = require_getTransactionConfirmations();
    var getTransactionCount_js_1 = require_getTransactionCount();
    var getTransactionReceipt_js_1 = require_getTransactionReceipt();
    var multicall_js_1 = require_multicall();
    var readContract_js_1 = require_readContract();
    var simulate_js_1 = require_simulate();
    var simulateContract_js_1 = require_simulateContract();
    var uninstallFilter_js_1 = require_uninstallFilter();
    var verifyMessage_js_1 = require_verifyMessage2();
    var verifyTypedData_js_1 = require_verifyTypedData2();
    var waitForTransactionReceipt_js_1 = require_waitForTransactionReceipt();
    var watchBlockNumber_js_1 = require_watchBlockNumber();
    var watchBlocks_js_1 = require_watchBlocks();
    var watchContractEvent_js_1 = require_watchContractEvent();
    var watchEvent_js_1 = require_watchEvent();
    var watchPendingTransactions_js_1 = require_watchPendingTransactions();
    var verifySiweMessage_js_1 = require_verifySiweMessage();
    var prepareTransactionRequest_js_1 = require_prepareTransactionRequest();
    var sendRawTransaction_js_1 = require_sendRawTransaction();
    function publicActions(client) {
      return {
        call: (args) => (0, call_js_1.call)(client, args),
        createAccessList: (args) => (0, createAccessList_js_1.createAccessList)(client, args),
        createBlockFilter: () => (0, createBlockFilter_js_1.createBlockFilter)(client),
        createContractEventFilter: (args) => (0, createContractEventFilter_js_1.createContractEventFilter)(client, args),
        createEventFilter: (args) => (0, createEventFilter_js_1.createEventFilter)(client, args),
        createPendingTransactionFilter: () => (0, createPendingTransactionFilter_js_1.createPendingTransactionFilter)(client),
        estimateContractGas: (args) => (0, estimateContractGas_js_1.estimateContractGas)(client, args),
        estimateGas: (args) => (0, estimateGas_js_1.estimateGas)(client, args),
        getBalance: (args) => (0, getBalance_js_1.getBalance)(client, args),
        getBlobBaseFee: () => (0, getBlobBaseFee_js_1.getBlobBaseFee)(client),
        getBlock: (args) => (0, getBlock_js_1.getBlock)(client, args),
        getBlockNumber: (args) => (0, getBlockNumber_js_1.getBlockNumber)(client, args),
        getBlockTransactionCount: (args) => (0, getBlockTransactionCount_js_1.getBlockTransactionCount)(client, args),
        getBytecode: (args) => (0, getCode_js_1.getCode)(client, args),
        getChainId: () => (0, getChainId_js_1.getChainId)(client),
        getCode: (args) => (0, getCode_js_1.getCode)(client, args),
        getContractEvents: (args) => (0, getContractEvents_js_1.getContractEvents)(client, args),
        getEip712Domain: (args) => (0, getEip712Domain_js_1.getEip712Domain)(client, args),
        getEnsAddress: (args) => (0, getEnsAddress_js_1.getEnsAddress)(client, args),
        getEnsAvatar: (args) => (0, getEnsAvatar_js_1.getEnsAvatar)(client, args),
        getEnsName: (args) => (0, getEnsName_js_1.getEnsName)(client, args),
        getEnsResolver: (args) => (0, getEnsResolver_js_1.getEnsResolver)(client, args),
        getEnsText: (args) => (0, getEnsText_js_1.getEnsText)(client, args),
        getFeeHistory: (args) => (0, getFeeHistory_js_1.getFeeHistory)(client, args),
        estimateFeesPerGas: (args) => (0, estimateFeesPerGas_js_1.estimateFeesPerGas)(client, args),
        getFilterChanges: (args) => (0, getFilterChanges_js_1.getFilterChanges)(client, args),
        getFilterLogs: (args) => (0, getFilterLogs_js_1.getFilterLogs)(client, args),
        getGasPrice: () => (0, getGasPrice_js_1.getGasPrice)(client),
        getLogs: (args) => (0, getLogs_js_1.getLogs)(client, args),
        getProof: (args) => (0, getProof_js_1.getProof)(client, args),
        estimateMaxPriorityFeePerGas: (args) => (0, estimateMaxPriorityFeePerGas_js_1.estimateMaxPriorityFeePerGas)(client, args),
        getStorageAt: (args) => (0, getStorageAt_js_1.getStorageAt)(client, args),
        getTransaction: (args) => (0, getTransaction_js_1.getTransaction)(client, args),
        getTransactionConfirmations: (args) => (0, getTransactionConfirmations_js_1.getTransactionConfirmations)(client, args),
        getTransactionCount: (args) => (0, getTransactionCount_js_1.getTransactionCount)(client, args),
        getTransactionReceipt: (args) => (0, getTransactionReceipt_js_1.getTransactionReceipt)(client, args),
        multicall: (args) => (0, multicall_js_1.multicall)(client, args),
        prepareTransactionRequest: (args) => (0, prepareTransactionRequest_js_1.prepareTransactionRequest)(client, args),
        readContract: (args) => (0, readContract_js_1.readContract)(client, args),
        sendRawTransaction: (args) => (0, sendRawTransaction_js_1.sendRawTransaction)(client, args),
        simulate: (args) => (0, simulate_js_1.simulate)(client, args),
        simulateContract: (args) => (0, simulateContract_js_1.simulateContract)(client, args),
        verifyMessage: (args) => (0, verifyMessage_js_1.verifyMessage)(client, args),
        verifySiweMessage: (args) => (0, verifySiweMessage_js_1.verifySiweMessage)(client, args),
        verifyTypedData: (args) => (0, verifyTypedData_js_1.verifyTypedData)(client, args),
        uninstallFilter: (args) => (0, uninstallFilter_js_1.uninstallFilter)(client, args),
        waitForTransactionReceipt: (args) => (0, waitForTransactionReceipt_js_1.waitForTransactionReceipt)(client, args),
        watchBlocks: (args) => (0, watchBlocks_js_1.watchBlocks)(client, args),
        watchBlockNumber: (args) => (0, watchBlockNumber_js_1.watchBlockNumber)(client, args),
        watchContractEvent: (args) => (0, watchContractEvent_js_1.watchContractEvent)(client, args),
        watchEvent: (args) => (0, watchEvent_js_1.watchEvent)(client, args),
        watchPendingTransactions: (args) => (0, watchPendingTransactions_js_1.watchPendingTransactions)(client, args)
      };
    }
  }
});

// node_modules/viem/_cjs/clients/createPublicClient.js
var require_createPublicClient = __commonJS({
  "node_modules/viem/_cjs/clients/createPublicClient.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createPublicClient = createPublicClient;
    var createClient_js_1 = require_createClient();
    var public_js_1 = require_public();
    function createPublicClient(parameters) {
      const { key = "public", name = "Public Client" } = parameters;
      const client = (0, createClient_js_1.createClient)({
        ...parameters,
        key,
        name,
        type: "publicClient"
      });
      return client.extend(public_js_1.publicActions);
    }
  }
});

// node_modules/viem/_cjs/actions/test/dropTransaction.js
var require_dropTransaction = __commonJS({
  "node_modules/viem/_cjs/actions/test/dropTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dropTransaction = dropTransaction;
    async function dropTransaction(client, { hash }) {
      await client.request({
        method: `${client.mode}_dropTransaction`,
        params: [hash]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/dumpState.js
var require_dumpState = __commonJS({
  "node_modules/viem/_cjs/actions/test/dumpState.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dumpState = dumpState;
    async function dumpState(client) {
      return client.request({
        method: `${client.mode}_dumpState`
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/getAutomine.js
var require_getAutomine = __commonJS({
  "node_modules/viem/_cjs/actions/test/getAutomine.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAutomine = getAutomine;
    async function getAutomine(client) {
      if (client.mode === "ganache")
        return await client.request({
          method: "eth_mining"
        });
      return await client.request({
        method: `${client.mode}_getAutomine`
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/getTxpoolContent.js
var require_getTxpoolContent = __commonJS({
  "node_modules/viem/_cjs/actions/test/getTxpoolContent.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTxpoolContent = getTxpoolContent;
    async function getTxpoolContent(client) {
      return await client.request({
        method: "txpool_content"
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/getTxpoolStatus.js
var require_getTxpoolStatus = __commonJS({
  "node_modules/viem/_cjs/actions/test/getTxpoolStatus.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTxpoolStatus = getTxpoolStatus;
    var fromHex_js_1 = require_fromHex();
    async function getTxpoolStatus(client) {
      const { pending, queued } = await client.request({
        method: "txpool_status"
      });
      return {
        pending: (0, fromHex_js_1.hexToNumber)(pending),
        queued: (0, fromHex_js_1.hexToNumber)(queued)
      };
    }
  }
});

// node_modules/viem/_cjs/actions/test/impersonateAccount.js
var require_impersonateAccount = __commonJS({
  "node_modules/viem/_cjs/actions/test/impersonateAccount.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.impersonateAccount = impersonateAccount;
    async function impersonateAccount(client, { address }) {
      await client.request({
        method: `${client.mode}_impersonateAccount`,
        params: [address]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/increaseTime.js
var require_increaseTime = __commonJS({
  "node_modules/viem/_cjs/actions/test/increaseTime.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.increaseTime = increaseTime;
    var toHex_js_1 = require_toHex();
    async function increaseTime(client, { seconds }) {
      return await client.request({
        method: "evm_increaseTime",
        params: [(0, toHex_js_1.numberToHex)(seconds)]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/inspectTxpool.js
var require_inspectTxpool = __commonJS({
  "node_modules/viem/_cjs/actions/test/inspectTxpool.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.inspectTxpool = inspectTxpool;
    async function inspectTxpool(client) {
      return await client.request({
        method: "txpool_inspect"
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/loadState.js
var require_loadState = __commonJS({
  "node_modules/viem/_cjs/actions/test/loadState.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadState = loadState;
    async function loadState(client, { state }) {
      await client.request({
        method: `${client.mode}_loadState`,
        params: [state]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/mine.js
var require_mine = __commonJS({
  "node_modules/viem/_cjs/actions/test/mine.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mine = mine;
    var toHex_js_1 = require_toHex();
    async function mine(client, { blocks, interval }) {
      if (client.mode === "ganache")
        await client.request({
          method: "evm_mine",
          params: [{ blocks: (0, toHex_js_1.numberToHex)(blocks) }]
        });
      else
        await client.request({
          method: `${client.mode}_mine`,
          params: [(0, toHex_js_1.numberToHex)(blocks), (0, toHex_js_1.numberToHex)(interval || 0)]
        });
    }
  }
});

// node_modules/viem/_cjs/actions/test/removeBlockTimestampInterval.js
var require_removeBlockTimestampInterval = __commonJS({
  "node_modules/viem/_cjs/actions/test/removeBlockTimestampInterval.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.removeBlockTimestampInterval = removeBlockTimestampInterval;
    async function removeBlockTimestampInterval(client) {
      await client.request({
        method: `${client.mode}_removeBlockTimestampInterval`
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/reset.js
var require_reset = __commonJS({
  "node_modules/viem/_cjs/actions/test/reset.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reset = reset;
    async function reset(client, { blockNumber, jsonRpcUrl } = {}) {
      await client.request({
        method: `${client.mode}_reset`,
        params: [{ forking: { blockNumber: Number(blockNumber), jsonRpcUrl } }]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/revert.js
var require_revert = __commonJS({
  "node_modules/viem/_cjs/actions/test/revert.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.revert = revert;
    async function revert(client, { id }) {
      await client.request({
        method: "evm_revert",
        params: [id]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/sendUnsignedTransaction.js
var require_sendUnsignedTransaction = __commonJS({
  "node_modules/viem/_cjs/actions/test/sendUnsignedTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sendUnsignedTransaction = sendUnsignedTransaction;
    var extract_js_1 = require_extract();
    var transactionRequest_js_1 = require_transactionRequest();
    async function sendUnsignedTransaction(client, args) {
      var _a, _b, _c;
      const { accessList, data, from, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, ...rest } = args;
      const chainFormat = (_c = (_b = (_a = client.chain) == null ? void 0 : _a.formatters) == null ? void 0 : _b.transactionRequest) == null ? void 0 : _c.format;
      const format = chainFormat || transactionRequest_js_1.formatTransactionRequest;
      const request = format({
        ...(0, extract_js_1.extract)(rest, { format: chainFormat }),
        accessList,
        data,
        from,
        gas,
        gasPrice,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        to,
        value
      });
      const hash = await client.request({
        method: "eth_sendUnsignedTransaction",
        params: [request]
      });
      return hash;
    }
  }
});

// node_modules/viem/_cjs/actions/test/setAutomine.js
var require_setAutomine = __commonJS({
  "node_modules/viem/_cjs/actions/test/setAutomine.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setAutomine = setAutomine;
    async function setAutomine(client, enabled) {
      if (client.mode === "ganache") {
        if (enabled)
          await client.request({ method: "miner_start" });
        else
          await client.request({ method: "miner_stop" });
      } else
        await client.request({
          method: "evm_setAutomine",
          params: [enabled]
        });
    }
  }
});

// node_modules/viem/_cjs/actions/test/setBalance.js
var require_setBalance = __commonJS({
  "node_modules/viem/_cjs/actions/test/setBalance.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setBalance = setBalance;
    var toHex_js_1 = require_toHex();
    async function setBalance(client, { address, value }) {
      if (client.mode === "ganache")
        await client.request({
          method: "evm_setAccountBalance",
          params: [address, (0, toHex_js_1.numberToHex)(value)]
        });
      else
        await client.request({
          method: `${client.mode}_setBalance`,
          params: [address, (0, toHex_js_1.numberToHex)(value)]
        });
    }
  }
});

// node_modules/viem/_cjs/actions/test/setBlockGasLimit.js
var require_setBlockGasLimit = __commonJS({
  "node_modules/viem/_cjs/actions/test/setBlockGasLimit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setBlockGasLimit = setBlockGasLimit;
    var toHex_js_1 = require_toHex();
    async function setBlockGasLimit(client, { gasLimit }) {
      await client.request({
        method: "evm_setBlockGasLimit",
        params: [(0, toHex_js_1.numberToHex)(gasLimit)]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/setBlockTimestampInterval.js
var require_setBlockTimestampInterval = __commonJS({
  "node_modules/viem/_cjs/actions/test/setBlockTimestampInterval.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setBlockTimestampInterval = setBlockTimestampInterval;
    async function setBlockTimestampInterval(client, { interval }) {
      const interval_ = (() => {
        if (client.mode === "hardhat")
          return interval * 1e3;
        return interval;
      })();
      await client.request({
        method: `${client.mode}_setBlockTimestampInterval`,
        params: [interval_]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/setCode.js
var require_setCode = __commonJS({
  "node_modules/viem/_cjs/actions/test/setCode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setCode = setCode;
    async function setCode(client, { address, bytecode }) {
      if (client.mode === "ganache")
        await client.request({
          method: "evm_setAccountCode",
          params: [address, bytecode]
        });
      else
        await client.request({
          method: `${client.mode}_setCode`,
          params: [address, bytecode]
        });
    }
  }
});

// node_modules/viem/_cjs/actions/test/setCoinbase.js
var require_setCoinbase = __commonJS({
  "node_modules/viem/_cjs/actions/test/setCoinbase.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setCoinbase = setCoinbase;
    async function setCoinbase(client, { address }) {
      await client.request({
        method: `${client.mode}_setCoinbase`,
        params: [address]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/setIntervalMining.js
var require_setIntervalMining = __commonJS({
  "node_modules/viem/_cjs/actions/test/setIntervalMining.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setIntervalMining = setIntervalMining;
    async function setIntervalMining(client, { interval }) {
      const interval_ = (() => {
        if (client.mode === "hardhat")
          return interval * 1e3;
        return interval;
      })();
      await client.request({
        method: "evm_setIntervalMining",
        params: [interval_]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/setLoggingEnabled.js
var require_setLoggingEnabled = __commonJS({
  "node_modules/viem/_cjs/actions/test/setLoggingEnabled.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setLoggingEnabled = setLoggingEnabled;
    async function setLoggingEnabled(client, enabled) {
      await client.request({
        method: `${client.mode}_setLoggingEnabled`,
        params: [enabled]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/setMinGasPrice.js
var require_setMinGasPrice = __commonJS({
  "node_modules/viem/_cjs/actions/test/setMinGasPrice.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setMinGasPrice = setMinGasPrice;
    var toHex_js_1 = require_toHex();
    async function setMinGasPrice(client, { gasPrice }) {
      await client.request({
        method: `${client.mode}_setMinGasPrice`,
        params: [(0, toHex_js_1.numberToHex)(gasPrice)]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/setNextBlockBaseFeePerGas.js
var require_setNextBlockBaseFeePerGas = __commonJS({
  "node_modules/viem/_cjs/actions/test/setNextBlockBaseFeePerGas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setNextBlockBaseFeePerGas = setNextBlockBaseFeePerGas;
    var toHex_js_1 = require_toHex();
    async function setNextBlockBaseFeePerGas(client, { baseFeePerGas }) {
      await client.request({
        method: `${client.mode}_setNextBlockBaseFeePerGas`,
        params: [(0, toHex_js_1.numberToHex)(baseFeePerGas)]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/setNextBlockTimestamp.js
var require_setNextBlockTimestamp = __commonJS({
  "node_modules/viem/_cjs/actions/test/setNextBlockTimestamp.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setNextBlockTimestamp = setNextBlockTimestamp;
    var toHex_js_1 = require_toHex();
    async function setNextBlockTimestamp(client, { timestamp }) {
      await client.request({
        method: "evm_setNextBlockTimestamp",
        params: [(0, toHex_js_1.numberToHex)(timestamp)]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/setNonce.js
var require_setNonce = __commonJS({
  "node_modules/viem/_cjs/actions/test/setNonce.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setNonce = setNonce;
    var toHex_js_1 = require_toHex();
    async function setNonce(client, { address, nonce }) {
      await client.request({
        method: `${client.mode}_setNonce`,
        params: [address, (0, toHex_js_1.numberToHex)(nonce)]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/setRpcUrl.js
var require_setRpcUrl = __commonJS({
  "node_modules/viem/_cjs/actions/test/setRpcUrl.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setRpcUrl = setRpcUrl;
    async function setRpcUrl(client, jsonRpcUrl) {
      await client.request({
        method: `${client.mode}_setRpcUrl`,
        params: [jsonRpcUrl]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/setStorageAt.js
var require_setStorageAt = __commonJS({
  "node_modules/viem/_cjs/actions/test/setStorageAt.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setStorageAt = setStorageAt;
    var toHex_js_1 = require_toHex();
    async function setStorageAt(client, { address, index, value }) {
      await client.request({
        method: `${client.mode}_setStorageAt`,
        params: [
          address,
          typeof index === "number" ? (0, toHex_js_1.numberToHex)(index) : index,
          value
        ]
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/snapshot.js
var require_snapshot = __commonJS({
  "node_modules/viem/_cjs/actions/test/snapshot.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.snapshot = snapshot;
    async function snapshot(client) {
      return await client.request({
        method: "evm_snapshot"
      });
    }
  }
});

// node_modules/viem/_cjs/actions/test/stopImpersonatingAccount.js
var require_stopImpersonatingAccount = __commonJS({
  "node_modules/viem/_cjs/actions/test/stopImpersonatingAccount.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stopImpersonatingAccount = stopImpersonatingAccount;
    async function stopImpersonatingAccount(client, { address }) {
      await client.request({
        method: `${client.mode}_stopImpersonatingAccount`,
        params: [address]
      });
    }
  }
});

// node_modules/viem/_cjs/clients/decorators/test.js
var require_test = __commonJS({
  "node_modules/viem/_cjs/clients/decorators/test.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.testActions = testActions;
    var dropTransaction_js_1 = require_dropTransaction();
    var dumpState_js_1 = require_dumpState();
    var getAutomine_js_1 = require_getAutomine();
    var getTxpoolContent_js_1 = require_getTxpoolContent();
    var getTxpoolStatus_js_1 = require_getTxpoolStatus();
    var impersonateAccount_js_1 = require_impersonateAccount();
    var increaseTime_js_1 = require_increaseTime();
    var inspectTxpool_js_1 = require_inspectTxpool();
    var loadState_js_1 = require_loadState();
    var mine_js_1 = require_mine();
    var removeBlockTimestampInterval_js_1 = require_removeBlockTimestampInterval();
    var reset_js_1 = require_reset();
    var revert_js_1 = require_revert();
    var sendUnsignedTransaction_js_1 = require_sendUnsignedTransaction();
    var setAutomine_js_1 = require_setAutomine();
    var setBalance_js_1 = require_setBalance();
    var setBlockGasLimit_js_1 = require_setBlockGasLimit();
    var setBlockTimestampInterval_js_1 = require_setBlockTimestampInterval();
    var setCode_js_1 = require_setCode();
    var setCoinbase_js_1 = require_setCoinbase();
    var setIntervalMining_js_1 = require_setIntervalMining();
    var setLoggingEnabled_js_1 = require_setLoggingEnabled();
    var setMinGasPrice_js_1 = require_setMinGasPrice();
    var setNextBlockBaseFeePerGas_js_1 = require_setNextBlockBaseFeePerGas();
    var setNextBlockTimestamp_js_1 = require_setNextBlockTimestamp();
    var setNonce_js_1 = require_setNonce();
    var setRpcUrl_js_1 = require_setRpcUrl();
    var setStorageAt_js_1 = require_setStorageAt();
    var snapshot_js_1 = require_snapshot();
    var stopImpersonatingAccount_js_1 = require_stopImpersonatingAccount();
    function testActions({ mode }) {
      return (client_) => {
        const client = client_.extend(() => ({
          mode
        }));
        return {
          dropTransaction: (args) => (0, dropTransaction_js_1.dropTransaction)(client, args),
          dumpState: () => (0, dumpState_js_1.dumpState)(client),
          getAutomine: () => (0, getAutomine_js_1.getAutomine)(client),
          getTxpoolContent: () => (0, getTxpoolContent_js_1.getTxpoolContent)(client),
          getTxpoolStatus: () => (0, getTxpoolStatus_js_1.getTxpoolStatus)(client),
          impersonateAccount: (args) => (0, impersonateAccount_js_1.impersonateAccount)(client, args),
          increaseTime: (args) => (0, increaseTime_js_1.increaseTime)(client, args),
          inspectTxpool: () => (0, inspectTxpool_js_1.inspectTxpool)(client),
          loadState: (args) => (0, loadState_js_1.loadState)(client, args),
          mine: (args) => (0, mine_js_1.mine)(client, args),
          removeBlockTimestampInterval: () => (0, removeBlockTimestampInterval_js_1.removeBlockTimestampInterval)(client),
          reset: (args) => (0, reset_js_1.reset)(client, args),
          revert: (args) => (0, revert_js_1.revert)(client, args),
          sendUnsignedTransaction: (args) => (0, sendUnsignedTransaction_js_1.sendUnsignedTransaction)(client, args),
          setAutomine: (args) => (0, setAutomine_js_1.setAutomine)(client, args),
          setBalance: (args) => (0, setBalance_js_1.setBalance)(client, args),
          setBlockGasLimit: (args) => (0, setBlockGasLimit_js_1.setBlockGasLimit)(client, args),
          setBlockTimestampInterval: (args) => (0, setBlockTimestampInterval_js_1.setBlockTimestampInterval)(client, args),
          setCode: (args) => (0, setCode_js_1.setCode)(client, args),
          setCoinbase: (args) => (0, setCoinbase_js_1.setCoinbase)(client, args),
          setIntervalMining: (args) => (0, setIntervalMining_js_1.setIntervalMining)(client, args),
          setLoggingEnabled: (args) => (0, setLoggingEnabled_js_1.setLoggingEnabled)(client, args),
          setMinGasPrice: (args) => (0, setMinGasPrice_js_1.setMinGasPrice)(client, args),
          setNextBlockBaseFeePerGas: (args) => (0, setNextBlockBaseFeePerGas_js_1.setNextBlockBaseFeePerGas)(client, args),
          setNextBlockTimestamp: (args) => (0, setNextBlockTimestamp_js_1.setNextBlockTimestamp)(client, args),
          setNonce: (args) => (0, setNonce_js_1.setNonce)(client, args),
          setRpcUrl: (args) => (0, setRpcUrl_js_1.setRpcUrl)(client, args),
          setStorageAt: (args) => (0, setStorageAt_js_1.setStorageAt)(client, args),
          snapshot: () => (0, snapshot_js_1.snapshot)(client),
          stopImpersonatingAccount: (args) => (0, stopImpersonatingAccount_js_1.stopImpersonatingAccount)(client, args)
        };
      };
    }
  }
});

// node_modules/viem/_cjs/clients/createTestClient.js
var require_createTestClient = __commonJS({
  "node_modules/viem/_cjs/clients/createTestClient.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createTestClient = createTestClient;
    var createClient_js_1 = require_createClient();
    var test_js_1 = require_test();
    function createTestClient(parameters) {
      const { key = "test", name = "Test Client", mode } = parameters;
      const client = (0, createClient_js_1.createClient)({
        ...parameters,
        key,
        name,
        type: "testClient"
      });
      return client.extend((config) => ({
        mode,
        ...(0, test_js_1.testActions)({ mode })(config)
      }));
    }
  }
});

// node_modules/viem/_cjs/actions/wallet/addChain.js
var require_addChain = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/addChain.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addChain = addChain;
    var toHex_js_1 = require_toHex();
    async function addChain(client, { chain }) {
      const { id, name, nativeCurrency, rpcUrls, blockExplorers } = chain;
      await client.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: (0, toHex_js_1.numberToHex)(id),
            chainName: name,
            nativeCurrency,
            rpcUrls: rpcUrls.default.http,
            blockExplorerUrls: blockExplorers ? Object.values(blockExplorers).map(({ url }) => url) : void 0
          }
        ]
      }, { dedupe: true, retryCount: 0 });
    }
  }
});

// node_modules/viem/_cjs/actions/wallet/deployContract.js
var require_deployContract = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/deployContract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deployContract = deployContract;
    var encodeDeployData_js_1 = require_encodeDeployData();
    var sendTransaction_js_1 = require_sendTransaction();
    function deployContract(walletClient, parameters) {
      const { abi, args, bytecode, ...request } = parameters;
      const calldata = (0, encodeDeployData_js_1.encodeDeployData)({ abi, args, bytecode });
      return (0, sendTransaction_js_1.sendTransaction)(walletClient, {
        ...request,
        data: calldata
      });
    }
  }
});

// node_modules/viem/_cjs/actions/wallet/getAddresses.js
var require_getAddresses = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/getAddresses.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAddresses = getAddresses;
    var getAddress_js_1 = require_getAddress();
    async function getAddresses(client) {
      var _a;
      if (((_a = client.account) == null ? void 0 : _a.type) === "local")
        return [client.account.address];
      const addresses = await client.request({ method: "eth_accounts" }, { dedupe: true });
      return addresses.map((address) => (0, getAddress_js_1.checksumAddress)(address));
    }
  }
});

// node_modules/viem/_cjs/actions/wallet/getPermissions.js
var require_getPermissions = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/getPermissions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPermissions = getPermissions;
    async function getPermissions(client) {
      const permissions = await client.request({ method: "wallet_getPermissions" }, { dedupe: true });
      return permissions;
    }
  }
});

// node_modules/viem/_cjs/actions/wallet/requestAddresses.js
var require_requestAddresses = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/requestAddresses.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.requestAddresses = requestAddresses;
    var getAddress_js_1 = require_getAddress();
    async function requestAddresses(client) {
      const addresses = await client.request({ method: "eth_requestAccounts" }, { dedupe: true, retryCount: 0 });
      return addresses.map((address) => (0, getAddress_js_1.getAddress)(address));
    }
  }
});

// node_modules/viem/_cjs/actions/wallet/requestPermissions.js
var require_requestPermissions = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/requestPermissions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.requestPermissions = requestPermissions;
    async function requestPermissions(client, permissions) {
      return client.request({
        method: "wallet_requestPermissions",
        params: [permissions]
      }, { retryCount: 0 });
    }
  }
});

// node_modules/viem/_cjs/actions/wallet/signMessage.js
var require_signMessage = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/signMessage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.signMessage = signMessage;
    var parseAccount_js_1 = require_parseAccount();
    var account_js_1 = require_account();
    var toHex_js_1 = require_toHex();
    async function signMessage(client, { account: account_ = client.account, message }) {
      if (!account_)
        throw new account_js_1.AccountNotFoundError({
          docsPath: "/docs/actions/wallet/signMessage"
        });
      const account = (0, parseAccount_js_1.parseAccount)(account_);
      if (account.signMessage)
        return account.signMessage({ message });
      const message_ = (() => {
        if (typeof message === "string")
          return (0, toHex_js_1.stringToHex)(message);
        if (message.raw instanceof Uint8Array)
          return (0, toHex_js_1.toHex)(message.raw);
        return message.raw;
      })();
      return client.request({
        method: "personal_sign",
        params: [message_, account.address]
      }, { retryCount: 0 });
    }
  }
});

// node_modules/viem/_cjs/actions/wallet/signTransaction.js
var require_signTransaction = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/signTransaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.signTransaction = signTransaction;
    var parseAccount_js_1 = require_parseAccount();
    var account_js_1 = require_account();
    var assertCurrentChain_js_1 = require_assertCurrentChain();
    var toHex_js_1 = require_toHex();
    var transactionRequest_js_1 = require_transactionRequest();
    var getAction_js_1 = require_getAction();
    var assertRequest_js_1 = require_assertRequest();
    var getChainId_js_1 = require_getChainId();
    async function signTransaction(client, parameters) {
      var _a, _b, _c, _d;
      const { account: account_ = client.account, chain = client.chain, ...transaction } = parameters;
      if (!account_)
        throw new account_js_1.AccountNotFoundError({
          docsPath: "/docs/actions/wallet/signTransaction"
        });
      const account = (0, parseAccount_js_1.parseAccount)(account_);
      (0, assertRequest_js_1.assertRequest)({
        account,
        ...parameters
      });
      const chainId = await (0, getAction_js_1.getAction)(client, getChainId_js_1.getChainId, "getChainId")({});
      if (chain !== null)
        (0, assertCurrentChain_js_1.assertCurrentChain)({
          currentChainId: chainId,
          chain
        });
      const formatters = (chain == null ? void 0 : chain.formatters) || ((_a = client.chain) == null ? void 0 : _a.formatters);
      const format = ((_b = formatters == null ? void 0 : formatters.transactionRequest) == null ? void 0 : _b.format) || transactionRequest_js_1.formatTransactionRequest;
      if (account.signTransaction)
        return account.signTransaction({
          ...transaction,
          chainId
        }, { serializer: (_d = (_c = client.chain) == null ? void 0 : _c.serializers) == null ? void 0 : _d.transaction });
      return await client.request({
        method: "eth_signTransaction",
        params: [
          {
            ...format(transaction),
            chainId: (0, toHex_js_1.numberToHex)(chainId),
            from: account.address
          }
        ]
      }, { retryCount: 0 });
    }
  }
});

// node_modules/viem/_cjs/actions/wallet/signTypedData.js
var require_signTypedData = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/signTypedData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.signTypedData = signTypedData;
    var parseAccount_js_1 = require_parseAccount();
    var account_js_1 = require_account();
    var typedData_js_1 = require_typedData2();
    async function signTypedData(client, parameters) {
      const { account: account_ = client.account, domain, message, primaryType } = parameters;
      if (!account_)
        throw new account_js_1.AccountNotFoundError({
          docsPath: "/docs/actions/wallet/signTypedData"
        });
      const account = (0, parseAccount_js_1.parseAccount)(account_);
      const types = {
        EIP712Domain: (0, typedData_js_1.getTypesForEIP712Domain)({ domain }),
        ...parameters.types
      };
      (0, typedData_js_1.validateTypedData)({ domain, message, primaryType, types });
      if (account.signTypedData)
        return account.signTypedData({ domain, message, primaryType, types });
      const typedData = (0, typedData_js_1.serializeTypedData)({ domain, message, primaryType, types });
      return client.request({
        method: "eth_signTypedData_v4",
        params: [account.address, typedData]
      }, { retryCount: 0 });
    }
  }
});

// node_modules/viem/_cjs/actions/wallet/switchChain.js
var require_switchChain = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/switchChain.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.switchChain = switchChain;
    var toHex_js_1 = require_toHex();
    async function switchChain(client, { id }) {
      await client.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: (0, toHex_js_1.numberToHex)(id)
          }
        ]
      }, { retryCount: 0 });
    }
  }
});

// node_modules/viem/_cjs/actions/wallet/watchAsset.js
var require_watchAsset = __commonJS({
  "node_modules/viem/_cjs/actions/wallet/watchAsset.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.watchAsset = watchAsset;
    async function watchAsset(client, params) {
      const added = await client.request({
        method: "wallet_watchAsset",
        params
      }, { retryCount: 0 });
      return added;
    }
  }
});

// node_modules/viem/_cjs/clients/decorators/wallet.js
var require_wallet = __commonJS({
  "node_modules/viem/_cjs/clients/decorators/wallet.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.walletActions = walletActions;
    var getChainId_js_1 = require_getChainId();
    var addChain_js_1 = require_addChain();
    var deployContract_js_1 = require_deployContract();
    var getAddresses_js_1 = require_getAddresses();
    var getPermissions_js_1 = require_getPermissions();
    var prepareTransactionRequest_js_1 = require_prepareTransactionRequest();
    var requestAddresses_js_1 = require_requestAddresses();
    var requestPermissions_js_1 = require_requestPermissions();
    var sendRawTransaction_js_1 = require_sendRawTransaction();
    var sendTransaction_js_1 = require_sendTransaction();
    var signMessage_js_1 = require_signMessage();
    var signTransaction_js_1 = require_signTransaction();
    var signTypedData_js_1 = require_signTypedData();
    var switchChain_js_1 = require_switchChain();
    var watchAsset_js_1 = require_watchAsset();
    var writeContract_js_1 = require_writeContract();
    function walletActions(client) {
      return {
        addChain: (args) => (0, addChain_js_1.addChain)(client, args),
        deployContract: (args) => (0, deployContract_js_1.deployContract)(client, args),
        getAddresses: () => (0, getAddresses_js_1.getAddresses)(client),
        getChainId: () => (0, getChainId_js_1.getChainId)(client),
        getPermissions: () => (0, getPermissions_js_1.getPermissions)(client),
        prepareTransactionRequest: (args) => (0, prepareTransactionRequest_js_1.prepareTransactionRequest)(client, args),
        requestAddresses: () => (0, requestAddresses_js_1.requestAddresses)(client),
        requestPermissions: (args) => (0, requestPermissions_js_1.requestPermissions)(client, args),
        sendRawTransaction: (args) => (0, sendRawTransaction_js_1.sendRawTransaction)(client, args),
        sendTransaction: (args) => (0, sendTransaction_js_1.sendTransaction)(client, args),
        signMessage: (args) => (0, signMessage_js_1.signMessage)(client, args),
        signTransaction: (args) => (0, signTransaction_js_1.signTransaction)(client, args),
        signTypedData: (args) => (0, signTypedData_js_1.signTypedData)(client, args),
        switchChain: (args) => (0, switchChain_js_1.switchChain)(client, args),
        watchAsset: (args) => (0, watchAsset_js_1.watchAsset)(client, args),
        writeContract: (args) => (0, writeContract_js_1.writeContract)(client, args)
      };
    }
  }
});

// node_modules/viem/_cjs/clients/createWalletClient.js
var require_createWalletClient = __commonJS({
  "node_modules/viem/_cjs/clients/createWalletClient.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createWalletClient = createWalletClient;
    var createClient_js_1 = require_createClient();
    var wallet_js_1 = require_wallet();
    function createWalletClient(parameters) {
      const { key = "wallet", name = "Wallet Client", transport } = parameters;
      const client = (0, createClient_js_1.createClient)({
        ...parameters,
        key,
        name,
        transport,
        type: "walletClient"
      });
      return client.extend(wallet_js_1.walletActions);
    }
  }
});

// node_modules/viem/_cjs/clients/transports/webSocket.js
var require_webSocket2 = __commonJS({
  "node_modules/viem/_cjs/clients/transports/webSocket.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.webSocket = webSocket;
    var request_js_1 = require_request();
    var transport_js_1 = require_transport();
    var compat_js_1 = require_compat();
    var webSocket_js_1 = require_webSocket();
    var createTransport_js_1 = require_createTransport();
    function webSocket(url, config = {}) {
      const { keepAlive, key = "webSocket", name = "WebSocket JSON-RPC", reconnect, retryDelay } = config;
      return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
        var _a;
        const retryCount = config.retryCount ?? retryCount_;
        const timeout = timeout_ ?? config.timeout ?? 1e4;
        const url_ = url || ((_a = chain == null ? void 0 : chain.rpcUrls.default.webSocket) == null ? void 0 : _a[0]);
        if (!url_)
          throw new transport_js_1.UrlRequiredError();
        return (0, createTransport_js_1.createTransport)({
          key,
          name,
          async request({ method, params }) {
            const body = { method, params };
            const rpcClient = await (0, webSocket_js_1.getWebSocketRpcClient)(url_, {
              keepAlive,
              reconnect
            });
            const { error, result } = await rpcClient.requestAsync({
              body,
              timeout
            });
            if (error)
              throw new request_js_1.RpcRequestError({
                body,
                error,
                url: url_
              });
            return result;
          },
          retryCount,
          retryDelay,
          timeout,
          type: "webSocket"
        }, {
          getSocket() {
            return (0, compat_js_1.getSocket)(url_);
          },
          getRpcClient() {
            return (0, webSocket_js_1.getWebSocketRpcClient)(url_);
          },
          async subscribe({ params, onData, onError }) {
            const rpcClient = await (0, webSocket_js_1.getWebSocketRpcClient)(url_);
            const { result: subscriptionId } = await new Promise((resolve, reject) => rpcClient.request({
              body: {
                method: "eth_subscribe",
                params
              },
              onError(error) {
                reject(error);
                onError == null ? void 0 : onError(error);
                return;
              },
              onResponse(response) {
                if (response.error) {
                  reject(response.error);
                  onError == null ? void 0 : onError(response.error);
                  return;
                }
                if (typeof response.id === "number") {
                  resolve(response);
                  return;
                }
                if (response.method !== "eth_subscription")
                  return;
                onData(response.params);
              }
            }));
            return {
              subscriptionId,
              async unsubscribe() {
                return new Promise((resolve) => rpcClient.request({
                  body: {
                    method: "eth_unsubscribe",
                    params: [subscriptionId]
                  },
                  onResponse: resolve
                }));
              }
            };
          }
        });
      };
    }
  }
});

// node_modules/viem/_cjs/constants/address.js
var require_address2 = __commonJS({
  "node_modules/viem/_cjs/constants/address.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.zeroAddress = exports.entryPoint07Address = exports.entryPoint06Address = void 0;
    exports.entryPoint06Address = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
    exports.entryPoint07Address = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
    exports.zeroAddress = "0x0000000000000000000000000000000000000000";
  }
});

// node_modules/viem/_cjs/types/eip1193.js
var require_eip1193 = __commonJS({
  "node_modules/viem/_cjs/types/eip1193.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProviderRpcError = void 0;
    var ProviderRpcError = class extends Error {
      constructor(code, message) {
        super(message);
        Object.defineProperty(this, "code", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.code = code;
        this.details = message;
      }
    };
    exports.ProviderRpcError = ProviderRpcError;
  }
});

// node_modules/viem/_cjs/utils/abi/decodeDeployData.js
var require_decodeDeployData = __commonJS({
  "node_modules/viem/_cjs/utils/abi/decodeDeployData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeDeployData = decodeDeployData;
    var abi_js_1 = require_abi();
    var decodeAbiParameters_js_1 = require_decodeAbiParameters();
    var docsPath = "/docs/contract/decodeDeployData";
    function decodeDeployData(parameters) {
      const { abi, bytecode, data } = parameters;
      if (data === bytecode)
        return { bytecode };
      const description = abi.find((x) => "type" in x && x.type === "constructor");
      if (!description)
        throw new abi_js_1.AbiConstructorNotFoundError({ docsPath });
      if (!("inputs" in description))
        throw new abi_js_1.AbiConstructorParamsNotFoundError({ docsPath });
      if (!description.inputs || description.inputs.length === 0)
        throw new abi_js_1.AbiConstructorParamsNotFoundError({ docsPath });
      const args = (0, decodeAbiParameters_js_1.decodeAbiParameters)(description.inputs, `0x${data.replace(bytecode, "")}`);
      return { args, bytecode };
    }
  }
});

// node_modules/viem/_cjs/utils/signature/compactSignatureToSignature.js
var require_compactSignatureToSignature = __commonJS({
  "node_modules/viem/_cjs/utils/signature/compactSignatureToSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compactSignatureToSignature = compactSignatureToSignature;
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    function compactSignatureToSignature({ r, yParityAndS }) {
      const yParityAndS_bytes = (0, toBytes_js_1.hexToBytes)(yParityAndS);
      const yParity = yParityAndS_bytes[0] & 128 ? 1 : 0;
      const s = yParityAndS_bytes;
      if (yParity === 1)
        s[0] &= 127;
      return { r, s: (0, toHex_js_1.bytesToHex)(s), yParity };
    }
  }
});

// node_modules/viem/_cjs/utils/signature/parseCompactSignature.js
var require_parseCompactSignature = __commonJS({
  "node_modules/viem/_cjs/utils/signature/parseCompactSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCompactSignature = parseCompactSignature;
    var secp256k1_1 = require_secp256k1();
    var toHex_js_1 = require_toHex();
    function parseCompactSignature(signatureHex) {
      const { r, s } = secp256k1_1.secp256k1.Signature.fromCompact(signatureHex.slice(2, 130));
      return {
        r: (0, toHex_js_1.numberToHex)(r, { size: 32 }),
        yParityAndS: (0, toHex_js_1.numberToHex)(s, { size: 32 })
      };
    }
  }
});

// node_modules/viem/_cjs/utils/signature/parseSignature.js
var require_parseSignature = __commonJS({
  "node_modules/viem/_cjs/utils/signature/parseSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseSignature = parseSignature;
    var secp256k1_1 = require_secp256k1();
    var toHex_js_1 = require_toHex();
    function parseSignature(signatureHex) {
      const { r, s } = secp256k1_1.secp256k1.Signature.fromCompact(signatureHex.slice(2, 130));
      const yParityOrV = Number(`0x${signatureHex.slice(130)}`);
      const [v, yParity] = (() => {
        if (yParityOrV === 0 || yParityOrV === 1)
          return [void 0, yParityOrV];
        if (yParityOrV === 27)
          return [BigInt(yParityOrV), 0];
        if (yParityOrV === 28)
          return [BigInt(yParityOrV), 1];
        throw new Error("Invalid yParityOrV value");
      })();
      if (typeof v !== "undefined")
        return {
          r: (0, toHex_js_1.numberToHex)(r, { size: 32 }),
          s: (0, toHex_js_1.numberToHex)(s, { size: 32 }),
          v,
          yParity
        };
      return {
        r: (0, toHex_js_1.numberToHex)(r, { size: 32 }),
        s: (0, toHex_js_1.numberToHex)(s, { size: 32 }),
        yParity
      };
    }
  }
});

// node_modules/viem/_cjs/utils/signature/recoverTransactionAddress.js
var require_recoverTransactionAddress = __commonJS({
  "node_modules/viem/_cjs/utils/signature/recoverTransactionAddress.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.recoverTransactionAddress = recoverTransactionAddress;
    var keccak256_js_1 = require_keccak256();
    var parseTransaction_js_1 = require_parseTransaction();
    var serializeTransaction_js_1 = require_serializeTransaction();
    var recoverAddress_js_1 = require_recoverAddress();
    async function recoverTransactionAddress(parameters) {
      const { serializedTransaction, signature: signature_ } = parameters;
      const transaction = (0, parseTransaction_js_1.parseTransaction)(serializedTransaction);
      const signature = signature_ ?? {
        r: transaction.r,
        s: transaction.s,
        v: transaction.v,
        yParity: transaction.yParity
      };
      const serialized = (0, serializeTransaction_js_1.serializeTransaction)({
        ...transaction,
        r: void 0,
        s: void 0,
        v: void 0,
        yParity: void 0,
        sidecars: void 0
      });
      return await (0, recoverAddress_js_1.recoverAddress)({
        hash: (0, keccak256_js_1.keccak256)(serialized),
        signature
      });
    }
  }
});

// node_modules/viem/_cjs/utils/signature/signatureToCompactSignature.js
var require_signatureToCompactSignature = __commonJS({
  "node_modules/viem/_cjs/utils/signature/signatureToCompactSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.signatureToCompactSignature = signatureToCompactSignature;
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    function signatureToCompactSignature(signature) {
      const { r, s, v, yParity } = signature;
      const yParity_ = Number(yParity ?? v - 27n);
      let yParityAndS = s;
      if (yParity_ === 1) {
        const bytes = (0, toBytes_js_1.hexToBytes)(s);
        bytes[0] |= 128;
        yParityAndS = (0, toHex_js_1.bytesToHex)(bytes);
      }
      return { r, yParityAndS };
    }
  }
});

// node_modules/viem/_cjs/utils/signature/serializeCompactSignature.js
var require_serializeCompactSignature = __commonJS({
  "node_modules/viem/_cjs/utils/signature/serializeCompactSignature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serializeCompactSignature = serializeCompactSignature;
    var secp256k1_1 = require_secp256k1();
    var fromHex_js_1 = require_fromHex();
    function serializeCompactSignature({ r, yParityAndS }) {
      return `0x${new secp256k1_1.secp256k1.Signature((0, fromHex_js_1.hexToBigInt)(r), (0, fromHex_js_1.hexToBigInt)(yParityAndS)).toCompactHex()}`;
    }
  }
});

// node_modules/viem/_cjs/utils/blob/sidecarsToVersionedHashes.js
var require_sidecarsToVersionedHashes = __commonJS({
  "node_modules/viem/_cjs/utils/blob/sidecarsToVersionedHashes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sidecarsToVersionedHashes = sidecarsToVersionedHashes;
    var commitmentToVersionedHash_js_1 = require_commitmentToVersionedHash();
    function sidecarsToVersionedHashes(parameters) {
      const { sidecars, version } = parameters;
      const to = parameters.to ?? (typeof sidecars[0].blob === "string" ? "hex" : "bytes");
      const hashes = [];
      for (const { commitment } of sidecars) {
        hashes.push((0, commitmentToVersionedHash_js_1.commitmentToVersionedHash)({
          commitment,
          to,
          version
        }));
      }
      return hashes;
    }
  }
});

// node_modules/viem/_cjs/utils/blob/fromBlobs.js
var require_fromBlobs = __commonJS({
  "node_modules/viem/_cjs/utils/blob/fromBlobs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromBlobs = fromBlobs;
    var cursor_js_1 = require_cursor2();
    var toBytes_js_1 = require_toBytes();
    var toHex_js_1 = require_toHex();
    function fromBlobs(parameters) {
      const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
      const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => (0, toBytes_js_1.hexToBytes)(x)) : parameters.blobs;
      const length = blobs.reduce((length2, blob) => length2 + blob.length, 0);
      const data = (0, cursor_js_1.createCursor)(new Uint8Array(length));
      let active = true;
      for (const blob of blobs) {
        const cursor = (0, cursor_js_1.createCursor)(blob);
        while (active && cursor.position < blob.length) {
          cursor.incrementPosition(1);
          let consume = 31;
          if (blob.length - cursor.position < 31)
            consume = blob.length - cursor.position;
          for (const _ in Array.from({ length: consume })) {
            const byte = cursor.readByte();
            const isTerminator = byte === 128 && !cursor.inspectBytes(cursor.remaining).includes(128);
            if (isTerminator) {
              active = false;
              break;
            }
            data.pushByte(byte);
          }
        }
      }
      const trimmedData = data.bytes.slice(0, data.position);
      return to === "hex" ? (0, toHex_js_1.bytesToHex)(trimmedData) : trimmedData;
    }
  }
});

// node_modules/viem/_cjs/utils/kzg/defineKzg.js
var require_defineKzg = __commonJS({
  "node_modules/viem/_cjs/utils/kzg/defineKzg.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defineKzg = defineKzg;
    function defineKzg({ blobToKzgCommitment, computeBlobKzgProof }) {
      return {
        blobToKzgCommitment,
        computeBlobKzgProof
      };
    }
  }
});

// node_modules/viem/_cjs/utils/kzg/setupKzg.js
var require_setupKzg = __commonJS({
  "node_modules/viem/_cjs/utils/kzg/setupKzg.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setupKzg = setupKzg;
    var defineKzg_js_1 = require_defineKzg();
    function setupKzg(parameters, path) {
      try {
        parameters.loadTrustedSetup(path);
      } catch (e) {
        const error = e;
        if (!error.message.includes("trusted setup is already loaded"))
          throw error;
      }
      return (0, defineKzg_js_1.defineKzg)(parameters);
    }
  }
});

// node_modules/viem/_cjs/index.js
var require_cjs = __commonJS({
  "node_modules/viem/_cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.maxInt40 = exports.maxInt32 = exports.maxInt24 = exports.maxInt16 = exports.maxInt8 = exports.weiUnits = exports.gweiUnits = exports.etherUnits = exports.universalSignatureValidatorByteCode = exports.deploylessCallViaFactoryBytecode = exports.deploylessCallViaBytecodeBytecode = exports.zeroAddress = exports.universalSignatureValidatorAbi = exports.erc4626Abi = exports.erc721Abi = exports.erc20Abi_bytes32 = exports.erc20Abi = exports.multicall3Abi = exports.webSocket = exports.createWalletClient = exports.createTransport = exports.walletActions = exports.testActions = exports.publicActions = exports.createTestClient = exports.createPublicClient = exports.http = exports.fallback = exports.custom = exports.rpcSchema = exports.createClient = exports.getContract = exports.parseAbiParameters = exports.parseAbiParameter = exports.parseAbiItem = exports.parseAbi = exports.UnknownSignatureError = exports.UnknownTypeError = exports.SolidityProtectedKeywordError = exports.InvalidStructSignatureError = exports.InvalidSignatureError = exports.InvalidParenthesisError = exports.InvalidParameterError = exports.InvalidModifierError = exports.InvalidFunctionModifierError = exports.InvalidAbiTypeParameterError = exports.InvalidAbiItemError = exports.InvalidAbiParametersError = exports.InvalidAbiParameterError = exports.CircularReferenceError = void 0;
    exports.maxUint184 = exports.maxUint176 = exports.maxUint168 = exports.maxUint160 = exports.maxUint152 = exports.maxUint144 = exports.maxUint136 = exports.maxUint128 = exports.maxUint120 = exports.maxUint112 = exports.maxUint104 = exports.maxUint96 = exports.maxUint88 = exports.maxUint80 = exports.maxUint72 = exports.maxUint64 = exports.maxUint56 = exports.maxUint48 = exports.maxUint40 = exports.maxUint32 = exports.maxUint24 = exports.maxUint16 = exports.maxUint8 = exports.maxInt256 = exports.maxInt248 = exports.maxInt240 = exports.maxInt232 = exports.maxInt224 = exports.maxInt216 = exports.maxInt208 = exports.maxInt200 = exports.maxInt192 = exports.maxInt184 = exports.maxInt176 = exports.maxInt168 = exports.maxInt160 = exports.maxInt152 = exports.maxInt144 = exports.maxInt136 = exports.maxInt128 = exports.maxInt120 = exports.maxInt112 = exports.maxInt104 = exports.maxInt96 = exports.maxInt88 = exports.maxInt80 = exports.maxInt72 = exports.maxInt64 = exports.maxInt56 = exports.maxInt48 = void 0;
    exports.AbiEncodingLengthMismatchError = exports.AbiEncodingArrayLengthMismatchError = exports.AbiDecodingZeroDataError = exports.AbiDecodingDataSizeTooSmallError = exports.AbiDecodingDataSizeInvalidError = exports.AbiConstructorParamsNotFoundError = exports.AbiConstructorNotFoundError = exports.presignMessagePrefix = exports.zeroHash = exports.minInt256 = exports.minInt248 = exports.minInt240 = exports.minInt232 = exports.minInt224 = exports.minInt216 = exports.minInt208 = exports.minInt200 = exports.minInt192 = exports.minInt184 = exports.minInt176 = exports.minInt168 = exports.minInt160 = exports.minInt152 = exports.minInt144 = exports.minInt136 = exports.minInt128 = exports.minInt120 = exports.minInt112 = exports.minInt104 = exports.minInt96 = exports.minInt88 = exports.minInt80 = exports.minInt72 = exports.minInt64 = exports.minInt56 = exports.minInt48 = exports.minInt40 = exports.minInt32 = exports.minInt24 = exports.minInt16 = exports.minInt8 = exports.maxUint256 = exports.maxUint248 = exports.maxUint240 = exports.maxUint232 = exports.maxUint224 = exports.maxUint216 = exports.maxUint208 = exports.maxUint200 = exports.maxUint192 = void 0;
    exports.UnsupportedProviderMethodError = exports.UnknownRpcError = exports.UnauthorizedProviderError = exports.TransactionRejectedRpcError = exports.SwitchChainError = exports.RpcError = exports.ResourceUnavailableRpcError = exports.ResourceNotFoundRpcError = exports.ProviderRpcError = exports.ProviderDisconnectedError = exports.ParseRpcError = exports.MethodNotSupportedRpcError = exports.MethodNotFoundRpcError = exports.LimitExceededRpcError = exports.JsonRpcVersionUnsupportedError = exports.InvalidRequestRpcError = exports.InvalidParamsRpcError = exports.InvalidInputRpcError = exports.InternalRpcError = exports.ChainDisconnectedError = exports.MaxFeePerGasTooLowError = exports.Eip1559FeesNotSupportedError = exports.BaseFeeScalarError = exports.CounterfactualDeploymentFailedError = exports.RawContractError = exports.ContractFunctionZeroDataError = exports.ContractFunctionRevertedError = exports.ContractFunctionExecutionError = exports.CallExecutionError = exports.BlockNotFoundError = exports.setErrorConfig = exports.BaseError = exports.UnsupportedPackedAbiType = exports.InvalidDefinitionTypeError = exports.InvalidArrayError = exports.InvalidAbiEncodingTypeError = exports.InvalidAbiDecodingTypeError = exports.DecodeLogTopicsMismatch = exports.DecodeLogDataMismatch = exports.BytesSizeMismatchError = exports.AbiFunctionSignatureNotFoundError = exports.AbiFunctionOutputsNotFoundError = exports.AbiFunctionNotFoundError = exports.AbiEventSignatureNotFoundError = exports.AbiEventSignatureEmptyTopicsError = exports.AbiEventNotFoundError = exports.AbiErrorSignatureNotFoundError = exports.AbiErrorNotFoundError = exports.AbiErrorInputsNotFoundError = exports.AbiEncodingBytesSizeMismatchError = void 0;
    exports.StateAssignmentConflictError = exports.AccountStateConflictError = exports.UrlRequiredError = exports.SliceOffsetOutOfBoundsError = exports.SizeExceedsPaddingSizeError = exports.WaitForTransactionReceiptTimeoutError = exports.TransactionReceiptNotFoundError = exports.TransactionNotFoundError = exports.TransactionExecutionError = exports.InvalidStorageKeySizeError = exports.InvalidSerializedTransactionTypeError = exports.InvalidSerializedTransactionError = exports.InvalidSerializableTransactionError = exports.InvalidLegacyVError = exports.FeeConflictError = exports.InvalidAddressError = exports.WebSocketRequestError = exports.SocketClosedError = exports.TimeoutError = exports.RpcRequestError = exports.HttpRequestError = exports.FilterTypeNotSupportedError = exports.UnknownNodeError = exports.TransactionTypeNotSupportedError = exports.TipAboveFeeCapError = exports.NonceTooLowError = exports.NonceTooHighError = exports.NonceMaxValueError = exports.IntrinsicGasTooLowError = exports.IntrinsicGasTooHighError = exports.InsufficientFundsError = exports.FeeCapTooLowError = exports.FeeCapTooHighError = exports.ExecutionRevertedError = exports.EstimateGasExecutionError = exports.InvalidDecimalNumberError = exports.EnsAvatarUnsupportedNamespaceError = exports.EnsAvatarInvalidNftUriError = exports.EnsAvatarUriResolutionError = exports.SizeOverflowError = exports.InvalidHexValueError = exports.InvalidHexBooleanError = exports.IntegerOutOfRangeError = exports.InvalidBytesBooleanError = exports.InvalidChainIdError = exports.ClientChainNotConfiguredError = exports.ChainNotFoundError = exports.ChainMismatchError = exports.ChainDoesNotSupportContract = exports.UserRejectedRequestError = void 0;
    exports.recoverTypedDataAddress = exports.recoverTransactionAddress = exports.recoverPublicKey = exports.recoverMessageAddress = exports.recoverAddress = exports.parseSignature = exports.hexToSignature = exports.parseCompactSignature = exports.hexToCompactSignature = exports.compactSignatureToSignature = exports.hashTypedData = exports.hashStruct = exports.hashDomain = exports.getTransactionType = exports.getSerializedTransactionType = exports.getCreateAddress = exports.getCreate2Address = exports.getContractAddress = exports.getAbiItem = exports.rpcTransactionType = exports.formatTransactionRequest = exports.defineTransactionRequest = exports.formatTransactionReceipt = exports.defineTransactionReceipt = exports.transactionType = exports.formatTransaction = exports.defineTransaction = exports.parseEventLogs = exports.encodeFunctionResult = exports.prepareEncodeFunctionData = exports.encodeFunctionData = exports.encodeEventTopics = exports.encodeErrorResult = exports.encodeDeployData = exports.encodeAbiParameters = exports.decodeFunctionResult = exports.decodeFunctionData = exports.decodeEventLog = exports.decodeErrorResult = exports.decodeDeployData = exports.decodeAbiParameters = exports.formatLog = exports.formatBlock = exports.defineBlock = exports.namehash = exports.labelhash = exports.EIP1193ProviderRpcError = exports.InvalidStructTypeError = exports.InvalidPrimaryTypeError = exports.InvalidDomainError = void 0;
    exports.concatBytes = exports.concat = exports.setupKzg = exports.defineKzg = exports.toBlobs = exports.toBlobSidecars = exports.fromBlobs = exports.blobsToProofs = exports.sidecarsToVersionedHashes = exports.commitmentsToVersionedHashes = exports.commitmentToVersionedHash = exports.blobsToCommitments = exports.offchainLookupSignature = exports.offchainLookupAbiItem = exports.offchainLookup = exports.ccipFetch = exports.ccipRequest = exports.fromBytes = exports.bytesToString = exports.bytesToNumber = exports.bytesToBool = exports.bytesToBigInt = exports.toHex = exports.stringToHex = exports.numberToHex = exports.bytesToHex = exports.boolToHex = exports.toBytes = exports.stringToBytes = exports.numberToBytes = exports.hexToBytes = exports.boolToBytes = exports.assertTransactionLegacy = exports.assertTransactionEIP2930 = exports.assertTransactionEIP1559 = exports.assertRequest = exports.serializeErc6492Signature = exports.isErc6492Signature = exports.parseErc6492Signature = exports.verifyTypedData = exports.verifyMessage = exports.verifyHash = exports.toRlp = exports.hexToRlp = exports.bytesToRlp = exports.serializeSignature = exports.signatureToHex = exports.serializeCompactSignature = exports.compactSignatureToHex = exports.signatureToCompactSignature = void 0;
    exports.size = exports.serializeTransaction = exports.serializeAccessList = exports.parseUnits = exports.parseTransaction = exports.parseGwei = exports.parseEther = exports.padHex = exports.padBytes = exports.pad = exports.ripemd160 = exports.sha256 = exports.keccak256 = exports.isHex = exports.isHash = exports.isBytes = exports.isAddressEqual = exports.isAddress = exports.toPrefixedMessage = exports.hashMessage = exports.toFunctionHash = exports.toEventHash = exports.getFunctionSignature = exports.toFunctionSignature = exports.getEventSignature = exports.toEventSignature = exports.getFunctionSelector = exports.toFunctionSelector = exports.getEventSelector = exports.toEventSelector = exports.getContractError = exports.getAddress = exports.checksumAddress = exports.fromRlp = exports.hexToString = exports.hexToNumber = exports.hexToBool = exports.hexToBigInt = exports.fromHex = exports.formatUnits = exports.formatGwei = exports.formatEther = exports.withTimeout = exports.withRetry = exports.encodePacked = exports.getChainContractAddress = exports.extractChain = exports.defineChain = exports.assertCurrentChain = exports.concatHex = void 0;
    exports.nonceManager = exports.createNonceManager = exports.getTypesForEIP712Domain = exports.domainSeparator = exports.validateTypedData = exports.serializeTypedData = exports.trim = exports.stringify = exports.sliceHex = exports.sliceBytes = exports.slice = void 0;
    var abitype_1 = require_exports();
    Object.defineProperty(exports, "CircularReferenceError", { enumerable: true, get: function() {
      return abitype_1.CircularReferenceError;
    } });
    Object.defineProperty(exports, "InvalidAbiParameterError", { enumerable: true, get: function() {
      return abitype_1.InvalidAbiParameterError;
    } });
    Object.defineProperty(exports, "InvalidAbiParametersError", { enumerable: true, get: function() {
      return abitype_1.InvalidAbiParametersError;
    } });
    Object.defineProperty(exports, "InvalidAbiItemError", { enumerable: true, get: function() {
      return abitype_1.InvalidAbiItemError;
    } });
    Object.defineProperty(exports, "InvalidAbiTypeParameterError", { enumerable: true, get: function() {
      return abitype_1.InvalidAbiTypeParameterError;
    } });
    Object.defineProperty(exports, "InvalidFunctionModifierError", { enumerable: true, get: function() {
      return abitype_1.InvalidFunctionModifierError;
    } });
    Object.defineProperty(exports, "InvalidModifierError", { enumerable: true, get: function() {
      return abitype_1.InvalidModifierError;
    } });
    Object.defineProperty(exports, "InvalidParameterError", { enumerable: true, get: function() {
      return abitype_1.InvalidParameterError;
    } });
    Object.defineProperty(exports, "InvalidParenthesisError", { enumerable: true, get: function() {
      return abitype_1.InvalidParenthesisError;
    } });
    Object.defineProperty(exports, "InvalidSignatureError", { enumerable: true, get: function() {
      return abitype_1.InvalidSignatureError;
    } });
    Object.defineProperty(exports, "InvalidStructSignatureError", { enumerable: true, get: function() {
      return abitype_1.InvalidStructSignatureError;
    } });
    Object.defineProperty(exports, "SolidityProtectedKeywordError", { enumerable: true, get: function() {
      return abitype_1.SolidityProtectedKeywordError;
    } });
    Object.defineProperty(exports, "UnknownTypeError", { enumerable: true, get: function() {
      return abitype_1.UnknownTypeError;
    } });
    Object.defineProperty(exports, "UnknownSignatureError", { enumerable: true, get: function() {
      return abitype_1.UnknownSignatureError;
    } });
    Object.defineProperty(exports, "parseAbi", { enumerable: true, get: function() {
      return abitype_1.parseAbi;
    } });
    Object.defineProperty(exports, "parseAbiItem", { enumerable: true, get: function() {
      return abitype_1.parseAbiItem;
    } });
    Object.defineProperty(exports, "parseAbiParameter", { enumerable: true, get: function() {
      return abitype_1.parseAbiParameter;
    } });
    Object.defineProperty(exports, "parseAbiParameters", { enumerable: true, get: function() {
      return abitype_1.parseAbiParameters;
    } });
    var getContract_js_1 = require_getContract();
    Object.defineProperty(exports, "getContract", { enumerable: true, get: function() {
      return getContract_js_1.getContract;
    } });
    var createClient_js_1 = require_createClient();
    Object.defineProperty(exports, "createClient", { enumerable: true, get: function() {
      return createClient_js_1.createClient;
    } });
    Object.defineProperty(exports, "rpcSchema", { enumerable: true, get: function() {
      return createClient_js_1.rpcSchema;
    } });
    var custom_js_1 = require_custom();
    Object.defineProperty(exports, "custom", { enumerable: true, get: function() {
      return custom_js_1.custom;
    } });
    var fallback_js_1 = require_fallback();
    Object.defineProperty(exports, "fallback", { enumerable: true, get: function() {
      return fallback_js_1.fallback;
    } });
    var http_js_1 = require_http2();
    Object.defineProperty(exports, "http", { enumerable: true, get: function() {
      return http_js_1.http;
    } });
    var createPublicClient_js_1 = require_createPublicClient();
    Object.defineProperty(exports, "createPublicClient", { enumerable: true, get: function() {
      return createPublicClient_js_1.createPublicClient;
    } });
    var createTestClient_js_1 = require_createTestClient();
    Object.defineProperty(exports, "createTestClient", { enumerable: true, get: function() {
      return createTestClient_js_1.createTestClient;
    } });
    var public_js_1 = require_public();
    Object.defineProperty(exports, "publicActions", { enumerable: true, get: function() {
      return public_js_1.publicActions;
    } });
    var test_js_1 = require_test();
    Object.defineProperty(exports, "testActions", { enumerable: true, get: function() {
      return test_js_1.testActions;
    } });
    var wallet_js_1 = require_wallet();
    Object.defineProperty(exports, "walletActions", { enumerable: true, get: function() {
      return wallet_js_1.walletActions;
    } });
    var createTransport_js_1 = require_createTransport();
    Object.defineProperty(exports, "createTransport", { enumerable: true, get: function() {
      return createTransport_js_1.createTransport;
    } });
    var createWalletClient_js_1 = require_createWalletClient();
    Object.defineProperty(exports, "createWalletClient", { enumerable: true, get: function() {
      return createWalletClient_js_1.createWalletClient;
    } });
    var webSocket_js_1 = require_webSocket2();
    Object.defineProperty(exports, "webSocket", { enumerable: true, get: function() {
      return webSocket_js_1.webSocket;
    } });
    var abis_js_1 = require_abis();
    Object.defineProperty(exports, "multicall3Abi", { enumerable: true, get: function() {
      return abis_js_1.multicall3Abi;
    } });
    Object.defineProperty(exports, "erc20Abi", { enumerable: true, get: function() {
      return abis_js_1.erc20Abi;
    } });
    Object.defineProperty(exports, "erc20Abi_bytes32", { enumerable: true, get: function() {
      return abis_js_1.erc20Abi_bytes32;
    } });
    Object.defineProperty(exports, "erc721Abi", { enumerable: true, get: function() {
      return abis_js_1.erc721Abi;
    } });
    Object.defineProperty(exports, "erc4626Abi", { enumerable: true, get: function() {
      return abis_js_1.erc4626Abi;
    } });
    Object.defineProperty(exports, "universalSignatureValidatorAbi", { enumerable: true, get: function() {
      return abis_js_1.universalSignatureValidatorAbi;
    } });
    var address_js_1 = require_address2();
    Object.defineProperty(exports, "zeroAddress", { enumerable: true, get: function() {
      return address_js_1.zeroAddress;
    } });
    var contracts_js_1 = require_contracts();
    Object.defineProperty(exports, "deploylessCallViaBytecodeBytecode", { enumerable: true, get: function() {
      return contracts_js_1.deploylessCallViaBytecodeBytecode;
    } });
    Object.defineProperty(exports, "deploylessCallViaFactoryBytecode", { enumerable: true, get: function() {
      return contracts_js_1.deploylessCallViaFactoryBytecode;
    } });
    Object.defineProperty(exports, "universalSignatureValidatorByteCode", { enumerable: true, get: function() {
      return contracts_js_1.universalSignatureValidatorByteCode;
    } });
    var unit_js_1 = require_unit();
    Object.defineProperty(exports, "etherUnits", { enumerable: true, get: function() {
      return unit_js_1.etherUnits;
    } });
    Object.defineProperty(exports, "gweiUnits", { enumerable: true, get: function() {
      return unit_js_1.gweiUnits;
    } });
    Object.defineProperty(exports, "weiUnits", { enumerable: true, get: function() {
      return unit_js_1.weiUnits;
    } });
    var number_js_1 = require_number();
    Object.defineProperty(exports, "maxInt8", { enumerable: true, get: function() {
      return number_js_1.maxInt8;
    } });
    Object.defineProperty(exports, "maxInt16", { enumerable: true, get: function() {
      return number_js_1.maxInt16;
    } });
    Object.defineProperty(exports, "maxInt24", { enumerable: true, get: function() {
      return number_js_1.maxInt24;
    } });
    Object.defineProperty(exports, "maxInt32", { enumerable: true, get: function() {
      return number_js_1.maxInt32;
    } });
    Object.defineProperty(exports, "maxInt40", { enumerable: true, get: function() {
      return number_js_1.maxInt40;
    } });
    Object.defineProperty(exports, "maxInt48", { enumerable: true, get: function() {
      return number_js_1.maxInt48;
    } });
    Object.defineProperty(exports, "maxInt56", { enumerable: true, get: function() {
      return number_js_1.maxInt56;
    } });
    Object.defineProperty(exports, "maxInt64", { enumerable: true, get: function() {
      return number_js_1.maxInt64;
    } });
    Object.defineProperty(exports, "maxInt72", { enumerable: true, get: function() {
      return number_js_1.maxInt72;
    } });
    Object.defineProperty(exports, "maxInt80", { enumerable: true, get: function() {
      return number_js_1.maxInt80;
    } });
    Object.defineProperty(exports, "maxInt88", { enumerable: true, get: function() {
      return number_js_1.maxInt88;
    } });
    Object.defineProperty(exports, "maxInt96", { enumerable: true, get: function() {
      return number_js_1.maxInt96;
    } });
    Object.defineProperty(exports, "maxInt104", { enumerable: true, get: function() {
      return number_js_1.maxInt104;
    } });
    Object.defineProperty(exports, "maxInt112", { enumerable: true, get: function() {
      return number_js_1.maxInt112;
    } });
    Object.defineProperty(exports, "maxInt120", { enumerable: true, get: function() {
      return number_js_1.maxInt120;
    } });
    Object.defineProperty(exports, "maxInt128", { enumerable: true, get: function() {
      return number_js_1.maxInt128;
    } });
    Object.defineProperty(exports, "maxInt136", { enumerable: true, get: function() {
      return number_js_1.maxInt136;
    } });
    Object.defineProperty(exports, "maxInt144", { enumerable: true, get: function() {
      return number_js_1.maxInt144;
    } });
    Object.defineProperty(exports, "maxInt152", { enumerable: true, get: function() {
      return number_js_1.maxInt152;
    } });
    Object.defineProperty(exports, "maxInt160", { enumerable: true, get: function() {
      return number_js_1.maxInt160;
    } });
    Object.defineProperty(exports, "maxInt168", { enumerable: true, get: function() {
      return number_js_1.maxInt168;
    } });
    Object.defineProperty(exports, "maxInt176", { enumerable: true, get: function() {
      return number_js_1.maxInt176;
    } });
    Object.defineProperty(exports, "maxInt184", { enumerable: true, get: function() {
      return number_js_1.maxInt184;
    } });
    Object.defineProperty(exports, "maxInt192", { enumerable: true, get: function() {
      return number_js_1.maxInt192;
    } });
    Object.defineProperty(exports, "maxInt200", { enumerable: true, get: function() {
      return number_js_1.maxInt200;
    } });
    Object.defineProperty(exports, "maxInt208", { enumerable: true, get: function() {
      return number_js_1.maxInt208;
    } });
    Object.defineProperty(exports, "maxInt216", { enumerable: true, get: function() {
      return number_js_1.maxInt216;
    } });
    Object.defineProperty(exports, "maxInt224", { enumerable: true, get: function() {
      return number_js_1.maxInt224;
    } });
    Object.defineProperty(exports, "maxInt232", { enumerable: true, get: function() {
      return number_js_1.maxInt232;
    } });
    Object.defineProperty(exports, "maxInt240", { enumerable: true, get: function() {
      return number_js_1.maxInt240;
    } });
    Object.defineProperty(exports, "maxInt248", { enumerable: true, get: function() {
      return number_js_1.maxInt248;
    } });
    Object.defineProperty(exports, "maxInt256", { enumerable: true, get: function() {
      return number_js_1.maxInt256;
    } });
    Object.defineProperty(exports, "maxUint8", { enumerable: true, get: function() {
      return number_js_1.maxUint8;
    } });
    Object.defineProperty(exports, "maxUint16", { enumerable: true, get: function() {
      return number_js_1.maxUint16;
    } });
    Object.defineProperty(exports, "maxUint24", { enumerable: true, get: function() {
      return number_js_1.maxUint24;
    } });
    Object.defineProperty(exports, "maxUint32", { enumerable: true, get: function() {
      return number_js_1.maxUint32;
    } });
    Object.defineProperty(exports, "maxUint40", { enumerable: true, get: function() {
      return number_js_1.maxUint40;
    } });
    Object.defineProperty(exports, "maxUint48", { enumerable: true, get: function() {
      return number_js_1.maxUint48;
    } });
    Object.defineProperty(exports, "maxUint56", { enumerable: true, get: function() {
      return number_js_1.maxUint56;
    } });
    Object.defineProperty(exports, "maxUint64", { enumerable: true, get: function() {
      return number_js_1.maxUint64;
    } });
    Object.defineProperty(exports, "maxUint72", { enumerable: true, get: function() {
      return number_js_1.maxUint72;
    } });
    Object.defineProperty(exports, "maxUint80", { enumerable: true, get: function() {
      return number_js_1.maxUint80;
    } });
    Object.defineProperty(exports, "maxUint88", { enumerable: true, get: function() {
      return number_js_1.maxUint88;
    } });
    Object.defineProperty(exports, "maxUint96", { enumerable: true, get: function() {
      return number_js_1.maxUint96;
    } });
    Object.defineProperty(exports, "maxUint104", { enumerable: true, get: function() {
      return number_js_1.maxUint104;
    } });
    Object.defineProperty(exports, "maxUint112", { enumerable: true, get: function() {
      return number_js_1.maxUint112;
    } });
    Object.defineProperty(exports, "maxUint120", { enumerable: true, get: function() {
      return number_js_1.maxUint120;
    } });
    Object.defineProperty(exports, "maxUint128", { enumerable: true, get: function() {
      return number_js_1.maxUint128;
    } });
    Object.defineProperty(exports, "maxUint136", { enumerable: true, get: function() {
      return number_js_1.maxUint136;
    } });
    Object.defineProperty(exports, "maxUint144", { enumerable: true, get: function() {
      return number_js_1.maxUint144;
    } });
    Object.defineProperty(exports, "maxUint152", { enumerable: true, get: function() {
      return number_js_1.maxUint152;
    } });
    Object.defineProperty(exports, "maxUint160", { enumerable: true, get: function() {
      return number_js_1.maxUint160;
    } });
    Object.defineProperty(exports, "maxUint168", { enumerable: true, get: function() {
      return number_js_1.maxUint168;
    } });
    Object.defineProperty(exports, "maxUint176", { enumerable: true, get: function() {
      return number_js_1.maxUint176;
    } });
    Object.defineProperty(exports, "maxUint184", { enumerable: true, get: function() {
      return number_js_1.maxUint184;
    } });
    Object.defineProperty(exports, "maxUint192", { enumerable: true, get: function() {
      return number_js_1.maxUint192;
    } });
    Object.defineProperty(exports, "maxUint200", { enumerable: true, get: function() {
      return number_js_1.maxUint200;
    } });
    Object.defineProperty(exports, "maxUint208", { enumerable: true, get: function() {
      return number_js_1.maxUint208;
    } });
    Object.defineProperty(exports, "maxUint216", { enumerable: true, get: function() {
      return number_js_1.maxUint216;
    } });
    Object.defineProperty(exports, "maxUint224", { enumerable: true, get: function() {
      return number_js_1.maxUint224;
    } });
    Object.defineProperty(exports, "maxUint232", { enumerable: true, get: function() {
      return number_js_1.maxUint232;
    } });
    Object.defineProperty(exports, "maxUint240", { enumerable: true, get: function() {
      return number_js_1.maxUint240;
    } });
    Object.defineProperty(exports, "maxUint248", { enumerable: true, get: function() {
      return number_js_1.maxUint248;
    } });
    Object.defineProperty(exports, "maxUint256", { enumerable: true, get: function() {
      return number_js_1.maxUint256;
    } });
    Object.defineProperty(exports, "minInt8", { enumerable: true, get: function() {
      return number_js_1.minInt8;
    } });
    Object.defineProperty(exports, "minInt16", { enumerable: true, get: function() {
      return number_js_1.minInt16;
    } });
    Object.defineProperty(exports, "minInt24", { enumerable: true, get: function() {
      return number_js_1.minInt24;
    } });
    Object.defineProperty(exports, "minInt32", { enumerable: true, get: function() {
      return number_js_1.minInt32;
    } });
    Object.defineProperty(exports, "minInt40", { enumerable: true, get: function() {
      return number_js_1.minInt40;
    } });
    Object.defineProperty(exports, "minInt48", { enumerable: true, get: function() {
      return number_js_1.minInt48;
    } });
    Object.defineProperty(exports, "minInt56", { enumerable: true, get: function() {
      return number_js_1.minInt56;
    } });
    Object.defineProperty(exports, "minInt64", { enumerable: true, get: function() {
      return number_js_1.minInt64;
    } });
    Object.defineProperty(exports, "minInt72", { enumerable: true, get: function() {
      return number_js_1.minInt72;
    } });
    Object.defineProperty(exports, "minInt80", { enumerable: true, get: function() {
      return number_js_1.minInt80;
    } });
    Object.defineProperty(exports, "minInt88", { enumerable: true, get: function() {
      return number_js_1.minInt88;
    } });
    Object.defineProperty(exports, "minInt96", { enumerable: true, get: function() {
      return number_js_1.minInt96;
    } });
    Object.defineProperty(exports, "minInt104", { enumerable: true, get: function() {
      return number_js_1.minInt104;
    } });
    Object.defineProperty(exports, "minInt112", { enumerable: true, get: function() {
      return number_js_1.minInt112;
    } });
    Object.defineProperty(exports, "minInt120", { enumerable: true, get: function() {
      return number_js_1.minInt120;
    } });
    Object.defineProperty(exports, "minInt128", { enumerable: true, get: function() {
      return number_js_1.minInt128;
    } });
    Object.defineProperty(exports, "minInt136", { enumerable: true, get: function() {
      return number_js_1.minInt136;
    } });
    Object.defineProperty(exports, "minInt144", { enumerable: true, get: function() {
      return number_js_1.minInt144;
    } });
    Object.defineProperty(exports, "minInt152", { enumerable: true, get: function() {
      return number_js_1.minInt152;
    } });
    Object.defineProperty(exports, "minInt160", { enumerable: true, get: function() {
      return number_js_1.minInt160;
    } });
    Object.defineProperty(exports, "minInt168", { enumerable: true, get: function() {
      return number_js_1.minInt168;
    } });
    Object.defineProperty(exports, "minInt176", { enumerable: true, get: function() {
      return number_js_1.minInt176;
    } });
    Object.defineProperty(exports, "minInt184", { enumerable: true, get: function() {
      return number_js_1.minInt184;
    } });
    Object.defineProperty(exports, "minInt192", { enumerable: true, get: function() {
      return number_js_1.minInt192;
    } });
    Object.defineProperty(exports, "minInt200", { enumerable: true, get: function() {
      return number_js_1.minInt200;
    } });
    Object.defineProperty(exports, "minInt208", { enumerable: true, get: function() {
      return number_js_1.minInt208;
    } });
    Object.defineProperty(exports, "minInt216", { enumerable: true, get: function() {
      return number_js_1.minInt216;
    } });
    Object.defineProperty(exports, "minInt224", { enumerable: true, get: function() {
      return number_js_1.minInt224;
    } });
    Object.defineProperty(exports, "minInt232", { enumerable: true, get: function() {
      return number_js_1.minInt232;
    } });
    Object.defineProperty(exports, "minInt240", { enumerable: true, get: function() {
      return number_js_1.minInt240;
    } });
    Object.defineProperty(exports, "minInt248", { enumerable: true, get: function() {
      return number_js_1.minInt248;
    } });
    Object.defineProperty(exports, "minInt256", { enumerable: true, get: function() {
      return number_js_1.minInt256;
    } });
    var bytes_js_1 = require_bytes();
    Object.defineProperty(exports, "zeroHash", { enumerable: true, get: function() {
      return bytes_js_1.zeroHash;
    } });
    var strings_js_1 = require_strings();
    Object.defineProperty(exports, "presignMessagePrefix", { enumerable: true, get: function() {
      return strings_js_1.presignMessagePrefix;
    } });
    var abi_js_1 = require_abi();
    Object.defineProperty(exports, "AbiConstructorNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiConstructorNotFoundError;
    } });
    Object.defineProperty(exports, "AbiConstructorParamsNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiConstructorParamsNotFoundError;
    } });
    Object.defineProperty(exports, "AbiDecodingDataSizeInvalidError", { enumerable: true, get: function() {
      return abi_js_1.AbiDecodingDataSizeInvalidError;
    } });
    Object.defineProperty(exports, "AbiDecodingDataSizeTooSmallError", { enumerable: true, get: function() {
      return abi_js_1.AbiDecodingDataSizeTooSmallError;
    } });
    Object.defineProperty(exports, "AbiDecodingZeroDataError", { enumerable: true, get: function() {
      return abi_js_1.AbiDecodingZeroDataError;
    } });
    Object.defineProperty(exports, "AbiEncodingArrayLengthMismatchError", { enumerable: true, get: function() {
      return abi_js_1.AbiEncodingArrayLengthMismatchError;
    } });
    Object.defineProperty(exports, "AbiEncodingLengthMismatchError", { enumerable: true, get: function() {
      return abi_js_1.AbiEncodingLengthMismatchError;
    } });
    Object.defineProperty(exports, "AbiEncodingBytesSizeMismatchError", { enumerable: true, get: function() {
      return abi_js_1.AbiEncodingBytesSizeMismatchError;
    } });
    Object.defineProperty(exports, "AbiErrorInputsNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiErrorInputsNotFoundError;
    } });
    Object.defineProperty(exports, "AbiErrorNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiErrorNotFoundError;
    } });
    Object.defineProperty(exports, "AbiErrorSignatureNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiErrorSignatureNotFoundError;
    } });
    Object.defineProperty(exports, "AbiEventNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiEventNotFoundError;
    } });
    Object.defineProperty(exports, "AbiEventSignatureEmptyTopicsError", { enumerable: true, get: function() {
      return abi_js_1.AbiEventSignatureEmptyTopicsError;
    } });
    Object.defineProperty(exports, "AbiEventSignatureNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiEventSignatureNotFoundError;
    } });
    Object.defineProperty(exports, "AbiFunctionNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiFunctionNotFoundError;
    } });
    Object.defineProperty(exports, "AbiFunctionOutputsNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiFunctionOutputsNotFoundError;
    } });
    Object.defineProperty(exports, "AbiFunctionSignatureNotFoundError", { enumerable: true, get: function() {
      return abi_js_1.AbiFunctionSignatureNotFoundError;
    } });
    Object.defineProperty(exports, "BytesSizeMismatchError", { enumerable: true, get: function() {
      return abi_js_1.BytesSizeMismatchError;
    } });
    Object.defineProperty(exports, "DecodeLogDataMismatch", { enumerable: true, get: function() {
      return abi_js_1.DecodeLogDataMismatch;
    } });
    Object.defineProperty(exports, "DecodeLogTopicsMismatch", { enumerable: true, get: function() {
      return abi_js_1.DecodeLogTopicsMismatch;
    } });
    Object.defineProperty(exports, "InvalidAbiDecodingTypeError", { enumerable: true, get: function() {
      return abi_js_1.InvalidAbiDecodingTypeError;
    } });
    Object.defineProperty(exports, "InvalidAbiEncodingTypeError", { enumerable: true, get: function() {
      return abi_js_1.InvalidAbiEncodingTypeError;
    } });
    Object.defineProperty(exports, "InvalidArrayError", { enumerable: true, get: function() {
      return abi_js_1.InvalidArrayError;
    } });
    Object.defineProperty(exports, "InvalidDefinitionTypeError", { enumerable: true, get: function() {
      return abi_js_1.InvalidDefinitionTypeError;
    } });
    Object.defineProperty(exports, "UnsupportedPackedAbiType", { enumerable: true, get: function() {
      return abi_js_1.UnsupportedPackedAbiType;
    } });
    var base_js_1 = require_base();
    Object.defineProperty(exports, "BaseError", { enumerable: true, get: function() {
      return base_js_1.BaseError;
    } });
    Object.defineProperty(exports, "setErrorConfig", { enumerable: true, get: function() {
      return base_js_1.setErrorConfig;
    } });
    var block_js_1 = require_block();
    Object.defineProperty(exports, "BlockNotFoundError", { enumerable: true, get: function() {
      return block_js_1.BlockNotFoundError;
    } });
    var contract_js_1 = require_contract();
    Object.defineProperty(exports, "CallExecutionError", { enumerable: true, get: function() {
      return contract_js_1.CallExecutionError;
    } });
    Object.defineProperty(exports, "ContractFunctionExecutionError", { enumerable: true, get: function() {
      return contract_js_1.ContractFunctionExecutionError;
    } });
    Object.defineProperty(exports, "ContractFunctionRevertedError", { enumerable: true, get: function() {
      return contract_js_1.ContractFunctionRevertedError;
    } });
    Object.defineProperty(exports, "ContractFunctionZeroDataError", { enumerable: true, get: function() {
      return contract_js_1.ContractFunctionZeroDataError;
    } });
    Object.defineProperty(exports, "RawContractError", { enumerable: true, get: function() {
      return contract_js_1.RawContractError;
    } });
    Object.defineProperty(exports, "CounterfactualDeploymentFailedError", { enumerable: true, get: function() {
      return contract_js_1.CounterfactualDeploymentFailedError;
    } });
    var fee_js_1 = require_fee();
    Object.defineProperty(exports, "BaseFeeScalarError", { enumerable: true, get: function() {
      return fee_js_1.BaseFeeScalarError;
    } });
    Object.defineProperty(exports, "Eip1559FeesNotSupportedError", { enumerable: true, get: function() {
      return fee_js_1.Eip1559FeesNotSupportedError;
    } });
    Object.defineProperty(exports, "MaxFeePerGasTooLowError", { enumerable: true, get: function() {
      return fee_js_1.MaxFeePerGasTooLowError;
    } });
    var rpc_js_1 = require_rpc2();
    Object.defineProperty(exports, "ChainDisconnectedError", { enumerable: true, get: function() {
      return rpc_js_1.ChainDisconnectedError;
    } });
    Object.defineProperty(exports, "InternalRpcError", { enumerable: true, get: function() {
      return rpc_js_1.InternalRpcError;
    } });
    Object.defineProperty(exports, "InvalidInputRpcError", { enumerable: true, get: function() {
      return rpc_js_1.InvalidInputRpcError;
    } });
    Object.defineProperty(exports, "InvalidParamsRpcError", { enumerable: true, get: function() {
      return rpc_js_1.InvalidParamsRpcError;
    } });
    Object.defineProperty(exports, "InvalidRequestRpcError", { enumerable: true, get: function() {
      return rpc_js_1.InvalidRequestRpcError;
    } });
    Object.defineProperty(exports, "JsonRpcVersionUnsupportedError", { enumerable: true, get: function() {
      return rpc_js_1.JsonRpcVersionUnsupportedError;
    } });
    Object.defineProperty(exports, "LimitExceededRpcError", { enumerable: true, get: function() {
      return rpc_js_1.LimitExceededRpcError;
    } });
    Object.defineProperty(exports, "MethodNotFoundRpcError", { enumerable: true, get: function() {
      return rpc_js_1.MethodNotFoundRpcError;
    } });
    Object.defineProperty(exports, "MethodNotSupportedRpcError", { enumerable: true, get: function() {
      return rpc_js_1.MethodNotSupportedRpcError;
    } });
    Object.defineProperty(exports, "ParseRpcError", { enumerable: true, get: function() {
      return rpc_js_1.ParseRpcError;
    } });
    Object.defineProperty(exports, "ProviderDisconnectedError", { enumerable: true, get: function() {
      return rpc_js_1.ProviderDisconnectedError;
    } });
    Object.defineProperty(exports, "ProviderRpcError", { enumerable: true, get: function() {
      return rpc_js_1.ProviderRpcError;
    } });
    Object.defineProperty(exports, "ResourceNotFoundRpcError", { enumerable: true, get: function() {
      return rpc_js_1.ResourceNotFoundRpcError;
    } });
    Object.defineProperty(exports, "ResourceUnavailableRpcError", { enumerable: true, get: function() {
      return rpc_js_1.ResourceUnavailableRpcError;
    } });
    Object.defineProperty(exports, "RpcError", { enumerable: true, get: function() {
      return rpc_js_1.RpcError;
    } });
    Object.defineProperty(exports, "SwitchChainError", { enumerable: true, get: function() {
      return rpc_js_1.SwitchChainError;
    } });
    Object.defineProperty(exports, "TransactionRejectedRpcError", { enumerable: true, get: function() {
      return rpc_js_1.TransactionRejectedRpcError;
    } });
    Object.defineProperty(exports, "UnauthorizedProviderError", { enumerable: true, get: function() {
      return rpc_js_1.UnauthorizedProviderError;
    } });
    Object.defineProperty(exports, "UnknownRpcError", { enumerable: true, get: function() {
      return rpc_js_1.UnknownRpcError;
    } });
    Object.defineProperty(exports, "UnsupportedProviderMethodError", { enumerable: true, get: function() {
      return rpc_js_1.UnsupportedProviderMethodError;
    } });
    Object.defineProperty(exports, "UserRejectedRequestError", { enumerable: true, get: function() {
      return rpc_js_1.UserRejectedRequestError;
    } });
    var chain_js_1 = require_chain();
    Object.defineProperty(exports, "ChainDoesNotSupportContract", { enumerable: true, get: function() {
      return chain_js_1.ChainDoesNotSupportContract;
    } });
    Object.defineProperty(exports, "ChainMismatchError", { enumerable: true, get: function() {
      return chain_js_1.ChainMismatchError;
    } });
    Object.defineProperty(exports, "ChainNotFoundError", { enumerable: true, get: function() {
      return chain_js_1.ChainNotFoundError;
    } });
    Object.defineProperty(exports, "ClientChainNotConfiguredError", { enumerable: true, get: function() {
      return chain_js_1.ClientChainNotConfiguredError;
    } });
    Object.defineProperty(exports, "InvalidChainIdError", { enumerable: true, get: function() {
      return chain_js_1.InvalidChainIdError;
    } });
    var encoding_js_1 = require_encoding();
    Object.defineProperty(exports, "InvalidBytesBooleanError", { enumerable: true, get: function() {
      return encoding_js_1.InvalidBytesBooleanError;
    } });
    Object.defineProperty(exports, "IntegerOutOfRangeError", { enumerable: true, get: function() {
      return encoding_js_1.IntegerOutOfRangeError;
    } });
    Object.defineProperty(exports, "InvalidHexBooleanError", { enumerable: true, get: function() {
      return encoding_js_1.InvalidHexBooleanError;
    } });
    Object.defineProperty(exports, "InvalidHexValueError", { enumerable: true, get: function() {
      return encoding_js_1.InvalidHexValueError;
    } });
    Object.defineProperty(exports, "SizeOverflowError", { enumerable: true, get: function() {
      return encoding_js_1.SizeOverflowError;
    } });
    var ens_js_1 = require_ens();
    Object.defineProperty(exports, "EnsAvatarUriResolutionError", { enumerable: true, get: function() {
      return ens_js_1.EnsAvatarUriResolutionError;
    } });
    Object.defineProperty(exports, "EnsAvatarInvalidNftUriError", { enumerable: true, get: function() {
      return ens_js_1.EnsAvatarInvalidNftUriError;
    } });
    Object.defineProperty(exports, "EnsAvatarUnsupportedNamespaceError", { enumerable: true, get: function() {
      return ens_js_1.EnsAvatarUnsupportedNamespaceError;
    } });
    var unit_js_2 = require_unit2();
    Object.defineProperty(exports, "InvalidDecimalNumberError", { enumerable: true, get: function() {
      return unit_js_2.InvalidDecimalNumberError;
    } });
    var estimateGas_js_1 = require_estimateGas();
    Object.defineProperty(exports, "EstimateGasExecutionError", { enumerable: true, get: function() {
      return estimateGas_js_1.EstimateGasExecutionError;
    } });
    var node_js_1 = require_node();
    Object.defineProperty(exports, "ExecutionRevertedError", { enumerable: true, get: function() {
      return node_js_1.ExecutionRevertedError;
    } });
    Object.defineProperty(exports, "FeeCapTooHighError", { enumerable: true, get: function() {
      return node_js_1.FeeCapTooHighError;
    } });
    Object.defineProperty(exports, "FeeCapTooLowError", { enumerable: true, get: function() {
      return node_js_1.FeeCapTooLowError;
    } });
    Object.defineProperty(exports, "InsufficientFundsError", { enumerable: true, get: function() {
      return node_js_1.InsufficientFundsError;
    } });
    Object.defineProperty(exports, "IntrinsicGasTooHighError", { enumerable: true, get: function() {
      return node_js_1.IntrinsicGasTooHighError;
    } });
    Object.defineProperty(exports, "IntrinsicGasTooLowError", { enumerable: true, get: function() {
      return node_js_1.IntrinsicGasTooLowError;
    } });
    Object.defineProperty(exports, "NonceMaxValueError", { enumerable: true, get: function() {
      return node_js_1.NonceMaxValueError;
    } });
    Object.defineProperty(exports, "NonceTooHighError", { enumerable: true, get: function() {
      return node_js_1.NonceTooHighError;
    } });
    Object.defineProperty(exports, "NonceTooLowError", { enumerable: true, get: function() {
      return node_js_1.NonceTooLowError;
    } });
    Object.defineProperty(exports, "TipAboveFeeCapError", { enumerable: true, get: function() {
      return node_js_1.TipAboveFeeCapError;
    } });
    Object.defineProperty(exports, "TransactionTypeNotSupportedError", { enumerable: true, get: function() {
      return node_js_1.TransactionTypeNotSupportedError;
    } });
    Object.defineProperty(exports, "UnknownNodeError", { enumerable: true, get: function() {
      return node_js_1.UnknownNodeError;
    } });
    var log_js_1 = require_log();
    Object.defineProperty(exports, "FilterTypeNotSupportedError", { enumerable: true, get: function() {
      return log_js_1.FilterTypeNotSupportedError;
    } });
    var request_js_1 = require_request();
    Object.defineProperty(exports, "HttpRequestError", { enumerable: true, get: function() {
      return request_js_1.HttpRequestError;
    } });
    Object.defineProperty(exports, "RpcRequestError", { enumerable: true, get: function() {
      return request_js_1.RpcRequestError;
    } });
    Object.defineProperty(exports, "TimeoutError", { enumerable: true, get: function() {
      return request_js_1.TimeoutError;
    } });
    Object.defineProperty(exports, "SocketClosedError", { enumerable: true, get: function() {
      return request_js_1.SocketClosedError;
    } });
    Object.defineProperty(exports, "WebSocketRequestError", { enumerable: true, get: function() {
      return request_js_1.WebSocketRequestError;
    } });
    var address_js_2 = require_address();
    Object.defineProperty(exports, "InvalidAddressError", { enumerable: true, get: function() {
      return address_js_2.InvalidAddressError;
    } });
    var transaction_js_1 = require_transaction();
    Object.defineProperty(exports, "FeeConflictError", { enumerable: true, get: function() {
      return transaction_js_1.FeeConflictError;
    } });
    Object.defineProperty(exports, "InvalidLegacyVError", { enumerable: true, get: function() {
      return transaction_js_1.InvalidLegacyVError;
    } });
    Object.defineProperty(exports, "InvalidSerializableTransactionError", { enumerable: true, get: function() {
      return transaction_js_1.InvalidSerializableTransactionError;
    } });
    Object.defineProperty(exports, "InvalidSerializedTransactionError", { enumerable: true, get: function() {
      return transaction_js_1.InvalidSerializedTransactionError;
    } });
    Object.defineProperty(exports, "InvalidSerializedTransactionTypeError", { enumerable: true, get: function() {
      return transaction_js_1.InvalidSerializedTransactionTypeError;
    } });
    Object.defineProperty(exports, "InvalidStorageKeySizeError", { enumerable: true, get: function() {
      return transaction_js_1.InvalidStorageKeySizeError;
    } });
    Object.defineProperty(exports, "TransactionExecutionError", { enumerable: true, get: function() {
      return transaction_js_1.TransactionExecutionError;
    } });
    Object.defineProperty(exports, "TransactionNotFoundError", { enumerable: true, get: function() {
      return transaction_js_1.TransactionNotFoundError;
    } });
    Object.defineProperty(exports, "TransactionReceiptNotFoundError", { enumerable: true, get: function() {
      return transaction_js_1.TransactionReceiptNotFoundError;
    } });
    Object.defineProperty(exports, "WaitForTransactionReceiptTimeoutError", { enumerable: true, get: function() {
      return transaction_js_1.WaitForTransactionReceiptTimeoutError;
    } });
    var data_js_1 = require_data();
    Object.defineProperty(exports, "SizeExceedsPaddingSizeError", { enumerable: true, get: function() {
      return data_js_1.SizeExceedsPaddingSizeError;
    } });
    Object.defineProperty(exports, "SliceOffsetOutOfBoundsError", { enumerable: true, get: function() {
      return data_js_1.SliceOffsetOutOfBoundsError;
    } });
    var transport_js_1 = require_transport();
    Object.defineProperty(exports, "UrlRequiredError", { enumerable: true, get: function() {
      return transport_js_1.UrlRequiredError;
    } });
    var stateOverride_js_1 = require_stateOverride();
    Object.defineProperty(exports, "AccountStateConflictError", { enumerable: true, get: function() {
      return stateOverride_js_1.AccountStateConflictError;
    } });
    Object.defineProperty(exports, "StateAssignmentConflictError", { enumerable: true, get: function() {
      return stateOverride_js_1.StateAssignmentConflictError;
    } });
    var typedData_js_1 = require_typedData();
    Object.defineProperty(exports, "InvalidDomainError", { enumerable: true, get: function() {
      return typedData_js_1.InvalidDomainError;
    } });
    Object.defineProperty(exports, "InvalidPrimaryTypeError", { enumerable: true, get: function() {
      return typedData_js_1.InvalidPrimaryTypeError;
    } });
    Object.defineProperty(exports, "InvalidStructTypeError", { enumerable: true, get: function() {
      return typedData_js_1.InvalidStructTypeError;
    } });
    var eip1193_js_1 = require_eip1193();
    Object.defineProperty(exports, "EIP1193ProviderRpcError", { enumerable: true, get: function() {
      return eip1193_js_1.ProviderRpcError;
    } });
    var labelhash_js_1 = require_labelhash();
    Object.defineProperty(exports, "labelhash", { enumerable: true, get: function() {
      return labelhash_js_1.labelhash;
    } });
    var namehash_js_1 = require_namehash();
    Object.defineProperty(exports, "namehash", { enumerable: true, get: function() {
      return namehash_js_1.namehash;
    } });
    var block_js_2 = require_block2();
    Object.defineProperty(exports, "defineBlock", { enumerable: true, get: function() {
      return block_js_2.defineBlock;
    } });
    Object.defineProperty(exports, "formatBlock", { enumerable: true, get: function() {
      return block_js_2.formatBlock;
    } });
    var log_js_2 = require_log2();
    Object.defineProperty(exports, "formatLog", { enumerable: true, get: function() {
      return log_js_2.formatLog;
    } });
    var decodeAbiParameters_js_1 = require_decodeAbiParameters();
    Object.defineProperty(exports, "decodeAbiParameters", { enumerable: true, get: function() {
      return decodeAbiParameters_js_1.decodeAbiParameters;
    } });
    var decodeDeployData_js_1 = require_decodeDeployData();
    Object.defineProperty(exports, "decodeDeployData", { enumerable: true, get: function() {
      return decodeDeployData_js_1.decodeDeployData;
    } });
    var decodeErrorResult_js_1 = require_decodeErrorResult();
    Object.defineProperty(exports, "decodeErrorResult", { enumerable: true, get: function() {
      return decodeErrorResult_js_1.decodeErrorResult;
    } });
    var decodeEventLog_js_1 = require_decodeEventLog();
    Object.defineProperty(exports, "decodeEventLog", { enumerable: true, get: function() {
      return decodeEventLog_js_1.decodeEventLog;
    } });
    var decodeFunctionData_js_1 = require_decodeFunctionData();
    Object.defineProperty(exports, "decodeFunctionData", { enumerable: true, get: function() {
      return decodeFunctionData_js_1.decodeFunctionData;
    } });
    var decodeFunctionResult_js_1 = require_decodeFunctionResult();
    Object.defineProperty(exports, "decodeFunctionResult", { enumerable: true, get: function() {
      return decodeFunctionResult_js_1.decodeFunctionResult;
    } });
    var encodeAbiParameters_js_1 = require_encodeAbiParameters();
    Object.defineProperty(exports, "encodeAbiParameters", { enumerable: true, get: function() {
      return encodeAbiParameters_js_1.encodeAbiParameters;
    } });
    var encodeDeployData_js_1 = require_encodeDeployData();
    Object.defineProperty(exports, "encodeDeployData", { enumerable: true, get: function() {
      return encodeDeployData_js_1.encodeDeployData;
    } });
    var encodeErrorResult_js_1 = require_encodeErrorResult();
    Object.defineProperty(exports, "encodeErrorResult", { enumerable: true, get: function() {
      return encodeErrorResult_js_1.encodeErrorResult;
    } });
    var encodeEventTopics_js_1 = require_encodeEventTopics();
    Object.defineProperty(exports, "encodeEventTopics", { enumerable: true, get: function() {
      return encodeEventTopics_js_1.encodeEventTopics;
    } });
    var encodeFunctionData_js_1 = require_encodeFunctionData();
    Object.defineProperty(exports, "encodeFunctionData", { enumerable: true, get: function() {
      return encodeFunctionData_js_1.encodeFunctionData;
    } });
    var prepareEncodeFunctionData_js_1 = require_prepareEncodeFunctionData();
    Object.defineProperty(exports, "prepareEncodeFunctionData", { enumerable: true, get: function() {
      return prepareEncodeFunctionData_js_1.prepareEncodeFunctionData;
    } });
    var encodeFunctionResult_js_1 = require_encodeFunctionResult();
    Object.defineProperty(exports, "encodeFunctionResult", { enumerable: true, get: function() {
      return encodeFunctionResult_js_1.encodeFunctionResult;
    } });
    var parseEventLogs_js_1 = require_parseEventLogs();
    Object.defineProperty(exports, "parseEventLogs", { enumerable: true, get: function() {
      return parseEventLogs_js_1.parseEventLogs;
    } });
    var transaction_js_2 = require_transaction2();
    Object.defineProperty(exports, "defineTransaction", { enumerable: true, get: function() {
      return transaction_js_2.defineTransaction;
    } });
    Object.defineProperty(exports, "formatTransaction", { enumerable: true, get: function() {
      return transaction_js_2.formatTransaction;
    } });
    Object.defineProperty(exports, "transactionType", { enumerable: true, get: function() {
      return transaction_js_2.transactionType;
    } });
    var transactionReceipt_js_1 = require_transactionReceipt();
    Object.defineProperty(exports, "defineTransactionReceipt", { enumerable: true, get: function() {
      return transactionReceipt_js_1.defineTransactionReceipt;
    } });
    Object.defineProperty(exports, "formatTransactionReceipt", { enumerable: true, get: function() {
      return transactionReceipt_js_1.formatTransactionReceipt;
    } });
    var transactionRequest_js_1 = require_transactionRequest();
    Object.defineProperty(exports, "defineTransactionRequest", { enumerable: true, get: function() {
      return transactionRequest_js_1.defineTransactionRequest;
    } });
    Object.defineProperty(exports, "formatTransactionRequest", { enumerable: true, get: function() {
      return transactionRequest_js_1.formatTransactionRequest;
    } });
    Object.defineProperty(exports, "rpcTransactionType", { enumerable: true, get: function() {
      return transactionRequest_js_1.rpcTransactionType;
    } });
    var getAbiItem_js_1 = require_getAbiItem();
    Object.defineProperty(exports, "getAbiItem", { enumerable: true, get: function() {
      return getAbiItem_js_1.getAbiItem;
    } });
    var getContractAddress_js_1 = require_getContractAddress();
    Object.defineProperty(exports, "getContractAddress", { enumerable: true, get: function() {
      return getContractAddress_js_1.getContractAddress;
    } });
    Object.defineProperty(exports, "getCreate2Address", { enumerable: true, get: function() {
      return getContractAddress_js_1.getCreate2Address;
    } });
    Object.defineProperty(exports, "getCreateAddress", { enumerable: true, get: function() {
      return getContractAddress_js_1.getCreateAddress;
    } });
    var getSerializedTransactionType_js_1 = require_getSerializedTransactionType();
    Object.defineProperty(exports, "getSerializedTransactionType", { enumerable: true, get: function() {
      return getSerializedTransactionType_js_1.getSerializedTransactionType;
    } });
    var getTransactionType_js_1 = require_getTransactionType();
    Object.defineProperty(exports, "getTransactionType", { enumerable: true, get: function() {
      return getTransactionType_js_1.getTransactionType;
    } });
    var hashTypedData_js_1 = require_hashTypedData();
    Object.defineProperty(exports, "hashDomain", { enumerable: true, get: function() {
      return hashTypedData_js_1.hashDomain;
    } });
    Object.defineProperty(exports, "hashStruct", { enumerable: true, get: function() {
      return hashTypedData_js_1.hashStruct;
    } });
    Object.defineProperty(exports, "hashTypedData", { enumerable: true, get: function() {
      return hashTypedData_js_1.hashTypedData;
    } });
    var compactSignatureToSignature_js_1 = require_compactSignatureToSignature();
    Object.defineProperty(exports, "compactSignatureToSignature", { enumerable: true, get: function() {
      return compactSignatureToSignature_js_1.compactSignatureToSignature;
    } });
    var parseCompactSignature_js_1 = require_parseCompactSignature();
    Object.defineProperty(exports, "hexToCompactSignature", { enumerable: true, get: function() {
      return parseCompactSignature_js_1.parseCompactSignature;
    } });
    Object.defineProperty(exports, "parseCompactSignature", { enumerable: true, get: function() {
      return parseCompactSignature_js_1.parseCompactSignature;
    } });
    var parseSignature_js_1 = require_parseSignature();
    Object.defineProperty(exports, "hexToSignature", { enumerable: true, get: function() {
      return parseSignature_js_1.parseSignature;
    } });
    Object.defineProperty(exports, "parseSignature", { enumerable: true, get: function() {
      return parseSignature_js_1.parseSignature;
    } });
    var recoverAddress_js_1 = require_recoverAddress();
    Object.defineProperty(exports, "recoverAddress", { enumerable: true, get: function() {
      return recoverAddress_js_1.recoverAddress;
    } });
    var recoverMessageAddress_js_1 = require_recoverMessageAddress();
    Object.defineProperty(exports, "recoverMessageAddress", { enumerable: true, get: function() {
      return recoverMessageAddress_js_1.recoverMessageAddress;
    } });
    var recoverPublicKey_js_1 = require_recoverPublicKey();
    Object.defineProperty(exports, "recoverPublicKey", { enumerable: true, get: function() {
      return recoverPublicKey_js_1.recoverPublicKey;
    } });
    var recoverTransactionAddress_js_1 = require_recoverTransactionAddress();
    Object.defineProperty(exports, "recoverTransactionAddress", { enumerable: true, get: function() {
      return recoverTransactionAddress_js_1.recoverTransactionAddress;
    } });
    var recoverTypedDataAddress_js_1 = require_recoverTypedDataAddress();
    Object.defineProperty(exports, "recoverTypedDataAddress", { enumerable: true, get: function() {
      return recoverTypedDataAddress_js_1.recoverTypedDataAddress;
    } });
    var signatureToCompactSignature_js_1 = require_signatureToCompactSignature();
    Object.defineProperty(exports, "signatureToCompactSignature", { enumerable: true, get: function() {
      return signatureToCompactSignature_js_1.signatureToCompactSignature;
    } });
    var serializeCompactSignature_js_1 = require_serializeCompactSignature();
    Object.defineProperty(exports, "compactSignatureToHex", { enumerable: true, get: function() {
      return serializeCompactSignature_js_1.serializeCompactSignature;
    } });
    Object.defineProperty(exports, "serializeCompactSignature", { enumerable: true, get: function() {
      return serializeCompactSignature_js_1.serializeCompactSignature;
    } });
    var serializeSignature_js_1 = require_serializeSignature();
    Object.defineProperty(exports, "signatureToHex", { enumerable: true, get: function() {
      return serializeSignature_js_1.serializeSignature;
    } });
    Object.defineProperty(exports, "serializeSignature", { enumerable: true, get: function() {
      return serializeSignature_js_1.serializeSignature;
    } });
    var toRlp_js_1 = require_toRlp();
    Object.defineProperty(exports, "bytesToRlp", { enumerable: true, get: function() {
      return toRlp_js_1.bytesToRlp;
    } });
    Object.defineProperty(exports, "hexToRlp", { enumerable: true, get: function() {
      return toRlp_js_1.hexToRlp;
    } });
    Object.defineProperty(exports, "toRlp", { enumerable: true, get: function() {
      return toRlp_js_1.toRlp;
    } });
    var verifyHash_js_1 = require_verifyHash();
    Object.defineProperty(exports, "verifyHash", { enumerable: true, get: function() {
      return verifyHash_js_1.verifyHash;
    } });
    var verifyMessage_js_1 = require_verifyMessage();
    Object.defineProperty(exports, "verifyMessage", { enumerable: true, get: function() {
      return verifyMessage_js_1.verifyMessage;
    } });
    var verifyTypedData_js_1 = require_verifyTypedData();
    Object.defineProperty(exports, "verifyTypedData", { enumerable: true, get: function() {
      return verifyTypedData_js_1.verifyTypedData;
    } });
    var parseErc6492Signature_js_1 = require_parseErc6492Signature();
    Object.defineProperty(exports, "parseErc6492Signature", { enumerable: true, get: function() {
      return parseErc6492Signature_js_1.parseErc6492Signature;
    } });
    var isErc6492Signature_js_1 = require_isErc6492Signature();
    Object.defineProperty(exports, "isErc6492Signature", { enumerable: true, get: function() {
      return isErc6492Signature_js_1.isErc6492Signature;
    } });
    var serializeErc6492Signature_js_1 = require_serializeErc6492Signature();
    Object.defineProperty(exports, "serializeErc6492Signature", { enumerable: true, get: function() {
      return serializeErc6492Signature_js_1.serializeErc6492Signature;
    } });
    var assertRequest_js_1 = require_assertRequest();
    Object.defineProperty(exports, "assertRequest", { enumerable: true, get: function() {
      return assertRequest_js_1.assertRequest;
    } });
    var assertTransaction_js_1 = require_assertTransaction();
    Object.defineProperty(exports, "assertTransactionEIP1559", { enumerable: true, get: function() {
      return assertTransaction_js_1.assertTransactionEIP1559;
    } });
    Object.defineProperty(exports, "assertTransactionEIP2930", { enumerable: true, get: function() {
      return assertTransaction_js_1.assertTransactionEIP2930;
    } });
    Object.defineProperty(exports, "assertTransactionLegacy", { enumerable: true, get: function() {
      return assertTransaction_js_1.assertTransactionLegacy;
    } });
    var toBytes_js_1 = require_toBytes();
    Object.defineProperty(exports, "boolToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.boolToBytes;
    } });
    Object.defineProperty(exports, "hexToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.hexToBytes;
    } });
    Object.defineProperty(exports, "numberToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.numberToBytes;
    } });
    Object.defineProperty(exports, "stringToBytes", { enumerable: true, get: function() {
      return toBytes_js_1.stringToBytes;
    } });
    Object.defineProperty(exports, "toBytes", { enumerable: true, get: function() {
      return toBytes_js_1.toBytes;
    } });
    var toHex_js_1 = require_toHex();
    Object.defineProperty(exports, "boolToHex", { enumerable: true, get: function() {
      return toHex_js_1.boolToHex;
    } });
    Object.defineProperty(exports, "bytesToHex", { enumerable: true, get: function() {
      return toHex_js_1.bytesToHex;
    } });
    Object.defineProperty(exports, "numberToHex", { enumerable: true, get: function() {
      return toHex_js_1.numberToHex;
    } });
    Object.defineProperty(exports, "stringToHex", { enumerable: true, get: function() {
      return toHex_js_1.stringToHex;
    } });
    Object.defineProperty(exports, "toHex", { enumerable: true, get: function() {
      return toHex_js_1.toHex;
    } });
    var fromBytes_js_1 = require_fromBytes();
    Object.defineProperty(exports, "bytesToBigInt", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToBigInt;
    } });
    Object.defineProperty(exports, "bytesToBool", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToBool;
    } });
    Object.defineProperty(exports, "bytesToNumber", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToNumber;
    } });
    Object.defineProperty(exports, "bytesToString", { enumerable: true, get: function() {
      return fromBytes_js_1.bytesToString;
    } });
    Object.defineProperty(exports, "fromBytes", { enumerable: true, get: function() {
      return fromBytes_js_1.fromBytes;
    } });
    var ccip_js_1 = require_ccip2();
    Object.defineProperty(exports, "ccipRequest", { enumerable: true, get: function() {
      return ccip_js_1.ccipRequest;
    } });
    Object.defineProperty(exports, "ccipFetch", { enumerable: true, get: function() {
      return ccip_js_1.ccipRequest;
    } });
    Object.defineProperty(exports, "offchainLookup", { enumerable: true, get: function() {
      return ccip_js_1.offchainLookup;
    } });
    Object.defineProperty(exports, "offchainLookupAbiItem", { enumerable: true, get: function() {
      return ccip_js_1.offchainLookupAbiItem;
    } });
    Object.defineProperty(exports, "offchainLookupSignature", { enumerable: true, get: function() {
      return ccip_js_1.offchainLookupSignature;
    } });
    var blobsToCommitments_js_1 = require_blobsToCommitments();
    Object.defineProperty(exports, "blobsToCommitments", { enumerable: true, get: function() {
      return blobsToCommitments_js_1.blobsToCommitments;
    } });
    var commitmentToVersionedHash_js_1 = require_commitmentToVersionedHash();
    Object.defineProperty(exports, "commitmentToVersionedHash", { enumerable: true, get: function() {
      return commitmentToVersionedHash_js_1.commitmentToVersionedHash;
    } });
    var commitmentsToVersionedHashes_js_1 = require_commitmentsToVersionedHashes();
    Object.defineProperty(exports, "commitmentsToVersionedHashes", { enumerable: true, get: function() {
      return commitmentsToVersionedHashes_js_1.commitmentsToVersionedHashes;
    } });
    var sidecarsToVersionedHashes_js_1 = require_sidecarsToVersionedHashes();
    Object.defineProperty(exports, "sidecarsToVersionedHashes", { enumerable: true, get: function() {
      return sidecarsToVersionedHashes_js_1.sidecarsToVersionedHashes;
    } });
    var blobsToProofs_js_1 = require_blobsToProofs();
    Object.defineProperty(exports, "blobsToProofs", { enumerable: true, get: function() {
      return blobsToProofs_js_1.blobsToProofs;
    } });
    var fromBlobs_js_1 = require_fromBlobs();
    Object.defineProperty(exports, "fromBlobs", { enumerable: true, get: function() {
      return fromBlobs_js_1.fromBlobs;
    } });
    var toBlobSidecars_js_1 = require_toBlobSidecars();
    Object.defineProperty(exports, "toBlobSidecars", { enumerable: true, get: function() {
      return toBlobSidecars_js_1.toBlobSidecars;
    } });
    var toBlobs_js_1 = require_toBlobs();
    Object.defineProperty(exports, "toBlobs", { enumerable: true, get: function() {
      return toBlobs_js_1.toBlobs;
    } });
    var defineKzg_js_1 = require_defineKzg();
    Object.defineProperty(exports, "defineKzg", { enumerable: true, get: function() {
      return defineKzg_js_1.defineKzg;
    } });
    var setupKzg_js_1 = require_setupKzg();
    Object.defineProperty(exports, "setupKzg", { enumerable: true, get: function() {
      return setupKzg_js_1.setupKzg;
    } });
    var concat_js_1 = require_concat();
    Object.defineProperty(exports, "concat", { enumerable: true, get: function() {
      return concat_js_1.concat;
    } });
    Object.defineProperty(exports, "concatBytes", { enumerable: true, get: function() {
      return concat_js_1.concatBytes;
    } });
    Object.defineProperty(exports, "concatHex", { enumerable: true, get: function() {
      return concat_js_1.concatHex;
    } });
    var assertCurrentChain_js_1 = require_assertCurrentChain();
    Object.defineProperty(exports, "assertCurrentChain", { enumerable: true, get: function() {
      return assertCurrentChain_js_1.assertCurrentChain;
    } });
    var defineChain_js_1 = require_defineChain();
    Object.defineProperty(exports, "defineChain", { enumerable: true, get: function() {
      return defineChain_js_1.defineChain;
    } });
    var extractChain_js_1 = require_extractChain();
    Object.defineProperty(exports, "extractChain", { enumerable: true, get: function() {
      return extractChain_js_1.extractChain;
    } });
    var getChainContractAddress_js_1 = require_getChainContractAddress();
    Object.defineProperty(exports, "getChainContractAddress", { enumerable: true, get: function() {
      return getChainContractAddress_js_1.getChainContractAddress;
    } });
    var encodePacked_js_1 = require_encodePacked();
    Object.defineProperty(exports, "encodePacked", { enumerable: true, get: function() {
      return encodePacked_js_1.encodePacked;
    } });
    var withRetry_js_1 = require_withRetry();
    Object.defineProperty(exports, "withRetry", { enumerable: true, get: function() {
      return withRetry_js_1.withRetry;
    } });
    var withTimeout_js_1 = require_withTimeout();
    Object.defineProperty(exports, "withTimeout", { enumerable: true, get: function() {
      return withTimeout_js_1.withTimeout;
    } });
    var formatEther_js_1 = require_formatEther();
    Object.defineProperty(exports, "formatEther", { enumerable: true, get: function() {
      return formatEther_js_1.formatEther;
    } });
    var formatGwei_js_1 = require_formatGwei();
    Object.defineProperty(exports, "formatGwei", { enumerable: true, get: function() {
      return formatGwei_js_1.formatGwei;
    } });
    var formatUnits_js_1 = require_formatUnits();
    Object.defineProperty(exports, "formatUnits", { enumerable: true, get: function() {
      return formatUnits_js_1.formatUnits;
    } });
    var fromHex_js_1 = require_fromHex();
    Object.defineProperty(exports, "fromHex", { enumerable: true, get: function() {
      return fromHex_js_1.fromHex;
    } });
    Object.defineProperty(exports, "hexToBigInt", { enumerable: true, get: function() {
      return fromHex_js_1.hexToBigInt;
    } });
    Object.defineProperty(exports, "hexToBool", { enumerable: true, get: function() {
      return fromHex_js_1.hexToBool;
    } });
    Object.defineProperty(exports, "hexToNumber", { enumerable: true, get: function() {
      return fromHex_js_1.hexToNumber;
    } });
    Object.defineProperty(exports, "hexToString", { enumerable: true, get: function() {
      return fromHex_js_1.hexToString;
    } });
    var fromRlp_js_1 = require_fromRlp();
    Object.defineProperty(exports, "fromRlp", { enumerable: true, get: function() {
      return fromRlp_js_1.fromRlp;
    } });
    var getAddress_js_1 = require_getAddress();
    Object.defineProperty(exports, "checksumAddress", { enumerable: true, get: function() {
      return getAddress_js_1.checksumAddress;
    } });
    Object.defineProperty(exports, "getAddress", { enumerable: true, get: function() {
      return getAddress_js_1.getAddress;
    } });
    var getContractError_js_1 = require_getContractError();
    Object.defineProperty(exports, "getContractError", { enumerable: true, get: function() {
      return getContractError_js_1.getContractError;
    } });
    var toEventSelector_js_1 = require_toEventSelector();
    Object.defineProperty(exports, "toEventSelector", { enumerable: true, get: function() {
      return toEventSelector_js_1.toEventSelector;
    } });
    Object.defineProperty(exports, "getEventSelector", { enumerable: true, get: function() {
      return toEventSelector_js_1.toEventSelector;
    } });
    var toFunctionSelector_js_1 = require_toFunctionSelector();
    Object.defineProperty(exports, "toFunctionSelector", { enumerable: true, get: function() {
      return toFunctionSelector_js_1.toFunctionSelector;
    } });
    Object.defineProperty(exports, "getFunctionSelector", { enumerable: true, get: function() {
      return toFunctionSelector_js_1.toFunctionSelector;
    } });
    var toEventSignature_js_1 = require_toEventSignature();
    Object.defineProperty(exports, "toEventSignature", { enumerable: true, get: function() {
      return toEventSignature_js_1.toEventSignature;
    } });
    Object.defineProperty(exports, "getEventSignature", { enumerable: true, get: function() {
      return toEventSignature_js_1.toEventSignature;
    } });
    var toFunctionSignature_js_1 = require_toFunctionSignature();
    Object.defineProperty(exports, "toFunctionSignature", { enumerable: true, get: function() {
      return toFunctionSignature_js_1.toFunctionSignature;
    } });
    Object.defineProperty(exports, "getFunctionSignature", { enumerable: true, get: function() {
      return toFunctionSignature_js_1.toFunctionSignature;
    } });
    var toEventHash_js_1 = require_toEventHash();
    Object.defineProperty(exports, "toEventHash", { enumerable: true, get: function() {
      return toEventHash_js_1.toEventHash;
    } });
    var toFunctionHash_js_1 = require_toFunctionHash();
    Object.defineProperty(exports, "toFunctionHash", { enumerable: true, get: function() {
      return toFunctionHash_js_1.toFunctionHash;
    } });
    var hashMessage_js_1 = require_hashMessage();
    Object.defineProperty(exports, "hashMessage", { enumerable: true, get: function() {
      return hashMessage_js_1.hashMessage;
    } });
    var toPrefixedMessage_js_1 = require_toPrefixedMessage();
    Object.defineProperty(exports, "toPrefixedMessage", { enumerable: true, get: function() {
      return toPrefixedMessage_js_1.toPrefixedMessage;
    } });
    var isAddress_js_1 = require_isAddress();
    Object.defineProperty(exports, "isAddress", { enumerable: true, get: function() {
      return isAddress_js_1.isAddress;
    } });
    var isAddressEqual_js_1 = require_isAddressEqual();
    Object.defineProperty(exports, "isAddressEqual", { enumerable: true, get: function() {
      return isAddressEqual_js_1.isAddressEqual;
    } });
    var isBytes_js_1 = require_isBytes();
    Object.defineProperty(exports, "isBytes", { enumerable: true, get: function() {
      return isBytes_js_1.isBytes;
    } });
    var isHash_js_1 = require_isHash();
    Object.defineProperty(exports, "isHash", { enumerable: true, get: function() {
      return isHash_js_1.isHash;
    } });
    var isHex_js_1 = require_isHex();
    Object.defineProperty(exports, "isHex", { enumerable: true, get: function() {
      return isHex_js_1.isHex;
    } });
    var keccak256_js_1 = require_keccak256();
    Object.defineProperty(exports, "keccak256", { enumerable: true, get: function() {
      return keccak256_js_1.keccak256;
    } });
    var sha256_js_1 = require_sha2563();
    Object.defineProperty(exports, "sha256", { enumerable: true, get: function() {
      return sha256_js_1.sha256;
    } });
    var ripemd160_js_1 = require_ripemd1602();
    Object.defineProperty(exports, "ripemd160", { enumerable: true, get: function() {
      return ripemd160_js_1.ripemd160;
    } });
    var pad_js_1 = require_pad();
    Object.defineProperty(exports, "pad", { enumerable: true, get: function() {
      return pad_js_1.pad;
    } });
    Object.defineProperty(exports, "padBytes", { enumerable: true, get: function() {
      return pad_js_1.padBytes;
    } });
    Object.defineProperty(exports, "padHex", { enumerable: true, get: function() {
      return pad_js_1.padHex;
    } });
    var parseEther_js_1 = require_parseEther();
    Object.defineProperty(exports, "parseEther", { enumerable: true, get: function() {
      return parseEther_js_1.parseEther;
    } });
    var parseGwei_js_1 = require_parseGwei();
    Object.defineProperty(exports, "parseGwei", { enumerable: true, get: function() {
      return parseGwei_js_1.parseGwei;
    } });
    var parseTransaction_js_1 = require_parseTransaction();
    Object.defineProperty(exports, "parseTransaction", { enumerable: true, get: function() {
      return parseTransaction_js_1.parseTransaction;
    } });
    var parseUnits_js_1 = require_parseUnits();
    Object.defineProperty(exports, "parseUnits", { enumerable: true, get: function() {
      return parseUnits_js_1.parseUnits;
    } });
    var serializeAccessList_js_1 = require_serializeAccessList();
    Object.defineProperty(exports, "serializeAccessList", { enumerable: true, get: function() {
      return serializeAccessList_js_1.serializeAccessList;
    } });
    var serializeTransaction_js_1 = require_serializeTransaction();
    Object.defineProperty(exports, "serializeTransaction", { enumerable: true, get: function() {
      return serializeTransaction_js_1.serializeTransaction;
    } });
    var size_js_1 = require_size();
    Object.defineProperty(exports, "size", { enumerable: true, get: function() {
      return size_js_1.size;
    } });
    var slice_js_1 = require_slice();
    Object.defineProperty(exports, "slice", { enumerable: true, get: function() {
      return slice_js_1.slice;
    } });
    Object.defineProperty(exports, "sliceBytes", { enumerable: true, get: function() {
      return slice_js_1.sliceBytes;
    } });
    Object.defineProperty(exports, "sliceHex", { enumerable: true, get: function() {
      return slice_js_1.sliceHex;
    } });
    var stringify_js_1 = require_stringify();
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return stringify_js_1.stringify;
    } });
    var trim_js_1 = require_trim();
    Object.defineProperty(exports, "trim", { enumerable: true, get: function() {
      return trim_js_1.trim;
    } });
    var typedData_js_2 = require_typedData2();
    Object.defineProperty(exports, "serializeTypedData", { enumerable: true, get: function() {
      return typedData_js_2.serializeTypedData;
    } });
    Object.defineProperty(exports, "validateTypedData", { enumerable: true, get: function() {
      return typedData_js_2.validateTypedData;
    } });
    Object.defineProperty(exports, "domainSeparator", { enumerable: true, get: function() {
      return typedData_js_2.domainSeparator;
    } });
    Object.defineProperty(exports, "getTypesForEIP712Domain", { enumerable: true, get: function() {
      return typedData_js_2.getTypesForEIP712Domain;
    } });
    var nonceManager_js_1 = require_nonceManager();
    Object.defineProperty(exports, "createNonceManager", { enumerable: true, get: function() {
      return nonceManager_js_1.createNonceManager;
    } });
    Object.defineProperty(exports, "nonceManager", { enumerable: true, get: function() {
      return nonceManager_js_1.nonceManager;
    } });
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/safe/signatures.js
var require_signatures2 = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/safe/signatures.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MAGIC_VALUE_BYTES = exports.MAGIC_VALUE = void 0;
    var MAGIC_VALUE = "0x1626ba7e";
    exports.MAGIC_VALUE = MAGIC_VALUE;
    var MAGIC_VALUE_BYTES = "0x20c13b0b";
    exports.MAGIC_VALUE_BYTES = MAGIC_VALUE_BYTES;
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/types/permissions.js
var require_permissions = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/types/permissions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PermissionsError = exports.PERMISSIONS_REQUEST_REJECTED = void 0;
    exports.PERMISSIONS_REQUEST_REJECTED = 4001;
    var PermissionsError = class _PermissionsError extends Error {
      constructor(message, code, data) {
        super(message);
        this.code = code;
        this.data = data;
        Object.setPrototypeOf(this, _PermissionsError.prototype);
      }
    };
    exports.PermissionsError = PermissionsError;
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/wallet/index.js
var require_wallet2 = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/wallet/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Wallet = void 0;
    var methods_js_1 = require_methods();
    var permissions_js_1 = require_permissions();
    var Wallet = class {
      constructor(communicator) {
        this.communicator = communicator;
      }
      async getPermissions() {
        const response = await this.communicator.send(methods_js_1.Methods.wallet_getPermissions, void 0);
        return response.data;
      }
      async requestPermissions(permissions) {
        if (!this.isPermissionRequestValid(permissions)) {
          throw new permissions_js_1.PermissionsError("Permissions request is invalid", permissions_js_1.PERMISSIONS_REQUEST_REJECTED);
        }
        try {
          const response = await this.communicator.send(methods_js_1.Methods.wallet_requestPermissions, permissions);
          return response.data;
        } catch {
          throw new permissions_js_1.PermissionsError("Permissions rejected", permissions_js_1.PERMISSIONS_REQUEST_REJECTED);
        }
      }
      isPermissionRequestValid(permissions) {
        return permissions.every((pr) => {
          if (typeof pr === "object") {
            return Object.keys(pr).every((method) => {
              if (Object.values(methods_js_1.RestrictedMethods).includes(method)) {
                return true;
              }
              return false;
            });
          }
          return false;
        });
      }
    };
    exports.Wallet = Wallet;
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/decorators/requirePermissions.js
var require_requirePermissions = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/decorators/requirePermissions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var index_js_1 = require_wallet2();
    var permissions_js_1 = require_permissions();
    var hasPermission = (required, permissions) => permissions.some((permission) => permission.parentCapability === required);
    var requirePermission = () => (_, propertyKey, descriptor) => {
      const originalMethod = descriptor.value;
      descriptor.value = async function() {
        const wallet = new index_js_1.Wallet(this.communicator);
        let currentPermissions = await wallet.getPermissions();
        if (!hasPermission(propertyKey, currentPermissions)) {
          currentPermissions = await wallet.requestPermissions([{ [propertyKey]: {} }]);
        }
        if (!hasPermission(propertyKey, currentPermissions)) {
          throw new permissions_js_1.PermissionsError("Permissions rejected", permissions_js_1.PERMISSIONS_REQUEST_REJECTED);
        }
        return originalMethod.apply(this);
      };
      return descriptor;
    };
    exports.default = requirePermission;
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/safe/index.js
var require_safe = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/safe/index.js"(exports) {
    "use strict";
    var __decorate = exports && exports.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
      else
        for (var i = decorators.length - 1; i >= 0; i--)
          if (d = decorators[i])
            r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Safe = void 0;
    var viem_1 = require_cjs();
    var signatures_js_1 = require_signatures2();
    var methods_js_1 = require_methods();
    var constants_js_1 = require_constants();
    var index_js_1 = require_types();
    var requirePermissions_js_1 = __importDefault(require_requirePermissions());
    var Safe = class {
      constructor(communicator) {
        this.communicator = communicator;
      }
      async getChainInfo() {
        const response = await this.communicator.send(methods_js_1.Methods.getChainInfo, void 0);
        return response.data;
      }
      async getInfo() {
        const response = await this.communicator.send(methods_js_1.Methods.getSafeInfo, void 0);
        return response.data;
      }
      // There is a possibility that this method will change because we may add pagination to the endpoint
      async experimental_getBalances({ currency = "usd" } = {}) {
        const response = await this.communicator.send(methods_js_1.Methods.getSafeBalances, {
          currency
        });
        return response.data;
      }
      async check1271Signature(messageHash, signature = "0x") {
        const safeInfo = await this.getInfo();
        const encodedIsValidSignatureCall = (0, viem_1.encodeFunctionData)({
          abi: [
            {
              constant: false,
              inputs: [
                {
                  name: "_dataHash",
                  type: "bytes32"
                },
                {
                  name: "_signature",
                  type: "bytes"
                }
              ],
              name: "isValidSignature",
              outputs: [
                {
                  name: "",
                  type: "bytes4"
                }
              ],
              payable: false,
              stateMutability: "nonpayable",
              type: "function"
            }
          ],
          functionName: "isValidSignature",
          args: [messageHash, signature]
        });
        const payload = {
          call: constants_js_1.RPC_CALLS.eth_call,
          params: [
            {
              to: safeInfo.safeAddress,
              data: encodedIsValidSignatureCall
            },
            "latest"
          ]
        };
        try {
          const response = await this.communicator.send(methods_js_1.Methods.rpcCall, payload);
          return response.data.slice(0, 10).toLowerCase() === signatures_js_1.MAGIC_VALUE;
        } catch (err) {
          return false;
        }
      }
      async check1271SignatureBytes(messageHash, signature = "0x") {
        const safeInfo = await this.getInfo();
        const encodedIsValidSignatureCall = (0, viem_1.encodeFunctionData)({
          abi: [
            {
              constant: false,
              inputs: [
                {
                  name: "_data",
                  type: "bytes"
                },
                {
                  name: "_signature",
                  type: "bytes"
                }
              ],
              name: "isValidSignature",
              outputs: [
                {
                  name: "",
                  type: "bytes4"
                }
              ],
              payable: false,
              stateMutability: "nonpayable",
              type: "function"
            }
          ],
          functionName: "isValidSignature",
          args: [messageHash, signature]
        });
        const payload = {
          call: constants_js_1.RPC_CALLS.eth_call,
          params: [
            {
              to: safeInfo.safeAddress,
              data: encodedIsValidSignatureCall
            },
            "latest"
          ]
        };
        try {
          const response = await this.communicator.send(methods_js_1.Methods.rpcCall, payload);
          return response.data.slice(0, 10).toLowerCase() === signatures_js_1.MAGIC_VALUE_BYTES;
        } catch (err) {
          return false;
        }
      }
      calculateMessageHash(message) {
        return (0, viem_1.hashMessage)(message);
      }
      calculateTypedMessageHash(typedMessage) {
        const chainId = typeof typedMessage.domain.chainId === "object" ? typedMessage.domain.chainId.toNumber() : Number(typedMessage.domain.chainId);
        let primaryType = typedMessage.primaryType;
        if (!primaryType) {
          const fields = Object.values(typedMessage.types);
          const primaryTypes = Object.keys(typedMessage.types).filter((typeName) => fields.every((dataTypes) => dataTypes.every(({ type }) => type.replace("[", "").replace("]", "") !== typeName)));
          if (primaryTypes.length === 0 || primaryTypes.length > 1)
            throw new Error("Please specify primaryType");
          primaryType = primaryTypes[0];
        }
        return (0, viem_1.hashTypedData)({
          message: typedMessage.message,
          domain: {
            ...typedMessage.domain,
            chainId,
            verifyingContract: typedMessage.domain.verifyingContract,
            salt: typedMessage.domain.salt
          },
          types: typedMessage.types,
          primaryType
        });
      }
      async getOffChainSignature(messageHash) {
        const response = await this.communicator.send(methods_js_1.Methods.getOffChainSignature, messageHash);
        return response.data;
      }
      async isMessageSigned(message, signature = "0x") {
        let check;
        if (typeof message === "string") {
          check = async () => {
            const messageHash = this.calculateMessageHash(message);
            const messageHashSigned = await this.isMessageHashSigned(messageHash, signature);
            return messageHashSigned;
          };
        }
        if ((0, index_js_1.isObjectEIP712TypedData)(message)) {
          check = async () => {
            const messageHash = this.calculateTypedMessageHash(message);
            const messageHashSigned = await this.isMessageHashSigned(messageHash, signature);
            return messageHashSigned;
          };
        }
        if (check) {
          const isValid = await check();
          return isValid;
        }
        throw new Error("Invalid message type");
      }
      async isMessageHashSigned(messageHash, signature = "0x") {
        const checks = [this.check1271Signature.bind(this), this.check1271SignatureBytes.bind(this)];
        for (const check of checks) {
          const isValid = await check(messageHash, signature);
          if (isValid) {
            return true;
          }
        }
        return false;
      }
      async getEnvironmentInfo() {
        const response = await this.communicator.send(methods_js_1.Methods.getEnvironmentInfo, void 0);
        return response.data;
      }
      async requestAddressBook() {
        const response = await this.communicator.send(methods_js_1.Methods.requestAddressBook, void 0);
        return response.data;
      }
    };
    exports.Safe = Safe;
    __decorate([
      (0, requirePermissions_js_1.default)()
    ], Safe.prototype, "requestAddressBook", null);
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/sdk.js
var require_sdk2 = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/sdk.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var index_js_1 = __importDefault(require_communication());
    var index_js_2 = require_txs();
    var index_js_3 = require_eth();
    var index_js_4 = require_safe();
    var index_js_5 = require_wallet2();
    var SafeAppsSDK = class {
      constructor(opts = {}) {
        const { allowedDomains = null, debug = false } = opts;
        this.communicator = new index_js_1.default(allowedDomains, debug);
        this.eth = new index_js_3.Eth(this.communicator);
        this.txs = new index_js_2.TXs(this.communicator);
        this.safe = new index_js_4.Safe(this.communicator);
        this.wallet = new index_js_5.Wallet(this.communicator);
      }
    };
    exports.default = SafeAppsSDK;
  }
});

// node_modules/@safe-global/safe-apps-sdk/dist/cjs/index.js
var require_cjs2 = __commonJS({
  "node_modules/@safe-global/safe-apps-sdk/dist/cjs/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSDKVersion = void 0;
    var sdk_js_1 = __importDefault(require_sdk2());
    exports.default = sdk_js_1.default;
    __exportStar(require_sdk2(), exports);
    __exportStar(require_types(), exports);
    __exportStar(require_methods(), exports);
    __exportStar(require_messageFormatter(), exports);
    var version_js_1 = require_version();
    Object.defineProperty(exports, "getSDKVersion", { enumerable: true, get: function() {
      return version_js_1.getSDKVersion;
    } });
    __exportStar(require_constants(), exports);
  }
});

// node_modules/@safe-global/safe-apps-provider/dist/utils.js
var require_utils10 = __commonJS({
  "node_modules/@safe-global/safe-apps-provider/dist/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.numberToHex = exports.getLowerCase = void 0;
    function getLowerCase(value) {
      if (value) {
        return value.toLowerCase();
      }
      return value;
    }
    exports.getLowerCase = getLowerCase;
    function numberToHex(value) {
      return `0x${value.toString(16)}`;
    }
    exports.numberToHex = numberToHex;
  }
});

// node_modules/@safe-global/safe-apps-provider/dist/provider.js
var require_provider = __commonJS({
  "node_modules/@safe-global/safe-apps-provider/dist/provider.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SafeAppProvider = void 0;
    var safe_apps_sdk_1 = require_cjs2();
    var events_1 = require_events();
    var utils_1 = require_utils10();
    var SafeAppProvider = class extends events_1.EventEmitter {
      constructor(safe, sdk) {
        super();
        this.submittedTxs = /* @__PURE__ */ new Map();
        this.safe = safe;
        this.sdk = sdk;
      }
      async connect() {
        this.emit("connect", { chainId: this.chainId });
        return;
      }
      async disconnect() {
        return;
      }
      get chainId() {
        return this.safe.chainId;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async request(request) {
        var _a, _b, _c, _d;
        const { method, params = [] } = request;
        switch (method) {
          case "eth_accounts":
            return [this.safe.safeAddress];
          case "net_version":
          case "eth_chainId":
            return (0, utils_1.numberToHex)(this.chainId);
          case "personal_sign": {
            const [message, address] = params;
            if (this.safe.safeAddress.toLowerCase() !== address.toLowerCase()) {
              throw new Error("The address or message hash is invalid");
            }
            const response = await this.sdk.txs.signMessage(message);
            const signature = "signature" in response ? response.signature : void 0;
            return signature || "0x";
          }
          case "eth_sign": {
            const [address, messageHash] = params;
            if (this.safe.safeAddress.toLowerCase() !== address.toLowerCase() || !messageHash.startsWith("0x")) {
              throw new Error("The address or message hash is invalid");
            }
            const response = await this.sdk.txs.signMessage(messageHash);
            const signature = "signature" in response ? response.signature : void 0;
            return signature || "0x";
          }
          case "eth_signTypedData":
          case "eth_signTypedData_v4": {
            const [address, typedData] = params;
            const parsedTypedData = typeof typedData === "string" ? JSON.parse(typedData) : typedData;
            if (this.safe.safeAddress.toLowerCase() !== address.toLowerCase()) {
              throw new Error("The address is invalid");
            }
            const response = await this.sdk.txs.signTypedMessage(parsedTypedData);
            const signature = "signature" in response ? response.signature : void 0;
            return signature || "0x";
          }
          case "eth_sendTransaction":
            const tx = {
              ...params[0],
              value: params[0].value || "0",
              data: params[0].data || "0x"
            };
            if (typeof tx.gas === "string" && tx.gas.startsWith("0x")) {
              tx.gas = parseInt(tx.gas, 16);
            }
            const resp = await this.sdk.txs.send({
              txs: [tx],
              params: { safeTxGas: tx.gas }
            });
            this.submittedTxs.set(resp.safeTxHash, {
              from: this.safe.safeAddress,
              hash: resp.safeTxHash,
              gas: 0,
              gasPrice: "0x00",
              nonce: 0,
              input: tx.data,
              value: tx.value,
              to: tx.to,
              blockHash: null,
              blockNumber: null,
              transactionIndex: null
            });
            return resp.safeTxHash;
          case "eth_blockNumber":
            const block = await this.sdk.eth.getBlockByNumber(["latest"]);
            return block.number;
          case "eth_getBalance":
            return this.sdk.eth.getBalance([(0, utils_1.getLowerCase)(params[0]), params[1]]);
          case "eth_getCode":
            return this.sdk.eth.getCode([(0, utils_1.getLowerCase)(params[0]), params[1]]);
          case "eth_getTransactionCount":
            return this.sdk.eth.getTransactionCount([(0, utils_1.getLowerCase)(params[0]), params[1]]);
          case "eth_getStorageAt":
            return this.sdk.eth.getStorageAt([(0, utils_1.getLowerCase)(params[0]), params[1], params[2]]);
          case "eth_getBlockByNumber":
            return this.sdk.eth.getBlockByNumber([params[0], params[1]]);
          case "eth_getBlockByHash":
            return this.sdk.eth.getBlockByHash([params[0], params[1]]);
          case "eth_getTransactionByHash":
            let txHash = params[0];
            try {
              const resp2 = await this.sdk.txs.getBySafeTxHash(txHash);
              txHash = resp2.txHash || txHash;
            } catch (e) {
            }
            if (this.submittedTxs.has(txHash)) {
              return this.submittedTxs.get(txHash);
            }
            return this.sdk.eth.getTransactionByHash([txHash]).then((tx2) => {
              if (tx2) {
                tx2.hash = params[0];
              }
              return tx2;
            });
          case "eth_getTransactionReceipt": {
            let txHash2 = params[0];
            try {
              const resp2 = await this.sdk.txs.getBySafeTxHash(txHash2);
              txHash2 = resp2.txHash || txHash2;
            } catch (e) {
            }
            return this.sdk.eth.getTransactionReceipt([txHash2]).then((tx2) => {
              if (tx2) {
                tx2.transactionHash = params[0];
              }
              return tx2;
            });
          }
          case "eth_estimateGas": {
            return this.sdk.eth.getEstimateGas(params[0]);
          }
          case "eth_call": {
            return this.sdk.eth.call([params[0], params[1]]);
          }
          case "eth_getLogs":
            return this.sdk.eth.getPastLogs([params[0]]);
          case "eth_gasPrice":
            return this.sdk.eth.getGasPrice();
          case "wallet_getPermissions":
            return this.sdk.wallet.getPermissions();
          case "wallet_requestPermissions":
            return this.sdk.wallet.requestPermissions(params[0]);
          case "safe_setSettings":
            return this.sdk.eth.setSafeSettings([params[0]]);
          case "wallet_sendCalls": {
            if (params[0].from !== this.safe.safeAddress) {
              throw Error("Invalid from address");
            }
            const txs = params[0].calls.map((call, i) => {
              if (call.chainId !== (0, utils_1.numberToHex)(this.chainId)) {
                throw new Error(`Invalid call #${i}: Safe is not on chain ${call.chainId}`);
              }
              if (!call.to) {
                throw new Error(`Invalid call #${i}: missing "to" field`);
              }
              return {
                to: call.to,
                data: call.data ?? "0x",
                value: call.value ?? (0, utils_1.numberToHex)(0)
              };
            });
            const { safeTxHash } = await this.sdk.txs.send({ txs });
            return safeTxHash;
          }
          case "wallet_getCallsStatus": {
            const CallStatus = {
              [safe_apps_sdk_1.TransactionStatus.AWAITING_CONFIRMATIONS]: "PENDING",
              [safe_apps_sdk_1.TransactionStatus.AWAITING_EXECUTION]: "PENDING",
              [safe_apps_sdk_1.TransactionStatus.CANCELLED]: "CONFIRMED",
              [safe_apps_sdk_1.TransactionStatus.FAILED]: "CONFIRMED",
              [safe_apps_sdk_1.TransactionStatus.SUCCESS]: "CONFIRMED"
            };
            const tx2 = await this.sdk.txs.getBySafeTxHash(params[0]);
            const status = CallStatus[tx2.txStatus];
            if (!tx2.txHash) {
              return {
                status
              };
            }
            const receipt = await this.sdk.eth.getTransactionReceipt([tx2.txHash]);
            if (!receipt) {
              return {
                status
              };
            }
            const calls = ((_b = (_a = tx2.txData) == null ? void 0 : _a.dataDecoded) == null ? void 0 : _b.method) !== "multiSend" ? 1 : (
              // Number of batched transactions
              ((_d = (_c = tx2.txData.dataDecoded.parameters) == null ? void 0 : _c[0].valueDecoded) == null ? void 0 : _d.length) ?? 1
            );
            const blockNumber = Number(receipt.blockNumber);
            const gasUsed = Number(receipt.gasUsed);
            const receipts = Array(calls).fill({
              logs: receipt.logs,
              status: (0, utils_1.numberToHex)(tx2.txStatus === safe_apps_sdk_1.TransactionStatus.SUCCESS ? 1 : 0),
              chainId: (0, utils_1.numberToHex)(this.chainId),
              blockHash: receipt.blockHash,
              blockNumber: (0, utils_1.numberToHex)(blockNumber),
              gasUsed: (0, utils_1.numberToHex)(gasUsed),
              transactionHash: tx2.txHash
            });
            return {
              status,
              receipts
            };
          }
          case "wallet_showCallsStatus": {
            throw new Error(`"${request.method}" not supported`);
          }
          case "wallet_getCapabilities": {
            return {
              [(0, utils_1.numberToHex)(this.chainId)]: {
                atomicBatch: {
                  supported: true
                }
              }
            };
          }
          default:
            throw Error(`"${request.method}" not implemented`);
        }
      }
      // this method is needed for ethers v4
      // https://github.com/ethers-io/ethers.js/blob/427e16826eb15d52d25c4f01027f8db22b74b76c/src.ts/providers/web3-provider.ts#L41-L55
      send(request, callback) {
        if (!request)
          callback("Undefined request");
        this.request(request).then((result) => callback(null, { jsonrpc: "2.0", id: request.id, result })).catch((error) => callback(error, null));
      }
    };
    exports.SafeAppProvider = SafeAppProvider;
  }
});

// node_modules/@safe-global/safe-apps-provider/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/@safe-global/safe-apps-provider/dist/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SafeAppProvider = void 0;
    var provider_1 = require_provider();
    Object.defineProperty(exports, "SafeAppProvider", { enumerable: true, get: function() {
      return provider_1.SafeAppProvider;
    } });
  }
});
export default require_dist2();
/*! Bundled license information:

@noble/hashes/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/hashes/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/abstract/utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/abstract/modular.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/abstract/curve.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/abstract/weierstrass.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/_shortw_utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/abstract/utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
//# sourceMappingURL=dist-JV57XJ65.js.map
