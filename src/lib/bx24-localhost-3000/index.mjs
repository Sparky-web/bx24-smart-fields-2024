/**
 * @version @bitrix24/b24jssdk v0.1.6
 * @copyright (c) 2024 Bitrix24
 * @licence MIT
 * @links https://github.com/bitrix24/b24jssdk - GitHub
 * @links https://bitrix24.github.io/b24jssdk/ - Documentation
 */
import { DateTime } from 'luxon';
import axios, { AxiosError } from 'axios';
import * as qs from 'qs-esm';

var LoggerType = /* @__PURE__ */ ((LoggerType2) => {
  LoggerType2["desktop"] = "desktop";
  LoggerType2["log"] = "log";
  LoggerType2["info"] = "info";
  LoggerType2["warn"] = "warn";
  LoggerType2["error"] = "error";
  LoggerType2["trace"] = "trace";
  return LoggerType2;
})(LoggerType || {});
const styleCollection = /* @__PURE__ */ new Map();
styleCollection.set("title", [
  "%c#title#",
  "color: #959ca4; font-style: italic; padding: 0 6px; border-top: 1px solid #ccc; border-left: 1px solid #ccc; border-bottom: 1px solid #ccc"
]);
styleCollection.set("desktop" /* desktop */, [
  `%cDESKTOP`,
  "color: white; font-style: italic; background-color: #29619b; padding: 0 6px; border: 1px solid #29619b"
]);
styleCollection.set("log" /* log */, [
  `%cLOG`,
  "color: #2a323b; font-style: italic; background-color: #ccc; padding: 0 6px; border: 1px solid #ccc"
]);
styleCollection.set("info" /* info */, [
  `%cINFO`,
  "color: #fff; font-style: italic; background-color: #6b7f96; padding: 0 6px; border: 1px solid #6b7f96"
]);
styleCollection.set("warn" /* warn */, [
  `%cWARNING`,
  "color: #f0a74f; font-style: italic; padding: 0 6px; border: 1px solid #f0a74f"
]);
styleCollection.set("error" /* error */, [
  `%cERROR`,
  "color: white; font-style: italic; background-color: #8a3232; padding: 0 6px; border: 1px solid #8a3232"
]);
styleCollection.set("trace" /* trace */, [
  `%cTRACE`,
  "color: #2a323b; font-style: italic; background-color: #ccc; padding: 0 6px; border: 1px solid #ccc"
]);
class LoggerBrowser {
  #title;
  #types = {
    desktop: true,
    log: false,
    info: false,
    warn: false,
    error: true,
    trace: true
  };
  static build(title, isDevelopment = false) {
    const logger = new LoggerBrowser(title);
    if (isDevelopment) {
      logger.enable("log" /* log */);
      logger.enable("info" /* info */);
      logger.enable("warn" /* warn */);
    }
    return logger;
  }
  constructor(title) {
    this.#title = title;
  }
  // region Styles ////
  #getStyle(type) {
    const resultText = [];
    const resultStyle = [];
    if (styleCollection.has("title")) {
      const styleTitle = styleCollection.get("title");
      if (styleTitle[0]) {
        resultText.push(styleTitle[0].replace("#title#", this.#title));
        resultStyle.push(styleTitle[1] || "");
      }
    }
    if (styleCollection.has(type)) {
      const styleBadge = styleCollection.get(type);
      if (styleBadge[0]) {
        resultText.push(styleBadge[0]);
        resultStyle.push(styleBadge[1] || "");
      }
    }
    return [resultText.join(""), ...resultStyle];
  }
  // endregion ////
  // region Config ////
  setConfig(types) {
    for (const type in types) {
      this.#types[type] = types[type];
    }
  }
  enable(type) {
    if (typeof this.#types[type] === "undefined") {
      return false;
    }
    this.#types[type] = true;
    return true;
  }
  disable(type) {
    if (typeof this.#types[type] === "undefined") {
      return false;
    }
    this.#types[type] = false;
    return true;
  }
  isEnabled(type) {
    return this.#types[type];
  }
  // endregion ////
  // region Functions ////
  desktop(...params) {
    if (this.isEnabled("desktop" /* desktop */)) {
      console.log(...this.#getStyle("desktop" /* desktop */), ...params);
    }
  }
  log(...params) {
    if (this.isEnabled("log" /* log */)) {
      console.log(...this.#getStyle("log" /* log */), ...params);
    }
  }
  info(...params) {
    if (this.isEnabled("info" /* info */)) {
      console.info(...this.#getStyle("info" /* info */), ...params);
    }
  }
  warn(...params) {
    if (this.isEnabled("warn" /* warn */)) {
      console.warn(...this.#getStyle("warn" /* warn */), ...params);
    }
  }
  error(...params) {
    if (this.isEnabled("error" /* error */)) {
      console.error(...this.#getStyle("error" /* error */), ...params);
    }
  }
  trace(...params) {
    if (this.isEnabled("trace" /* trace */)) {
      console.trace(...this.#getStyle("trace" /* trace */), ...params);
    }
  }
  // endregion ////
}

var DataType = /* @__PURE__ */ ((DataType2) => {
  DataType2["undefined"] = "undefined";
  DataType2["any"] = "any";
  DataType2["integer"] = "integer";
  DataType2["boolean"] = "boolean";
  DataType2["double"] = "double";
  DataType2["date"] = "date";
  DataType2["datetime"] = "datetime";
  DataType2["string"] = "string";
  DataType2["text"] = "text";
  DataType2["file"] = "file";
  DataType2["array"] = "array";
  DataType2["object"] = "object";
  DataType2["user"] = "user";
  DataType2["location"] = "location";
  DataType2["crmCategory"] = "crm_category";
  DataType2["crmStatus"] = "crm_status";
  DataType2["crmCurrency"] = "crm_currency";
  return DataType2;
})(DataType || {});

const objectCtorString = Function.prototype.toString.call(Object);
class TypeManager {
  getTag(value) {
    return Object.prototype.toString.call(value);
  }
  /**
   * Checks that value is string
   * @param value
   * @return {boolean}
   *
   * @memo get from pull.client.Utils
   */
  isString(value) {
    return value === "" ? true : (
      // eslint-disable-next-line unicorn/no-nested-ternary
      value ? typeof value === "string" || value instanceof String : false
    );
  }
  /**
   * Returns true if a value is not an empty string
   * @param value
   * @returns {boolean}
   */
  isStringFilled(value) {
    return this.isString(value) && value !== "";
  }
  /**
   * Checks that value is function
   * @param value
   * @return {boolean}
   *
   * @memo get from pull.client.Utils
   */
  isFunction(value) {
    return value === null ? false : typeof value === "function" || value instanceof Function;
  }
  /**
   * Checks that value is an object
   * @param value
   * @return {boolean}
   */
  isObject(value) {
    return !!value && (typeof value === "object" || typeof value === "function");
  }
  /**
   * Checks that value is object like
   * @param value
   * @return {boolean}
   */
  isObjectLike(value) {
    return !!value && typeof value === "object";
  }
  /**
   * Checks that value is plain object
   * @param value
   * @return {boolean}
   */
  isPlainObject(value) {
    if (!this.isObjectLike(value) || this.getTag(value) !== "[object Object]") {
      return false;
    }
    const proto = Object.getPrototypeOf(value);
    if (proto === null) {
      return true;
    }
    const ctor = proto.hasOwnProperty("constructor") && proto.constructor;
    return typeof ctor === "function" && Function.prototype.toString.call(ctor) === objectCtorString;
  }
  isJsonRpcRequest(value) {
    return typeof value === "object" && value && "jsonrpc" in value && this.isStringFilled(value.jsonrpc) && "method" in value && this.isStringFilled(value.method);
  }
  isJsonRpcResponse(value) {
    return typeof value === "object" && value && "jsonrpc" in value && this.isStringFilled(value.jsonrpc) && "id" in value && ("result" in value || "error" in value);
  }
  /**
   * Checks that value is boolean
   * @param value
   * @return {boolean}
   */
  isBoolean(value) {
    return value === true || value === false;
  }
  /**
   * Checks that value is number
   * @param value
   * @return {boolean}
   */
  isNumber(value) {
    return !Number.isNaN(value) && typeof value === "number";
  }
  /**
   * Checks that value is integer
   * @param value
   * @return {boolean}
   */
  isInteger(value) {
    return this.isNumber(value) && value % 1 === 0;
  }
  /**
   * Checks that value is float
   * @param value
   * @return {boolean}
   */
  isFloat(value) {
    return this.isNumber(value) && !this.isInteger(value);
  }
  /**
   * Checks that value is nil
   * @param value
   * @return {boolean}
   */
  isNil(value) {
    return value === null || value === void 0;
  }
  /**
   * Checks that value is an array
   * @param value
   * @return {boolean}
   */
  isArray(value) {
    return !this.isNil(value) && Array.isArray(value);
  }
  /**
   * Returns true if a value is an array, and it has at least one element
   * @param value
   * @returns {boolean}
   */
  isArrayFilled(value) {
    return this.isArray(value) && value.length > 0;
  }
  /**
   * Checks that value is array like
   * @param value
   * @return {boolean}
   */
  isArrayLike(value) {
    return !this.isNil(value) && !this.isFunction(value) && value.length > -1 && value.length <= Number.MAX_SAFE_INTEGER;
  }
  /**
   * Checks that value is Date
   * @param value
   * @return {boolean}
   */
  isDate(value) {
    return this.isObjectLike(value) && this.getTag(value) === "[object Date]";
  }
  /**
   * Checks that is a DOM node
   * @param value
   * @return {boolean}
   */
  isDomNode(value) {
    return this.isObjectLike(value) && !this.isPlainObject(value) && "nodeType" in value;
  }
  /**
   * Checks that value is element node
   * @param value
   * @return {boolean}
   */
  isElementNode(value) {
    return this.isDomNode(value) && value.nodeType === Node.ELEMENT_NODE;
  }
  /**
   * Checks that value is a text node
   * @param value
   * @return {boolean}
   */
  isTextNode(value) {
    return this.isDomNode(value) && value.nodeType === Node.TEXT_NODE;
  }
  /**
   * Checks that value is Map
   * @param value
   * @return {boolean}
   */
  isMap(value) {
    return this.isObjectLike(value) && this.getTag(value) === "[object Map]";
  }
  /**
   * Checks that value is Set
   * @param value
   * @return {boolean}
   */
  isSet(value) {
    return this.isObjectLike(value) && this.getTag(value) === "[object Set]";
  }
  /**
   * Checks that value is WeakMap
   * @param value
   * @return {boolean}
   */
  isWeakMap(value) {
    return this.isObjectLike(value) && this.getTag(value) === "[object WeakMap]";
  }
  /**
   * Checks that value is WeakSet
   * @param value
   * @return {boolean}
   */
  isWeakSet(value) {
    return this.isObjectLike(value) && this.getTag(value) === "[object WeakSet]";
  }
  /**
   * Checks that value is prototype
   * @param value
   * @return {boolean}
   */
  isPrototype(value) {
    return (typeof (value && value.constructor) === "function" && value.constructor.prototype || Object.prototype) === value;
  }
  /**
   * Checks that value is regexp
   * @param value
   * @return {boolean}
   */
  isRegExp(value) {
    return this.isObjectLike(value) && this.getTag(value) === "[object RegExp]";
  }
  /**
   * Checks that value is null
   * @param value
   * @return {boolean}
   */
  isNull(value) {
    return value === null;
  }
  /**
   * Checks that value is undefined
   * @param value
   * @return {boolean}
   */
  isUndefined(value) {
    return typeof value === "undefined";
  }
  /**
   * Checks that value is ArrayBuffer
   * @param value
   * @return {boolean}
   */
  isArrayBuffer(value) {
    return this.isObjectLike(value) && this.getTag(value) === "[object ArrayBuffer]";
  }
  /**
   * Checks that value is typed array
   * @param value
   * @return {boolean}
   */
  isTypedArray(value) {
    const regExpTypedTag = /^\[object (?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)]$/;
    return this.isObjectLike(value) && regExpTypedTag.test(this.getTag(value));
  }
  /**
   * Checks that value is Blob
   * @param value
   * @return {boolean}
   */
  isBlob(value) {
    return this.isObjectLike(value) && this.isNumber(value.size) && this.isString(value.type) && this.isFunction(value.slice);
  }
  /**
   * Checks that value is File
   * @param value
   * @return {boolean}
   */
  isFile(value) {
    return this.isBlob(value) && this.isString(value.name) && (this.isNumber(value.lastModified) || this.isObjectLike(value.lastModifiedDate));
  }
  /**
   * Checks that value is FormData
   * @param value
   * @return {boolean}
   */
  isFormData(value) {
    return value instanceof FormData;
  }
  clone(obj, bCopyObj = true) {
    let _obj, i, l;
    if (obj === null) {
      return null;
    }
    if (this.isDomNode(obj)) {
      _obj = obj.cloneNode(bCopyObj);
    } else if (typeof obj == "object") {
      if (this.isArray(obj)) {
        _obj = [];
        for (i = 0, l = obj.length; i < l; i++) {
          if (typeof obj[i] == "object" && bCopyObj) {
            _obj[i] = this.clone(obj[i], bCopyObj);
          } else {
            _obj[i] = obj[i];
          }
        }
      } else {
        _obj = {};
        if (obj.constructor) {
          if (this.isDate(obj)) {
            _obj = new Date(obj);
          } else {
            _obj = new obj.constructor();
          }
        }
        for (i in obj) {
          if (!obj.hasOwnProperty(i)) {
            continue;
          }
          if (typeof obj[i] === "object" && bCopyObj) {
            _obj[i] = this.clone(obj[i], bCopyObj);
          } else {
            _obj[i] = obj[i];
          }
        }
      }
    } else {
      _obj = obj;
    }
    return _obj;
  }
}
const Type = new TypeManager();

const _state = {};
let getRandomValues;
const randoms8 = new Uint8Array(16);
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function updateV7State(state, now, randoms) {
  state.msecs ??= -Infinity;
  state.seq ??= 0;
  if (now > state.msecs) {
    state.seq = randoms[6] << 23 | randoms[7] << 16 | randoms[8] << 8 | randoms[9];
    state.msecs = now;
  } else {
    state.seq = Math.trunc(state.seq + 1);
    if (state.seq === 0) {
      state.msecs++;
    }
  }
  return state;
}
function v7Bytes(randoms, msecs, seq, buf, offset = 0) {
  if (!buf) {
    buf = new Uint8Array(16);
    offset = 0;
  }
  msecs ??= Date.now();
  seq ??= randoms[6] * 127 << 24 | randoms[7] << 16 | randoms[8] << 8 | randoms[9];
  buf[offset++] = msecs / 1099511627776 & 255;
  buf[offset++] = msecs / 4294967296 & 255;
  buf[offset++] = msecs / 16777216 & 255;
  buf[offset++] = msecs / 65536 & 255;
  buf[offset++] = msecs / 256 & 255;
  buf[offset++] = msecs & 255;
  buf[offset++] = 112 | seq >>> 28 & 15;
  buf[offset++] = seq >>> 20 & 255;
  buf[offset++] = 128 | seq >>> 14 & 63;
  buf[offset++] = seq >>> 6 & 255;
  buf[offset++] = seq << 2 & 255 | randoms[10] & 3;
  buf[offset++] = randoms[11];
  buf[offset++] = randoms[12];
  buf[offset++] = randoms[13];
  buf[offset++] = randoms[14];
  buf[offset++] = randoms[15];
  return buf;
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
function uuidv7() {
  const buf = void 0;
  const offset = void 0;
  const now = Date.now();
  if (!getRandomValues) {
    if (typeof crypto === "undefined" || !crypto.getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported.");
    }
    getRandomValues = crypto.getRandomValues.bind(crypto);
  }
  const randoms = getRandomValues(randoms8);
  updateV7State(_state, now, randoms);
  const bytes = v7Bytes(
    randoms,
    _state.msecs,
    _state.seq,
    buf,
    offset
  );
  return unsafeStringify(bytes);
}

const reEscape = /[&<>'"]/g;
const reUnescape = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34)/g;
const escapeEntities = {
  "&": "&amp",
  "<": "&lt",
  ">": "&gt",
  "'": "&#39",
  '"': "&quot"
};
const unescapeEntities = {
  "&amp": "&",
  "&#38": "&",
  "&lt": "<",
  "&#60": "<",
  "&gt": ">",
  "&#62": ">",
  "&apos": "'",
  "&#39": "'",
  "&quot": '"',
  "&#34": '"'
};
class TextManager {
  getRandom(length = 8) {
    return [...Array(length)].map(() => Math.trunc(Math.random() * 36).toString(36)).join("");
  }
  /**
   * Generates UUID
   */
  getUniqId() {
    return "xxxxxxxx-xlsx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.trunc(Math.random() * 16);
      const v = c === "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  }
  /**
   * Generate uuid v7
   * @return {string}
   */
  getUuidRfc4122() {
    return uuidv7();
  }
  /**
   * Encodes all unsafe entities
   * @param {string} value
   * @return {string}
   */
  encode(value) {
    if (Type.isString(value)) {
      return value.replace(reEscape, (item) => escapeEntities[item]);
    }
    return value;
  }
  /**
   * Decodes all encoded entities
   * @param {string} value
   * @return {string}
   */
  decode(value) {
    if (Type.isString(value)) {
      return value.replace(reUnescape, (item) => unescapeEntities[item]);
    }
    return value;
  }
  toNumber(value) {
    const parsedValue = Number.parseFloat(value);
    if (Type.isNumber(parsedValue)) {
      return parsedValue;
    }
    return 0;
  }
  toInteger(value) {
    return this.toNumber(Number.parseInt(value, 10));
  }
  toBoolean(value, trueValues = []) {
    const transformedValue = Type.isString(value) ? value.toLowerCase() : value;
    return ["true", "y", "1", 1, true, ...trueValues].includes(transformedValue);
  }
  toCamelCase(str) {
    if (!Type.isStringFilled(str)) {
      return str;
    }
    const regex = /[-_\s]+(.)?/g;
    if (!regex.test(str)) {
      return str.match(/^[A-Z]+$/) ? str.toLowerCase() : str[0].toLowerCase() + str.slice(1);
    }
    str = str.toLowerCase();
    str = str.replace(
      regex,
      (_match, letter) => letter ? letter.toUpperCase() : ""
    );
    return str[0].toLowerCase() + str.substring(1);
  }
  toPascalCase(str) {
    if (!Type.isStringFilled(str)) {
      return str;
    }
    return this.capitalize(this.toCamelCase(str));
  }
  toKebabCase(str) {
    if (!Type.isStringFilled(str)) {
      return str;
    }
    const matches = str.match(
      // eslint-disable-next-line
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
    );
    if (!matches) {
      return str;
    }
    return matches.map((x) => x.toLowerCase()).join("-");
  }
  capitalize(str) {
    if (!Type.isStringFilled(str)) {
      return str;
    }
    return str[0].toUpperCase() + str.substring(1);
  }
  numberFormat(number, decimals = 0, decPoint = ".", thousandsSep = ",") {
    const n = !Number.isFinite(number) ? 0 : number;
    const fractionDigits = !Number.isFinite(decimals) ? 0 : Math.abs(decimals);
    const toFixedFix = (n2, fractionDigits2) => {
      const k = Math.pow(10, fractionDigits2);
      return Math.round(n2 * k) / k;
    };
    const s = (fractionDigits ? toFixedFix(n, fractionDigits) : Math.round(n)).toString().split(".");
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, thousandsSep);
    }
    if ((s[1] || "").length < fractionDigits) {
      s[1] = s[1] || "";
      s[1] += new Array(fractionDigits - s[1].length + 1).join("0");
    }
    return s.join(decPoint);
  }
  /**
   * Convert string to DateTime from ISO 8601 or self template
   *
   * @param {string} dateString
   * @param {string} template
   * @param opts
   * @returns {DateTime}
   *
   * @link https://moment.github.io/luxon/#/parsing?id=parsing-technical-formats
   */
  toDateTime(dateString, template, opts) {
    if (!(typeof template === "undefined") && Type.isStringFilled(template)) {
      return DateTime.fromFormat(dateString, template, opts);
    }
    return DateTime.fromISO(dateString, opts);
  }
  getDateForLog() {
    const now = DateTime.now();
    return now.toFormat("y-MM-dd HH:mm:ss");
  }
  buildQueryString(params) {
    let result = "";
    for (const key in params) {
      if (!params.hasOwnProperty(key)) {
        continue;
      }
      const value = params[key];
      if (Type.isArray(value)) {
        value.forEach((valueElement, index) => {
          result += encodeURIComponent(key + "[" + index + "]") + "=" + encodeURIComponent(valueElement) + "&";
        });
      } else {
        result += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
      }
    }
    if (result.length > 0) {
      result = result.substring(0, result.length - 1);
    }
    return result;
  }
}
const Text = new TextManager();

let UA = "";
try {
  UA = navigator?.userAgent.toLowerCase();
} catch {
  UA = "?";
}
class BrowserManager {
  isOpera() {
    return UA.includes("opera");
  }
  isIE() {
    return "attachEvent" in document && !this.isOpera();
  }
  isIE6() {
    return UA.includes("msie 6");
  }
  isIE7() {
    return UA.includes("msie 7");
  }
  isIE8() {
    return UA.includes("msie 8");
  }
  isIE9() {
    return "documentMode" in document && document.documentMode >= 9;
  }
  isIE10() {
    return "documentMode" in document && document.documentMode >= 10;
  }
  isSafari() {
    return UA.includes("safari") && !UA.includes("chrome");
  }
  isFirefox() {
    return UA.includes("firefox");
  }
  isChrome() {
    return UA.includes("chrome");
  }
  detectIEVersion() {
    if (this.isOpera() || this.isSafari() || this.isFirefox() || this.isChrome()) {
      return -1;
    }
    let rv = -1;
    if (
      // @ts-ignore ////
      !!window.MSStream && // @ts-ignore ////
      !window.ActiveXObject && "ActiveXObject" in window
    ) {
      rv = 11;
    } else if (this.isIE10()) {
      rv = 10;
    } else if (this.isIE9()) {
      rv = 9;
    } else if (this.isIE()) {
      rv = 8;
    }
    if (rv === -1 || rv === 8) {
      if (navigator.appName === "Microsoft Internet Explorer") {
        const re = new RegExp("MSIE ([0-9]+[.0-9]*)");
        const res = navigator.userAgent.match(re);
        if (Type.isArrayLike(res) && res.length > 0) {
          rv = Number.parseFloat(res[1]);
        }
      }
      if (navigator.appName === "Netscape") {
        rv = 11;
        const re = new RegExp("Trident/.*rv:([0-9]+[.0-9]*)");
        if (re.exec(navigator.userAgent) != null) {
          const res = navigator.userAgent.match(re);
          if (Type.isArrayLike(res) && res.length > 0) {
            rv = Number.parseFloat(res[1]);
          }
        }
      }
    }
    return rv;
  }
  isIE11() {
    return this.detectIEVersion() >= 11;
  }
  isMac() {
    return UA.includes("macintosh");
  }
  isWin() {
    return UA.includes("windows");
  }
  isLinux() {
    return UA.includes("linux") && !this.isAndroid();
  }
  isAndroid() {
    return UA.includes("android");
  }
  isIPad() {
    return UA.includes("ipad;") || this.isMac() && this.isTouchDevice();
  }
  isIPhone() {
    return UA.includes("iphone;");
  }
  isIOS() {
    return this.isIPad() || this.isIPhone();
  }
  isMobile() {
    return this.isIPhone() || this.isIPad() || this.isAndroid() || UA.includes("mobile") || UA.includes("touch");
  }
  isRetina() {
    return (window.devicePixelRatio && window.devicePixelRatio >= 2) === true;
  }
  isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0 || // @ts-ignore ////
    navigator.msMaxTouchPoints > 0;
  }
  isDoctype(target) {
    const doc = target || document;
    if (doc.compatMode) {
      return doc.compatMode === "CSS1Compat";
    }
    return doc.documentElement && doc.documentElement.clientHeight;
  }
  isLocalStorageSupported() {
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      return true;
    } catch {
      return false;
    }
  }
  detectAndroidVersion() {
    const re = new RegExp("Android ([0-9]+[.0-9]*)");
    if (re.exec(navigator.userAgent) != null) {
      const res = navigator.userAgent.match(re);
      if (Type.isArrayLike(res) && res.length > 0) {
        return Number.parseFloat(res[1]);
      }
    }
    return 0;
  }
}
const Browser = new BrowserManager();

const RestrictionManagerParamsBase = {
  sleep: 1e3,
  speed: 1e-3,
  amount: 30
};
const RestrictionManagerParamsForEnterprise = {
  sleep: 600,
  speed: 0.01,
  amount: 30 * 5
};

var EnumCrmEntityType = /* @__PURE__ */ ((EnumCrmEntityType2) => {
  EnumCrmEntityType2["undefined"] = "UNDEFINED";
  EnumCrmEntityType2["lead"] = "CRM_LEAD";
  EnumCrmEntityType2["deal"] = "CRM_DEAL";
  EnumCrmEntityType2["contact"] = "CRM_CONTACT";
  EnumCrmEntityType2["company"] = "CRM_COMPANY";
  EnumCrmEntityType2["oldInvoice"] = "CRM_INVOICE";
  EnumCrmEntityType2["invoice"] = "CRM_SMART_INVOICE";
  EnumCrmEntityType2["quote"] = "CRM_QUOTE";
  EnumCrmEntityType2["requisite"] = "CRM_REQUISITE";
  return EnumCrmEntityType2;
})(EnumCrmEntityType || {});
var EnumCrmEntityTypeId = /* @__PURE__ */ ((EnumCrmEntityTypeId2) => {
  EnumCrmEntityTypeId2[EnumCrmEntityTypeId2["undefined"] = 0] = "undefined";
  EnumCrmEntityTypeId2[EnumCrmEntityTypeId2["lead"] = 1] = "lead";
  EnumCrmEntityTypeId2[EnumCrmEntityTypeId2["deal"] = 2] = "deal";
  EnumCrmEntityTypeId2[EnumCrmEntityTypeId2["contact"] = 3] = "contact";
  EnumCrmEntityTypeId2[EnumCrmEntityTypeId2["company"] = 4] = "company";
  EnumCrmEntityTypeId2[EnumCrmEntityTypeId2["oldInvoice"] = 5] = "oldInvoice";
  EnumCrmEntityTypeId2[EnumCrmEntityTypeId2["invoice"] = 31] = "invoice";
  EnumCrmEntityTypeId2[EnumCrmEntityTypeId2["quote"] = 7] = "quote";
  EnumCrmEntityTypeId2[EnumCrmEntityTypeId2["requisite"] = 8] = "requisite";
  return EnumCrmEntityTypeId2;
})(EnumCrmEntityTypeId || {});

var LoadDataType = /* @__PURE__ */ ((LoadDataType2) => {
  LoadDataType2["App"] = "app";
  LoadDataType2["Profile"] = "profile";
  LoadDataType2["Currency"] = "currency";
  LoadDataType2["AppOptions"] = "appOptions";
  LoadDataType2["UserOptions"] = "userOptions";
  return LoadDataType2;
})(LoadDataType || {});
const EnumAppStatus = {
  // free ////
  Free: "F",
  // demo version ////
  Demo: "D",
  // trial version (limited time) ////
  Trial: "T",
  // paid application ////
  Paid: "P",
  // local application ////
  Local: "L",
  // subscription application ////
  Subscription: "S"
};
const StatusDescriptions = {
  [EnumAppStatus.Free]: "Free",
  [EnumAppStatus.Demo]: "Demo",
  [EnumAppStatus.Trial]: "Trial",
  [EnumAppStatus.Paid]: "Paid",
  [EnumAppStatus.Local]: "Local",
  [EnumAppStatus.Subscription]: "Subscription"
};
const TypeSpecificUrl = {
  MainSettings: "MainSettings",
  UfList: "UfList",
  UfPage: "UfPage"
};
var TypeOption = /* @__PURE__ */ ((TypeOption2) => {
  TypeOption2["NotSet"] = "notSet";
  TypeOption2["JsonArray"] = "jsonArray";
  TypeOption2["JsonObject"] = "jsonObject";
  TypeOption2["FloatVal"] = "float";
  TypeOption2["IntegerVal"] = "integer";
  TypeOption2["BoolYN"] = "boolYN";
  TypeOption2["StringVal"] = "string";
  return TypeOption2;
})(TypeOption || {});

var ConnectionType = /* @__PURE__ */ ((ConnectionType2) => {
  ConnectionType2["Undefined"] = "undefined";
  ConnectionType2["WebSocket"] = "webSocket";
  ConnectionType2["LongPolling"] = "longPolling";
  return ConnectionType2;
})(ConnectionType || {});
var LsKeys = /* @__PURE__ */ ((LsKeys2) => {
  LsKeys2["PullConfig"] = "bx-pull-config";
  LsKeys2["WebsocketBlocked"] = "bx-pull-websocket-blocked";
  LsKeys2["LongPollingBlocked"] = "bx-pull-longpolling-blocked";
  LsKeys2["LoggingEnabled"] = "bx-pull-logging-enabled";
  return LsKeys2;
})(LsKeys || {});
var PullStatus = /* @__PURE__ */ ((PullStatus2) => {
  PullStatus2["Online"] = "online";
  PullStatus2["Offline"] = "offline";
  PullStatus2["Connecting"] = "connect";
  return PullStatus2;
})(PullStatus || {});
var SenderType = /* @__PURE__ */ ((SenderType2) => {
  SenderType2[SenderType2["Unknown"] = 0] = "Unknown";
  SenderType2[SenderType2["Client"] = 1] = "Client";
  SenderType2[SenderType2["Backend"] = 2] = "Backend";
  return SenderType2;
})(SenderType || {});
var SubscriptionType = /* @__PURE__ */ ((SubscriptionType2) => {
  SubscriptionType2["Server"] = "server";
  SubscriptionType2["Client"] = "client";
  SubscriptionType2["Online"] = "online";
  SubscriptionType2["Status"] = "status";
  SubscriptionType2["Revision"] = "revision";
  return SubscriptionType2;
})(SubscriptionType || {});
var CloseReasons = /* @__PURE__ */ ((CloseReasons2) => {
  CloseReasons2[CloseReasons2["NORMAL_CLOSURE"] = 1e3] = "NORMAL_CLOSURE";
  CloseReasons2[CloseReasons2["SERVER_DIE"] = 1001] = "SERVER_DIE";
  CloseReasons2[CloseReasons2["CONFIG_REPLACED"] = 3e3] = "CONFIG_REPLACED";
  CloseReasons2[CloseReasons2["CHANNEL_EXPIRED"] = 3001] = "CHANNEL_EXPIRED";
  CloseReasons2[CloseReasons2["SERVER_RESTARTED"] = 3002] = "SERVER_RESTARTED";
  CloseReasons2[CloseReasons2["CONFIG_EXPIRED"] = 3003] = "CONFIG_EXPIRED";
  CloseReasons2[CloseReasons2["MANUAL"] = 3004] = "MANUAL";
  CloseReasons2[CloseReasons2["STUCK"] = 3005] = "STUCK";
  CloseReasons2[CloseReasons2["WRONG_CHANNEL_ID"] = 4010] = "WRONG_CHANNEL_ID";
  return CloseReasons2;
})(CloseReasons || {});
var SystemCommands = /* @__PURE__ */ ((SystemCommands2) => {
  SystemCommands2["CHANNEL_EXPIRE"] = "CHANNEL_EXPIRE";
  SystemCommands2["CONFIG_EXPIRE"] = "CONFIG_EXPIRE";
  SystemCommands2["SERVER_RESTART"] = "SERVER_RESTART";
  return SystemCommands2;
})(SystemCommands || {});
var ServerMode = /* @__PURE__ */ ((ServerMode2) => {
  ServerMode2["Shared"] = "shared";
  ServerMode2["Personal"] = "personal";
  return ServerMode2;
})(ServerMode || {});
const ListRpcError = {
  Parse: { code: -32700, message: "Parse error" },
  InvalidRequest: { code: -32600, message: "Invalid Request" },
  MethodNotFound: { code: -32601, message: "Method not found" },
  InvalidParams: { code: -32602, message: "Invalid params" },
  Internal: { code: -32603, message: "Internal error" }
};
var RpcMethod = /* @__PURE__ */ ((RpcMethod2) => {
  RpcMethod2["Publish"] = "publish";
  RpcMethod2["GetUsersLastSeen"] = "getUsersLastSeen";
  RpcMethod2["Ping"] = "ping";
  RpcMethod2["ListChannels"] = "listChannels";
  RpcMethod2["SubscribeStatusChange"] = "subscribeStatusChange";
  RpcMethod2["UnsubscribeStatusChange"] = "unsubscribeStatusChange";
  return RpcMethod2;
})(RpcMethod || {});

class Result {
  _errorCollection;
  _data;
  constructor() {
    this._errorCollection = /* @__PURE__ */ new Set();
    this._data = null;
  }
  /**
   * Getter for the `isSuccess` property.
   * Checks if the `_errorCollection` is empty to determine success.
   *
   * @returns Whether the operation resulted in success (no errors).
   */
  get isSuccess() {
    return this._errorCollection.size === 0;
  }
  /**
   * Sets the data associated with the result.
   *
   * @param data The data to be stored in the result.
   * @returns The current Result object for chaining methods.
   */
  setData(data) {
    this._data = data;
    return this;
  }
  /**
   * Retrieves the data associated with the result.
   *
   * @returns The data stored in the result, if any.
   */
  getData() {
    return this._data;
  }
  /**
   * Adds an error message or Error object to the result.
   *
   * @param error The error message or Error object to be added.
   * @returns The current Result object for chaining methods.
   */
  addError(error) {
    if (error instanceof Error) {
      this._errorCollection.add(error);
    } else {
      this._errorCollection.add(new Error(error.toString()));
    }
    return this;
  }
  /**
   * Adds multiple errors to the result in a single call.
   *
   * @param errors An array of errors or strings that will be converted to errors.
   * @returns The current Result object for chaining methods.
   */
  addErrors(errors) {
    for (const error of errors) {
      if (error instanceof Error) {
        this._errorCollection.add(error);
      } else {
        this._errorCollection.add(new Error(error.toString()));
      }
    }
    return this;
  }
  /**
   * Retrieves an iterator for the errors collected in the result.
   * @returns An iterator over the stored Error objects.
   */
  getErrors() {
    return this._errorCollection.values();
  }
  /**
   * Retrieves an array of error messages from the collected errors.
   *
   * @returns An array of strings representing the error messages. Each string
   *          contains the message of a corresponding error object.
   */
  getErrorMessages() {
    return [...this.getErrors()].map((error) => error.message);
  }
  /**
   * Converts the Result object to a string.
   *
   * @returns {string} Returns a string representation of the result operation
   */
  toString() {
    if (this.isSuccess) {
      return `Result (success): data: ${JSON.stringify(this._data)}`;
    }
    return `Result (failure): errors: ${this.getErrorMessages().join(", ")}`;
  }
}

class AjaxError extends Error {
  cause;
  _status;
  _answerError;
  constructor(params) {
    const message = `${params.answerError.error}${params.answerError.errorDescription ? ": " + params.answerError.errorDescription : ""}`;
    super(message);
    this.cause = params.cause || null;
    this.name = this.constructor.name;
    this._status = params.status;
    this._answerError = params.answerError;
  }
  get answerError() {
    return this._answerError;
  }
  get status() {
    return this._status;
  }
  set status(status) {
    this._status = status;
  }
  toString() {
    return `${this.answerError.error}${this.answerError.errorDescription ? ": " + this.answerError.errorDescription : ""} (${this.status})`;
  }
}

class AjaxResult extends Result {
  _status;
  _query;
  _data;
  constructor(answer, query, status) {
    super();
    this._data = answer;
    this._query = structuredClone(query);
    this._status = status;
    if (typeof this._data.error !== "undefined") {
      const error = typeof this._data.error === "string" ? this._data : this._data.error;
      this.addError(
        new AjaxError({
          status: this._status,
          answerError: {
            error: error.error || "",
            errorDescription: error.error_description || ""
          }
        })
      );
    }
  }
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setData(data) {
    throw new Error("AjaxResult not support setData()");
  }
  getData() {
    return this._data;
  }
  isMore() {
    return Type.isNumber(this._data?.next);
  }
  getTotal() {
    return Text.toInteger(this._data?.total);
  }
  getStatus() {
    return this._status;
  }
  getQuery() {
    return this._query;
  }
  async getNext(http) {
    if (this.isMore() && this.isSuccess) {
      this._query.start = Number.parseInt(this._data?.next);
      return http.call(
        this._query.method,
        this._query.params,
        this._query.start
      );
    }
    return Promise.resolve(false);
  }
}

class RestrictionManager {
  #params;
  #lastDecrement;
  #currentAmount;
  _logger = null;
  constructor() {
    this.#params = RestrictionManagerParamsBase;
    this.#currentAmount = 0;
    this.#lastDecrement = 0;
  }
  setLogger(logger) {
    this._logger = logger;
  }
  getLogger() {
    if (null === this._logger) {
      this._logger = LoggerBrowser.build(`NullLogger`);
      this._logger.setConfig({
        [LoggerType.desktop]: false,
        [LoggerType.log]: false,
        [LoggerType.info]: false,
        [LoggerType.warn]: false,
        [LoggerType.error]: true,
        [LoggerType.trace]: false
      });
    }
    return this._logger;
  }
  get params() {
    return { ...this.#params };
  }
  set params(params) {
    this.#params = params;
    this.getLogger().log(`new restriction manager params`, params);
  }
  check(hash = "") {
    return new Promise((resolve) => {
      this.#decrementStorage();
      if (this.#checkStorage()) {
        this.getLogger().log(
          `>> no sleep >>> ${hash}`,
          this.#getStorageStatus()
        );
        this.#incrementStorage();
        return resolve(null);
      } else {
        const sleep = (callback) => {
          this.getLogger().info(
            `>> go sleep >>> ${hash}`,
            this.#getStorageStatus()
          );
          setTimeout(() => {
            callback();
          }, this.#params.sleep);
        };
        const wait = () => {
          this.#decrementStorage();
          if (this.#checkStorage()) {
            this.getLogger().info(
              `<< stop sleep <<< ${hash}`,
              this.#getStorageStatus()
            );
            this.#incrementStorage();
            return resolve(null);
          } else {
            sleep(wait);
          }
        };
        sleep(wait);
      }
    });
  }
  #getStorageStatus() {
    return `${this.#currentAmount.toFixed(4)} from ${this.#params.amount}`;
  }
  #decrementStorage() {
    if (this.#lastDecrement > 0) {
      this.#currentAmount -= (Date.now() - this.#lastDecrement) * this.#params.speed;
      if (this.#currentAmount < 0) {
        this.#currentAmount = 0;
      }
    }
    this.#lastDecrement = Date.now();
  }
  #incrementStorage() {
    this.#currentAmount++;
  }
  #checkStorage() {
    return this.#currentAmount < this.#params.amount;
  }
}

const DEFAULT_REQUEST_ID_HEADER_FIELD_NAME = "X-Request-ID";
const DEFAULT_QUERY_STRING_PARAMETER_NAME = "bx24_request_id";
const DEFAULT_QUERY_STRING_SDK_PARAMETER_NAME = "bx24_sdk_ver";
class DefaultRequestIdGenerator {
  getQueryStringParameterName() {
    return DEFAULT_QUERY_STRING_PARAMETER_NAME;
  }
  getQueryStringSdkParameterName() {
    return DEFAULT_QUERY_STRING_SDK_PARAMETER_NAME;
  }
  generate() {
    return Text.getUuidRfc4122();
  }
  getRequestId() {
    return this.generate();
  }
  getHeaderFieldName() {
    return DEFAULT_REQUEST_ID_HEADER_FIELD_NAME;
  }
}

class Http {
  #clientAxios;
  #authActions;
  #restrictionManager;
  #requestIdGenerator;
  _logger = null;
  _loggerSystem = null;
  #logTag = "";
  #isClientSideWarning = false;
  #clientSideWarningMessage = "";
  constructor(baseURL, authActions, options) {
    this.#clientAxios = axios.create({
      baseURL,
      ...options
    });
    this.#authActions = authActions;
    this.#restrictionManager = new RestrictionManager();
    this.#requestIdGenerator = new DefaultRequestIdGenerator();
  }
  // region Logger ////
  setLogger(logger) {
    this._logger = logger;
    this.#restrictionManager.setLogger(this.getLogger());
  }
  getLogger() {
    if (null === this._logger) {
      this._logger = LoggerBrowser.build(`NullLogger`);
      this._logger.setConfig({
        [LoggerType.desktop]: false,
        [LoggerType.log]: false,
        [LoggerType.info]: false,
        [LoggerType.warn]: false,
        [LoggerType.error]: true,
        [LoggerType.trace]: false
      });
    }
    return this._logger;
  }
  getSystemLogger() {
    if (null === this._loggerSystem) {
      this._loggerSystem = LoggerBrowser.build(`SystemLogger`);
      this._loggerSystem.setConfig({
        [LoggerType.desktop]: false,
        [LoggerType.log]: false,
        [LoggerType.info]: true,
        [LoggerType.warn]: true,
        [LoggerType.error]: true,
        [LoggerType.trace]: false
      });
    }
    return this._loggerSystem;
  }
  // endregion ////
  // region RestrictionManager ////
  setRestrictionManagerParams(params) {
    this.#restrictionManager.params = params;
  }
  getRestrictionManagerParams() {
    return this.#restrictionManager.params;
  }
  // endregion ////
  // region LogTag ////
  setLogTag(logTag) {
    this.#logTag = logTag;
  }
  clearLogTag() {
    this.#logTag = "";
  }
  // endregion ////
  // region Actions Call ////
  async batch(calls, isHaltOnError = true) {
    const isArrayMode = Array.isArray(calls);
    const cmd = isArrayMode ? [] : {};
    let cnt = 0;
    const processRow = (row, index) => {
      let method = null;
      let params = null;
      if (Array.isArray(row)) {
        method = row[0];
        params = row[1];
      } else if (row.method) {
        method = row.method;
        params = row.params;
      }
      if (method) {
        cnt++;
        const data = method + "?" + qs.stringify(params);
        if (isArrayMode || Array.isArray(cmd)) {
          cmd.push(data);
        } else {
          cmd[index] = data;
        }
      }
    };
    if (isArrayMode) {
      for (const [index, item] of calls.entries()) processRow(item, index);
    } else {
      for (const [index, item] of Object.entries(calls)) processRow(item, index);
    }
    if (cnt < 1) {
      return Promise.resolve(new Result());
    }
    return this.call("batch", {
      halt: isHaltOnError ? 1 : 0,
      cmd
    }).then((response) => {
      const responseResult = response.getData().result;
      const results = isArrayMode ? [] : {};
      const processResponse = (row, index) => {
        if (
          // @ts-ignore
          typeof responseResult.result[index] !== "undefined" || // @ts-ignore
          typeof responseResult.result_error[index] !== "undefined"
        ) {
          const q = row.split("?");
          const data = new AjaxResult(
            {
              // @ts-ignore
              result: Type.isUndefined(responseResult.result[index]) ? (
                // @ts-ignore
                {}
              ) : (
                // @ts-ignore
                responseResult.result[index]
              ),
              // @ts-ignore
              error: responseResult?.result_error[index] || void 0,
              // @ts-ignore
              total: responseResult.result_total[index],
              // @ts-ignore
              next: responseResult.result_next[index]
            },
            {
              method: q[0] || "",
              params: qs.parse(q[1] || ""),
              start: 0
            },
            response.getStatus()
          );
          if (isArrayMode || Array.isArray(results)) {
            results.push(data);
          } else {
            results[index] = data;
          }
        }
      };
      if (Array.isArray(cmd)) {
        for (const [index, item] of cmd.entries()) processResponse(item, index);
      } else {
        for (const [index, item] of Object.entries(cmd))
          processResponse(item, index);
      }
      let dataResult;
      const initError = (result2) => {
        return new AjaxError({
          status: 0,
          answerError: {
            error: result2.getErrorMessages().join("; "),
            errorDescription: `batch ${result2.getQuery().method}: ${qs.stringify(result2.getQuery().params, { encode: false })}`
          },
          cause: result2.getErrors().next().value
        });
      };
      const result = new Result();
      if (isArrayMode || Array.isArray(results)) {
        dataResult = [];
        for (const data of results) {
          if (data.getStatus() !== 200 || !data.isSuccess) {
            const error = initError(data);
            if (!isHaltOnError && !data.isSuccess) {
              result.addError(error);
              continue;
            }
            return Promise.reject(error);
          }
          dataResult.push(data.getData().result);
        }
      } else {
        dataResult = {};
        for (const key of Object.keys(results)) {
          const data = results[key];
          if (data.getStatus() !== 200 || !data.isSuccess) {
            const error = initError(data);
            if (!isHaltOnError && !data.isSuccess) {
              result.addError(error);
              continue;
            }
            return Promise.reject(error);
          }
          dataResult[key] = data.getData().result;
        }
      }
      result.setData(dataResult);
      return Promise.resolve(result);
    });
  }
  /**
   * Calling the RestApi function
   *
   * If we get a problem with authorization, we make one attempt to update the access token
   *
   * @param method
   * @param params
   * @param start
   */
  async call(method, params, start = 0) {
    let authData = this.#authActions.getAuthData();
    if (authData === false) {
      authData = await this.#authActions.refreshAuth();
    }
    await this.#restrictionManager.check();
    if (this.#isClientSideWarning && !this.isServerSide() && Type.isStringFilled(this.#clientSideWarningMessage)) {
      this.getSystemLogger().warn(this.#clientSideWarningMessage);
    }
    return this.#clientAxios.post(
      this.#prepareMethod(method),
      this.#prepareParams(authData, params, start)
    ).then(
      (response) => {
        const payload = response.data;
        return Promise.resolve({
          status: response.status,
          payload
        });
      },
      async (error_) => {
        let answerError = {
          error: error_?.code || 0,
          errorDescription: error_?.message || ""
        };
        if (error_ instanceof AxiosError && error_.response && error_.response.data && !Type.isUndefined(error_.response.data.error)) {
          const response = error_.response.data;
          answerError = {
            error: response.error,
            errorDescription: response.error_description
          };
        }
        const problemError = new AjaxError({
          status: error_.response?.status || 0,
          answerError,
          cause: error_
        });
        if (problemError.status === 401 && ["expired_token", "invalid_token"].includes(
          problemError.answerError.error
        )) {
          this.getLogger().info(
            `refreshAuth >> ${problemError.answerError.error} >>>`
          );
          authData = await this.#authActions.refreshAuth();
          await this.#restrictionManager.check();
          return this.#clientAxios.post(
            this.#prepareMethod(method),
            this.#prepareParams(authData, params, start)
          ).then(
            async (response) => {
              const payload = response.data;
              return Promise.resolve({
                status: response.status,
                payload
              });
            },
            async (error__) => {
              let answerError2 = {
                error: error__?.code || 0,
                errorDescription: error__?.message || ""
              };
              if (error__ instanceof AxiosError && error__.response && error__.response.data) {
                const response = error__.response.data;
                answerError2 = {
                  error: response.error,
                  errorDescription: response.error_description
                };
              }
              const problemError2 = new AjaxError({
                status: error__.response?.status || 0,
                answerError: answerError2,
                cause: error__
              });
              return Promise.reject(problemError2);
            }
          );
        }
        return Promise.reject(problemError);
      }
    ).then((response) => {
      const result = new AjaxResult(
        response.payload,
        {
          method,
          params,
          start
        },
        response.status
      );
      return Promise.resolve(result);
    });
  }
  // endregion ////
  // region Prepare ////
  /**
   * Processes function parameters and adds authorization
   *
   * @param authData
   * @param params
   * @param start
   *
   * @private
   */
  #prepareParams(authData, params, start = 0) {
    const result = Object.assign({}, params);
    if (this.#logTag.length > 0) {
      result.logTag = this.#logTag;
    }
    result[this.#requestIdGenerator.getQueryStringParameterName()] = this.#requestIdGenerator.getRequestId();
    result[this.#requestIdGenerator.getQueryStringSdkParameterName()] = "0.1.6";
    if (!!result.data && !!result.data.start) {
      delete result.data.start;
    }
    if (authData.refresh_token !== "hook") {
      result.auth = authData.access_token;
    }
    result.start = start;
    return result;
  }
  /**
   * Makes the function name safe and adds JSON format
   *
   * @param method
   * @private
   */
  #prepareMethod(method) {
    return `${encodeURIComponent(method)}.json`;
  }
  /**
   * @inheritDoc
   */
  setClientSideWarning(value, message) {
    this.#isClientSideWarning = value;
    this.#clientSideWarningMessage = message;
  }
  // endregion ////
  // region Tools ////
  /**
   * Tests whether the code is executed on the client side
   * @return {boolean}
   * @protected
   */
  isServerSide() {
    return typeof window === "undefined";
  }
  // endregion ////
}

class AbstractB24 {
  static batchSize = 50;
  _isInit = false;
  _http = null;
  _logger = null;
  // region Init ////
  constructor() {
    this._isInit = false;
  }
  /**
   * @inheritDoc
   */
  get isInit() {
    return this._isInit;
  }
  async init() {
    this._isInit = true;
    return;
  }
  destroy() {
  }
  setLogger(logger) {
    this._logger = logger;
    this.getHttpClient().setLogger(this.getLogger());
  }
  getLogger() {
    if (null === this._logger) {
      this._logger = LoggerBrowser.build(`NullLogger`);
      this._logger.setConfig({
        [LoggerType.desktop]: false,
        [LoggerType.log]: false,
        [LoggerType.info]: false,
        [LoggerType.warn]: false,
        [LoggerType.error]: true,
        [LoggerType.trace]: false
      });
    }
    return this._logger;
  }
  /**
   * @inheritDoc
   */
  callMethod(method, params, start) {
    return this.getHttpClient().call(method, params || {}, start || 0);
  }
  /**
   * @inheritDoc
   */
  async callListMethod(method, params = {}, progress = null, customKeyForResult = null) {
    const result = new Result();
    if (Type.isFunction(progress) && null !== progress) {
      progress(0);
    }
    return this.callMethod(method, params, 0).then(async (response) => {
      let list = [];
      let resultData;
      if (null === customKeyForResult) {
        resultData = response.getData().result;
      } else {
        resultData = response.getData().result[customKeyForResult];
      }
      list = [...list, ...resultData];
      if (response.isMore()) {
        let responseLoop = response;
        while (true) {
          responseLoop = await responseLoop.getNext(this.getHttpClient());
          if (responseLoop === false) {
            break;
          }
          let resultData2 = void 0;
          if (null === customKeyForResult) {
            resultData2 = responseLoop.getData().result;
          } else {
            resultData2 = responseLoop.getData().result[customKeyForResult];
          }
          list = [...list, ...resultData2];
          if (progress) {
            const total = responseLoop.getTotal();
            progress(total > 0 ? Math.round(100 * list.length / total) : 100);
          }
        }
      }
      result.setData(list);
      if (progress) {
        progress(100);
      }
      return result;
    });
  }
  /**
   * @inheritDoc
   */
  async *fetchListMethod(method, params = {}, idKey = "ID", customKeyForResult = null) {
    params.order = params.order || {};
    params.filter = params.filter || {};
    params.start = -1;
    const moreIdKey = `>${idKey}`;
    params.order[idKey] = "ASC";
    params.filter[moreIdKey] = 0;
    do {
      const result = await this.callMethod(method, params, params.start);
      let data = void 0;
      if (!Type.isNull(customKeyForResult) && null !== customKeyForResult) {
        data = result.getData().result[customKeyForResult];
      } else {
        data = result.getData().result;
      }
      if (data.length === 0) {
        break;
      }
      yield data;
      if (data.length < AbstractB24.batchSize) {
        break;
      }
      const value = data.at(-1);
      if (value && idKey in value) {
        params.filter[moreIdKey] = value[idKey];
      }
    } while (true);
  }
  /**
   * @inheritDoc
   */
  async callBatch(calls, isHaltOnError = true) {
    return this.getHttpClient().batch(calls, isHaltOnError);
  }
  chunkArray(array, chunkSize = 50) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      result.push(chunk);
    }
    return result;
  }
  /**
   * @inheritDoc
   */
  async callBatchByChunk(calls, isHaltOnError = true) {
    const result = new Result();
    const data = [];
    const chunks = this.chunkArray(calls, AbstractB24.batchSize);
    for (const chunkRequest of chunks) {
      const response = await this.callBatch(chunkRequest, isHaltOnError);
      data.push(...response.getData());
    }
    return result.setData(data);
  }
  // endregion ////
  // region Tools ////
  /**
   * @inheritDoc
   */
  getHttpClient() {
    if (!this.isInit || null === this._http) {
      throw new Error(`Http not init`);
    }
    return this._http;
  }
  /**
   * Returns settings for http connection
   * @protected
   */
  _getHttpOptions() {
    return null;
  }
  /**
   * Generates an object not initialized error
   * @protected
   */
  _ensureInitialized() {
    if (!this._isInit) {
      throw new Error("B24 not initialized");
    }
  }
  // endregion ////
}

var B24LangList = /* @__PURE__ */ ((B24LangList2) => {
  B24LangList2["en"] = "en";
  B24LangList2["de"] = "de";
  B24LangList2["la"] = "la";
  B24LangList2["br"] = "br";
  B24LangList2["fr"] = "fr";
  B24LangList2["it"] = "it";
  B24LangList2["pl"] = "pl";
  B24LangList2["ru"] = "ru";
  B24LangList2["ua"] = "ua";
  B24LangList2["tr"] = "tr";
  B24LangList2["sc"] = "sc";
  B24LangList2["tc"] = "tc";
  B24LangList2["ja"] = "ja";
  B24LangList2["vn"] = "vn";
  B24LangList2["id"] = "id";
  B24LangList2["ms"] = "ms";
  B24LangList2["th"] = "th";
  B24LangList2["ar"] = "ar";
  return B24LangList2;
})(B24LangList || {});

const useScrollSize = () => {
  return {
    scrollWidth: Math.max(
      document.documentElement.scrollWidth,
      document.documentElement.offsetWidth
    ),
    scrollHeight: Math.max(
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    )
  };
};

class FormatterNumbers {
  static isInternalConstructing = false;
  static instance = null;
  _defLocale = null;
  constructor() {
    if (!FormatterNumbers.isInternalConstructing) {
      throw new TypeError("FormatterNumber is not constructable");
    }
    FormatterNumbers.isInternalConstructing = false;
  }
  /**
   * @return FormatterNumbers
   */
  static getInstance() {
    if (!FormatterNumbers.instance) {
      FormatterNumbers.isInternalConstructing = true;
      FormatterNumbers.instance = new FormatterNumbers();
    }
    return FormatterNumbers.instance;
  }
  setDefLocale(locale) {
    this._defLocale = locale;
  }
  format(value, locale) {
    let formatter;
    if (typeof locale === "undefined" || !Type.isStringFilled(locale)) {
      locale = Type.isStringFilled(this._defLocale) ? this._defLocale || "en" : typeof navigator === "undefined" ? "en" : navigator?.language || "en";
    }
    if (Number.isInteger(value)) {
      formatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    } else {
      formatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    let result = formatter.format(value);
    if (locale.includes("ru")) {
      result = result.replace(",", ".");
    }
    return result;
  }
}

class IbanSpecification {
  /**
   * the code of the country
   */
  countryCode;
  /**
   * the length of the IBAN
   */
  length;
  /**
   * the structure of the underlying BBAN (for validation and formatting)
   */
  structure;
  /**
   * an example valid IBAN
   */
  example;
  _cachedRegex = null;
  constructor(countryCode, length, structure, example) {
    this.countryCode = countryCode;
    this.length = length;
    this.structure = structure;
    this.example = example;
  }
  /**
   * Check if the passed iban is valid, according to this specification.
   *
   * @param {String} iban the iban to validate
   * @returns {boolean} true if valid, false otherwise
   */
  isValid(iban) {
    return this.length === iban.length && this.countryCode === iban.slice(0, 2) && this._regex().test(iban.slice(4)) && this._iso7064Mod9710(this._iso13616Prepare(iban)) == 1;
  }
  /**
   * Convert the passed IBAN to a country-specific BBAN.
   *
   * @param iban the IBAN to convert
   * @param separator the separator to use between BBAN blocks
   * @returns {string} the BBAN
   */
  toBBAN(iban, separator) {
    return (this._regex().exec(iban.slice(4) || "") || []).slice(1).join(separator);
  }
  /**
   * Convert the passed BBAN to an IBAN for this country specification.
   * Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
   * This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
   *
   * @param bban the BBAN to convert to IBAN
   * @returns {string} the IBAN
   */
  fromBBAN(bban) {
    if (!this.isValidBBAN(bban)) {
      throw new Error("Invalid BBAN");
    }
    const remainder = this._iso7064Mod9710(
      this._iso13616Prepare(this.countryCode + "00" + bban)
    );
    const checkDigit = ("0" + (98 - remainder)).slice(-2);
    return this.countryCode + checkDigit + bban;
  }
  /**
   * Check of the passed BBAN is valid.
   * This function only checks the format of the BBAN (length and compliance with alphanumeric specifications) but does not
   * verify the check digit.
   *
   * @param bban the BBAN to validate
   * @returns {boolean} true if the passed bban is a valid BBAN, according to this specification, false otherwise
   */
  isValidBBAN(bban) {
    return this.length - 4 === bban.length && this._regex().test(bban);
  }
  /**
   * Lazy-loaded regex (parse the structure and construct the regular expression the first time we need it for validation)
   */
  _regex() {
    if (null === this._cachedRegex) {
      this._cachedRegex = this._parseStructure(this.structure);
    }
    return this._cachedRegex;
  }
  /**
   * Parse the BBAN structure used to configure each IBAN Specification and returns a matching regular expression.
   * A structure is composed of blocks of three characters (one letter and two digits).
   * Each block represents
   * a logical group in the typical representation of the BBAN.
   * For each group, the letter indicates which characters
   * are allowed in this group, and the following 2-digits number tells the length of the group.
   *
   * @param {string} structure the structure to parse
   * @returns {RegExp}
   */
  _parseStructure(structure) {
    const regex = (structure.match(/(.{3})/g) || []).map(
      (block) => {
        let format;
        const pattern = block.slice(0, 1);
        const repeats = Number.parseInt(block.slice(1), 10);
        switch (pattern) {
          case "A":
            format = "0-9A-Za-z";
            break;
          case "B":
            format = "0-9A-Z";
            break;
          case "C":
            format = "A-Za-z";
            break;
          case "F":
            format = "0-9";
            break;
          case "L":
            format = "a-z";
            break;
          case "U":
            format = "A-Z";
            break;
          case "W":
            format = "0-9a-z";
            break;
        }
        return "([" + format + "]{" + repeats + "})";
      }
    );
    return new RegExp("^" + regex.join("") + "$");
  }
  /**
   * Prepare an IBAN for mod 97 computation by moving the first 4 chars to the end and transforming the letters to
   * numbers (A = 10, B = 11, ..., Z = 35), as specified in ISO13616.
   *
   * @param {string} iban the IBAN
   * @returns {string} the prepared IBAN
   */
  _iso13616Prepare(iban) {
    const A = "A".charCodeAt(0);
    const Z = "Z".charCodeAt(0);
    iban = iban.toUpperCase();
    iban = iban.substring(4) + iban.substring(0, 4);
    return iban.split("").map((n) => {
      const code = n.charCodeAt(0);
      if (code >= A && code <= Z) {
        return (code - A + 10).toString();
      } else {
        return n;
      }
    }).join("");
  }
  /**
   * Calculates MOD 97 10 of the passed IBAN as specified in ISO7064.
   *
   * @param iban
   * @returns {number}
   */
  _iso7064Mod9710(iban) {
    let remainder = iban;
    let block;
    while (remainder.length > 2) {
      block = remainder.slice(0, 9);
      remainder = Number.parseInt(block, 10) % 97 + remainder.slice(block.length);
    }
    return Number.parseInt(remainder, 10) % 97;
  }
}
class FormatterIban {
  static isInternalConstructing = false;
  static instance = null;
  _countries;
  // region Init ////
  constructor() {
    if (!FormatterIban.isInternalConstructing) {
      throw new TypeError("FormatterIban is not constructable");
    }
    FormatterIban.isInternalConstructing = false;
    this._countries = /* @__PURE__ */ new Map();
  }
  /**
   * @return FormatterIban
   */
  static getInstance() {
    if (!FormatterIban.instance) {
      FormatterIban.isInternalConstructing = true;
      FormatterIban.instance = new FormatterIban();
    }
    return FormatterIban.instance;
  }
  addSpecification(IBAN) {
    this._countries.set(IBAN.countryCode, IBAN);
  }
  // endregion ////
  // region IBAN ////
  /**
   * Check if an IBAN is valid.
   *
   * @param {String} iban the IBAN to validate.
   * @returns {boolean} true if the passed IBAN is valid, false otherwise
   */
  isValid(iban) {
    if (!this._isString(iban)) {
      return false;
    }
    iban = this.electronicFormat(iban);
    const countryCode = iban.slice(0, 2);
    if (!this._countries.has(countryCode)) {
      throw new Error(`No country with code ${countryCode}`);
    }
    const countryStructure = this._countries.get(countryCode);
    return !!countryStructure && countryStructure.isValid(iban);
  }
  printFormat(iban, separator) {
    if (typeof separator == "undefined") {
      separator = " ";
    }
    const EVERY_FOUR_CHARS = /(.{4})(?!$)/g;
    return this.electronicFormat(iban).replace(
      EVERY_FOUR_CHARS,
      "$1" + separator
    );
  }
  electronicFormat(iban) {
    const NON_ALPHANUM = /[^a-zA-Z0-9]/g;
    return iban.replace(NON_ALPHANUM, "").toUpperCase();
  }
  // endregion ////
  // region BBAN ////
  /**
   * Convert an IBAN to a BBAN.
   *
   * @param iban
   * @param {String} [separator] the separator to use between the blocks of the BBAN, defaults to ' '
   * @returns {string|*}
   */
  toBBAN(iban, separator) {
    if (typeof separator == "undefined") {
      separator = " ";
    }
    iban = this.electronicFormat(iban);
    const countryCode = iban.slice(0, 2);
    if (!this._countries.has(countryCode)) {
      throw new Error(`No country with code ${countryCode}`);
    }
    const countryStructure = this._countries.get(countryCode);
    if (!countryStructure) {
      throw new Error(`No country with code ${countryCode}`);
    }
    return countryStructure.toBBAN(iban, separator);
  }
  /**
   * Convert the passed BBAN to an IBAN for this country specification.
   * Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
   * This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
   *
   * @param countryCode the country of the BBAN
   * @param bban the BBAN to convert to IBAN
   * @returns {string} the IBAN
   */
  fromBBAN(countryCode, bban) {
    if (!this._countries.has(countryCode)) {
      throw new Error(`No country with code ${countryCode}`);
    }
    const countryStructure = this._countries.get(countryCode);
    if (!countryStructure) {
      throw new Error(`No country with code ${countryCode}`);
    }
    return countryStructure.fromBBAN(this.electronicFormat(bban));
  }
  /**
   * Check the validity of the passed BBAN.
   *
   * @param countryCode the country of the BBAN
   * @param bban the BBAN to check the validity of
   */
  isValidBBAN(countryCode, bban) {
    if (!this._isString(bban)) {
      return false;
    }
    if (!this._countries.has(countryCode)) {
      throw new Error(`No country with code ${countryCode}`);
    }
    const countryStructure = this._countries.get(countryCode);
    return !!countryStructure && countryStructure.isValidBBAN(this.electronicFormat(bban));
  }
  // endregion ////
  // region Tools ////
  _isString(value) {
    return typeof value == "string" || value instanceof String;
  }
  // endregion ////
}

const useFormatter = () => {
  const formatterNumber = FormatterNumbers.getInstance();
  const formatterIban = FormatterIban.getInstance();
  formatterIban.addSpecification(
    new IbanSpecification("AD", 24, "F04F04A12", "AD1200012030200359100100")
  );
  formatterIban.addSpecification(
    new IbanSpecification("AE", 23, "F03F16", "AE070331234567890123456")
  );
  formatterIban.addSpecification(
    new IbanSpecification("AL", 28, "F08A16", "AL47212110090000000235698741")
  );
  formatterIban.addSpecification(
    new IbanSpecification("AT", 20, "F05F11", "AT611904300234573201")
  );
  formatterIban.addSpecification(
    new IbanSpecification("AZ", 28, "U04A20", "AZ21NABZ00000000137010001944")
  );
  formatterIban.addSpecification(
    new IbanSpecification("BA", 20, "F03F03F08F02", "BA391290079401028494")
  );
  formatterIban.addSpecification(
    new IbanSpecification("BE", 16, "F03F07F02", "BE68539007547034")
  );
  formatterIban.addSpecification(
    new IbanSpecification("BG", 22, "U04F04F02A08", "BG80BNBG96611020345678")
  );
  formatterIban.addSpecification(
    new IbanSpecification("BH", 22, "U04A14", "BH67BMAG00001299123456")
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "BR",
      29,
      "F08F05F10U01A01",
      "BR9700360305000010009795493P1"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification("BY", 28, "A04F04A16", "BY13NBRB3600900000002Z00AB00")
  );
  formatterIban.addSpecification(
    new IbanSpecification("CH", 21, "F05A12", "CH9300762011623852957")
  );
  formatterIban.addSpecification(
    new IbanSpecification("CR", 22, "F04F14", "CR72012300000171549015")
  );
  formatterIban.addSpecification(
    new IbanSpecification("CY", 28, "F03F05A16", "CY17002001280000001200527600")
  );
  formatterIban.addSpecification(
    new IbanSpecification("CZ", 24, "F04F06F10", "CZ6508000000192000145399")
  );
  formatterIban.addSpecification(
    new IbanSpecification("DE", 22, "F08F10", "DE89370400440532013000")
  );
  formatterIban.addSpecification(
    new IbanSpecification("DK", 18, "F04F09F01", "DK5000400440116243")
  );
  formatterIban.addSpecification(
    new IbanSpecification("DO", 28, "U04F20", "DO28BAGR00000001212453611324")
  );
  formatterIban.addSpecification(
    new IbanSpecification("EE", 20, "F02F02F11F01", "EE382200221020145685")
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "EG",
      29,
      "F04F04F17",
      "EG800002000156789012345180002"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "ES",
      24,
      "F04F04F01F01F10",
      "ES9121000418450200051332"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification("FI", 18, "F06F07F01", "FI2112345600000785")
  );
  formatterIban.addSpecification(
    new IbanSpecification("FO", 18, "F04F09F01", "FO6264600001631634")
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "FR",
      27,
      "F05F05A11F02",
      "FR1420041010050500013M02606"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification("GB", 22, "U04F06F08", "GB29NWBK60161331926819")
  );
  formatterIban.addSpecification(
    new IbanSpecification("GE", 22, "U02F16", "GE29NB0000000101904917")
  );
  formatterIban.addSpecification(
    new IbanSpecification("GI", 23, "U04A15", "GI75NWBK000000007099453")
  );
  formatterIban.addSpecification(
    new IbanSpecification("GL", 18, "F04F09F01", "GL8964710001000206")
  );
  formatterIban.addSpecification(
    new IbanSpecification("GR", 27, "F03F04A16", "GR1601101250000000012300695")
  );
  formatterIban.addSpecification(
    new IbanSpecification("GT", 28, "A04A20", "GT82TRAJ01020000001210029690")
  );
  formatterIban.addSpecification(
    new IbanSpecification("HR", 21, "F07F10", "HR1210010051863000160")
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "HU",
      28,
      "F03F04F01F15F01",
      "HU42117730161111101800000000"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification("IE", 22, "U04F06F08", "IE29AIBK93115212345678")
  );
  formatterIban.addSpecification(
    new IbanSpecification("IL", 23, "F03F03F13", "IL620108000000099999999")
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "IS",
      26,
      "F04F02F06F10",
      "IS140159260076545510730339"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "IT",
      27,
      "U01F05F05A12",
      "IT60X0542811101000000123456"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification("IQ", 23, "U04F03A12", "IQ98NBIQ850123456789012")
  );
  formatterIban.addSpecification(
    new IbanSpecification("JO", 30, "A04F22", "JO15AAAA1234567890123456789012")
  );
  formatterIban.addSpecification(
    new IbanSpecification("KW", 30, "U04A22", "KW81CBKU0000000000001234560101")
  );
  formatterIban.addSpecification(
    new IbanSpecification("KZ", 20, "F03A13", "KZ86125KZT5004100100")
  );
  formatterIban.addSpecification(
    new IbanSpecification("LB", 28, "F04A20", "LB62099900000001001901229114")
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "LC",
      32,
      "U04F24",
      "LC07HEMM000100010012001200013015"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification("LI", 21, "F05A12", "LI21088100002324013AA")
  );
  formatterIban.addSpecification(
    new IbanSpecification("LT", 20, "F05F11", "LT121000011101001000")
  );
  formatterIban.addSpecification(
    new IbanSpecification("LU", 20, "F03A13", "LU280019400644750000")
  );
  formatterIban.addSpecification(
    new IbanSpecification("LV", 21, "U04A13", "LV80BANK0000435195001")
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "MC",
      27,
      "F05F05A11F02",
      "MC5811222000010123456789030"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification("MD", 24, "U02A18", "MD24AG000225100013104168")
  );
  formatterIban.addSpecification(
    new IbanSpecification("ME", 22, "F03F13F02", "ME25505000012345678951")
  );
  formatterIban.addSpecification(
    new IbanSpecification("MK", 19, "F03A10F02", "MK07250120000058984")
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "MR",
      27,
      "F05F05F11F02",
      "MR1300020001010000123456753"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "MT",
      31,
      "U04F05A18",
      "MT84MALT011000012345MTLCAST001S"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "MU",
      30,
      "U04F02F02F12F03U03",
      "MU17BOMM0101101030300200000MUR"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification("NL", 18, "U04F10", "NL91ABNA0417164300")
  );
  formatterIban.addSpecification(
    new IbanSpecification("NO", 15, "F04F06F01", "NO9386011117947")
  );
  formatterIban.addSpecification(
    new IbanSpecification("PK", 24, "U04A16", "PK36SCBL0000001123456702")
  );
  formatterIban.addSpecification(
    new IbanSpecification("PL", 28, "F08F16", "PL61109010140000071219812874")
  );
  formatterIban.addSpecification(
    new IbanSpecification("PS", 29, "U04A21", "PS92PALS000000000400123456702")
  );
  formatterIban.addSpecification(
    new IbanSpecification("PT", 25, "F04F04F11F02", "PT50000201231234567890154")
  );
  formatterIban.addSpecification(
    new IbanSpecification("QA", 29, "U04A21", "QA30AAAA123456789012345678901")
  );
  formatterIban.addSpecification(
    new IbanSpecification("RO", 24, "U04A16", "RO49AAAA1B31007593840000")
  );
  formatterIban.addSpecification(
    new IbanSpecification("RS", 22, "F03F13F02", "RS35260005601001611379")
  );
  formatterIban.addSpecification(
    new IbanSpecification("SA", 24, "F02A18", "SA0380000000608010167519")
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "SC",
      31,
      "U04F04F16U03",
      "SC18SSCB11010000000000001497USD"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification("SE", 24, "F03F16F01", "SE4550000000058398257466")
  );
  formatterIban.addSpecification(
    new IbanSpecification("SI", 19, "F05F08F02", "SI56263300012039086")
  );
  formatterIban.addSpecification(
    new IbanSpecification("SK", 24, "F04F06F10", "SK3112000000198742637541")
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "SM",
      27,
      "U01F05F05A12",
      "SM86U0322509800000000270100"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification("ST", 25, "F08F11F02", "ST68000100010051845310112")
  );
  formatterIban.addSpecification(
    new IbanSpecification("SV", 28, "U04F20", "SV62CENR00000000000000700025")
  );
  formatterIban.addSpecification(
    new IbanSpecification("TL", 23, "F03F14F02", "TL380080012345678910157")
  );
  formatterIban.addSpecification(
    new IbanSpecification("TN", 24, "F02F03F13F02", "TN5910006035183598478831")
  );
  formatterIban.addSpecification(
    new IbanSpecification("TR", 26, "F05F01A16", "TR330006100519786457841326")
  );
  formatterIban.addSpecification(
    new IbanSpecification("UA", 29, "F25", "UA511234567890123456789012345")
  );
  formatterIban.addSpecification(
    new IbanSpecification("VA", 22, "F18", "VA59001123000012345678")
  );
  formatterIban.addSpecification(
    new IbanSpecification("VG", 24, "U04F16", "VG96VPVG0000012345678901")
  );
  formatterIban.addSpecification(
    new IbanSpecification("XK", 20, "F04F10F02", "XK051212012345678906")
  );
  formatterIban.addSpecification(
    new IbanSpecification("AO", 25, "F21", "AO69123456789012345678901")
  );
  formatterIban.addSpecification(
    new IbanSpecification("BF", 27, "F23", "BF2312345678901234567890123")
  );
  formatterIban.addSpecification(
    new IbanSpecification("BI", 16, "F12", "BI41123456789012")
  );
  formatterIban.addSpecification(
    new IbanSpecification("BJ", 28, "F24", "BJ39123456789012345678901234")
  );
  formatterIban.addSpecification(
    new IbanSpecification("CI", 28, "U02F22", "CI70CI1234567890123456789012")
  );
  formatterIban.addSpecification(
    new IbanSpecification("CM", 27, "F23", "CM9012345678901234567890123")
  );
  formatterIban.addSpecification(
    new IbanSpecification("CV", 25, "F21", "CV30123456789012345678901")
  );
  formatterIban.addSpecification(
    new IbanSpecification("DZ", 24, "F20", "DZ8612345678901234567890")
  );
  formatterIban.addSpecification(
    new IbanSpecification("IR", 26, "F22", "IR861234568790123456789012")
  );
  formatterIban.addSpecification(
    new IbanSpecification("MG", 27, "F23", "MG1812345678901234567890123")
  );
  formatterIban.addSpecification(
    new IbanSpecification("ML", 28, "U01F23", "ML15A12345678901234567890123")
  );
  formatterIban.addSpecification(
    new IbanSpecification("MZ", 25, "F21", "MZ25123456789012345678901")
  );
  formatterIban.addSpecification(
    new IbanSpecification("SN", 28, "U01F23", "SN52A12345678901234567890123")
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "GF",
      27,
      "F05F05A11F02",
      "GF121234512345123456789AB13"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "GP",
      27,
      "F05F05A11F02",
      "GP791234512345123456789AB13"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "MQ",
      27,
      "F05F05A11F02",
      "MQ221234512345123456789AB13"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "RE",
      27,
      "F05F05A11F02",
      "RE131234512345123456789AB13"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "PF",
      27,
      "F05F05A11F02",
      "PF281234512345123456789AB13"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "TF",
      27,
      "F05F05A11F02",
      "TF891234512345123456789AB13"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "YT",
      27,
      "F05F05A11F02",
      "YT021234512345123456789AB13"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "NC",
      27,
      "F05F05A11F02",
      "NC551234512345123456789AB13"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "BL",
      27,
      "F05F05A11F02",
      "BL391234512345123456789AB13"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "MF",
      27,
      "F05F05A11F02",
      "MF551234512345123456789AB13"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "PM",
      27,
      "F05F05A11F02",
      "PM071234512345123456789AB13"
    )
  );
  formatterIban.addSpecification(
    new IbanSpecification(
      "WF",
      27,
      "F05F05A11F02",
      "WF621234512345123456789AB13"
    )
  );
  return {
    formatterNumber,
    formatterIban
  };
};

class AuthHookManager {
  #b24HookParams;
  constructor(b24HookParams) {
    this.#b24HookParams = Object.freeze(Object.assign({}, b24HookParams));
  }
  /**
   * @see Http.#prepareParams
   */
  getAuthData() {
    const domain = this.#b24HookParams.b24Url.replaceAll("https://", "").replaceAll("http://", "").replace(/:(80|443)$/, "");
    return {
      access_token: this.#b24HookParams.secret,
      refresh_token: "hook",
      expires_in: 0,
      domain,
      member_id: domain
    };
  }
  refreshAuth() {
    return Promise.resolve(this.getAuthData());
  }
  getUniq(prefix) {
    const authData = this.getAuthData();
    if (authData === false) {
      throw new Error("AuthData not init");
    }
    return [prefix, authData.member_id].join("_");
  }
  /**
   * Get the account address BX24 ( https://name.bitrix24.com )
   */
  getTargetOrigin() {
    return `${this.#b24HookParams.b24Url}`;
  }
  /**
   * Get the account address BX24 with Path ( https://name.bitrix24.com/rest/1/xxxxx )
   */
  getTargetOriginWithPath() {
    return `${this.#b24HookParams.b24Url}/rest/${this.#b24HookParams.userId}/${this.#b24HookParams.secret}`;
  }
  /**
   * We believe that hooks are created only by the admin
   */
  get isAdmin() {
    return true;
  }
}

class B24Hook extends AbstractB24 {
  #authHookManager;
  // region Init ////
  constructor(b24HookParams) {
    super();
    this.#authHookManager = new AuthHookManager(b24HookParams);
    this._http = new Http(
      this.#authHookManager.getTargetOriginWithPath(),
      this.#authHookManager,
      this._getHttpOptions()
    );
    this._http.setClientSideWarning(
      true,
      "It is not safe to use hook requests on the client side"
    );
    this._isInit = true;
  }
  setLogger(logger) {
    super.setLogger(logger);
  }
  // endregion ////
  get auth() {
    return this.#authHookManager;
  }
  // region Core ////
  /**
   * Disables warning about client-side query execution
   */
  offClientSideWarning() {
    this.getHttpClient().setClientSideWarning(false, "");
  }
  // endregion ////
  // region Get ////
  /**
   * Get the account address BX24 ( https://name.bitrix24.com )
   */
  getTargetOrigin() {
    this._ensureInitialized();
    return this.#authHookManager.getTargetOrigin();
  }
  /**
   * Get the account address BX24 with Path ( https://name.bitrix24.com/rest/1/xxxxx )
   */
  getTargetOriginWithPath() {
    this._ensureInitialized();
    return this.#authHookManager.getTargetOriginWithPath();
  }
  // endregion ////
  // region Tools ////
  // endregion ////
}

var MessageCommands = /* @__PURE__ */ ((MessageCommands2) => {
  MessageCommands2["getInitData"] = "getInitData";
  MessageCommands2["setInstallFinish"] = "setInstallFinish";
  MessageCommands2["setInstall"] = "setInstall";
  MessageCommands2["refreshAuth"] = "refreshAuth";
  MessageCommands2["setAppOption"] = "setAppOption";
  MessageCommands2["setUserOption"] = "setUserOption";
  MessageCommands2["resizeWindow"] = "resizeWindow";
  MessageCommands2["reloadWindow"] = "reloadWindow";
  MessageCommands2["setTitle"] = "setTitle";
  MessageCommands2["setScroll"] = "setScroll";
  MessageCommands2["openApplication"] = "openApplication";
  MessageCommands2["closeApplication"] = "closeApplication";
  MessageCommands2["openPath"] = "openPath";
  MessageCommands2["imCallTo"] = "imCallTo";
  MessageCommands2["imPhoneTo"] = "imPhoneTo";
  MessageCommands2["imOpenMessenger"] = "imOpenMessenger";
  MessageCommands2["imOpenHistory"] = "imOpenHistory";
  MessageCommands2["selectUser"] = "selectUser";
  MessageCommands2["selectAccess"] = "selectAccess";
  MessageCommands2["selectCRM"] = "selectCRM";
  MessageCommands2["showAppForm"] = "showAppForm";
  return MessageCommands2;
})(MessageCommands || {});

class MessageManager {
  #appFrame;
  #callbackPromises;
  _logger = null;
  runCallbackHandler;
  constructor(appFrame) {
    this.#appFrame = appFrame;
    this.#callbackPromises = /* @__PURE__ */ new Map();
    this.runCallbackHandler = this._runCallback.bind(this);
  }
  setLogger(logger) {
    this._logger = logger;
  }
  getLogger() {
    if (null === this._logger) {
      this._logger = LoggerBrowser.build(`NullLogger`);
      this._logger.setConfig({
        [LoggerType.desktop]: false,
        [LoggerType.log]: false,
        [LoggerType.info]: false,
        [LoggerType.warn]: false,
        [LoggerType.error]: true,
        [LoggerType.trace]: false
      });
    }
    return this._logger;
  }
  // region Events ////
  /**
   * Subscribe to the onMessage event of the parent window
   */
  subscribe() {
    window.addEventListener("message", this.runCallbackHandler);
  }
  /**
   * Unsubscribe from the onMessage event of the parent window
   */
  unsubscribe() {
    window.removeEventListener("message", this.runCallbackHandler);
  }
  // endregion ////
  /**
   * Send message to parent window
   * The answer (if) we will get in _runCallback
   *
   * @param command
   * @param params
   */
  async send(command, params = null) {
    return new Promise((resolve, reject) => {
      let cmd;
      const promiseHandler = {
        resolve,
        reject,
        timeoutId: null
      };
      const keyPromise = this.#setCallbackPromise(promiseHandler);
      if (command.toString().includes(":")) {
        cmd = {
          method: command.toString(),
          params: params ?? "",
          callback: keyPromise,
          appSid: this.#appFrame.getAppSid()
        };
      } else {
        cmd = command.toString();
        const listParams = [
          params ? JSON.stringify(params) : null,
          keyPromise,
          this.#appFrame.getAppSid()
        ];
        cmd += ":" + listParams.filter(Boolean).join(":");
      }
      this.getLogger().log(`send to ${this.#appFrame.getTargetOrigin()}`, {
        cmd
      });
      parent.postMessage(cmd, 'http://localhost:3000');
      if (params?.isSafely) {
        this.#callbackPromises.get(keyPromise).timeoutId = window.setTimeout(
          () => {
            if (this.#callbackPromises.has(keyPromise)) {
              this.getLogger().warn(
                `Action ${command.toString()} stop by timeout`
              );
              this.#callbackPromises.delete(keyPromise);
              resolve({ isSafely: true });
            }
          },
          Number.parseInt(String(params?.safelyTime || 900))
        );
      }
    });
  }
  /**
   * Fulfilling a promise based on messages from the parent window
   *
   * @param event
   * @private
   */
  _runCallback(event) {
    // if (event.origin !== this.#appFrame.getTargetOrigin()) {
    //   return;
    // }
    if (event.data) {
      this.getLogger().log(`get from ${event.origin}`, {
        data: event.data
      });
      const tmp = event.data.split(":");
      const cmd = {
        id: tmp[0],
        args: tmp.slice(1).join(":")
      };
      if (cmd.args) {
        cmd.args = JSON.parse(cmd.args);
      }
      if (this.#callbackPromises.has(cmd.id)) {
        const promise = this.#callbackPromises.get(cmd.id);
        if (promise.timeoutId) {
          clearTimeout(promise.timeoutId);
        }
        this.#callbackPromises.delete(cmd.id);
        promise.resolve(cmd.args);
      }
    }
  }
  /**
   * Storing a promise for a message from the parent window
   *
   * @param promiseHandler
   * @private
   *
   * @memo We don't use Symbol here, because we need to pass it to the parent and then find and restore it.
   */
  #setCallbackPromise(promiseHandler) {
    const key = Text.getUniqId();
    this.#callbackPromises.set(key, promiseHandler);
    return key;
  }
}

class AppFrame {
  #domain = "";
  #protocol = true;
  #appSid = null;
  #path = null;
  #lang = null;
  constructor(queryParams) {
    if (queryParams.DOMAIN) {
      this.#domain = queryParams.DOMAIN;
      this.#domain = this.#domain.replace(/:(80|443)$/, "");
    }
    this.#protocol = queryParams.PROTOCOL === true;
    if (queryParams.LANG) {
      this.#lang = queryParams.LANG;
    }
    if (queryParams.APP_SID) {
      this.#appSid = queryParams.APP_SID;
    }
  }
  /**
   * Initializes the data received from the parent window message.
   * @param data
   */
  initData(data) {
    if (!this.#domain) {
      this.#domain = data.DOMAIN;
    }
    if (!this.#path) {
      this.#path = data.PATH;
    }
    if (!this.#lang) {
      this.#lang = data.LANG;
    }
    this.#protocol = Number.parseInt(data.PROTOCOL) === 1;
    this.#domain = this.#domain.replace(/:(80|443)$/, "");
    return this;
  }
  /**
   * Returns the sid of the application relative to the parent window like this `9c33468728e1d2c8c97562475edfd96`
   */
  getAppSid() {
    if (null === this.#appSid) {
      throw new Error(`Not init appSid`);
    }
    return this.#appSid;
  }
  /**
   * Get the account address BX24 (https://name.bitrix24.com)
   */
  getTargetOrigin() {
    return `${this.#protocol ? "https" : "http"}://${this.#domain}`;
  }
  /**
   * Get the account address BX24 with Path (https://name.bitrix24.com/rest)
   */
  getTargetOriginWithPath() {
    return this.getTargetOrigin() + (this.#path ?? "");
  }
  /**
   * Returns the localization of the B24 interface
   * @return {B24LangList} - default B24LangList.en
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-get-lang.html
   */
  getLang() {
    return this.#lang || B24LangList.en;
  }
}

class AuthManager {
  #accessToken = null;
  #refreshId = null;
  #authExpires = 0;
  #memberId = null;
  #isAdmin = false;
  #appFrame;
  #messageManager;
  constructor(appFrame, messageManager) {
    this.#appFrame = appFrame;
    this.#messageManager = messageManager;
  }
  /**
   * Initializes the data received from the parent window message.
   * @param data
   */
  initData(data) {
    if (data.AUTH_ID) {
      this.#accessToken = data.AUTH_ID;
      this.#refreshId = data.REFRESH_ID;
      this.#authExpires = Date.now() + Number.parseInt(data.AUTH_EXPIRES) * 1e3;
      this.#isAdmin = data.IS_ADMIN;
      this.#memberId = data.MEMBER_ID || "";
    }
    return this;
  }
  /**
   * Returns authorization data
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-functions/bx24-get-auth.html
   */
  getAuthData() {
    return this.#authExpires > Date.now() ? {
      access_token: this.#accessToken,
      refresh_token: this.#refreshId,
      expires_in: this.#authExpires,
      domain: this.#appFrame.getTargetOrigin(),
      member_id: this.#memberId
    } : false;
  }
  /**
   * Updates authorization data through the parent window
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-functions/bx24-refresh-auth.html
   */
  async refreshAuth() {
    return this.#messageManager.send(MessageCommands.refreshAuth, {}).then((data) => {
      this.#accessToken = data.AUTH_ID;
      this.#refreshId = data.REFRESH_ID;
      this.#authExpires = Date.now() + Number.parseInt(data.AUTH_EXPIRES) * 1e3;
      return Promise.resolve(this.getAuthData());
    });
  }
  getUniq(prefix) {
    return [prefix, this.#memberId || ""].join("_");
  }
  /**
   * Determines whether the current user has administrator rights
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-is-admin.html
   */
  get isAdmin() {
    return this.#isAdmin;
  }
}

class ParentManager {
  #messageManager;
  constructor(messageManager) {
    this.#messageManager = messageManager;
  }
  /**
   * The method closes the open modal window with the application
   *
   * @return {Promise<void>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-close-application.html
   */
  async closeApplication() {
    return this.#messageManager.send(MessageCommands.closeApplication, {
      /**
       * @memo There is no point - everything will be closed, and timeout will not be able to do anything
       */
      isSafely: false
    });
  }
  /**
   * Sets the size of the frame containing the application to the size of the frame's content.
   *
   * @return {Promise<void>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-fit-window.html
   *
   * @memo in certain situations it may not be executed (placement of the main window after installing the application), in this case isSafely mode will work
   */
  async fitWindow() {
    const width = "100%";
    const height = this.getScrollSize().scrollHeight;
    return this.#messageManager.send(MessageCommands.resizeWindow, {
      width,
      height,
      isSafely: true
    });
  }
  /**
   * Sets the size of the frame containing the application to the size of the frame's content.
   *
   * @param {number} width
   * @param {number} height
   *
   * @return {Promise<void>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-resize-window.html
   *
   * @memo in certain situations it may not be executed, in this case isSafely mode will be triggered
   */
  async resizeWindow(width, height) {
    if (width > 0 && height > 0) {
      return this.#messageManager.send(MessageCommands.resizeWindow, {
        width,
        height,
        isSafely: true
      });
    }
    return Promise.reject(
      new Error(`Wrong width:number = ${width} or height:number = ${height}`)
    );
  }
  /**
   * Automatically resize `document.body` of frame with application according to frame content dimensions
   * If you pass appNode, the height will be calculated relative to it
   *
   * @param {HTMLElement|null} appNode
   * @param {number} minHeight
   * @param {number} minWidth
   *
   * @return {Promise<void>}
   */
  async resizeWindowAuto(appNode = null, minHeight = 0, minWidth = 0) {
    const body = document.body;
    let width = Math.max(
      body.scrollWidth,
      body.offsetWidth
      //html.clientWidth,
      //html.scrollWidth,
      //html.offsetWidth
    );
    if (minWidth > 0) {
      width = Math.max(minWidth, width);
    }
    let height = Math.max(
      body.scrollHeight,
      body.offsetHeight
      //html.clientHeight,
      //html.scrollHeight,
      //html.offsetHeight
    );
    if (appNode) {
      height = Math.max(appNode.scrollHeight, appNode.offsetHeight);
    }
    if (minHeight > 0) {
      height = Math.max(minHeight, height);
    }
    return this.resizeWindow(width, height);
  }
  /**
   * This function returns the inner dimensions of the application frame
   *
   * @return {Promise<{scrollWidth: number; scrollHeight: number}>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-get-scroll-size.html
   */
  getScrollSize() {
    return useScrollSize();
  }
  /**
   * Scrolls the parent window
   *
   * @param {number} scroll should specify the vertical scrollbar position (0 - scroll to the very top)
   * @return {Promise<void>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-scroll-parent-window.html
   */
  async scrollParentWindow(scroll) {
    if (!Number.isInteger(scroll)) {
      return Promise.reject(new Error("Wrong scroll number"));
    }
    if (scroll < 0) {
      scroll = 0;
    }
    return this.#messageManager.send(MessageCommands.setScroll, {
      scroll,
      isSafely: true
    });
  }
  /**
   * Reload the page with the application (the whole page, not just the frame).
   *
   * @return {Promise<void>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-reload-window.html
   */
  async reloadWindow() {
    return this.#messageManager.send(MessageCommands.reloadWindow, {
      isSafely: true
    });
  }
  /**
   * Set Page Title
   *
   * @param {string} title
   *
   * @return {Promise<void>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-set-title.html
   */
  async setTitle(title) {
    return this.#messageManager.send(MessageCommands.setTitle, {
      title: title.toString(),
      isSafely: true
    });
  }
  /**
   * Initiates a call via internal communication
   *
   * @param {number} userId The identifier of the account user
   * @param {boolean} isVideo true - video call, false - audio call. Optional parameter.
   *
   * @return {Promise<void>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-im-call-to.html
   */
  async imCallTo(userId, isVideo = true) {
    return this.#messageManager.send(MessageCommands.imCallTo, {
      userId,
      video: isVideo,
      isSafely: true
    });
  }
  /**
   * Makes a call to the phone number
   *
   * @param {string} phone Phone number. The number can be in the format: `+44 20 1234 5678` or `x (xxx) xxx-xx-xx`
   *
   * @return {Promise<void>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-im-phone-to.html
   */
  async imPhoneTo(phone) {
    return this.#messageManager.send(MessageCommands.imPhoneTo, {
      phone,
      isSafely: true
    });
  }
  /**
   * Opens the messenger window
   * userId or chatXXX - chat, where XXX is the chat identifier, which can simply be a number.
   * sgXXX - group chat, where XXX is the social network group number (the chat must be enabled in this group).
   *
   * XXXX** - open line, where XXX is the code obtained via the Rest method imopenlines.network.join.
   *
   * If nothing is passed, the chat interface will open with the last opened dialog.
   *
   * @param {number|`chat${number}`|`sg${number}`|`imol|${number}`|undefined} dialogId
   *
   * @return {Promise<void>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-im-open-messenger.html
   * @link https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=93&LESSON_ID=20152&LESSON_PATH=7657.7883.8025.20150.20152
   *
   */
  async imOpenMessenger(dialogId) {
    return this.#messageManager.send(MessageCommands.imOpenMessenger, {
      dialogId,
      isSafely: true
    });
  }
  /**
   * Opens the history window
   * Identifier of the dialog:
   *
   * userId or chatXXX - chat, where XXX is the chat identifier, which can simply be a number.
   * imol|XXXX - open line, where XXX is the session number of the open line.
   *
   * @param {number|`chat${number}`|`imol|${number}`} dialogId
   *
   * @return {Promise<void>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-im-open-history.html
   */
  async imOpenHistory(dialogId) {
    return this.#messageManager.send(MessageCommands.imOpenHistory, {
      dialogId,
      isSafely: true
    });
  }
}

let OptionsManager$1 = class OptionsManager {
  #messageManager;
  #appOptions = null;
  #userOptions = null;
  constructor(messageManager) {
    this.#messageManager = messageManager;
  }
  /**
   * Initializes the data received from the parent window message.
   * @param data
   */
  initData(data) {
    if (data.APP_OPTIONS) {
      this.#appOptions = data.APP_OPTIONS;
    }
    if (data.USER_OPTIONS) {
      this.#userOptions = data.USER_OPTIONS;
    }
    return this;
  }
  /**
   * Getting application option
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/options/bx24-app-option-get.html
   */
  appGet(option) {
    if (this.#appOptions && !!this.#appOptions[option]) {
      return this.#appOptions[option];
    }
    throw new Error(`app.option.${option} not set`);
  }
  /**
   * Updates application data through the parent window
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/options/bx24-app-option-set.html
   */
  async appSet(option, value) {
    if (!this.#appOptions) {
      this.#appOptions = [];
    }
    this.#appOptions[option] = value;
    return this.#sendParentMessage(
      MessageCommands.setAppOption,
      option,
      this.#appOptions[option]
    );
  }
  /**
   * Getting user option
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/options/bx24-user-option-get.html
   */
  userGet(option) {
    if (this.#userOptions && !!this.#userOptions[option]) {
      return this.#userOptions[option];
    }
    throw new Error(`user.option.${option} not set`);
  }
  /**
   * Updates user data through the parent window
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/options/bx24-user-option-set.html
   */
  async userSet(option, value) {
    if (!this.#appOptions) {
      this.#appOptions = [];
    }
    if (!this.#appOptions[option]) {
      this.#appOptions[option] = null;
    }
    this.#userOptions[option] = value;
    return this.#sendParentMessage(
      MessageCommands.setUserOption,
      option,
      // @ts-ignore
      this.#userOptions[option]
    );
  }
  async #sendParentMessage(command, option, value) {
    return this.#messageManager.send(command, {
      name: option,
      value,
      isSafely: true
    }).then(() => {
      return Promise.resolve();
    });
  }
};

class DialogManager {
  #messageManager;
  constructor(messageManager) {
    this.#messageManager = messageManager;
  }
  /**
   * Method displays the standard single user selection dialog
   * It only shows company employees
   *
   * @return {Promise<null|SelectedUser>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-dialogues/bx24-select-user.html
   */
  async selectUser() {
    return this.#messageManager.send(MessageCommands.selectUser, {
      mult: false
    });
  }
  /**
   * Method displays the standard multiple user selection dialog
   * It only shows company employees
   *
   * @return {Promise<SelectedUser[]>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-dialogues/bx24-select-users.html
   */
  async selectUsers() {
    return this.#messageManager.send(MessageCommands.selectUser, {
      mult: true
    });
  }
  /**
   * @deprecated
   * Method displays a standard access permission selection dialog
   *
   * @param {string[]} blockedAccessPermissions
   * @return {Promise<SelectedAccess[]>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-dialogues/bx24-select-access.html
   */
  async selectAccess(blockedAccessPermissions = []) {
    console.warn(`@deprecated selectAccess`);
    return this.#messageManager.send(MessageCommands.selectAccess, {
      value: blockedAccessPermissions
    });
  }
  /**
   * @deprecated
   * Method invokes the system dialog for selecting a CRM entity
   *
   * @param {SelectCRMParams} params
   * @return {Promise<SelectedCRM>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-dialogues/bx24-select-crm.html
   */
  async selectCRM(params) {
    console.warn(`@deprecated selectCRM`);
    return this.#messageManager.send(MessageCommands.selectCRM, {
      entityType: params?.entityType,
      multiple: params?.multiple,
      value: params?.value
    });
  }
}

class SliderManager {
  #appFrame;
  #messageManager;
  constructor(appFrame, messageManager) {
    this.#appFrame = appFrame;
    this.#messageManager = messageManager;
  }
  /**
   * Returns the URL relative to the domain name and path
   */
  getUrl(path = "/") {
    return new URL(path, this.#appFrame.getTargetOrigin());
  }
  /**
   * Get the account address BX24
   */
  getTargetOrigin() {
    return this.#appFrame.getTargetOrigin();
  }
  /**
   * When the method is called, a pop-up window with the application frame will be opened.
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-open-application.html
   */
  async openSliderAppPage(params = {}) {
    return this.#messageManager.send(MessageCommands.openApplication, params);
  }
  /**
   * The method closes the open modal window with the application
   *
   * @return {Promise<void>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-close-application.html
   */
  async closeSliderAppPage() {
    return this.#messageManager.send(MessageCommands.closeApplication, {
      /**
       * @memo There is no point - everything will be closed, and timeout will not be able to do anything
       */
      isSafely: false
    });
  }
  /**
   * Defines the base path for width sampling.
   *
   * @param width
   * @private
   */
  #getBaseUrlByWidth(width = 1640) {
    if (width > 0) {
      if (width > 1200 && width <= 1640) {
        return "/crm/type/0/details/0/../../../../..";
      } else if (width > 950 && width <= 1200) {
        return "/company/personal/user/0/groups/create/../../../../../..";
      } else if (width > 900 && width <= 950) {
        return "/crm/company/requisite/0/../../../..";
      } else if (width <= 900) {
        return "/workgroups/group/0/card/../../../..";
      } else {
        return "/crm/deal/../..";
      }
    } else {
      return "/crm/deal/../..";
    }
  }
  /**
   * Opens the specified path inside the portal in the slider.
   * @param {URL} url
   * @param {number} width - Number in the range from 1640 to 1200, from 1200 to 950, from 950 to 900, from 900 ...
   * @return {Promise<StatusClose>}
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-open-path.html
   * @memo /^\/(crm\/(deal|lead|contact|company|type)|marketplace|company\/personal\/user\/[0-9]+|workgroups\/group\/[0-9]+)\//
   */
  async openPath(url, width = 1640) {
    const openSliderUrl = new URL(url);
    openSliderUrl.searchParams.set("IFRAME", "Y");
    openSliderUrl.searchParams.set("IFRAME_TYPE", "SIDE_SLIDER");
    return this.#messageManager.send(MessageCommands.openPath, {
      path: [
        this.#getBaseUrlByWidth(width),
        openSliderUrl.pathname,
        openSliderUrl.search
      ].join("")
    }).then((response) => {
      if (response?.result === "error") {
        if (response?.errorCode === "METHOD_NOT_SUPPORTED_ON_DEVICE") {
          return new Promise((resolve, reject) => {
            const windowObjectReference = window.open(url, "_blank");
            if (!windowObjectReference) {
              reject(new Error("Error open window"));
              return;
            }
            let iterator = 0;
            const iteratorMax = 1e3 * 60 * 5;
            const waitCloseWindow = window.setInterval(() => {
              iterator = iterator + 1;
              if (windowObjectReference.closed) {
                clearInterval(waitCloseWindow);
                resolve({
                  isOpenAtNewWindow: true,
                  isClose: true
                });
              } else if (iterator > iteratorMax) {
                clearInterval(waitCloseWindow);
                resolve({
                  isOpenAtNewWindow: true,
                  isClose: false
                });
              }
            }, 1e3);
          });
        } else {
          return Promise.reject(new Error(response?.errorCode));
        }
      } else if (response?.result === "close") {
        return Promise.resolve({
          isOpenAtNewWindow: false,
          isClose: true
        });
      }
      return Promise.resolve({
        isOpenAtNewWindow: false,
        isClose: false
      });
    });
  }
  /**
   * @deprecated
   * @param params
   */
  async showAppForm(params) {
    console.warn(`@deprecated showAppForm`);
    return this.#messageManager.send(MessageCommands.showAppForm, {
      params,
      isSafely: true
    });
  }
}

class PlacementManager {
  #title = "";
  #options = {};
  constructor() {
  }
  /**
   * Initializes the data received from the parent window message.
   * @param data
   */
  initData(data) {
    this.#title = data.PLACEMENT || "DEFAULT";
    const options = data.PLACEMENT_OPTIONS;
    this.#options = Object.freeze(options);
    return this;
  }
  get title() {
    return this.#title;
  }
  get isDefault() {
    return this.title === "DEFAULT";
  }
  get options() {
    return this.#options;
  }
  get isSliderMode() {
    return this.options?.IFRAME === "Y";
  }
}

class B24Frame extends AbstractB24 {
  #isInstallMode = false;
  #isFirstRun = false;
  #appFrame;
  #messageManager;
  #authManager;
  #parentManager;
  #optionsManager;
  #dialogManager;
  #sliderManager;
  #placementManager;
  // region Init ////
  constructor(queryParams) {
    super();
    this.#appFrame = new AppFrame(queryParams);
    this.#messageManager = new MessageManager(this.#appFrame);
    this.#messageManager.subscribe();
    this.#authManager = new AuthManager(this.#appFrame, this.#messageManager);
    this.#parentManager = new ParentManager(this.#messageManager);
    this.#optionsManager = new OptionsManager$1(this.#messageManager);
    this.#dialogManager = new DialogManager(this.#messageManager);
    this.#sliderManager = new SliderManager(
      this.#appFrame,
      this.#messageManager
    );
    this.#placementManager = new PlacementManager();
    this._isInit = false;
  }
  setLogger(logger) {
    super.setLogger(logger);
    this.#messageManager.setLogger(this.getLogger());
  }
  get isFirstRun() {
    this._ensureInitialized();
    return this.#isFirstRun;
  }
  get isInstallMode() {
    this._ensureInitialized();
    return this.#isInstallMode;
  }
  get parent() {
    this._ensureInitialized();
    return this.#parentManager;
  }
  get auth() {
    this._ensureInitialized();
    return this.#authManager;
  }
  get slider() {
    this._ensureInitialized();
    return this.#sliderManager;
  }
  get placement() {
    this._ensureInitialized();
    return this.#placementManager;
  }
  get options() {
    this._ensureInitialized();
    return this.#optionsManager;
  }
  get dialog() {
    this._ensureInitialized();
    return this.#dialogManager;
  }
  async init() {
    return this.#messageManager.send(MessageCommands.getInitData, {}).then((data) => {
      this.getLogger().log("init data:", data);
      this.#appFrame.initData(data);
      this.#authManager.initData(data);
      this.#placementManager.initData(data);
      this.#optionsManager.initData(data);
      this.#isInstallMode = data.INSTALL;
      this.#isFirstRun = data.FIRST_RUN;
      this._http = new Http(
        this.#appFrame.getTargetOriginWithPath(),
        this.#authManager,
        this._getHttpOptions()
      );
      this._isInit = true;
      if (this.#isFirstRun) {
        return this.#messageManager.send(MessageCommands.setInstall, {
          install: true
        });
      }
      return Promise.resolve();
    });
  }
  /**
   * Destructor.
   * Removes an event subscription
   */
  destroy() {
    this.#messageManager.unsubscribe();
    super.destroy();
  }
  // endregion ////
  // region Core ////
  /**
   * Signals that the installer or application setup has finished running.
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-functions/bx24-install-finish.html
   */
  async installFinish() {
    if (!this.isInstallMode) {
      return Promise.reject(
        new Error(
          "Application was previously installed. You cannot call installFinish"
        )
      );
    }
    return this.#messageManager.send(MessageCommands.setInstallFinish, {});
  }
  // endregion ////
  // region Get ////
  /**
   * Get the account address BX24 ( https://name.bitrix24.com )
   */
  getTargetOrigin() {
    this._ensureInitialized();
    return this.#appFrame.getTargetOrigin();
  }
  /**
   * Get the account address BX24 with Path ( https://name.bitrix24.com/rest )
   */
  getTargetOriginWithPath() {
    this._ensureInitialized();
    return this.#appFrame.getTargetOriginWithPath();
  }
  /**
   * Returns the sid of the application relative to the parent window like this `9c33468728e1d2c8c97562475edfd96`
   */
  getAppSid() {
    this._ensureInitialized();
    return this.#appFrame.getAppSid();
  }
  /**
   * Returns the localization of the B24 interface
   *
   * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-get-lang.html
   */
  getLang() {
    this._ensureInitialized();
    return this.#appFrame.getLang();
  }
  // endregion ////
}

class UnhandledMatchError extends Error {
  constructor(value, ...args) {
    super(...args);
    this.name = "UnhandledMatchError";
    this.message = `Unhandled match value of type ${value}`;
    this.stack = new Error("for stack").stack;
  }
}
class AbstractHelper {
  _b24;
  _logger = null;
  _data = null;
  // region Init ////
  constructor(b24) {
    this._b24 = b24;
  }
  setLogger(logger) {
    this._logger = logger;
  }
  getLogger() {
    if (null === this._logger) {
      this._logger = LoggerBrowser.build(`NullLogger`);
      this._logger.setConfig({
        [LoggerType.desktop]: false,
        [LoggerType.log]: false,
        [LoggerType.info]: false,
        [LoggerType.warn]: false,
        [LoggerType.error]: true,
        [LoggerType.trace]: false
      });
    }
    return this._logger;
  }
  // endregion ////
  /**
   * Initializes the data received
   * @param data
   */
  async initData(data) {
    this.getLogger().log(data);
    return Promise.reject(new Error("Rewrite this function"));
  }
}

class ProfileManager extends AbstractHelper {
  _data = null;
  /**
   * @inheritDoc
   */
  async initData(data) {
    this._data = data;
  }
  get data() {
    if (null === this._data) {
      throw new Error("ProfileManager.data not initialized");
    }
    return this._data;
  }
}

class AppManager extends AbstractHelper {
  _data = null;
  /**
   * @inheritDoc
   */
  async initData(data) {
    this._data = data;
  }
  get data() {
    if (null === this._data) {
      throw new Error("AppManager.data not initialized");
    }
    return this._data;
  }
  get statusCode() {
    return StatusDescriptions[this.data.status] || "Unknown status";
  }
}

class PaymentManager extends AbstractHelper {
  _data = null;
  /**
   * @inheritDoc
   */
  async initData(data) {
    this._data = data;
  }
  get data() {
    if (null === this._data) {
      throw new Error("PaymentManager.data not initialized");
    }
    return this._data;
  }
}

class LicenseManager extends AbstractHelper {
  _data = null;
  /**
   * @inheritDoc
   */
  async initData(data) {
    this._data = data;
    this.makeRestrictionManagerParams();
  }
  get data() {
    if (null === this._data) {
      throw new Error("LicenseManager.data not initialized");
    }
    return this._data;
  }
  /**
   * Set RestrictionManager params by license
   * @link https://apidocs.bitrix24.com/api-reference/common/system/app-info.html
   */
  makeRestrictionManagerParams() {
    if (!this.data?.license) {
      return;
    }
    if (this.data.license.includes("ent")) {
      this.getLogger().log(
        `LICENSE ${this.data.license} => up restriction manager params`,
        RestrictionManagerParamsForEnterprise
      );
      this._b24.getHttpClient().setRestrictionManagerParams(RestrictionManagerParamsForEnterprise);
    }
  }
}

class CurrencyManager extends AbstractHelper {
  /**
   * @inheritDoc
   */
  async initData(data) {
    this._data = {
      currencyBase: "?",
      currencyList: /* @__PURE__ */ new Map()
    };
    this.setBaseCurrency(data.currencyBase);
    this.setCurrencyList(data.currencyList);
    try {
      await this.loadData();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      console.error(error);
      throw new Error("Failed to load data");
    }
  }
  async loadData() {
    const batchRequest = this.currencyList.map((currencyCode) => {
      return {
        method: "crm.currency.get",
        params: {
          id: currencyCode
        }
      };
    });
    if (batchRequest.length === 0) {
      return Promise.resolve();
    }
    try {
      const response = await this._b24.callBatchByChunk(batchRequest, true);
      const data = response.getData();
      data.forEach((row) => {
        if (typeof row.LANG === "undefined") {
          return;
        }
        const currencyCode = row.CURRENCY;
        const currency = this.data.currencyList.get(currencyCode);
        if (typeof currency === "undefined") {
          return;
        }
        for (const [langCode, formatData] of Object.entries(row.LANG)) {
          currency.lang[langCode] = {
            decimals: Number.parseInt(formatData.DECIMALS),
            decPoint: formatData.DEC_POINT,
            formatString: formatData.FORMAT_STRING,
            fullName: formatData.FULL_NAME,
            isHideZero: formatData.HIDE_ZERO === "Y",
            thousandsSep: formatData.THOUSANDS_SEP,
            thousandsVariant: formatData.THOUSANDS_VARIANT
          };
          switch (currency.lang[langCode].thousandsVariant) {
            case "N":
              currency.lang[langCode].thousandsSep = "";
              break;
            case "D":
              currency.lang[langCode].thousandsSep = ".";
              break;
            case "C":
              currency.lang[langCode].thousandsSep = ",";
              break;
            case "S":
              currency.lang[langCode].thousandsSep = " ";
              break;
            case "B":
              currency.lang[langCode].thousandsSep = "&nbsp;";
              break;
            // case 'OWN': ////
            default:
              if (!Type.isStringFilled(currency.lang[langCode].thousandsSep)) {
                currency.lang[langCode].thousandsSep = " ";
              }
              break;
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  get data() {
    if (null === this._data) {
      throw new Error("CurrencyManager.data not initialized");
    }
    return this._data;
  }
  // region BaseCurrency ////
  setBaseCurrency(currencyBase) {
    this._data.currencyBase = currencyBase;
  }
  get baseCurrency() {
    return this.data.currencyBase;
  }
  // endregion ////
  // region CurrencyList ////
  setCurrencyList(list = []) {
    this.data.currencyList.clear();
    for (const row of list) {
      this.data.currencyList.set(row.CURRENCY, {
        amount: Number.parseFloat(row.CURRENCY),
        amountCnt: Number.parseInt(row.AMOUNT_CNT),
        isBase: row.BASE === "Y",
        currencyCode: row.CURRENCY,
        dateUpdate: Text.toDateTime(row.DATE_UPDATE),
        decimals: Number.parseInt(row.DECIMALS),
        decPoint: row.DEC_POINT,
        formatString: row.FORMAT_STRING,
        fullName: row.FULL_NAME,
        lid: row.LID,
        sort: Number.parseInt(row.SORT),
        thousandsSep: row?.THOUSANDS_SEP || null,
        lang: {}
      });
    }
  }
  // endregion ////
  // region Info ////
  getCurrencyFullName(currencyCode, langCode) {
    const currency = this.data.currencyList.get(currencyCode);
    if (typeof currency === "undefined") {
      throw new UnhandledMatchError(currencyCode);
    }
    let fullName = currency.fullName;
    if (!(typeof langCode === "undefined")) {
      const langFormatter = currency.lang[langCode];
      if (!Type.isUndefined(langFormatter)) {
        fullName = langFormatter.fullName;
      }
    }
    return fullName;
  }
  getCurrencyLiteral(currencyCode, langCode) {
    const currency = this.data.currencyList.get(currencyCode);
    if (typeof currency === "undefined") {
      throw new UnhandledMatchError(currencyCode);
    }
    let formatString = currency.formatString;
    if (!(typeof langCode === "undefined")) {
      const langFormatter = currency.lang[langCode];
      if (!Type.isUndefined(langFormatter)) {
        formatString = langFormatter.formatString;
      }
    }
    return formatString.replaceAll("&#", "&%").replaceAll("#", "").replaceAll("&%", "&#").trim() || "";
  }
  get currencyList() {
    return [...this.data.currencyList.keys()];
  }
  // endregion ////
  // region Format ////
  format(value, currencyCode, langCode) {
    const currency = this.data.currencyList.get(currencyCode);
    if (typeof currency === "undefined") {
      throw new UnhandledMatchError(currencyCode);
    }
    const options = {
      formatString: currency.formatString,
      decimals: currency.decimals,
      decPoint: currency.decPoint,
      thousandsSep: currency.thousandsSep
    };
    if (!Type.isStringFilled(options.thousandsSep)) {
      options.thousandsSep = "";
    }
    const langFormatter = currency.lang[langCode];
    if (!Type.isUndefined(langFormatter)) {
      options.formatString = langFormatter.formatString;
      options.decimals = langFormatter.decimals;
      options.decPoint = langFormatter.decPoint;
      options.thousandsSep = langFormatter.thousandsSep;
    }
    return options.formatString.replaceAll("&#", "&%").replace(
      "#",
      Text.numberFormat(
        value,
        options.decimals,
        options.decPoint,
        options.thousandsSep
      )
    ).replaceAll("&%", "&#") || "";
  }
  // endregion ////
}

class OptionsManager extends AbstractHelper {
  _data;
  _type;
  // region static ////
  static getSupportTypes() {
    return [
      TypeOption.NotSet,
      TypeOption.JsonArray,
      TypeOption.JsonObject,
      TypeOption.FloatVal,
      TypeOption.IntegerVal,
      TypeOption.BoolYN,
      TypeOption.StringVal
    ];
  }
  static prepareArrayList(list) {
    if (Type.isArray(list)) {
      return list;
    }
    if (Type.isObject(list)) {
      return Object.values(list);
    }
    return [];
  }
  // endregion ////
  // region Init ////
  constructor(b24, type) {
    super(b24);
    this._type = type;
    this._data = /* @__PURE__ */ new Map();
  }
  get data() {
    return this._data;
  }
  reset() {
    this.data.clear();
  }
  /**
   * @inheritDoc
   */
  async initData(data) {
    this.reset();
    if (Type.isObject(data)) {
      for (const [key, value] of Object.entries(data)) {
        this.data.set(key, value);
      }
    }
  }
  // endregion ////
  // region Get ////
  getJsonArray(key, defValue = []) {
    if (!this.data.has(key)) {
      return defValue;
    }
    let data = this.data.get(key);
    try {
      data = JSON.parse(data);
      if (!Type.isArray(data) && !Type.isObject(data)) {
        data = defValue;
      }
    } catch (error) {
      this.getLogger().error(error);
      data = defValue;
    }
    return OptionsManager.prepareArrayList(data);
  }
  getJsonObject(key, defValue = {}) {
    if (!this.data.has(key)) {
      return defValue;
    }
    let data = this.data.get(key);
    try {
      data = JSON.parse(data);
    } catch (error) {
      this.getLogger().error(error);
      data = defValue;
    }
    if (!Type.isObject(data)) {
      data = defValue;
    }
    return data;
  }
  getFloat(key, defValue = 0) {
    if (!this.data.has(key)) {
      return defValue;
    }
    return Text.toNumber(this.data.get(key));
  }
  getInteger(key, defValue = 0) {
    if (!this.data.has(key)) {
      return defValue;
    }
    return Text.toInteger(this.data.get(key));
  }
  getBoolYN(key, defValue = true) {
    if (!this.data.has(key)) {
      return defValue;
    }
    return Text.toBoolean(this.data.get(key));
  }
  getBoolNY(key, defValue = false) {
    if (!this.data.has(key)) {
      return defValue;
    }
    return Text.toBoolean(this.data.get(key));
  }
  getString(key, defValue = "") {
    if (!this.data.has(key)) {
      return defValue;
    }
    return this.data.get(key).toString();
  }
  getDate(key, defValue = null) {
    if (!this.data.has(key)) {
      return defValue;
    }
    try {
      const result = Text.toDateTime(this.data.get(key).toString());
      if (result.isValid) {
        return result;
      } else {
        return defValue;
      }
    } catch {
      return defValue;
    }
  }
  // endregion ////
  // region Tools ////
  encode(value) {
    return JSON.stringify(value);
  }
  decode(data, defaultValue) {
    try {
      if (data.length > 0) {
        return JSON.parse(data);
      }
      return defaultValue;
    } catch (error) {
      this.getLogger().warn(error, data);
    }
    return defaultValue;
  }
  // endregion ////
  // region Save ////
  getMethodSave() {
    switch (this._type) {
      case "app":
        return "app.option.set";
      case "user":
        return "user.option.set";
    }
  }
  async save(options, optionsPull) {
    const commands = [];
    commands.push({
      method: this.getMethodSave(),
      params: {
        options
      }
    });
    if (Type.isObject(optionsPull)) {
      commands.push({
        method: "pull.application.event.add",
        params: {
          COMMAND: optionsPull?.command,
          PARAMS: optionsPull?.params,
          MODULE_ID: optionsPull?.moduleId
        }
      });
    }
    return this._b24.callBatch(commands, true);
  }
  // endregion ////
}

class StorageManager {
  _logger = null;
  userId;
  siteId;
  constructor(params = {}) {
    this.userId = params.userId ? Text.toInteger(params.userId) : 0;
    this.siteId = params.siteId ?? "none";
  }
  setLogger(logger) {
    this._logger = logger;
  }
  getLogger() {
    if (null === this._logger) {
      this._logger = LoggerBrowser.build(`NullLogger`);
      this._logger.setConfig({
        [LoggerType.desktop]: false,
        [LoggerType.log]: false,
        [LoggerType.info]: false,
        [LoggerType.warn]: false,
        [LoggerType.error]: true,
        [LoggerType.trace]: false
      });
    }
    return this._logger;
  }
  set(name, value) {
    if (typeof window.localStorage === "undefined") {
      this.getLogger().error(new Error("undefined window.localStorage"));
      return;
    }
    if (typeof value !== "string" && value) {
      value = JSON.stringify(value);
    }
    window.localStorage.setItem(this._getKey(name), value);
  }
  get(name, defaultValue) {
    if (typeof window.localStorage === "undefined") {
      return defaultValue || null;
    }
    const result = window.localStorage.getItem(this._getKey(name));
    if (result === null) {
      return defaultValue || null;
    }
    return JSON.parse(result);
  }
  remove(name) {
    if (typeof window.localStorage === "undefined") {
      this.getLogger().error(new Error("undefined window.localStorage"));
      return;
    }
    return window.localStorage.removeItem(this._getKey(name));
  }
  _getKey(name) {
    return `@bitrix24/b24jssdk-pull-${this.userId}-${this.siteId}-${name}`;
  }
  compareKey(eventKey, userKey) {
    return eventKey === this._getKey(userKey);
  }
}

class ErrorNotConnected extends Error {
  constructor(message) {
    super(message);
    this.name = "ErrorNotConnected";
  }
}
class ErrorTimeout extends Error {
  constructor(message) {
    super(message);
    this.name = "ErrorTimeout";
  }
}

const JSON_RPC_VERSION = "2.0";
class JsonRpc {
  _logger = null;
  _connector;
  _idCounter = 0;
  _handlers = {};
  _rpcResponseAwaiters = /* @__PURE__ */ new Map();
  constructor(options) {
    this._connector = options.connector;
    if (Type.isPlainObject(options.handlers)) {
      for (const method in options.handlers) {
        this.handle(method, options.handlers[method]);
      }
    }
  }
  setLogger(logger) {
    this._logger = logger;
  }
  getLogger() {
    if (null === this._logger) {
      this._logger = LoggerBrowser.build(`NullLogger`);
      this._logger.setConfig({
        [LoggerType.desktop]: false,
        [LoggerType.log]: false,
        [LoggerType.info]: false,
        [LoggerType.warn]: false,
        [LoggerType.error]: true,
        [LoggerType.trace]: false
      });
    }
    return this._logger;
  }
  /**
   * @param {string} method
   * @param {function} handler
   */
  handle(method, handler) {
    this._handlers[method] = handler;
  }
  /**
   * Sends RPC command to the server.
   *
   * @param {string} method Method name
   * @param {object} params
   * @param {int} timeout
   * @returns {Promise}
   */
  async executeOutgoingRpcCommand(method, params, timeout = 5) {
    return new Promise((resolve, reject) => {
      const request = this.createRequest(method, params);
      if (!this._connector.send(JSON.stringify(request))) {
        reject(new ErrorNotConnected("websocket is not connected"));
      }
      const timeoutHandler = setTimeout(() => {
        this._rpcResponseAwaiters.delete(request.id);
        reject(new ErrorTimeout("no response"));
      }, timeout * 1e3);
      this._rpcResponseAwaiters.set(request.id, {
        resolve,
        reject,
        timeout: timeoutHandler
      });
    });
  }
  /**
   * Executes array or rpc commands.
   * Returns an array of promises, each promise will be resolved individually.
   *
   * @param {JsonRpcRequest[]} batch
   * @returns {Promise[]}
   */
  executeOutgoingRpcBatch(batch) {
    const requests = [];
    const promises = [];
    batch.forEach(({ method, params, id }) => {
      const request = this.createRequest(method, params, id);
      requests.push(request);
      promises.push(
        new Promise(
          (resolve, reject) => this._rpcResponseAwaiters.set(request.id, {
            resolve,
            reject
          })
        )
      );
    });
    this._connector.send(JSON.stringify(requests));
    return promises;
  }
  processRpcResponse(response) {
    if ("id" in response && this._rpcResponseAwaiters.has(Number(response.id))) {
      const awaiter = this._rpcResponseAwaiters.get(Number(response.id));
      if (awaiter) {
        if ("result" in response) {
          awaiter.resolve(response.result);
        } else if ("error" in response) {
          awaiter.reject(response?.error || "error");
        } else {
          awaiter.reject("wrong response structure");
        }
        clearTimeout(awaiter.timeout);
        this._rpcResponseAwaiters.delete(Number(response.id));
      }
      return;
    }
    this.getLogger().error(
      new Error(
        `${Text.getDateForLog()}: Pull: Received rpc response with unknown id`
      ),
      response
    );
  }
  parseJsonRpcMessage(message) {
    let decoded;
    try {
      decoded = JSON.parse(message);
    } catch (error) {
      this.getLogger().error(
        new Error(
          `${Text.getDateForLog()}: Pull: Could not decode json rpc message`
        ),
        error
      );
      return;
    }
    if (Type.isArray(decoded)) {
      return this.executeIncomingRpcBatch(decoded);
    } else if (Type.isJsonRpcRequest(decoded)) {
      return this.executeIncomingRpcCommand(decoded);
    } else if (Type.isJsonRpcResponse(decoded)) {
      return this.processRpcResponse(decoded);
    } else {
      this.getLogger().error(
        new Error(`${Text.getDateForLog()}: Pull: unknown rpc packet`),
        decoded
      );
    }
  }
  /**
   * Executes RPC command, received from the server
   *
   * @param {string} method
   * @param {object} params
   * @returns {object}
   */
  executeIncomingRpcCommand({
    method,
    params
  }) {
    if (method in this._handlers) {
      return this._handlers[method].call(this, params || {});
    }
    return {
      jsonrpc: JSON_RPC_VERSION,
      error: ListRpcError.MethodNotFound
    };
  }
  executeIncomingRpcBatch(batch) {
    const result = [];
    for (const command of batch) {
      if ("jsonrpc" in command) {
        if ("method" in command) {
          const commandResult = this.executeIncomingRpcCommand(command);
          if (commandResult) {
            commandResult["jsonrpc"] = JSON_RPC_VERSION;
            commandResult["id"] = command["id"];
            result.push(commandResult);
          }
        } else {
          this.processRpcResponse(command);
        }
      } else {
        this.getLogger().error(
          new Error(
            `${Text.getDateForLog()}: Pull: unknown rpc command in batch`
          ),
          command
        );
        result.push({
          jsonrpc: JSON_RPC_VERSION,
          error: ListRpcError.InvalidRequest
        });
      }
    }
    return result;
  }
  nextId() {
    return ++this._idCounter;
  }
  createPublishRequest(messageBatch) {
    return messageBatch.map((message) => this.createRequest("publish", message));
  }
  createRequest(method, params, id) {
    if (!id) {
      id = this.nextId();
    }
    return {
      jsonrpc: JSON_RPC_VERSION,
      method,
      params,
      id
    };
  }
}

class SharedConfig {
  _logger = null;
  _storage;
  _ttl = 24 * 60 * 60;
  _callbacks;
  constructor(params = {}) {
    params = params || {};
    this._storage = params.storage || new StorageManager();
    this._callbacks = {
      onWebSocketBlockChanged: Type.isFunction(params.onWebSocketBlockChanged) ? params.onWebSocketBlockChanged : () => {
      }
    };
    if (this._storage) {
      window.addEventListener("storage", this.onLocalStorageSet.bind(this));
    }
  }
  setLogger(logger) {
    this._logger = logger;
  }
  getLogger() {
    if (null === this._logger) {
      this._logger = LoggerBrowser.build(`NullLogger`);
      this._logger.setConfig({
        [LoggerType.desktop]: false,
        [LoggerType.log]: false,
        [LoggerType.info]: false,
        [LoggerType.warn]: false,
        [LoggerType.error]: true,
        [LoggerType.trace]: false
      });
    }
    return this._logger;
  }
  onLocalStorageSet(params) {
    if (this._storage.compareKey(
      params.key || "",
      LsKeys.WebsocketBlocked
    ) && params.newValue !== params.oldValue) {
      this._callbacks.onWebSocketBlockChanged({
        isWebSocketBlocked: this.isWebSocketBlocked()
      });
    }
  }
  isWebSocketBlocked() {
    if (!this._storage) {
      return false;
    }
    return this._storage.get(LsKeys.WebsocketBlocked, 0) > Date.now();
  }
  setWebSocketBlocked(isWebSocketBlocked) {
    if (!this._storage) {
      return false;
    }
    try {
      this._storage.set(
        LsKeys.WebsocketBlocked,
        isWebSocketBlocked ? Date.now() + this._ttl : 0
      );
    } catch (error) {
      this.getLogger().error(
        new Error(
          `${Text.getDateForLog()}: Pull: Could not save WS_blocked flag in local storage. Error: `
        ),
        error
      );
      return false;
    }
    return true;
  }
  isLongPollingBlocked() {
    if (!this._storage) {
      return false;
    }
    return this._storage.get(LsKeys.LongPollingBlocked, 0) > Date.now();
  }
  setLongPollingBlocked(isLongPollingBlocked) {
    if (!this._storage) {
      return false;
    }
    try {
      this._storage.set(
        LsKeys.LongPollingBlocked,
        isLongPollingBlocked ? Date.now() + this._ttl : 0
      );
    } catch (error) {
      this.getLogger().error(
        new Error(
          `${Text.getDateForLog()}: Pull: Could not save LP_blocked flag in local storage. Error: `
        ),
        error
      );
      return false;
    }
    return true;
  }
  isLoggingEnabled() {
    if (!this._storage) {
      return false;
    }
    return this._storage.get(LsKeys.LoggingEnabled, 0) > this.getTimestamp();
  }
  setLoggingEnabled(isLoggingEnabled) {
    if (!this._storage) {
      return false;
    }
    try {
      this._storage.set(
        LsKeys.LoggingEnabled,
        isLoggingEnabled ? this.getTimestamp() + this._ttl : 0
      );
    } catch (error) {
      this.getLogger().error(
        new Error(`${Text.getDateForLog()}: LocalStorage error: `),
        error
      );
      return false;
    }
    return true;
  }
  // region Tools ////
  getTimestamp() {
    return Date.now();
  }
  // endregion ////
}

class ChannelManager {
  _logger = null;
  _publicIds;
  _restClient;
  _getPublicListMethod;
  constructor(params) {
    this._publicIds = /* @__PURE__ */ new Map();
    this._restClient = params.b24;
    this._getPublicListMethod = params.getPublicListMethod;
  }
  setLogger(logger) {
    this._logger = logger;
  }
  getLogger() {
    if (null === this._logger) {
      this._logger = LoggerBrowser.build(`NullLogger`);
      this._logger.setConfig({
        [LoggerType.desktop]: false,
        [LoggerType.log]: false,
        [LoggerType.info]: false,
        [LoggerType.warn]: false,
        [LoggerType.error]: true,
        [LoggerType.trace]: false
      });
    }
    return this._logger;
  }
  /**
   * @param {Array} users Array of user ids.
   * @return {Promise}
   */
  async getPublicIds(users) {
    const now = /* @__PURE__ */ new Date();
    const result = {};
    const unknownUsers = [];
    for (const userId of users) {
      const chanel = this._publicIds.get(userId);
      if (chanel && chanel.end > now) {
        result[chanel.userId] = chanel;
      } else {
        unknownUsers.push(userId);
      }
    }
    if (unknownUsers.length === 0) {
      return Promise.resolve(result);
    }
    return new Promise((resolve) => {
      this._restClient.callMethod(this._getPublicListMethod, {
        users: unknownUsers
      }).then((response) => {
        const data = response.getData().result;
        this.setPublicIds(Object.values(data));
        for (const userId of unknownUsers) {
          const chanel = this._publicIds.get(userId);
          if (chanel) {
            result[chanel.userId] = chanel;
          }
        }
        resolve(result);
      }).catch((error) => {
        this.getLogger().error(error);
        return resolve({});
      });
    });
  }
  /**
   * @param {TypePublicIdDescriptor[]} publicIds
   */
  setPublicIds(publicIds) {
    publicIds.forEach((publicIdDescriptor) => {
      const userId = Number(publicIdDescriptor.user_id);
      this._publicIds.set(userId, {
        userId,
        publicId: publicIdDescriptor.public_id,
        signature: publicIdDescriptor.signature,
        start: new Date(publicIdDescriptor.start),
        end: new Date(publicIdDescriptor.end)
      });
    });
  }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var protobuf = {exports: {}};

/*!
 * protobuf.js v6.8.6 (c) 2016, daniel wirtz
 * compiled mon, 26 feb 2018 11:35:34 utc
 * licensed under the bsd-3-clause license
 * see: https://github.com/dcodeio/protobuf.js for details
 *
 * Modify a list for integration with Bitrix Framework:
 * - removed integration with RequireJS and AMD package builders;
 */

var hasRequiredProtobuf;

function requireProtobuf () {
	if (hasRequiredProtobuf) return protobuf.exports;
	hasRequiredProtobuf = 1;
	(function (module) {
		(function(undefined$1) {
		  (function prelude(modules, cache, entries) {
		    function $require(name) {
		      var $module = cache[name];
		      if (!$module)
		        modules[name][0].call($module = cache[name] = { exports: {} }, $require, $module, $module.exports);
		      return $module.exports;
		    }
		    var protobuf = $require(entries[0]);
		    if (module && module.exports)
		      module.exports = protobuf;
		  })({ 1: [function(require, module2, exports) {
		    module2.exports = asPromise;
		    function asPromise(fn, ctx) {
		      var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
		      while (index < arguments.length)
		        params[offset++] = arguments[index++];
		      return new Promise(function executor(resolve, reject) {
		        params[offset] = function callback(err) {
		          if (pending) {
		            pending = false;
		            if (err)
		              reject(err);
		            else {
		              var params2 = new Array(arguments.length - 1), offset2 = 0;
		              while (offset2 < params2.length)
		                params2[offset2++] = arguments[offset2];
		              resolve.apply(null, params2);
		            }
		          }
		        };
		        try {
		          fn.apply(ctx || null, params);
		        } catch (err) {
		          if (pending) {
		            pending = false;
		            reject(err);
		          }
		        }
		      });
		    }
		  }, {}], 2: [function(require, module2, exports) {
		    var base64 = exports;
		    base64.length = function length(string) {
		      var p = string.length;
		      if (!p)
		        return 0;
		      var n = 0;
		      while (--p % 4 > 1 && string.charAt(p) === "=")
		        ++n;
		      return Math.ceil(string.length * 3) / 4 - n;
		    };
		    var b64 = new Array(64);
		    var s64 = new Array(123);
		    for (var i = 0; i < 64; )
		      s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
		    base64.encode = function encode(buffer, start, end) {
		      var parts = null, chunk = [];
		      var i2 = 0, j = 0, t;
		      while (start < end) {
		        var b = buffer[start++];
		        switch (j) {
		          case 0:
		            chunk[i2++] = b64[b >> 2];
		            t = (b & 3) << 4;
		            j = 1;
		            break;
		          case 1:
		            chunk[i2++] = b64[t | b >> 4];
		            t = (b & 15) << 2;
		            j = 2;
		            break;
		          case 2:
		            chunk[i2++] = b64[t | b >> 6];
		            chunk[i2++] = b64[b & 63];
		            j = 0;
		            break;
		        }
		        if (i2 > 8191) {
		          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
		          i2 = 0;
		        }
		      }
		      if (j) {
		        chunk[i2++] = b64[t];
		        chunk[i2++] = 61;
		        if (j === 1)
		          chunk[i2++] = 61;
		      }
		      if (parts) {
		        if (i2)
		          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
		        return parts.join("");
		      }
		      return String.fromCharCode.apply(String, chunk.slice(0, i2));
		    };
		    var invalidEncoding = "invalid encoding";
		    base64.decode = function decode(string, buffer, offset) {
		      var start = offset;
		      var j = 0, t;
		      for (var i2 = 0; i2 < string.length; ) {
		        var c = string.charCodeAt(i2++);
		        if (c === 61 && j > 1)
		          break;
		        if ((c = s64[c]) === undefined$1)
		          throw Error(invalidEncoding);
		        switch (j) {
		          case 0:
		            t = c;
		            j = 1;
		            break;
		          case 1:
		            buffer[offset++] = t << 2 | (c & 48) >> 4;
		            t = c;
		            j = 2;
		            break;
		          case 2:
		            buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
		            t = c;
		            j = 3;
		            break;
		          case 3:
		            buffer[offset++] = (t & 3) << 6 | c;
		            j = 0;
		            break;
		        }
		      }
		      if (j === 1)
		        throw Error(invalidEncoding);
		      return offset - start;
		    };
		    base64.test = function test(string) {
		      return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
		    };
		  }, {}], 3: [function(require, module2, exports) {
		    module2.exports = codegen;
		    function codegen(functionParams, functionName) {
		      if (typeof functionParams === "string") {
		        functionName = functionParams;
		        functionParams = undefined$1;
		      }
		      var body = [];
		      function Codegen(formatStringOrScope) {
		        if (typeof formatStringOrScope !== "string") {
		          var source = toString();
		          if (codegen.verbose)
		            console.log("codegen: " + source);
		          source = "return " + source;
		          if (formatStringOrScope) {
		            var scopeKeys = Object.keys(formatStringOrScope), scopeParams = new Array(scopeKeys.length + 1), scopeValues = new Array(scopeKeys.length), scopeOffset = 0;
		            while (scopeOffset < scopeKeys.length) {
		              scopeParams[scopeOffset] = scopeKeys[scopeOffset];
		              scopeValues[scopeOffset] = formatStringOrScope[scopeKeys[scopeOffset++]];
		            }
		            scopeParams[scopeOffset] = source;
		            return Function.apply(null, scopeParams).apply(null, scopeValues);
		          }
		          return Function(source)();
		        }
		        var formatParams = new Array(arguments.length - 1), formatOffset = 0;
		        while (formatOffset < formatParams.length)
		          formatParams[formatOffset] = arguments[++formatOffset];
		        formatOffset = 0;
		        formatStringOrScope = formatStringOrScope.replace(/%([%dfijs])/g, function replace($0, $1) {
		          var value = formatParams[formatOffset++];
		          switch ($1) {
		            case "d":
		            case "f":
		              return String(Number(value));
		            case "i":
		              return String(Math.floor(value));
		            case "j":
		              return JSON.stringify(value);
		            case "s":
		              return String(value);
		          }
		          return "%";
		        });
		        if (formatOffset !== formatParams.length)
		          throw Error("parameter count mismatch");
		        body.push(formatStringOrScope);
		        return Codegen;
		      }
		      function toString(functionNameOverride) {
		        return "function " + (functionNameOverride || functionName || "") + "(" + (functionParams && functionParams.join(",") || "") + "){\n  " + body.join("\n  ") + "\n}";
		      }
		      Codegen.toString = toString;
		      return Codegen;
		    }
		    codegen.verbose = false;
		  }, {}], 4: [function(require, module2, exports) {
		    module2.exports = EventEmitter;
		    function EventEmitter() {
		      this._listeners = {};
		    }
		    EventEmitter.prototype.on = function on(evt, fn, ctx) {
		      (this._listeners[evt] || (this._listeners[evt] = [])).push({
		        fn,
		        ctx: ctx || this
		      });
		      return this;
		    };
		    EventEmitter.prototype.off = function off(evt, fn) {
		      if (evt === undefined$1)
		        this._listeners = {};
		      else {
		        if (fn === undefined$1)
		          this._listeners[evt] = [];
		        else {
		          var listeners = this._listeners[evt];
		          for (var i = 0; i < listeners.length; )
		            if (listeners[i].fn === fn)
		              listeners.splice(i, 1);
		            else
		              ++i;
		        }
		      }
		      return this;
		    };
		    EventEmitter.prototype.emit = function emit(evt) {
		      var listeners = this._listeners[evt];
		      if (listeners) {
		        var args = [], i = 1;
		        for (; i < arguments.length; )
		          args.push(arguments[i++]);
		        for (i = 0; i < listeners.length; )
		          listeners[i].fn.apply(listeners[i++].ctx, args);
		      }
		      return this;
		    };
		  }, {}], 5: [function(require, module2, exports) {
		    module2.exports = fetch;
		    var asPromise = require(1), inquire = require(7);
		    var fs = inquire("fs");
		    function fetch(filename, options, callback) {
		      if (typeof options === "function") {
		        callback = options;
		        options = {};
		      } else if (!options)
		        options = {};
		      if (!callback)
		        return asPromise(fetch, this, filename, options);
		      if (!options.xhr && fs && fs.readFile)
		        return fs.readFile(filename, function fetchReadFileCallback(err, contents) {
		          return err && typeof XMLHttpRequest !== "undefined" ? fetch.xhr(filename, options, callback) : err ? callback(err) : callback(null, options.binary ? contents : contents.toString("utf8"));
		        });
		      return fetch.xhr(filename, options, callback);
		    }
		    fetch.xhr = function fetch_xhr(filename, options, callback) {
		      var xhr = new XMLHttpRequest();
		      xhr.onreadystatechange = function fetchOnReadyStateChange() {
		        if (xhr.readyState !== 4)
		          return undefined$1;
		        if (xhr.status !== 0 && xhr.status !== 200)
		          return callback(Error("status " + xhr.status));
		        if (options.binary) {
		          var buffer = xhr.response;
		          if (!buffer) {
		            buffer = [];
		            for (var i = 0; i < xhr.responseText.length; ++i)
		              buffer.push(xhr.responseText.charCodeAt(i) & 255);
		          }
		          return callback(null, typeof Uint8Array !== "undefined" ? new Uint8Array(buffer) : buffer);
		        }
		        return callback(null, xhr.responseText);
		      };
		      if (options.binary) {
		        if ("overrideMimeType" in xhr)
		          xhr.overrideMimeType("text/plain; charset=x-user-defined");
		        xhr.responseType = "arraybuffer";
		      }
		      xhr.open("GET", filename);
		      xhr.send();
		    };
		  }, { "1": 1, "7": 7 }], 6: [function(require, module2, exports) {
		    module2.exports = factory(factory);
		    function factory(exports2) {
		      if (typeof Float32Array !== "undefined") (function() {
		        var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
		        function writeFloat_f32_cpy(val, buf, pos) {
		          f32[0] = val;
		          buf[pos] = f8b[0];
		          buf[pos + 1] = f8b[1];
		          buf[pos + 2] = f8b[2];
		          buf[pos + 3] = f8b[3];
		        }
		        function writeFloat_f32_rev(val, buf, pos) {
		          f32[0] = val;
		          buf[pos] = f8b[3];
		          buf[pos + 1] = f8b[2];
		          buf[pos + 2] = f8b[1];
		          buf[pos + 3] = f8b[0];
		        }
		        exports2.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
		        exports2.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
		        function readFloat_f32_cpy(buf, pos) {
		          f8b[0] = buf[pos];
		          f8b[1] = buf[pos + 1];
		          f8b[2] = buf[pos + 2];
		          f8b[3] = buf[pos + 3];
		          return f32[0];
		        }
		        function readFloat_f32_rev(buf, pos) {
		          f8b[3] = buf[pos];
		          f8b[2] = buf[pos + 1];
		          f8b[1] = buf[pos + 2];
		          f8b[0] = buf[pos + 3];
		          return f32[0];
		        }
		        exports2.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
		        exports2.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
		      })();
		      else (function() {
		        function writeFloat_ieee754(writeUint, val, buf, pos) {
		          var sign = val < 0 ? 1 : 0;
		          if (sign)
		            val = -val;
		          if (val === 0)
		            writeUint(1 / val > 0 ? (
		              /* positive */
		              0
		            ) : (
		              /* negative 0 */
		              2147483648
		            ), buf, pos);
		          else if (isNaN(val))
		            writeUint(2143289344, buf, pos);
		          else if (val > 34028234663852886e22)
		            writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
		          else if (val < 11754943508222875e-54)
		            writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos);
		          else {
		            var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
		            writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
		          }
		        }
		        exports2.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
		        exports2.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
		        function readFloat_ieee754(readUint, buf, pos) {
		          var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
		          return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
		        }
		        exports2.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
		        exports2.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
		      })();
		      if (typeof Float64Array !== "undefined") (function() {
		        var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
		        function writeDouble_f64_cpy(val, buf, pos) {
		          f64[0] = val;
		          buf[pos] = f8b[0];
		          buf[pos + 1] = f8b[1];
		          buf[pos + 2] = f8b[2];
		          buf[pos + 3] = f8b[3];
		          buf[pos + 4] = f8b[4];
		          buf[pos + 5] = f8b[5];
		          buf[pos + 6] = f8b[6];
		          buf[pos + 7] = f8b[7];
		        }
		        function writeDouble_f64_rev(val, buf, pos) {
		          f64[0] = val;
		          buf[pos] = f8b[7];
		          buf[pos + 1] = f8b[6];
		          buf[pos + 2] = f8b[5];
		          buf[pos + 3] = f8b[4];
		          buf[pos + 4] = f8b[3];
		          buf[pos + 5] = f8b[2];
		          buf[pos + 6] = f8b[1];
		          buf[pos + 7] = f8b[0];
		        }
		        exports2.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
		        exports2.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
		        function readDouble_f64_cpy(buf, pos) {
		          f8b[0] = buf[pos];
		          f8b[1] = buf[pos + 1];
		          f8b[2] = buf[pos + 2];
		          f8b[3] = buf[pos + 3];
		          f8b[4] = buf[pos + 4];
		          f8b[5] = buf[pos + 5];
		          f8b[6] = buf[pos + 6];
		          f8b[7] = buf[pos + 7];
		          return f64[0];
		        }
		        function readDouble_f64_rev(buf, pos) {
		          f8b[7] = buf[pos];
		          f8b[6] = buf[pos + 1];
		          f8b[5] = buf[pos + 2];
		          f8b[4] = buf[pos + 3];
		          f8b[3] = buf[pos + 4];
		          f8b[2] = buf[pos + 5];
		          f8b[1] = buf[pos + 6];
		          f8b[0] = buf[pos + 7];
		          return f64[0];
		        }
		        exports2.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
		        exports2.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
		      })();
		      else (function() {
		        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
		          var sign = val < 0 ? 1 : 0;
		          if (sign)
		            val = -val;
		          if (val === 0) {
		            writeUint(0, buf, pos + off0);
		            writeUint(1 / val > 0 ? (
		              /* positive */
		              0
		            ) : (
		              /* negative 0 */
		              2147483648
		            ), buf, pos + off1);
		          } else if (isNaN(val)) {
		            writeUint(0, buf, pos + off0);
		            writeUint(2146959360, buf, pos + off1);
		          } else if (val > 17976931348623157e292) {
		            writeUint(0, buf, pos + off0);
		            writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
		          } else {
		            var mantissa;
		            if (val < 22250738585072014e-324) {
		              mantissa = val / 5e-324;
		              writeUint(mantissa >>> 0, buf, pos + off0);
		              writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
		            } else {
		              var exponent = Math.floor(Math.log(val) / Math.LN2);
		              if (exponent === 1024)
		                exponent = 1023;
		              mantissa = val * Math.pow(2, -exponent);
		              writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
		              writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
		            }
		          }
		        }
		        exports2.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
		        exports2.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
		        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
		          var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
		          var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
		          return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
		        }
		        exports2.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
		        exports2.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
		      })();
		      return exports2;
		    }
		    function writeUintLE(val, buf, pos) {
		      buf[pos] = val & 255;
		      buf[pos + 1] = val >>> 8 & 255;
		      buf[pos + 2] = val >>> 16 & 255;
		      buf[pos + 3] = val >>> 24;
		    }
		    function writeUintBE(val, buf, pos) {
		      buf[pos] = val >>> 24;
		      buf[pos + 1] = val >>> 16 & 255;
		      buf[pos + 2] = val >>> 8 & 255;
		      buf[pos + 3] = val & 255;
		    }
		    function readUintLE(buf, pos) {
		      return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
		    }
		    function readUintBE(buf, pos) {
		      return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
		    }
		  }, {}], 7: [function(require, module2, exports) {
		    module2.exports = inquire;
		    function inquire(moduleName) {
		      try {
		        var mod = require(moduleName);
		        if (mod && (mod.length || Object.keys(mod).length))
		          return mod;
		      } catch (e) {
		      }
		      return null;
		    }
		  }, {}], 8: [function(require, module2, exports) {
		    var path = exports;
		    var isAbsolute = (
		      /**
		       * Tests if the specified path is absolute.
		       * @param {string} path Path to test
		       * @returns {boolean} `true` if path is absolute
		       */
		      path.isAbsolute = function isAbsolute2(path2) {
		        return /^(?:\/|\w+:)/.test(path2);
		      }
		    );
		    var normalize = (
		      /**
		       * Normalizes the specified path.
		       * @param {string} path Path to normalize
		       * @returns {string} Normalized path
		       */
		      path.normalize = function normalize2(path2) {
		        path2 = path2.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
		        var parts = path2.split("/"), absolute = isAbsolute(path2), prefix = "";
		        if (absolute)
		          prefix = parts.shift() + "/";
		        for (var i = 0; i < parts.length; ) {
		          if (parts[i] === "..") {
		            if (i > 0 && parts[i - 1] !== "..")
		              parts.splice(--i, 2);
		            else if (absolute)
		              parts.splice(i, 1);
		            else
		              ++i;
		          } else if (parts[i] === ".")
		            parts.splice(i, 1);
		          else
		            ++i;
		        }
		        return prefix + parts.join("/");
		      }
		    );
		    path.resolve = function resolve(originPath, includePath, alreadyNormalized) {
		      if (!alreadyNormalized)
		        includePath = normalize(includePath);
		      if (isAbsolute(includePath))
		        return includePath;
		      if (!alreadyNormalized)
		        originPath = normalize(originPath);
		      return (originPath = originPath.replace(/(?:\/|^)[^/]+$/, "")).length ? normalize(originPath + "/" + includePath) : includePath;
		    };
		  }, {}], 9: [function(require, module2, exports) {
		    module2.exports = pool;
		    function pool(alloc, slice, size) {
		      var SIZE = size || 8192;
		      var MAX = SIZE >>> 1;
		      var slab = null;
		      var offset = SIZE;
		      return function pool_alloc(size2) {
		        if (size2 < 1 || size2 > MAX)
		          return alloc(size2);
		        if (offset + size2 > SIZE) {
		          slab = alloc(SIZE);
		          offset = 0;
		        }
		        var buf = slice.call(slab, offset, offset += size2);
		        if (offset & 7)
		          offset = (offset | 7) + 1;
		        return buf;
		      };
		    }
		  }, {}], 10: [function(require, module2, exports) {
		    var utf8 = exports;
		    utf8.length = function utf8_length(string) {
		      var len = 0, c = 0;
		      for (var i = 0; i < string.length; ++i) {
		        c = string.charCodeAt(i);
		        if (c < 128)
		          len += 1;
		        else if (c < 2048)
		          len += 2;
		        else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
		          ++i;
		          len += 4;
		        } else
		          len += 3;
		      }
		      return len;
		    };
		    utf8.read = function utf8_read(buffer, start, end) {
		      var len = end - start;
		      if (len < 1)
		        return "";
		      var parts = null, chunk = [], i = 0, t;
		      while (start < end) {
		        t = buffer[start++];
		        if (t < 128)
		          chunk[i++] = t;
		        else if (t > 191 && t < 224)
		          chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
		        else if (t > 239 && t < 365) {
		          t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 65536;
		          chunk[i++] = 55296 + (t >> 10);
		          chunk[i++] = 56320 + (t & 1023);
		        } else
		          chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
		        if (i > 8191) {
		          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
		          i = 0;
		        }
		      }
		      if (parts) {
		        if (i)
		          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
		        return parts.join("");
		      }
		      return String.fromCharCode.apply(String, chunk.slice(0, i));
		    };
		    utf8.write = function utf8_write(string, buffer, offset) {
		      var start = offset, c1, c2;
		      for (var i = 0; i < string.length; ++i) {
		        c1 = string.charCodeAt(i);
		        if (c1 < 128) {
		          buffer[offset++] = c1;
		        } else if (c1 < 2048) {
		          buffer[offset++] = c1 >> 6 | 192;
		          buffer[offset++] = c1 & 63 | 128;
		        } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
		          c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
		          ++i;
		          buffer[offset++] = c1 >> 18 | 240;
		          buffer[offset++] = c1 >> 12 & 63 | 128;
		          buffer[offset++] = c1 >> 6 & 63 | 128;
		          buffer[offset++] = c1 & 63 | 128;
		        } else {
		          buffer[offset++] = c1 >> 12 | 224;
		          buffer[offset++] = c1 >> 6 & 63 | 128;
		          buffer[offset++] = c1 & 63 | 128;
		        }
		      }
		      return offset - start;
		    };
		  }, {}], 11: [function(require, module2, exports) {
		    module2.exports = common;
		    var commonRe = /\/|\./;
		    function common(name, json) {
		      if (!commonRe.test(name)) {
		        name = "google/protobuf/" + name + ".proto";
		        json = { nested: { google: { nested: { protobuf: { nested: json } } } } };
		      }
		      common[name] = json;
		    }
		    common("any", {
		      /**
		       * Properties of a google.protobuf.Any message.
		       * @interface IAny
		       * @type {Object}
		       * @property {string} [typeUrl]
		       * @property {Uint8Array} [bytes]
		       * @memberof common
		       */
		      Any: {
		        fields: {
		          type_url: {
		            type: "string",
		            id: 1
		          },
		          value: {
		            type: "bytes",
		            id: 2
		          }
		        }
		      }
		    });
		    var timeType;
		    common("duration", {
		      /**
		       * Properties of a google.protobuf.Duration message.
		       * @interface IDuration
		       * @type {Object}
		       * @property {number|Long} [seconds]
		       * @property {number} [nanos]
		       * @memberof common
		       */
		      Duration: timeType = {
		        fields: {
		          seconds: {
		            type: "int64",
		            id: 1
		          },
		          nanos: {
		            type: "int32",
		            id: 2
		          }
		        }
		      }
		    });
		    common("timestamp", {
		      /**
		       * Properties of a google.protobuf.Timestamp message.
		       * @interface ITimestamp
		       * @type {Object}
		       * @property {number|Long} [seconds]
		       * @property {number} [nanos]
		       * @memberof common
		       */
		      Timestamp: timeType
		    });
		    common("empty", {
		      /**
		       * Properties of a google.protobuf.Empty message.
		       * @interface IEmpty
		       * @memberof common
		       */
		      Empty: {
		        fields: {}
		      }
		    });
		    common("struct", {
		      /**
		       * Properties of a google.protobuf.Struct message.
		       * @interface IStruct
		       * @type {Object}
		       * @property {Object.<string,IValue>} [fields]
		       * @memberof common
		       */
		      Struct: {
		        fields: {
		          fields: {
		            keyType: "string",
		            type: "Value",
		            id: 1
		          }
		        }
		      },
		      /**
		       * Properties of a google.protobuf.Value message.
		       * @interface IValue
		       * @type {Object}
		       * @property {string} [kind]
		       * @property {0} [nullValue]
		       * @property {number} [numberValue]
		       * @property {string} [stringValue]
		       * @property {boolean} [boolValue]
		       * @property {IStruct} [structValue]
		       * @property {IListValue} [listValue]
		       * @memberof common
		       */
		      Value: {
		        oneofs: {
		          kind: {
		            oneof: [
		              "nullValue",
		              "numberValue",
		              "stringValue",
		              "boolValue",
		              "structValue",
		              "listValue"
		            ]
		          }
		        },
		        fields: {
		          nullValue: {
		            type: "NullValue",
		            id: 1
		          },
		          numberValue: {
		            type: "double",
		            id: 2
		          },
		          stringValue: {
		            type: "string",
		            id: 3
		          },
		          boolValue: {
		            type: "bool",
		            id: 4
		          },
		          structValue: {
		            type: "Struct",
		            id: 5
		          },
		          listValue: {
		            type: "ListValue",
		            id: 6
		          }
		        }
		      },
		      NullValue: {
		        values: {
		          NULL_VALUE: 0
		        }
		      },
		      /**
		       * Properties of a google.protobuf.ListValue message.
		       * @interface IListValue
		       * @type {Object}
		       * @property {Array.<IValue>} [values]
		       * @memberof common
		       */
		      ListValue: {
		        fields: {
		          values: {
		            rule: "repeated",
		            type: "Value",
		            id: 1
		          }
		        }
		      }
		    });
		    common("wrappers", {
		      /**
		       * Properties of a google.protobuf.DoubleValue message.
		       * @interface IDoubleValue
		       * @type {Object}
		       * @property {number} [value]
		       * @memberof common
		       */
		      DoubleValue: {
		        fields: {
		          value: {
		            type: "double",
		            id: 1
		          }
		        }
		      },
		      /**
		       * Properties of a google.protobuf.FloatValue message.
		       * @interface IFloatValue
		       * @type {Object}
		       * @property {number} [value]
		       * @memberof common
		       */
		      FloatValue: {
		        fields: {
		          value: {
		            type: "float",
		            id: 1
		          }
		        }
		      },
		      /**
		       * Properties of a google.protobuf.Int64Value message.
		       * @interface IInt64Value
		       * @type {Object}
		       * @property {number|Long} [value]
		       * @memberof common
		       */
		      Int64Value: {
		        fields: {
		          value: {
		            type: "int64",
		            id: 1
		          }
		        }
		      },
		      /**
		       * Properties of a google.protobuf.UInt64Value message.
		       * @interface IUInt64Value
		       * @type {Object}
		       * @property {number|Long} [value]
		       * @memberof common
		       */
		      UInt64Value: {
		        fields: {
		          value: {
		            type: "uint64",
		            id: 1
		          }
		        }
		      },
		      /**
		       * Properties of a google.protobuf.Int32Value message.
		       * @interface IInt32Value
		       * @type {Object}
		       * @property {number} [value]
		       * @memberof common
		       */
		      Int32Value: {
		        fields: {
		          value: {
		            type: "int32",
		            id: 1
		          }
		        }
		      },
		      /**
		       * Properties of a google.protobuf.UInt32Value message.
		       * @interface IUInt32Value
		       * @type {Object}
		       * @property {number} [value]
		       * @memberof common
		       */
		      UInt32Value: {
		        fields: {
		          value: {
		            type: "uint32",
		            id: 1
		          }
		        }
		      },
		      /**
		       * Properties of a google.protobuf.BoolValue message.
		       * @interface IBoolValue
		       * @type {Object}
		       * @property {boolean} [value]
		       * @memberof common
		       */
		      BoolValue: {
		        fields: {
		          value: {
		            type: "bool",
		            id: 1
		          }
		        }
		      },
		      /**
		       * Properties of a google.protobuf.StringValue message.
		       * @interface IStringValue
		       * @type {Object}
		       * @property {string} [value]
		       * @memberof common
		       */
		      StringValue: {
		        fields: {
		          value: {
		            type: "string",
		            id: 1
		          }
		        }
		      },
		      /**
		       * Properties of a google.protobuf.BytesValue message.
		       * @interface IBytesValue
		       * @type {Object}
		       * @property {Uint8Array} [value]
		       * @memberof common
		       */
		      BytesValue: {
		        fields: {
		          value: {
		            type: "bytes",
		            id: 1
		          }
		        }
		      }
		    });
		    common("field_mask", {
		      /**
		       * Properties of a google.protobuf.FieldMask message.
		       * @interface IDoubleValue
		       * @type {Object}
		       * @property {number} [value]
		       * @memberof common
		       */
		      FieldMask: {
		        fields: {
		          paths: {
		            rule: "repeated",
		            type: "string",
		            id: 1
		          }
		        }
		      }
		    });
		    common.get = function get(file) {
		      return common[file] || null;
		    };
		  }, {}], 12: [function(require, module2, exports) {
		    var converter = exports;
		    var Enum = require(15), util = require(37);
		    function genValuePartial_fromObject(gen, field, fieldIndex, prop) {
		      if (field.resolvedType) {
		        if (field.resolvedType instanceof Enum) {
		          gen("switch(d%s){", prop);
		          for (var values = field.resolvedType.values, keys = Object.keys(values), i = 0; i < keys.length; ++i) {
		            if (field.repeated && values[keys[i]] === field.typeDefault) gen("default:");
		            gen("case%j:", keys[i])("case %i:", values[keys[i]])("m%s=%j", prop, values[keys[i]])("break");
		          }
		          gen("}");
		        } else gen('if(typeof d%s!=="object")', prop)("throw TypeError(%j)", field.fullName + ": object expected")("m%s=types[%i].fromObject(d%s)", prop, fieldIndex, prop);
		      } else {
		        var isUnsigned = false;
		        switch (field.type) {
		          case "double":
		          case "float":
		            gen("m%s=Number(d%s)", prop, prop);
		            break;
		          case "uint32":
		          case "fixed32":
		            gen("m%s=d%s>>>0", prop, prop);
		            break;
		          case "int32":
		          case "sint32":
		          case "sfixed32":
		            gen("m%s=d%s|0", prop, prop);
		            break;
		          case "uint64":
		            isUnsigned = true;
		          // eslint-disable-line no-fallthrough
		          case "int64":
		          case "sint64":
		          case "fixed64":
		          case "sfixed64":
		            gen("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j", prop, prop, isUnsigned)('else if(typeof d%s==="string")', prop)("m%s=parseInt(d%s,10)", prop, prop)('else if(typeof d%s==="number")', prop)("m%s=d%s", prop, prop)('else if(typeof d%s==="object")', prop)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", prop, prop, prop, isUnsigned ? "true" : "");
		            break;
		          case "bytes":
		            gen('if(typeof d%s==="string")', prop)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", prop, prop, prop)("else if(d%s.length)", prop)("m%s=d%s", prop, prop);
		            break;
		          case "string":
		            gen("m%s=String(d%s)", prop, prop);
		            break;
		          case "bool":
		            gen("m%s=Boolean(d%s)", prop, prop);
		            break;
		        }
		      }
		      return gen;
		    }
		    converter.fromObject = function fromObject(mtype) {
		      var fields = mtype.fieldsArray;
		      var gen = util.codegen(["d"], mtype.name + "$fromObject")("if(d instanceof this.ctor)")("return d");
		      if (!fields.length) return gen("return new this.ctor");
		      gen("var m=new this.ctor");
		      for (var i = 0; i < fields.length; ++i) {
		        var field = fields[i].resolve(), prop = util.safeProp(field.name);
		        if (field.map) {
		          gen("if(d%s){", prop)('if(typeof d%s!=="object")', prop)("throw TypeError(%j)", field.fullName + ": object expected")("m%s={}", prop)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", prop);
		          genValuePartial_fromObject(
		            gen,
		            field,
		            /* not sorted */
		            i,
		            prop + "[ks[i]]"
		          )("}")("}");
		        } else if (field.repeated) {
		          gen("if(d%s){", prop)("if(!Array.isArray(d%s))", prop)("throw TypeError(%j)", field.fullName + ": array expected")("m%s=[]", prop)("for(var i=0;i<d%s.length;++i){", prop);
		          genValuePartial_fromObject(
		            gen,
		            field,
		            /* not sorted */
		            i,
		            prop + "[i]"
		          )("}")("}");
		        } else {
		          if (!(field.resolvedType instanceof Enum)) gen("if(d%s!=null){", prop);
		          genValuePartial_fromObject(
		            gen,
		            field,
		            /* not sorted */
		            i,
		            prop
		          );
		          if (!(field.resolvedType instanceof Enum)) gen("}");
		        }
		      }
		      return gen("return m");
		    };
		    function genValuePartial_toObject(gen, field, fieldIndex, prop) {
		      if (field.resolvedType) {
		        if (field.resolvedType instanceof Enum) gen("d%s=o.enums===String?types[%i].values[m%s]:m%s", prop, fieldIndex, prop, prop);
		        else gen("d%s=types[%i].toObject(m%s,o)", prop, fieldIndex, prop);
		      } else {
		        var isUnsigned = false;
		        switch (field.type) {
		          case "double":
		          case "float":
		            gen("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", prop, prop, prop, prop);
		            break;
		          case "uint64":
		            isUnsigned = true;
		          // eslint-disable-line no-fallthrough
		          case "int64":
		          case "sint64":
		          case "fixed64":
		          case "sfixed64":
		            gen('if(typeof m%s==="number")', prop)("d%s=o.longs===String?String(m%s):m%s", prop, prop, prop)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", prop, prop, prop, prop, isUnsigned ? "true" : "", prop);
		            break;
		          case "bytes":
		            gen("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", prop, prop, prop, prop, prop);
		            break;
		          default:
		            gen("d%s=m%s", prop, prop);
		            break;
		        }
		      }
		      return gen;
		    }
		    converter.toObject = function toObject(mtype) {
		      var fields = mtype.fieldsArray.slice().sort(util.compareFieldsById);
		      if (!fields.length)
		        return util.codegen()("return {}");
		      var gen = util.codegen(["m", "o"], mtype.name + "$toObject")("if(!o)")("o={}")("var d={}");
		      var repeatedFields = [], mapFields = [], normalFields = [], i = 0;
		      for (; i < fields.length; ++i)
		        if (!fields[i].partOf)
		          (fields[i].resolve().repeated ? repeatedFields : fields[i].map ? mapFields : normalFields).push(fields[i]);
		      if (repeatedFields.length) {
		        gen("if(o.arrays||o.defaults){");
		        for (i = 0; i < repeatedFields.length; ++i) gen("d%s=[]", util.safeProp(repeatedFields[i].name));
		        gen("}");
		      }
		      if (mapFields.length) {
		        gen("if(o.objects||o.defaults){");
		        for (i = 0; i < mapFields.length; ++i) gen("d%s={}", util.safeProp(mapFields[i].name));
		        gen("}");
		      }
		      if (normalFields.length) {
		        gen("if(o.defaults){");
		        for (i = 0; i < normalFields.length; ++i) {
		          var field = normalFields[i], prop = util.safeProp(field.name);
		          if (field.resolvedType instanceof Enum) gen("d%s=o.enums===String?%j:%j", prop, field.resolvedType.valuesById[field.typeDefault], field.typeDefault);
		          else if (field.long) gen("if(util.Long){")("var n=new util.Long(%i,%i,%j)", field.typeDefault.low, field.typeDefault.high, field.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n", prop)("}else")("d%s=o.longs===String?%j:%i", prop, field.typeDefault.toString(), field.typeDefault.toNumber());
		          else if (field.bytes) gen("d%s=o.bytes===String?%j:%s", prop, String.fromCharCode.apply(String, field.typeDefault), "[" + Array.prototype.slice.call(field.typeDefault).join(",") + "]");
		          else gen("d%s=%j", prop, field.typeDefault);
		        }
		        gen("}");
		      }
		      var hasKs2 = false;
		      for (i = 0; i < fields.length; ++i) {
		        var field = fields[i], index = mtype._fieldsArray.indexOf(field), prop = util.safeProp(field.name);
		        if (field.map) {
		          if (!hasKs2) {
		            hasKs2 = true;
		            gen("var ks2");
		          }
		          gen("if(m%s&&(ks2=Object.keys(m%s)).length){", prop, prop)("d%s={}", prop)("for(var j=0;j<ks2.length;++j){");
		          genValuePartial_toObject(
		            gen,
		            field,
		            /* sorted */
		            index,
		            prop + "[ks2[j]]"
		          )("}");
		        } else if (field.repeated) {
		          gen("if(m%s&&m%s.length){", prop, prop)("d%s=[]", prop)("for(var j=0;j<m%s.length;++j){", prop);
		          genValuePartial_toObject(
		            gen,
		            field,
		            /* sorted */
		            index,
		            prop + "[j]"
		          )("}");
		        } else {
		          gen("if(m%s!=null&&m.hasOwnProperty(%j)){", prop, field.name);
		          genValuePartial_toObject(
		            gen,
		            field,
		            /* sorted */
		            index,
		            prop
		          );
		          if (field.partOf) gen("if(o.oneofs)")("d%s=%j", util.safeProp(field.partOf.name), field.name);
		        }
		        gen("}");
		      }
		      return gen("return d");
		    };
		  }, { "15": 15, "37": 37 }], 13: [function(require, module2, exports) {
		    module2.exports = decoder;
		    var Enum = require(15), types = require(36), util = require(37);
		    function missing(field) {
		      return "missing required '" + field.name + "'";
		    }
		    function decoder(mtype) {
		      var gen = util.codegen(["r", "l"], mtype.name + "$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (mtype.fieldsArray.filter(function(field2) {
		        return field2.map;
		      }).length ? ",k" : ""))("while(r.pos<c){")("var t=r.uint32()");
		      if (mtype.group) gen("if((t&7)===4)")("break");
		      gen("switch(t>>>3){");
		      var i = 0;
		      for (; i < /* initializes */
		      mtype.fieldsArray.length; ++i) {
		        var field = mtype._fieldsArray[i].resolve(), type = field.resolvedType instanceof Enum ? "int32" : field.type, ref = "m" + util.safeProp(field.name);
		        gen("case %i:", field.id);
		        if (field.map) {
		          gen("r.skip().pos++")("if(%s===util.emptyObject)", ref)("%s={}", ref)("k=r.%s()", field.keyType)("r.pos++");
		          if (types.long[field.keyType] !== undefined$1) {
		            if (types.basic[type] === undefined$1) gen('%s[typeof k==="object"?util.longToHash(k):k]=types[%i].decode(r,r.uint32())', ref, i);
		            else gen('%s[typeof k==="object"?util.longToHash(k):k]=r.%s()', ref, type);
		          } else {
		            if (types.basic[type] === undefined$1) gen("%s[k]=types[%i].decode(r,r.uint32())", ref, i);
		            else gen("%s[k]=r.%s()", ref, type);
		          }
		        } else if (field.repeated) {
		          gen("if(!(%s&&%s.length))", ref, ref)("%s=[]", ref);
		          if (types.packed[type] !== undefined$1) gen("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())", ref, type)("}else");
		          if (types.basic[type] === undefined$1) gen(field.resolvedType.group ? "%s.push(types[%i].decode(r))" : "%s.push(types[%i].decode(r,r.uint32()))", ref, i);
		          else gen("%s.push(r.%s())", ref, type);
		        } else if (types.basic[type] === undefined$1) gen(field.resolvedType.group ? "%s=types[%i].decode(r)" : "%s=types[%i].decode(r,r.uint32())", ref, i);
		        else gen("%s=r.%s()", ref, type);
		        gen("break");
		      }
		      gen("default:")("r.skipType(t&7)")("break")("}")("}");
		      for (i = 0; i < mtype._fieldsArray.length; ++i) {
		        var rfield = mtype._fieldsArray[i];
		        if (rfield.required) gen("if(!m.hasOwnProperty(%j))", rfield.name)("throw util.ProtocolError(%j,{instance:m})", missing(rfield));
		      }
		      return gen("return m");
		    }
		  }, { "15": 15, "36": 36, "37": 37 }], 14: [function(require, module2, exports) {
		    module2.exports = encoder;
		    var Enum = require(15), types = require(36), util = require(37);
		    function genTypePartial(gen, field, fieldIndex, ref) {
		      return field.resolvedType.group ? gen("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", fieldIndex, ref, (field.id << 3 | 3) >>> 0, (field.id << 3 | 4) >>> 0) : gen("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", fieldIndex, ref, (field.id << 3 | 2) >>> 0);
		    }
		    function encoder(mtype) {
		      var gen = util.codegen(["m", "w"], mtype.name + "$encode")("if(!w)")("w=Writer.create()");
		      var i, ref;
		      var fields = (
		        /* initializes */
		        mtype.fieldsArray.slice().sort(util.compareFieldsById)
		      );
		      for (var i = 0; i < fields.length; ++i) {
		        var field = fields[i].resolve(), index = mtype._fieldsArray.indexOf(field), type = field.resolvedType instanceof Enum ? "int32" : field.type, wireType = types.basic[type];
		        ref = "m" + util.safeProp(field.name);
		        if (field.map) {
		          gen("if(%s!=null&&m.hasOwnProperty(%j)){", ref, field.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", ref)("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (field.id << 3 | 2) >>> 0, 8 | types.mapKey[field.keyType], field.keyType);
		          if (wireType === undefined$1) gen("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", index, ref);
		          else gen(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | wireType, type, ref);
		          gen("}")("}");
		        } else if (field.repeated) {
		          gen("if(%s!=null&&%s.length){", ref, ref);
		          if (field.packed && types.packed[type] !== undefined$1) {
		            gen("w.uint32(%i).fork()", (field.id << 3 | 2) >>> 0)("for(var i=0;i<%s.length;++i)", ref)("w.%s(%s[i])", type, ref)("w.ldelim()");
		          } else {
		            gen("for(var i=0;i<%s.length;++i)", ref);
		            if (wireType === undefined$1)
		              genTypePartial(gen, field, index, ref + "[i]");
		            else gen("w.uint32(%i).%s(%s[i])", (field.id << 3 | wireType) >>> 0, type, ref);
		          }
		          gen("}");
		        } else {
		          if (field.optional) gen("if(%s!=null&&m.hasOwnProperty(%j))", ref, field.name);
		          if (wireType === undefined$1)
		            genTypePartial(gen, field, index, ref);
		          else gen("w.uint32(%i).%s(%s)", (field.id << 3 | wireType) >>> 0, type, ref);
		        }
		      }
		      return gen("return w");
		    }
		  }, { "15": 15, "36": 36, "37": 37 }], 15: [function(require, module2, exports) {
		    module2.exports = Enum;
		    var ReflectionObject = require(24);
		    ((Enum.prototype = Object.create(ReflectionObject.prototype)).constructor = Enum).className = "Enum";
		    var Namespace = require(23), util = require(37);
		    function Enum(name, values, options, comment, comments) {
		      ReflectionObject.call(this, name, options);
		      if (values && typeof values !== "object")
		        throw TypeError("values must be an object");
		      this.valuesById = {};
		      this.values = Object.create(this.valuesById);
		      this.comment = comment;
		      this.comments = comments || {};
		      this.reserved = undefined$1;
		      if (values) {
		        for (var keys = Object.keys(values), i = 0; i < keys.length; ++i)
		          if (typeof values[keys[i]] === "number")
		            this.valuesById[this.values[keys[i]] = values[keys[i]]] = keys[i];
		      }
		    }
		    Enum.fromJSON = function fromJSON(name, json) {
		      var enm = new Enum(name, json.values, json.options, json.comment, json.comments);
		      enm.reserved = json.reserved;
		      return enm;
		    };
		    Enum.prototype.toJSON = function toJSON(toJSONOptions) {
		      var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
		      return util.toObject([
		        "options",
		        this.options,
		        "values",
		        this.values,
		        "reserved",
		        this.reserved && this.reserved.length ? this.reserved : undefined$1,
		        "comment",
		        keepComments ? this.comment : undefined$1,
		        "comments",
		        keepComments ? this.comments : undefined$1
		      ]);
		    };
		    Enum.prototype.add = function add(name, id, comment) {
		      if (!util.isString(name))
		        throw TypeError("name must be a string");
		      if (!util.isInteger(id))
		        throw TypeError("id must be an integer");
		      if (this.values[name] !== undefined$1)
		        throw Error("duplicate name '" + name + "' in " + this);
		      if (this.isReservedId(id))
		        throw Error("id " + id + " is reserved in " + this);
		      if (this.isReservedName(name))
		        throw Error("name '" + name + "' is reserved in " + this);
		      if (this.valuesById[id] !== undefined$1) {
		        if (!(this.options && this.options.allow_alias))
		          throw Error("duplicate id " + id + " in " + this);
		        this.values[name] = id;
		      } else
		        this.valuesById[this.values[name] = id] = name;
		      this.comments[name] = comment || null;
		      return this;
		    };
		    Enum.prototype.remove = function remove(name) {
		      if (!util.isString(name))
		        throw TypeError("name must be a string");
		      var val = this.values[name];
		      if (val == null)
		        throw Error("name '" + name + "' does not exist in " + this);
		      delete this.valuesById[val];
		      delete this.values[name];
		      delete this.comments[name];
		      return this;
		    };
		    Enum.prototype.isReservedId = function isReservedId(id) {
		      return Namespace.isReservedId(this.reserved, id);
		    };
		    Enum.prototype.isReservedName = function isReservedName(name) {
		      return Namespace.isReservedName(this.reserved, name);
		    };
		  }, { "23": 23, "24": 24, "37": 37 }], 16: [function(require, module2, exports) {
		    module2.exports = Field;
		    var ReflectionObject = require(24);
		    ((Field.prototype = Object.create(ReflectionObject.prototype)).constructor = Field).className = "Field";
		    var Enum = require(15), types = require(36), util = require(37);
		    var Type;
		    var ruleRe = /^required|optional|repeated$/;
		    Field.fromJSON = function fromJSON(name, json) {
		      return new Field(name, json.id, json.type, json.rule, json.extend, json.options, json.comment);
		    };
		    function Field(name, id, type, rule, extend, options, comment) {
		      if (util.isObject(rule)) {
		        comment = extend;
		        options = rule;
		        rule = extend = undefined$1;
		      } else if (util.isObject(extend)) {
		        comment = options;
		        options = extend;
		        extend = undefined$1;
		      }
		      ReflectionObject.call(this, name, options);
		      if (!util.isInteger(id) || id < 0)
		        throw TypeError("id must be a non-negative integer");
		      if (!util.isString(type))
		        throw TypeError("type must be a string");
		      if (rule !== undefined$1 && !ruleRe.test(rule = rule.toString().toLowerCase()))
		        throw TypeError("rule must be a string rule");
		      if (extend !== undefined$1 && !util.isString(extend))
		        throw TypeError("extend must be a string");
		      this.rule = rule && rule !== "optional" ? rule : undefined$1;
		      this.type = type;
		      this.id = id;
		      this.extend = extend || undefined$1;
		      this.required = rule === "required";
		      this.optional = !this.required;
		      this.repeated = rule === "repeated";
		      this.map = false;
		      this.message = null;
		      this.partOf = null;
		      this.typeDefault = null;
		      this.defaultValue = null;
		      this.long = util.Long ? types.long[type] !== undefined$1 : (
		        /* istanbul ignore next */
		        false
		      );
		      this.bytes = type === "bytes";
		      this.resolvedType = null;
		      this.extensionField = null;
		      this.declaringField = null;
		      this._packed = null;
		      this.comment = comment;
		    }
		    Object.defineProperty(Field.prototype, "packed", {
		      get: function() {
		        if (this._packed === null)
		          this._packed = this.getOption("packed") !== false;
		        return this._packed;
		      }
		    });
		    Field.prototype.setOption = function setOption(name, value, ifNotSet) {
		      if (name === "packed")
		        this._packed = null;
		      return ReflectionObject.prototype.setOption.call(this, name, value, ifNotSet);
		    };
		    Field.prototype.toJSON = function toJSON(toJSONOptions) {
		      var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
		      return util.toObject([
		        "rule",
		        this.rule !== "optional" && this.rule || undefined$1,
		        "type",
		        this.type,
		        "id",
		        this.id,
		        "extend",
		        this.extend,
		        "options",
		        this.options,
		        "comment",
		        keepComments ? this.comment : undefined$1
		      ]);
		    };
		    Field.prototype.resolve = function resolve() {
		      if (this.resolved)
		        return this;
		      if ((this.typeDefault = types.defaults[this.type]) === undefined$1) {
		        this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type);
		        if (this.resolvedType instanceof Type)
		          this.typeDefault = null;
		        else
		          this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]];
		      }
		      if (this.options && this.options["default"] != null) {
		        this.typeDefault = this.options["default"];
		        if (this.resolvedType instanceof Enum && typeof this.typeDefault === "string")
		          this.typeDefault = this.resolvedType.values[this.typeDefault];
		      }
		      if (this.options) {
		        if (this.options.packed === true || this.options.packed !== undefined$1 && this.resolvedType && !(this.resolvedType instanceof Enum))
		          delete this.options.packed;
		        if (!Object.keys(this.options).length)
		          this.options = undefined$1;
		      }
		      if (this.long) {
		        this.typeDefault = util.Long.fromNumber(this.typeDefault, this.type.charAt(0) === "u");
		        if (Object.freeze)
		          Object.freeze(this.typeDefault);
		      } else if (this.bytes && typeof this.typeDefault === "string") {
		        var buf;
		        if (util.base64.test(this.typeDefault))
		          util.base64.decode(this.typeDefault, buf = util.newBuffer(util.base64.length(this.typeDefault)), 0);
		        else
		          util.utf8.write(this.typeDefault, buf = util.newBuffer(util.utf8.length(this.typeDefault)), 0);
		        this.typeDefault = buf;
		      }
		      if (this.map)
		        this.defaultValue = util.emptyObject;
		      else if (this.repeated)
		        this.defaultValue = util.emptyArray;
		      else
		        this.defaultValue = this.typeDefault;
		      if (this.parent instanceof Type)
		        this.parent.ctor.prototype[this.name] = this.defaultValue;
		      return ReflectionObject.prototype.resolve.call(this);
		    };
		    Field.d = function decorateField(fieldId, fieldType, fieldRule, defaultValue) {
		      if (typeof fieldType === "function")
		        fieldType = util.decorateType(fieldType).name;
		      else if (fieldType && typeof fieldType === "object")
		        fieldType = util.decorateEnum(fieldType).name;
		      return function fieldDecorator(prototype, fieldName) {
		        util.decorateType(prototype.constructor).add(new Field(fieldName, fieldId, fieldType, fieldRule, { "default": defaultValue }));
		      };
		    };
		    Field._configure = function configure(Type_) {
		      Type = Type_;
		    };
		  }, { "15": 15, "24": 24, "36": 36, "37": 37 }], 17: [function(require, module2, exports) {
		    var protobuf = module2.exports = require(18);
		    protobuf.build = "light";
		    function load(filename, root, callback) {
		      if (typeof root === "function") {
		        callback = root;
		        root = new protobuf.Root();
		      } else if (!root)
		        root = new protobuf.Root();
		      return root.load(filename, callback);
		    }
		    protobuf.load = load;
		    function loadSync(filename, root) {
		      if (!root)
		        root = new protobuf.Root();
		      return root.loadSync(filename);
		    }
		    protobuf.loadSync = loadSync;
		    protobuf.encoder = require(14);
		    protobuf.decoder = require(13);
		    protobuf.verifier = require(40);
		    protobuf.converter = require(12);
		    protobuf.ReflectionObject = require(24);
		    protobuf.Namespace = require(23);
		    protobuf.Root = require(29);
		    protobuf.Enum = require(15);
		    protobuf.Type = require(35);
		    protobuf.Field = require(16);
		    protobuf.OneOf = require(25);
		    protobuf.MapField = require(20);
		    protobuf.Service = require(33);
		    protobuf.Method = require(22);
		    protobuf.Message = require(21);
		    protobuf.wrappers = require(41);
		    protobuf.types = require(36);
		    protobuf.util = require(37);
		    protobuf.ReflectionObject._configure(protobuf.Root);
		    protobuf.Namespace._configure(protobuf.Type, protobuf.Service);
		    protobuf.Root._configure(protobuf.Type);
		    protobuf.Field._configure(protobuf.Type);
		  }, { "12": 12, "13": 13, "14": 14, "15": 15, "16": 16, "18": 18, "20": 20, "21": 21, "22": 22, "23": 23, "24": 24, "25": 25, "29": 29, "33": 33, "35": 35, "36": 36, "37": 37, "40": 40, "41": 41 }], 18: [function(require, module2, exports) {
		    var protobuf = exports;
		    protobuf.build = "minimal";
		    protobuf.Writer = require(42);
		    protobuf.BufferWriter = require(43);
		    protobuf.Reader = require(27);
		    protobuf.BufferReader = require(28);
		    protobuf.util = require(39);
		    protobuf.rpc = require(31);
		    protobuf.roots = require(30);
		    protobuf.configure = configure;
		    function configure() {
		      protobuf.Reader._configure(protobuf.BufferReader);
		      protobuf.util._configure();
		    }
		    protobuf.Writer._configure(protobuf.BufferWriter);
		    configure();
		  }, { "27": 27, "28": 28, "30": 30, "31": 31, "39": 39, "42": 42, "43": 43 }], 19: [function(require, module2, exports) {
		    var protobuf = module2.exports = require(17);
		    protobuf.build = "full";
		    protobuf.tokenize = require(34);
		    protobuf.parse = require(26);
		    protobuf.common = require(11);
		    protobuf.Root._configure(protobuf.Type, protobuf.parse, protobuf.common);
		  }, { "11": 11, "17": 17, "26": 26, "34": 34 }], 20: [function(require, module2, exports) {
		    module2.exports = MapField;
		    var Field = require(16);
		    ((MapField.prototype = Object.create(Field.prototype)).constructor = MapField).className = "MapField";
		    var types = require(36), util = require(37);
		    function MapField(name, id, keyType, type, options, comment) {
		      Field.call(this, name, id, type, undefined$1, undefined$1, options, comment);
		      if (!util.isString(keyType))
		        throw TypeError("keyType must be a string");
		      this.keyType = keyType;
		      this.resolvedKeyType = null;
		      this.map = true;
		    }
		    MapField.fromJSON = function fromJSON(name, json) {
		      return new MapField(name, json.id, json.keyType, json.type, json.options, json.comment);
		    };
		    MapField.prototype.toJSON = function toJSON(toJSONOptions) {
		      var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
		      return util.toObject([
		        "keyType",
		        this.keyType,
		        "type",
		        this.type,
		        "id",
		        this.id,
		        "extend",
		        this.extend,
		        "options",
		        this.options,
		        "comment",
		        keepComments ? this.comment : undefined$1
		      ]);
		    };
		    MapField.prototype.resolve = function resolve() {
		      if (this.resolved)
		        return this;
		      if (types.mapKey[this.keyType] === undefined$1)
		        throw Error("invalid key type: " + this.keyType);
		      return Field.prototype.resolve.call(this);
		    };
		    MapField.d = function decorateMapField(fieldId, fieldKeyType, fieldValueType) {
		      if (typeof fieldValueType === "function")
		        fieldValueType = util.decorateType(fieldValueType).name;
		      else if (fieldValueType && typeof fieldValueType === "object")
		        fieldValueType = util.decorateEnum(fieldValueType).name;
		      return function mapFieldDecorator(prototype, fieldName) {
		        util.decorateType(prototype.constructor).add(new MapField(fieldName, fieldId, fieldKeyType, fieldValueType));
		      };
		    };
		  }, { "16": 16, "36": 36, "37": 37 }], 21: [function(require, module2, exports) {
		    module2.exports = Message;
		    var util = require(39);
		    function Message(properties) {
		      if (properties)
		        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
		          this[keys[i]] = properties[keys[i]];
		    }
		    Message.create = function create(properties) {
		      return this.$type.create(properties);
		    };
		    Message.encode = function encode(message, writer) {
		      return this.$type.encode(message, writer);
		    };
		    Message.encodeDelimited = function encodeDelimited(message, writer) {
		      return this.$type.encodeDelimited(message, writer);
		    };
		    Message.decode = function decode(reader) {
		      return this.$type.decode(reader);
		    };
		    Message.decodeDelimited = function decodeDelimited(reader) {
		      return this.$type.decodeDelimited(reader);
		    };
		    Message.verify = function verify(message) {
		      return this.$type.verify(message);
		    };
		    Message.fromObject = function fromObject(object) {
		      return this.$type.fromObject(object);
		    };
		    Message.toObject = function toObject(message, options) {
		      return this.$type.toObject(message, options);
		    };
		    Message.prototype.toJSON = function toJSON() {
		      return this.$type.toObject(this, util.toJSONOptions);
		    };
		  }, { "39": 39 }], 22: [function(require, module2, exports) {
		    module2.exports = Method;
		    var ReflectionObject = require(24);
		    ((Method.prototype = Object.create(ReflectionObject.prototype)).constructor = Method).className = "Method";
		    var util = require(37);
		    function Method(name, type, requestType, responseType, requestStream, responseStream, options, comment) {
		      if (util.isObject(requestStream)) {
		        options = requestStream;
		        requestStream = responseStream = undefined$1;
		      } else if (util.isObject(responseStream)) {
		        options = responseStream;
		        responseStream = undefined$1;
		      }
		      if (!(type === undefined$1 || util.isString(type)))
		        throw TypeError("type must be a string");
		      if (!util.isString(requestType))
		        throw TypeError("requestType must be a string");
		      if (!util.isString(responseType))
		        throw TypeError("responseType must be a string");
		      ReflectionObject.call(this, name, options);
		      this.type = type || "rpc";
		      this.requestType = requestType;
		      this.requestStream = requestStream ? true : undefined$1;
		      this.responseType = responseType;
		      this.responseStream = responseStream ? true : undefined$1;
		      this.resolvedRequestType = null;
		      this.resolvedResponseType = null;
		      this.comment = comment;
		    }
		    Method.fromJSON = function fromJSON(name, json) {
		      return new Method(name, json.type, json.requestType, json.responseType, json.requestStream, json.responseStream, json.options, json.comment);
		    };
		    Method.prototype.toJSON = function toJSON(toJSONOptions) {
		      var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
		      return util.toObject([
		        "type",
		        this.type !== "rpc" && /* istanbul ignore next */
		        this.type || undefined$1,
		        "requestType",
		        this.requestType,
		        "requestStream",
		        this.requestStream,
		        "responseType",
		        this.responseType,
		        "responseStream",
		        this.responseStream,
		        "options",
		        this.options,
		        "comment",
		        keepComments ? this.comment : undefined$1
		      ]);
		    };
		    Method.prototype.resolve = function resolve() {
		      if (this.resolved)
		        return this;
		      this.resolvedRequestType = this.parent.lookupType(this.requestType);
		      this.resolvedResponseType = this.parent.lookupType(this.responseType);
		      return ReflectionObject.prototype.resolve.call(this);
		    };
		  }, { "24": 24, "37": 37 }], 23: [function(require, module2, exports) {
		    module2.exports = Namespace;
		    var ReflectionObject = require(24);
		    ((Namespace.prototype = Object.create(ReflectionObject.prototype)).constructor = Namespace).className = "Namespace";
		    var Enum = require(15), Field = require(16), util = require(37);
		    var Type, Service;
		    Namespace.fromJSON = function fromJSON(name, json) {
		      return new Namespace(name, json.options).addJSON(json.nested);
		    };
		    function arrayToJSON(array, toJSONOptions) {
		      if (!(array && array.length))
		        return undefined$1;
		      var obj = {};
		      for (var i = 0; i < array.length; ++i)
		        obj[array[i].name] = array[i].toJSON(toJSONOptions);
		      return obj;
		    }
		    Namespace.arrayToJSON = arrayToJSON;
		    Namespace.isReservedId = function isReservedId(reserved, id) {
		      if (reserved) {
		        for (var i = 0; i < reserved.length; ++i)
		          if (typeof reserved[i] !== "string" && reserved[i][0] <= id && reserved[i][1] >= id)
		            return true;
		      }
		      return false;
		    };
		    Namespace.isReservedName = function isReservedName(reserved, name) {
		      if (reserved) {
		        for (var i = 0; i < reserved.length; ++i)
		          if (reserved[i] === name)
		            return true;
		      }
		      return false;
		    };
		    function Namespace(name, options) {
		      ReflectionObject.call(this, name, options);
		      this.nested = undefined$1;
		      this._nestedArray = null;
		    }
		    function clearCache(namespace) {
		      namespace._nestedArray = null;
		      return namespace;
		    }
		    Object.defineProperty(Namespace.prototype, "nestedArray", {
		      get: function() {
		        return this._nestedArray || (this._nestedArray = util.toArray(this.nested));
		      }
		    });
		    Namespace.prototype.toJSON = function toJSON(toJSONOptions) {
		      return util.toObject([
		        "options",
		        this.options,
		        "nested",
		        arrayToJSON(this.nestedArray, toJSONOptions)
		      ]);
		    };
		    Namespace.prototype.addJSON = function addJSON(nestedJson) {
		      var ns = this;
		      if (nestedJson) {
		        for (var names = Object.keys(nestedJson), i = 0, nested; i < names.length; ++i) {
		          nested = nestedJson[names[i]];
		          ns.add(
		            // most to least likely
		            (nested.fields !== undefined$1 ? Type.fromJSON : nested.values !== undefined$1 ? Enum.fromJSON : nested.methods !== undefined$1 ? Service.fromJSON : nested.id !== undefined$1 ? Field.fromJSON : Namespace.fromJSON)(names[i], nested)
		          );
		        }
		      }
		      return this;
		    };
		    Namespace.prototype.get = function get(name) {
		      return this.nested && this.nested[name] || null;
		    };
		    Namespace.prototype.getEnum = function getEnum(name) {
		      if (this.nested && this.nested[name] instanceof Enum)
		        return this.nested[name].values;
		      throw Error("no such enum: " + name);
		    };
		    Namespace.prototype.add = function add(object) {
		      if (!(object instanceof Field && object.extend !== undefined$1 || object instanceof Type || object instanceof Enum || object instanceof Service || object instanceof Namespace))
		        throw TypeError("object must be a valid nested object");
		      if (!this.nested)
		        this.nested = {};
		      else {
		        var prev = this.get(object.name);
		        if (prev) {
		          if (prev instanceof Namespace && object instanceof Namespace && !(prev instanceof Type || prev instanceof Service)) {
		            var nested = prev.nestedArray;
		            for (var i = 0; i < nested.length; ++i)
		              object.add(nested[i]);
		            this.remove(prev);
		            if (!this.nested)
		              this.nested = {};
		            object.setOptions(prev.options, true);
		          } else
		            throw Error("duplicate name '" + object.name + "' in " + this);
		        }
		      }
		      this.nested[object.name] = object;
		      object.onAdd(this);
		      return clearCache(this);
		    };
		    Namespace.prototype.remove = function remove(object) {
		      if (!(object instanceof ReflectionObject))
		        throw TypeError("object must be a ReflectionObject");
		      if (object.parent !== this)
		        throw Error(object + " is not a member of " + this);
		      delete this.nested[object.name];
		      if (!Object.keys(this.nested).length)
		        this.nested = undefined$1;
		      object.onRemove(this);
		      return clearCache(this);
		    };
		    Namespace.prototype.define = function define(path, json) {
		      if (util.isString(path))
		        path = path.split(".");
		      else if (!Array.isArray(path))
		        throw TypeError("illegal path");
		      if (path && path.length && path[0] === "")
		        throw Error("path must be relative");
		      var ptr = this;
		      while (path.length > 0) {
		        var part = path.shift();
		        if (ptr.nested && ptr.nested[part]) {
		          ptr = ptr.nested[part];
		          if (!(ptr instanceof Namespace))
		            throw Error("path conflicts with non-namespace objects");
		        } else
		          ptr.add(ptr = new Namespace(part));
		      }
		      if (json)
		        ptr.addJSON(json);
		      return ptr;
		    };
		    Namespace.prototype.resolveAll = function resolveAll() {
		      var nested = this.nestedArray, i = 0;
		      while (i < nested.length)
		        if (nested[i] instanceof Namespace)
		          nested[i++].resolveAll();
		        else
		          nested[i++].resolve();
		      return this.resolve();
		    };
		    Namespace.prototype.lookup = function lookup(path, filterTypes, parentAlreadyChecked) {
		      if (typeof filterTypes === "boolean") {
		        parentAlreadyChecked = filterTypes;
		        filterTypes = undefined$1;
		      } else if (filterTypes && !Array.isArray(filterTypes))
		        filterTypes = [filterTypes];
		      if (util.isString(path) && path.length) {
		        if (path === ".")
		          return this.root;
		        path = path.split(".");
		      } else if (!path.length)
		        return this;
		      if (path[0] === "")
		        return this.root.lookup(path.slice(1), filterTypes);
		      var found = this.get(path[0]);
		      if (found) {
		        if (path.length === 1) {
		          if (!filterTypes || filterTypes.indexOf(found.constructor) > -1)
		            return found;
		        } else if (found instanceof Namespace && (found = found.lookup(path.slice(1), filterTypes, true)))
		          return found;
		      } else
		        for (var i = 0; i < this.nestedArray.length; ++i)
		          if (this._nestedArray[i] instanceof Namespace && (found = this._nestedArray[i].lookup(path, filterTypes, true)))
		            return found;
		      if (this.parent === null || parentAlreadyChecked)
		        return null;
		      return this.parent.lookup(path, filterTypes);
		    };
		    Namespace.prototype.lookupType = function lookupType(path) {
		      var found = this.lookup(path, [Type]);
		      if (!found)
		        throw Error("no such type: " + path);
		      return found;
		    };
		    Namespace.prototype.lookupEnum = function lookupEnum(path) {
		      var found = this.lookup(path, [Enum]);
		      if (!found)
		        throw Error("no such Enum '" + path + "' in " + this);
		      return found;
		    };
		    Namespace.prototype.lookupTypeOrEnum = function lookupTypeOrEnum(path) {
		      var found = this.lookup(path, [Type, Enum]);
		      if (!found)
		        throw Error("no such Type or Enum '" + path + "' in " + this);
		      return found;
		    };
		    Namespace.prototype.lookupService = function lookupService(path) {
		      var found = this.lookup(path, [Service]);
		      if (!found)
		        throw Error("no such Service '" + path + "' in " + this);
		      return found;
		    };
		    Namespace._configure = function(Type_, Service_) {
		      Type = Type_;
		      Service = Service_;
		    };
		  }, { "15": 15, "16": 16, "24": 24, "37": 37 }], 24: [function(require, module2, exports) {
		    module2.exports = ReflectionObject;
		    ReflectionObject.className = "ReflectionObject";
		    var util = require(37);
		    var Root;
		    function ReflectionObject(name, options) {
		      if (!util.isString(name))
		        throw TypeError("name must be a string");
		      if (options && !util.isObject(options))
		        throw TypeError("options must be an object");
		      this.options = options;
		      this.name = name;
		      this.parent = null;
		      this.resolved = false;
		      this.comment = null;
		      this.filename = null;
		    }
		    Object.defineProperties(ReflectionObject.prototype, {
		      /**
		       * Reference to the root namespace.
		       * @name ReflectionObject#root
		       * @type {Root}
		       * @readonly
		       */
		      root: {
		        get: function() {
		          var ptr = this;
		          while (ptr.parent !== null)
		            ptr = ptr.parent;
		          return ptr;
		        }
		      },
		      /**
		       * Full name including leading dot.
		       * @name ReflectionObject#fullName
		       * @type {string}
		       * @readonly
		       */
		      fullName: {
		        get: function() {
		          var path = [this.name], ptr = this.parent;
		          while (ptr) {
		            path.unshift(ptr.name);
		            ptr = ptr.parent;
		          }
		          return path.join(".");
		        }
		      }
		    });
		    ReflectionObject.prototype.toJSON = /* istanbul ignore next */
		    function toJSON() {
		      throw Error();
		    };
		    ReflectionObject.prototype.onAdd = function onAdd(parent) {
		      if (this.parent && this.parent !== parent)
		        this.parent.remove(this);
		      this.parent = parent;
		      this.resolved = false;
		      var root = parent.root;
		      if (root instanceof Root)
		        root._handleAdd(this);
		    };
		    ReflectionObject.prototype.onRemove = function onRemove(parent) {
		      var root = parent.root;
		      if (root instanceof Root)
		        root._handleRemove(this);
		      this.parent = null;
		      this.resolved = false;
		    };
		    ReflectionObject.prototype.resolve = function resolve() {
		      if (this.resolved)
		        return this;
		      if (this.root instanceof Root)
		        this.resolved = true;
		      return this;
		    };
		    ReflectionObject.prototype.getOption = function getOption(name) {
		      if (this.options)
		        return this.options[name];
		      return undefined$1;
		    };
		    ReflectionObject.prototype.setOption = function setOption(name, value, ifNotSet) {
		      if (!ifNotSet || !this.options || this.options[name] === undefined$1)
		        (this.options || (this.options = {}))[name] = value;
		      return this;
		    };
		    ReflectionObject.prototype.setOptions = function setOptions(options, ifNotSet) {
		      if (options)
		        for (var keys = Object.keys(options), i = 0; i < keys.length; ++i)
		          this.setOption(keys[i], options[keys[i]], ifNotSet);
		      return this;
		    };
		    ReflectionObject.prototype.toString = function toString() {
		      var className = this.constructor.className, fullName = this.fullName;
		      if (fullName.length)
		        return className + " " + fullName;
		      return className;
		    };
		    ReflectionObject._configure = function(Root_) {
		      Root = Root_;
		    };
		  }, { "37": 37 }], 25: [function(require, module2, exports) {
		    module2.exports = OneOf;
		    var ReflectionObject = require(24);
		    ((OneOf.prototype = Object.create(ReflectionObject.prototype)).constructor = OneOf).className = "OneOf";
		    var Field = require(16), util = require(37);
		    function OneOf(name, fieldNames, options, comment) {
		      if (!Array.isArray(fieldNames)) {
		        options = fieldNames;
		        fieldNames = undefined$1;
		      }
		      ReflectionObject.call(this, name, options);
		      if (!(fieldNames === undefined$1 || Array.isArray(fieldNames)))
		        throw TypeError("fieldNames must be an Array");
		      this.oneof = fieldNames || [];
		      this.fieldsArray = [];
		      this.comment = comment;
		    }
		    OneOf.fromJSON = function fromJSON(name, json) {
		      return new OneOf(name, json.oneof, json.options, json.comment);
		    };
		    OneOf.prototype.toJSON = function toJSON(toJSONOptions) {
		      var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
		      return util.toObject([
		        "options",
		        this.options,
		        "oneof",
		        this.oneof,
		        "comment",
		        keepComments ? this.comment : undefined$1
		      ]);
		    };
		    function addFieldsToParent(oneof) {
		      if (oneof.parent) {
		        for (var i = 0; i < oneof.fieldsArray.length; ++i)
		          if (!oneof.fieldsArray[i].parent)
		            oneof.parent.add(oneof.fieldsArray[i]);
		      }
		    }
		    OneOf.prototype.add = function add(field) {
		      if (!(field instanceof Field))
		        throw TypeError("field must be a Field");
		      if (field.parent && field.parent !== this.parent)
		        field.parent.remove(field);
		      this.oneof.push(field.name);
		      this.fieldsArray.push(field);
		      field.partOf = this;
		      addFieldsToParent(this);
		      return this;
		    };
		    OneOf.prototype.remove = function remove(field) {
		      if (!(field instanceof Field))
		        throw TypeError("field must be a Field");
		      var index = this.fieldsArray.indexOf(field);
		      if (index < 0)
		        throw Error(field + " is not a member of " + this);
		      this.fieldsArray.splice(index, 1);
		      index = this.oneof.indexOf(field.name);
		      if (index > -1)
		        this.oneof.splice(index, 1);
		      field.partOf = null;
		      return this;
		    };
		    OneOf.prototype.onAdd = function onAdd(parent) {
		      ReflectionObject.prototype.onAdd.call(this, parent);
		      var self = this;
		      for (var i = 0; i < this.oneof.length; ++i) {
		        var field = parent.get(this.oneof[i]);
		        if (field && !field.partOf) {
		          field.partOf = self;
		          self.fieldsArray.push(field);
		        }
		      }
		      addFieldsToParent(this);
		    };
		    OneOf.prototype.onRemove = function onRemove(parent) {
		      for (var i = 0, field; i < this.fieldsArray.length; ++i)
		        if ((field = this.fieldsArray[i]).parent)
		          field.parent.remove(field);
		      ReflectionObject.prototype.onRemove.call(this, parent);
		    };
		    OneOf.d = function decorateOneOf() {
		      var fieldNames = new Array(arguments.length), index = 0;
		      while (index < arguments.length)
		        fieldNames[index] = arguments[index++];
		      return function oneOfDecorator(prototype, oneofName) {
		        util.decorateType(prototype.constructor).add(new OneOf(oneofName, fieldNames));
		        Object.defineProperty(prototype, oneofName, {
		          get: util.oneOfGetter(fieldNames),
		          set: util.oneOfSetter(fieldNames)
		        });
		      };
		    };
		  }, { "16": 16, "24": 24, "37": 37 }], 26: [function(require, module2, exports) {
		    module2.exports = parse;
		    parse.filename = null;
		    parse.defaults = { keepCase: false };
		    var tokenize = require(34), Root = require(29), Type = require(35), Field = require(16), MapField = require(20), OneOf = require(25), Enum = require(15), Service = require(33), Method = require(22), types = require(36), util = require(37);
		    var base10Re = /^[1-9][0-9]*$/, base10NegRe = /^-?[1-9][0-9]*$/, base16Re = /^0[x][0-9a-fA-F]+$/, base16NegRe = /^-?0[x][0-9a-fA-F]+$/, base8Re = /^0[0-7]+$/, base8NegRe = /^-?0[0-7]+$/, numberRe = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/, nameRe = /^[a-zA-Z_][a-zA-Z_0-9]*$/, typeRefRe = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)(?:\.[a-zA-Z_][a-zA-Z_0-9]*)*$/, fqTypeRefRe = /^(?:\.[a-zA-Z_][a-zA-Z_0-9]*)+$/;
		    function parse(source, root, options) {
		      if (!(root instanceof Root)) {
		        options = root;
		        root = new Root();
		      }
		      if (!options)
		        options = parse.defaults;
		      var tn = tokenize(source, options.alternateCommentMode || false), next = tn.next, push = tn.push, peek = tn.peek, skip = tn.skip, cmnt = tn.cmnt;
		      var head = true, pkg, imports, weakImports, syntax, isProto3 = false;
		      var ptr = root;
		      var applyCase = options.keepCase ? function(name) {
		        return name;
		      } : util.camelCase;
		      function illegal(token2, name, insideTryCatch) {
		        var filename = parse.filename;
		        if (!insideTryCatch)
		          parse.filename = null;
		        return Error("illegal " + (name || "token") + " '" + token2 + "' (" + (filename ? filename + ", " : "") + "line " + tn.line + ")");
		      }
		      function readString() {
		        var values = [], token2;
		        do {
		          if ((token2 = next()) !== '"' && token2 !== "'")
		            throw illegal(token2);
		          values.push(next());
		          skip(token2);
		          token2 = peek();
		        } while (token2 === '"' || token2 === "'");
		        return values.join("");
		      }
		      function readValue(acceptTypeRef) {
		        var token2 = next();
		        switch (token2) {
		          case "'":
		          case '"':
		            push(token2);
		            return readString();
		          case "true":
		          case "TRUE":
		            return true;
		          case "false":
		          case "FALSE":
		            return false;
		        }
		        try {
		          return parseNumber(
		            token2,
		            /* insideTryCatch */
		            true
		          );
		        } catch (e) {
		          if (typeRefRe.test(token2))
		            return token2;
		          throw illegal(token2, "value");
		        }
		      }
		      function readRanges(target, acceptStrings) {
		        var token2, start;
		        do {
		          if (acceptStrings && ((token2 = peek()) === '"' || token2 === "'"))
		            target.push(readString());
		          else
		            target.push([start = parseId(next()), skip("to", true) ? parseId(next()) : start]);
		        } while (skip(",", true));
		        skip(";");
		      }
		      function parseNumber(token2, insideTryCatch) {
		        var sign = 1;
		        if (token2.charAt(0) === "-") {
		          sign = -1;
		          token2 = token2.substring(1);
		        }
		        switch (token2) {
		          case "inf":
		          case "INF":
		          case "Inf":
		            return sign * Infinity;
		          case "nan":
		          case "NAN":
		          case "Nan":
		          case "NaN":
		            return NaN;
		          case "0":
		            return 0;
		        }
		        if (base10Re.test(token2))
		          return sign * parseInt(token2, 10);
		        if (base16Re.test(token2))
		          return sign * parseInt(token2, 16);
		        if (base8Re.test(token2))
		          return sign * parseInt(token2, 8);
		        if (numberRe.test(token2))
		          return sign * parseFloat(token2);
		        throw illegal(token2, "number", insideTryCatch);
		      }
		      function parseId(token2, acceptNegative) {
		        switch (token2) {
		          case "max":
		          case "MAX":
		          case "Max":
		            return 536870911;
		          case "0":
		            return 0;
		        }
		        if (!acceptNegative && token2.charAt(0) === "-")
		          throw illegal(token2, "id");
		        if (base10NegRe.test(token2))
		          return parseInt(token2, 10);
		        if (base16NegRe.test(token2))
		          return parseInt(token2, 16);
		        if (base8NegRe.test(token2))
		          return parseInt(token2, 8);
		        throw illegal(token2, "id");
		      }
		      function parsePackage() {
		        if (pkg !== undefined$1)
		          throw illegal("package");
		        pkg = next();
		        if (!typeRefRe.test(pkg))
		          throw illegal(pkg, "name");
		        ptr = ptr.define(pkg);
		        skip(";");
		      }
		      function parseImport() {
		        var token2 = peek();
		        var whichImports;
		        switch (token2) {
		          case "weak":
		            whichImports = weakImports || (weakImports = []);
		            next();
		            break;
		          case "public":
		            next();
		          // eslint-disable-line no-fallthrough
		          default:
		            whichImports = imports || (imports = []);
		            break;
		        }
		        token2 = readString();
		        skip(";");
		        whichImports.push(token2);
		      }
		      function parseSyntax() {
		        skip("=");
		        syntax = readString();
		        isProto3 = syntax === "proto3";
		        if (!isProto3 && syntax !== "proto2")
		          throw illegal(syntax, "syntax");
		        skip(";");
		      }
		      function parseCommon(parent, token2) {
		        switch (token2) {
		          case "option":
		            parseOption(parent, token2);
		            skip(";");
		            return true;
		          case "message":
		            parseType(parent, token2);
		            return true;
		          case "enum":
		            parseEnum(parent, token2);
		            return true;
		          case "service":
		            parseService(parent, token2);
		            return true;
		          case "extend":
		            parseExtension(parent, token2);
		            return true;
		        }
		        return false;
		      }
		      function ifBlock(obj, fnIf, fnElse) {
		        var trailingLine = tn.line;
		        if (obj) {
		          obj.comment = cmnt();
		          obj.filename = parse.filename;
		        }
		        if (skip("{", true)) {
		          var token2;
		          while ((token2 = next()) !== "}")
		            fnIf(token2);
		          skip(";", true);
		        } else {
		          if (fnElse)
		            fnElse();
		          skip(";");
		          if (obj && typeof obj.comment !== "string")
		            obj.comment = cmnt(trailingLine);
		        }
		      }
		      function parseType(parent, token2) {
		        if (!nameRe.test(token2 = next()))
		          throw illegal(token2, "type name");
		        var type = new Type(token2);
		        ifBlock(type, function parseType_block(token3) {
		          if (parseCommon(type, token3))
		            return;
		          switch (token3) {
		            case "map":
		              parseMapField(type);
		              break;
		            case "required":
		            case "optional":
		            case "repeated":
		              parseField(type, token3);
		              break;
		            case "oneof":
		              parseOneOf(type, token3);
		              break;
		            case "extensions":
		              readRanges(type.extensions || (type.extensions = []));
		              break;
		            case "reserved":
		              readRanges(type.reserved || (type.reserved = []), true);
		              break;
		            default:
		              if (!isProto3 || !typeRefRe.test(token3))
		                throw illegal(token3);
		              push(token3);
		              parseField(type, "optional");
		              break;
		          }
		        });
		        parent.add(type);
		      }
		      function parseField(parent, rule, extend) {
		        var type = next();
		        if (type === "group") {
		          parseGroup(parent, rule);
		          return;
		        }
		        if (!typeRefRe.test(type))
		          throw illegal(type, "type");
		        var name = next();
		        if (!nameRe.test(name))
		          throw illegal(name, "name");
		        name = applyCase(name);
		        skip("=");
		        var field = new Field(name, parseId(next()), type, rule, extend);
		        ifBlock(field, function parseField_block(token2) {
		          if (token2 === "option") {
		            parseOption(field, token2);
		            skip(";");
		          } else
		            throw illegal(token2);
		        }, function parseField_line() {
		          parseInlineOptions(field);
		        });
		        parent.add(field);
		        if (!isProto3 && field.repeated && (types.packed[type] !== undefined$1 || types.basic[type] === undefined$1))
		          field.setOption(
		            "packed",
		            false,
		            /* ifNotSet */
		            true
		          );
		      }
		      function parseGroup(parent, rule) {
		        var name = next();
		        if (!nameRe.test(name))
		          throw illegal(name, "name");
		        var fieldName = util.lcFirst(name);
		        if (name === fieldName)
		          name = util.ucFirst(name);
		        skip("=");
		        var id = parseId(next());
		        var type = new Type(name);
		        type.group = true;
		        var field = new Field(fieldName, id, name, rule);
		        field.filename = parse.filename;
		        ifBlock(type, function parseGroup_block(token2) {
		          switch (token2) {
		            case "option":
		              parseOption(type, token2);
		              skip(";");
		              break;
		            case "required":
		            case "optional":
		            case "repeated":
		              parseField(type, token2);
		              break;
		            /* istanbul ignore next */
		            default:
		              throw illegal(token2);
		          }
		        });
		        parent.add(type).add(field);
		      }
		      function parseMapField(parent) {
		        skip("<");
		        var keyType = next();
		        if (types.mapKey[keyType] === undefined$1)
		          throw illegal(keyType, "type");
		        skip(",");
		        var valueType = next();
		        if (!typeRefRe.test(valueType))
		          throw illegal(valueType, "type");
		        skip(">");
		        var name = next();
		        if (!nameRe.test(name))
		          throw illegal(name, "name");
		        skip("=");
		        var field = new MapField(applyCase(name), parseId(next()), keyType, valueType);
		        ifBlock(field, function parseMapField_block(token2) {
		          if (token2 === "option") {
		            parseOption(field, token2);
		            skip(";");
		          } else
		            throw illegal(token2);
		        }, function parseMapField_line() {
		          parseInlineOptions(field);
		        });
		        parent.add(field);
		      }
		      function parseOneOf(parent, token2) {
		        if (!nameRe.test(token2 = next()))
		          throw illegal(token2, "name");
		        var oneof = new OneOf(applyCase(token2));
		        ifBlock(oneof, function parseOneOf_block(token3) {
		          if (token3 === "option") {
		            parseOption(oneof, token3);
		            skip(";");
		          } else {
		            push(token3);
		            parseField(oneof, "optional");
		          }
		        });
		        parent.add(oneof);
		      }
		      function parseEnum(parent, token2) {
		        if (!nameRe.test(token2 = next()))
		          throw illegal(token2, "name");
		        var enm = new Enum(token2);
		        ifBlock(enm, function parseEnum_block(token3) {
		          switch (token3) {
		            case "option":
		              parseOption(enm, token3);
		              skip(";");
		              break;
		            case "reserved":
		              readRanges(enm.reserved || (enm.reserved = []), true);
		              break;
		            default:
		              parseEnumValue(enm, token3);
		          }
		        });
		        parent.add(enm);
		      }
		      function parseEnumValue(parent, token2) {
		        if (!nameRe.test(token2))
		          throw illegal(token2, "name");
		        skip("=");
		        var value = parseId(next(), true), dummy = {};
		        ifBlock(dummy, function parseEnumValue_block(token3) {
		          if (token3 === "option") {
		            parseOption(dummy, token3);
		            skip(";");
		          } else
		            throw illegal(token3);
		        }, function parseEnumValue_line() {
		          parseInlineOptions(dummy);
		        });
		        parent.add(token2, value, dummy.comment);
		      }
		      function parseOption(parent, token2) {
		        var isCustom = skip("(", true);
		        if (!typeRefRe.test(token2 = next()))
		          throw illegal(token2, "name");
		        var name = token2;
		        if (isCustom) {
		          skip(")");
		          name = "(" + name + ")";
		          token2 = peek();
		          if (fqTypeRefRe.test(token2)) {
		            name += token2;
		            next();
		          }
		        }
		        skip("=");
		        parseOptionValue(parent, name);
		      }
		      function parseOptionValue(parent, name) {
		        if (skip("{", true)) {
		          do {
		            if (!nameRe.test(token = next()))
		              throw illegal(token, "name");
		            if (peek() === "{")
		              parseOptionValue(parent, name + "." + token);
		            else {
		              skip(":");
		              if (peek() === "{")
		                parseOptionValue(parent, name + "." + token);
		              else
		                setOption(parent, name + "." + token, readValue());
		            }
		          } while (!skip("}", true));
		        } else
		          setOption(parent, name, readValue());
		      }
		      function setOption(parent, name, value) {
		        if (parent.setOption)
		          parent.setOption(name, value);
		      }
		      function parseInlineOptions(parent) {
		        if (skip("[", true)) {
		          do {
		            parseOption(parent, "option");
		          } while (skip(",", true));
		          skip("]");
		        }
		        return parent;
		      }
		      function parseService(parent, token2) {
		        if (!nameRe.test(token2 = next()))
		          throw illegal(token2, "service name");
		        var service = new Service(token2);
		        ifBlock(service, function parseService_block(token3) {
		          if (parseCommon(service, token3))
		            return;
		          if (token3 === "rpc")
		            parseMethod(service, token3);
		          else
		            throw illegal(token3);
		        });
		        parent.add(service);
		      }
		      function parseMethod(parent, token2) {
		        var type = token2;
		        if (!nameRe.test(token2 = next()))
		          throw illegal(token2, "name");
		        var name = token2, requestType, requestStream, responseType, responseStream;
		        skip("(");
		        if (skip("stream", true))
		          requestStream = true;
		        if (!typeRefRe.test(token2 = next()))
		          throw illegal(token2);
		        requestType = token2;
		        skip(")");
		        skip("returns");
		        skip("(");
		        if (skip("stream", true))
		          responseStream = true;
		        if (!typeRefRe.test(token2 = next()))
		          throw illegal(token2);
		        responseType = token2;
		        skip(")");
		        var method = new Method(name, type, requestType, responseType, requestStream, responseStream);
		        ifBlock(method, function parseMethod_block(token3) {
		          if (token3 === "option") {
		            parseOption(method, token3);
		            skip(";");
		          } else
		            throw illegal(token3);
		        });
		        parent.add(method);
		      }
		      function parseExtension(parent, token2) {
		        if (!typeRefRe.test(token2 = next()))
		          throw illegal(token2, "reference");
		        var reference = token2;
		        ifBlock(null, function parseExtension_block(token3) {
		          switch (token3) {
		            case "required":
		            case "repeated":
		            case "optional":
		              parseField(parent, token3, reference);
		              break;
		            default:
		              if (!isProto3 || !typeRefRe.test(token3))
		                throw illegal(token3);
		              push(token3);
		              parseField(parent, "optional", reference);
		              break;
		          }
		        });
		      }
		      var token;
		      while ((token = next()) !== null) {
		        switch (token) {
		          case "package":
		            if (!head)
		              throw illegal(token);
		            parsePackage();
		            break;
		          case "import":
		            if (!head)
		              throw illegal(token);
		            parseImport();
		            break;
		          case "syntax":
		            if (!head)
		              throw illegal(token);
		            parseSyntax();
		            break;
		          case "option":
		            if (!head)
		              throw illegal(token);
		            parseOption(ptr, token);
		            skip(";");
		            break;
		          default:
		            if (parseCommon(ptr, token)) {
		              head = false;
		              continue;
		            }
		            throw illegal(token);
		        }
		      }
		      parse.filename = null;
		      return {
		        "package": pkg,
		        "imports": imports,
		        weakImports,
		        syntax,
		        root
		      };
		    }
		  }, { "15": 15, "16": 16, "20": 20, "22": 22, "25": 25, "29": 29, "33": 33, "34": 34, "35": 35, "36": 36, "37": 37 }], 27: [function(require, module2, exports) {
		    module2.exports = Reader;
		    var util = require(39);
		    var BufferReader;
		    var LongBits = util.LongBits, utf8 = util.utf8;
		    function indexOutOfRange(reader, writeLength) {
		      return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
		    }
		    function Reader(buffer) {
		      this.buf = buffer;
		      this.pos = 0;
		      this.len = buffer.length;
		    }
		    var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer) {
		      if (buffer instanceof Uint8Array || Array.isArray(buffer))
		        return new Reader(buffer);
		      throw Error("illegal buffer");
		    } : function create_array2(buffer) {
		      if (Array.isArray(buffer))
		        return new Reader(buffer);
		      throw Error("illegal buffer");
		    };
		    Reader.create = util.Buffer ? function create_buffer_setup(buffer) {
		      return (Reader.create = function create_buffer(buffer2) {
		        return util.Buffer.isBuffer(buffer2) ? new BufferReader(buffer2) : create_array(buffer2);
		      })(buffer);
		    } : create_array;
		    Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */
		    util.Array.prototype.slice;
		    Reader.prototype.uint32 = /* @__PURE__ */ function read_uint32_setup() {
		      var value = 4294967295;
		      return function read_uint32() {
		        value = (this.buf[this.pos] & 127) >>> 0;
		        if (this.buf[this.pos++] < 128) return value;
		        value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
		        if (this.buf[this.pos++] < 128) return value;
		        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
		        if (this.buf[this.pos++] < 128) return value;
		        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
		        if (this.buf[this.pos++] < 128) return value;
		        value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
		        if (this.buf[this.pos++] < 128) return value;
		        if ((this.pos += 5) > this.len) {
		          this.pos = this.len;
		          throw indexOutOfRange(this, 10);
		        }
		        return value;
		      };
		    }();
		    Reader.prototype.int32 = function read_int32() {
		      return this.uint32() | 0;
		    };
		    Reader.prototype.sint32 = function read_sint32() {
		      var value = this.uint32();
		      return value >>> 1 ^ -(value & 1) | 0;
		    };
		    function readLongVarint() {
		      var bits = new LongBits(0, 0);
		      var i = 0;
		      if (this.len - this.pos > 4) {
		        for (; i < 4; ++i) {
		          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
		          if (this.buf[this.pos++] < 128)
		            return bits;
		        }
		        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
		        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
		        if (this.buf[this.pos++] < 128)
		          return bits;
		        i = 0;
		      } else {
		        for (; i < 3; ++i) {
		          if (this.pos >= this.len)
		            throw indexOutOfRange(this);
		          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
		          if (this.buf[this.pos++] < 128)
		            return bits;
		        }
		        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
		        return bits;
		      }
		      if (this.len - this.pos > 4) {
		        for (; i < 5; ++i) {
		          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
		          if (this.buf[this.pos++] < 128)
		            return bits;
		        }
		      } else {
		        for (; i < 5; ++i) {
		          if (this.pos >= this.len)
		            throw indexOutOfRange(this);
		          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
		          if (this.buf[this.pos++] < 128)
		            return bits;
		        }
		      }
		      throw Error("invalid varint encoding");
		    }
		    Reader.prototype.bool = function read_bool() {
		      return this.uint32() !== 0;
		    };
		    function readFixed32_end(buf, end) {
		      return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
		    }
		    Reader.prototype.fixed32 = function read_fixed32() {
		      if (this.pos + 4 > this.len)
		        throw indexOutOfRange(this, 4);
		      return readFixed32_end(this.buf, this.pos += 4);
		    };
		    Reader.prototype.sfixed32 = function read_sfixed32() {
		      if (this.pos + 4 > this.len)
		        throw indexOutOfRange(this, 4);
		      return readFixed32_end(this.buf, this.pos += 4) | 0;
		    };
		    function readFixed64() {
		      if (this.pos + 8 > this.len)
		        throw indexOutOfRange(this, 8);
		      return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
		    }
		    Reader.prototype.float = function read_float() {
		      if (this.pos + 4 > this.len)
		        throw indexOutOfRange(this, 4);
		      var value = util.float.readFloatLE(this.buf, this.pos);
		      this.pos += 4;
		      return value;
		    };
		    Reader.prototype.double = function read_double() {
		      if (this.pos + 8 > this.len)
		        throw indexOutOfRange(this, 4);
		      var value = util.float.readDoubleLE(this.buf, this.pos);
		      this.pos += 8;
		      return value;
		    };
		    Reader.prototype.bytes = function read_bytes() {
		      var length = this.uint32(), start = this.pos, end = this.pos + length;
		      if (end > this.len)
		        throw indexOutOfRange(this, length);
		      this.pos += length;
		      if (Array.isArray(this.buf))
		        return this.buf.slice(start, end);
		      return start === end ? new this.buf.constructor(0) : this._slice.call(this.buf, start, end);
		    };
		    Reader.prototype.string = function read_string() {
		      var bytes = this.bytes();
		      return utf8.read(bytes, 0, bytes.length);
		    };
		    Reader.prototype.skip = function skip(length) {
		      if (typeof length === "number") {
		        if (this.pos + length > this.len)
		          throw indexOutOfRange(this, length);
		        this.pos += length;
		      } else {
		        do {
		          if (this.pos >= this.len)
		            throw indexOutOfRange(this);
		        } while (this.buf[this.pos++] & 128);
		      }
		      return this;
		    };
		    Reader.prototype.skipType = function(wireType) {
		      switch (wireType) {
		        case 0:
		          this.skip();
		          break;
		        case 1:
		          this.skip(8);
		          break;
		        case 2:
		          this.skip(this.uint32());
		          break;
		        case 3:
		          do {
		            if ((wireType = this.uint32() & 7) === 4)
		              break;
		            this.skipType(wireType);
		          } while (true);
		          break;
		        case 5:
		          this.skip(4);
		          break;
		        /* istanbul ignore next */
		        default:
		          throw Error("invalid wire type " + wireType + " at offset " + this.pos);
		      }
		      return this;
		    };
		    Reader._configure = function(BufferReader_) {
		      BufferReader = BufferReader_;
		      var fn = util.Long ? "toLong" : (
		        /* istanbul ignore next */
		        "toNumber"
		      );
		      util.merge(Reader.prototype, {
		        int64: function read_int64() {
		          return readLongVarint.call(this)[fn](false);
		        },
		        uint64: function read_uint64() {
		          return readLongVarint.call(this)[fn](true);
		        },
		        sint64: function read_sint64() {
		          return readLongVarint.call(this).zzDecode()[fn](false);
		        },
		        fixed64: function read_fixed64() {
		          return readFixed64.call(this)[fn](true);
		        },
		        sfixed64: function read_sfixed64() {
		          return readFixed64.call(this)[fn](false);
		        }
		      });
		    };
		  }, { "39": 39 }], 28: [function(require, module2, exports) {
		    module2.exports = BufferReader;
		    var Reader = require(27);
		    (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
		    var util = require(39);
		    function BufferReader(buffer) {
		      Reader.call(this, buffer);
		    }
		    if (util.Buffer)
		      BufferReader.prototype._slice = util.Buffer.prototype.slice;
		    BufferReader.prototype.string = function read_string_buffer() {
		      var len = this.uint32();
		      return this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len));
		    };
		  }, { "27": 27, "39": 39 }], 29: [function(require, module2, exports) {
		    module2.exports = Root;
		    var Namespace = require(23);
		    ((Root.prototype = Object.create(Namespace.prototype)).constructor = Root).className = "Root";
		    var Field = require(16), Enum = require(15), OneOf = require(25), util = require(37);
		    var Type, parse, common;
		    function Root(options) {
		      Namespace.call(this, "", options);
		      this.deferred = [];
		      this.files = [];
		    }
		    Root.fromJSON = function fromJSON(json, root) {
		      if (!root)
		        root = new Root();
		      if (json.options)
		        root.setOptions(json.options);
		      return root.addJSON(json.nested);
		    };
		    Root.prototype.resolvePath = util.path.resolve;
		    function SYNC() {
		    }
		    Root.prototype.load = function load(filename, options, callback) {
		      if (typeof options === "function") {
		        callback = options;
		        options = undefined$1;
		      }
		      var self = this;
		      if (!callback)
		        return util.asPromise(load, self, filename, options);
		      var sync = callback === SYNC;
		      function finish(err, root) {
		        if (!callback)
		          return;
		        var cb = callback;
		        callback = null;
		        if (sync)
		          throw err;
		        cb(err, root);
		      }
		      function process(filename2, source) {
		        try {
		          if (util.isString(source) && source.charAt(0) === "{")
		            source = JSON.parse(source);
		          if (!util.isString(source))
		            self.setOptions(source.options).addJSON(source.nested);
		          else {
		            parse.filename = filename2;
		            var parsed = parse(source, self, options), resolved2, i2 = 0;
		            if (parsed.imports) {
		              for (; i2 < parsed.imports.length; ++i2)
		                if (resolved2 = self.resolvePath(filename2, parsed.imports[i2]))
		                  fetch(resolved2);
		            }
		            if (parsed.weakImports) {
		              for (i2 = 0; i2 < parsed.weakImports.length; ++i2)
		                if (resolved2 = self.resolvePath(filename2, parsed.weakImports[i2]))
		                  fetch(resolved2, true);
		            }
		          }
		        } catch (err) {
		          finish(err);
		        }
		        if (!sync && !queued)
		          finish(null, self);
		      }
		      function fetch(filename2, weak) {
		        var idx = filename2.lastIndexOf("google/protobuf/");
		        if (idx > -1) {
		          var altname = filename2.substring(idx);
		          if (altname in common)
		            filename2 = altname;
		        }
		        if (self.files.indexOf(filename2) > -1)
		          return;
		        self.files.push(filename2);
		        if (filename2 in common) {
		          if (sync)
		            process(filename2, common[filename2]);
		          else {
		            ++queued;
		            setTimeout(function() {
		              --queued;
		              process(filename2, common[filename2]);
		            });
		          }
		          return;
		        }
		        if (sync) {
		          var source;
		          try {
		            source = util.fs.readFileSync(filename2).toString("utf8");
		          } catch (err) {
		            if (!weak)
		              finish(err);
		            return;
		          }
		          process(filename2, source);
		        } else {
		          ++queued;
		          util.fetch(filename2, function(err, source2) {
		            --queued;
		            if (!callback)
		              return;
		            if (err) {
		              if (!weak)
		                finish(err);
		              else if (!queued)
		                finish(null, self);
		              return;
		            }
		            process(filename2, source2);
		          });
		        }
		      }
		      var queued = 0;
		      if (util.isString(filename))
		        filename = [filename];
		      for (var i = 0, resolved; i < filename.length; ++i)
		        if (resolved = self.resolvePath("", filename[i]))
		          fetch(resolved);
		      if (sync)
		        return self;
		      if (!queued)
		        finish(null, self);
		      return undefined$1;
		    };
		    Root.prototype.loadSync = function loadSync(filename, options) {
		      if (!util.isNode)
		        throw Error("not supported");
		      return this.load(filename, options, SYNC);
		    };
		    Root.prototype.resolveAll = function resolveAll() {
		      if (this.deferred.length)
		        throw Error("unresolvable extensions: " + this.deferred.map(function(field) {
		          return "'extend " + field.extend + "' in " + field.parent.fullName;
		        }).join(", "));
		      return Namespace.prototype.resolveAll.call(this);
		    };
		    var exposeRe = /^[A-Z]/;
		    function tryHandleExtension(root, field) {
		      var extendedType = field.parent.lookup(field.extend);
		      if (extendedType) {
		        var sisterField = new Field(field.fullName, field.id, field.type, field.rule, undefined$1, field.options);
		        sisterField.declaringField = field;
		        field.extensionField = sisterField;
		        extendedType.add(sisterField);
		        return true;
		      }
		      return false;
		    }
		    Root.prototype._handleAdd = function _handleAdd(object) {
		      if (object instanceof Field) {
		        if (
		          /* an extension field (implies not part of a oneof) */
		          object.extend !== undefined$1 && /* not already handled */
		          !object.extensionField
		        ) {
		          if (!tryHandleExtension(this, object))
		            this.deferred.push(object);
		        }
		      } else if (object instanceof Enum) {
		        if (exposeRe.test(object.name))
		          object.parent[object.name] = object.values;
		      } else if (!(object instanceof OneOf)) {
		        if (object instanceof Type)
		          for (var i = 0; i < this.deferred.length; )
		            if (tryHandleExtension(this, this.deferred[i]))
		              this.deferred.splice(i, 1);
		            else
		              ++i;
		        for (var j = 0; j < /* initializes */
		        object.nestedArray.length; ++j)
		          this._handleAdd(object._nestedArray[j]);
		        if (exposeRe.test(object.name))
		          object.parent[object.name] = object;
		      }
		    };
		    Root.prototype._handleRemove = function _handleRemove(object) {
		      if (object instanceof Field) {
		        if (
		          /* an extension field */
		          object.extend !== undefined$1
		        ) {
		          if (
		            /* already handled */
		            object.extensionField
		          ) {
		            object.extensionField.parent.remove(object.extensionField);
		            object.extensionField = null;
		          } else {
		            var index = this.deferred.indexOf(object);
		            if (index > -1)
		              this.deferred.splice(index, 1);
		          }
		        }
		      } else if (object instanceof Enum) {
		        if (exposeRe.test(object.name))
		          delete object.parent[object.name];
		      } else if (object instanceof Namespace) {
		        for (var i = 0; i < /* initializes */
		        object.nestedArray.length; ++i)
		          this._handleRemove(object._nestedArray[i]);
		        if (exposeRe.test(object.name))
		          delete object.parent[object.name];
		      }
		    };
		    Root._configure = function(Type_, parse_, common_) {
		      Type = Type_;
		      parse = parse_;
		      common = common_;
		    };
		  }, { "15": 15, "16": 16, "23": 23, "25": 25, "37": 37 }], 30: [function(require, module2, exports) {
		    module2.exports = {};
		  }, {}], 31: [function(require, module2, exports) {
		    var rpc = exports;
		    rpc.Service = require(32);
		  }, { "32": 32 }], 32: [function(require, module2, exports) {
		    module2.exports = Service;
		    var util = require(39);
		    (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
		    function Service(rpcImpl, requestDelimited, responseDelimited) {
		      if (typeof rpcImpl !== "function")
		        throw TypeError("rpcImpl must be a function");
		      util.EventEmitter.call(this);
		      this.rpcImpl = rpcImpl;
		      this.requestDelimited = Boolean(requestDelimited);
		      this.responseDelimited = Boolean(responseDelimited);
		    }
		    Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
		      if (!request)
		        throw TypeError("request must be specified");
		      var self = this;
		      if (!callback)
		        return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);
		      if (!self.rpcImpl) {
		        setTimeout(function() {
		          callback(Error("already ended"));
		        }, 0);
		        return undefined$1;
		      }
		      try {
		        return self.rpcImpl(
		          method,
		          requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
		          function rpcCallback(err, response) {
		            if (err) {
		              self.emit("error", err, method);
		              return callback(err);
		            }
		            if (response === null) {
		              self.end(
		                /* endedByRPC */
		                true
		              );
		              return undefined$1;
		            }
		            if (!(response instanceof responseCtor)) {
		              try {
		                response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
		              } catch (err2) {
		                self.emit("error", err2, method);
		                return callback(err2);
		              }
		            }
		            self.emit("data", response, method);
		            return callback(null, response);
		          }
		        );
		      } catch (err) {
		        self.emit("error", err, method);
		        setTimeout(function() {
		          callback(err);
		        }, 0);
		        return undefined$1;
		      }
		    };
		    Service.prototype.end = function end(endedByRPC) {
		      if (this.rpcImpl) {
		        if (!endedByRPC)
		          this.rpcImpl(null, null, null);
		        this.rpcImpl = null;
		        this.emit("end").off();
		      }
		      return this;
		    };
		  }, { "39": 39 }], 33: [function(require, module2, exports) {
		    module2.exports = Service;
		    var Namespace = require(23);
		    ((Service.prototype = Object.create(Namespace.prototype)).constructor = Service).className = "Service";
		    var Method = require(22), util = require(37), rpc = require(31);
		    function Service(name, options) {
		      Namespace.call(this, name, options);
		      this.methods = {};
		      this._methodsArray = null;
		    }
		    Service.fromJSON = function fromJSON(name, json) {
		      var service = new Service(name, json.options);
		      if (json.methods)
		        for (var names = Object.keys(json.methods), i = 0; i < names.length; ++i)
		          service.add(Method.fromJSON(names[i], json.methods[names[i]]));
		      if (json.nested)
		        service.addJSON(json.nested);
		      service.comment = json.comment;
		      return service;
		    };
		    Service.prototype.toJSON = function toJSON(toJSONOptions) {
		      var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
		      var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
		      return util.toObject([
		        "options",
		        inherited && inherited.options || undefined$1,
		        "methods",
		        Namespace.arrayToJSON(this.methodsArray, toJSONOptions) || /* istanbul ignore next */
		        {},
		        "nested",
		        inherited && inherited.nested || undefined$1,
		        "comment",
		        keepComments ? this.comment : undefined$1
		      ]);
		    };
		    Object.defineProperty(Service.prototype, "methodsArray", {
		      get: function() {
		        return this._methodsArray || (this._methodsArray = util.toArray(this.methods));
		      }
		    });
		    function clearCache(service) {
		      service._methodsArray = null;
		      return service;
		    }
		    Service.prototype.get = function get(name) {
		      return this.methods[name] || Namespace.prototype.get.call(this, name);
		    };
		    Service.prototype.resolveAll = function resolveAll() {
		      var methods = this.methodsArray;
		      for (var i = 0; i < methods.length; ++i)
		        methods[i].resolve();
		      return Namespace.prototype.resolve.call(this);
		    };
		    Service.prototype.add = function add(object) {
		      if (this.get(object.name))
		        throw Error("duplicate name '" + object.name + "' in " + this);
		      if (object instanceof Method) {
		        this.methods[object.name] = object;
		        object.parent = this;
		        return clearCache(this);
		      }
		      return Namespace.prototype.add.call(this, object);
		    };
		    Service.prototype.remove = function remove(object) {
		      if (object instanceof Method) {
		        if (this.methods[object.name] !== object)
		          throw Error(object + " is not a member of " + this);
		        delete this.methods[object.name];
		        object.parent = null;
		        return clearCache(this);
		      }
		      return Namespace.prototype.remove.call(this, object);
		    };
		    Service.prototype.create = function create(rpcImpl, requestDelimited, responseDelimited) {
		      var rpcService = new rpc.Service(rpcImpl, requestDelimited, responseDelimited);
		      for (var i = 0, method; i < /* initializes */
		      this.methodsArray.length; ++i) {
		        var methodName = util.lcFirst((method = this._methodsArray[i]).resolve().name).replace(/[^$\w_]/g, "");
		        rpcService[methodName] = util.codegen(["r", "c"], util.isReserved(methodName) ? methodName + "_" : methodName)("return this.rpcCall(m,q,s,r,c)")({
		          m: method,
		          q: method.resolvedRequestType.ctor,
		          s: method.resolvedResponseType.ctor
		        });
		      }
		      return rpcService;
		    };
		  }, { "22": 22, "23": 23, "31": 31, "37": 37 }], 34: [function(require, module2, exports) {
		    module2.exports = tokenize;
		    var delimRe = /[\s{}=;:[\],'"()<>]/g, stringDoubleRe = /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g, stringSingleRe = /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g;
		    var setCommentRe = /^ *[*/]+ */, setCommentAltRe = /^\s*\*?\/*/, setCommentSplitRe = /\n/g, whitespaceRe = /\s/, unescapeRe = /\\(.?)/g;
		    var unescapeMap = {
		      "0": "\0",
		      "r": "\r",
		      "n": "\n",
		      "t": "	"
		    };
		    function unescape(str) {
		      return str.replace(unescapeRe, function($0, $1) {
		        switch ($1) {
		          case "\\":
		          case "":
		            return $1;
		          default:
		            return unescapeMap[$1] || "";
		        }
		      });
		    }
		    tokenize.unescape = unescape;
		    function tokenize(source, alternateCommentMode) {
		      source = source.toString();
		      var offset = 0, length = source.length, line = 1, commentType = null, commentText = null, commentLine = 0, commentLineEmpty = false;
		      var stack = [];
		      var stringDelim = null;
		      function illegal(subject) {
		        return Error("illegal " + subject + " (line " + line + ")");
		      }
		      function readString() {
		        var re = stringDelim === "'" ? stringSingleRe : stringDoubleRe;
		        re.lastIndex = offset - 1;
		        var match = re.exec(source);
		        if (!match)
		          throw illegal("string");
		        offset = re.lastIndex;
		        push(stringDelim);
		        stringDelim = null;
		        return unescape(match[1]);
		      }
		      function charAt(pos) {
		        return source.charAt(pos);
		      }
		      function setComment(start, end) {
		        commentType = source.charAt(start++);
		        commentLine = line;
		        commentLineEmpty = false;
		        var lookback;
		        if (alternateCommentMode) {
		          lookback = 2;
		        } else {
		          lookback = 3;
		        }
		        var commentOffset = start - lookback, c;
		        do {
		          if (--commentOffset < 0 || (c = source.charAt(commentOffset)) === "\n") {
		            commentLineEmpty = true;
		            break;
		          }
		        } while (c === " " || c === "	");
		        var lines = source.substring(start, end).split(setCommentSplitRe);
		        for (var i = 0; i < lines.length; ++i)
		          lines[i] = lines[i].replace(alternateCommentMode ? setCommentAltRe : setCommentRe, "").trim();
		        commentText = lines.join("\n").trim();
		      }
		      function isDoubleSlashCommentLine(startOffset) {
		        var endOffset = findEndOfLine(startOffset);
		        var lineText = source.substring(startOffset, endOffset);
		        var isComment = /^\s*\/{1,2}/.test(lineText);
		        return isComment;
		      }
		      function findEndOfLine(cursor) {
		        var endOffset = cursor;
		        while (endOffset < length && charAt(endOffset) !== "\n") {
		          endOffset++;
		        }
		        return endOffset;
		      }
		      function next() {
		        if (stack.length > 0)
		          return stack.shift();
		        if (stringDelim)
		          return readString();
		        var repeat, prev, curr, start, isDoc;
		        do {
		          if (offset === length)
		            return null;
		          repeat = false;
		          while (whitespaceRe.test(curr = charAt(offset))) {
		            if (curr === "\n")
		              ++line;
		            if (++offset === length)
		              return null;
		          }
		          if (charAt(offset) === "/") {
		            if (++offset === length) {
		              throw illegal("comment");
		            }
		            if (charAt(offset) === "/") {
		              if (!alternateCommentMode) {
		                isDoc = charAt(start = offset + 1) === "/";
		                while (charAt(++offset) !== "\n") {
		                  if (offset === length) {
		                    return null;
		                  }
		                }
		                ++offset;
		                if (isDoc) {
		                  setComment(start, offset - 1);
		                }
		                ++line;
		                repeat = true;
		              } else {
		                start = offset;
		                isDoc = false;
		                if (isDoubleSlashCommentLine(offset)) {
		                  isDoc = true;
		                  do {
		                    offset = findEndOfLine(offset);
		                    if (offset === length) {
		                      break;
		                    }
		                    offset++;
		                  } while (isDoubleSlashCommentLine(offset));
		                } else {
		                  offset = Math.min(length, findEndOfLine(offset) + 1);
		                }
		                if (isDoc) {
		                  setComment(start, offset);
		                }
		                line++;
		                repeat = true;
		              }
		            } else if ((curr = charAt(offset)) === "*") {
		              start = offset + 1;
		              isDoc = alternateCommentMode || charAt(start) === "*";
		              do {
		                if (curr === "\n") {
		                  ++line;
		                }
		                if (++offset === length) {
		                  throw illegal("comment");
		                }
		                prev = curr;
		                curr = charAt(offset);
		              } while (prev !== "*" || curr !== "/");
		              ++offset;
		              if (isDoc) {
		                setComment(start, offset - 2);
		              }
		              repeat = true;
		            } else {
		              return "/";
		            }
		          }
		        } while (repeat);
		        var end = offset;
		        delimRe.lastIndex = 0;
		        var delim = delimRe.test(charAt(end++));
		        if (!delim)
		          while (end < length && !delimRe.test(charAt(end)))
		            ++end;
		        var token = source.substring(offset, offset = end);
		        if (token === '"' || token === "'")
		          stringDelim = token;
		        return token;
		      }
		      function push(token) {
		        stack.push(token);
		      }
		      function peek() {
		        if (!stack.length) {
		          var token = next();
		          if (token === null)
		            return null;
		          push(token);
		        }
		        return stack[0];
		      }
		      function skip(expected, optional) {
		        var actual = peek(), equals = actual === expected;
		        if (equals) {
		          next();
		          return true;
		        }
		        if (!optional)
		          throw illegal("token '" + actual + "', '" + expected + "' expected");
		        return false;
		      }
		      function cmnt(trailingLine) {
		        var ret = null;
		        if (trailingLine === undefined$1) {
		          if (commentLine === line - 1 && (alternateCommentMode || commentType === "*" || commentLineEmpty)) {
		            ret = commentText;
		          }
		        } else {
		          if (commentLine < trailingLine) {
		            peek();
		          }
		          if (commentLine === trailingLine && !commentLineEmpty && (alternateCommentMode || commentType === "/")) {
		            ret = commentText;
		          }
		        }
		        return ret;
		      }
		      return Object.defineProperty({
		        next,
		        peek,
		        push,
		        skip,
		        cmnt
		      }, "line", {
		        get: function() {
		          return line;
		        }
		      });
		    }
		  }, {}], 35: [function(require, module2, exports) {
		    module2.exports = Type;
		    var Namespace = require(23);
		    ((Type.prototype = Object.create(Namespace.prototype)).constructor = Type).className = "Type";
		    var Enum = require(15), OneOf = require(25), Field = require(16), MapField = require(20), Service = require(33), Message = require(21), Reader = require(27), Writer = require(42), util = require(37), encoder = require(14), decoder = require(13), verifier = require(40), converter = require(12), wrappers = require(41);
		    function Type(name, options) {
		      Namespace.call(this, name, options);
		      this.fields = {};
		      this.oneofs = undefined$1;
		      this.extensions = undefined$1;
		      this.reserved = undefined$1;
		      this.group = undefined$1;
		      this._fieldsById = null;
		      this._fieldsArray = null;
		      this._oneofsArray = null;
		      this._ctor = null;
		    }
		    Object.defineProperties(Type.prototype, {
		      /**
		       * Message fields by id.
		       * @name Type#fieldsById
		       * @type {Object.<number,Field>}
		       * @readonly
		       */
		      fieldsById: {
		        get: function() {
		          if (this._fieldsById)
		            return this._fieldsById;
		          this._fieldsById = {};
		          for (var names = Object.keys(this.fields), i = 0; i < names.length; ++i) {
		            var field = this.fields[names[i]], id = field.id;
		            if (this._fieldsById[id])
		              throw Error("duplicate id " + id + " in " + this);
		            this._fieldsById[id] = field;
		          }
		          return this._fieldsById;
		        }
		      },
		      /**
		       * Fields of this message as an array for iteration.
		       * @name Type#fieldsArray
		       * @type {Field[]}
		       * @readonly
		       */
		      fieldsArray: {
		        get: function() {
		          return this._fieldsArray || (this._fieldsArray = util.toArray(this.fields));
		        }
		      },
		      /**
		       * Oneofs of this message as an array for iteration.
		       * @name Type#oneofsArray
		       * @type {OneOf[]}
		       * @readonly
		       */
		      oneofsArray: {
		        get: function() {
		          return this._oneofsArray || (this._oneofsArray = util.toArray(this.oneofs));
		        }
		      },
		      /**
		       * The registered constructor, if any registered, otherwise a generic constructor.
		       * Assigning a function replaces the internal constructor. If the function does not extend {@link Message} yet, its prototype will be setup accordingly and static methods will be populated. If it already extends {@link Message}, it will just replace the internal constructor.
		       * @name Type#ctor
		       * @type {Constructor<{}>}
		       */
		      ctor: {
		        get: function() {
		          return this._ctor || (this.ctor = Type.generateConstructor(this)());
		        },
		        set: function(ctor) {
		          var prototype = ctor.prototype;
		          if (!(prototype instanceof Message)) {
		            (ctor.prototype = new Message()).constructor = ctor;
		            util.merge(ctor.prototype, prototype);
		          }
		          ctor.$type = ctor.prototype.$type = this;
		          util.merge(ctor, Message, true);
		          this._ctor = ctor;
		          var i = 0;
		          for (; i < /* initializes */
		          this.fieldsArray.length; ++i)
		            this._fieldsArray[i].resolve();
		          var ctorProperties = {};
		          for (i = 0; i < /* initializes */
		          this.oneofsArray.length; ++i)
		            ctorProperties[this._oneofsArray[i].resolve().name] = {
		              get: util.oneOfGetter(this._oneofsArray[i].oneof),
		              set: util.oneOfSetter(this._oneofsArray[i].oneof)
		            };
		          if (i)
		            Object.defineProperties(ctor.prototype, ctorProperties);
		        }
		      }
		    });
		    Type.generateConstructor = function generateConstructor(mtype) {
		      var gen = util.codegen(["p"], mtype.name);
		      for (var i = 0, field; i < mtype.fieldsArray.length; ++i)
		        if ((field = mtype._fieldsArray[i]).map) gen("this%s={}", util.safeProp(field.name));
		        else if (field.repeated) gen("this%s=[]", util.safeProp(field.name));
		      return gen("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]");
		    };
		    function clearCache(type) {
		      type._fieldsById = type._fieldsArray = type._oneofsArray = null;
		      delete type.encode;
		      delete type.decode;
		      delete type.verify;
		      return type;
		    }
		    Type.fromJSON = function fromJSON(name, json) {
		      var type = new Type(name, json.options);
		      type.extensions = json.extensions;
		      type.reserved = json.reserved;
		      var names = Object.keys(json.fields), i = 0;
		      for (; i < names.length; ++i)
		        type.add(
		          (typeof json.fields[names[i]].keyType !== "undefined" ? MapField.fromJSON : Field.fromJSON)(names[i], json.fields[names[i]])
		        );
		      if (json.oneofs)
		        for (names = Object.keys(json.oneofs), i = 0; i < names.length; ++i)
		          type.add(OneOf.fromJSON(names[i], json.oneofs[names[i]]));
		      if (json.nested)
		        for (names = Object.keys(json.nested), i = 0; i < names.length; ++i) {
		          var nested = json.nested[names[i]];
		          type.add(
		            // most to least likely
		            (nested.id !== undefined$1 ? Field.fromJSON : nested.fields !== undefined$1 ? Type.fromJSON : nested.values !== undefined$1 ? Enum.fromJSON : nested.methods !== undefined$1 ? Service.fromJSON : Namespace.fromJSON)(names[i], nested)
		          );
		        }
		      if (json.extensions && json.extensions.length)
		        type.extensions = json.extensions;
		      if (json.reserved && json.reserved.length)
		        type.reserved = json.reserved;
		      if (json.group)
		        type.group = true;
		      if (json.comment)
		        type.comment = json.comment;
		      return type;
		    };
		    Type.prototype.toJSON = function toJSON(toJSONOptions) {
		      var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
		      var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
		      return util.toObject([
		        "options",
		        inherited && inherited.options || undefined$1,
		        "oneofs",
		        Namespace.arrayToJSON(this.oneofsArray, toJSONOptions),
		        "fields",
		        Namespace.arrayToJSON(this.fieldsArray.filter(function(obj) {
		          return !obj.declaringField;
		        }), toJSONOptions) || {},
		        "extensions",
		        this.extensions && this.extensions.length ? this.extensions : undefined$1,
		        "reserved",
		        this.reserved && this.reserved.length ? this.reserved : undefined$1,
		        "group",
		        this.group || undefined$1,
		        "nested",
		        inherited && inherited.nested || undefined$1,
		        "comment",
		        keepComments ? this.comment : undefined$1
		      ]);
		    };
		    Type.prototype.resolveAll = function resolveAll() {
		      var fields = this.fieldsArray, i = 0;
		      while (i < fields.length)
		        fields[i++].resolve();
		      var oneofs = this.oneofsArray;
		      i = 0;
		      while (i < oneofs.length)
		        oneofs[i++].resolve();
		      return Namespace.prototype.resolveAll.call(this);
		    };
		    Type.prototype.get = function get(name) {
		      return this.fields[name] || this.oneofs && this.oneofs[name] || this.nested && this.nested[name] || null;
		    };
		    Type.prototype.add = function add(object) {
		      if (this.get(object.name))
		        throw Error("duplicate name '" + object.name + "' in " + this);
		      if (object instanceof Field && object.extend === undefined$1) {
		        if (this._fieldsById ? (
		          /* istanbul ignore next */
		          this._fieldsById[object.id]
		        ) : this.fieldsById[object.id])
		          throw Error("duplicate id " + object.id + " in " + this);
		        if (this.isReservedId(object.id))
		          throw Error("id " + object.id + " is reserved in " + this);
		        if (this.isReservedName(object.name))
		          throw Error("name '" + object.name + "' is reserved in " + this);
		        if (object.parent)
		          object.parent.remove(object);
		        this.fields[object.name] = object;
		        object.message = this;
		        object.onAdd(this);
		        return clearCache(this);
		      }
		      if (object instanceof OneOf) {
		        if (!this.oneofs)
		          this.oneofs = {};
		        this.oneofs[object.name] = object;
		        object.onAdd(this);
		        return clearCache(this);
		      }
		      return Namespace.prototype.add.call(this, object);
		    };
		    Type.prototype.remove = function remove(object) {
		      if (object instanceof Field && object.extend === undefined$1) {
		        if (!this.fields || this.fields[object.name] !== object)
		          throw Error(object + " is not a member of " + this);
		        delete this.fields[object.name];
		        object.parent = null;
		        object.onRemove(this);
		        return clearCache(this);
		      }
		      if (object instanceof OneOf) {
		        if (!this.oneofs || this.oneofs[object.name] !== object)
		          throw Error(object + " is not a member of " + this);
		        delete this.oneofs[object.name];
		        object.parent = null;
		        object.onRemove(this);
		        return clearCache(this);
		      }
		      return Namespace.prototype.remove.call(this, object);
		    };
		    Type.prototype.isReservedId = function isReservedId(id) {
		      return Namespace.isReservedId(this.reserved, id);
		    };
		    Type.prototype.isReservedName = function isReservedName(name) {
		      return Namespace.isReservedName(this.reserved, name);
		    };
		    Type.prototype.create = function create(properties) {
		      return new this.ctor(properties);
		    };
		    Type.prototype.setup = function setup() {
		      var fullName = this.fullName, types = [];
		      for (var i = 0; i < /* initializes */
		      this.fieldsArray.length; ++i)
		        types.push(this._fieldsArray[i].resolve().resolvedType);
		      this.encode = encoder(this)({
		        Writer,
		        types,
		        util
		      });
		      this.decode = decoder(this)({
		        Reader,
		        types,
		        util
		      });
		      this.verify = verifier(this)({
		        types,
		        util
		      });
		      this.fromObject = converter.fromObject(this)({
		        types,
		        util
		      });
		      this.toObject = converter.toObject(this)({
		        types,
		        util
		      });
		      var wrapper = wrappers[fullName];
		      if (wrapper) {
		        var originalThis = Object.create(this);
		        originalThis.fromObject = this.fromObject;
		        this.fromObject = wrapper.fromObject.bind(originalThis);
		        originalThis.toObject = this.toObject;
		        this.toObject = wrapper.toObject.bind(originalThis);
		      }
		      return this;
		    };
		    Type.prototype.encode = function encode_setup(message, writer) {
		      return this.setup().encode(message, writer);
		    };
		    Type.prototype.encodeDelimited = function encodeDelimited(message, writer) {
		      return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
		    };
		    Type.prototype.decode = function decode_setup(reader, length) {
		      return this.setup().decode(reader, length);
		    };
		    Type.prototype.decodeDelimited = function decodeDelimited(reader) {
		      if (!(reader instanceof Reader))
		        reader = Reader.create(reader);
		      return this.decode(reader, reader.uint32());
		    };
		    Type.prototype.verify = function verify_setup(message) {
		      return this.setup().verify(message);
		    };
		    Type.prototype.fromObject = function fromObject(object) {
		      return this.setup().fromObject(object);
		    };
		    Type.prototype.toObject = function toObject(message, options) {
		      return this.setup().toObject(message, options);
		    };
		    Type.d = function decorateType(typeName) {
		      return function typeDecorator(target) {
		        util.decorateType(target, typeName);
		      };
		    };
		  }, { "12": 12, "13": 13, "14": 14, "15": 15, "16": 16, "20": 20, "21": 21, "23": 23, "25": 25, "27": 27, "33": 33, "37": 37, "40": 40, "41": 41, "42": 42 }], 36: [function(require, module2, exports) {
		    var types = exports;
		    var util = require(37);
		    var s = [
		      "double",
		      // 0
		      "float",
		      // 1
		      "int32",
		      // 2
		      "uint32",
		      // 3
		      "sint32",
		      // 4
		      "fixed32",
		      // 5
		      "sfixed32",
		      // 6
		      "int64",
		      // 7
		      "uint64",
		      // 8
		      "sint64",
		      // 9
		      "fixed64",
		      // 10
		      "sfixed64",
		      // 11
		      "bool",
		      // 12
		      "string",
		      // 13
		      "bytes"
		      // 14
		    ];
		    function bake(values, offset) {
		      var i = 0, o = {};
		      offset |= 0;
		      while (i < values.length) o[s[i + offset]] = values[i++];
		      return o;
		    }
		    types.basic = bake([
		      /* double   */
		      1,
		      /* float    */
		      5,
		      /* int32    */
		      0,
		      /* uint32   */
		      0,
		      /* sint32   */
		      0,
		      /* fixed32  */
		      5,
		      /* sfixed32 */
		      5,
		      /* int64    */
		      0,
		      /* uint64   */
		      0,
		      /* sint64   */
		      0,
		      /* fixed64  */
		      1,
		      /* sfixed64 */
		      1,
		      /* bool     */
		      0,
		      /* string   */
		      2,
		      /* bytes    */
		      2
		    ]);
		    types.defaults = bake([
		      /* double   */
		      0,
		      /* float    */
		      0,
		      /* int32    */
		      0,
		      /* uint32   */
		      0,
		      /* sint32   */
		      0,
		      /* fixed32  */
		      0,
		      /* sfixed32 */
		      0,
		      /* int64    */
		      0,
		      /* uint64   */
		      0,
		      /* sint64   */
		      0,
		      /* fixed64  */
		      0,
		      /* sfixed64 */
		      0,
		      /* bool     */
		      false,
		      /* string   */
		      "",
		      /* bytes    */
		      util.emptyArray,
		      /* message  */
		      null
		    ]);
		    types.long = bake([
		      /* int64    */
		      0,
		      /* uint64   */
		      0,
		      /* sint64   */
		      0,
		      /* fixed64  */
		      1,
		      /* sfixed64 */
		      1
		    ], 7);
		    types.mapKey = bake([
		      /* int32    */
		      0,
		      /* uint32   */
		      0,
		      /* sint32   */
		      0,
		      /* fixed32  */
		      5,
		      /* sfixed32 */
		      5,
		      /* int64    */
		      0,
		      /* uint64   */
		      0,
		      /* sint64   */
		      0,
		      /* fixed64  */
		      1,
		      /* sfixed64 */
		      1,
		      /* bool     */
		      0,
		      /* string   */
		      2
		    ], 2);
		    types.packed = bake([
		      /* double   */
		      1,
		      /* float    */
		      5,
		      /* int32    */
		      0,
		      /* uint32   */
		      0,
		      /* sint32   */
		      0,
		      /* fixed32  */
		      5,
		      /* sfixed32 */
		      5,
		      /* int64    */
		      0,
		      /* uint64   */
		      0,
		      /* sint64   */
		      0,
		      /* fixed64  */
		      1,
		      /* sfixed64 */
		      1,
		      /* bool     */
		      0
		    ]);
		  }, { "37": 37 }], 37: [function(require, module2, exports) {
		    var util = module2.exports = require(39);
		    var roots = require(30);
		    var Type, Enum;
		    util.codegen = require(3);
		    util.fetch = require(5);
		    util.path = require(8);
		    util.fs = util.inquire("fs");
		    util.toArray = function toArray(object) {
		      if (object) {
		        var keys = Object.keys(object), array = new Array(keys.length), index = 0;
		        while (index < keys.length)
		          array[index] = object[keys[index++]];
		        return array;
		      }
		      return [];
		    };
		    util.toObject = function toObject(array) {
		      var object = {}, index = 0;
		      while (index < array.length) {
		        var key = array[index++], val = array[index++];
		        if (val !== undefined$1)
		          object[key] = val;
		      }
		      return object;
		    };
		    var safePropBackslashRe = /\\/g, safePropQuoteRe = /"/g;
		    util.isReserved = function isReserved(name) {
		      return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(name);
		    };
		    util.safeProp = function safeProp(prop) {
		      if (!/^[$\w_]+$/.test(prop) || util.isReserved(prop))
		        return '["' + prop.replace(safePropBackslashRe, "\\\\").replace(safePropQuoteRe, '\\"') + '"]';
		      return "." + prop;
		    };
		    util.ucFirst = function ucFirst(str) {
		      return str.charAt(0).toUpperCase() + str.substring(1);
		    };
		    var camelCaseRe = /_([a-z])/g;
		    util.camelCase = function camelCase(str) {
		      return str.substring(0, 1) + str.substring(1).replace(camelCaseRe, function($0, $1) {
		        return $1.toUpperCase();
		      });
		    };
		    util.compareFieldsById = function compareFieldsById(a, b) {
		      return a.id - b.id;
		    };
		    util.decorateType = function decorateType(ctor, typeName) {
		      if (ctor.$type) {
		        if (typeName && ctor.$type.name !== typeName) {
		          util.decorateRoot.remove(ctor.$type);
		          ctor.$type.name = typeName;
		          util.decorateRoot.add(ctor.$type);
		        }
		        return ctor.$type;
		      }
		      if (!Type)
		        Type = require(35);
		      var type = new Type(typeName || ctor.name);
		      util.decorateRoot.add(type);
		      type.ctor = ctor;
		      Object.defineProperty(ctor, "$type", { value: type, enumerable: false });
		      Object.defineProperty(ctor.prototype, "$type", { value: type, enumerable: false });
		      return type;
		    };
		    var decorateEnumIndex = 0;
		    util.decorateEnum = function decorateEnum(object) {
		      if (object.$type)
		        return object.$type;
		      if (!Enum)
		        Enum = require(15);
		      var enm = new Enum("Enum" + decorateEnumIndex++, object);
		      util.decorateRoot.add(enm);
		      Object.defineProperty(object, "$type", { value: enm, enumerable: false });
		      return enm;
		    };
		    Object.defineProperty(util, "decorateRoot", {
		      get: function() {
		        return roots["decorated"] || (roots["decorated"] = new (require(29))());
		      }
		    });
		  }, { "15": 15, "29": 29, "3": 3, "30": 30, "35": 35, "39": 39, "5": 5, "8": 8 }], 38: [function(require, module2, exports) {
		    module2.exports = LongBits;
		    var util = require(39);
		    function LongBits(lo, hi) {
		      this.lo = lo >>> 0;
		      this.hi = hi >>> 0;
		    }
		    var zero = LongBits.zero = new LongBits(0, 0);
		    zero.toNumber = function() {
		      return 0;
		    };
		    zero.zzEncode = zero.zzDecode = function() {
		      return this;
		    };
		    zero.length = function() {
		      return 1;
		    };
		    var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
		    LongBits.fromNumber = function fromNumber(value) {
		      if (value === 0)
		        return zero;
		      var sign = value < 0;
		      if (sign)
		        value = -value;
		      var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
		      if (sign) {
		        hi = ~hi >>> 0;
		        lo = ~lo >>> 0;
		        if (++lo > 4294967295) {
		          lo = 0;
		          if (++hi > 4294967295)
		            hi = 0;
		        }
		      }
		      return new LongBits(lo, hi);
		    };
		    LongBits.from = function from(value) {
		      if (typeof value === "number")
		        return LongBits.fromNumber(value);
		      if (util.isString(value)) {
		        if (util.Long)
		          value = util.Long.fromString(value);
		        else
		          return LongBits.fromNumber(parseInt(value, 10));
		      }
		      return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
		    };
		    LongBits.prototype.toNumber = function toNumber(unsigned) {
		      if (!unsigned && this.hi >>> 31) {
		        var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
		        if (!lo)
		          hi = hi + 1 >>> 0;
		        return -(lo + hi * 4294967296);
		      }
		      return this.lo + this.hi * 4294967296;
		    };
		    LongBits.prototype.toLong = function toLong(unsigned) {
		      return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
		    };
		    var charCodeAt = String.prototype.charCodeAt;
		    LongBits.fromHash = function fromHash(hash) {
		      if (hash === zeroHash)
		        return zero;
		      return new LongBits(
		        (charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0,
		        (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0
		      );
		    };
		    LongBits.prototype.toHash = function toHash() {
		      return String.fromCharCode(
		        this.lo & 255,
		        this.lo >>> 8 & 255,
		        this.lo >>> 16 & 255,
		        this.lo >>> 24,
		        this.hi & 255,
		        this.hi >>> 8 & 255,
		        this.hi >>> 16 & 255,
		        this.hi >>> 24
		      );
		    };
		    LongBits.prototype.zzEncode = function zzEncode() {
		      var mask = this.hi >> 31;
		      this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
		      this.lo = (this.lo << 1 ^ mask) >>> 0;
		      return this;
		    };
		    LongBits.prototype.zzDecode = function zzDecode() {
		      var mask = -(this.lo & 1);
		      this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
		      this.hi = (this.hi >>> 1 ^ mask) >>> 0;
		      return this;
		    };
		    LongBits.prototype.length = function length() {
		      var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
		      return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
		    };
		  }, { "39": 39 }], 39: [function(require, module2, exports) {
		    var util = exports;
		    util.asPromise = require(1);
		    util.base64 = require(2);
		    util.EventEmitter = require(4);
		    util.float = require(6);
		    util.inquire = require(7);
		    util.utf8 = require(10);
		    util.pool = require(9);
		    util.LongBits = require(38);
		    util.emptyArray = Object.freeze ? Object.freeze([]) : (
		      /* istanbul ignore next */
		      []
		    );
		    util.emptyObject = Object.freeze ? Object.freeze({}) : (
		      /* istanbul ignore next */
		      {}
		    );
		    util.isNode = Boolean(commonjsGlobal.process && commonjsGlobal.process.versions && commonjsGlobal.process.versions.node);
		    util.isInteger = Number.isInteger || /* istanbul ignore next */
		    function isInteger(value) {
		      return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
		    };
		    util.isString = function isString(value) {
		      return typeof value === "string" || value instanceof String;
		    };
		    util.isObject = function isObject(value) {
		      return value && typeof value === "object";
		    };
		    util.isset = /**
		     * Checks if a property on a message is considered to be present.
		     * @param {Object} obj Plain object or message instance
		     * @param {string} prop Property name
		     * @returns {boolean} `true` if considered to be present, otherwise `false`
		     */
		    util.isSet = function isSet(obj, prop) {
		      var value = obj[prop];
		      if (value != null && obj.hasOwnProperty(prop))
		        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
		      return false;
		    };
		    util.Buffer = function() {
		      try {
		        var Buffer = util.inquire("buffer").Buffer;
		        return Buffer.prototype.utf8Write ? Buffer : (
		          /* istanbul ignore next */
		          null
		        );
		      } catch (e) {
		        return null;
		      }
		    }();
		    util._Buffer_from = null;
		    util._Buffer_allocUnsafe = null;
		    util.newBuffer = function newBuffer(sizeOrArray) {
		      return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
		    };
		    util.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
		    util.Long = /* istanbul ignore next */
		    commonjsGlobal.dcodeIO && /* istanbul ignore next */
		    commonjsGlobal.dcodeIO.Long || util.inquire("long");
		    util.key2Re = /^true|false|0|1$/;
		    util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
		    util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
		    util.longToHash = function longToHash(value) {
		      return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
		    };
		    util.longFromHash = function longFromHash(hash, unsigned) {
		      var bits = util.LongBits.fromHash(hash);
		      if (util.Long)
		        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
		      return bits.toNumber(Boolean(unsigned));
		    };
		    function merge(dst, src, ifNotSet) {
		      for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
		        if (dst[keys[i]] === undefined$1 || !ifNotSet)
		          dst[keys[i]] = src[keys[i]];
		      return dst;
		    }
		    util.merge = merge;
		    util.lcFirst = function lcFirst(str) {
		      return str.charAt(0).toLowerCase() + str.substring(1);
		    };
		    function newError(name) {
		      function CustomError(message, properties) {
		        if (!(this instanceof CustomError))
		          return new CustomError(message, properties);
		        Object.defineProperty(this, "message", { get: function() {
		          return message;
		        } });
		        if (Error.captureStackTrace)
		          Error.captureStackTrace(this, CustomError);
		        else
		          Object.defineProperty(this, "stack", { value: new Error().stack || "" });
		        if (properties)
		          merge(this, properties);
		      }
		      (CustomError.prototype = Object.create(Error.prototype)).constructor = CustomError;
		      Object.defineProperty(CustomError.prototype, "name", { get: function() {
		        return name;
		      } });
		      CustomError.prototype.toString = function toString() {
		        return this.name + ": " + this.message;
		      };
		      return CustomError;
		    }
		    util.newError = newError;
		    util.ProtocolError = newError("ProtocolError");
		    util.oneOfGetter = function getOneOf(fieldNames) {
		      var fieldMap = {};
		      for (var i = 0; i < fieldNames.length; ++i)
		        fieldMap[fieldNames[i]] = 1;
		      return function() {
		        for (var keys = Object.keys(this), i2 = keys.length - 1; i2 > -1; --i2)
		          if (fieldMap[keys[i2]] === 1 && this[keys[i2]] !== undefined$1 && this[keys[i2]] !== null)
		            return keys[i2];
		      };
		    };
		    util.oneOfSetter = function setOneOf(fieldNames) {
		      return function(name) {
		        for (var i = 0; i < fieldNames.length; ++i)
		          if (fieldNames[i] !== name)
		            delete this[fieldNames[i]];
		      };
		    };
		    util.toJSONOptions = {
		      longs: String,
		      enums: String,
		      bytes: String,
		      json: true
		    };
		    util._configure = function() {
		      var Buffer = util.Buffer;
		      if (!Buffer) {
		        util._Buffer_from = util._Buffer_allocUnsafe = null;
		        return;
		      }
		      util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from || /* istanbul ignore next */
		      function Buffer_from(value, encoding) {
		        return new Buffer(value, encoding);
		      };
		      util._Buffer_allocUnsafe = Buffer.allocUnsafe || /* istanbul ignore next */
		      function Buffer_allocUnsafe(size) {
		        return new Buffer(size);
		      };
		    };
		  }, { "1": 1, "10": 10, "2": 2, "38": 38, "4": 4, "6": 6, "7": 7, "9": 9 }], 40: [function(require, module2, exports) {
		    module2.exports = verifier;
		    var Enum = require(15), util = require(37);
		    function invalid(field, expected) {
		      return field.name + ": " + expected + (field.repeated && expected !== "array" ? "[]" : field.map && expected !== "object" ? "{k:" + field.keyType + "}" : "") + " expected";
		    }
		    function genVerifyValue(gen, field, fieldIndex, ref) {
		      if (field.resolvedType) {
		        if (field.resolvedType instanceof Enum) {
		          gen("switch(%s){", ref)("default:")("return%j", invalid(field, "enum value"));
		          for (var keys = Object.keys(field.resolvedType.values), j = 0; j < keys.length; ++j) gen("case %i:", field.resolvedType.values[keys[j]]);
		          gen("break")("}");
		        } else {
		          gen("{")("var e=types[%i].verify(%s);", fieldIndex, ref)("if(e)")("return%j+e", field.name + ".")("}");
		        }
		      } else {
		        switch (field.type) {
		          case "int32":
		          case "uint32":
		          case "sint32":
		          case "fixed32":
		          case "sfixed32":
		            gen("if(!util.isInteger(%s))", ref)("return%j", invalid(field, "integer"));
		            break;
		          case "int64":
		          case "uint64":
		          case "sint64":
		          case "fixed64":
		          case "sfixed64":
		            gen("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", ref, ref, ref, ref)("return%j", invalid(field, "integer|Long"));
		            break;
		          case "float":
		          case "double":
		            gen('if(typeof %s!=="number")', ref)("return%j", invalid(field, "number"));
		            break;
		          case "bool":
		            gen('if(typeof %s!=="boolean")', ref)("return%j", invalid(field, "boolean"));
		            break;
		          case "string":
		            gen("if(!util.isString(%s))", ref)("return%j", invalid(field, "string"));
		            break;
		          case "bytes":
		            gen('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))', ref, ref, ref)("return%j", invalid(field, "buffer"));
		            break;
		        }
		      }
		      return gen;
		    }
		    function genVerifyKey(gen, field, ref) {
		      switch (field.keyType) {
		        case "int32":
		        case "uint32":
		        case "sint32":
		        case "fixed32":
		        case "sfixed32":
		          gen("if(!util.key32Re.test(%s))", ref)("return%j", invalid(field, "integer key"));
		          break;
		        case "int64":
		        case "uint64":
		        case "sint64":
		        case "fixed64":
		        case "sfixed64":
		          gen("if(!util.key64Re.test(%s))", ref)("return%j", invalid(field, "integer|Long key"));
		          break;
		        case "bool":
		          gen("if(!util.key2Re.test(%s))", ref)("return%j", invalid(field, "boolean key"));
		          break;
		      }
		      return gen;
		    }
		    function verifier(mtype) {
		      var gen = util.codegen(["m"], mtype.name + "$verify")('if(typeof m!=="object"||m===null)')("return%j", "object expected");
		      var oneofs = mtype.oneofsArray, seenFirstField = {};
		      if (oneofs.length) gen("var p={}");
		      for (var i = 0; i < /* initializes */
		      mtype.fieldsArray.length; ++i) {
		        var field = mtype._fieldsArray[i].resolve(), ref = "m" + util.safeProp(field.name);
		        if (field.optional) gen("if(%s!=null&&m.hasOwnProperty(%j)){", ref, field.name);
		        if (field.map) {
		          gen("if(!util.isObject(%s))", ref)("return%j", invalid(field, "object"))("var k=Object.keys(%s)", ref)("for(var i=0;i<k.length;++i){");
		          genVerifyKey(gen, field, "k[i]");
		          genVerifyValue(gen, field, i, ref + "[k[i]]")("}");
		        } else if (field.repeated) {
		          gen("if(!Array.isArray(%s))", ref)("return%j", invalid(field, "array"))("for(var i=0;i<%s.length;++i){", ref);
		          genVerifyValue(gen, field, i, ref + "[i]")("}");
		        } else {
		          if (field.partOf) {
		            var oneofProp = util.safeProp(field.partOf.name);
		            if (seenFirstField[field.partOf.name] === 1) gen("if(p%s===1)", oneofProp)("return%j", field.partOf.name + ": multiple values");
		            seenFirstField[field.partOf.name] = 1;
		            gen("p%s=1", oneofProp);
		          }
		          genVerifyValue(gen, field, i, ref);
		        }
		        if (field.optional) gen("}");
		      }
		      return gen("return null");
		    }
		  }, { "15": 15, "37": 37 }], 41: [function(require, module2, exports) {
		    var wrappers = exports;
		    var Message = require(21);
		    wrappers[".google.protobuf.Any"] = {
		      fromObject: function(object) {
		        if (object && object["@type"]) {
		          var type = this.lookup(object["@type"]);
		          if (type) {
		            var type_url = object["@type"].charAt(0) === "." ? object["@type"].substr(1) : object["@type"];
		            return this.create({
		              type_url: "/" + type_url,
		              value: type.encode(type.fromObject(object)).finish()
		            });
		          }
		        }
		        return this.fromObject(object);
		      },
		      toObject: function(message, options) {
		        if (options && options.json && message.type_url && message.value) {
		          var name = message.type_url.substring(message.type_url.lastIndexOf("/") + 1);
		          var type = this.lookup(name);
		          if (type)
		            message = type.decode(message.value);
		        }
		        if (!(message instanceof this.ctor) && message instanceof Message) {
		          var object = message.$type.toObject(message, options);
		          object["@type"] = message.$type.fullName;
		          return object;
		        }
		        return this.toObject(message, options);
		      }
		    };
		  }, { "21": 21 }], 42: [function(require, module2, exports) {
		    module2.exports = Writer;
		    var util = require(39);
		    var BufferWriter;
		    var LongBits = util.LongBits, base64 = util.base64, utf8 = util.utf8;
		    function Op(fn, len, val) {
		      this.fn = fn;
		      this.len = len;
		      this.next = undefined$1;
		      this.val = val;
		    }
		    function noop() {
		    }
		    function State(writer) {
		      this.head = writer.head;
		      this.tail = writer.tail;
		      this.len = writer.len;
		      this.next = writer.states;
		    }
		    function Writer() {
		      this.len = 0;
		      this.head = new Op(noop, 0, 0);
		      this.tail = this.head;
		      this.states = null;
		    }
		    Writer.create = util.Buffer ? function create_buffer_setup() {
		      return (Writer.create = function create_buffer() {
		        return new BufferWriter();
		      })();
		    } : function create_array() {
		      return new Writer();
		    };
		    Writer.alloc = function alloc(size) {
		      return new util.Array(size);
		    };
		    if (util.Array !== Array)
		      Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
		    Writer.prototype._push = function push(fn, len, val) {
		      this.tail = this.tail.next = new Op(fn, len, val);
		      this.len += len;
		      return this;
		    };
		    function writeByte(val, buf, pos) {
		      buf[pos] = val & 255;
		    }
		    function writeVarint32(val, buf, pos) {
		      while (val > 127) {
		        buf[pos++] = val & 127 | 128;
		        val >>>= 7;
		      }
		      buf[pos] = val;
		    }
		    function VarintOp(len, val) {
		      this.len = len;
		      this.next = undefined$1;
		      this.val = val;
		    }
		    VarintOp.prototype = Object.create(Op.prototype);
		    VarintOp.prototype.fn = writeVarint32;
		    Writer.prototype.uint32 = function write_uint32(value) {
		      this.len += (this.tail = this.tail.next = new VarintOp(
		        (value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5,
		        value
		      )).len;
		      return this;
		    };
		    Writer.prototype.int32 = function write_int32(value) {
		      return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
		    };
		    Writer.prototype.sint32 = function write_sint32(value) {
		      return this.uint32((value << 1 ^ value >> 31) >>> 0);
		    };
		    function writeVarint64(val, buf, pos) {
		      while (val.hi) {
		        buf[pos++] = val.lo & 127 | 128;
		        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
		        val.hi >>>= 7;
		      }
		      while (val.lo > 127) {
		        buf[pos++] = val.lo & 127 | 128;
		        val.lo = val.lo >>> 7;
		      }
		      buf[pos++] = val.lo;
		    }
		    Writer.prototype.uint64 = function write_uint64(value) {
		      var bits = LongBits.from(value);
		      return this._push(writeVarint64, bits.length(), bits);
		    };
		    Writer.prototype.int64 = Writer.prototype.uint64;
		    Writer.prototype.sint64 = function write_sint64(value) {
		      var bits = LongBits.from(value).zzEncode();
		      return this._push(writeVarint64, bits.length(), bits);
		    };
		    Writer.prototype.bool = function write_bool(value) {
		      return this._push(writeByte, 1, value ? 1 : 0);
		    };
		    function writeFixed32(val, buf, pos) {
		      buf[pos] = val & 255;
		      buf[pos + 1] = val >>> 8 & 255;
		      buf[pos + 2] = val >>> 16 & 255;
		      buf[pos + 3] = val >>> 24;
		    }
		    Writer.prototype.fixed32 = function write_fixed32(value) {
		      return this._push(writeFixed32, 4, value >>> 0);
		    };
		    Writer.prototype.sfixed32 = Writer.prototype.fixed32;
		    Writer.prototype.fixed64 = function write_fixed64(value) {
		      var bits = LongBits.from(value);
		      return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
		    };
		    Writer.prototype.sfixed64 = Writer.prototype.fixed64;
		    Writer.prototype.float = function write_float(value) {
		      return this._push(util.float.writeFloatLE, 4, value);
		    };
		    Writer.prototype.double = function write_double(value) {
		      return this._push(util.float.writeDoubleLE, 8, value);
		    };
		    var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
		      buf.set(val, pos);
		    } : function writeBytes_for(val, buf, pos) {
		      for (var i = 0; i < val.length; ++i)
		        buf[pos + i] = val[i];
		    };
		    Writer.prototype.bytes = function write_bytes(value) {
		      var len = value.length >>> 0;
		      if (!len)
		        return this._push(writeByte, 1, 0);
		      if (util.isString(value)) {
		        var buf = Writer.alloc(len = base64.length(value));
		        base64.decode(value, buf, 0);
		        value = buf;
		      }
		      return this.uint32(len)._push(writeBytes, len, value);
		    };
		    Writer.prototype.string = function write_string(value) {
		      var len = utf8.length(value);
		      return len ? this.uint32(len)._push(utf8.write, len, value) : this._push(writeByte, 1, 0);
		    };
		    Writer.prototype.fork = function fork() {
		      this.states = new State(this);
		      this.head = this.tail = new Op(noop, 0, 0);
		      this.len = 0;
		      return this;
		    };
		    Writer.prototype.reset = function reset() {
		      if (this.states) {
		        this.head = this.states.head;
		        this.tail = this.states.tail;
		        this.len = this.states.len;
		        this.states = this.states.next;
		      } else {
		        this.head = this.tail = new Op(noop, 0, 0);
		        this.len = 0;
		      }
		      return this;
		    };
		    Writer.prototype.ldelim = function ldelim() {
		      var head = this.head, tail = this.tail, len = this.len;
		      this.reset().uint32(len);
		      if (len) {
		        this.tail.next = head.next;
		        this.tail = tail;
		        this.len += len;
		      }
		      return this;
		    };
		    Writer.prototype.finish = function finish() {
		      var head = this.head.next, buf = this.constructor.alloc(this.len), pos = 0;
		      while (head) {
		        head.fn(head.val, buf, pos);
		        pos += head.len;
		        head = head.next;
		      }
		      return buf;
		    };
		    Writer._configure = function(BufferWriter_) {
		      BufferWriter = BufferWriter_;
		    };
		  }, { "39": 39 }], 43: [function(require, module2, exports) {
		    module2.exports = BufferWriter;
		    var Writer = require(42);
		    (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
		    var util = require(39);
		    var Buffer = util.Buffer;
		    function BufferWriter() {
		      Writer.call(this);
		    }
		    BufferWriter.alloc = function alloc_buffer(size) {
		      return (BufferWriter.alloc = util._Buffer_allocUnsafe)(size);
		    };
		    var writeBytesBuffer = Buffer && Buffer.prototype instanceof Uint8Array && Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf, pos) {
		      buf.set(val, pos);
		    } : function writeBytesBuffer_copy(val, buf, pos) {
		      if (val.copy)
		        val.copy(buf, pos, 0, val.length);
		      else for (var i = 0; i < val.length; )
		        buf[pos++] = val[i++];
		    };
		    BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
		      if (util.isString(value))
		        value = util._Buffer_from(value, "base64");
		      var len = value.length >>> 0;
		      this.uint32(len);
		      if (len)
		        this._push(writeBytesBuffer, len, value);
		      return this;
		    };
		    function writeStringBuffer(val, buf, pos) {
		      if (val.length < 40)
		        util.utf8.write(val, buf, pos);
		      else
		        buf.utf8Write(val, pos);
		    }
		    BufferWriter.prototype.string = function write_string_buffer(value) {
		      var len = Buffer.byteLength(value);
		      this.uint32(len);
		      if (len)
		        this._push(writeStringBuffer, len, value);
		      return this;
		    };
		  }, { "39": 39, "42": 42 }] }, {}, [19]);
		})(); 
	} (protobuf));
	return protobuf.exports;
}

var protobufExports = /*@__PURE__*/ requireProtobuf();
const $protobuf = /*@__PURE__*/getDefaultExportFromCjs(protobufExports);

let $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
const $root = $protobuf.roots["push-server"] || ($protobuf.roots["push-server"] = {});
$root.RequestBatch = function() {
  function RequestBatch(properties) {
    this.requests = [];
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  RequestBatch.prototype.requests = $util.emptyArray;
  RequestBatch.create = function create(properties) {
    return new RequestBatch(properties);
  };
  RequestBatch.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    if (message.requests != null && message.requests.length) {
      for (var i = 0; i < message.requests.length; ++i)
        $root.Request.encode(
          message.requests[i],
          writer.uint32(
            /* id 1, wireType 2 =*/
            10
          ).fork()
        ).ldelim();
    }
    return writer;
  };
  RequestBatch.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.RequestBatch();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (!(message.requests && message.requests.length)) {
            message.requests = [];
          }
          message.requests.push($root.Request.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return RequestBatch;
}();
$root.Request = function() {
  function Request(properties) {
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  Request.prototype.incomingMessages = null;
  Request.prototype.channelStats = null;
  Request.prototype.serverStats = null;
  var $oneOfFields;
  Object.defineProperty(Request.prototype, "command", {
    get: $util.oneOfGetter(
      $oneOfFields = ["incomingMessages", "channelStats", "serverStats"]
    ),
    set: $util.oneOfSetter($oneOfFields)
  });
  Request.create = function create(properties) {
    return new Request(properties);
  };
  Request.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    if (message.incomingMessages != null && message.hasOwnProperty("incomingMessages")) {
      $root.IncomingMessagesRequest.encode(
        message.incomingMessages,
        writer.uint32(
          /* id 1, wireType 2 =*/
          10
        ).fork()
      ).ldelim();
    }
    if (message.channelStats != null && message.hasOwnProperty("channelStats")) {
      $root.ChannelStatsRequest.encode(
        message.channelStats,
        writer.uint32(
          /* id 2, wireType 2 =*/
          18
        ).fork()
      ).ldelim();
    }
    if (message.serverStats != null && message.hasOwnProperty("serverStats")) {
      $root.ServerStatsRequest.encode(
        message.serverStats,
        writer.uint32(
          /* id 3, wireType 2 =*/
          26
        ).fork()
      ).ldelim();
    }
    return writer;
  };
  Request.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.Request();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.incomingMessages = $root.IncomingMessagesRequest.decode(
            reader,
            reader.uint32()
          );
          break;
        case 2:
          message.channelStats = $root.ChannelStatsRequest.decode(
            reader,
            reader.uint32()
          );
          break;
        case 3:
          message.serverStats = $root.ServerStatsRequest.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return Request;
}();
$root.IncomingMessagesRequest = function() {
  function IncomingMessagesRequest(properties) {
    this.messages = [];
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  IncomingMessagesRequest.prototype.messages = $util.emptyArray;
  IncomingMessagesRequest.create = function create(properties) {
    return new IncomingMessagesRequest(properties);
  };
  IncomingMessagesRequest.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    if (message.messages != null && message.messages.length) {
      for (var i = 0; i < message.messages.length; ++i)
        $root.IncomingMessage.encode(
          message.messages[i],
          writer.uint32(
            /* id 1, wireType 2 =*/
            10
          ).fork()
        ).ldelim();
    }
    return writer;
  };
  IncomingMessagesRequest.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.IncomingMessagesRequest();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (!(message.messages && message.messages.length)) {
            message.messages = [];
          }
          message.messages.push(
            $root.IncomingMessage.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return IncomingMessagesRequest;
}();
$root.IncomingMessage = function() {
  function IncomingMessage(properties) {
    this.receivers = [];
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  IncomingMessage.prototype.receivers = $util.emptyArray;
  IncomingMessage.prototype.sender = null;
  IncomingMessage.prototype.body = "";
  IncomingMessage.prototype.expiry = 0;
  IncomingMessage.prototype.type = "";
  IncomingMessage.create = function create(properties) {
    return new IncomingMessage(properties);
  };
  IncomingMessage.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    if (message.receivers != null && message.receivers.length) {
      for (var i = 0; i < message.receivers.length; ++i)
        $root.Receiver.encode(
          message.receivers[i],
          writer.uint32(
            /* id 1, wireType 2 =*/
            10
          ).fork()
        ).ldelim();
    }
    if (message.sender != null && message.hasOwnProperty("sender")) {
      $root.Sender.encode(
        message.sender,
        writer.uint32(
          /* id 2, wireType 2 =*/
          18
        ).fork()
      ).ldelim();
    }
    if (message.body != null && message.hasOwnProperty("body")) {
      writer.uint32(
        /* id 3, wireType 2 =*/
        26
      ).string(message.body);
    }
    if (message.expiry != null && message.hasOwnProperty("expiry")) {
      writer.uint32(
        /* id 4, wireType 0 =*/
        32
      ).uint32(message.expiry);
    }
    if (message.type != null && message.hasOwnProperty("type")) {
      writer.uint32(
        /* id 5, wireType 2 =*/
        42
      ).string(message.type);
    }
    return writer;
  };
  IncomingMessage.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.IncomingMessage();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (!(message.receivers && message.receivers.length)) {
            message.receivers = [];
          }
          message.receivers.push($root.Receiver.decode(reader, reader.uint32()));
          break;
        case 2:
          message.sender = $root.Sender.decode(reader, reader.uint32());
          break;
        case 3:
          message.body = reader.string();
          break;
        case 4:
          message.expiry = reader.uint32();
          break;
        case 5:
          message.type = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return IncomingMessage;
}();
$root.ChannelStatsRequest = function() {
  function ChannelStatsRequest(properties) {
    this.channels = [];
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  ChannelStatsRequest.prototype.channels = $util.emptyArray;
  ChannelStatsRequest.create = function create(properties) {
    return new ChannelStatsRequest(properties);
  };
  ChannelStatsRequest.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    if (message.channels != null && message.channels.length) {
      for (var i = 0; i < message.channels.length; ++i)
        $root.ChannelId.encode(
          message.channels[i],
          writer.uint32(
            /* id 1, wireType 2 =*/
            10
          ).fork()
        ).ldelim();
    }
    return writer;
  };
  ChannelStatsRequest.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.ChannelStatsRequest();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (!(message.channels && message.channels.length)) {
            message.channels = [];
          }
          message.channels.push($root.ChannelId.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return ChannelStatsRequest;
}();
$root.ChannelId = function() {
  function ChannelId(properties) {
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  ChannelId.prototype.id = $util.newBuffer([]);
  ChannelId.prototype.isPrivate = false;
  ChannelId.prototype.signature = $util.newBuffer([]);
  ChannelId.create = function create(properties) {
    return new ChannelId(properties);
  };
  ChannelId.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    if (message.id != null && message.hasOwnProperty("id")) {
      writer.uint32(
        /* id 1, wireType 2 =*/
        10
      ).bytes(message.id);
    }
    if (message.isPrivate != null && message.hasOwnProperty("isPrivate")) {
      writer.uint32(
        /* id 2, wireType 0 =*/
        16
      ).bool(message.isPrivate);
    }
    if (message.signature != null && message.hasOwnProperty("signature")) {
      writer.uint32(
        /* id 3, wireType 2 =*/
        26
      ).bytes(message.signature);
    }
    return writer;
  };
  ChannelId.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.ChannelId();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.bytes();
          break;
        case 2:
          message.isPrivate = reader.bool();
          break;
        case 3:
          message.signature = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return ChannelId;
}();
$root.ServerStatsRequest = function() {
  function ServerStatsRequest(properties) {
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  ServerStatsRequest.create = function create(properties) {
    return new ServerStatsRequest(properties);
  };
  ServerStatsRequest.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    return writer;
  };
  ServerStatsRequest.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.ServerStatsRequest();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return ServerStatsRequest;
}();
$root.Sender = function() {
  function Sender(properties) {
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  Sender.prototype.type = 0;
  Sender.prototype.id = $util.newBuffer([]);
  Sender.create = function create(properties) {
    return new Sender(properties);
  };
  Sender.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    if (message.type != null && message.hasOwnProperty("type")) {
      writer.uint32(
        /* id 1, wireType 0 =*/
        8
      ).int32(message.type);
    }
    if (message.id != null && message.hasOwnProperty("id")) {
      writer.uint32(
        /* id 2, wireType 2 =*/
        18
      ).bytes(message.id);
    }
    return writer;
  };
  Sender.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.Sender();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.int32();
          break;
        case 2:
          message.id = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return Sender;
}();
$root.SenderType = function() {
  var valuesById = {}, values = Object.create(valuesById);
  values[valuesById[0] = "UNKNOWN"] = 0;
  values[valuesById[1] = "CLIENT"] = 1;
  values[valuesById[2] = "BACKEND"] = 2;
  return values;
}();
$root.Receiver = function() {
  function Receiver(properties) {
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  Receiver.prototype.id = $util.newBuffer([]);
  Receiver.prototype.isPrivate = false;
  Receiver.prototype.signature = $util.newBuffer([]);
  Receiver.create = function create(properties) {
    return new Receiver(properties);
  };
  Receiver.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    if (message.id != null && message.hasOwnProperty("id")) {
      writer.uint32(
        /* id 1, wireType 2 =*/
        10
      ).bytes(message.id);
    }
    if (message.isPrivate != null && message.hasOwnProperty("isPrivate")) {
      writer.uint32(
        /* id 2, wireType 0 =*/
        16
      ).bool(message.isPrivate);
    }
    if (message.signature != null && message.hasOwnProperty("signature")) {
      writer.uint32(
        /* id 3, wireType 2 =*/
        26
      ).bytes(message.signature);
    }
    return writer;
  };
  Receiver.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.Receiver();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.bytes();
          break;
        case 2:
          message.isPrivate = reader.bool();
          break;
        case 3:
          message.signature = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return Receiver;
}();
$root.ResponseBatch = function() {
  function ResponseBatch(properties) {
    this.responses = [];
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  ResponseBatch.prototype.responses = $util.emptyArray;
  ResponseBatch.create = function create(properties) {
    return new ResponseBatch(properties);
  };
  ResponseBatch.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    if (message.responses != null && message.responses.length) {
      for (var i = 0; i < message.responses.length; ++i)
        $root.Response.encode(
          message.responses[i],
          writer.uint32(
            /* id 1, wireType 2 =*/
            10
          ).fork()
        ).ldelim();
    }
    return writer;
  };
  ResponseBatch.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.ResponseBatch();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (!(message.responses && message.responses.length)) {
            message.responses = [];
          }
          message.responses.push($root.Response.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return ResponseBatch;
}();
$root.Response = function() {
  function Response(properties) {
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  Response.prototype.outgoingMessages = null;
  Response.prototype.channelStats = null;
  Response.prototype.serverStats = null;
  var $oneOfFields;
  Object.defineProperty(Response.prototype, "command", {
    get: $util.oneOfGetter(
      $oneOfFields = ["outgoingMessages", "channelStats", "serverStats"]
    ),
    set: $util.oneOfSetter($oneOfFields)
  });
  Response.create = function create(properties) {
    return new Response(properties);
  };
  Response.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    if (message.outgoingMessages != null && message.hasOwnProperty("outgoingMessages")) {
      $root.OutgoingMessagesResponse.encode(
        message.outgoingMessages,
        writer.uint32(
          /* id 1, wireType 2 =*/
          10
        ).fork()
      ).ldelim();
    }
    if (message.channelStats != null && message.hasOwnProperty("channelStats")) {
      $root.ChannelStatsResponse.encode(
        message.channelStats,
        writer.uint32(
          /* id 2, wireType 2 =*/
          18
        ).fork()
      ).ldelim();
    }
    if (message.serverStats != null && message.hasOwnProperty("serverStats")) {
      $root.JsonResponse.encode(
        message.serverStats,
        writer.uint32(
          /* id 3, wireType 2 =*/
          26
        ).fork()
      ).ldelim();
    }
    return writer;
  };
  Response.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.Response();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.outgoingMessages = $root.OutgoingMessagesResponse.decode(
            reader,
            reader.uint32()
          );
          break;
        case 2:
          message.channelStats = $root.ChannelStatsResponse.decode(
            reader,
            reader.uint32()
          );
          break;
        case 3:
          message.serverStats = $root.JsonResponse.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return Response;
}();
$root.OutgoingMessagesResponse = function() {
  function OutgoingMessagesResponse(properties) {
    this.messages = [];
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  OutgoingMessagesResponse.prototype.messages = $util.emptyArray;
  OutgoingMessagesResponse.create = function create(properties) {
    return new OutgoingMessagesResponse(properties);
  };
  OutgoingMessagesResponse.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    if (message.messages != null && message.messages.length) {
      for (var i = 0; i < message.messages.length; ++i)
        $root.OutgoingMessage.encode(
          message.messages[i],
          writer.uint32(
            /* id 1, wireType 2 =*/
            10
          ).fork()
        ).ldelim();
    }
    return writer;
  };
  OutgoingMessagesResponse.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.OutgoingMessagesResponse();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (!(message.messages && message.messages.length)) {
            message.messages = [];
          }
          message.messages.push(
            $root.OutgoingMessage.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return OutgoingMessagesResponse;
}();
$root.OutgoingMessage = function() {
  function OutgoingMessage(properties) {
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  OutgoingMessage.prototype.id = $util.newBuffer([]);
  OutgoingMessage.prototype.body = "";
  OutgoingMessage.prototype.expiry = 0;
  OutgoingMessage.prototype.created = 0;
  OutgoingMessage.prototype.sender = null;
  OutgoingMessage.create = function create(properties) {
    return new OutgoingMessage(properties);
  };
  OutgoingMessage.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    if (message.id != null && message.hasOwnProperty("id")) {
      writer.uint32(
        /* id 1, wireType 2 =*/
        10
      ).bytes(message.id);
    }
    if (message.body != null && message.hasOwnProperty("body")) {
      writer.uint32(
        /* id 2, wireType 2 =*/
        18
      ).string(message.body);
    }
    if (message.expiry != null && message.hasOwnProperty("expiry")) {
      writer.uint32(
        /* id 3, wireType 0 =*/
        24
      ).uint32(message.expiry);
    }
    if (message.created != null && message.hasOwnProperty("created")) {
      writer.uint32(
        /* id 4, wireType 5 =*/
        37
      ).fixed32(message.created);
    }
    if (message.sender != null && message.hasOwnProperty("sender")) {
      $root.Sender.encode(
        message.sender,
        writer.uint32(
          /* id 5, wireType 2 =*/
          42
        ).fork()
      ).ldelim();
    }
    return writer;
  };
  OutgoingMessage.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.OutgoingMessage();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.bytes();
          break;
        case 2:
          message.body = reader.string();
          break;
        case 3:
          message.expiry = reader.uint32();
          break;
        case 4:
          message.created = reader.fixed32();
          break;
        case 5:
          message.sender = $root.Sender.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return OutgoingMessage;
}();
$root.ChannelStatsResponse = function() {
  function ChannelStatsResponse(properties) {
    this.channels = [];
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  ChannelStatsResponse.prototype.channels = $util.emptyArray;
  ChannelStatsResponse.create = function create(properties) {
    return new ChannelStatsResponse(properties);
  };
  ChannelStatsResponse.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    if (message.channels != null && message.channels.length) {
      for (var i = 0; i < message.channels.length; ++i)
        $root.ChannelStats.encode(
          message.channels[i],
          writer.uint32(
            /* id 1, wireType 2 =*/
            10
          ).fork()
        ).ldelim();
    }
    return writer;
  };
  ChannelStatsResponse.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.ChannelStatsResponse();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (!(message.channels && message.channels.length)) {
            message.channels = [];
          }
          message.channels.push(
            $root.ChannelStats.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return ChannelStatsResponse;
}();
$root.ChannelStats = function() {
  function ChannelStats(properties) {
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  ChannelStats.prototype.id = $util.newBuffer([]);
  ChannelStats.prototype.isPrivate = false;
  ChannelStats.prototype.isOnline = false;
  ChannelStats.create = function create(properties) {
    return new ChannelStats(properties);
  };
  ChannelStats.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    if (message.id != null && message.hasOwnProperty("id")) {
      writer.uint32(
        /* id 1, wireType 2 =*/
        10
      ).bytes(message.id);
    }
    if (message.isPrivate != null && message.hasOwnProperty("isPrivate")) {
      writer.uint32(
        /* id 2, wireType 0 =*/
        16
      ).bool(message.isPrivate);
    }
    if (message.isOnline != null && message.hasOwnProperty("isOnline")) {
      writer.uint32(
        /* id 3, wireType 0 =*/
        24
      ).bool(message.isOnline);
    }
    return writer;
  };
  ChannelStats.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.ChannelStats();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.bytes();
          break;
        case 2:
          message.isPrivate = reader.bool();
          break;
        case 3:
          message.isOnline = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return ChannelStats;
}();
$root.JsonResponse = function() {
  function JsonResponse(properties) {
    if (properties) {
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
    }
  }
  JsonResponse.prototype.json = "";
  JsonResponse.create = function create(properties) {
    return new JsonResponse(properties);
  };
  JsonResponse.encode = function encode(message, writer) {
    if (!writer) {
      writer = $Writer.create();
    }
    if (message.json != null && message.hasOwnProperty("json")) {
      writer.uint32(
        /* id 1, wireType 2 =*/
        10
      ).string(message.json);
    }
    return writer;
  };
  JsonResponse.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) {
      reader = $Reader.create(reader);
    }
    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.JsonResponse();
    while (reader.pos < end) {
      var tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.json = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  return JsonResponse;
}();

const ResponseBatch = $root["ResponseBatch"];
const RequestBatch = $root["RequestBatch"];
const IncomingMessage = $root["IncomingMessage"];
const Receiver = $root["Receiver"];

class AbstractConnector {
  _logger = null;
  _connected = false;
  _connectionType;
  _disconnectCode = 0;
  _disconnectReason = "";
  _parent;
  _callbacks;
  constructor(config) {
    this._parent = config.parent;
    this._connectionType = ConnectionType.Undefined;
    this._callbacks = {
      onOpen: Type.isFunction(config.onOpen) ? config.onOpen : () => {
      },
      onDisconnect: Type.isFunction(config.onDisconnect) ? config.onDisconnect : () => {
      },
      onError: Type.isFunction(config.onError) ? config.onError : () => {
      },
      onMessage: Type.isFunction(config.onMessage) ? config.onMessage : () => {
      }
    };
  }
  setLogger(logger) {
    this._logger = logger;
  }
  getLogger() {
    if (null === this._logger) {
      this._logger = LoggerBrowser.build(`NullLogger`);
      this._logger.setConfig({
        [LoggerType.desktop]: false,
        [LoggerType.log]: false,
        [LoggerType.info]: false,
        [LoggerType.warn]: false,
        [LoggerType.error]: true,
        [LoggerType.trace]: false
      });
    }
    return this._logger;
  }
  destroy() {
  }
  get connected() {
    return this._connected;
  }
  set connected(value) {
    if (value == this._connected) {
      return;
    }
    this._connected = value;
    if (this._connected) {
      this._callbacks.onOpen();
    } else {
      this._callbacks.onDisconnect({
        code: this.disconnectCode,
        reason: this.disconnectReason
      });
    }
  }
  get disconnectCode() {
    return this._disconnectCode;
  }
  get disconnectReason() {
    return this._disconnectReason;
  }
  get connectionPath() {
    return this._parent.getConnectionPath(this._connectionType);
  }
}

class WebSocketConnector extends AbstractConnector {
  _socket;
  _onSocketOpenHandler;
  _onSocketCloseHandler;
  _onSocketErrorHandler;
  _onSocketMessageHandler;
  constructor(config) {
    super(config);
    this._connectionType = ConnectionType.WebSocket;
    this._socket = null;
    this._onSocketOpenHandler = this._onSocketOpen.bind(this);
    this._onSocketCloseHandler = this._onSocketClose.bind(this);
    this._onSocketErrorHandler = this._onSocketError.bind(this);
    this._onSocketMessageHandler = this._onSocketMessage.bind(this);
  }
  destroy() {
    super.destroy();
    if (this._socket) {
      this._socket.close();
      this._socket = null;
    }
  }
  /**
   * @inheritDoc
   */
  connect() {
    if (this._socket) {
      if (this._socket.readyState === 1) {
        return;
      } else {
        this.clearEventListener();
        this._socket.close();
        this._socket = null;
      }
    }
    this._createSocket();
  }
  get socket() {
    return this._socket;
  }
  /**
   * @inheritDoc
   * @param code
   * @param reason
   */
  disconnect(code, reason) {
    if (this._socket !== null) {
      this.clearEventListener();
      this._socket.close(code, reason);
    }
    this._socket = null;
    this._disconnectCode = code;
    this._disconnectReason = reason;
    this.connected = false;
  }
  /**
   * Via websocket connection
   * @inheritDoc
   */
  send(buffer) {
    if (!this._socket || this._socket.readyState !== 1) {
      this.getLogger().error(
        new Error(`${Text.getDateForLog()}: Pull: WebSocket is not connected`)
      );
      return false;
    }
    this._socket.send(buffer);
    return true;
  }
  // region Event Handlers ////
  _onSocketOpen() {
    this.connected = true;
  }
  _onSocketClose(event) {
    this._socket = null;
    this._disconnectCode = Number(event.code);
    this._disconnectReason = event.reason;
    this.connected = false;
  }
  _onSocketError(event) {
    this._callbacks.onError(new Error(`Socket error: ${event}`));
  }
  _onSocketMessage(event) {
    this._callbacks.onMessage(event.data);
  }
  // endregion ////
  // region Tools ////
  clearEventListener() {
    if (this._socket) {
      this._socket.removeEventListener("open", this._onSocketOpenHandler);
      this._socket.removeEventListener("close", this._onSocketCloseHandler);
      this._socket.removeEventListener("error", this._onSocketErrorHandler);
      this._socket.removeEventListener("message", this._onSocketMessageHandler);
    }
  }
  _createSocket() {
    if (this._socket) {
      throw new Error("Socket already exists");
    }
    if (!this.connectionPath) {
      throw new Error("Websocket connection path is not defined");
    }
    this._socket = new WebSocket(this.connectionPath);
    this._socket.binaryType = "arraybuffer";
    this._socket.addEventListener("open", this._onSocketOpenHandler);
    this._socket.addEventListener("close", this._onSocketCloseHandler);
    this._socket.addEventListener("error", this._onSocketErrorHandler);
    this._socket.addEventListener("message", this._onSocketMessageHandler);
  }
  // endregion ////
}

const LONG_POLLING_TIMEOUT = 60;
class LongPollingConnector extends AbstractConnector {
  _active;
  _requestTimeout;
  _failureTimeout;
  _xhr;
  _requestAborted;
  constructor(config) {
    super(config);
    this._active = false;
    this._connectionType = ConnectionType.LongPolling;
    this._requestTimeout = null;
    this._failureTimeout = null;
    this._xhr = this.createXhr();
    this._requestAborted = false;
  }
  /**
   * @inheritDoc
   */
  connect() {
    this._active = true;
    this.performRequest();
  }
  /**
   * @inheritDoc
   * @param code
   * @param reason
   */
  disconnect(code, reason) {
    this._active = false;
    this.clearTimeOut();
    if (this._xhr) {
      this._requestAborted = true;
      this._xhr.abort();
    }
    this._disconnectCode = code;
    this._disconnectReason = reason;
    this.connected = false;
  }
  performRequest() {
    if (!this._active) {
      return;
    }
    if (!this.connectionPath) {
      throw new Error("Long polling connection path is not defined");
    }
    if (this._xhr.readyState !== 0 && this._xhr.readyState !== 4) {
      return;
    }
    this.clearTimeOut();
    this._failureTimeout = setTimeout(() => {
      this.connected = true;
    }, 5e3);
    this._requestTimeout = setTimeout(
      this.onRequestTimeout.bind(this),
      LONG_POLLING_TIMEOUT * 1e3
    );
    this._xhr.open("GET", this.connectionPath);
    this._xhr.send();
  }
  onRequestTimeout() {
    this._requestAborted = true;
    this._xhr.abort();
    this.performRequest();
  }
  onXhrReadyStateChange() {
    if (this._xhr.readyState === 4) {
      if (!this._requestAborted || this._xhr.status == 200) {
        this.onResponse(this._xhr.response);
      }
      this._requestAborted = false;
    }
  }
  /**
   * Via http request
   * @inheritDoc
   */
  send(buffer) {
    const path = this._parent.getPublicationPath();
    if (!path) {
      this.getLogger().error(
        new Error(`${Text.getDateForLog()}: Pull: publication path is empty`)
      );
      return false;
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", path);
    xhr.send(buffer);
    return true;
  }
  onResponse(response) {
    this.clearTimeOut();
    if (this._xhr.status === 200) {
      this.connected = true;
      if (Type.isStringFilled(response) || response instanceof ArrayBuffer) {
        this._callbacks.onMessage(response);
      } else {
        this._parent.session.mid = null;
      }
      this.performRequest();
    } else if (this._xhr.status === 304) {
      this.connected = true;
      if (this._xhr.getResponseHeader("Expires") === "Thu, 01 Jan 1973 11:11:01 GMT") {
        const lastMessageId = this._xhr.getResponseHeader("Last-Message-Id");
        if (Type.isStringFilled(lastMessageId)) {
          this._parent.setLastMessageId(lastMessageId || "");
        }
      }
      this.performRequest();
    } else {
      this._callbacks.onError(new Error("Could not connect to the server"));
      this.connected = false;
    }
  }
  // region Tools ////
  clearTimeOut() {
    if (this._failureTimeout) {
      clearTimeout(this._failureTimeout);
      this._failureTimeout = null;
    }
    if (this._requestTimeout) {
      clearTimeout(this._requestTimeout);
      this._requestTimeout = null;
    }
  }
  createXhr() {
    const result = new XMLHttpRequest();
    if (this._parent.isProtobufSupported() && !this._parent.isJsonRpc()) {
      result.responseType = "arraybuffer";
    }
    result.addEventListener(
      "readystatechange",
      this.onXhrReadyStateChange.bind(this)
    );
    return result;
  }
  // endregion ////
}

const REVISION = 19;
const RESTORE_WEBSOCKET_TIMEOUT = 30 * 60;
const OFFLINE_STATUS_DELAY = 5e3;
const CONFIG_CHECK_INTERVAL = 60 * 1e3;
const MAX_IDS_TO_STORE = 10;
const PING_TIMEOUT = 10;
const JSON_RPC_PING = "ping";
const JSON_RPC_PONG = "pong";
const LS_SESSION = "bx-pull-session";
const LS_SESSION_CACHE_TIME = 20;
const EmptyConfig = {
  api: {},
  channels: {},
  publicChannels: {},
  server: { timeShift: 0 },
  clientId: null,
  jwt: null,
  exp: 0
};
class PullClient {
  // region Params ////
  _logger = null;
  _restClient;
  _status;
  _context;
  _guestMode;
  _guestUserId;
  _userId;
  _configGetMethod;
  _getPublicListMethod;
  _siteId;
  _enabled;
  _unloading = false;
  _starting = false;
  _debug = false;
  _connectionAttempt = 0;
  _connectionType = ConnectionType.WebSocket;
  _reconnectTimeout = null;
  _restartTimeout = null;
  _restoreWebSocketTimeout = null;
  _skipStorageInit;
  _skipCheckRevision;
  _subscribers = {};
  _watchTagsQueue = /* @__PURE__ */ new Map();
  _watchUpdateInterval = 174e4;
  _watchForceUpdateInterval = 5e3;
  _configTimestamp = 0;
  _session = {
    mid: null,
    tag: null,
    time: null,
    history: {},
    lastMessageIds: [],
    messageCount: 0
  };
  _connectors = {
    [ConnectionType.Undefined]: null,
    [ConnectionType.WebSocket]: null,
    [ConnectionType.LongPolling]: null
  };
  _isSecure;
  _config = null;
  _storage = null;
  _sharedConfig;
  _channelManager;
  _jsonRpcAdapter = null;
  /**
   * @depricate
   */
  // private _notificationPopup: null = null
  // timers ////
  _checkInterval = null;
  _offlineTimeout = null;
  _watchUpdateTimeout = null;
  _pingWaitTimeout = null;
  // manual stop workaround ////
  _isManualDisconnect = false;
  _loggingEnabled = false;
  // bound event handlers ////
  _onPingTimeoutHandler;
  // [userId] => array of callbacks
  _userStatusCallbacks = {};
  _connectPromise = null;
  _startingPromise = null;
  // endregion ////
  // region Init ////
  /**
   * @param params
   */
  constructor(params) {
    this._restClient = params.b24;
    this._status = PullStatus.Offline;
    this._context = "master";
    if (params.restApplication) {
      if (typeof params.configGetMethod === "undefined") {
        params.configGetMethod = "pull.application.config.get";
      }
      if (typeof params.skipCheckRevision === "undefined") {
        params.skipCheckRevision = true;
      }
      if (Type.isStringFilled(params.restApplication)) {
        params.siteId = params.restApplication;
      }
      params.serverEnabled = true;
    }
    this._guestMode = params.guestMode ? Text.toBoolean(params.guestMode) : false;
    this._guestUserId = params.guestUserId ? Text.toInteger(params.guestUserId) : 0;
    if (this._guestMode && this._guestUserId > 0) {
      this._userId = this._guestUserId;
    } else {
      this._guestMode = false;
      this._userId = params.userId ? Text.toInteger(params.userId) : 0;
    }
    this._siteId = params.siteId ?? "none";
    this._enabled = !Type.isUndefined(params.serverEnabled) ? params.serverEnabled === true : true;
    this._configGetMethod = !Type.isStringFilled(params.configGetMethod) ? "pull.config.get" : params.configGetMethod || "";
    this._getPublicListMethod = !Type.isStringFilled(params.getPublicListMethod) ? "pull.channel.public.list" : params.getPublicListMethod || "";
    this._skipStorageInit = params.skipStorageInit === true;
    this._skipCheckRevision = params.skipCheckRevision === true;
    if (!Type.isUndefined(params.configTimestamp)) {
      this._configTimestamp = Text.toInteger(params.configTimestamp);
    }
    this._isSecure = document?.location.href.indexOf("https") === 0;
    if (this._userId && !this._skipStorageInit) {
      this._storage = new StorageManager({
        userId: this._userId,
        siteId: this._siteId
      });
    }
    this._sharedConfig = new SharedConfig({
      onWebSocketBlockChanged: this.onWebSocketBlockChanged.bind(this),
      storage: this._storage
    });
    this._channelManager = new ChannelManager({
      b24: this._restClient,
      getPublicListMethod: this._getPublicListMethod
    });
    this._loggingEnabled = this._sharedConfig.isLoggingEnabled();
    this._onPingTimeoutHandler = this.onPingTimeout.bind(this);
  }
  setLogger(logger) {
    this._logger = logger;
    this._jsonRpcAdapter?.setLogger(this.getLogger());
    this._storage?.setLogger(this.getLogger());
    this._sharedConfig.setLogger(this.getLogger());
    this._channelManager.setLogger(this.getLogger());
    this._connectors.webSocket?.setLogger(this.getLogger());
    this._connectors.longPolling?.setLogger(this.getLogger());
  }
  getLogger() {
    if (null === this._logger) {
      this._logger = LoggerBrowser.build(`NullLogger`);
      this._logger.setConfig({
        [LoggerType.desktop]: false,
        [LoggerType.log]: false,
        [LoggerType.info]: false,
        [LoggerType.warn]: false,
        [LoggerType.error]: true,
        [LoggerType.trace]: false
      });
    }
    return this._logger;
  }
  destroy() {
    this.stop(CloseReasons.NORMAL_CLOSURE, "manual stop");
    this.onBeforeUnload();
  }
  init() {
    this._connectors.webSocket = new WebSocketConnector({
      parent: this,
      onOpen: this.onWebSocketOpen.bind(this),
      onMessage: this.onIncomingMessage.bind(this),
      onDisconnect: this.onWebSocketDisconnect.bind(this),
      onError: this.onWebSocketError.bind(this)
    });
    this._connectors.longPolling = new LongPollingConnector({
      parent: this,
      onOpen: this.onLongPollingOpen.bind(this),
      onMessage: this.onIncomingMessage.bind(this),
      onDisconnect: this.onLongPollingDisconnect.bind(this),
      onError: this.onLongPollingError.bind(this)
    });
    this._connectionType = this.isWebSocketAllowed() ? ConnectionType.WebSocket : ConnectionType.LongPolling;
    window.addEventListener("beforeunload", this.onBeforeUnload.bind(this));
    window.addEventListener("offline", this.onOffline.bind(this));
    window.addEventListener("online", this.onOnline.bind(this));
    this._jsonRpcAdapter = new JsonRpc({
      connector: this._connectors.webSocket,
      handlers: {
        "incoming.message": this.handleRpcIncomingMessage.bind(this)
      }
    });
  }
  // endregion ////
  // region Get-Set ////
  get connector() {
    return this._connectors[this._connectionType];
  }
  get status() {
    return this._status;
  }
  /**
   * @param status
   */
  set status(status) {
    if (this._status === status) {
      return;
    }
    this._status = status;
    if (this._offlineTimeout) {
      clearTimeout(this._offlineTimeout);
      this._offlineTimeout = null;
    }
    if (status === PullStatus.Offline) {
      this.sendPullStatusDelayed(status, OFFLINE_STATUS_DELAY);
    } else {
      this.sendPullStatus(status);
    }
  }
  get session() {
    return this._session;
  }
  // endregion ////
  // region Public /////
  /**
   * Creates a subscription to incoming messages.
   *
   * @param {TypeSubscriptionOptions | TypeSubscriptionCommandHandler} params
   * @returns { () => void } - Unsubscribe callback function
   */
  subscribe(params) {
    if (!Type.isPlainObject(params)) {
      return this.attachCommandHandler(params);
    }
    params = params;
    params.type = params.type || SubscriptionType.Server;
    params.command = params.command || null;
    if (params.type == SubscriptionType.Server || params.type == SubscriptionType.Client) {
      if (typeof params.moduleId === "undefined") {
        throw new TypeError(
          `${Text.getDateForLog()}: Pull.subscribe: parameter moduleId is not specified`
        );
      }
      if (typeof this._subscribers[params.type] === "undefined") {
        this._subscribers[params.type] = {};
      }
      if (typeof this._subscribers[params.type][params.moduleId] === "undefined") {
        this._subscribers[params.type][params.moduleId] = {
          callbacks: [],
          commands: {}
        };
      }
      if (params.command) {
        if (typeof this._subscribers[params.type][params.moduleId]["commands"][params.command] === "undefined") {
          this._subscribers[params.type][params.moduleId]["commands"][params.command] = [];
        }
        this._subscribers[params.type][params.moduleId]["commands"][params.command].push(params.callback);
        return () => {
          if (typeof params.type === "undefined" || typeof params.moduleId === "undefined" || typeof params.command === "undefined" || null === params.command) {
            return;
          }
          this._subscribers[params.type][params.moduleId]["commands"][params.command] = this._subscribers[params.type][params.moduleId]["commands"][params.command].filter((element) => {
            return element !== params.callback;
          });
        };
      } else {
        this._subscribers[params.type][params.moduleId]["callbacks"].push(
          params.callback
        );
        return () => {
          if (typeof params.type === "undefined" || typeof params.moduleId === "undefined") {
            return;
          }
          this._subscribers[params.type][params.moduleId]["callbacks"] = this._subscribers[params.type][params.moduleId]["callbacks"].filter(
            (element) => {
              return element !== params.callback;
            }
          );
        };
      }
    } else {
      if (typeof this._subscribers[params.type] === "undefined") {
        this._subscribers[params.type] = [];
      }
      this._subscribers[params.type].push(params.callback);
      return () => {
        if (typeof params.type === "undefined") {
          return;
        }
        this._subscribers[params.type] = this._subscribers[params.type].filter(
          (element) => {
            return element !== params.callback;
          }
        );
      };
    }
  }
  /**
   * @param {TypeSubscriptionCommandHandler} handler
   * @returns {() => void} - Unsubscribe callback function
   */
  attachCommandHandler(handler) {
    if (typeof handler.getModuleId !== "function" || typeof handler.getModuleId() !== "string") {
      this.getLogger().error(
        `${Text.getDateForLog()}: Pull.attachCommandHandler: result of handler.getModuleId() is not a string.`
      );
      return () => {
      };
    }
    let type = SubscriptionType.Server;
    if (typeof handler.getSubscriptionType === "function") {
      type = handler.getSubscriptionType();
    }
    return this.subscribe({
      type,
      moduleId: handler.getModuleId(),
      callback: (data) => {
        let method = null;
        if (typeof handler.getMap === "function") {
          const mapping = handler.getMap();
          if (mapping && typeof mapping === "object") {
            const rowMapping = mapping[data.command];
            if (typeof rowMapping === "function") {
              method = rowMapping.bind(handler);
            } else if (typeof rowMapping === "string" && typeof handler[rowMapping] === "function") {
              method = handler[rowMapping].bind(handler);
            }
          }
        }
        if (!method) {
          const methodName = `handle${Text.capitalize(data.command)}`;
          if (typeof handler[methodName] === "function") {
            method = handler[methodName].bind(handler);
          }
        }
        if (method) {
          if (this._debug && this._context !== "master") {
            this.getLogger().warn(
              `${Text.getDateForLog()}: Pull.attachCommandHandler: result of handler.getModuleId() is not a string`,
              data
            );
          }
          method(data.params, data.extra, data.command);
        }
      }
    });
  }
  /**
   * @param config
   */
  async start(config = null) {
    let allowConfigCaching = true;
    if (this.isConnected()) {
      return Promise.resolve(true);
    }
    if (this._starting && this._startingPromise) {
      return this._startingPromise;
    }
    if (!this._userId) {
      throw new Error("Not set userId");
    }
    if (this._siteId === "none") {
      throw new Error("Not set siteId");
    }
    let skipReconnectToLastSession = false;
    if (!!config && Type.isPlainObject(config)) {
      if (typeof config?.skipReconnectToLastSession !== "undefined") {
        skipReconnectToLastSession = config.skipReconnectToLastSession;
        delete config.skipReconnectToLastSession;
      }
      this._config = config;
      allowConfigCaching = false;
    }
    if (!this._enabled) {
      return Promise.reject({
        ex: {
          error: "PULL_DISABLED",
          error_description: "Push & Pull server is disabled"
        }
      });
    }
    const now = Date.now();
    let oldSession;
    if (!skipReconnectToLastSession && this._storage) {
      oldSession = this._storage.get(LS_SESSION, null);
    }
    if (Type.isPlainObject(oldSession) && oldSession.hasOwnProperty("ttl") && oldSession.ttl >= now) {
      this._session.mid = oldSession.mid;
    }
    this._starting = true;
    return this._startingPromise = new Promise((resolve, reject) => {
      this.loadConfig("client_start").then((config2) => {
        this.setConfig(config2, allowConfigCaching);
        this.init();
        this.updateWatch(true);
        this.startCheckConfig();
        this.connect().then(
          () => resolve(true),
          (error) => reject(error)
        );
      }).catch((error) => {
        this._starting = false;
        this.status = PullStatus.Offline;
        this.stopCheckConfig();
        this.getLogger().error(
          `${Text.getDateForLog()}: Pull: could not read push-server config `,
          error
        );
        reject(error);
      });
    });
  }
  /**
   * @param disconnectCode
   * @param disconnectReason
   */
  restart(disconnectCode = CloseReasons.NORMAL_CLOSURE, disconnectReason = "manual restart") {
    if (this._restartTimeout) {
      clearTimeout(this._restartTimeout);
      this._restartTimeout = null;
    }
    this.getLogger().log(
      `${Text.getDateForLog()}: Pull: restarting with code ${disconnectCode}`
    );
    this.disconnect(disconnectCode, disconnectReason);
    if (this._storage) {
      this._storage.remove(LsKeys.PullConfig);
    }
    this._config = null;
    const loadConfigReason = `${disconnectCode}_${disconnectReason.replaceAll(" ", "_")}`;
    this.loadConfig(loadConfigReason).then(
      (config) => {
        this.setConfig(config, true);
        this.updateWatch();
        this.startCheckConfig();
        this.connect().catch((error) => {
          this.getLogger().error(error);
        });
      },
      (error) => {
        this.getLogger().error(
          `${Text.getDateForLog()}: Pull: could not read push-server config `,
          error
        );
        this.status = PullStatus.Offline;
        if (this._reconnectTimeout) {
          clearTimeout(this._reconnectTimeout);
          this._reconnectTimeout = null;
        }
        if (error?.status == 401 || error?.status == 403) {
          this.stopCheckConfig();
          this.onCustomEvent("onPullError", ["AUTHORIZE_ERROR"]);
        }
      }
    );
  }
  stop(disconnectCode = CloseReasons.NORMAL_CLOSURE, disconnectReason = "manual stop") {
    this.disconnect(disconnectCode, disconnectReason);
    this.stopCheckConfig();
  }
  reconnect(disconnectCode, disconnectReason, delay = 1) {
    this.disconnect(disconnectCode, disconnectReason);
    this.scheduleReconnect(delay);
  }
  /**
   * @param lastMessageId
   */
  setLastMessageId(lastMessageId) {
    this._session.mid = lastMessageId;
  }
  /**
   * Send a single message to the specified users.
   *
   * @param users User ids of the message receivers.
   * @param moduleId Name of the module to receive a message,
   * @param command Command name.
   * @param {object} params Command parameters.
   * @param [expiry] Message expiry time in seconds.
   * @return {Promise}
   */
  async sendMessage(users, moduleId, command, params, expiry) {
    const message = {
      userList: users,
      body: {
        module_id: moduleId,
        command,
        params
      },
      expiry
    };
    if (this.isJsonRpc()) {
      return this._jsonRpcAdapter?.executeOutgoingRpcCommand(
        RpcMethod.Publish,
        message
      );
    } else {
      return this.sendMessageBatch([message]);
    }
  }
  /**
   * Send a single message to the specified public channels.
   *
   * @param  publicChannels Public ids of the channels to receive a message.
   * @param moduleId Name of the module to receive a message,
   * @param command Command name.
   * @param {object} params Command parameters.
   * @param [expiry] Message expiry time in seconds.
   * @return {Promise}
   */
  async sendMessageToChannels(publicChannels, moduleId, command, params, expiry) {
    const message = {
      channelList: publicChannels,
      body: {
        module_id: moduleId,
        command,
        params
      },
      expiry
    };
    if (this.isJsonRpc()) {
      return this._jsonRpcAdapter?.executeOutgoingRpcCommand(
        RpcMethod.Publish,
        message
      );
    } else {
      return this.sendMessageBatch([message]);
    }
  }
  /**
   * @param debugFlag
   */
  capturePullEvent(debugFlag = true) {
    this._debug = debugFlag;
  }
  /**
   * @param loggingFlag
   */
  enableLogging(loggingFlag = true) {
    this._sharedConfig.setLoggingEnabled(loggingFlag);
    this._loggingEnabled = loggingFlag;
  }
  /**
   * Returns list channels that the connection is subscribed to.
   *
   * @returns {Promise}
   */
  async listChannels() {
    return this._jsonRpcAdapter?.executeOutgoingRpcCommand(
      RpcMethod.ListChannels,
      {}
    ) || Promise.reject(new Error("jsonRpcAdapter not init"));
  }
  /**
   * Returns "last seen" time in seconds for the users.
   * Result format: Object{userId: int}
   * If the user is currently connected - will return 0.
   * If the user is offline - will return the diff between the current timestamp and the last seen timestamp in seconds.
   * If the user was never online - the record for the user will be missing from the result object.
   *
   * @param {integer[]} userList List of user ids.
   * @returns {Promise}
   */
  async getUsersLastSeen(userList) {
    if (!Type.isArray(userList) || !userList.every((item) => typeof item === "number")) {
      throw new Error("userList must be an array of numbers");
    }
    const result = {};
    return new Promise((resolve, reject) => {
      this._jsonRpcAdapter?.executeOutgoingRpcCommand(RpcMethod.GetUsersLastSeen, {
        userList
      }).then((response) => {
        const unresolved = [];
        for (let i = 0; i < userList.length; i++) {
          if (!response.hasOwnProperty(userList[i])) {
            unresolved.push(userList[i]);
          }
        }
        if (unresolved.length === 0) {
          return resolve(result);
        }
        const params = {
          userIds: unresolved,
          sendToQueueSever: true
        };
        this._restClient.callMethod("pull.api.user.getLastSeen", params).then((response2) => {
          const data = response2.getData().result;
          for (const userId in data) {
            result[Number(userId)] = Number(data[userId]);
          }
          return resolve(result);
        }).catch((error) => {
          this.getLogger().error(error);
          reject(error);
        });
      }).catch((error) => {
        this.getLogger().error(error);
        reject(error);
      });
    });
  }
  /**
   * Pings server.
   * In case of success promise will be resolved, otherwise - rejected.
   *
   * @param {number} timeout Request timeout in seconds
   * @returns {Promise}
   */
  async ping(timeout = 5) {
    return this._jsonRpcAdapter?.executeOutgoingRpcCommand(
      RpcMethod.Ping,
      {},
      timeout
    );
  }
  /**
   * @param userId {number}
   * @param callback {UserStatusCallback}
   * @returns {Promise}
   */
  async subscribeUserStatusChange(userId, callback) {
    return new Promise((resolve, reject) => {
      this._jsonRpcAdapter?.executeOutgoingRpcCommand(RpcMethod.SubscribeStatusChange, {
        userId
      }).then(() => {
        if (!this._userStatusCallbacks[userId]) {
          this._userStatusCallbacks[userId] = [];
        }
        if (Type.isFunction(callback)) {
          this._userStatusCallbacks[userId].push(callback);
        }
        return resolve();
      }).catch((error) => reject(error));
    });
  }
  /**
   * @param {number} userId
   * @param {UserStatusCallback} callback
   * @returns {Promise}
   */
  async unsubscribeUserStatusChange(userId, callback) {
    if (this._userStatusCallbacks[userId]) {
      this._userStatusCallbacks[userId] = this._userStatusCallbacks[userId].filter((cb) => cb !== callback);
      if (this._userStatusCallbacks[userId].length === 0) {
        return this._jsonRpcAdapter?.executeOutgoingRpcCommand(
          RpcMethod.UnsubscribeStatusChange,
          {
            userId
          }
        );
      }
    }
    return Promise.resolve();
  }
  // endregion ////
  // region Get ////
  getRevision() {
    return this._config && this._config.api ? this._config.api.revision_web : null;
  }
  getServerVersion() {
    return this._config && this._config.server ? this._config.server.version : 0;
  }
  getServerMode() {
    return this._config && this._config.server ? this._config.server.mode : null;
  }
  getConfig() {
    return this._config;
  }
  getDebugInfo() {
    if (!JSON || !JSON.stringify) {
      return {};
    }
    let configDump;
    if (this._config && this._config.channels) {
      configDump = {
        ChannelID: this._config.channels.private?.id || "n/a",
        ChannelDie: this._config.channels.private?.end || "n/a",
        ChannelDieShared: this._config.channels.shared?.end || "n/a"
      };
    } else {
      configDump = {
        ConfigError: "config is not loaded"
      };
    }
    let websocketMode = "-";
    if (this._connectors.webSocket && this._connectors.webSocket?.socket) {
      if (this.isJsonRpc()) {
        websocketMode = "json-rpc";
      } else {
        websocketMode = // eslint-disable-next-line unicorn/no-negated-condition
        this._connectors.webSocket?.socket?.url.search("binaryMode=true") != -1 ? "protobuf" : "text";
      }
    }
    return {
      UserId: this._userId + (this._userId > 0 ? "" : "(guest)"),
      "Guest userId": this._guestMode && this._guestUserId !== 0 ? this._guestUserId : "-",
      "Browser online": navigator.onLine ? "Y" : "N",
      Connect: this.isConnected() ? "Y" : "N",
      "Server type": this.isSharedMode() ? "cloud" : "local",
      "WebSocket supported": this.isWebSocketSupported() ? "Y" : "N",
      "WebSocket connected": this._connectors.webSocket && this._connectors.webSocket.connected ? "Y" : "N",
      "WebSocket mode": websocketMode,
      "Try connect": this._reconnectTimeout ? "Y" : "N",
      "Try number": this._connectionAttempt,
      Path: this.connector?.connectionPath || "-",
      ...configDump,
      "Last message": this._session.mid || "-",
      "Session history": this._session.history,
      "Watch tags": this._watchTagsQueue.entries()
    };
  }
  /**
   * @process
   * @param connectionType
   */
  getConnectionPath(connectionType) {
    let path;
    const params = {};
    switch (connectionType) {
      case ConnectionType.WebSocket:
        path = this._isSecure ? this._config?.server.websocket_secure : this._config?.server.websocket;
        break;
      case ConnectionType.LongPolling:
        path = this._isSecure ? this._config?.server.long_pooling_secure : this._config?.server.long_polling;
        break;
      default:
        throw new Error(`Unknown connection type ${connectionType}`);
    }
    if (!Type.isStringFilled(path)) {
      throw new Error(`Empty path`);
    }
    if (typeof this._config?.jwt === "string" && this._config?.jwt !== "") {
      params["token"] = this._config?.jwt;
    } else {
      const channels = [];
      if (this._config?.channels?.private) {
        channels.push(this._config.channels.private?.id || "");
      }
      if (this._config?.channels.private?.id) {
        channels.push(this._config.channels.private.id);
      }
      if (this._config?.channels.shared?.id) {
        channels.push(this._config.channels.shared.id);
      }
      if (channels.length === 0) {
        throw new Error(`Empty channels`);
      }
      params["CHANNEL_ID"] = channels.join("/");
    }
    if (this.isJsonRpc()) {
      params.jsonRpc = "true";
    } else if (this.isProtobufSupported()) {
      params.binaryMode = "true";
    }
    if (this.isSharedMode()) {
      if (!this._config?.clientId) {
        throw new Error(
          "Push-server is in shared mode, but clientId is not set"
        );
      }
      params.clientId = this._config.clientId;
    }
    if (this._session.mid) {
      params.mid = this._session.mid;
    }
    if (this._session.tag) {
      params.tag = this._session.tag;
    }
    if (this._session.time) {
      params.time = this._session.time;
    }
    params.revision = REVISION;
    return `${path}?${Text.buildQueryString(params)}`;
  }
  /**
   * @process
   */
  getPublicationPath() {
    const path = this._isSecure ? this._config?.server.publish_secure : this._config?.server.publish;
    if (!path) {
      return "";
    }
    const channels = [];
    if (this._config?.channels.private?.id) {
      channels.push(this._config.channels.private.id);
    }
    if (this._config?.channels.shared?.id) {
      channels.push(this._config.channels.shared.id);
    }
    const params = {
      CHANNEL_ID: channels.join("/")
    };
    return path + "?" + Text.buildQueryString(params);
  }
  // endregion ////
  // region Is* ////
  isConnected() {
    return this.connector ? this.connector.connected : false;
  }
  isWebSocketSupported() {
    return typeof window.WebSocket !== "undefined";
  }
  isWebSocketAllowed() {
    if (this._sharedConfig.isWebSocketBlocked()) {
      return false;
    }
    return this.isWebSocketEnabled();
  }
  isWebSocketEnabled() {
    if (!this.isWebSocketSupported()) {
      return false;
    }
    if (!this._config) {
      return false;
    }
    if (!this._config.server) {
      return false;
    }
    return this._config.server.websocket_enabled;
  }
  isPublishingSupported() {
    return this.getServerVersion() > 3;
  }
  isPublishingEnabled() {
    if (!this.isPublishingSupported()) {
      return false;
    }
    return this._config?.server.publish_enabled === true;
  }
  isProtobufSupported() {
    return this.getServerVersion() == 4 && !Browser.isIE();
  }
  isJsonRpc() {
    return this.getServerVersion() >= 5;
  }
  isSharedMode() {
    return this.getServerMode() === ServerMode.Shared;
  }
  // endregion ////
  // region Events ////
  /**
   * @param {TypePullClientEmitConfig} params
   * @returns {boolean}
   */
  emit(params) {
    if (params.type == SubscriptionType.Server || params.type == SubscriptionType.Client) {
      if (typeof this._subscribers[params.type] === "undefined") {
        this._subscribers[params.type] = {};
      }
      if (typeof params.moduleId === "undefined") {
        throw new TypeError(
          `${Text.getDateForLog()}: Pull.emit: parameter moduleId is not specified`
        );
      }
      if (typeof this._subscribers[params.type][params.moduleId] === "undefined") {
        this._subscribers[params.type][params.moduleId] = {
          callbacks: [],
          commands: {}
        };
      }
      if (this._subscribers[params.type][params.moduleId]["callbacks"].length > 0) {
        this._subscribers[params.type][params.moduleId]["callbacks"].forEach(
          (callback) => {
            callback(params.data, {
              type: params.type,
              moduleId: params.moduleId
            });
          }
        );
      }
      if (!(typeof params.data === "undefined") && !(typeof params.data["command"] === "undefined") && this._subscribers[params.type][params.moduleId]["commands"][params.data["command"]] && this._subscribers[params.type][params.moduleId]["commands"][params.data["command"]].length > 0) {
        this._subscribers[params.type][params.moduleId]["commands"][
          params.data["command"]
          // eslint-disable-next-line unicorn/no-array-for-each
        ].forEach((callback) => {
          if (typeof params.data === "undefined") {
            return;
          }
          callback(
            params.data["params"],
            params.data["extra"],
            params.data["command"],
            {
              type: params.type,
              moduleId: params.moduleId
            }
          );
        });
      }
      return true;
    } else {
      if (typeof this._subscribers[params.type] === "undefined") {
        this._subscribers[params.type] = [];
      }
      if (this._subscribers[params.type].length <= 0) {
        return true;
      }
      this._subscribers[params.type].forEach(
        (callback) => {
          callback(params.data, {
            type: params.type
          });
        }
      );
      return true;
    }
  }
  /**
   * @process
   *
   * @param message
   */
  broadcastMessage(message) {
    const moduleId = message.module_id = message.module_id.toLowerCase();
    const command = message.command;
    if (!message.extra) {
      message.extra = {};
    }
    if (message.extra.server_time_unix) {
      message.extra.server_time_ago = (Date.now() - message.extra.server_time_unix * 1e3) / 1e3 - (this._config?.server.timeShift || 0);
      message.extra.server_time_ago = message.extra.server_time_ago > 0 ? message.extra.server_time_ago : 0;
    }
    this.logMessage(message);
    try {
      if (message.extra.sender && message.extra.sender.type === SenderType.Client) {
        this.onCustomEvent(
          "onPullClientEvent-" + moduleId,
          [command, message.params, message.extra],
          true
        );
        this.onCustomEvent(
          "onPullClientEvent",
          [moduleId, command, message.params, message.extra],
          true
        );
        this.emit({
          type: SubscriptionType.Client,
          moduleId,
          data: {
            command,
            params: Type.clone(message.params),
            extra: Type.clone(message.extra)
          }
        });
      } else if (moduleId === "pull") {
        this.handleInternalPullEvent(command, message);
      } else if (moduleId == "online") {
        if ((message?.extra?.server_time_ago || 0) < 240) {
          this.onCustomEvent(
            "onPullOnlineEvent",
            [command, message.params, message.extra],
            true
          );
          this.emit({
            type: SubscriptionType.Online,
            data: {
              command,
              params: Type.clone(message.params),
              extra: Type.clone(message.extra)
            }
          });
        }
        if (command === "userStatusChange") {
          this.emitUserStatusChange(
            message.params.user_id,
            message.params.online
          );
        }
      } else {
        this.onCustomEvent(
          "onPullEvent-" + moduleId,
          [command, message.params, message.extra],
          true
        );
        this.onCustomEvent(
          "onPullEvent",
          [moduleId, command, message.params, message.extra],
          true
        );
        this.emit({
          type: SubscriptionType.Server,
          moduleId,
          data: {
            command,
            params: Type.clone(message.params),
            extra: Type.clone(message.extra)
          }
        });
      }
    } catch (error) {
      this.getLogger().warn(
        "\n========= PULL ERROR ===========\nError type: broadcastMessages execute error\nError event: ",
        error,
        "\nMessage: ",
        message,
        "\n================================\n"
      );
    }
    if (message.extra && message.extra.revision_web) {
      this.checkRevision(Text.toInteger(message.extra.revision_web));
    }
  }
  /**
   * @process
   *
   * @param messages
   */
  broadcastMessages(messages) {
    for (const message of messages) {
      this.broadcastMessage(message);
    }
  }
  // endregion ////
  // region sendMessage ////
  /**
   * Sends batch of messages to the multiple public channels.
   *
   * @param messageBatchList Array of messages to send.
   * @return void
   */
  async sendMessageBatch(messageBatchList) {
    if (!this.isPublishingEnabled()) {
      this.getLogger().error(
        `Client publishing is not supported or is disabled`
      );
      return Promise.reject(
        new Error(`Client publishing is not supported or is disabled`)
      );
    }
    if (this.isJsonRpc()) {
      const rpcRequest = this._jsonRpcAdapter?.createPublishRequest(messageBatchList);
      this.connector?.send(JSON.stringify(rpcRequest));
      return Promise.resolve(true);
    } else {
      const userIds = {};
      for (const messageBatch of messageBatchList) {
        if (typeof messageBatch.userList !== "undefined") {
          for (const user of messageBatch.userList) {
            const userId = Number(user);
            userIds[userId] = userId;
          }
        }
      }
      this._channelManager?.getPublicIds(Object.values(userIds)).then((publicIds) => {
        const response = this.connector?.send(
          this.encodeMessageBatch(messageBatchList, publicIds)
        );
        return Promise.resolve(response);
      });
    }
  }
  /**
   * @param messageBatchList
   * @param publicIds
   */
  encodeMessageBatch(messageBatchList, publicIds) {
    const messages = [];
    messageBatchList.forEach((messageFields) => {
      const messageBody = messageFields.body;
      let receivers = [];
      if (messageFields.userList) {
        receivers = this.createMessageReceivers(
          messageFields.userList,
          publicIds
        );
      }
      if (messageFields.channelList) {
        if (!Type.isArray(messageFields.channelList)) {
          throw new TypeError("messageFields.publicChannels must be an array");
        }
        messageFields.channelList.forEach((publicChannel) => {
          let publicId;
          let signature;
          if (typeof publicChannel === "string" && publicChannel.includes(".")) {
            const fields = publicChannel.toString().split(".");
            publicId = fields[0];
            signature = fields[1];
          } else if (typeof publicChannel === "object" && "publicId" in publicChannel && "signature" in publicChannel) {
            publicId = publicChannel?.publicId;
            signature = publicChannel?.signature;
          } else {
            throw new Error(
              `Public channel MUST be either a string, formatted like "{publicId}.{signature}" or an object with fields 'publicId' and 'signature'`
            );
          }
          receivers.push(
            Receiver.create({
              id: this.encodeId(publicId),
              signature: this.encodeId(signature)
            })
          );
        });
      }
      const message = IncomingMessage.create({
        receivers,
        body: JSON.stringify(messageBody),
        expiry: messageFields.expiry || 0
      });
      messages.push(message);
    });
    const requestBatch = RequestBatch.create({
      requests: [
        {
          incomingMessages: {
            messages
          }
        }
      ]
    });
    return RequestBatch.encode(requestBatch).finish();
  }
  /**
   * @memo fix return type
   * @param users
   * @param publicIds
   */
  createMessageReceivers(users, publicIds) {
    const result = [];
    for (const userId of users) {
      if (!publicIds[userId] || !publicIds[userId].publicId) {
        throw new Error(`Could not determine public id for user ${userId}`);
      }
      result.push(
        Receiver.create({
          id: this.encodeId(publicIds[userId].publicId),
          signature: this.encodeId(publicIds[userId].signature)
        })
      );
    }
    return result;
  }
  // endregion ////
  // region _userStatusCallbacks ////
  /**
   * @param userId
   * @param isOnline
   */
  emitUserStatusChange(userId, isOnline) {
    if (this._userStatusCallbacks[userId]) {
      for (const callback of this._userStatusCallbacks[userId]) {
        callback({
          userId,
          isOnline
        });
      }
    }
  }
  restoreUserStatusSubscription() {
    for (const userId in this._userStatusCallbacks) {
      if (this._userStatusCallbacks.hasOwnProperty(userId) && this._userStatusCallbacks[userId].length > 0) {
        this._jsonRpcAdapter?.executeOutgoingRpcCommand(
          RpcMethod.SubscribeStatusChange,
          {
            userId
          }
        );
      }
    }
  }
  // endregion ////
  // region Config ////
  /**
   * @param logTag
   */
  async loadConfig(logTag) {
    if (!this._config) {
      this._config = Object.assign({}, EmptyConfig);
      let config;
      if (this._storage) {
        config = this._storage.get(LsKeys.PullConfig, null);
      }
      if (this.isConfigActual(config) && this.checkRevision(config.api.revision_web)) {
        return Promise.resolve(config);
      } else if (this._storage) {
        this._storage.remove(LsKeys.PullConfig);
      }
    } else if (this.isConfigActual(this._config) && this.checkRevision(this._config.api.revision_web)) {
      return Promise.resolve(this._config);
    } else {
      this._config = Object.assign({}, EmptyConfig);
    }
    return new Promise((resolve, reject) => {
      this._restClient.getHttpClient().setLogTag(logTag);
      this._restClient.callMethod(this._configGetMethod, {
        CACHE: "N"
      }).then((response) => {
        const data = response.getData().result;
        const timeShift = Math.floor(
          (Date.now() - new Date(data.serverTime).getTime()) / 1e3
        );
        delete data.serverTime;
        const config = Object.assign({}, data);
        config.server.timeShift = timeShift;
        resolve(config);
      }).catch((error) => {
        if (error?.answerError?.error === "AUTHORIZE_ERROR" || error?.answerError?.error === "WRONG_AUTH_TYPE") {
          error.status = 403;
        }
        reject(error);
      }).finally(() => {
        this._restClient.getHttpClient().clearLogTag();
      });
    });
  }
  /**
   * @param config
   */
  isConfigActual(config) {
    if (!Type.isPlainObject(config)) {
      return false;
    }
    if (Number(config.server.config_timestamp) !== this._configTimestamp) {
      return false;
    }
    const now = /* @__PURE__ */ new Date();
    if (Type.isNumber(config.exp) && config.exp > 0 && config.exp < now.getTime() / 1e3) {
      return false;
    }
    const channelCount = Object.keys(config.channels).length;
    if (channelCount === 0) {
      return false;
    }
    for (const channelType in config.channels) {
      if (!config.channels.hasOwnProperty(channelType)) {
        continue;
      }
      const channel = config.channels[channelType];
      const channelEnd = new Date(channel.end);
      if (channelEnd < now) {
        return false;
      }
    }
    return true;
  }
  startCheckConfig() {
    if (this._checkInterval) {
      clearInterval(this._checkInterval);
      this._checkInterval = null;
    }
    this._checkInterval = setInterval(
      this.checkConfig.bind(this),
      CONFIG_CHECK_INTERVAL
    );
  }
  stopCheckConfig() {
    if (this._checkInterval) {
      clearInterval(this._checkInterval);
    }
    this._checkInterval = null;
  }
  checkConfig() {
    if (this.isConfigActual(this._config)) {
      if (!this.checkRevision(Text.toInteger(this._config?.api.revision_web))) {
        return false;
      }
    } else {
      this.logToConsole("Stale config detected. Restarting");
      this.restart(CloseReasons.CONFIG_EXPIRED, "config expired");
    }
    return true;
  }
  /**
   * @param config
   * @param allowCaching
   */
  setConfig(config, allowCaching) {
    for (const key in config) {
      if (config.hasOwnProperty(key) && this._config?.hasOwnProperty(key)) {
        this._config[key] = config[key];
      }
    }
    if (config.publicChannels) {
      this.setPublicIds(Object.values(config.publicChannels));
    }
    this._configTimestamp = Number(config.server.config_timestamp);
    if (this._storage && allowCaching) {
      try {
        this._storage.set(LsKeys.PullConfig, config);
      } catch (error) {
        if (localStorage && localStorage.removeItem) {
          localStorage.removeItem("history");
        }
        this.getLogger().error(
          `${Text.getDateForLog()}: Pull: Could not cache config in local storage. Error: `,
          error
        );
      }
    }
  }
  setPublicIds(publicIds) {
    this._channelManager.setPublicIds(publicIds);
  }
  /**
   * @param serverRevision
   */
  checkRevision(serverRevision) {
    if (this._skipCheckRevision) {
      return true;
    }
    if (serverRevision > 0 && serverRevision !== REVISION) {
      this._enabled = false;
      this.showNotification("PULL_OLD_REVISION");
      this.disconnect(CloseReasons.NORMAL_CLOSURE, "check_revision");
      this.onCustomEvent("onPullRevisionUp", [serverRevision, REVISION]);
      this.emit({
        type: SubscriptionType.Revision,
        data: {
          server: serverRevision,
          client: REVISION
        }
      });
      this.logToConsole(
        `Pull revision changed from ${REVISION} to ${serverRevision}. Reload required`
      );
      return false;
    }
    return true;
  }
  // endregion ////
  // region Connect|ReConnect|DisConnect ////
  disconnect(disconnectCode, disconnectReason) {
    if (this.connector) {
      this._isManualDisconnect = true;
      this.connector.disconnect(disconnectCode, disconnectReason);
    }
  }
  restoreWebSocketConnection() {
    if (this._connectionType === ConnectionType.WebSocket) {
      return;
    }
    this._connectors.webSocket?.connect();
  }
  /**
   * @param connectionDelay
   */
  scheduleReconnect(connectionDelay = 0) {
    if (!this._enabled) {
      return;
    }
    if (!connectionDelay) {
      {
        connectionDelay = this.getConnectionAttemptDelay(
          this._connectionAttempt
        );
      }
    }
    if (this._reconnectTimeout) {
      clearTimeout(this._reconnectTimeout);
      this._reconnectTimeout = null;
    }
    this.logToConsole(
      `Pull: scheduling reconnection in ${connectionDelay} seconds; attempt # ${this._connectionAttempt}`
    );
    this._reconnectTimeout = setTimeout(() => {
      this.connect().catch((error) => {
        this.getLogger().error(error);
      });
    }, connectionDelay * 1e3);
  }
  scheduleRestoreWebSocketConnection() {
    this.logToConsole(
      `Pull: scheduling restoration of websocket connection in ${RESTORE_WEBSOCKET_TIMEOUT} seconds`
    );
    if (this._restoreWebSocketTimeout) {
      return;
    }
    this._restoreWebSocketTimeout = setTimeout(() => {
      this._restoreWebSocketTimeout = 0;
      this.restoreWebSocketConnection();
    }, RESTORE_WEBSOCKET_TIMEOUT * 1e3);
  }
  /**
   * @returns {Promise}
   */
  async connect() {
    if (!this._enabled) {
      return Promise.reject();
    }
    if (this.connector?.connected) {
      return Promise.resolve();
    }
    if (this._reconnectTimeout) {
      clearTimeout(this._reconnectTimeout);
      this._reconnectTimeout = null;
    }
    this.status = PullStatus.Connecting;
    this._connectionAttempt++;
    return new Promise((resolve, reject) => {
      this._connectPromise = {
        resolve,
        reject
      };
      this.connector?.connect();
    });
  }
  /**
   * @param disconnectCode
   * @param disconnectReason
   * @param restartDelay
   */
  scheduleRestart(disconnectCode, disconnectReason, restartDelay = 0) {
    if (this._restartTimeout) {
      clearTimeout(this._restartTimeout);
      this._restartTimeout = null;
    }
    if (restartDelay < 1) {
      restartDelay = Math.ceil(Math.random() * 30) + 5;
    }
    this._restartTimeout = setTimeout(
      () => this.restart(disconnectCode, disconnectReason),
      restartDelay * 1e3
    );
  }
  // endregion ////
  // region Handlers ////
  /**
   * @param messageFields
   */
  handleRpcIncomingMessage(messageFields) {
    this._session.mid = messageFields.mid;
    const body = messageFields.body;
    if (!messageFields.body.extra) {
      body.extra = {};
    }
    body.extra.sender = messageFields.sender;
    if ("user_params" in messageFields && Type.isPlainObject(messageFields.user_params)) {
      Object.assign(body.params, messageFields.user_params);
    }
    if ("dictionary" in messageFields && Type.isPlainObject(messageFields.dictionary)) {
      Object.assign(body.params, messageFields.dictionary);
    }
    if (this.checkDuplicate(messageFields.mid)) {
      this.addMessageToStat(body);
      this.trimDuplicates();
      this.broadcastMessage(body);
    }
    this.connector?.send(`mack:${messageFields.mid}`);
    return {};
  }
  /**
   * @param events
   */
  handleIncomingEvents(events) {
    const messages = [];
    if (events.length === 0) {
      this._session.mid = null;
      return;
    }
    for (const event of events) {
      this.updateSessionFromEvent(event);
      if (event.mid && !this.checkDuplicate(event.mid)) {
        continue;
      }
      this.addMessageToStat(
        event.text
      );
      messages.push(event.text);
    }
    this.trimDuplicates();
    this.broadcastMessages(messages);
  }
  /**
   * @param event
   */
  updateSessionFromEvent(event) {
    this._session.mid = event.mid || null;
    this._session.tag = event.tag || null;
    this._session.time = event.time || null;
  }
  /**
   * @process
   *
   * @param command
   * @param message
   */
  handleInternalPullEvent(command, message) {
    switch (command.toUpperCase()) {
      case SystemCommands.CHANNEL_EXPIRE: {
        if (message.params.action === "reconnect") {
          const typeChanel = message.params?.channel.type;
          if (typeChanel === "private" && this._config?.channels?.private) {
            this._config.channels.private = message.params.new_channel;
            this.logToConsole(
              `Pull: new config for ${message.params.channel.type} channel set: ${this._config.channels.private}`
            );
          }
          if (typeChanel === "shared" && this._config?.channels?.shared) {
            this._config.channels.shared = message.params.new_channel;
            this.logToConsole(
              `Pull: new config for ${message.params.channel.type} channel set: ${this._config.channels.shared}`
            );
          }
          this.reconnect(CloseReasons.CONFIG_REPLACED, "config was replaced");
        } else {
          this.restart(CloseReasons.CHANNEL_EXPIRED, "channel expired received");
        }
        break;
      }
      case SystemCommands.CONFIG_EXPIRE: {
        this.restart(CloseReasons.CONFIG_EXPIRED, "config expired received");
        break;
      }
      case SystemCommands.SERVER_RESTART: {
        this.reconnect(
          CloseReasons.SERVER_RESTARTED,
          "server was restarted",
          15
        );
        break;
      }
    }
  }
  // region Handlers For Message ////
  /**
   * @param response
   */
  onIncomingMessage(response) {
    if (this.isJsonRpc()) {
      if (response === JSON_RPC_PING) {
        this.onJsonRpcPing();
      } else {
        this._jsonRpcAdapter?.parseJsonRpcMessage(response);
      }
    } else {
      const events = this.extractMessages(response);
      this.handleIncomingEvents(events);
    }
  }
  // region onLongPolling ////
  onLongPollingOpen() {
    this._unloading = false;
    this._starting = false;
    this._connectionAttempt = 0;
    this._isManualDisconnect = false;
    this.status = PullStatus.Online;
    this.logToConsole("Pull: Long polling connection with push-server opened");
    if (this.isWebSocketEnabled()) {
      this.scheduleRestoreWebSocketConnection();
    }
    if (this._connectPromise) {
      this._connectPromise.resolve({});
    }
  }
  /**
   * @param response
   */
  onLongPollingDisconnect(response) {
    if (this._connectionType === ConnectionType.LongPolling) {
      this.status = PullStatus.Offline;
    }
    this.logToConsole(
      `Pull: Long polling connection with push-server closed. Code: ${response.code}, reason: ${response.reason}`
    );
    if (!this._isManualDisconnect) {
      this.scheduleReconnect();
    }
    this._isManualDisconnect = false;
    this.clearPingWaitTimeout();
  }
  /**
   * @param error
   */
  onLongPollingError(error) {
    this._starting = false;
    if (this._connectionType === ConnectionType.LongPolling) {
      this.status = PullStatus.Offline;
    }
    this.getLogger().error(
      `${Text.getDateForLog()}: Pull: Long polling connection error `,
      error
    );
    this.scheduleReconnect();
    if (this._connectPromise) {
      this._connectPromise.reject(error);
    }
    this.clearPingWaitTimeout();
  }
  // endregion ////
  // region onWebSocket ////
  /**
   * @param response
   */
  onWebSocketBlockChanged(response) {
    const isWebSocketBlocked = response.isWebSocketBlocked;
    if (isWebSocketBlocked && this._connectionType === ConnectionType.WebSocket && !this.isConnected()) {
      if (this._reconnectTimeout) {
        clearTimeout(this._reconnectTimeout);
        this._reconnectTimeout = null;
      }
      this._connectionAttempt = 0;
      this._connectionType = ConnectionType.LongPolling;
      this.scheduleReconnect(1);
    } else if (!isWebSocketBlocked && this._connectionType === ConnectionType.LongPolling) {
      if (this._reconnectTimeout) {
        clearTimeout(this._reconnectTimeout);
        this._reconnectTimeout = null;
      }
      if (this._restoreWebSocketTimeout) {
        clearTimeout(this._restoreWebSocketTimeout);
        this._restoreWebSocketTimeout = null;
      }
      this._connectionAttempt = 0;
      this._connectionType = ConnectionType.WebSocket;
      this.scheduleReconnect(1);
    }
  }
  onWebSocketOpen() {
    this._unloading = false;
    this._starting = false;
    this._connectionAttempt = 0;
    this._isManualDisconnect = false;
    this.status = PullStatus.Online;
    this._sharedConfig.setWebSocketBlocked(false);
    this._sharedConfig.setLongPollingBlocked(true);
    if (this._connectionType == ConnectionType.LongPolling) {
      this._connectionType = ConnectionType.WebSocket;
      this._connectors.longPolling?.disconnect(
        CloseReasons.CONFIG_REPLACED,
        "Fire at onWebSocketOpen"
      );
    }
    if (this._restoreWebSocketTimeout) {
      clearTimeout(this._restoreWebSocketTimeout);
      this._restoreWebSocketTimeout = null;
    }
    this.logToConsole("Pull: Websocket connection with push-server opened");
    if (this._connectPromise) {
      this._connectPromise.resolve({});
    }
    this.restoreUserStatusSubscription();
  }
  /**
   * @param response
   */
  onWebSocketDisconnect(response) {
    if (this._connectionType === ConnectionType.WebSocket) {
      this.status = PullStatus.Offline;
    }
    this.logToConsole(
      `Pull: Websocket connection with push-server closed. Code: ${response.code}, reason: ${response.reason}`,
      true
    );
    if (!this._isManualDisconnect) {
      if (response.code == CloseReasons.WRONG_CHANNEL_ID) {
        this.scheduleRestart(
          CloseReasons.WRONG_CHANNEL_ID,
          "wrong channel signature"
        );
      } else {
        this.scheduleReconnect();
      }
    }
    this._sharedConfig.setLongPollingBlocked(true);
    this._isManualDisconnect = false;
    this.clearPingWaitTimeout();
  }
  /**
   * @param error
   */
  onWebSocketError(error) {
    this._starting = false;
    if (this._connectionType === ConnectionType.WebSocket) {
      this.status = PullStatus.Offline;
    }
    this.getLogger().error(
      `${Text.getDateForLog()}: Pull: WebSocket connection error `,
      error
    );
    this.scheduleReconnect();
    if (this._connectPromise) {
      this._connectPromise.reject(error);
    }
    this.clearPingWaitTimeout();
  }
  // endregion ////
  // endregion ////
  // endregion ////
  // region extractMessages ////
  /**
   * @param pullEvent
   */
  extractMessages(pullEvent) {
    if (pullEvent instanceof ArrayBuffer) {
      return this.extractProtobufMessages(pullEvent);
    } else if (Type.isStringFilled(pullEvent)) {
      return this.extractPlainTextMessages(pullEvent);
    }
    throw new Error("Error pullEvent type");
  }
  /**
   * @param pullEvent
   */
  extractProtobufMessages(pullEvent) {
    const result = [];
    try {
      const responseBatch = ResponseBatch.decode(new Uint8Array(pullEvent));
      for (let i = 0; i < responseBatch.responses.length; i++) {
        const response = responseBatch.responses[i];
        if (response.command !== "outgoingMessages") {
          continue;
        }
        const messages = response.outgoingMessages.messages;
        for (const message of messages) {
          let messageFields;
          try {
            messageFields = JSON.parse(message.body);
          } catch (error) {
            this.getLogger().error(
              `${Text.getDateForLog()}: Pull: Could not parse message body `,
              error
            );
            continue;
          }
          if (!messageFields.extra) {
            messageFields.extra = {};
          }
          messageFields.extra.sender = {
            type: message.sender.type
          };
          if (message.sender.id instanceof Uint8Array) {
            messageFields.extra.sender.id = this.decodeId(message.sender.id);
          }
          const compatibleMessage = {
            mid: this.decodeId(message.id),
            text: messageFields
          };
          result.push(compatibleMessage);
        }
      }
    } catch (error) {
      this.getLogger().error(
        `${Text.getDateForLog()}: Pull: Could not parse message `,
        error
      );
    }
    return result;
  }
  /**
   * @param pullEvent
   */
  extractPlainTextMessages(pullEvent) {
    const result = [];
    const dataArray = pullEvent.match(/#!NGINXNMS!#(.*?)#!NGINXNME!#/gm);
    if (dataArray === null) {
      const text = `
========= PULL ERROR ===========
Error type: parseResponse error parsing message

Data string: ${pullEvent}
================================

`;
      this.getLogger().warn(text);
      return [];
    }
    for (let i = 0; i < dataArray.length; i++) {
      dataArray[i] = dataArray[i].substring(12, dataArray[i].length - 12);
      if (dataArray[i].length <= 0) {
        continue;
      }
      let data;
      try {
        data = JSON.parse(dataArray[i]);
      } catch {
        continue;
      }
      result.push(data);
    }
    return result;
  }
  /**
   * Converts message id from byte[] to string
   * @param {Uint8Array} encodedId
   * @return {string}
   */
  decodeId(encodedId) {
    let result = "";
    for (const element_ of encodedId) {
      const hexByte = element_.toString(16);
      if (hexByte.length === 1) {
        result += "0";
      }
      result += hexByte;
    }
    return result;
  }
  /**
   * Converts message id from hex-encoded string to byte[]
   * @param {string} id Hex-encoded string.
   * @return {Uint8Array}
   */
  encodeId(id) {
    if (!id) {
      return new Uint8Array();
    }
    const result = [];
    for (let i = 0; i < id.length; i += 2) {
      result.push(Number.parseInt(id.slice(i, i + 2), 16));
    }
    return new Uint8Array(result);
  }
  // endregion ////
  // region Events.Status /////
  onOffline() {
    this.disconnect(CloseReasons.NORMAL_CLOSURE, "offline");
  }
  onOnline() {
    this.connect().catch((error) => {
      this.getLogger().error(error);
    });
  }
  onBeforeUnload() {
    this._unloading = true;
    const session = Type.clone(this.session);
    session.ttl = Date.now() + LS_SESSION_CACHE_TIME * 1e3;
    if (this._storage) {
      try {
        this._storage.set(
          LS_SESSION,
          JSON.stringify(session)
          //LS_SESSION_CACHE_TIME
        );
      } catch (error) {
        this.getLogger().error(
          `${Text.getDateForLog()}: Pull: Could not save session info in local storage. Error: `,
          error
        );
      }
    }
    this.scheduleReconnect(15);
  }
  // endregion ////
  // region PullStatus ////
  /**
   * @param status
   * @param delay
   */
  sendPullStatusDelayed(status, delay) {
    if (this._offlineTimeout) {
      clearTimeout(this._offlineTimeout);
      this._offlineTimeout = null;
    }
    this._offlineTimeout = setTimeout(() => {
      this._offlineTimeout = null;
      this.sendPullStatus(status);
    }, delay);
  }
  /**
   * @param status
   */
  sendPullStatus(status) {
    if (this._unloading) {
      return;
    }
    this.onCustomEvent("onPullStatus", [status]);
    this.emit({
      type: SubscriptionType.Status,
      data: {
        status
      }
    });
  }
  // endregion ////
  // region _watchTagsQueue ////
  /**
   * @memo if private?
   * @param tagId
   * @param force
   */
  extendWatch(tagId, force = false) {
    if (this._watchTagsQueue.get(tagId)) {
      return;
    }
    this._watchTagsQueue.set(tagId, true);
    if (force) {
      this.updateWatch(force);
    }
  }
  /**
   * @param force
   */
  updateWatch(force = false) {
    if (this._watchUpdateTimeout) {
      clearTimeout(this._watchUpdateTimeout);
      this._watchUpdateTimeout = null;
    }
    this._watchUpdateTimeout = setTimeout(
      () => {
        const watchTags = [...this._watchTagsQueue.keys()];
        if (watchTags.length > 0) {
          this._restClient.callMethod("pull.watch.extend", {
            tags: watchTags
          }).then((response) => {
            const updatedTags = response.getData().result;
            for (const tagId of updatedTags) {
              this.clearWatch(tagId);
            }
            this.updateWatch();
          }).catch(() => {
            this.updateWatch();
          });
        } else {
          this.updateWatch();
        }
      },
      force ? this._watchForceUpdateInterval : this._watchUpdateInterval
    );
  }
  /**
   * @param tagId
   */
  clearWatch(tagId) {
    this._watchTagsQueue.delete(tagId);
  }
  // endregion ////
  // region Ping ////
  onJsonRpcPing() {
    this.updatePingWaitTimeout();
    this.connector?.send(JSON_RPC_PONG);
  }
  updatePingWaitTimeout() {
    if (this._pingWaitTimeout) {
      clearTimeout(this._pingWaitTimeout);
      this._pingWaitTimeout = null;
    }
    this._pingWaitTimeout = setTimeout(
      this._onPingTimeoutHandler,
      PING_TIMEOUT * 2 * 1e3
    );
  }
  clearPingWaitTimeout() {
    if (this._pingWaitTimeout) {
      clearTimeout(this._pingWaitTimeout);
    }
    this._pingWaitTimeout = null;
  }
  onPingTimeout() {
    this._pingWaitTimeout = null;
    if (!this._enabled || !this.isConnected()) {
      return;
    }
    this.getLogger().warn(
      `No pings are received in ${PING_TIMEOUT * 2} seconds. Reconnecting`
    );
    this.disconnect(CloseReasons.STUCK, "connection stuck");
    this.scheduleReconnect();
  }
  // endregion ////
  // region Time ////
  /**
   * Returns reconnect delay in seconds
   *
   * @param attemptNumber
   * @return {number}
   */
  getConnectionAttemptDelay(attemptNumber) {
    let result;
    if (attemptNumber < 1) {
      result = 0.5;
    } else if (attemptNumber < 3) {
      result = 15;
    } else if (attemptNumber < 5) {
      result = 45;
    } else if (attemptNumber < 10) {
      result = 600;
    } else {
      result = 3600;
    }
    return result + result * Math.random() * 0.2;
  }
  // endregion ////
  // region Tools ////
  /**
   * @param mid
   */
  checkDuplicate(mid) {
    if (this._session.lastMessageIds.includes(mid)) {
      this.getLogger().warn(`Duplicate message ${mid} skipped`);
      return false;
    } else {
      this._session.lastMessageIds.push(mid);
      return true;
    }
  }
  trimDuplicates() {
    if (this._session.lastMessageIds.length > MAX_IDS_TO_STORE) {
      this._session.lastMessageIds = this._session.lastMessageIds.slice(-MAX_IDS_TO_STORE);
    }
  }
  // endregion ////
  // region Logging ////
  /**
   * @param message
   */
  logMessage(message) {
    if (!this._debug) {
      return;
    }
    if (message.extra?.sender && message.extra.sender.type === SenderType.Client) {
      this.getLogger().info(
        `onPullClientEvent-${message.module_id}`,
        message.command,
        message.params,
        message.extra
      );
    } else if (message.module_id == "online") {
      this.getLogger().info(
        `onPullOnlineEvent`,
        message.command,
        message.params,
        message.extra
      );
    } else {
      this.getLogger().info(
        `onPullEvent`,
        message.module_id,
        message.command,
        message.params,
        message.extra
      );
    }
  }
  /**
   * @param message
   * @param force
   */
  logToConsole(message, force = false) {
    if (this._loggingEnabled || force) {
      this.getLogger().log(`${Text.getDateForLog()}: ${message}`);
    }
  }
  /**
   * @param message
   */
  addMessageToStat(message) {
    if (!this._session.history[message.module_id]) {
      this._session.history[message.module_id] = {};
    }
    if (!this._session.history[message.module_id][message.command]) {
      this.session.history[message.module_id][message.command] = 0;
    }
    this._session.history[message.module_id][message.command]++;
    this._session.messageCount++;
  }
  /**
   * @param text
   */
  showNotification(text) {
    this.getLogger().warn(text);
  }
  // endregion ////
  // region onCustomEvent ////
  /**
   * @memo may be need to use onCustomEvent
   * @memo ? force
   */
  onCustomEvent(eventName, data, force = false) {
  }
  // endregion ////
  // region deprecated /////
  /**
   * @deprecated
   */
  /*/
  	getRestClientOptions()
  	{
  		let result = {};
  
  		if (this.guestMode && this.guestUserId !== 0)
  		{
  			result.queryParams = {
  				pull_guest_id: this.guestUserId
  			}
  		}
  		return result;
  	}
  	//*/
  // endregion ////
}

class B24HelperManager {
  _b24;
  _logger = null;
  _isInit = false;
  _profile = null;
  _app = null;
  _payment = null;
  _license = null;
  _currency = null;
  _appOptions = null;
  _userOptions = null;
  _b24PullClient = null;
  _pullClientUnSubscribe = [];
  _pullClientModuleId = "";
  constructor(b24) {
    this._b24 = b24;
    this.setLogger(this._b24.getLogger());
  }
  setLogger(logger) {
    this._logger = logger;
    if (null !== this._profile) {
      this._profile.setLogger(this.getLogger());
    }
    if (null !== this._app) {
      this._app.setLogger(this.getLogger());
    }
    if (null !== this._payment) {
      this._payment.setLogger(this.getLogger());
    }
    if (null !== this._license) {
      this._license.setLogger(this.getLogger());
    }
    if (null !== this._currency) {
      this._currency.setLogger(this.getLogger());
    }
    if (null !== this._appOptions) {
      this._appOptions.setLogger(this.getLogger());
    }
    if (null !== this._userOptions) {
      this._userOptions.setLogger(this.getLogger());
    }
  }
  getLogger() {
    if (null === this._logger) {
      this._logger = LoggerBrowser.build(`NullLogger`);
      this._logger.setConfig({
        [LoggerType.desktop]: false,
        [LoggerType.log]: false,
        [LoggerType.info]: false,
        [LoggerType.warn]: false,
        [LoggerType.error]: true,
        [LoggerType.trace]: false
      });
    }
    return this._logger;
  }
  destroy() {
    this._destroyPullClient();
  }
  // region loadData ////
  async loadData(dataTypes = [LoadDataType.App, LoadDataType.Profile]) {
    const batchMethods = {
      [LoadDataType.App]: { method: "app.info" },
      [LoadDataType.Profile]: { method: "profile" },
      [LoadDataType.Currency]: [
        { method: "crm.currency.base.get" },
        { method: "crm.currency.list" }
      ],
      [LoadDataType.AppOptions]: { method: "app.option.get" },
      [LoadDataType.UserOptions]: { method: "user.option.get" }
    };
    const batchRequest = dataTypes.reduce(
      (acc, type) => {
        if (batchMethods[type]) {
          if (Array.isArray(batchMethods[type])) {
            for (const [index, row] of batchMethods[type].entries()) {
              acc[`get_${type}_${index}`] = row;
            }
          } else {
            acc[`get_${type}`] = batchMethods[type];
          }
        }
        return acc;
      },
      {}
    );
    try {
      const response = await this._b24.callBatch(batchRequest);
      const data = response.getData();
      if (data[`get_${LoadDataType.App}`]) {
        this._app = await this.parseAppData(data[`get_${LoadDataType.App}`]);
        this._payment = await this.parsePaymentData(
          data[`get_${LoadDataType.App}`]
        );
        this._license = await this.parseLicenseData(
          data[`get_${LoadDataType.App}`]
        );
      }
      if (data[`get_${LoadDataType.Profile}`]) {
        this._profile = await this.parseUserData(
          data[`get_${LoadDataType.Profile}`]
        );
      }
      if (data[`get_${LoadDataType.Currency}_0`] && data[`get_${LoadDataType.Currency}_1`]) {
        this._currency = await this.parseCurrencyData({
          currencyBase: data[`get_${LoadDataType.Currency}_0`],
          currencyList: data[`get_${LoadDataType.Currency}_1`]
        });
      }
      if (data[`get_${LoadDataType.AppOptions}`]) {
        this._appOptions = await this.parseOptionsData(
          "app",
          data[`get_${LoadDataType.AppOptions}`]
        );
      }
      if (data[`get_${LoadDataType.UserOptions}`]) {
        this._userOptions = await this.parseOptionsData(
          "user",
          data[`get_${LoadDataType.UserOptions}`]
        );
      }
      this._isInit = true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      console.error("Error loading data:", error);
      throw new Error("Failed to load data");
    }
  }
  async parseUserData(profileData) {
    const manager = new ProfileManager(this._b24);
    manager.setLogger(this.getLogger());
    return manager.initData({
      id: Number(profileData.ID),
      isAdmin: profileData.ADMIN === true,
      lastName: profileData?.LAST_NAME || "",
      name: profileData?.NAME || "",
      gender: profileData?.PERSONAL_GENDER || "",
      photo: profileData?.PERSONAL_PHOTO || "",
      TimeZone: profileData?.TIME_ZONE || "",
      TimeZoneOffset: profileData?.TIME_ZONE_OFFSET
    }).then(() => {
      return manager;
    });
  }
  async parseAppData(appData) {
    const manager = new AppManager(this._b24);
    manager.setLogger(this.getLogger());
    return manager.initData({
      id: Number.parseInt(appData.ID),
      code: appData.CODE,
      version: Number.parseInt(appData.VERSION),
      status: appData.STATUS,
      isInstalled: appData.INSTALLED
    }).then(() => {
      return manager;
    });
  }
  async parsePaymentData(appData) {
    const manager = new PaymentManager(this._b24);
    manager.setLogger(this.getLogger());
    return manager.initData({
      isExpired: appData.PAYMENT_EXPIRED === "Y",
      days: Number.parseInt(appData.DAYS || "0")
    }).then(() => {
      return manager;
    });
  }
  async parseLicenseData(appData) {
    const manager = new LicenseManager(this._b24);
    manager.setLogger(this.getLogger());
    return manager.initData({
      languageId: appData.LANGUAGE_ID,
      license: appData.LICENSE,
      licensePrevious: appData.LICENSE_PREVIOUS,
      licenseType: appData.LICENSE_TYPE,
      licenseFamily: appData.LICENSE_FAMILY,
      isSelfHosted: appData.LICENSE.includes("selfhosted")
    }).then(() => {
      return manager;
    });
  }
  async parseCurrencyData(currencyData) {
    const manager = new CurrencyManager(this._b24);
    manager.setLogger(this.getLogger());
    return manager.initData(currencyData).then(() => {
      return manager;
    });
  }
  async parseOptionsData(type, optionsData) {
    const manager = new OptionsManager(this._b24, type);
    manager.setLogger(this.getLogger());
    return manager.initData(optionsData).then(() => {
      return manager;
    });
  }
  // endregion ////
  // region Get ////
  get isInit() {
    return this._isInit;
  }
  get forB24Form() {
    this.ensureInitialized();
    if (null === this._profile) {
      throw new Error("B24HelperManager.profileInfo not initialized");
    }
    if (null === this._app) {
      throw new Error("B24HelperManager.appInfo not initialized");
    }
    return {
      app_code: this.appInfo.data.code,
      app_status: this.appInfo.data.status,
      payment_expired: this.paymentInfo.data.isExpired ? "Y" : "N",
      days: this.paymentInfo.data.days,
      b24_plan: this.licenseInfo.data.license,
      c_name: this.profileInfo.data.name,
      c_last_name: this.profileInfo.data.lastName,
      hostname: this.hostName
    };
  }
  /**
   * Get the account address BX24 (https://name.bitrix24.com)
   */
  get hostName() {
    return this._b24.getTargetOrigin();
  }
  get profileInfo() {
    this.ensureInitialized();
    if (null === this._profile) {
      throw new Error("B24HelperManager.profileInfo not initialized");
    }
    return this._profile;
  }
  get appInfo() {
    this.ensureInitialized();
    if (null === this._app) {
      throw new Error("B24HelperManager.appInfo not initialized");
    }
    return this._app;
  }
  get paymentInfo() {
    this.ensureInitialized();
    if (null === this._payment) {
      throw new Error("B24HelperManager.paymentInfo not initialized");
    }
    return this._payment;
  }
  get licenseInfo() {
    this.ensureInitialized();
    if (null === this._license) {
      throw new Error("B24HelperManager.licenseInfo not initialized");
    }
    return this._license;
  }
  get currency() {
    this.ensureInitialized();
    if (null === this._currency) {
      throw new Error("B24HelperManager.currency not initialized");
    }
    return this._currency;
  }
  get appOptions() {
    this.ensureInitialized();
    if (null === this._appOptions) {
      throw new Error("B24HelperManager.appOptions not initialized");
    }
    return this._appOptions;
  }
  get userOptions() {
    this.ensureInitialized();
    if (null === this._userOptions) {
      throw new Error("B24HelperManager.userOptions not initialized");
    }
    return this._userOptions;
  }
  // endregion ////
  // region Custom SelfHosted && Cloud ////
  get isSelfHosted() {
    return this.licenseInfo.data.isSelfHosted;
  }
  /**
   * Returns the increment step of fields of type ID
   * @memo in a cloud step = 2 in box step = 1
   *
   * @returns {number}
   */
  get primaryKeyIncrementValue() {
    if (this.isSelfHosted) {
      return 1;
    }
    return 2;
  }
  /**
   * Defines specific URLs for a Bitrix24 box or cloud
   */
  get b24SpecificUrl() {
    if (this.isSelfHosted) {
      return {
        [TypeSpecificUrl.MainSettings]: "/configs/",
        [TypeSpecificUrl.UfList]: "/configs/userfield_list.php",
        [TypeSpecificUrl.UfPage]: "/configs/userfield.php"
      };
    }
    return {
      [TypeSpecificUrl.MainSettings]: "/settings/configs/",
      [TypeSpecificUrl.UfList]: "/settings/configs/userfield_list.php",
      [TypeSpecificUrl.UfPage]: "/settings/configs/userfield.php"
    };
  }
  // endregion ////
  // region Pull.Client ////
  usePullClient(prefix = "prefix", userId) {
    if (this._b24PullClient) {
      return this;
    }
    this.initializePullClient(
      typeof userId === "undefined" ? this.profileInfo.data.id || 0 : userId,
      prefix
    );
    return this;
  }
  initializePullClient(userId, prefix = "prefix") {
    this._b24PullClient = new PullClient({
      b24: this._b24,
      restApplication: this._b24.auth.getUniq(prefix),
      userId
    });
  }
  subscribePullClient(callback, moduleId = "application") {
    if (!this._b24PullClient) {
      throw new Error("PullClient not init");
    }
    this._pullClientModuleId = moduleId;
    this._pullClientUnSubscribe.push(
      this._b24PullClient.subscribe({
        moduleId: this._pullClientModuleId,
        callback
      })
    );
    return this;
  }
  startPullClient() {
    if (!this._b24PullClient) {
      throw new Error("PullClient not init");
    }
    this._b24PullClient.start().catch((error) => {
      this.getLogger().error(`${Text.getDateForLog()}: Pull not running`, error);
    });
  }
  getModuleIdPullClient() {
    if (!this._b24PullClient) {
      throw new Error("PullClient not init");
    }
    return this._pullClientModuleId;
  }
  _destroyPullClient() {
    for (const unsubscribeCallback of this._pullClientUnSubscribe) {
      unsubscribeCallback();
    }
    this._b24PullClient?.destroy();
    this._b24PullClient = null;
  }
  // endregion ////
  // region Tools ////
  ensureInitialized() {
    if (!this._isInit) {
      throw new Error("B24HelperManager not initialized");
    }
  }
  // endregion ////
}

const useB24Helper = () => {
  let $isInitB24Helper = false;
  let $isInitPullClient = false;
  let $b24Helper = null;
  const initB24Helper = async ($b24, dataTypes = [LoadDataType.App, LoadDataType.Profile]) => {
    if (null === $b24Helper) {
      $b24Helper = new B24HelperManager($b24);
    }
    if ($isInitB24Helper) {
      return $b24Helper;
    }
    return $b24Helper.loadData(dataTypes).then(() => {
      $isInitB24Helper = true;
      return $b24Helper;
    });
  };
  const destroyB24Helper = () => {
    $b24Helper?.destroy();
    $b24Helper = null;
    $isInitB24Helper = false;
    $isInitPullClient = false;
  };
  const isInitB24Helper = () => {
    return $isInitB24Helper;
  };
  const getB24Helper = () => {
    if (null === $b24Helper) {
      throw new Error(
        "B24HelperManager is not initialized. You need to call initB24Helper first."
      );
    }
    return $b24Helper;
  };
  const usePullClient = () => {
    if (null === $b24Helper) {
      throw new Error(
        "B24HelperManager is not initialized. You need to call initB24Helper first."
      );
    }
    $b24Helper.usePullClient();
    $isInitPullClient = true;
  };
  const useSubscribePullClient = (callback, moduleId = "application") => {
    if (!$isInitPullClient) {
      throw new Error(
        "PullClient is not initialized. You need to call usePullClient first."
      );
    }
    $b24Helper?.subscribePullClient(callback, moduleId);
  };
  const startPullClient = () => {
    if (!$isInitPullClient) {
      throw new Error(
        "PullClient is not initialized. You need to call usePullClient first."
      );
    }
    $b24Helper?.startPullClient();
  };
  return {
    initB24Helper,
    isInitB24Helper,
    destroyB24Helper,
    getB24Helper,
    usePullClient,
    useSubscribePullClient,
    startPullClient
  };
};

const delay = 50;
let $b24Frame = null;
let isInit = false;
let connectError = null;
let isMakeFirstCall = false;
let listCallBack = [];
let isStartWatch = false;
function startWatch() {
  window.setTimeout(() => {
    if (!isInit || $b24Frame === null) {
      startWatch();
      return;
    }
    processResult();
    listCallBack = [];
  }, delay);
}
function processResult() {
  if (null !== connectError) {
    for (const callBack of listCallBack) {
      callBack.reject(connectError);
    }
  }
  if (!isInit || $b24Frame === null) {
    return;
  }
  for (const callBack of listCallBack) {
    callBack.resolve($b24Frame);
  }
}
async function initializeB24Frame() {
  if (isInit && null !== $b24Frame) {
    return Promise.resolve($b24Frame);
  }
  if (isMakeFirstCall) {
    if (!isStartWatch) {
      isStartWatch = true;
      startWatch();
    }
    return new Promise((resolve, reject) => {
      listCallBack.push({
        resolve,
        reject
      });
    });
  }
  isMakeFirstCall = true;
  return new Promise((resolve, reject) => {
    const queryParams = {
      DOMAIN: null,
      PROTOCOL: false,
      APP_SID: null,
      LANG: null
    };
    if (window.name) {
      const [domain, protocol, appSid] = window.name.split("|");
      queryParams.DOMAIN = domain;
      queryParams.PROTOCOL = Number.parseInt(protocol) === 1;
      queryParams.APP_SID = appSid;
      queryParams.LANG = null;
    }
    if (!queryParams.DOMAIN || !queryParams.APP_SID) {
      connectError = new Error("Unable to initialize Bitrix24Frame library!");
      reject(connectError);
    }
    $b24Frame = new B24Frame(queryParams);
    $b24Frame.init().then(() => {
      isInit = true;
      resolve($b24Frame);
    }).catch((error) => {
      connectError = error;
      reject(connectError);
    });
  });
}

export { AbstractB24, AjaxError, AjaxResult, AppFrame, AuthHookManager, AuthManager, B24Frame, B24Hook, B24LangList, PullClient as B24PullClientManager, Browser, CloseReasons, ConnectionType, DataType, DialogManager, EnumAppStatus, EnumCrmEntityType, EnumCrmEntityTypeId, ListRpcError, LoadDataType, LoggerBrowser, LoggerType, LsKeys, MessageCommands, MessageManager, OptionsManager$1 as OptionsManager, ParentManager, PlacementManager, PullStatus, RestrictionManagerParamsBase, RestrictionManagerParamsForEnterprise, Result, RpcMethod, SenderType, ServerMode, SliderManager, StatusDescriptions, SubscriptionType, SystemCommands, Text, Type, TypeOption, TypeSpecificUrl, initializeB24Frame, useB24Helper, useFormatter };
//# sourceMappingURL=index.mjs.map
