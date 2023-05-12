var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// node_modules/tslog-fork/dist/esm/prettyLogStyles.js
var prettyLogStylesSource = {
  reset: [0, 0],
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  overline: [53, 55],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],
  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  blackBright: [90, 39],
  redBright: [91, 39],
  greenBright: [92, 39],
  yellowBright: [93, 39],
  blueBright: [94, 39],
  magentaBright: [95, 39],
  cyanBright: [96, 39],
  whiteBright: [97, 39],
  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgBlackBright: [100, 49],
  bgRedBright: [101, 49],
  bgGreenBright: [102, 49],
  bgYellowBright: [103, 49],
  bgBlueBright: [104, 49],
  bgMagentaBright: [105, 49],
  bgCyanBright: [106, 49],
  bgWhiteBright: [107, 49]
};
var prettyLogStyles = prettyLogStylesSource;

// node_modules/tslog-fork/dist/esm/formatTemplate.js
function ansiColorWrap(placeholderValue, code) {
  return `\x1B[${code[0]}m${placeholderValue}\x1B[${code[1]}m`;
}
function styleWrap(value, style) {
  if (style != null && typeof style === "string") {
    return ansiColorWrap(value, prettyLogStyles[style]);
  } else if (style != null && Array.isArray(style)) {
    return style.reduce((prevValue, thisStyle) => styleWrap(prevValue, thisStyle), value);
  } else {
    if (style != null && style[value.trim()] != null) {
      return styleWrap(value, style[value.trim()]);
    } else if (style != null && style["*"] != null) {
      return styleWrap(value, style["*"]);
    } else {
      return value;
    }
  }
}
function formatTemplate(settings, template, values, hideUnsetPlaceholder = false) {
  const templateString = String(template);
  const styleWrap2 = (value, style) => {
    if (style != null && typeof style === "string") {
      return ansiColorWrap(value, prettyLogStyles[style]);
    } else if (style != null && Array.isArray(style)) {
      return style.reduce((prevValue, thisStyle) => styleWrap2(prevValue, thisStyle), value);
    } else {
      if (style != null && style[value.trim()] != null) {
        return styleWrap2(value, style[value.trim()]);
      } else if (style != null && style["*"] != null) {
        return styleWrap2(value, style["*"]);
      } else {
        return value;
      }
    }
  };
  return templateString.replace(/{{(.+?)}}/g, (_, placeholder) => {
    const value = values[placeholder] != null ? values[placeholder] : hideUnsetPlaceholder ? "" : _;
    return settings.stylePrettyLogs ? styleWrap2(value, settings?.prettyLogStyles?.[placeholder]) + ansiColorWrap("", prettyLogStyles.reset) : value;
  });
}

// node_modules/tslog-fork/dist/esm/runtime/nodejs/index.js
import { hostname } from "os";
import { normalize as fileNormalize } from "path";
import { types, formatWithOptions } from "util";
var meta = {
  runtime: "Nodejs",
  runtimeVersion: process.version,
  hostname: hostname()
};
function getMeta(logLevelId, logLevelName, stackDepthLevel, hideLogPositionForPerformance, name, parentNames) {
  return Object.assign({}, meta, {
    name,
    parentNames,
    date: /* @__PURE__ */ new Date(),
    logLevelId,
    logLevelName,
    path: !hideLogPositionForPerformance ? getCallerStackFrame(stackDepthLevel) : void 0
  });
}
function getCallerStackFrame(stackDepthLevel, error = Error()) {
  return stackLineToStackFrame(error?.stack?.split("\n")?.filter((thisLine) => thisLine.includes("    at "))?.[stackDepthLevel]);
}
function getErrorTrace(error) {
  return error?.stack?.split("\n")?.reduce((result, line) => {
    if (line.includes("    at ")) {
      result.push(stackLineToStackFrame(line));
    }
    return result;
  }, []);
}
function stackLineToStackFrame(line) {
  const pathResult = {
    fullFilePath: void 0,
    fileName: void 0,
    fileNameWithLine: void 0,
    fileColumn: void 0,
    fileLine: void 0,
    filePath: void 0,
    filePathWithLine: void 0,
    method: void 0
  };
  if (line != null && line.includes("    at ")) {
    line = line.replace(/^\s+at\s+/gm, "");
    const errorStackLine = line.split(" (");
    const fullFilePath = line?.slice(-1) === ")" ? line?.match(/\(([^)]+)\)/)?.[1] : line;
    const pathArray = fullFilePath?.includes(":") ? fullFilePath?.replace("file://", "")?.replace(process.cwd(), "")?.split(":") : void 0;
    const fileColumn = pathArray?.pop();
    const fileLine = pathArray?.pop();
    const filePath = pathArray?.pop();
    const filePathWithLine = fileNormalize(`${filePath}:${fileLine}`);
    const fileName = filePath?.split("/")?.pop();
    const fileNameWithLine = `${fileName}:${fileLine}`;
    if (filePath != null && filePath.length > 0) {
      pathResult.fullFilePath = fullFilePath;
      pathResult.fileName = fileName;
      pathResult.fileNameWithLine = fileNameWithLine;
      pathResult.fileColumn = fileColumn;
      pathResult.fileLine = fileLine;
      pathResult.filePath = filePath;
      pathResult.filePathWithLine = filePathWithLine;
      pathResult.method = errorStackLine?.[1] != null ? errorStackLine?.[0] : void 0;
    }
  }
  return pathResult;
}
function isError(e) {
  return types?.isNativeError != null ? types.isNativeError(e) : e instanceof Error;
}
function prettyFormatLogObj(maskedArgs, settings) {
  return maskedArgs.reduce((result, arg) => {
    isError(arg) ? result.errors.push(prettyFormatErrorObj(arg, settings)) : result.args.push(arg);
    return result;
  }, { args: [], errors: [] });
}
function prettyFormatErrorObj(error, settings) {
  const errorStackStr = getErrorTrace(error).map((stackFrame) => {
    return formatTemplate(settings, settings.prettyErrorStackTemplate, { ...stackFrame }, true);
  });
  const placeholderValuesError = {
    errorName: ` ${error.name} `,
    errorMessage: error.message,
    errorStack: errorStackStr.join("\n")
  };
  return formatTemplate(settings, settings.prettyErrorTemplate, placeholderValuesError);
}
function transportFormatted(logMetaMarkup, logArgs, logErrors, settings) {
  const logErrorsStr = (logErrors.length > 0 && logArgs.length > 0 ? "\n" : "") + logErrors.join("\n");
  settings.prettyInspectOptions.colors = settings.stylePrettyLogs;
  console.log(logMetaMarkup + formatWithOptions(settings.prettyInspectOptions, ...logArgs) + logErrorsStr);
}
function transportJSON(json) {
  console.log(jsonStringifyRecursive(json));
  function jsonStringifyRecursive(obj) {
    const cache = /* @__PURE__ */ new Set();
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (cache.has(value)) {
          return "[Circular]";
        }
        cache.add(value);
      }
      return value;
    });
  }
}
function isBuffer(arg) {
  return Buffer.isBuffer(arg);
}

// node_modules/tslog-fork/dist/esm/formatNumberAddZeros.js
function formatNumberAddZeros(value, digits = 2, addNumber = 0) {
  if (value != null && isNaN(value)) {
    return "";
  }
  value = value != null ? value + addNumber : value;
  return digits === 2 ? value == null ? "--" : value < 10 ? "0" + value : value.toString() : value == null ? "---" : value < 10 ? "00" + value : value < 100 ? "0" + value : value.toString();
}

// node_modules/tslog-fork/dist/esm/file-transport.js
import { appendFileSync } from "node:fs";
import dayjs from "dayjs";
function logFileTransport(fnameWithDir, logObject) {
  const logMeta = logObject["_meta"];
  const djs = dayjs(logMeta.date).format("DD/MM/YYYY HH:mm:ss");
  let dataView = "";
  Reflect.ownKeys(logObject).forEach((key) => {
    if (key !== "_meta") {
      if (typeof logObject[key] === "object") {
        dataView += " " + JSON.stringify(logObject[key]);
      } else {
        dataView += " " + logObject[key];
      }
    }
  });
  appendFileSync(fnameWithDir, `${djs} - ${logMeta.logLevelName}: [${logMeta.path?.fileNameWithLine}] ${dataView}
`);
}

// node_modules/tslog-fork/dist/esm/BaseLogger.js
import path from "node:path";
var BaseLogger = class {
  constructor(settings, logObj, stackDepthLevel = 4, fileLogNameWithDir = "") {
    this.logObj = logObj;
    this.stackDepthLevel = stackDepthLevel;
    this.fileLogNameWithDir = fileLogNameWithDir;
    this.loggerStartTime = /* @__PURE__ */ new Date();
    const isBrowser = ![typeof window, typeof document].includes("undefined");
    const isNode = Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
    this.runtime = isBrowser ? "browser" : isNode ? "nodejs" : "unknown";
    const isBrowserBlinkEngine = isBrowser ? ((window?.["chrome"] || window.Intl && Intl?.["v8BreakIterator"]) && "CSS" in window) != null : false;
    const isSafari = isBrowser ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : false;
    this.stackDepthLevel = isSafari ? 4 : this.stackDepthLevel;
    this.settings = {
      type: settings?.type ?? "pretty",
      name: settings?.name,
      parentNames: settings?.parentNames,
      minLevel: settings?.minLevel ?? 0,
      argumentsArrayName: settings?.argumentsArrayName,
      hideLogPositionForProduction: settings?.hideLogPositionForProduction ?? false,
      prettyLogTemplate: settings?.prettyLogTemplate ?? "{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}	{{logLevelName}}	{{filePathWithLine}}{{nameWithDelimiterPrefix}}	",
      prettyErrorTemplate: settings?.prettyErrorTemplate ?? "\n{{errorName}} {{errorMessage}}\nerror stack:\n{{errorStack}}",
      prettyErrorStackTemplate: settings?.prettyErrorStackTemplate ?? "  \u2022 {{fileName}}	{{method}}\n	{{filePathWithLine}}",
      prettyErrorParentNamesSeparator: settings?.prettyErrorParentNamesSeparator ?? ":",
      prettyErrorLoggerNameDelimiter: settings?.prettyErrorLoggerNameDelimiter ?? "	",
      stylePrettyLogs: settings?.stylePrettyLogs ?? true,
      prettyLogTimeZone: settings?.prettyLogTimeZone ?? "UTC",
      prettyLogStyles: settings?.prettyLogStyles ?? {
        logLevelName: {
          "*": ["bold", "black", "bgWhiteBright", "dim"],
          SILLY: ["bold", "white"],
          TRACE: ["bold", "whiteBright"],
          DEBUG: ["bold", "green"],
          INFO: ["bold", "blue"],
          WARN: ["bold", "yellow"],
          ERROR: ["bold", "red"],
          FATAL: ["bold", "redBright"]
        },
        dateIsoStr: "white",
        filePathWithLine: "white",
        name: ["white", "bold"],
        nameWithDelimiterPrefix: ["white", "bold"],
        nameWithDelimiterSuffix: ["white", "bold"],
        errorName: ["bold", "bgRedBright", "whiteBright"],
        fileName: ["yellow"],
        fileNameWithLine: "white"
      },
      prettyInspectOptions: settings?.prettyInspectOptions ?? {
        colors: true,
        compact: false,
        depth: Infinity
      },
      metaProperty: settings?.metaProperty ?? "_meta",
      maskPlaceholder: settings?.maskPlaceholder ?? "[***]",
      maskValuesOfKeys: settings?.maskValuesOfKeys ?? ["password"],
      maskValuesOfKeysCaseInsensitive: settings?.maskValuesOfKeysCaseInsensitive ?? false,
      maskValuesRegEx: settings?.maskValuesRegEx,
      prefix: [...settings?.prefix ?? []],
      attachedTransports: [...settings?.attachedTransports ?? []],
      overwrite: {
        mask: settings?.overwrite?.mask,
        toLogObj: settings?.overwrite?.toLogObj,
        addMeta: settings?.overwrite?.addMeta,
        formatMeta: settings?.overwrite?.formatMeta,
        formatLogObj: settings?.overwrite?.formatLogObj,
        transportFormatted: settings?.overwrite?.transportFormatted,
        transportJSON: settings?.overwrite?.transportJSON
      }
    };
    this.settings.stylePrettyLogs = this.settings.stylePrettyLogs && isBrowser && !isBrowserBlinkEngine ? false : this.settings.stylePrettyLogs;
  }
  log(logLevelId, logLevelName, ...args) {
    if (logLevelId < this.settings.minLevel) {
      return;
    }
    const logArgs = [...this.settings.prefix, ...args];
    const maskedArgs = this.settings.overwrite?.mask != null ? this.settings.overwrite?.mask(logArgs) : this.settings.maskValuesOfKeys != null && this.settings.maskValuesOfKeys.length > 0 ? this._mask(logArgs) : logArgs;
    const thisLogObj = this.logObj != null ? this._recursiveCloneAndExecuteFunctions(this.logObj) : void 0;
    const logObj = this.settings.overwrite?.toLogObj != null ? this.settings.overwrite?.toLogObj(maskedArgs, thisLogObj) : this._toLogObj(maskedArgs, thisLogObj);
    const logObjWithMeta = this.settings.overwrite?.addMeta != null ? this.settings.overwrite?.addMeta(logObj, logLevelId, logLevelName) : this._addMetaToLogObj(logObj, logLevelId, logLevelName);
    let logMetaMarkup;
    let logArgsAndErrorsMarkup = void 0;
    if (this.settings.overwrite?.formatMeta != null) {
      logMetaMarkup = this.settings.overwrite?.formatMeta(logObjWithMeta?.[this.settings.metaProperty]);
    }
    if (this.settings.overwrite?.formatLogObj != null) {
      logArgsAndErrorsMarkup = this.settings.overwrite?.formatLogObj(maskedArgs, this.settings);
    }
    if (this.settings.type === "pretty") {
      logMetaMarkup = logMetaMarkup ?? this._prettyFormatLogObjMeta(logObjWithMeta?.[this.settings.metaProperty]);
      logArgsAndErrorsMarkup = logArgsAndErrorsMarkup ?? prettyFormatLogObj(maskedArgs, this.settings);
    }
    if (logMetaMarkup != null && logArgsAndErrorsMarkup != null) {
      this.settings.overwrite?.transportFormatted != null ? this.settings.overwrite?.transportFormatted(logMetaMarkup, logArgsAndErrorsMarkup.args, logArgsAndErrorsMarkup.errors, this.settings) : transportFormatted(logMetaMarkup, logArgsAndErrorsMarkup.args, logArgsAndErrorsMarkup.errors, this.settings);
    } else {
      this.settings.overwrite?.transportJSON != null ? this.settings.overwrite?.transportJSON(logObjWithMeta) : this.settings.type !== "hidden" ? transportJSON(logObjWithMeta) : void 0;
    }
    if (this.settings.attachedTransports != null && this.settings.attachedTransports.length > 0) {
      this.settings.attachedTransports.forEach((transportLogger) => {
        transportLogger(logObjWithMeta);
      });
    }
    return logObjWithMeta;
  }
  attachTransport(transportLogger) {
    this.settings.attachedTransports.push(transportLogger);
  }
  attachFileTransport(fileLogDirWithName) {
    this.fileLogNameWithDir = path.resolve(process.cwd(), fileLogDirWithName);
    const bindLogFunc = logFileTransport.bind(this, this.fileLogNameWithDir);
    this.attachTransport(bindLogFunc);
  }
  getSubLogger(settings, logObj) {
    const subLoggerSettings = {
      ...this.settings,
      ...settings,
      parentNames: this.settings?.parentNames != null && this.settings?.name != null ? [...this.settings.parentNames, this.settings.name] : this.settings?.name != null ? [this.settings.name] : void 0,
      prefix: [...this.settings.prefix, ...settings?.prefix ?? []]
    };
    const subLogger = new this.constructor(subLoggerSettings, logObj ?? this.logObj, this.stackDepthLevel);
    return subLogger;
  }
  _mask(args) {
    const maskValuesOfKeys = this.settings.maskValuesOfKeysCaseInsensitive !== true ? this.settings.maskValuesOfKeys : this.settings.maskValuesOfKeys.map((key) => key.toLowerCase());
    return args?.map((arg) => {
      return this._recursiveCloneAndMaskValuesOfKeys(arg, maskValuesOfKeys);
    });
  }
  _recursiveCloneAndMaskValuesOfKeys(source, keys, seen = []) {
    if (seen.includes(source)) {
      return { ...source };
    }
    if (typeof source === "object" && source != null) {
      seen.push(source);
    }
    return isBuffer(source) ? source : source instanceof Map ? new Map(source) : source instanceof Set ? new Set(source) : Array.isArray(source) ? source.map((item) => this._recursiveCloneAndMaskValuesOfKeys(item, keys, seen)) : source instanceof Date ? new Date(source.getTime()) : isError(source) ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
      o[prop] = keys.includes(this.settings?.maskValuesOfKeysCaseInsensitive !== true ? prop : prop.toLowerCase()) ? this.settings.maskPlaceholder : this._recursiveCloneAndMaskValuesOfKeys(source[prop], keys, seen);
      return o;
    }, this._cloneError(source)) : source != null && typeof source === "object" ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
      o[prop] = keys.includes(this.settings?.maskValuesOfKeysCaseInsensitive !== true ? prop : prop.toLowerCase()) ? this.settings.maskPlaceholder : this._recursiveCloneAndMaskValuesOfKeys(source[prop], keys, seen);
      return o;
    }, Object.create(Object.getPrototypeOf(source))) : ((source2) => {
      this.settings?.maskValuesRegEx?.forEach((regEx) => {
        source2 = source2?.toString()?.replace(regEx, this.settings.maskPlaceholder);
      });
      return source2;
    })(source);
  }
  _recursiveCloneAndExecuteFunctions(source, seen = []) {
    if (seen.includes(source)) {
      return { ...source };
    }
    if (typeof source === "object") {
      seen.push(source);
    }
    return Array.isArray(source) ? source.map((item) => this._recursiveCloneAndExecuteFunctions(item, seen)) : source instanceof Date ? new Date(source.getTime()) : source && typeof source === "object" ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
      Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop));
      o[prop] = typeof source[prop] === "function" ? source[prop]() : this._recursiveCloneAndExecuteFunctions(source[prop], seen);
      return o;
    }, Object.create(Object.getPrototypeOf(source))) : source;
  }
  _toLogObj(args, clonedLogObj = {}) {
    args = args?.map((arg) => isError(arg) ? this._toErrorObject(arg) : arg);
    if (this.settings.argumentsArrayName == null) {
      if (args.length === 1 && !Array.isArray(args[0]) && isBuffer(args[0]) !== true && !(args[0] instanceof Date)) {
        clonedLogObj = typeof args[0] === "object" && args[0] != null ? { ...args[0], ...clonedLogObj } : { 0: args[0], ...clonedLogObj };
      } else {
        clonedLogObj = { ...clonedLogObj, ...args };
      }
    } else {
      clonedLogObj = {
        ...clonedLogObj,
        [this.settings.argumentsArrayName]: args
      };
    }
    return clonedLogObj;
  }
  _cloneError(error) {
    const ErrorConstructor = error.constructor;
    const newError = new ErrorConstructor(error.message);
    Object.assign(newError, error);
    const propertyNames = Object.getOwnPropertyNames(newError);
    for (const propName of propertyNames) {
      const propDesc = Object.getOwnPropertyDescriptor(newError, propName);
      if (propDesc) {
        propDesc.writable = true;
        Object.defineProperty(newError, propName, propDesc);
      }
    }
    return newError;
  }
  _toErrorObject(error) {
    return {
      nativeError: error,
      name: error.name ?? "Error",
      message: error.message,
      stack: getErrorTrace(error)
    };
  }
  _addMetaToLogObj(logObj, logLevelId, logLevelName) {
    return {
      ...logObj,
      [this.settings.metaProperty]: getMeta(logLevelId, logLevelName, this.stackDepthLevel, this.settings.hideLogPositionForProduction, this.settings.name, this.settings.parentNames)
    };
  }
  _prettyFormatLogObjMeta(logObjMeta) {
    if (logObjMeta == null) {
      return "";
    }
    let template = this.settings.prettyLogTemplate;
    const placeholderValues = {};
    if (template.includes("{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}")) {
      template = template.replace("{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}", "{{dateIsoStr}}");
    } else {
      if (this.settings.prettyLogTimeZone === "UTC") {
        placeholderValues["yyyy"] = logObjMeta?.date?.getUTCFullYear() ?? "----";
        placeholderValues["mm"] = formatNumberAddZeros(logObjMeta?.date?.getUTCMonth(), 2, 1);
        placeholderValues["dd"] = formatNumberAddZeros(logObjMeta?.date?.getUTCDate(), 2);
        placeholderValues["hh"] = formatNumberAddZeros(logObjMeta?.date?.getUTCHours(), 2);
        placeholderValues["MM"] = formatNumberAddZeros(logObjMeta?.date?.getUTCMinutes(), 2);
        placeholderValues["ss"] = formatNumberAddZeros(logObjMeta?.date?.getUTCSeconds(), 2);
        placeholderValues["ms"] = formatNumberAddZeros(logObjMeta?.date?.getUTCMilliseconds(), 3);
      } else {
        placeholderValues["yyyy"] = logObjMeta?.date?.getFullYear() ?? "----";
        placeholderValues["mm"] = formatNumberAddZeros(logObjMeta?.date?.getMonth(), 2, 1);
        placeholderValues["dd"] = formatNumberAddZeros(logObjMeta?.date?.getDate(), 2);
        placeholderValues["hh"] = formatNumberAddZeros(logObjMeta?.date?.getHours(), 2);
        placeholderValues["MM"] = formatNumberAddZeros(logObjMeta?.date?.getMinutes(), 2);
        placeholderValues["ss"] = formatNumberAddZeros(logObjMeta?.date?.getSeconds(), 2);
        placeholderValues["ms"] = formatNumberAddZeros(logObjMeta?.date?.getMilliseconds(), 3);
      }
    }
    const dateInSettingsTimeZone = this.settings.prettyLogTimeZone === "UTC" ? logObjMeta?.date : new Date(logObjMeta?.date?.getTime() - logObjMeta?.date?.getTimezoneOffset() * 6e4);
    placeholderValues["rawIsoStr"] = dateInSettingsTimeZone?.toISOString();
    placeholderValues["dateIsoStr"] = dateInSettingsTimeZone?.toISOString().replace("T", " ").replace("Z", "");
    placeholderValues["logLevelName"] = logObjMeta?.logLevelName;
    placeholderValues["fileNameWithLine"] = logObjMeta?.path?.fileNameWithLine ?? "";
    placeholderValues["filePathWithLine"] = logObjMeta?.path?.filePathWithLine ?? "";
    placeholderValues["fullFilePath"] = logObjMeta?.path?.fullFilePath ?? "";
    let parentNamesString = this.settings.parentNames?.join(this.settings.prettyErrorParentNamesSeparator);
    parentNamesString = parentNamesString != null && logObjMeta?.name != null ? parentNamesString + this.settings.prettyErrorParentNamesSeparator : void 0;
    placeholderValues["name"] = logObjMeta?.name != null || parentNamesString != null ? (parentNamesString ?? "") + logObjMeta?.name : "";
    placeholderValues["nameWithDelimiterPrefix"] = placeholderValues["name"].length > 0 ? this.settings.prettyErrorLoggerNameDelimiter + placeholderValues["name"] : "";
    placeholderValues["nameWithDelimiterSuffix"] = placeholderValues["name"].length > 0 ? placeholderValues["name"] + this.settings.prettyErrorLoggerNameDelimiter : "";
    placeholderValues["secDuration"] = Math.round(((/* @__PURE__ */ new Date()).getTime() - this.loggerStartTime.getTime()) / 1e3);
    return formatTemplate(this.settings, template, placeholderValues);
  }
};

// node_modules/tslog-fork/dist/esm/logger/logger.interface.js
var LoggerLevel;
(function(LoggerLevel2) {
  LoggerLevel2[LoggerLevel2["silly"] = 0] = "silly";
  LoggerLevel2[LoggerLevel2["trace"] = 1] = "trace";
  LoggerLevel2[LoggerLevel2["debug"] = 2] = "debug";
  LoggerLevel2[LoggerLevel2["info"] = 3] = "info";
  LoggerLevel2[LoggerLevel2["warn"] = 4] = "warn";
  LoggerLevel2[LoggerLevel2["error"] = 5] = "error";
  LoggerLevel2[LoggerLevel2["fatal"] = 6] = "fatal";
})(LoggerLevel || (LoggerLevel = {}));

// node_modules/tslog-fork/dist/esm/logger/logger.implementation.js
var SimpleLog = class {
  constructor() {
    this.logger = new Logger({ stackDepthLevel: 6 });
    this.logger.settings.stylePrettyLogs = true;
    this.logger.settings.prettyLogTimeZone = "local";
    this.logger.settings.prettyInspectOptions = { colors: true, compact: true, sorted: false };
    this.logger.settings.prettyLogStyles = {
      logLevelName: {
        "*": ["bold", "black", "bgWhiteBright", "dim"],
        SILLY: ["bold", "white"],
        TRACE: ["bold", "whiteBright"],
        DEBUG: ["bold", "green"],
        INFO: ["bold", "blue"],
        WARN: ["bold", "yellow"],
        ERROR: ["bold", "red"],
        FATAL: ["bold", "redBright"]
      },
      dateIsoStr: "white",
      filePathWithLine: "white",
      name: ["white", "bold"],
      nameWithDelimiterPrefix: ["white", "bold"],
      nameWithDelimiterSuffix: ["white", "bold"],
      errorName: ["bold", "bgRedBright", "whiteBright"],
      fileName: ["yellow"],
      fileNameWithLine: "white"
    };
    this.logger.settings.prettyLogTemplate = "{{hh}}:{{MM}}:{{ss}} {{logLevelName}} [{{fileNameWithLine}}] {{secDuration}} ";
  }
  log(logLevel, ...args) {
    this.logger.log(logLevel, "", ...args);
  }
  silly(...args) {
    this.logger.log(LoggerLevel.silly, "", ...args);
  }
  trace(...args) {
    this.logger.trace(...args);
  }
  debug(...args) {
    this.logger.debug(...args);
  }
  info(...args) {
    this.logger.info(...args);
  }
  warn(...args) {
    this.logger.warn(...args);
  }
  error(...args) {
    this.logger.error(...args);
  }
  fatal(...args) {
    this.logger.fatal(...args);
  }
  sw(value, style) {
    return styleWrap(value, style);
  }
  set minLevel(n) {
    this.logger.settings.minLevel = n;
  }
  get minLevel() {
    return this.logger.settings.minLevel;
  }
};
var NLog = class extends SimpleLog {
  static getInstance() {
    if (!NLog.instance) {
      NLog.instance = new NLog();
    }
    return NLog.instance;
  }
  constructor() {
    super();
  }
};

// node_modules/tslog-fork/dist/esm/index.js
var Logger = class extends BaseLogger {
  constructor(settings, logObj) {
    const stackDepthLevel = settings?.stackDepthLevel ?? 5;
    super(settings, logObj, stackDepthLevel);
  }
  log(logLevelId, logLevelName, ...args) {
    return super.log(logLevelId, logLevelName, ...args);
  }
  silly(...args) {
    return super.log(0, "SILLY", ...args);
  }
  trace(...args) {
    return super.log(1, "TRACE", ...args);
  }
  debug(...args) {
    return super.log(2, "DEBUG", ...args);
  }
  info(...args) {
    return super.log(3, "INFO", ...args);
  }
  warn(...args) {
    return super.log(4, "WARN", ...args);
  }
  error(...args) {
    return super.log(5, "ERROR", ...args);
  }
  fatal(...args) {
    return super.log(6, "FATAL", ...args);
  }
  getSubLogger(settings, logObj) {
    return super.getSubLogger(settings, logObj);
  }
};

// src/helpers/dotenv-init.ts
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

// src/helpers/common.ts
function delay(ms = 1e4) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(0), ms);
  });
}

// src/rmq-request-responce/lib/rmq-connection.ts
import { AMQPClient } from "amqp-client-fork-gayrat";
import process2 from "process";
var _RmqConnection = class {
  connection;
  channel;
  constructor() {
  }
  /*
   * инициализирует connection + chanel
   */
  static async RmqConnection() {
    const rmqConnection = new _RmqConnection();
    const log = NLog.getInstance();
    log.info("\u0411\u0443\u0434\u0435\u0442 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D host rmq : ", process2.env.RMQ_HOST);
    const amqp = new AMQPClient("amqp://" + process2.env.RMQ_HOST);
    let error = false;
    let cntRetry = 0;
    do {
      try {
        error = false;
        rmqConnection.connection = await amqp.connect();
      } catch (e) {
        error = true;
        cntRetry++;
        log.warn("RMQ connection problem");
        await delay(3e3);
      }
    } while (error && cntRetry < 10);
    if (error)
      process2.exit(105);
    rmqConnection.channel = await rmqConnection.connection.channel();
    rmqConnection.channel.basicQos(1, 0, false);
    return rmqConnection;
  }
  static async getInstance() {
    if (!_RmqConnection.instance) {
      _RmqConnection.instance = await _RmqConnection.RmqConnection();
    }
    return _RmqConnection.instance;
  }
  async closeConnection() {
    if (!_RmqConnection.instance)
      return;
    await this.connection.close();
  }
};
var RmqConnection = _RmqConnection;
__publicField(RmqConnection, "instance");

// src/rmq-request-responce/lib/base-req-res.ts
var RMQ_construct_exchange = class {
  constructor(exchange, queueInputName, routingKey) {
    this.exchange = exchange;
    this.queueInputName = queueInputName;
    this.routingKey = routingKey;
  }
  log = NLog.getInstance();
  connection;
  channel;
  /*
   * инициализирует exchange типа direct
   */
  async createRMQ_construct_exchange() {
    const rcon = await RmqConnection.getInstance();
    this.connection = rcon.connection;
    this.channel = rcon.channel;
    await rcon.channel.exchangeDeclare(this.exchange, "direct", { durable: false });
  }
};

// src/rmq-request-responce/clients/base-clients.ts
import { v4 as uuidv4 } from "uuid";
var RMQ_clientQueryBase = class extends RMQ_construct_exchange {
  internalID = 0;
  responceQueueName;
  // для каждого клиента создается уникальная очередь
  constructor(exchange, queueInputName, routingKey) {
    super(exchange, queueInputName, routingKey);
  }
  /*
   * вызвать после new
   */
  async createRMQ_clientQueryBase(handleResponse) {
    await this.createRMQ_construct_exchange();
    await this.initPrivateQueueForResponses(handleResponse);
  }
  // инициализировать очередь для ответов от сервера
  async initPrivateQueueForResponses(handleResponse) {
    this.responceQueueName = `proxy-${uuidv4()}`;
    const q = await this.channel.queue(this.responceQueueName, { passive: false, durable: false, autoDelete: true });
    await this.channel.queueBind(this.responceQueueName, this.exchange, this.responceQueueName);
    const consumer = await q.subscribe({ noAck: false }, handleResponse);
  }
};

// src/config/config-rmq.ts
var TIME_WAIT_PROXY_ANSWER = 15e3;
var proxyRMQnames = {
  exchange: "proxy.exchange",
  // имена очередей для запросов
  getproxy: "proxy.getproxy",
  returnProxy: "proxy.returnProxy",
  printProxyQueue: "proxy.printProxyQueue",
  refillProxy: "proxy.refillProxy"
};

// src/rmq-request-responce/clients/clients.ts
var RMQ_proxyClientQuery = class extends RMQ_clientQueryBase {
  registeredCallback = /* @__PURE__ */ new Map();
  /*
    export enum LoggerLevel {
    silly,
    trace,
    debug,
    info,
    warn,
    error,
    fatal,
  }
     */
  constructor(exchange, queueInputName, routingKey) {
    super(exchange, queueInputName, routingKey);
  }
  /*
   * единственный метод получения класса
   */
  static async createRMQ_clientQuery(exchange, queueInputName, routingKey) {
    const cli = new RMQ_proxyClientQuery(exchange, queueInputName, routingKey);
    const bindHandlers = cli.handleResponse.bind(this);
    await cli.createRMQ_clientQueryBase(bindHandlers);
    return cli;
  }
  // от сервера поступили ответы на запросы - надо с ними как то поступить
  handleResponse = async (msg) => {
    const result = JSON.parse(msg.bodyToString());
    this.log.debug(
      "\u041F\u043E\u043B\u0443\u0447\u0435\u043D \u043E\u0442\u0432\u0435\u0442 \u043E\u0442 \u0441\u0435\u0440\u0432\u0435\u0440\u0430  deliveryTag:",
      msg.deliveryTag,
      " correlationId ",
      msg.properties.correlationId,
      " BaseResponce ",
      msg.bodyToString()
    );
    await this.channel.basicAck(msg.deliveryTag);
    if (msg.properties.correlationId != null) {
      const id = parseInt(msg.properties.correlationId, 10);
      const callBack = this.registeredCallback.get(id);
      this.registeredCallback.delete(id);
      callBack && callBack(result);
    }
  };
  /*
   * послать сообщение  обработчику и получить ответ
   * params если определен - то должен быть объектом с ключом
   */
  async sendRequestAndResieveAnswer(routingKey, params) {
    const internalID = this.internalID++;
    const msg = params;
    await this.channel.basicPublish(this.exchange, routingKey, JSON.stringify(msg), {
      deliveryMode: 1,
      correlationId: internalID.toString(),
      replyTo: this.responceQueueName,
      messageId: internalID.toString(),
      timestamp: /* @__PURE__ */ new Date(),
      type: "getProxy"
    });
    return new Promise((resolve, reject) => {
      const timerAbortId = setTimeout(() => {
        reject({ err: "Timeout: \u0438\u0441\u0442\u0435\u043A\u043B\u043E \u0432\u0440\u0435\u043C\u044F \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u044F getproxy" });
      }, TIME_WAIT_PROXY_ANSWER);
      const callback = (result) => {
        clearTimeout(timerAbortId);
        resolve(result);
      };
      this.registeredCallback.set(internalID, callback);
    });
  }
  /*
   * послать только сообщение обработчику
   * params если определен - то должен быть объектом с ключом
   */
  async sendRequestOnly(routingKey, params) {
    const internalID = this.internalID++;
    await this.channel.basicPublish(this.exchange, routingKey, JSON.stringify(params), {
      deliveryMode: 1,
      correlationId: internalID.toString(),
      replyTo: this.responceQueueName,
      messageId: internalID.toString(),
      timestamp: /* @__PURE__ */ new Date(),
      type: "getProxy"
    });
    this.log.info("\u0417\u0430\u043F\u0440\u043E\u0441 correlationId", internalID);
  }
};
export {
  RMQ_proxyClientQuery,
  proxyRMQnames
};
