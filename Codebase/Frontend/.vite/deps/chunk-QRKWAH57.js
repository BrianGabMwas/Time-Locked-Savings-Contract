import {
  secp256k1
} from "./chunk-RD5623SA.js";
import {
  addressResolverAbi,
  call,
  createBatchScheduler,
  decodeFunctionResult,
  encodeDeployData,
  encodeFunctionData,
  isAddressEqual,
  multicall3Abi,
  serializeStateOverride,
  textResolverAbi,
  universalResolverResolveAbi,
  universalResolverReverseAbi,
  universalSignatureValidatorAbi,
  universalSignatureValidatorByteCode,
  withResolvers
} from "./chunk-A2QNBEI4.js";
import {
  AccountNotFoundError,
  AccountTypeNotSupportedError,
  HashMD,
  assertCurrentChain,
  blobsToCommitments,
  blobsToProofs,
  commitmentsToVersionedHashes,
  formatBlock,
  formatLog,
  formatTransaction,
  formatTransactionReceipt,
  getCode,
  getTransactionType,
  toBlobSidecars,
  toRlp
} from "./chunk-UIMCO67C.js";
import {
  AbiDecodingDataSizeTooSmallError,
  AbiDecodingZeroDataError,
  AbiEventNotFoundError,
  AbiEventSignatureEmptyTopicsError,
  AbiEventSignatureNotFoundError,
  BaseError,
  BytesSizeMismatchError,
  CallExecutionError,
  ChainDisconnectedError,
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  ContractFunctionZeroDataError,
  DecodeLogDataMismatch,
  DecodeLogTopicsMismatch,
  HttpRequestError,
  InternalRpcError,
  InvalidAddressError,
  InvalidInputRpcError,
  InvalidParamsRpcError,
  InvalidRequestRpcError,
  JsonRpcVersionUnsupportedError,
  LimitExceededRpcError,
  LruMap,
  MethodNotFoundRpcError,
  MethodNotSupportedRpcError,
  ParseRpcError,
  PositionOutOfBoundsError,
  ProviderDisconnectedError,
  RawContractError,
  ResourceNotFoundRpcError,
  ResourceUnavailableRpcError,
  RpcRequestError,
  SocketClosedError,
  SwitchChainError,
  TimeoutError,
  TransactionExecutionError,
  TransactionNotFoundError,
  TransactionReceiptNotFoundError,
  TransactionRejectedRpcError,
  UnauthorizedProviderError,
  UnknownNodeError,
  UnknownRpcError,
  UnsupportedProviderMethodError,
  UserRejectedRequestError,
  WaitForTransactionReceiptTimeoutError,
  WebSocketRequestError,
  assertRequest,
  bytesRegex,
  bytesToHex,
  checksumAddress,
  concat,
  concatHex,
  decodeAbiParameters,
  encodeAbiParameters,
  extract,
  formatAbiItem,
  formatEther,
  formatGwei,
  formatTransactionRequest,
  getAbiItem,
  getAddress,
  getCallError,
  getChainContractAddress,
  getNodeError,
  hexToBigInt,
  hexToBool,
  hexToBytes,
  hexToNumber,
  integerRegex,
  isAddress,
  isHex,
  keccak256,
  numberToHex,
  panicReasons,
  parseAccount,
  prettyPrint,
  rotl,
  size,
  sliceHex,
  stringToBytes,
  stringToHex,
  stringify,
  toBytes,
  toEventSelector,
  toHex,
  trim,
  wrapConstructor
} from "./chunk-K5GJ5XQN.js";
import {
  __export
} from "./chunk-GIZG7J7H.js";

// node_modules/viem/_esm/utils/promise/withDedupe.js
var promiseCache = new LruMap(8192);
function withDedupe(fn, { enabled = true, id }) {
  if (!enabled || !id)
    return fn();
  if (promiseCache.get(id))
    return promiseCache.get(id);
  const promise = fn().finally(() => promiseCache.delete(id));
  promiseCache.set(id, promise);
  return promise;
}

// node_modules/viem/_esm/utils/wait.js
async function wait(time) {
  return new Promise((res) => setTimeout(res, time));
}

// node_modules/viem/_esm/utils/promise/withRetry.js
function withRetry(fn, { delay: delay_ = 100, retryCount = 2, shouldRetry: shouldRetry2 = () => true } = {}) {
  return new Promise((resolve, reject) => {
    const attemptRetry = async ({ count = 0 } = {}) => {
      const retry = async ({ error }) => {
        const delay = typeof delay_ === "function" ? delay_({ count, error }) : delay_;
        if (delay)
          await wait(delay);
        attemptRetry({ count: count + 1 });
      };
      try {
        const data = await fn();
        resolve(data);
      } catch (err) {
        if (count < retryCount && await shouldRetry2({ count, error: err }))
          return retry({ error: err });
        reject(err);
      }
    };
    attemptRetry();
  });
}

// node_modules/viem/_esm/utils/buildRequest.js
function buildRequest(request, options = {}) {
  return async (args, overrideOptions = {}) => {
    const { dedupe = false, retryDelay = 150, retryCount = 3, uid: uid2 } = {
      ...options,
      ...overrideOptions
    };
    const requestId = dedupe ? keccak256(stringToHex(`${uid2}.${stringify(args)}`)) : void 0;
    return withDedupe(() => withRetry(async () => {
      try {
        return await request(args);
      } catch (err_) {
        const err = err_;
        switch (err.code) {
          case ParseRpcError.code:
            throw new ParseRpcError(err);
          case InvalidRequestRpcError.code:
            throw new InvalidRequestRpcError(err);
          case MethodNotFoundRpcError.code:
            throw new MethodNotFoundRpcError(err, { method: args.method });
          case InvalidParamsRpcError.code:
            throw new InvalidParamsRpcError(err);
          case InternalRpcError.code:
            throw new InternalRpcError(err);
          case InvalidInputRpcError.code:
            throw new InvalidInputRpcError(err);
          case ResourceNotFoundRpcError.code:
            throw new ResourceNotFoundRpcError(err);
          case ResourceUnavailableRpcError.code:
            throw new ResourceUnavailableRpcError(err);
          case TransactionRejectedRpcError.code:
            throw new TransactionRejectedRpcError(err);
          case MethodNotSupportedRpcError.code:
            throw new MethodNotSupportedRpcError(err, {
              method: args.method
            });
          case LimitExceededRpcError.code:
            throw new LimitExceededRpcError(err);
          case JsonRpcVersionUnsupportedError.code:
            throw new JsonRpcVersionUnsupportedError(err);
          case UserRejectedRequestError.code:
            throw new UserRejectedRequestError(err);
          case UnauthorizedProviderError.code:
            throw new UnauthorizedProviderError(err);
          case UnsupportedProviderMethodError.code:
            throw new UnsupportedProviderMethodError(err);
          case ProviderDisconnectedError.code:
            throw new ProviderDisconnectedError(err);
          case ChainDisconnectedError.code:
            throw new ChainDisconnectedError(err);
          case SwitchChainError.code:
            throw new SwitchChainError(err);
          case 5e3:
            throw new UserRejectedRequestError(err);
          default:
            if (err_ instanceof BaseError)
              throw err_;
            throw new UnknownRpcError(err);
        }
      }
    }, {
      delay: ({ count, error }) => {
        var _a;
        if (error && error instanceof HttpRequestError) {
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
    if (error.code === LimitExceededRpcError.code)
      return true;
    if (error.code === InternalRpcError.code)
      return true;
    return false;
  }
  if (error instanceof HttpRequestError && error.status) {
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

// node_modules/viem/_esm/utils/uid.js
var size2 = 256;
var index = size2;
var buffer;
function uid(length = 11) {
  if (!buffer || index + length > size2 * 2) {
    buffer = "";
    index = 0;
    for (let i = 0; i < size2; i++) {
      buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
    }
  }
  return buffer.substring(index, index++ + length);
}

// node_modules/viem/_esm/clients/transports/createTransport.js
function createTransport({ key, name, request, retryCount = 3, retryDelay = 150, timeout, type }, value) {
  const uid2 = uid();
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
    request: buildRequest(request, { retryCount, retryDelay, uid: uid2 }),
    value
  };
}

// node_modules/viem/_esm/clients/transports/custom.js
function custom(provider, config = {}) {
  const { key = "custom", name = "Custom Provider", retryDelay } = config;
  return ({ retryCount: defaultRetryCount }) => createTransport({
    key,
    name,
    request: provider.request.bind(provider),
    retryCount: config.retryCount ?? defaultRetryCount,
    retryDelay,
    type: "custom"
  });
}

// node_modules/viem/_esm/errors/transport.js
var UrlRequiredError = class extends BaseError {
  constructor() {
    super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.", {
      docsPath: "/docs/clients/intro",
      name: "UrlRequiredError"
    });
  }
};

// node_modules/viem/_esm/utils/promise/withTimeout.js
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

// node_modules/viem/_esm/utils/rpc/id.js
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
var idCache = createIdStore();

// node_modules/viem/_esm/utils/rpc/http.js
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
        const response = await withTimeout(async ({ signal }) => {
          const init = {
            ...fetchOptions,
            body: Array.isArray(body) ? stringify(body.map((body2) => ({
              jsonrpc: "2.0",
              id: body2.id ?? idCache.take(),
              ...body2
            }))) : stringify({
              jsonrpc: "2.0",
              id: body.id ?? idCache.take(),
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
          errorInstance: new TimeoutError({ body, url }),
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
          throw new HttpRequestError({
            body,
            details: stringify(data.error) || response.statusText,
            headers: response.headers,
            status: response.status,
            url
          });
        }
        return data;
      } catch (err) {
        if (err instanceof HttpRequestError)
          throw err;
        if (err instanceof TimeoutError)
          throw err;
        throw new HttpRequestError({
          body,
          cause: err,
          url
        });
      }
    }
  };
}

// node_modules/viem/_esm/clients/transports/http.js
function http(url, config = {}) {
  const { batch, fetchOptions, key = "http", name = "HTTP JSON-RPC", onFetchRequest, onFetchResponse, retryDelay } = config;
  return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
    const { batchSize = 1e3, wait: wait2 = 0 } = typeof batch === "object" ? batch : {};
    const retryCount = config.retryCount ?? retryCount_;
    const timeout = timeout_ ?? config.timeout ?? 1e4;
    const url_ = url || (chain == null ? void 0 : chain.rpcUrls.default.http[0]);
    if (!url_)
      throw new UrlRequiredError();
    const rpcClient = getHttpRpcClient(url_, {
      fetchOptions,
      onRequest: onFetchRequest,
      onResponse: onFetchResponse,
      timeout
    });
    return createTransport({
      key,
      name,
      async request({ method, params }) {
        const body = { method, params };
        const { schedule } = createBatchScheduler({
          id: url_,
          wait: wait2,
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
          throw new RpcRequestError({
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

// node_modules/viem/_esm/utils/rpc/socket.js
var socketClientCache = /* @__PURE__ */ new Map();
async function getSocketRpcClient(parameters) {
  const { getSocket: getSocket2, keepAlive = true, key = "socket", reconnect = true, url } = parameters;
  const { interval: keepAliveInterval = 3e4 } = typeof keepAlive === "object" ? keepAlive : {};
  const { attempts = 5, delay = 2e3 } = typeof reconnect === "object" ? reconnect : {};
  let socketClient = socketClientCache.get(`${key}:${url}`);
  if (socketClient)
    return socketClient;
  let reconnectCount = 0;
  const { schedule } = createBatchScheduler({
    id: `${key}:${url}`,
    fn: async () => {
      const requests = /* @__PURE__ */ new Map();
      const subscriptions = /* @__PURE__ */ new Map();
      let error;
      let socket;
      let keepAliveTimer;
      async function setup() {
        const result = await getSocket2({
          onClose() {
            var _a, _b;
            for (const request of requests.values())
              (_a = request.onError) == null ? void 0 : _a.call(request, new SocketClosedError({ url }));
            for (const subscription of subscriptions.values())
              (_b = subscription.onError) == null ? void 0 : _b.call(subscription, new SocketClosedError({ url }));
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
          socketClientCache.delete(`${key}:${url}`);
        },
        get socket() {
          return socket;
        },
        request({ body, onError, onResponse }) {
          if (error && onError)
            onError(error);
          const id = body.id ?? idCache.take();
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
          return withTimeout(() => new Promise((onResponse, onError) => this.request({
            body,
            onError,
            onResponse
          })), {
            errorInstance: new TimeoutError({ body, url }),
            timeout
          });
        },
        requests,
        subscriptions,
        url
      };
      socketClientCache.set(`${key}:${url}`, socketClient);
      return [socketClient];
    }
  });
  const [_, [socketClient_]] = await schedule();
  return socketClient_;
}

// node_modules/viem/_esm/utils/rpc/webSocket.js
async function getWebSocketRpcClient(url, options = {}) {
  const { keepAlive, reconnect } = options;
  return getSocketRpcClient({
    async getSocket({ onClose, onError, onOpen, onResponse }) {
      const WebSocket = await import("./native-6HLWN4XV.js").then((module) => module.WebSocket);
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
              throw new WebSocketRequestError({
                url: socket.url,
                cause: new SocketClosedError({ url: socket.url })
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
            throw new WebSocketRequestError({
              body,
              url: socket.url,
              cause: new SocketClosedError({ url: socket.url })
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

// node_modules/viem/_esm/utils/rpc/compat.js
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
  const client = await getWebSocketRpcClient(url);
  return Object.assign(client.socket, {
    requests: client.requests,
    subscriptions: client.subscriptions
  });
}
var rpc = {
  /**
   * @deprecated use `getHttpRpcClient` instead.
   *
   * ```diff
   * -import { rpc } from 'viem/utils'
   * +import { getHttpRpcClient } from 'viem/utils'
   *
   * -rpc.http(url, params)
   * +const httpClient = getHttpRpcClient(url)
   * +httpClient.request(params)
   * ```
   */
  http(url, params) {
    return getHttpRpcClient(url).request(params);
  },
  /**
   * @deprecated use `getWebSocketRpcClient` instead.
   *
   * ```diff
   * -import { rpc } from 'viem/utils'
   * +import { getWebSocketRpcClient } from 'viem/utils'
   *
   * -rpc.webSocket(url, params)
   * +const webSocketClient = getWebSocketRpcClient(url)
   * +webSocketClient.request(params)
   * ```
   */
  webSocket,
  /**
   * @deprecated use `getWebSocketRpcClient` instead.
   *
   * ```diff
   * -import { rpc } from 'viem/utils'
   * +import { getWebSocketRpcClient } from 'viem/utils'
   *
   * -const response = await rpc.webSocketAsync(url, params)
   * +const webSocketClient = getWebSocketRpcClient(url)
   * +const response = await webSocketClient.requestAsync(params)
   * ```
   */
  webSocketAsync
};

// node_modules/viem/_esm/clients/transports/webSocket.js
function webSocket2(url, config = {}) {
  const { keepAlive, key = "webSocket", name = "WebSocket JSON-RPC", reconnect, retryDelay } = config;
  return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
    var _a;
    const retryCount = config.retryCount ?? retryCount_;
    const timeout = timeout_ ?? config.timeout ?? 1e4;
    const url_ = url || ((_a = chain == null ? void 0 : chain.rpcUrls.default.webSocket) == null ? void 0 : _a[0]);
    if (!url_)
      throw new UrlRequiredError();
    return createTransport({
      key,
      name,
      async request({ method, params }) {
        const body = { method, params };
        const rpcClient = await getWebSocketRpcClient(url_, {
          keepAlive,
          reconnect
        });
        const { error, result } = await rpcClient.requestAsync({
          body,
          timeout
        });
        if (error)
          throw new RpcRequestError({
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
        return getSocket(url_);
      },
      getRpcClient() {
        return getWebSocketRpcClient(url_);
      },
      async subscribe({ params, onData, onError }) {
        const rpcClient = await getWebSocketRpcClient(url_);
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

// node_modules/viem/_esm/utils/getAction.js
function getAction(client, actionFn, name) {
  const action_implicit = client[actionFn.name];
  if (typeof action_implicit === "function")
    return action_implicit;
  const action_explicit = client[name];
  if (typeof action_explicit === "function")
    return action_explicit;
  return (params) => actionFn(client, params);
}

// node_modules/viem/_esm/errors/log.js
var FilterTypeNotSupportedError = class extends BaseError {
  constructor(type) {
    super(`Filter type "${type}" is not supported.`, {
      name: "FilterTypeNotSupportedError"
    });
  }
};

// node_modules/viem/_esm/utils/abi/encodeEventTopics.js
var docsPath = "/docs/contract/encodeEventTopics";
function encodeEventTopics(parameters) {
  var _a;
  const { abi: abi2, eventName, args } = parameters;
  let abiItem = abi2[0];
  if (eventName) {
    const item = getAbiItem({ abi: abi2, name: eventName });
    if (!item)
      throw new AbiEventNotFoundError(eventName, { docsPath });
    abiItem = item;
  }
  if (abiItem.type !== "event")
    throw new AbiEventNotFoundError(void 0, { docsPath });
  const definition = formatAbiItem(abiItem);
  const signature = toEventSelector(definition);
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
    return keccak256(toBytes(value));
  if (param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
    throw new FilterTypeNotSupportedError(param.type);
  return encodeAbiParameters([param], [value]);
}

// node_modules/viem/_esm/utils/filters/createFilterRequestScope.js
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

// node_modules/viem/_esm/actions/public/createContractEventFilter.js
async function createContractEventFilter(client, parameters) {
  const { address, abi: abi2, args, eventName, fromBlock, strict, toBlock } = parameters;
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newFilter"
  });
  const topics = eventName ? encodeEventTopics({
    abi: abi2,
    args,
    eventName
  }) : void 0;
  const id = await client.request({
    method: "eth_newFilter",
    params: [
      {
        address,
        fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
        toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
        topics
      }
    ]
  });
  return {
    abi: abi2,
    args,
    eventName,
    id,
    request: getRequest(id),
    strict: Boolean(strict),
    type: "event"
  };
}

// node_modules/viem/_esm/utils/errors/getContractError.js
var EXECUTION_REVERTED_ERROR_CODE = 3;
function getContractError(err, { abi: abi2, address, args, docsPath: docsPath3, functionName, sender }) {
  const error = err instanceof RawContractError ? err : err instanceof BaseError ? err.walk((err2) => "data" in err2) || err.walk() : {};
  const { code, data, details, message, shortMessage } = error;
  const cause = (() => {
    if (err instanceof AbiDecodingZeroDataError)
      return new ContractFunctionZeroDataError({ functionName });
    if ([EXECUTION_REVERTED_ERROR_CODE, InternalRpcError.code].includes(code) && (data || details || message || shortMessage)) {
      return new ContractFunctionRevertedError({
        abi: abi2,
        data: typeof data === "object" ? data.data : data,
        functionName,
        message: error instanceof RpcRequestError ? details : shortMessage ?? message
      });
    }
    return err;
  })();
  return new ContractFunctionExecutionError(cause, {
    abi: abi2,
    args,
    contractAddress: address,
    docsPath: docsPath3,
    functionName,
    sender
  });
}

// node_modules/viem/_esm/accounts/utils/publicKeyToAddress.js
function publicKeyToAddress(publicKey) {
  const address = keccak256(`0x${publicKey.substring(4)}`).substring(26);
  return checksumAddress(`0x${address}`);
}

// node_modules/viem/_esm/utils/signature/recoverPublicKey.js
async function recoverPublicKey({ hash, signature }) {
  const hashHex = isHex(hash) ? hash : toHex(hash);
  const { secp256k1: secp256k12 } = await import("./secp256k1-5G5UJRRS.js");
  const signature_ = (() => {
    if (typeof signature === "object" && "r" in signature && "s" in signature) {
      const { r, s, v, yParity } = signature;
      const yParityOrV2 = Number(yParity ?? v);
      const recoveryBit2 = toRecoveryBit(yParityOrV2);
      return new secp256k12.Signature(hexToBigInt(r), hexToBigInt(s)).addRecoveryBit(recoveryBit2);
    }
    const signatureHex = isHex(signature) ? signature : toHex(signature);
    const yParityOrV = hexToNumber(`0x${signatureHex.slice(130)}`);
    const recoveryBit = toRecoveryBit(yParityOrV);
    return secp256k12.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
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

// node_modules/viem/_esm/utils/signature/recoverAddress.js
async function recoverAddress({ hash, signature }) {
  return publicKeyToAddress(await recoverPublicKey({ hash, signature }));
}

// node_modules/viem/_esm/experimental/eip7702/utils/hashAuthorization.js
function hashAuthorization(parameters) {
  const { chainId, contractAddress, nonce, to } = parameters;
  const hash = keccak256(concatHex([
    "0x05",
    toRlp([
      chainId ? numberToHex(chainId) : "0x",
      contractAddress,
      nonce ? numberToHex(nonce) : "0x"
    ])
  ]));
  if (to === "bytes")
    return hexToBytes(hash);
  return hash;
}

// node_modules/viem/_esm/experimental/eip7702/utils/recoverAuthorizationAddress.js
async function recoverAuthorizationAddress(parameters) {
  const { authorization, signature } = parameters;
  return recoverAddress({
    hash: hashAuthorization(authorization),
    signature: signature ?? authorization
  });
}

// node_modules/viem/_esm/errors/estimateGas.js
var EstimateGasExecutionError = class extends BaseError {
  constructor(cause, { account, docsPath: docsPath3, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
    var _a;
    const prettyArgs = prettyPrint({
      from: account == null ? void 0 : account.address,
      to,
      value: typeof value !== "undefined" && `${formatEther(value)} ${((_a = chain == null ? void 0 : chain.nativeCurrency) == null ? void 0 : _a.symbol) || "ETH"}`,
      data,
      gas,
      gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
      maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
      maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
      nonce
    });
    super(cause.shortMessage, {
      cause,
      docsPath: docsPath3,
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

// node_modules/viem/_esm/utils/errors/getEstimateGasError.js
function getEstimateGasError(err, { docsPath: docsPath3, ...args }) {
  const cause = (() => {
    const cause2 = getNodeError(err, args);
    if (cause2 instanceof UnknownNodeError)
      return err;
    return cause2;
  })();
  return new EstimateGasExecutionError(cause, {
    docsPath: docsPath3,
    ...args
  });
}

// node_modules/viem/_esm/errors/fee.js
var BaseFeeScalarError = class extends BaseError {
  constructor() {
    super("`baseFeeMultiplier` must be greater than 1.", {
      name: "BaseFeeScalarError"
    });
  }
};
var Eip1559FeesNotSupportedError = class extends BaseError {
  constructor() {
    super("Chain does not support EIP-1559 fees.", {
      name: "Eip1559FeesNotSupportedError"
    });
  }
};
var MaxFeePerGasTooLowError = class extends BaseError {
  constructor({ maxPriorityFeePerGas }) {
    super(`\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${formatGwei(maxPriorityFeePerGas)} gwei).`, { name: "MaxFeePerGasTooLowError" });
  }
};

// node_modules/viem/_esm/errors/block.js
var BlockNotFoundError = class extends BaseError {
  constructor({ blockHash, blockNumber }) {
    let identifier = "Block";
    if (blockHash)
      identifier = `Block at hash "${blockHash}"`;
    if (blockNumber)
      identifier = `Block at number "${blockNumber}"`;
    super(`${identifier} could not be found.`, { name: "BlockNotFoundError" });
  }
};

// node_modules/viem/_esm/actions/public/getBlock.js
async function getBlock(client, { blockHash, blockNumber, blockTag: blockTag_, includeTransactions: includeTransactions_ } = {}) {
  var _a, _b, _c;
  const blockTag = blockTag_ ?? "latest";
  const includeTransactions = includeTransactions_ ?? false;
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
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
    throw new BlockNotFoundError({ blockHash, blockNumber });
  const format = ((_c = (_b = (_a = client.chain) == null ? void 0 : _a.formatters) == null ? void 0 : _b.block) == null ? void 0 : _c.format) || formatBlock;
  return format(block);
}

// node_modules/viem/_esm/actions/public/getGasPrice.js
async function getGasPrice(client) {
  const gasPrice = await client.request({
    method: "eth_gasPrice"
  });
  return BigInt(gasPrice);
}

// node_modules/viem/_esm/actions/public/estimateMaxPriorityFeePerGas.js
async function estimateMaxPriorityFeePerGas(client, args) {
  return internal_estimateMaxPriorityFeePerGas(client, args);
}
async function internal_estimateMaxPriorityFeePerGas(client, args) {
  var _a, _b;
  const { block: block_, chain = client.chain, request } = args || {};
  try {
    const maxPriorityFeePerGas = ((_a = chain == null ? void 0 : chain.fees) == null ? void 0 : _a.maxPriorityFeePerGas) ?? ((_b = chain == null ? void 0 : chain.fees) == null ? void 0 : _b.defaultPriorityFee);
    if (typeof maxPriorityFeePerGas === "function") {
      const block = block_ || await getAction(client, getBlock, "getBlock")({});
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
    return hexToBigInt(maxPriorityFeePerGasHex);
  } catch {
    const [block, gasPrice] = await Promise.all([
      block_ ? Promise.resolve(block_) : getAction(client, getBlock, "getBlock")({}),
      getAction(client, getGasPrice, "getGasPrice")({})
    ]);
    if (typeof block.baseFeePerGas !== "bigint")
      throw new Eip1559FeesNotSupportedError();
    const maxPriorityFeePerGas = gasPrice - block.baseFeePerGas;
    if (maxPriorityFeePerGas < 0n)
      return 0n;
    return maxPriorityFeePerGas;
  }
}

// node_modules/viem/_esm/actions/public/estimateFeesPerGas.js
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
    throw new BaseFeeScalarError();
  const decimals = ((_a = baseFeeMultiplier.toString().split(".")[1]) == null ? void 0 : _a.length) ?? 0;
  const denominator = 10 ** decimals;
  const multiply = (base) => base * BigInt(Math.ceil(baseFeeMultiplier * denominator)) / BigInt(denominator);
  const block = block_ ? block_ : await getAction(client, getBlock, "getBlock")({});
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
      throw new Eip1559FeesNotSupportedError();
    const maxPriorityFeePerGas = typeof (request == null ? void 0 : request.maxPriorityFeePerGas) === "bigint" ? request.maxPriorityFeePerGas : await internal_estimateMaxPriorityFeePerGas(client, {
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
  const gasPrice = (request == null ? void 0 : request.gasPrice) ?? multiply(await getAction(client, getGasPrice, "getGasPrice")({}));
  return {
    gasPrice
  };
}

// node_modules/viem/_esm/actions/public/getTransactionCount.js
async function getTransactionCount(client, { address, blockTag = "latest", blockNumber }) {
  const count = await client.request({
    method: "eth_getTransactionCount",
    params: [address, blockNumber ? numberToHex(blockNumber) : blockTag]
  }, { dedupe: Boolean(blockNumber) });
  return hexToNumber(count);
}

// node_modules/viem/_esm/actions/public/getChainId.js
async function getChainId(client) {
  const chainIdHex = await client.request({
    method: "eth_chainId"
  }, { dedupe: true });
  return hexToNumber(chainIdHex);
}

// node_modules/viem/_esm/actions/wallet/prepareTransactionRequest.js
var defaultParameters = [
  "blobVersionedHashes",
  "chainId",
  "fees",
  "gas",
  "nonce",
  "type"
];
async function prepareTransactionRequest(client, args) {
  const { account: account_ = client.account, blobs, chain, gas, kzg, nonce, nonceManager: nonceManager2, parameters = defaultParameters, type } = args;
  const account = account_ ? parseAccount(account_) : account_;
  const request = { ...args, ...account ? { from: account == null ? void 0 : account.address } : {} };
  let block;
  async function getBlock2() {
    if (block)
      return block;
    block = await getAction(client, getBlock, "getBlock")({ blockTag: "latest" });
    return block;
  }
  let chainId;
  async function getChainId2() {
    if (chainId)
      return chainId;
    if (chain)
      return chain.id;
    if (typeof args.chainId !== "undefined")
      return args.chainId;
    const chainId_ = await getAction(client, getChainId, "getChainId")({});
    chainId = chainId_;
    return chainId;
  }
  if ((parameters.includes("blobVersionedHashes") || parameters.includes("sidecars")) && blobs && kzg) {
    const commitments = blobsToCommitments({ blobs, kzg });
    if (parameters.includes("blobVersionedHashes")) {
      const versionedHashes = commitmentsToVersionedHashes({
        commitments,
        to: "hex"
      });
      request.blobVersionedHashes = versionedHashes;
    }
    if (parameters.includes("sidecars")) {
      const proofs = blobsToProofs({ blobs, commitments, kzg });
      const sidecars = toBlobSidecars({
        blobs,
        commitments,
        proofs,
        to: "hex"
      });
      request.sidecars = sidecars;
    }
  }
  if (parameters.includes("chainId"))
    request.chainId = await getChainId2();
  if ((parameters.includes("fees") || parameters.includes("type")) && typeof type === "undefined") {
    try {
      request.type = getTransactionType(request);
    } catch {
      const block2 = await getBlock2();
      request.type = typeof (block2 == null ? void 0 : block2.baseFeePerGas) === "bigint" ? "eip1559" : "legacy";
    }
  }
  if (parameters.includes("fees")) {
    if (request.type !== "legacy" && request.type !== "eip2930") {
      if (typeof request.maxFeePerGas === "undefined" || typeof request.maxPriorityFeePerGas === "undefined") {
        const block2 = await getBlock2();
        const { maxFeePerGas, maxPriorityFeePerGas } = await internal_estimateFeesPerGas(client, {
          block: block2,
          chain,
          request
        });
        if (typeof args.maxPriorityFeePerGas === "undefined" && args.maxFeePerGas && args.maxFeePerGas < maxPriorityFeePerGas)
          throw new MaxFeePerGasTooLowError({
            maxPriorityFeePerGas
          });
        request.maxPriorityFeePerGas = maxPriorityFeePerGas;
        request.maxFeePerGas = maxFeePerGas;
      }
    } else {
      if (typeof args.maxFeePerGas !== "undefined" || typeof args.maxPriorityFeePerGas !== "undefined")
        throw new Eip1559FeesNotSupportedError();
      const block2 = await getBlock2();
      const { gasPrice: gasPrice_ } = await internal_estimateFeesPerGas(client, {
        block: block2,
        chain,
        request,
        type: "legacy"
      });
      request.gasPrice = gasPrice_;
    }
  }
  if (parameters.includes("gas") && typeof gas === "undefined")
    request.gas = await getAction(client, estimateGas, "estimateGas")({
      ...request,
      account: account ? { address: account.address, type: "json-rpc" } : account
    });
  if (parameters.includes("nonce") && typeof nonce === "undefined" && account) {
    if (nonceManager2) {
      const chainId2 = await getChainId2();
      request.nonce = await nonceManager2.consume({
        address: account.address,
        chainId: chainId2,
        client
      });
    } else {
      request.nonce = await getAction(client, getTransactionCount, "getTransactionCount")({
        address: account.address,
        blockTag: "pending"
      });
    }
  }
  assertRequest(request);
  delete request.parameters;
  return request;
}

// node_modules/viem/_esm/actions/public/getBalance.js
async function getBalance(client, { address, blockNumber, blockTag = "latest" }) {
  const blockNumberHex = blockNumber ? numberToHex(blockNumber) : void 0;
  const balance = await client.request({
    method: "eth_getBalance",
    params: [address, blockNumberHex || blockTag]
  });
  return BigInt(balance);
}

// node_modules/viem/_esm/actions/public/estimateGas.js
async function estimateGas(client, args) {
  var _a, _b, _c;
  const { account: account_ = client.account } = args;
  const account = account_ ? parseAccount(account_) : void 0;
  try {
    let estimateGas_rpc = function(parameters) {
      const { block: block2, request: request2, rpcStateOverride: rpcStateOverride2 } = parameters;
      return client.request({
        method: "eth_estimateGas",
        params: rpcStateOverride2 ? [request2, block2 ?? "latest", rpcStateOverride2] : block2 ? [request2, block2] : [request2]
      });
    };
    const { accessList, authorizationList, blobs, blobVersionedHashes, blockNumber, blockTag, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, value, stateOverride, ...rest } = await prepareTransactionRequest(client, {
      ...args,
      parameters: (
        // Some RPC Providers do not compute versioned hashes from blobs. We will need
        // to compute them.
        (account == null ? void 0 : account.type) === "local" ? void 0 : ["blobVersionedHashes"]
      )
    });
    const blockNumberHex = blockNumber ? numberToHex(blockNumber) : void 0;
    const block = blockNumberHex || blockTag;
    const rpcStateOverride = serializeStateOverride(stateOverride);
    const to = await (async () => {
      if (rest.to)
        return rest.to;
      if (authorizationList && authorizationList.length > 0)
        return await recoverAuthorizationAddress({
          authorization: authorizationList[0]
        }).catch(() => {
          throw new BaseError("`to` is required. Could not infer from `authorizationList`");
        });
      return void 0;
    })();
    assertRequest(args);
    const chainFormat = (_c = (_b = (_a = client.chain) == null ? void 0 : _a.formatters) == null ? void 0 : _b.transactionRequest) == null ? void 0 : _c.format;
    const format = chainFormat || formatTransactionRequest;
    const request = format({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...extract(rest, { format: chainFormat }),
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
      const value2 = await getBalance(client, { address: request.from });
      const estimates = await Promise.all(authorizationList.map(async (authorization) => {
        const { contractAddress } = authorization;
        const estimate2 = await estimateGas_rpc({
          block,
          request: {
            authorizationList: void 0,
            data,
            from: account == null ? void 0 : account.address,
            to: contractAddress,
            value: numberToHex(value2)
          },
          rpcStateOverride
        }).catch(() => 100000n);
        return 2n * BigInt(estimate2);
      }));
      estimate += estimates.reduce((acc, curr) => acc + curr, 0n);
    }
    return estimate;
  } catch (err) {
    throw getEstimateGasError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}

// node_modules/viem/_esm/actions/public/estimateContractGas.js
async function estimateContractGas(client, parameters) {
  const { abi: abi2, address, args, functionName, dataSuffix, ...request } = parameters;
  const data = encodeFunctionData({
    abi: abi2,
    args,
    functionName
  });
  try {
    const gas = await getAction(client, estimateGas, "estimateGas")({
      data: `${data}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
      to: address,
      ...request
    });
    return gas;
  } catch (error) {
    const account = request.account ? parseAccount(request.account) : void 0;
    throw getContractError(error, {
      abi: abi2,
      address,
      args,
      docsPath: "/docs/contract/estimateContractGas",
      functionName,
      sender: account == null ? void 0 : account.address
    });
  }
}

// node_modules/viem/_esm/utils/abi/decodeEventLog.js
var docsPath2 = "/docs/contract/decodeEventLog";
function decodeEventLog(parameters) {
  const { abi: abi2, data, strict: strict_, topics } = parameters;
  const strict = strict_ ?? true;
  const [signature, ...argTopics] = topics;
  if (!signature)
    throw new AbiEventSignatureEmptyTopicsError({ docsPath: docsPath2 });
  const abiItem = (() => {
    if (abi2.length === 1)
      return abi2[0];
    return abi2.find((x) => x.type === "event" && signature === toEventSelector(formatAbiItem(x)));
  })();
  if (!(abiItem && "name" in abiItem) || abiItem.type !== "event")
    throw new AbiEventSignatureNotFoundError(signature, { docsPath: docsPath2 });
  const { name, inputs } = abiItem;
  const isUnnamed = inputs == null ? void 0 : inputs.some((x) => !("name" in x && x.name));
  let args = isUnnamed ? [] : {};
  const indexedInputs = inputs.filter((x) => "indexed" in x && x.indexed);
  for (let i = 0; i < indexedInputs.length; i++) {
    const param = indexedInputs[i];
    const topic = argTopics[i];
    if (!topic)
      throw new DecodeLogTopicsMismatch({
        abiItem,
        param
      });
    args[isUnnamed ? i : param.name || i] = decodeTopic({ param, value: topic });
  }
  const nonIndexedInputs = inputs.filter((x) => !("indexed" in x && x.indexed));
  if (nonIndexedInputs.length > 0) {
    if (data && data !== "0x") {
      try {
        const decodedData = decodeAbiParameters(nonIndexedInputs, data);
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
          if (err instanceof AbiDecodingDataSizeTooSmallError || err instanceof PositionOutOfBoundsError)
            throw new DecodeLogDataMismatch({
              abiItem,
              data,
              params: nonIndexedInputs,
              size: size(data)
            });
          throw err;
        }
      }
    } else if (strict) {
      throw new DecodeLogDataMismatch({
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
  const decodedArg = decodeAbiParameters([param], value) || [];
  return decodedArg[0];
}

// node_modules/viem/_esm/utils/abi/parseEventLogs.js
function parseEventLogs(parameters) {
  const { abi: abi2, args, logs, strict = true } = parameters;
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
      const abiItem = abi2.find((abiItem2) => abiItem2.type === "event" && log.topics[0] === toEventSelector(abiItem2));
      if (!abiItem)
        return null;
      const event = decodeEventLog({
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
      if (err instanceof AbiEventSignatureNotFoundError)
        return null;
      if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
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
  function isEqual3(input, value, arg) {
    try {
      if (input.type === "address")
        return isAddressEqual(value, arg);
      if (input.type === "string" || input.type === "bytes")
        return keccak256(toBytes(value)) === arg;
      return value === arg;
    } catch {
      return false;
    }
  }
  if (Array.isArray(args) && Array.isArray(matchArgs)) {
    return matchArgs.every((value, index2) => {
      if (value === null || value === void 0)
        return true;
      const input = inputs[index2];
      if (!input)
        return false;
      const value_ = Array.isArray(value) ? value : [value];
      return value_.some((value2) => isEqual3(input, value2, args[index2]));
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
      return value_.some((value2) => isEqual3(input, value2, args[key]));
    });
  return false;
}

// node_modules/viem/_esm/actions/public/getLogs.js
async function getLogs(client, { address, blockHash, fromBlock, toBlock, event, events: events_, args, strict: strict_ } = {}) {
  const strict = strict_ ?? false;
  const events = events_ ?? (event ? [event] : void 0);
  let topics = [];
  if (events) {
    const encoded = events.flatMap((event2) => encodeEventTopics({
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
          fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
          toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock
        }
      ]
    });
  }
  const formattedLogs = logs.map((log) => formatLog(log));
  if (!events)
    return formattedLogs;
  return parseEventLogs({
    abi: events,
    args,
    logs: formattedLogs,
    strict
  });
}

// node_modules/viem/_esm/actions/public/getContractEvents.js
async function getContractEvents(client, parameters) {
  const { abi: abi2, address, args, blockHash, eventName, fromBlock, toBlock, strict } = parameters;
  const event = eventName ? getAbiItem({ abi: abi2, name: eventName }) : void 0;
  const events = !event ? abi2.filter((x) => x.type === "event") : void 0;
  return getAction(client, getLogs, "getLogs")({
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

// node_modules/viem/_esm/actions/public/readContract.js
async function readContract(client, parameters) {
  const { abi: abi2, address, args, functionName, ...rest } = parameters;
  const calldata = encodeFunctionData({
    abi: abi2,
    args,
    functionName
  });
  try {
    const { data } = await getAction(client, call, "call")({
      ...rest,
      data: calldata,
      to: address
    });
    return decodeFunctionResult({
      abi: abi2,
      args,
      functionName,
      data: data || "0x"
    });
  } catch (error) {
    throw getContractError(error, {
      abi: abi2,
      address,
      args,
      docsPath: "/docs/contract/readContract",
      functionName
    });
  }
}

// node_modules/viem/_esm/actions/public/simulateContract.js
async function simulateContract(client, parameters) {
  const { abi: abi2, address, args, dataSuffix, functionName, ...callRequest } = parameters;
  const account = callRequest.account ? parseAccount(callRequest.account) : client.account;
  const calldata = encodeFunctionData({ abi: abi2, args, functionName });
  try {
    const { data } = await getAction(client, call, "call")({
      batch: false,
      data: `${calldata}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
      to: address,
      ...callRequest,
      account
    });
    const result = decodeFunctionResult({
      abi: abi2,
      args,
      functionName,
      data: data || "0x"
    });
    const minimizedAbi = abi2.filter((abiItem) => "name" in abiItem && abiItem.name === parameters.functionName);
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
    throw getContractError(error, {
      abi: abi2,
      address,
      args,
      docsPath: "/docs/contract/simulateContract",
      functionName,
      sender: account == null ? void 0 : account.address
    });
  }
}

// node_modules/viem/_esm/utils/observe.js
var listenersCache = /* @__PURE__ */ new Map();
var cleanupCache = /* @__PURE__ */ new Map();
var callbackCount = 0;
function observe(observerId, callbacks, fn) {
  const callbackId = ++callbackCount;
  const getListeners = () => listenersCache.get(observerId) || [];
  const unsubscribe = () => {
    const listeners2 = getListeners();
    listenersCache.set(observerId, listeners2.filter((cb) => cb.id !== callbackId));
  };
  const unwatch = () => {
    const listeners2 = getListeners();
    if (!listeners2.some((cb) => cb.id === callbackId))
      return;
    const cleanup2 = cleanupCache.get(observerId);
    if (listeners2.length === 1 && cleanup2)
      cleanup2();
    unsubscribe();
  };
  const listeners = getListeners();
  listenersCache.set(observerId, [
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
    cleanupCache.set(observerId, cleanup);
  return unwatch;
}

// node_modules/viem/_esm/utils/poll.js
function poll(fn, { emitOnBegin, initialWaitTime, interval }) {
  let active = true;
  const unwatch = () => active = false;
  const watch = async () => {
    let data = void 0;
    if (emitOnBegin)
      data = await fn({ unpoll: unwatch });
    const initialWait = await (initialWaitTime == null ? void 0 : initialWaitTime(data)) ?? interval;
    await wait(initialWait);
    const poll2 = async () => {
      if (!active)
        return;
      await fn({ unpoll: unwatch });
      await wait(interval);
      poll2();
    };
    poll2();
  };
  watch();
  return unwatch;
}

// node_modules/viem/_esm/utils/promise/withCache.js
var promiseCache2 = /* @__PURE__ */ new Map();
var responseCache = /* @__PURE__ */ new Map();
function getCache(cacheKey2) {
  const buildCache = (cacheKey3, cache) => ({
    clear: () => cache.delete(cacheKey3),
    get: () => cache.get(cacheKey3),
    set: (data) => cache.set(cacheKey3, data)
  });
  const promise = buildCache(cacheKey2, promiseCache2);
  const response = buildCache(cacheKey2, responseCache);
  return {
    clear: () => {
      promise.clear();
      response.clear();
    },
    promise,
    response
  };
}
async function withCache(fn, { cacheKey: cacheKey2, cacheTime = Number.POSITIVE_INFINITY }) {
  const cache = getCache(cacheKey2);
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

// node_modules/viem/_esm/actions/public/getBlockNumber.js
var cacheKey = (id) => `blockNumber.${id}`;
async function getBlockNumber(client, { cacheTime = client.cacheTime } = {}) {
  const blockNumberHex = await withCache(() => client.request({
    method: "eth_blockNumber"
  }), { cacheKey: cacheKey(client.uid), cacheTime });
  return BigInt(blockNumberHex);
}

// node_modules/viem/_esm/actions/public/getFilterChanges.js
async function getFilterChanges(_client, { filter }) {
  const strict = "strict" in filter && filter.strict;
  const logs = await filter.request({
    method: "eth_getFilterChanges",
    params: [filter.id]
  });
  if (typeof logs[0] === "string")
    return logs;
  const formattedLogs = logs.map((log) => formatLog(log));
  if (!("abi" in filter) || !filter.abi)
    return formattedLogs;
  return parseEventLogs({
    abi: filter.abi,
    logs: formattedLogs,
    strict
  });
}

// node_modules/viem/_esm/actions/public/uninstallFilter.js
async function uninstallFilter(_client, { filter }) {
  return filter.request({
    method: "eth_uninstallFilter",
    params: [filter.id]
  });
}

// node_modules/viem/_esm/actions/public/watchContractEvent.js
function watchContractEvent(client, parameters) {
  const { abi: abi2, address, args, batch = true, eventName, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ } = parameters;
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
    const observerId = stringify([
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
    return observe(observerId, { onLogs, onError }, (emit) => {
      let previousBlockNumber;
      if (fromBlock !== void 0)
        previousBlockNumber = fromBlock - 1n;
      let filter;
      let initialized = false;
      const unwatch = poll(async () => {
        var _a;
        if (!initialized) {
          try {
            filter = await getAction(client, createContractEventFilter, "createContractEventFilter")({
              abi: abi2,
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
            logs = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
          } else {
            const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({});
            if (previousBlockNumber && previousBlockNumber < blockNumber) {
              logs = await getAction(client, getContractEvents, "getContractEvents")({
                abi: abi2,
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
          if (filter && err instanceof InvalidInputRpcError)
            initialized = false;
          (_a = emit.onError) == null ? void 0 : _a.call(emit, err);
        }
      }, {
        emitOnBegin: true,
        interval: pollingInterval
      });
      return async () => {
        if (filter)
          await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
        unwatch();
      };
    });
  };
  const subscribeContractEvent = () => {
    const strict = strict_ ?? false;
    const observerId = stringify([
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
    return observe(observerId, { onLogs, onError }, (emit) => {
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
          const topics = eventName ? encodeEventTopics({
            abi: abi2,
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
                const { eventName: eventName2, args: args2 } = decodeEventLog({
                  abi: abi2,
                  data: log.data,
                  topics: log.topics,
                  strict: strict_
                });
                const formatted = formatLog(log, {
                  args: args2,
                  eventName: eventName2
                });
                emit.onLogs([formatted]);
              } catch (err) {
                let eventName2;
                let isUnnamed;
                if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
                  if (strict_)
                    return;
                  eventName2 = err.abiItem.name;
                  isUnnamed = (_a = err.abiItem.inputs) == null ? void 0 : _a.some((x) => !("name" in x && x.name));
                }
                const formatted = formatLog(log, {
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

// node_modules/viem/_esm/utils/errors/getTransactionError.js
function getTransactionError(err, { docsPath: docsPath3, ...args }) {
  const cause = (() => {
    const cause2 = getNodeError(err, args);
    if (cause2 instanceof UnknownNodeError)
      return err;
    return cause2;
  })();
  return new TransactionExecutionError(cause, {
    docsPath: docsPath3,
    ...args
  });
}

// node_modules/viem/_esm/actions/wallet/sendRawTransaction.js
async function sendRawTransaction(client, { serializedTransaction }) {
  return client.request({
    method: "eth_sendRawTransaction",
    params: [serializedTransaction]
  }, { retryCount: 0 });
}

// node_modules/viem/_esm/actions/wallet/sendTransaction.js
var supportsWalletNamespace = new LruMap(128);
async function sendTransaction(client, parameters) {
  var _a, _b, _c, _d;
  const { account: account_ = client.account, chain = client.chain, accessList, authorizationList, blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, value, ...rest } = parameters;
  if (typeof account_ === "undefined")
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/sendTransaction"
    });
  const account = account_ ? parseAccount(account_) : null;
  try {
    assertRequest(parameters);
    const to = await (async () => {
      if (parameters.to)
        return parameters.to;
      if (authorizationList && authorizationList.length > 0)
        return await recoverAuthorizationAddress({
          authorization: authorizationList[0]
        }).catch(() => {
          throw new BaseError("`to` is required. Could not infer from `authorizationList`.");
        });
      return void 0;
    })();
    if ((account == null ? void 0 : account.type) === "json-rpc" || account === null) {
      let chainId;
      if (chain !== null) {
        chainId = await getAction(client, getChainId, "getChainId")({});
        assertCurrentChain({
          currentChainId: chainId,
          chain
        });
      }
      const chainFormat = (_c = (_b = (_a = client.chain) == null ? void 0 : _a.formatters) == null ? void 0 : _b.transactionRequest) == null ? void 0 : _c.format;
      const format = chainFormat || formatTransactionRequest;
      const request = format({
        // Pick out extra data that might exist on the chain's transaction request type.
        ...extract(rest, { format: chainFormat }),
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
      const request = await getAction(client, prepareTransactionRequest, "prepareTransactionRequest")({
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
        parameters: [...defaultParameters, "sidecars"],
        value,
        ...rest,
        to
      });
      const serializer = (_d = chain == null ? void 0 : chain.serializers) == null ? void 0 : _d.transaction;
      const serializedTransaction = await account.signTransaction(request, {
        serializer
      });
      return await getAction(client, sendRawTransaction, "sendRawTransaction")({
        serializedTransaction
      });
    }
    if ((account == null ? void 0 : account.type) === "smart")
      throw new AccountTypeNotSupportedError({
        metaMessages: [
          "Consider using the `sendUserOperation` Action instead."
        ],
        docsPath: "/docs/actions/bundler/sendUserOperation",
        type: "smart"
      });
    throw new AccountTypeNotSupportedError({
      docsPath: "/docs/actions/wallet/sendTransaction",
      type: account == null ? void 0 : account.type
    });
  } catch (err) {
    if (err instanceof AccountTypeNotSupportedError)
      throw err;
    throw getTransactionError(err, {
      ...parameters,
      account,
      chain: parameters.chain || void 0
    });
  }
}

// node_modules/viem/_esm/actions/wallet/writeContract.js
async function writeContract(client, parameters) {
  const { abi: abi2, account: account_ = client.account, address, args, dataSuffix, functionName, ...request } = parameters;
  if (typeof account_ === "undefined")
    throw new AccountNotFoundError({
      docsPath: "/docs/contract/writeContract"
    });
  const account = account_ ? parseAccount(account_) : null;
  const data = encodeFunctionData({
    abi: abi2,
    args,
    functionName
  });
  try {
    return await getAction(client, sendTransaction, "sendTransaction")({
      data: `${data}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
      to: address,
      account,
      ...request
    });
  } catch (error) {
    throw getContractError(error, {
      abi: abi2,
      address,
      args,
      docsPath: "/docs/contract/writeContract",
      functionName,
      sender: account == null ? void 0 : account.address
    });
  }
}

// node_modules/viem/_esm/errors/eip712.js
var Eip712DomainNotFoundError = class extends BaseError {
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

// node_modules/viem/_esm/actions/public/getEip712Domain.js
async function getEip712Domain(client, parameters) {
  const { address, factory, factoryData } = parameters;
  try {
    const [fields, name, version2, chainId, verifyingContract, salt, extensions] = await getAction(client, readContract, "readContract")({
      abi,
      address,
      functionName: "eip712Domain",
      factory,
      factoryData
    });
    return {
      domain: {
        name,
        version: version2,
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
      throw new Eip712DomainNotFoundError({ address });
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

// node_modules/viem/_esm/actions/wallet/addChain.js
async function addChain(client, { chain }) {
  const { id, name, nativeCurrency, rpcUrls, blockExplorers } = chain;
  await client.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: numberToHex(id),
        chainName: name,
        nativeCurrency,
        rpcUrls: rpcUrls.default.http,
        blockExplorerUrls: blockExplorers ? Object.values(blockExplorers).map(({ url }) => url) : void 0
      }
    ]
  }, { dedupe: true, retryCount: 0 });
}

// node_modules/viem/_esm/clients/createClient.js
function createClient(parameters) {
  const { batch, cacheTime = parameters.pollingInterval ?? 4e3, ccipRead, key = "base", name = "Base Client", pollingInterval = 4e3, type = "base" } = parameters;
  const chain = parameters.chain;
  const account = parameters.account ? parseAccount(parameters.account) : void 0;
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
    uid: uid()
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

// node_modules/viem/_esm/clients/transports/fallback.js
function fallback(transports_, config = {}) {
  const { key = "fallback", name = "Fallback", rank = false, retryCount, retryDelay } = config;
  return ({ chain, pollingInterval = 4e3, timeout, ...rest }) => {
    let transports = transports_;
    let onResponse = () => {
    };
    const transport = createTransport({
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
    if (error.code === TransactionRejectedRpcError.code || error.code === UserRejectedRequestError.code || error.code === 5e3)
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
    await wait(interval);
    rankTransports_();
  };
  rankTransports_();
}

// node_modules/viem/_esm/utils/ens/errors.js
function isNullUniversalResolverError(err, callType) {
  var _a, _b, _c, _d, _e, _f;
  if (!(err instanceof BaseError))
    return false;
  const cause = err.walk((e) => e instanceof ContractFunctionRevertedError);
  if (!(cause instanceof ContractFunctionRevertedError))
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
  if (callType === "reverse" && cause.reason === panicReasons[50])
    return true;
  return false;
}

// node_modules/viem/_esm/utils/ens/encodedLabelToLabelhash.js
function encodedLabelToLabelhash(label) {
  if (label.length !== 66)
    return null;
  if (label.indexOf("[") !== 0)
    return null;
  if (label.indexOf("]") !== 65)
    return null;
  const hash = `0x${label.slice(1, 65)}`;
  if (!isHex(hash))
    return null;
  return hash;
}

// node_modules/viem/_esm/utils/ens/namehash.js
function namehash(name) {
  let result = new Uint8Array(32).fill(0);
  if (!name)
    return bytesToHex(result);
  const labels = name.split(".");
  for (let i = labels.length - 1; i >= 0; i -= 1) {
    const hashFromEncodedLabel = encodedLabelToLabelhash(labels[i]);
    const hashed = hashFromEncodedLabel ? toBytes(hashFromEncodedLabel) : keccak256(stringToBytes(labels[i]), "bytes");
    result = keccak256(concat([result, hashed]), "bytes");
  }
  return bytesToHex(result);
}

// node_modules/viem/_esm/utils/ens/encodeLabelhash.js
function encodeLabelhash(hash) {
  return `[${hash.slice(2)}]`;
}

// node_modules/viem/_esm/utils/ens/labelhash.js
function labelhash(label) {
  const result = new Uint8Array(32).fill(0);
  if (!label)
    return bytesToHex(result);
  return encodedLabelToLabelhash(label) || keccak256(stringToBytes(label));
}

// node_modules/viem/_esm/utils/ens/packetToBytes.js
function packetToBytes(packet) {
  const value = packet.replace(/^\.|\.$/gm, "");
  if (value.length === 0)
    return new Uint8Array(1);
  const bytes = new Uint8Array(stringToBytes(value).byteLength + 2);
  let offset = 0;
  const list = value.split(".");
  for (let i = 0; i < list.length; i++) {
    let encoded = stringToBytes(list[i]);
    if (encoded.byteLength > 255)
      encoded = stringToBytes(encodeLabelhash(labelhash(list[i])));
    bytes[offset] = encoded.length;
    bytes.set(encoded, offset + 1);
    offset += encoded.length + 1;
  }
  if (bytes.byteLength !== offset + 1)
    return bytes.slice(0, offset + 1);
  return bytes;
}

// node_modules/viem/_esm/actions/ens/getEnsAddress.js
async function getEnsAddress(client, { blockNumber, blockTag, coinType, name, gatewayUrls, strict, universalResolverAddress: universalResolverAddress_ }) {
  let universalResolverAddress = universalResolverAddress_;
  if (!universalResolverAddress) {
    if (!client.chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    universalResolverAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "ensUniversalResolver"
    });
  }
  try {
    const functionData = encodeFunctionData({
      abi: addressResolverAbi,
      functionName: "addr",
      ...coinType != null ? { args: [namehash(name), BigInt(coinType)] } : { args: [namehash(name)] }
    });
    const readContractParameters = {
      address: universalResolverAddress,
      abi: universalResolverResolveAbi,
      functionName: "resolve",
      args: [toHex(packetToBytes(name)), functionData],
      blockNumber,
      blockTag
    };
    const readContractAction = getAction(client, readContract, "readContract");
    const res = gatewayUrls ? await readContractAction({
      ...readContractParameters,
      args: [...readContractParameters.args, gatewayUrls]
    }) : await readContractAction(readContractParameters);
    if (res[0] === "0x")
      return null;
    const address = decodeFunctionResult({
      abi: addressResolverAbi,
      args: coinType != null ? [namehash(name), BigInt(coinType)] : void 0,
      functionName: "addr",
      data: res[0]
    });
    if (address === "0x")
      return null;
    if (trim(address) === "0x00")
      return null;
    return address;
  } catch (err) {
    if (strict)
      throw err;
    if (isNullUniversalResolverError(err, "resolve"))
      return null;
    throw err;
  }
}

// node_modules/viem/_esm/errors/ens.js
var EnsAvatarInvalidMetadataError = class extends BaseError {
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
var EnsAvatarInvalidNftUriError = class extends BaseError {
  constructor({ reason }) {
    super(`ENS NFT avatar URI is invalid. ${reason}`, {
      name: "EnsAvatarInvalidNftUriError"
    });
  }
};
var EnsAvatarUriResolutionError = class extends BaseError {
  constructor({ uri }) {
    super(`Unable to resolve ENS avatar URI "${uri}". The URI may be malformed, invalid, or does not respond with a valid image.`, { name: "EnsAvatarUriResolutionError" });
  }
};
var EnsAvatarUnsupportedNamespaceError = class extends BaseError {
  constructor({ namespace }) {
    super(`ENS NFT avatar namespace "${namespace}" is not supported. Must be "erc721" or "erc1155".`, { name: "EnsAvatarUnsupportedNamespaceError" });
  }
};

// node_modules/viem/_esm/utils/ens/avatar/utils.js
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
function getGateway(custom2, defaultGateway) {
  if (!custom2)
    return defaultGateway;
  if (custom2.endsWith("/"))
    return custom2.slice(0, -1);
  return custom2;
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
  throw new EnsAvatarUriResolutionError({ uri });
}
function getJsonImage(data) {
  if (typeof data !== "object" || !("image" in data) && !("image_url" in data) && !("image_data" in data)) {
    throw new EnsAvatarInvalidMetadataError({ data });
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
    throw new EnsAvatarUriResolutionError({ uri });
  }
}
async function parseAvatarUri({ gatewayUrls, uri }) {
  const { uri: resolvedURI, isOnChain } = resolveAvatarUri({ uri, gatewayUrls });
  if (isOnChain)
    return resolvedURI;
  const isImage = await isImageUri(resolvedURI);
  if (isImage)
    return resolvedURI;
  throw new EnsAvatarUriResolutionError({ uri });
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
    throw new EnsAvatarInvalidNftUriError({ reason: "Only EIP-155 supported" });
  if (!chainID)
    throw new EnsAvatarInvalidNftUriError({ reason: "Chain ID not found" });
  if (!contractAddress)
    throw new EnsAvatarInvalidNftUriError({
      reason: "Contract address not found"
    });
  if (!tokenID)
    throw new EnsAvatarInvalidNftUriError({ reason: "Token ID not found" });
  if (!erc_namespace)
    throw new EnsAvatarInvalidNftUriError({ reason: "ERC namespace not found" });
  return {
    chainID: Number.parseInt(chainID),
    namespace: erc_namespace.toLowerCase(),
    contractAddress,
    tokenID
  };
}
async function getNftTokenUri(client, { nft }) {
  if (nft.namespace === "erc721") {
    return readContract(client, {
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
    return readContract(client, {
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
  throw new EnsAvatarUnsupportedNamespaceError({ namespace: nft.namespace });
}

// node_modules/viem/_esm/utils/ens/avatar/parseAvatarRecord.js
async function parseAvatarRecord(client, { gatewayUrls, record }) {
  if (/eip155:/i.test(record))
    return parseNftAvatarUri(client, { gatewayUrls, record });
  return parseAvatarUri({ uri: record, gatewayUrls });
}
async function parseNftAvatarUri(client, { gatewayUrls, record }) {
  const nft = parseNftUri(record);
  const nftUri = await getNftTokenUri(client, { nft });
  const { uri: resolvedNftUri, isOnChain, isEncoded } = resolveAvatarUri({ uri: nftUri, gatewayUrls });
  if (isOnChain && (resolvedNftUri.includes("data:application/json;base64,") || resolvedNftUri.startsWith("{"))) {
    const encodedJson = isEncoded ? (
      // if it is encoded, decode it
      atob(resolvedNftUri.replace("data:application/json;base64,", ""))
    ) : (
      // if it isn't encoded assume it is a JSON string, but it could be anything (it will error if it is)
      resolvedNftUri
    );
    const decoded = JSON.parse(encodedJson);
    return parseAvatarUri({ uri: getJsonImage(decoded), gatewayUrls });
  }
  let uriTokenId = nft.tokenID;
  if (nft.namespace === "erc1155")
    uriTokenId = uriTokenId.replace("0x", "").padStart(64, "0");
  return getMetadataAvatarUri({
    gatewayUrls,
    uri: resolvedNftUri.replace(/(?:0x)?{id}/, uriTokenId)
  });
}

// node_modules/viem/_esm/actions/ens/getEnsText.js
async function getEnsText(client, { blockNumber, blockTag, name, key, gatewayUrls, strict, universalResolverAddress: universalResolverAddress_ }) {
  let universalResolverAddress = universalResolverAddress_;
  if (!universalResolverAddress) {
    if (!client.chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    universalResolverAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "ensUniversalResolver"
    });
  }
  try {
    const readContractParameters = {
      address: universalResolverAddress,
      abi: universalResolverResolveAbi,
      functionName: "resolve",
      args: [
        toHex(packetToBytes(name)),
        encodeFunctionData({
          abi: textResolverAbi,
          functionName: "text",
          args: [namehash(name), key]
        })
      ],
      blockNumber,
      blockTag
    };
    const readContractAction = getAction(client, readContract, "readContract");
    const res = gatewayUrls ? await readContractAction({
      ...readContractParameters,
      args: [...readContractParameters.args, gatewayUrls]
    }) : await readContractAction(readContractParameters);
    if (res[0] === "0x")
      return null;
    const record = decodeFunctionResult({
      abi: textResolverAbi,
      functionName: "text",
      data: res[0]
    });
    return record === "" ? null : record;
  } catch (err) {
    if (strict)
      throw err;
    if (isNullUniversalResolverError(err, "resolve"))
      return null;
    throw err;
  }
}

// node_modules/viem/_esm/actions/ens/getEnsAvatar.js
async function getEnsAvatar(client, { blockNumber, blockTag, assetGatewayUrls, name, gatewayUrls, strict, universalResolverAddress }) {
  const record = await getAction(client, getEnsText, "getEnsText")({
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
    return await parseAvatarRecord(client, {
      record,
      gatewayUrls: assetGatewayUrls
    });
  } catch {
    return null;
  }
}

// node_modules/viem/_esm/actions/ens/getEnsName.js
async function getEnsName(client, { address, blockNumber, blockTag, gatewayUrls, strict, universalResolverAddress: universalResolverAddress_ }) {
  let universalResolverAddress = universalResolverAddress_;
  if (!universalResolverAddress) {
    if (!client.chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    universalResolverAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "ensUniversalResolver"
    });
  }
  const reverseNode = `${address.toLowerCase().substring(2)}.addr.reverse`;
  try {
    const readContractParameters = {
      address: universalResolverAddress,
      abi: universalResolverReverseAbi,
      functionName: "reverse",
      args: [toHex(packetToBytes(reverseNode))],
      blockNumber,
      blockTag
    };
    const readContractAction = getAction(client, readContract, "readContract");
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
    if (isNullUniversalResolverError(err, "reverse"))
      return null;
    throw err;
  }
}

// node_modules/viem/_esm/actions/ens/getEnsResolver.js
async function getEnsResolver(client, { blockNumber, blockTag, name, universalResolverAddress: universalResolverAddress_ }) {
  let universalResolverAddress = universalResolverAddress_;
  if (!universalResolverAddress) {
    if (!client.chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    universalResolverAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "ensUniversalResolver"
    });
  }
  const [resolverAddress] = await getAction(client, readContract, "readContract")({
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
    args: [toHex(packetToBytes(name))],
    blockNumber,
    blockTag
  });
  return resolverAddress;
}

// node_modules/viem/_esm/actions/public/createAccessList.js
async function createAccessList(client, args) {
  var _a, _b, _c;
  const { account: account_ = client.account, blockNumber, blockTag = "latest", blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, to, value, ...rest } = args;
  const account = account_ ? parseAccount(account_) : void 0;
  try {
    assertRequest(args);
    const blockNumberHex = blockNumber ? numberToHex(blockNumber) : void 0;
    const block = blockNumberHex || blockTag;
    const chainFormat = (_c = (_b = (_a = client.chain) == null ? void 0 : _a.formatters) == null ? void 0 : _b.transactionRequest) == null ? void 0 : _c.format;
    const format = chainFormat || formatTransactionRequest;
    const request = format({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...extract(rest, { format: chainFormat }),
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
    throw getCallError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}

// node_modules/viem/_esm/actions/public/createBlockFilter.js
async function createBlockFilter(client) {
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newBlockFilter"
  });
  const id = await client.request({
    method: "eth_newBlockFilter"
  });
  return { id, request: getRequest(id), type: "block" };
}

// node_modules/viem/_esm/actions/public/createEventFilter.js
async function createEventFilter(client, { address, args, event, events: events_, fromBlock, strict, toBlock } = {}) {
  const events = events_ ?? (event ? [event] : void 0);
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newFilter"
  });
  let topics = [];
  if (events) {
    const encoded = events.flatMap((event2) => encodeEventTopics({
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
        fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
        toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
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

// node_modules/viem/_esm/actions/public/createPendingTransactionFilter.js
async function createPendingTransactionFilter(client) {
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newPendingTransactionFilter"
  });
  const id = await client.request({
    method: "eth_newPendingTransactionFilter"
  });
  return { id, request: getRequest(id), type: "transaction" };
}

// node_modules/viem/_esm/actions/public/getBlobBaseFee.js
async function getBlobBaseFee(client) {
  const baseFee = await client.request({
    method: "eth_blobBaseFee"
  });
  return BigInt(baseFee);
}

// node_modules/viem/_esm/actions/public/getBlockTransactionCount.js
async function getBlockTransactionCount(client, { blockHash, blockNumber, blockTag = "latest" } = {}) {
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
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
  return hexToNumber(count);
}

// node_modules/viem/_esm/utils/formatters/feeHistory.js
function formatFeeHistory(feeHistory) {
  var _a;
  return {
    baseFeePerGas: feeHistory.baseFeePerGas.map((value) => BigInt(value)),
    gasUsedRatio: feeHistory.gasUsedRatio,
    oldestBlock: BigInt(feeHistory.oldestBlock),
    reward: (_a = feeHistory.reward) == null ? void 0 : _a.map((reward) => reward.map((value) => BigInt(value)))
  };
}

// node_modules/viem/_esm/actions/public/getFeeHistory.js
async function getFeeHistory(client, { blockCount, blockNumber, blockTag = "latest", rewardPercentiles }) {
  const blockNumberHex = blockNumber ? numberToHex(blockNumber) : void 0;
  const feeHistory = await client.request({
    method: "eth_feeHistory",
    params: [
      numberToHex(blockCount),
      blockNumberHex || blockTag,
      rewardPercentiles
    ]
  }, { dedupe: Boolean(blockNumberHex) });
  return formatFeeHistory(feeHistory);
}

// node_modules/viem/_esm/actions/public/getFilterLogs.js
async function getFilterLogs(_client, { filter }) {
  const strict = filter.strict ?? false;
  const logs = await filter.request({
    method: "eth_getFilterLogs",
    params: [filter.id]
  });
  const formattedLogs = logs.map((log) => formatLog(log));
  if (!filter.abi)
    return formattedLogs;
  return parseEventLogs({
    abi: filter.abi,
    logs: formattedLogs,
    strict
  });
}

// node_modules/viem/_esm/errors/typedData.js
var InvalidDomainError = class extends BaseError {
  constructor({ domain }) {
    super(`Invalid domain "${stringify(domain)}".`, {
      metaMessages: ["Must be a valid EIP-712 domain."]
    });
  }
};
var InvalidPrimaryTypeError = class extends BaseError {
  constructor({ primaryType, types }) {
    super(`Invalid primary type \`${primaryType}\` must be one of \`${JSON.stringify(Object.keys(types))}\`.`, {
      docsPath: "/api/glossary/Errors#typeddatainvalidprimarytypeerror",
      metaMessages: ["Check that the primary type is a key in `types`."]
    });
  }
};
var InvalidStructTypeError = class extends BaseError {
  constructor({ type }) {
    super(`Struct type "${type}" is invalid.`, {
      metaMessages: ["Struct type must not be a Solidity type."],
      name: "InvalidStructTypeError"
    });
  }
};

// node_modules/viem/_esm/utils/signature/hashTypedData.js
function hashTypedData(parameters) {
  const { domain = {}, message, primaryType } = parameters;
  const types = {
    EIP712Domain: getTypesForEIP712Domain({ domain }),
    ...parameters.types
  };
  validateTypedData({
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
  return keccak256(concat(parts));
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
  return keccak256(encoded);
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
  return encodeAbiParameters(encodedTypes, encodedValues);
}
function hashType({ primaryType, types }) {
  const encodedHashType = toHex(encodeType({ primaryType, types }));
  return keccak256(encodedHashType);
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
      keccak256(encodeData({ data: value, primaryType: type, types }))
    ];
  }
  if (type === "bytes") {
    const prepend = value.length % 2 ? "0" : "";
    value = `0x${prepend + value.slice(2)}`;
    return [{ type: "bytes32" }, keccak256(value)];
  }
  if (type === "string")
    return [{ type: "bytes32" }, keccak256(toHex(value))];
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
      keccak256(encodeAbiParameters(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))
    ];
  }
  return [{ type }, value];
}

// node_modules/viem/_esm/utils/typedData.js
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
  return stringify({ domain, message, primaryType, types });
}
function validateTypedData(parameters) {
  const { domain, message, primaryType, types } = parameters;
  const validateData = (struct, data) => {
    for (const param of struct) {
      const { name, type } = param;
      const value = data[name];
      const integerMatch = type.match(integerRegex);
      if (integerMatch && (typeof value === "number" || typeof value === "bigint")) {
        const [_type, base, size_] = integerMatch;
        numberToHex(value, {
          signed: base === "int",
          size: Number.parseInt(size_) / 8
        });
      }
      if (type === "address" && typeof value === "string" && !isAddress(value))
        throw new InvalidAddressError({ address: value });
      const bytesMatch = type.match(bytesRegex);
      if (bytesMatch) {
        const [_type, size_] = bytesMatch;
        if (size_ && size(value) !== Number.parseInt(size_))
          throw new BytesSizeMismatchError({
            expectedSize: Number.parseInt(size_),
            givenSize: size(value)
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
      throw new InvalidDomainError({ domain });
    validateData(types.EIP712Domain, domain);
  }
  if (primaryType !== "EIP712Domain") {
    if (types[primaryType])
      validateData(types[primaryType], message);
    else
      throw new InvalidPrimaryTypeError({ primaryType, types });
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
function validateReference(type) {
  if (type === "address" || type === "bool" || type === "string" || type.startsWith("bytes") || type.startsWith("uint") || type.startsWith("int"))
    throw new InvalidStructTypeError({ type });
}

// node_modules/viem/node_modules/@noble/hashes/esm/ripemd160.js
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
var RIPEMD160 = class extends HashMD {
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
        const tl = rotl(al + f(group, bl, cl, dl) + R_BUF[rl[i]] + hbl, sl[i]) + el | 0;
        al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl;
      }
      for (let i = 0; i < 16; i++) {
        const tr = rotl(ar + f(rGroup, br, cr, dr) + R_BUF[rr[i]] + hbr, sr[i]) + er | 0;
        ar = er, er = dr, dr = rotl(cr, 10) | 0, cr = br, br = tr;
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
var ripemd160 = wrapConstructor(() => new RIPEMD160());

// node_modules/viem/_esm/constants/strings.js
var presignMessagePrefix = "Ethereum Signed Message:\n";

// node_modules/viem/_esm/utils/signature/toPrefixedMessage.js
function toPrefixedMessage(message_) {
  const message = (() => {
    if (typeof message_ === "string")
      return stringToHex(message_);
    if (typeof message_.raw === "string")
      return message_.raw;
    return bytesToHex(message_.raw);
  })();
  const prefix = stringToHex(`${presignMessagePrefix}${size(message)}`);
  return concat([prefix, message]);
}

// node_modules/viem/_esm/utils/signature/hashMessage.js
function hashMessage(message, to_) {
  return keccak256(toPrefixedMessage(message), to_);
}

// node_modules/viem/_esm/constants/bytes.js
var erc6492MagicBytes = "0x6492649264926492649264926492649264926492649264926492649264926492";

// node_modules/viem/_esm/utils/signature/isErc6492Signature.js
function isErc6492Signature(signature) {
  return sliceHex(signature, -32) === erc6492MagicBytes;
}

// node_modules/viem/_esm/utils/signature/serializeErc6492Signature.js
function serializeErc6492Signature(parameters) {
  const { address, data, signature, to = "hex" } = parameters;
  const signature_ = concatHex([
    encodeAbiParameters([{ type: "address" }, { type: "bytes" }, { type: "bytes" }], [address, data, signature]),
    erc6492MagicBytes
  ]);
  if (to === "hex")
    return signature_;
  return hexToBytes(signature_);
}

// node_modules/viem/_esm/errors/unit.js
var InvalidDecimalNumberError = class extends BaseError {
  constructor({ value }) {
    super(`Number \`${value}\` is not a valid decimal number.`, {
      name: "InvalidDecimalNumberError"
    });
  }
};

// node_modules/viem/_esm/utils/unit/parseUnits.js
function parseUnits(value, decimals) {
  if (!/^(-?)([0-9]*)\.?([0-9]*)$/.test(value))
    throw new InvalidDecimalNumberError({ value });
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

// node_modules/viem/_esm/utils/nonceManager.js
function createNonceManager(parameters) {
  const { source } = parameters;
  const deltaMap = /* @__PURE__ */ new Map();
  const nonceMap = new LruMap(8192);
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
      return getTransactionCount(client, {
        address,
        blockTag: "pending"
      });
    },
    set() {
    }
  };
}
var nonceManager = createNonceManager({
  source: jsonRpc()
});

// node_modules/viem/_esm/utils/formatters/proof.js
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
    nonce: proof.nonce ? hexToNumber(proof.nonce) : void 0,
    storageProof: proof.storageProof ? formatStorageProof(proof.storageProof) : void 0
  };
}

// node_modules/viem/_esm/actions/public/getProof.js
async function getProof(client, { address, blockNumber, blockTag: blockTag_, storageKeys }) {
  const blockTag = blockTag_ ?? "latest";
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
  const proof = await client.request({
    method: "eth_getProof",
    params: [address, storageKeys, blockNumberHex || blockTag]
  });
  return formatProof(proof);
}

// node_modules/viem/_esm/actions/public/getStorageAt.js
async function getStorageAt(client, { address, blockNumber, blockTag = "latest", slot }) {
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
  const data = await client.request({
    method: "eth_getStorageAt",
    params: [address, slot, blockNumberHex || blockTag]
  });
  return data;
}

// node_modules/viem/_esm/actions/public/getTransaction.js
async function getTransaction(client, { blockHash, blockNumber, blockTag: blockTag_, hash, index: index2 }) {
  var _a, _b, _c;
  const blockTag = blockTag_ || "latest";
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
  let transaction = null;
  if (hash) {
    transaction = await client.request({
      method: "eth_getTransactionByHash",
      params: [hash]
    }, { dedupe: true });
  } else if (blockHash) {
    transaction = await client.request({
      method: "eth_getTransactionByBlockHashAndIndex",
      params: [blockHash, numberToHex(index2)]
    }, { dedupe: true });
  } else if (blockNumberHex || blockTag) {
    transaction = await client.request({
      method: "eth_getTransactionByBlockNumberAndIndex",
      params: [blockNumberHex || blockTag, numberToHex(index2)]
    }, { dedupe: Boolean(blockNumberHex) });
  }
  if (!transaction)
    throw new TransactionNotFoundError({
      blockHash,
      blockNumber,
      blockTag,
      hash,
      index: index2
    });
  const format = ((_c = (_b = (_a = client.chain) == null ? void 0 : _a.formatters) == null ? void 0 : _b.transaction) == null ? void 0 : _c.format) || formatTransaction;
  return format(transaction);
}

// node_modules/viem/_esm/actions/public/getTransactionConfirmations.js
async function getTransactionConfirmations(client, { hash, transactionReceipt }) {
  const [blockNumber, transaction] = await Promise.all([
    getAction(client, getBlockNumber, "getBlockNumber")({}),
    hash ? getAction(client, getTransaction, "getTransaction")({ hash }) : void 0
  ]);
  const transactionBlockNumber = (transactionReceipt == null ? void 0 : transactionReceipt.blockNumber) || (transaction == null ? void 0 : transaction.blockNumber);
  if (!transactionBlockNumber)
    return 0n;
  return blockNumber - transactionBlockNumber + 1n;
}

// node_modules/viem/_esm/actions/public/getTransactionReceipt.js
async function getTransactionReceipt(client, { hash }) {
  var _a, _b, _c;
  const receipt = await client.request({
    method: "eth_getTransactionReceipt",
    params: [hash]
  }, { dedupe: true });
  if (!receipt)
    throw new TransactionReceiptNotFoundError({ hash });
  const format = ((_c = (_b = (_a = client.chain) == null ? void 0 : _a.formatters) == null ? void 0 : _b.transactionReceipt) == null ? void 0 : _c.format) || formatTransactionReceipt;
  return format(receipt);
}

// node_modules/viem/_esm/actions/public/multicall.js
async function multicall(client, parameters) {
  var _a;
  const { allowFailure = true, batchSize: batchSize_, blockNumber, blockTag, multicallAddress: multicallAddress_, stateOverride } = parameters;
  const contracts = parameters.contracts;
  const batchSize = batchSize_ ?? (typeof ((_a = client.batch) == null ? void 0 : _a.multicall) === "object" && client.batch.multicall.batchSize || 1024);
  let multicallAddress = multicallAddress_;
  if (!multicallAddress) {
    if (!client.chain)
      throw new Error("client chain not configured. multicallAddress is required.");
    multicallAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "multicall3"
    });
  }
  const chunkedCalls = [[]];
  let currentChunk = 0;
  let currentChunkSize = 0;
  for (let i = 0; i < contracts.length; i++) {
    const { abi: abi2, address, args, functionName } = contracts[i];
    try {
      const callData = encodeFunctionData({ abi: abi2, args, functionName });
      currentChunkSize += (callData.length - 2) / 2;
      if (
        // Check if batching is enabled.
        batchSize > 0 && // Check if the current size of the batch exceeds the size limit.
        currentChunkSize > batchSize && // Check if the current chunk is not already empty.
        chunkedCalls[currentChunk].length > 0
      ) {
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
      const error = getContractError(err, {
        abi: abi2,
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
  const aggregate3Results = await Promise.allSettled(chunkedCalls.map((calls) => getAction(client, readContract, "readContract")({
    abi: multicall3Abi,
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
      const { abi: abi2, address, functionName, args } = contracts[results.length];
      try {
        if (callData === "0x")
          throw new AbiDecodingZeroDataError();
        if (!success)
          throw new RawContractError({ data: returnData });
        const result2 = decodeFunctionResult({
          abi: abi2,
          args,
          data: returnData,
          functionName
        });
        results.push(allowFailure ? { result: result2, status: "success" } : result2);
      } catch (err) {
        const error = getContractError(err, {
          abi: abi2,
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
    throw new BaseError("multicall results mismatch");
  return results;
}

// node_modules/ox/_esm/core/BlockOverrides.js
var BlockOverrides_exports = {};
__export(BlockOverrides_exports, {
  fromRpc: () => fromRpc2,
  toRpc: () => toRpc2
});

// node_modules/ox/_esm/core/Hex.js
var Hex_exports = {};
__export(Hex_exports, {
  IntegerOutOfRangeError: () => IntegerOutOfRangeError,
  InvalidHexBooleanError: () => InvalidHexBooleanError,
  InvalidHexTypeError: () => InvalidHexTypeError,
  InvalidHexValueError: () => InvalidHexValueError2,
  InvalidLengthError: () => InvalidLengthError,
  SizeExceedsPaddingSizeError: () => SizeExceedsPaddingSizeError2,
  SizeOverflowError: () => SizeOverflowError2,
  SliceOffsetOutOfBoundsError: () => SliceOffsetOutOfBoundsError2,
  assert: () => assert2,
  concat: () => concat3,
  from: () => from2,
  fromBoolean: () => fromBoolean2,
  fromBytes: () => fromBytes2,
  fromNumber: () => fromNumber,
  fromString: () => fromString2,
  isEqual: () => isEqual2,
  padLeft: () => padLeft2,
  padRight: () => padRight,
  random: () => random2,
  size: () => size4,
  slice: () => slice3,
  toBigInt: () => toBigInt,
  toBoolean: () => toBoolean2,
  toBytes: () => toBytes2,
  toNumber: () => toNumber,
  toString: () => toString2,
  trimLeft: () => trimLeft2,
  trimRight: () => trimRight2,
  validate: () => validate2
});

// node_modules/@noble/curves/esm/abstract/utils.js
var utils_exports = {};
__export(utils_exports, {
  aInRange: () => aInRange,
  abool: () => abool,
  abytes: () => abytes,
  bitGet: () => bitGet,
  bitLen: () => bitLen,
  bitMask: () => bitMask,
  bitSet: () => bitSet,
  bytesToHex: () => bytesToHex2,
  bytesToNumberBE: () => bytesToNumberBE,
  bytesToNumberLE: () => bytesToNumberLE,
  concatBytes: () => concatBytes2,
  createHmacDrbg: () => createHmacDrbg,
  ensureBytes: () => ensureBytes,
  equalBytes: () => equalBytes,
  hexToBytes: () => hexToBytes2,
  hexToNumber: () => hexToNumber2,
  inRange: () => inRange,
  isBytes: () => isBytes2,
  memoized: () => memoized,
  notImplemented: () => notImplemented,
  numberToBytesBE: () => numberToBytesBE,
  numberToBytesLE: () => numberToBytesLE,
  numberToHexUnpadded: () => numberToHexUnpadded,
  numberToVarBytesBE: () => numberToVarBytesBE,
  utf8ToBytes: () => utf8ToBytes,
  validateObject: () => validateObject
});
var _0n = BigInt(0);
var _1n = BigInt(1);
var _2n = BigInt(2);
function isBytes2(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abytes(item) {
  if (!isBytes2(item))
    throw new Error("Uint8Array expected");
}
function abool(title, value) {
  if (typeof value !== "boolean")
    throw new Error(title + " boolean expected, got " + value);
}
var hexes = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex2(bytes) {
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
function hexToNumber2(hex) {
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
function hexToBytes2(hex) {
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
  return hexToNumber2(bytesToHex2(bytes));
}
function bytesToNumberLE(bytes) {
  abytes(bytes);
  return hexToNumber2(bytesToHex2(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes2(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function numberToVarBytesBE(n) {
  return hexToBytes2(numberToHexUnpadded(n));
}
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes2(hex);
    } catch (e) {
      throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
    }
  } else if (isBytes2(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(title + " must be hex string or Uint8Array");
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(title + " of length " + expectedLength + " expected, got " + len);
  return res;
}
function concatBytes2(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad4 = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad4);
    pad4 += a.length;
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
  const reset2 = () => {
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
    return concatBytes2(...out);
  };
  const genUntil = (seed, pred) => {
    reset2();
    reseed(seed);
    let res = void 0;
    while (!(res = pred(gen())))
      reseed();
    reset2();
    return res;
  };
  return genUntil;
}
var validatorFns = {
  bigint: (val) => typeof val === "bigint",
  function: (val) => typeof val === "function",
  boolean: (val) => typeof val === "boolean",
  string: (val) => typeof val === "string",
  stringOrUint8Array: (val) => typeof val === "string" || isBytes2(val),
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

// node_modules/ox/_esm/core/Bytes.js
var Bytes_exports = {};
__export(Bytes_exports, {
  InvalidBytesBooleanError: () => InvalidBytesBooleanError,
  InvalidBytesTypeError: () => InvalidBytesTypeError,
  SizeExceedsPaddingSizeError: () => SizeExceedsPaddingSizeError,
  SizeOverflowError: () => SizeOverflowError,
  SliceOffsetOutOfBoundsError: () => SliceOffsetOutOfBoundsError,
  assert: () => assert,
  concat: () => concat2,
  from: () => from,
  fromArray: () => fromArray,
  fromBoolean: () => fromBoolean,
  fromHex: () => fromHex2,
  fromNumber: () => fromNumber2,
  fromString: () => fromString,
  isEqual: () => isEqual,
  padLeft: () => padLeft,
  padRight: () => padRight2,
  random: () => random,
  size: () => size3,
  slice: () => slice2,
  toBigInt: () => toBigInt2,
  toBoolean: () => toBoolean,
  toHex: () => toHex2,
  toNumber: () => toNumber2,
  toString: () => toString,
  trimLeft: () => trimLeft,
  trimRight: () => trimRight,
  validate: () => validate
});

// node_modules/ox/_esm/core/Errors.js
var Errors_exports = {};
__export(Errors_exports, {
  BaseError: () => BaseError2
});

// node_modules/ox/_esm/core/version.js
var version = "0.1.1";

// node_modules/ox/_esm/core/internal/errors.js
function getUrl(url) {
  return url;
}
function getVersion() {
  return version;
}
function prettyPrint2(args) {
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

// node_modules/ox/_esm/core/Errors.js
var BaseError2 = class _BaseError extends Error {
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
    const docsPath3 = (() => {
      if (options.cause instanceof _BaseError)
        return options.cause.docsPath || options.docsPath;
      return options.docsPath;
    })();
    const docsBaseUrl = "https://oxlib.sh";
    const docs = `${docsBaseUrl}${docsPath3 ?? ""}`;
    const message = [
      shortMessage || "An error occurred.",
      ...options.metaMessages ? ["", ...options.metaMessages] : [],
      ...details || docsPath3 ? [
        "",
        details ? `Details: ${details}` : void 0,
        docsPath3 ? `See: ${docs}` : void 0
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
      value: `ox@${getVersion()}`
    });
    this.cause = options.cause;
    this.details = details;
    this.docs = docs;
    this.docsPath = docsPath3;
    this.shortMessage = shortMessage;
  }
  walk(fn) {
    return walk(this, fn);
  }
};
function walk(err, fn) {
  if (fn == null ? void 0 : fn(err))
    return err;
  if (err && typeof err === "object" && "cause" in err && err.cause)
    return walk(err.cause, fn);
  return fn ? null : err;
}

// node_modules/ox/_esm/core/Json.js
var Json_exports = {};
__export(Json_exports, {
  parse: () => parse,
  stringify: () => stringify2
});
var bigIntSuffix = "#__bigint";
function parse(string, reviver) {
  return JSON.parse(string, (key, value_) => {
    const value = value_;
    if (typeof value === "string" && value.endsWith(bigIntSuffix))
      return BigInt(value.slice(0, -bigIntSuffix.length));
    return typeof reviver === "function" ? reviver(key, value) : value;
  });
}
function stringify2(value, replacer, space) {
  return JSON.stringify(value, (key, value2) => {
    if (typeof replacer === "function")
      return replacer(key, value2);
    if (typeof value2 === "bigint")
      return value2.toString() + bigIntSuffix;
    return value2;
  }, space);
}

// node_modules/ox/_esm/core/internal/bytes.js
function assertSize(bytes, size_) {
  if (size3(bytes) > size_)
    throw new SizeOverflowError({
      givenSize: size3(bytes),
      maxSize: size_
    });
}
function assertStartOffset(value, start) {
  if (typeof start === "number" && start > 0 && start > size3(value) - 1)
    throw new SliceOffsetOutOfBoundsError({
      offset: start,
      position: "start",
      size: size3(value)
    });
}
function assertEndOffset(value, start, end) {
  if (typeof start === "number" && typeof end === "number" && size3(value) !== end - start) {
    throw new SliceOffsetOutOfBoundsError({
      offset: end,
      position: "end",
      size: size3(value)
    });
  }
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
function pad2(bytes, options = {}) {
  const { dir, size: size5 = 32 } = options;
  if (size5 === 0)
    return bytes;
  if (bytes.length > size5)
    throw new SizeExceedsPaddingSizeError({
      size: bytes.length,
      targetSize: size5,
      type: "Bytes"
    });
  const paddedBytes = new Uint8Array(size5);
  for (let i = 0; i < size5; i++) {
    const padEnd = dir === "right";
    paddedBytes[padEnd ? i : size5 - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
  }
  return paddedBytes;
}
function trim2(value, options = {}) {
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

// node_modules/ox/_esm/core/internal/hex.js
function assertSize2(hex, size_) {
  if (size4(hex) > size_)
    throw new SizeOverflowError2({
      givenSize: size4(hex),
      maxSize: size_
    });
}
function assertStartOffset2(value, start) {
  if (typeof start === "number" && start > 0 && start > size4(value) - 1)
    throw new SliceOffsetOutOfBoundsError2({
      offset: start,
      position: "start",
      size: size4(value)
    });
}
function assertEndOffset2(value, start, end) {
  if (typeof start === "number" && typeof end === "number" && size4(value) !== end - start) {
    throw new SliceOffsetOutOfBoundsError2({
      offset: end,
      position: "end",
      size: size4(value)
    });
  }
}
function pad3(hex_, options = {}) {
  const { dir, size: size5 = 32 } = options;
  if (size5 === 0)
    return hex_;
  const hex = hex_.replace("0x", "");
  if (hex.length > size5 * 2)
    throw new SizeExceedsPaddingSizeError2({
      size: Math.ceil(hex.length / 2),
      targetSize: size5,
      type: "Hex"
    });
  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size5 * 2, "0")}`;
}
function trim3(value, options = {}) {
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

// node_modules/ox/_esm/core/Bytes.js
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
function concat2(...values) {
  let length = 0;
  for (const arr of values) {
    length += arr.length;
  }
  const result = new Uint8Array(length);
  for (let i = 0, index2 = 0; i < values.length; i++) {
    const arr = values[i];
    result.set(arr, index2);
    index2 += arr.length;
  }
  return result;
}
function from(value) {
  if (value instanceof Uint8Array)
    return value;
  if (typeof value === "string")
    return fromHex2(value);
  return fromArray(value);
}
function fromArray(value) {
  return value instanceof Uint8Array ? value : new Uint8Array(value);
}
function fromBoolean(value, options = {}) {
  const { size: size5 } = options;
  const bytes = new Uint8Array(1);
  bytes[0] = Number(value);
  if (typeof size5 === "number") {
    assertSize(bytes, size5);
    return padLeft(bytes, size5);
  }
  return bytes;
}
function fromHex2(value, options = {}) {
  const { size: size5 } = options;
  let hex = value;
  if (size5) {
    assertSize2(value, size5);
    hex = padRight(value, size5);
  }
  let hexString = hex.slice(2);
  if (hexString.length % 2)
    hexString = `0${hexString}`;
  const length = hexString.length / 2;
  const bytes = new Uint8Array(length);
  for (let index2 = 0, j = 0; index2 < length; index2++) {
    const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
    const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
    if (nibbleLeft === void 0 || nibbleRight === void 0) {
      throw new BaseError2(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
    }
    bytes[index2] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes;
}
function fromNumber2(value, options) {
  const hex = fromNumber(value, options);
  return fromHex2(hex);
}
function fromString(value, options = {}) {
  const { size: size5 } = options;
  const bytes = encoder.encode(value);
  if (typeof size5 === "number") {
    assertSize(bytes, size5);
    return padRight2(bytes, size5);
  }
  return bytes;
}
function isEqual(bytesA, bytesB) {
  return equalBytes(bytesA, bytesB);
}
function padLeft(value, size5) {
  return pad2(value, { dir: "left", size: size5 });
}
function padRight2(value, size5) {
  return pad2(value, { dir: "right", size: size5 });
}
function random(length) {
  return crypto.getRandomValues(new Uint8Array(length));
}
function size3(value) {
  return value.length;
}
function slice2(value, start, end, options = {}) {
  const { strict } = options;
  assertStartOffset(value, start);
  const value_ = value.slice(start, end);
  if (strict)
    assertEndOffset(value_, start, end);
  return value_;
}
function toBigInt2(bytes, options = {}) {
  const { size: size5 } = options;
  if (typeof size5 !== "undefined")
    assertSize(bytes, size5);
  const hex = fromBytes2(bytes, options);
  return toBigInt(hex, options);
}
function toBoolean(bytes, options = {}) {
  const { size: size5 } = options;
  let bytes_ = bytes;
  if (typeof size5 !== "undefined") {
    assertSize(bytes_, size5);
    bytes_ = trimLeft(bytes_);
  }
  if (bytes_.length > 1 || bytes_[0] > 1)
    throw new InvalidBytesBooleanError(bytes_);
  return Boolean(bytes_[0]);
}
function toHex2(value, options = {}) {
  return fromBytes2(value, options);
}
function toNumber2(bytes, options = {}) {
  const { size: size5 } = options;
  if (typeof size5 !== "undefined")
    assertSize(bytes, size5);
  const hex = fromBytes2(bytes, options);
  return toNumber(hex, options);
}
function toString(bytes, options = {}) {
  const { size: size5 } = options;
  let bytes_ = bytes;
  if (typeof size5 !== "undefined") {
    assertSize(bytes_, size5);
    bytes_ = trimRight(bytes_);
  }
  return decoder.decode(bytes_);
}
function trimLeft(value) {
  return trim2(value, { dir: "left" });
}
function trimRight(value) {
  return trim2(value, { dir: "right" });
}
function validate(value) {
  try {
    assert(value);
    return true;
  } catch {
    return false;
  }
}
var InvalidBytesBooleanError = class extends BaseError2 {
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
var InvalidBytesTypeError = class extends BaseError2 {
  constructor(value) {
    super(`Value \`${typeof value === "object" ? stringify2(value) : value}\` of type \`${typeof value}\` is an invalid Bytes value.`, {
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
var SizeOverflowError = class extends BaseError2 {
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
var SliceOffsetOutOfBoundsError = class extends BaseError2 {
  constructor({ offset, position, size: size5 }) {
    super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size5}\`).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Bytes.SliceOffsetOutOfBoundsError"
    });
  }
};
var SizeExceedsPaddingSizeError = class extends BaseError2 {
  constructor({ size: size5, targetSize, type }) {
    super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size5}\`) exceeds padding size (\`${targetSize}\`).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Bytes.SizeExceedsPaddingSizeError"
    });
  }
};

// node_modules/ox/_esm/core/Hex.js
var encoder2 = new TextEncoder();
var hexes2 = Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
function assert2(value, options = {}) {
  const { strict = false } = options;
  if (!value)
    throw new InvalidHexTypeError(value);
  if (typeof value !== "string")
    throw new InvalidHexTypeError(value);
  if (strict) {
    if (!/^0x[0-9a-fA-F]*$/.test(value))
      throw new InvalidHexValueError2(value);
  }
  if (!value.startsWith("0x"))
    throw new InvalidHexValueError2(value);
}
function concat3(...values) {
  return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}
function from2(value) {
  if (value instanceof Uint8Array)
    return fromBytes2(value);
  if (Array.isArray(value))
    return fromBytes2(new Uint8Array(value));
  return value;
}
function fromBoolean2(value, options = {}) {
  const hex = `0x${Number(value)}`;
  if (typeof options.size === "number") {
    assertSize2(hex, options.size);
    return padLeft2(hex, options.size);
  }
  return hex;
}
function fromBytes2(value, options = {}) {
  let string = "";
  for (let i = 0; i < value.length; i++)
    string += hexes2[value[i]];
  const hex = `0x${string}`;
  if (typeof options.size === "number") {
    assertSize2(hex, options.size);
    return padRight(hex, options.size);
  }
  return hex;
}
function fromNumber(value, options = {}) {
  const { signed, size: size5 } = options;
  const value_ = BigInt(value);
  let maxValue;
  if (size5) {
    if (signed)
      maxValue = (1n << BigInt(size5) * 8n - 1n) - 1n;
    else
      maxValue = 2n ** (BigInt(size5) * 8n) - 1n;
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
      size: size5,
      value: `${value}${suffix}`
    });
  }
  const stringValue = (signed && value_ < 0 ? (1n << BigInt(size5 * 8)) + BigInt(value_) : value_).toString(16);
  const hex = `0x${stringValue}`;
  if (size5)
    return padLeft2(hex, size5);
  return hex;
}
function fromString2(value, options = {}) {
  return fromBytes2(encoder2.encode(value), options);
}
function isEqual2(hexA, hexB) {
  return equalBytes(fromHex2(hexA), fromHex2(hexB));
}
function padLeft2(value, size5) {
  return pad3(value, { dir: "left", size: size5 });
}
function padRight(value, size5) {
  return pad3(value, { dir: "right", size: size5 });
}
function random2(length) {
  return fromBytes2(random(length));
}
function slice3(value, start, end, options = {}) {
  const { strict } = options;
  assertStartOffset2(value, start);
  const value_ = `0x${value.replace("0x", "").slice((start ?? 0) * 2, (end ?? value.length) * 2)}`;
  if (strict)
    assertEndOffset2(value_, start, end);
  return value_;
}
function size4(value) {
  return Math.ceil((value.length - 2) / 2);
}
function trimLeft2(value) {
  return trim3(value, { dir: "left" });
}
function trimRight2(value) {
  return trim3(value, { dir: "right" });
}
function toBigInt(hex, options = {}) {
  const { signed } = options;
  if (options.size)
    assertSize2(hex, options.size);
  const value = BigInt(hex);
  if (!signed)
    return value;
  const size5 = (hex.length - 2) / 2;
  const max_unsigned = (1n << BigInt(size5) * 8n) - 1n;
  const max_signed = max_unsigned >> 1n;
  if (value <= max_signed)
    return value;
  return value - max_unsigned - 1n;
}
function toBoolean2(hex, options = {}) {
  if (options.size)
    assertSize2(hex, options.size);
  const hex_ = trimLeft2(hex);
  if (hex_ === "0x")
    return false;
  if (hex_ === "0x1")
    return true;
  throw new InvalidHexBooleanError(hex);
}
function toBytes2(hex, options = {}) {
  return fromHex2(hex, options);
}
function toNumber(hex, options = {}) {
  const { signed, size: size5 } = options;
  if (!signed && !size5)
    return Number(hex);
  return Number(toBigInt(hex, options));
}
function toString2(hex, options = {}) {
  const { size: size5 } = options;
  let bytes = fromHex2(hex);
  if (size5) {
    assertSize(bytes, size5);
    bytes = trimRight(bytes);
  }
  return new TextDecoder().decode(bytes);
}
function validate2(value, options = {}) {
  const { strict = false } = options;
  try {
    assert2(value, { strict });
    return true;
  } catch {
    return false;
  }
}
var IntegerOutOfRangeError = class extends BaseError2 {
  constructor({ max, min, signed, size: size5, value }) {
    super(`Number \`${value}\` is not in safe${size5 ? ` ${size5 * 8}-bit` : ""}${signed ? " signed" : " unsigned"} integer range ${max ? `(\`${min}\` to \`${max}\`)` : `(above \`${min}\`)`}`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Hex.IntegerOutOfRangeError"
    });
  }
};
var InvalidHexBooleanError = class extends BaseError2 {
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
var InvalidHexTypeError = class extends BaseError2 {
  constructor(value) {
    super(`Value \`${typeof value === "object" ? stringify2(value) : value}\` of type \`${typeof value}\` is an invalid hex type.`, {
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
var InvalidHexValueError2 = class extends BaseError2 {
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
var InvalidLengthError = class extends BaseError2 {
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
var SizeOverflowError2 = class extends BaseError2 {
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
var SliceOffsetOutOfBoundsError2 = class extends BaseError2 {
  constructor({ offset, position, size: size5 }) {
    super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size5}\`).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Hex.SliceOffsetOutOfBoundsError"
    });
  }
};
var SizeExceedsPaddingSizeError2 = class extends BaseError2 {
  constructor({ size: size5, targetSize, type }) {
    super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size5}\`) exceeds padding size (\`${targetSize}\`).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Hex.SizeExceedsPaddingSizeError"
    });
  }
};

// node_modules/ox/_esm/core/Withdrawal.js
var Withdrawal_exports = {};
__export(Withdrawal_exports, {
  fromRpc: () => fromRpc,
  toRpc: () => toRpc
});
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
    amount: fromNumber(withdrawal.amount),
    index: fromNumber(withdrawal.index),
    validatorIndex: fromNumber(withdrawal.validatorIndex)
  };
}

// node_modules/ox/_esm/core/BlockOverrides.js
function fromRpc2(rpcBlockOverrides) {
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
      withdrawals: rpcBlockOverrides.withdrawals.map(fromRpc)
    }
  };
}
function toRpc2(blockOverrides) {
  return {
    ...typeof blockOverrides.baseFeePerGas === "bigint" && {
      baseFeePerGas: fromNumber(blockOverrides.baseFeePerGas)
    },
    ...typeof blockOverrides.blobBaseFee === "bigint" && {
      blobBaseFee: fromNumber(blockOverrides.blobBaseFee)
    },
    ...typeof blockOverrides.feeRecipient === "string" && {
      feeRecipient: blockOverrides.feeRecipient
    },
    ...typeof blockOverrides.gasLimit === "bigint" && {
      gasLimit: fromNumber(blockOverrides.gasLimit)
    },
    ...typeof blockOverrides.number === "bigint" && {
      number: fromNumber(blockOverrides.number)
    },
    ...typeof blockOverrides.prevRandao === "bigint" && {
      prevRandao: fromNumber(blockOverrides.prevRandao)
    },
    ...typeof blockOverrides.time === "bigint" && {
      time: fromNumber(blockOverrides.time)
    },
    ...blockOverrides.withdrawals && {
      withdrawals: blockOverrides.withdrawals.map(toRpc)
    }
  };
}

// node_modules/viem/_esm/actions/public/simulate.js
async function simulate(client, parameters) {
  const { blockNumber, blockTag = "latest", blocks, returnFullTransactions, traceTransfers, validation } = parameters;
  try {
    const blockStateCalls = [];
    for (const block2 of blocks) {
      const blockOverrides = block2.blockOverrides ? toRpc2(block2.blockOverrides) : void 0;
      const calls = block2.calls.map((call_) => {
        const call2 = call_;
        const account = call2.account ? parseAccount(call2.account) : void 0;
        const request = {
          ...call2,
          data: call2.abi ? encodeFunctionData(call2) : call2.data,
          from: call2.from ?? (account == null ? void 0 : account.address)
        };
        assertRequest(request);
        return formatTransactionRequest(request);
      });
      const stateOverrides = block2.stateOverrides ? serializeStateOverride(block2.stateOverrides) : void 0;
      blockStateCalls.push({
        blockOverrides,
        calls,
        stateOverrides
      });
    }
    const blockNumberHex = blockNumber ? numberToHex(blockNumber) : void 0;
    const block = blockNumberHex || blockTag;
    const result = await client.request({
      method: "eth_simulateV1",
      params: [
        { blockStateCalls, returnFullTransactions, traceTransfers, validation },
        block
      ]
    });
    return result.map((block2, i) => ({
      ...formatBlock(block2),
      calls: block2.calls.map((call2, j) => {
        var _a, _b;
        const { abi: abi2, args, functionName, to } = blocks[i].calls[j];
        const data = ((_a = call2.error) == null ? void 0 : _a.data) ?? call2.returnData;
        const gasUsed = BigInt(call2.gasUsed);
        const logs = (_b = call2.logs) == null ? void 0 : _b.map((log) => formatLog(log));
        const status = call2.status === "0x1" ? "success" : "failure";
        const result2 = abi2 ? decodeFunctionResult({
          abi: abi2,
          data,
          functionName
        }) : null;
        const error = (() => {
          var _a2;
          if (status === "success")
            return void 0;
          let error2 = void 0;
          if (((_a2 = call2.error) == null ? void 0 : _a2.data) === "0x")
            error2 = new AbiDecodingZeroDataError();
          else if (call2.error)
            error2 = new RawContractError(call2.error);
          if (!error2)
            return void 0;
          return getContractError(error2, {
            abi: abi2 ?? [],
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
    const error = getNodeError(cause, {});
    if (error instanceof UnknownNodeError)
      throw cause;
    throw error;
  }
}

// node_modules/viem/_esm/utils/signature/serializeSignature.js
function serializeSignature({ r, s, to = "hex", v, yParity }) {
  const yParity_ = (() => {
    if (yParity === 0 || yParity === 1)
      return yParity;
    if (v && (v === 27n || v === 28n || v >= 35n))
      return v % 2n === 0n ? 1 : 0;
    throw new Error("Invalid `v` or `yParity` value");
  })();
  const signature = `0x${new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).toCompactHex()}${yParity_ === 0 ? "1b" : "1c"}`;
  if (to === "hex")
    return signature;
  return hexToBytes(signature);
}

// node_modules/viem/_esm/actions/public/verifyHash.js
async function verifyHash2(client, parameters) {
  var _a, _b, _c;
  const { address, factory, factoryData, hash, signature, universalSignatureVerifierAddress = (_c = (_b = (_a = client.chain) == null ? void 0 : _a.contracts) == null ? void 0 : _b.universalSignatureVerifier) == null ? void 0 : _c.address, ...rest } = parameters;
  const signatureHex = (() => {
    if (isHex(signature))
      return signature;
    if (typeof signature === "object" && "r" in signature && "s" in signature)
      return serializeSignature(signature);
    return bytesToHex(signature);
  })();
  const wrappedSignature = await (async () => {
    if (!factory && !factoryData)
      return signatureHex;
    if (isErc6492Signature(signatureHex))
      return signatureHex;
    return serializeErc6492Signature({
      address: factory,
      data: factoryData,
      signature: signatureHex
    });
  })();
  try {
    const args = universalSignatureVerifierAddress ? {
      to: universalSignatureVerifierAddress,
      data: encodeFunctionData({
        abi: universalSignatureValidatorAbi,
        functionName: "isValidSig",
        args: [address, hash, wrappedSignature]
      }),
      ...rest
    } : {
      data: encodeDeployData({
        abi: universalSignatureValidatorAbi,
        args: [address, hash, wrappedSignature],
        bytecode: universalSignatureValidatorByteCode
      }),
      ...rest
    };
    const { data } = await getAction(client, call, "call")(args);
    return hexToBool(data ?? "0x0");
  } catch (error) {
    try {
      const verified = isAddressEqual(getAddress(address), await recoverAddress({ hash, signature }));
      if (verified)
        return true;
    } catch {
    }
    if (error instanceof CallExecutionError) {
      return false;
    }
    throw error;
  }
}

// node_modules/viem/_esm/actions/public/verifyMessage.js
async function verifyMessage2(client, { address, message, factory, factoryData, signature, ...callRequest }) {
  const hash = hashMessage(message);
  return verifyHash2(client, {
    address,
    factory,
    factoryData,
    hash,
    signature,
    ...callRequest
  });
}

// node_modules/viem/_esm/actions/public/verifyTypedData.js
async function verifyTypedData2(client, parameters) {
  const { address, factory, factoryData, signature, message, primaryType, types, domain, ...callRequest } = parameters;
  const hash = hashTypedData({ message, primaryType, types, domain });
  return verifyHash2(client, {
    address,
    factory,
    factoryData,
    hash,
    signature,
    ...callRequest
  });
}

// node_modules/viem/_esm/actions/public/watchBlockNumber.js
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
    const observerId = stringify([
      "watchBlockNumber",
      client.uid,
      emitOnBegin,
      emitMissed,
      pollingInterval
    ]);
    return observe(observerId, { onBlockNumber, onError }, (emit) => poll(async () => {
      var _a;
      try {
        const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({ cacheTime: 0 });
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
    const observerId = stringify([
      "watchBlockNumber",
      client.uid,
      emitOnBegin,
      emitMissed
    ]);
    return observe(observerId, { onBlockNumber, onError }, (emit) => {
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
              const blockNumber = hexToBigInt((_a = data.result) == null ? void 0 : _a.number);
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

// node_modules/viem/_esm/actions/public/waitForTransactionReceipt.js
async function waitForTransactionReceipt(client, {
  confirmations = 1,
  hash,
  onReplaced,
  pollingInterval = client.pollingInterval,
  retryCount = 6,
  retryDelay = ({ count }) => ~~(1 << count) * 200,
  // exponential backoff
  timeout = 18e4
}) {
  const observerId = stringify(["waitForTransactionReceipt", client.uid, hash]);
  let transaction;
  let replacedTransaction;
  let receipt;
  let retrying = false;
  const { promise, resolve, reject } = withResolvers();
  const timer = timeout ? setTimeout(() => reject(new WaitForTransactionReceiptTimeoutError({ hash })), timeout) : void 0;
  const _unobserve = observe(observerId, { onReplaced, resolve, reject }, (emit) => {
    const _unwatch = getAction(client, watchBlockNumber, "watchBlockNumber")({
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
            await withRetry(async () => {
              transaction = await getAction(client, getTransaction, "getTransaction")({ hash });
              if (transaction.blockNumber)
                blockNumber = transaction.blockNumber;
            }, {
              delay: retryDelay,
              retryCount
            });
            retrying = false;
          }
          receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({ hash });
          if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
            return;
          done(() => emit.resolve(receipt));
        } catch (err) {
          if (err instanceof TransactionNotFoundError || err instanceof TransactionReceiptNotFoundError) {
            if (!transaction) {
              retrying = false;
              return;
            }
            try {
              replacedTransaction = transaction;
              retrying = true;
              const block = await withRetry(() => getAction(client, getBlock, "getBlock")({
                blockNumber,
                includeTransactions: true
              }), {
                delay: retryDelay,
                retryCount,
                shouldRetry: ({ error }) => error instanceof BlockNotFoundError
              });
              retrying = false;
              const replacementTransaction = block.transactions.find(({ from: from3, nonce }) => from3 === replacedTransaction.from && nonce === replacedTransaction.nonce);
              if (!replacementTransaction)
                return;
              receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({
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

// node_modules/viem/_esm/actions/public/watchBlocks.js
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
    const observerId = stringify([
      "watchBlocks",
      client.uid,
      blockTag,
      emitMissed,
      emitOnBegin,
      includeTransactions,
      pollingInterval
    ]);
    return observe(observerId, { onBlock, onError }, (emit) => poll(async () => {
      var _a;
      try {
        const block = await getAction(client, getBlock, "getBlock")({
          blockTag,
          includeTransactions
        });
        if (block.number && (prevBlock == null ? void 0 : prevBlock.number)) {
          if (block.number === prevBlock.number)
            return;
          if (block.number - prevBlock.number > 1 && emitMissed) {
            for (let i = (prevBlock == null ? void 0 : prevBlock.number) + 1n; i < block.number; i++) {
              const block2 = await getAction(client, getBlock, "getBlock")({
                blockNumber: i,
                includeTransactions
              });
              emit.onBlock(block2, prevBlock);
              prevBlock = block2;
            }
          }
        }
        if (
          // If no previous block exists, emit.
          !(prevBlock == null ? void 0 : prevBlock.number) || // If the block tag is "pending" with no block number, emit.
          blockTag === "pending" && !(block == null ? void 0 : block.number) || // If the next block number is greater than the previous block number, emit.
          // We don't want to emit blocks in the past.
          block.number && block.number > prevBlock.number
        ) {
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
          getAction(client, getBlock, "getBlock")({
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
            const block = await getAction(client, getBlock, "getBlock")({
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

// node_modules/viem/_esm/actions/public/watchEvent.js
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
    const observerId = stringify([
      "watchEvent",
      address,
      args,
      batch,
      client.uid,
      event,
      pollingInterval,
      fromBlock
    ]);
    return observe(observerId, { onLogs, onError }, (emit) => {
      let previousBlockNumber;
      if (fromBlock !== void 0)
        previousBlockNumber = fromBlock - 1n;
      let filter;
      let initialized = false;
      const unwatch = poll(async () => {
        var _a;
        if (!initialized) {
          try {
            filter = await getAction(client, createEventFilter, "createEventFilter")({
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
            logs = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
          } else {
            const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({});
            if (previousBlockNumber && previousBlockNumber !== blockNumber) {
              logs = await getAction(client, getLogs, "getLogs")({
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
          if (filter && err instanceof InvalidInputRpcError)
            initialized = false;
          (_a = emit.onError) == null ? void 0 : _a.call(emit, err);
        }
      }, {
        emitOnBegin: true,
        interval: pollingInterval
      });
      return async () => {
        if (filter)
          await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
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
          const encoded = events_.flatMap((event2) => encodeEventTopics({
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
              const { eventName, args: args2 } = decodeEventLog({
                abi: events_ ?? [],
                data: log.data,
                topics: log.topics,
                strict
              });
              const formatted = formatLog(log, { args: args2, eventName });
              onLogs([formatted]);
            } catch (err) {
              let eventName;
              let isUnnamed;
              if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
                if (strict_)
                  return;
                eventName = err.abiItem.name;
                isUnnamed = (_a = err.abiItem.inputs) == null ? void 0 : _a.some((x) => !("name" in x && x.name));
              }
              const formatted = formatLog(log, {
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

// node_modules/viem/_esm/actions/public/watchPendingTransactions.js
function watchPendingTransactions(client, { batch = true, onError, onTransactions, poll: poll_, pollingInterval = client.pollingInterval }) {
  const enablePolling = typeof poll_ !== "undefined" ? poll_ : client.transport.type !== "webSocket";
  const pollPendingTransactions = () => {
    const observerId = stringify([
      "watchPendingTransactions",
      client.uid,
      batch,
      pollingInterval
    ]);
    return observe(observerId, { onTransactions, onError }, (emit) => {
      let filter;
      const unwatch = poll(async () => {
        var _a;
        try {
          if (!filter) {
            try {
              filter = await getAction(client, createPendingTransactionFilter, "createPendingTransactionFilter")({});
              return;
            } catch (err) {
              unwatch();
              throw err;
            }
          }
          const hashes = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
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
          await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
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

// node_modules/viem/_esm/utils/siwe/parseSiweMessage.js
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

// node_modules/viem/_esm/utils/siwe/validateSiweMessage.js
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
    if (address && !isAddressEqual(message.address, address))
      return false;
  } catch {
    return false;
  }
  return true;
}

// node_modules/viem/_esm/actions/siwe/verifySiweMessage.js
async function verifySiweMessage(client, parameters) {
  const { address, domain, message, nonce, scheme, signature, time = /* @__PURE__ */ new Date(), ...callRequest } = parameters;
  const parsed = parseSiweMessage(message);
  if (!parsed.address)
    return false;
  const isValid = validateSiweMessage({
    address,
    domain,
    message: parsed,
    nonce,
    scheme,
    time
  });
  if (!isValid)
    return false;
  const hash = hashMessage(message);
  return verifyHash2(client, {
    address: parsed.address,
    hash,
    signature,
    ...callRequest
  });
}

// node_modules/viem/_esm/clients/decorators/public.js
function publicActions(client) {
  return {
    call: (args) => call(client, args),
    createAccessList: (args) => createAccessList(client, args),
    createBlockFilter: () => createBlockFilter(client),
    createContractEventFilter: (args) => createContractEventFilter(client, args),
    createEventFilter: (args) => createEventFilter(client, args),
    createPendingTransactionFilter: () => createPendingTransactionFilter(client),
    estimateContractGas: (args) => estimateContractGas(client, args),
    estimateGas: (args) => estimateGas(client, args),
    getBalance: (args) => getBalance(client, args),
    getBlobBaseFee: () => getBlobBaseFee(client),
    getBlock: (args) => getBlock(client, args),
    getBlockNumber: (args) => getBlockNumber(client, args),
    getBlockTransactionCount: (args) => getBlockTransactionCount(client, args),
    getBytecode: (args) => getCode(client, args),
    getChainId: () => getChainId(client),
    getCode: (args) => getCode(client, args),
    getContractEvents: (args) => getContractEvents(client, args),
    getEip712Domain: (args) => getEip712Domain(client, args),
    getEnsAddress: (args) => getEnsAddress(client, args),
    getEnsAvatar: (args) => getEnsAvatar(client, args),
    getEnsName: (args) => getEnsName(client, args),
    getEnsResolver: (args) => getEnsResolver(client, args),
    getEnsText: (args) => getEnsText(client, args),
    getFeeHistory: (args) => getFeeHistory(client, args),
    estimateFeesPerGas: (args) => estimateFeesPerGas(client, args),
    getFilterChanges: (args) => getFilterChanges(client, args),
    getFilterLogs: (args) => getFilterLogs(client, args),
    getGasPrice: () => getGasPrice(client),
    getLogs: (args) => getLogs(client, args),
    getProof: (args) => getProof(client, args),
    estimateMaxPriorityFeePerGas: (args) => estimateMaxPriorityFeePerGas(client, args),
    getStorageAt: (args) => getStorageAt(client, args),
    getTransaction: (args) => getTransaction(client, args),
    getTransactionConfirmations: (args) => getTransactionConfirmations(client, args),
    getTransactionCount: (args) => getTransactionCount(client, args),
    getTransactionReceipt: (args) => getTransactionReceipt(client, args),
    multicall: (args) => multicall(client, args),
    prepareTransactionRequest: (args) => prepareTransactionRequest(client, args),
    readContract: (args) => readContract(client, args),
    sendRawTransaction: (args) => sendRawTransaction(client, args),
    simulate: (args) => simulate(client, args),
    simulateContract: (args) => simulateContract(client, args),
    verifyMessage: (args) => verifyMessage2(client, args),
    verifySiweMessage: (args) => verifySiweMessage(client, args),
    verifyTypedData: (args) => verifyTypedData2(client, args),
    uninstallFilter: (args) => uninstallFilter(client, args),
    waitForTransactionReceipt: (args) => waitForTransactionReceipt(client, args),
    watchBlocks: (args) => watchBlocks(client, args),
    watchBlockNumber: (args) => watchBlockNumber(client, args),
    watchContractEvent: (args) => watchContractEvent(client, args),
    watchEvent: (args) => watchEvent(client, args),
    watchPendingTransactions: (args) => watchPendingTransactions(client, args)
  };
}

// node_modules/viem/_esm/actions/wallet/deployContract.js
function deployContract(walletClient, parameters) {
  const { abi: abi2, args, bytecode, ...request } = parameters;
  const calldata = encodeDeployData({ abi: abi2, args, bytecode });
  return sendTransaction(walletClient, {
    ...request,
    data: calldata
  });
}

// node_modules/viem/_esm/actions/wallet/getAddresses.js
async function getAddresses(client) {
  var _a;
  if (((_a = client.account) == null ? void 0 : _a.type) === "local")
    return [client.account.address];
  const addresses = await client.request({ method: "eth_accounts" }, { dedupe: true });
  return addresses.map((address) => checksumAddress(address));
}

// node_modules/viem/_esm/actions/wallet/getPermissions.js
async function getPermissions(client) {
  const permissions = await client.request({ method: "wallet_getPermissions" }, { dedupe: true });
  return permissions;
}

// node_modules/viem/_esm/actions/wallet/requestAddresses.js
async function requestAddresses(client) {
  const addresses = await client.request({ method: "eth_requestAccounts" }, { dedupe: true, retryCount: 0 });
  return addresses.map((address) => getAddress(address));
}

// node_modules/viem/_esm/actions/wallet/requestPermissions.js
async function requestPermissions(client, permissions) {
  return client.request({
    method: "wallet_requestPermissions",
    params: [permissions]
  }, { retryCount: 0 });
}

// node_modules/viem/_esm/actions/wallet/signMessage.js
async function signMessage(client, { account: account_ = client.account, message }) {
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/signMessage"
    });
  const account = parseAccount(account_);
  if (account.signMessage)
    return account.signMessage({ message });
  const message_ = (() => {
    if (typeof message === "string")
      return stringToHex(message);
    if (message.raw instanceof Uint8Array)
      return toHex(message.raw);
    return message.raw;
  })();
  return client.request({
    method: "personal_sign",
    params: [message_, account.address]
  }, { retryCount: 0 });
}

// node_modules/viem/_esm/actions/wallet/signTransaction.js
async function signTransaction(client, parameters) {
  var _a, _b, _c, _d;
  const { account: account_ = client.account, chain = client.chain, ...transaction } = parameters;
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/signTransaction"
    });
  const account = parseAccount(account_);
  assertRequest({
    account,
    ...parameters
  });
  const chainId = await getAction(client, getChainId, "getChainId")({});
  if (chain !== null)
    assertCurrentChain({
      currentChainId: chainId,
      chain
    });
  const formatters = (chain == null ? void 0 : chain.formatters) || ((_a = client.chain) == null ? void 0 : _a.formatters);
  const format = ((_b = formatters == null ? void 0 : formatters.transactionRequest) == null ? void 0 : _b.format) || formatTransactionRequest;
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
        chainId: numberToHex(chainId),
        from: account.address
      }
    ]
  }, { retryCount: 0 });
}

// node_modules/viem/_esm/actions/wallet/signTypedData.js
async function signTypedData(client, parameters) {
  const { account: account_ = client.account, domain, message, primaryType } = parameters;
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/signTypedData"
    });
  const account = parseAccount(account_);
  const types = {
    EIP712Domain: getTypesForEIP712Domain({ domain }),
    ...parameters.types
  };
  validateTypedData({ domain, message, primaryType, types });
  if (account.signTypedData)
    return account.signTypedData({ domain, message, primaryType, types });
  const typedData = serializeTypedData({ domain, message, primaryType, types });
  return client.request({
    method: "eth_signTypedData_v4",
    params: [account.address, typedData]
  }, { retryCount: 0 });
}

// node_modules/viem/_esm/actions/wallet/switchChain.js
async function switchChain(client, { id }) {
  await client.request({
    method: "wallet_switchEthereumChain",
    params: [
      {
        chainId: numberToHex(id)
      }
    ]
  }, { retryCount: 0 });
}

// node_modules/viem/_esm/actions/wallet/watchAsset.js
async function watchAsset(client, params) {
  const added = await client.request({
    method: "wallet_watchAsset",
    params
  }, { retryCount: 0 });
  return added;
}

// node_modules/viem/_esm/clients/decorators/wallet.js
function walletActions(client) {
  return {
    addChain: (args) => addChain(client, args),
    deployContract: (args) => deployContract(client, args),
    getAddresses: () => getAddresses(client),
    getChainId: () => getChainId(client),
    getPermissions: () => getPermissions(client),
    prepareTransactionRequest: (args) => prepareTransactionRequest(client, args),
    requestAddresses: () => requestAddresses(client),
    requestPermissions: (args) => requestPermissions(client, args),
    sendRawTransaction: (args) => sendRawTransaction(client, args),
    sendTransaction: (args) => sendTransaction(client, args),
    signMessage: (args) => signMessage(client, args),
    signTransaction: (args) => signTransaction(client, args),
    signTypedData: (args) => signTypedData(client, args),
    switchChain: (args) => switchChain(client, args),
    watchAsset: (args) => watchAsset(client, args),
    writeContract: (args) => writeContract(client, args)
  };
}

export {
  getBlock,
  getGasPrice,
  estimateMaxPriorityFeePerGas,
  estimateFeesPerGas,
  getBalance,
  estimateGas,
  getTransactionCount,
  prepareTransactionRequest,
  sendTransaction,
  deployContract,
  readContract,
  getEnsAddress,
  getEnsText,
  getEnsAvatar,
  getEnsName,
  getEnsResolver,
  getBlockNumber,
  getBlockTransactionCount,
  getFeeHistory,
  getStorageAt,
  getTransaction,
  getTransactionConfirmations,
  getTransactionReceipt,
  multicall,
  isBytes2 as isBytes,
  abytes,
  abool,
  bytesToHex2 as bytesToHex,
  numberToHexUnpadded,
  hexToBytes2 as hexToBytes,
  bytesToNumberBE,
  bytesToNumberLE,
  numberToBytesBE,
  numberToBytesLE,
  ensureBytes,
  concatBytes2 as concatBytes,
  utf8ToBytes,
  inRange,
  aInRange,
  bitLen,
  bitGet,
  bitMask,
  createHmacDrbg,
  validateObject,
  notImplemented,
  memoized,
  utils_exports,
  getUrl,
  prettyPrint2 as prettyPrint,
  BaseError2 as BaseError,
  Errors_exports,
  stringify2 as stringify,
  Json_exports,
  concat2 as concat,
  from,
  fromArray,
  fromHex2 as fromHex,
  fromNumber2 as fromNumber,
  fromString,
  padLeft,
  random,
  size3 as size,
  slice2 as slice,
  toBigInt2 as toBigInt,
  toBoolean,
  toHex2 as toHex,
  toNumber2 as toNumber,
  toString,
  trimLeft,
  validate,
  Bytes_exports,
  concat3 as concat2,
  from2,
  fromBoolean2 as fromBoolean,
  fromBytes2 as fromBytes,
  fromNumber as fromNumber2,
  fromString2,
  padLeft2,
  padRight,
  slice3 as slice2,
  size4 as size2,
  trimLeft2,
  toBytes2 as toBytes,
  toNumber as toNumber2,
  toString2,
  validate2,
  IntegerOutOfRangeError,
  InvalidLengthError,
  Hex_exports,
  fromRpc,
  toRpc,
  Withdrawal_exports,
  BlockOverrides_exports,
  watchBlocks,
  watchBlockNumber,
  watchPendingTransactions,
  withRetry,
  withTimeout,
  rpc,
  hashTypedData,
  hashMessage,
  parseUnits,
  getProof,
  waitForTransactionReceipt,
  signMessage,
  signTypedData,
  simulateContract,
  verifyMessage2 as verifyMessage,
  verifyTypedData2 as verifyTypedData,
  watchAsset,
  watchContractEvent,
  writeContract,
  createClient,
  createTransport,
  custom,
  fallback,
  http,
  publicActions,
  walletActions,
  webSocket2 as webSocket
};
/*! Bundled license information:

@noble/curves/esm/abstract/utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
//# sourceMappingURL=chunk-QRKWAH57.js.map
