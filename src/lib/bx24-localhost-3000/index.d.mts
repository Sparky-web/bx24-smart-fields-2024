import { DateTimeOptions, DateTime } from 'luxon';

declare enum LoggerType {
    desktop = "desktop",
    log = "log",
    info = "info",
    warn = "warn",
    error = "error",
    trace = "trace"
}
declare class LoggerBrowser {
    #private;
    static build(title: string, isDevelopment?: boolean): LoggerBrowser;
    private constructor();
    setConfig(types: Record<string | LoggerType, boolean>): void;
    enable(type: LoggerType): boolean;
    disable(type: LoggerType): boolean;
    isEnabled(type: LoggerType): boolean;
    desktop(...params: any[]): void;
    log(...params: any[]): void;
    info(...params: any[]): void;
    warn(...params: any[]): void;
    error(...params: any[]): void;
    trace(...params: any[]): void;
}

/**
 * String which is actually a number, like `'20.23'`
 */
type NumberString = string;
/**
 * Like `'2018-06-07T03:00:00+03:00'`
 */
type ISODate = string;
type BoolString = 'Y' | 'N';
type GenderString = 'M' | 'F' | '';
type PlacementViewMode = 'view' | 'edit';
type Fields = {
    readonly [key: string]: {
        readonly type: string;
        readonly isRequired: boolean;
        readonly isReadOnly: boolean;
        readonly isImmutable: boolean;
        readonly isMultiple: boolean;
        readonly isDynamic: boolean;
        readonly title: string;
        readonly upperName?: string;
    };
};
type MultiField = {
    readonly ID: NumberString;
    readonly VALUE_TYPE: string;
    readonly VALUE: string;
    readonly TYPE_ID: string;
};
type MultiFieldArray = ReadonlyArray<Pick<MultiField, 'VALUE' | 'VALUE_TYPE'>>;
/**
 * Describes the inline settings in UF
 */
type UserFieldType = {
    USER_TYPE_ID: string;
    HANDLER: string;
    TITLE: string;
    DESCRIPTION: string;
    OPTIONS?: {
        height: number;
    };
};
/**
 * Data types
 * @link https://apidocs.bitrix24.ru/api-reference/data-types.html
 * @link https://dev.1c-bitrix.ru/rest_help/crm/dynamic/methodscrmitem/crm_item_fields.php
 */
declare enum DataType {
    undefined = "undefined",
    any = "any",
    integer = "integer",
    boolean = "boolean",
    double = "double",
    date = "date",
    datetime = "datetime",
    string = "string",
    text = "text",
    file = "file",
    array = "array",
    object = "object",
    user = "user",
    location = "location",
    crmCategory = "crm_category",
    crmStatus = "crm_status",
    crmCurrency = "crm_currency"
}

/**
 * The `Type` class is designed to check and determine data types
 *
 * @see bitrix/js/main/core/src/lib/type.js
 */
declare class TypeManager {
    getTag(value: any): string;
    /**
     * Checks that value is string
     * @param value
     * @return {boolean}
     *
     * @memo get from pull.client.Utils
     */
    isString(value: any): boolean;
    /**
     * Returns true if a value is not an empty string
     * @param value
     * @returns {boolean}
     */
    isStringFilled(value: any): boolean;
    /**
     * Checks that value is function
     * @param value
     * @return {boolean}
     *
     * @memo get from pull.client.Utils
     */
    isFunction(value: any): boolean;
    /**
     * Checks that value is an object
     * @param value
     * @return {boolean}
     */
    isObject(value: any): boolean;
    /**
     * Checks that value is object like
     * @param value
     * @return {boolean}
     */
    isObjectLike(value: any): boolean;
    /**
     * Checks that value is plain object
     * @param value
     * @return {boolean}
     */
    isPlainObject(value: any): boolean;
    isJsonRpcRequest(value: any): boolean;
    isJsonRpcResponse(value: any): boolean;
    /**
     * Checks that value is boolean
     * @param value
     * @return {boolean}
     */
    isBoolean(value: any): boolean;
    /**
     * Checks that value is number
     * @param value
     * @return {boolean}
     */
    isNumber(value: any): boolean;
    /**
     * Checks that value is integer
     * @param value
     * @return {boolean}
     */
    isInteger(value: any): boolean;
    /**
     * Checks that value is float
     * @param value
     * @return {boolean}
     */
    isFloat(value: any): boolean;
    /**
     * Checks that value is nil
     * @param value
     * @return {boolean}
     */
    isNil(value: any): boolean;
    /**
     * Checks that value is an array
     * @param value
     * @return {boolean}
     */
    isArray(value: any): boolean;
    /**
     * Returns true if a value is an array, and it has at least one element
     * @param value
     * @returns {boolean}
     */
    isArrayFilled(value: any): boolean;
    /**
     * Checks that value is array like
     * @param value
     * @return {boolean}
     */
    isArrayLike(value: any): boolean;
    /**
     * Checks that value is Date
     * @param value
     * @return {boolean}
     */
    isDate(value: any): boolean;
    /**
     * Checks that is a DOM node
     * @param value
     * @return {boolean}
     */
    isDomNode(value: any): boolean;
    /**
     * Checks that value is element node
     * @param value
     * @return {boolean}
     */
    isElementNode(value: any): boolean;
    /**
     * Checks that value is a text node
     * @param value
     * @return {boolean}
     */
    isTextNode(value: any): boolean;
    /**
     * Checks that value is Map
     * @param value
     * @return {boolean}
     */
    isMap(value: any): boolean;
    /**
     * Checks that value is Set
     * @param value
     * @return {boolean}
     */
    isSet(value: any): boolean;
    /**
     * Checks that value is WeakMap
     * @param value
     * @return {boolean}
     */
    isWeakMap(value: any): boolean;
    /**
     * Checks that value is WeakSet
     * @param value
     * @return {boolean}
     */
    isWeakSet(value: any): boolean;
    /**
     * Checks that value is prototype
     * @param value
     * @return {boolean}
     */
    isPrototype(value: any): boolean;
    /**
     * Checks that value is regexp
     * @param value
     * @return {boolean}
     */
    isRegExp(value: any): boolean;
    /**
     * Checks that value is null
     * @param value
     * @return {boolean}
     */
    isNull(value: any): boolean;
    /**
     * Checks that value is undefined
     * @param value
     * @return {boolean}
     */
    isUndefined(value: any): boolean;
    /**
     * Checks that value is ArrayBuffer
     * @param value
     * @return {boolean}
     */
    isArrayBuffer(value: any): boolean;
    /**
     * Checks that value is typed array
     * @param value
     * @return {boolean}
     */
    isTypedArray(value: any): boolean;
    /**
     * Checks that value is Blob
     * @param value
     * @return {boolean}
     */
    isBlob(value: any): boolean;
    /**
     * Checks that value is File
     * @param value
     * @return {boolean}
     */
    isFile(value: any): boolean;
    /**
     * Checks that value is FormData
     * @param value
     * @return {boolean}
     */
    isFormData(value: any): boolean;
    clone(obj: any, bCopyObj?: boolean): any;
}
declare const Type: TypeManager;

/**
 * The `Text` class provides a set of utility methods for working with text data.
 * It includes functions for encoding and decoding HTML entities, generating random strings,
 * converting values to different data types, and changing the case and format of strings
 *
 * @see bitrix/js/main/core/src/lib/text.js
 */
declare class TextManager {
    getRandom(length?: number): string;
    /**
     * Generates UUID
     */
    getUniqId(): string;
    /**
     * Generate uuid v7
     * @return {string}
     */
    getUuidRfc4122(): string;
    /**
     * Encodes all unsafe entities
     * @param {string} value
     * @return {string}
     */
    encode(value: string): string;
    /**
     * Decodes all encoded entities
     * @param {string} value
     * @return {string}
     */
    decode(value: string): string;
    toNumber(value: any): number;
    toInteger(value: any): number;
    toBoolean(value: any, trueValues?: string[]): boolean;
    toCamelCase(str: string): string;
    toPascalCase(str: string): string;
    toKebabCase(str: string): string;
    capitalize(str: string): string;
    numberFormat(number: number, decimals?: number, decPoint?: string, thousandsSep?: string): string;
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
    toDateTime(dateString: string, template?: string, opts?: DateTimeOptions): DateTime;
    getDateForLog(): string;
    buildQueryString(params: any): string;
}
declare const Text: TextManager;

/**
 * @see bitrix/js/main/core/src/lib/browser.js
 */
declare class BrowserManager {
    isOpera(): boolean;
    isIE(): boolean;
    isIE6(): boolean;
    isIE7(): boolean;
    isIE8(): boolean;
    isIE9(): boolean;
    isIE10(): boolean;
    isSafari(): boolean;
    isFirefox(): boolean;
    isChrome(): boolean;
    detectIEVersion(): number;
    isIE11(): boolean;
    isMac(): boolean;
    isWin(): boolean;
    isLinux(): boolean;
    isAndroid(): boolean;
    isIPad(): boolean;
    isIPhone(): boolean;
    isIOS(): boolean;
    isMobile(): boolean;
    isRetina(): boolean;
    isTouchDevice(): boolean;
    isDoctype(target: any): boolean;
    isLocalStorageSupported(): boolean;
    detectAndroidVersion(): number;
}
declare const Browser: BrowserManager;

/**
 * Interface defining the structure and methods of a Result object.
 */
interface IResult {
    /**
     * Indicates whether the operation resulted in success (no errors).
     */
    isSuccess: boolean;
    /**
     * Sets the data associated with the result.
     *
     * @param data The data to be stored in the result.
     * @returns The current Result object for chaining methods.
     */
    setData: (data: any) => IResult;
    /**
     * Retrieves the data associated with the result.
     *
     * @returns The data stored in the result, if any.
     */
    getData: () => any;
    /**
     * Adds an error message or Error object to the result.
     *
     * @param error The error message or Error object to be added.
     * @returns The current Result object for chaining methods.
     */
    addError: (error: Error | string) => IResult;
    /**
     * Adds multiple errors to the result in a single call.
     *
     * @param errors An array of errors or strings that will be converted to errors.
     * @returns The current Result object for chaining methods.
     */
    addErrors: (errors: (Error | string)[]) => IResult;
    /**
     * Retrieves an iterator for the errors collected in the result.
     *
     * @returns An iterator over the stored Error objects.
     */
    getErrors: () => IterableIterator<Error>;
    /**
     * Retrieves an array of error messages from the collected errors.
     *
     * @returns An array of strings representing the error messages.
     */
    getErrorMessages: () => string[];
    /**
     * Converts the Result object to a string.
     *
     * @returns {string} Returns a string representation of the result operation
     */
    toString: () => string;
}
/**
 * A class representing an operation result with success/failure status, data, and errors.
 * Similar to \Bitrix\Main\Result from Bitrix Framework.
 * @link https://dev.1c-bitrix.ru/api_d7/bitrix/main/result/index.php
 */
declare class Result implements IResult {
    private _errorCollection;
    protected _data: any;
    constructor();
    /**
     * Getter for the `isSuccess` property.
     * Checks if the `_errorCollection` is empty to determine success.
     *
     * @returns Whether the operation resulted in success (no errors).
     */
    get isSuccess(): boolean;
    /**
     * Sets the data associated with the result.
     *
     * @param data The data to be stored in the result.
     * @returns The current Result object for chaining methods.
     */
    setData(data: any): Result;
    /**
     * Retrieves the data associated with the result.
     *
     * @returns The data stored in the result, if any.
     */
    getData(): any;
    /**
     * Adds an error message or Error object to the result.
     *
     * @param error The error message or Error object to be added.
     * @returns The current Result object for chaining methods.
     */
    addError(error: Error | string): Result;
    /**
     * Adds multiple errors to the result in a single call.
     *
     * @param errors An array of errors or strings that will be converted to errors.
     * @returns The current Result object for chaining methods.
     */
    addErrors(errors: (Error | string)[]): Result;
    /**
     * Retrieves an iterator for the errors collected in the result.
     * @returns An iterator over the stored Error objects.
     */
    getErrors(): IterableIterator<Error>;
    /**
     * Retrieves an array of error messages from the collected errors.
     *
     * @returns An array of strings representing the error messages. Each string
     *          contains the message of a corresponding error object.
     */
    getErrorMessages(): string[];
    /**
     * Converts the Result object to a string.
     *
     * @returns {string} Returns a string representation of the result operation
     */
    toString(): string;
}

type PayloadTime = {
    readonly start: number;
    readonly finish: number;
    readonly duration: number;
    readonly processing: number;
    readonly date_start: string;
    readonly date_finish: string;
};
type GetPayload<P> = {
    readonly result: P;
    readonly time: PayloadTime;
};
type ListPayload<P> = {
    readonly result: any | P[];
    readonly error?: string;
    readonly total: number;
    readonly next?: number;
    readonly time: PayloadTime;
};
type BatchPayload<C> = {
    readonly result: {
        readonly result: {
            readonly [P in keyof C]?: C[P];
        } | ReadonlyArray<C[keyof C]>;
        readonly result_error: {
            readonly [P in keyof C]?: string;
        } | readonly string[];
        readonly result_total: {
            readonly [P in keyof C]?: number;
        } | readonly number[];
        readonly result_next: {
            readonly [P in keyof C]?: number;
        } | readonly number[];
        readonly result_time: {
            readonly [P in keyof C]?: PayloadTime;
        } | readonly PayloadTime[];
    };
    readonly time: PayloadTime;
};
type Payload<P> = GetPayload<P> | ListPayload<P> | BatchPayload<P>;

type AjaxQuery = {
    method: string;
    params: object;
    start: number;
};
type AjaxResultParams = {
    error?: string | {
        error: string;
        error_description: string;
    };
    error_description?: string;
    result: any;
    next?: NumberString;
    total?: NumberString;
};
/**
 * Result of request to Rest Api
 */
declare class AjaxResult extends Result implements IResult {
    private readonly _status;
    private readonly _query;
    protected _data: AjaxResultParams;
    constructor(answer: AjaxResultParams, query: AjaxQuery, status: number);
    setData(data: any): Result;
    getData(): Payload<unknown>;
    isMore(): boolean;
    getTotal(): number;
    getStatus(): number;
    getQuery(): AjaxQuery;
    getNext(http: TypeHttp): Promise<false | AjaxResult>;
}

type TypeHttp = {
    setLogger(logger: LoggerBrowser): void;
    getLogger(): LoggerBrowser;
    batch(calls: any[] | object, isHaltOnError: boolean): Promise<Result>;
    call(method: string, params: object, start: number): Promise<AjaxResult>;
    setRestrictionManagerParams(params: TypeRestrictionManagerParams): void;
    getRestrictionManagerParams(): TypeRestrictionManagerParams;
    setLogTag(logTag?: string): void;
    clearLogTag(): void;
    /**
     * On|Off warning about client-side query execution
     * @param {boolean} value
     * @param {string} message
     */
    setClientSideWarning(value: boolean, message: string): void;
};
interface IRequestIdGenerator {
    getRequestId(): string;
    getHeaderFieldName(): string;
    getQueryStringParameterName(): string;
    getQueryStringSdkParameterName(): string;
}
type TypeRestrictionManagerParams = {
    sleep: number;
    speed: number;
    amount: number;
};
declare const RestrictionManagerParamsBase: TypeRestrictionManagerParams;
/**
 * @todo Need test
 */
declare const RestrictionManagerParamsForEnterprise: TypeRestrictionManagerParams;

type TypeDescriptionError = {
    readonly error: 'invalid_token' | 'expired_token' | string;
    readonly error_description: string;
};
/**
 * Parameters for hook
 */
type B24HookParams = {
    /**
     * https://your-bitrix-portal.bitrix24.com
     */
    b24Url: string;
    userId: number;
    secret: string;
};
/**
 * Parameters passed in the GET request from the B24 parent window to the application
 */
type B24FrameQueryParams = {
    DOMAIN: string | null | undefined;
    PROTOCOL: boolean | null | undefined;
    LANG: string | null | undefined;
    APP_SID: string | null | undefined;
};
/**
 * Parameters passed from the parent window when calling refreshAuth
 */
type RefreshAuthData = {
    AUTH_ID: string;
    REFRESH_ID: string;
    AUTH_EXPIRES: NumberString;
};
/**
 * Parameters passed from the parent window when calling getInitData
 */
type MessageInitData = RefreshAuthData & {
    DOMAIN: string;
    PROTOCOL: string;
    PATH: string;
    LANG: string;
    MEMBER_ID: string;
    IS_ADMIN: boolean;
    APP_OPTIONS: Record<string, any>;
    USER_OPTIONS: Record<string, any>;
    PLACEMENT: string;
    PLACEMENT_OPTIONS: Record<string, any>;
    INSTALL: boolean;
    FIRST_RUN: boolean;
};
/**
 * Parameters for OAuth authorization
 */
type AuthData = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    domain: string;
    member_id: string;
};
/**
 * Interface for updating authorization
 */
interface AuthActions {
    getAuthData: () => false | AuthData;
    refreshAuth: () => Promise<AuthData>;
    getUniq: (prefix: string) => string;
    isAdmin: boolean;
}

type TypeB24 = {
    /**
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-functions/bx24-init.html
     */
    readonly isInit: boolean;
    init(): Promise<void>;
    destroy(): void;
    getLogger(): LoggerBrowser;
    setLogger(logger: LoggerBrowser): void;
    get auth(): AuthActions;
    /**
     * Get the account address BX24 ( https://name.bitrix24.com )
     */
    getTargetOrigin(): string;
    /**
     * Get the account address BX24 ( https://name.bitrix24.com/rest )
     */
    getTargetOriginWithPath(): string;
    /**
     * Calls a REST service method with the specified parameters
     *
     * @param {string} method
     * @param {object} params
     * @param {number} start
     *
     * @return {Promise}
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/how-to-call-rest-methods/bx24-call-method.html
     */
    callMethod(method: string, params?: object, start?: number): Promise<AjaxResult>;
    /**
     * Calls a REST service list method with the specified parameters
     *
     * @param  {string} method Query method
     * @param  {object} params Request parameters
     * @param {null|((progress: number) => void)} progress Processing steps
     * @param {string} customKeyForResult Custom field indicating that the result will be a grouping key
     * @return {Promise}
     */
    callListMethod(method: string, params?: object, progress?: null | ((progress: number) => void), customKeyForResult?: string | null): Promise<Result>;
    /**
     * Calls a REST service list method with the specified parameters and returns a generator object.
     * Implements the fast algorithm described in {@see https://apidocs.bitrix24.com/api-reference/performance/huge-data.html}
     *
     * @param {string} method Query method
     * @param {object} params Request parameters
     * @param {string} idKey Entity ID field name ('ID' || 'id')
     * @param {string} customKeyForResult Custom field indicating that the result will be a grouping key
     *
     * @return {AsyncGenerator} Generator
     */
    fetchListMethod(method: string, params?: any, idKey?: string, customKeyForResult?: string | null): AsyncGenerator<any[]>;
    /**
     * Calls a batch request with a maximum number of commands of no more than 50
     *
     * @param  {array|object} calls Request packet
     * calls = [[method,params],[method,params]]
     * calls = [{method:method,params:params},[method,params]]
     * calls = {call_id:[method,params],...}
     * @param  {boolean} isHaltOnError Abort package execution when an error occurs
     *
     * @return {Promise} Promise
     *
     * @see https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/how-to-call-rest-methods/bx24-call-batch.html
     */
    callBatch(calls: Array<any> | object, isHaltOnError?: boolean): Promise<Result>;
    /**
     * Calls a batch request with any number of commands
     *
     * @param  {array} calls Request packet
     * calls = [[method,params],[method,params]]
     * @param  {boolean} isHaltOnError Abort package execution when an error occurs
     *
     * @return {Promise} Promise
     *
     * @see https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/how-to-call-rest-methods/bx24-call-batch.html
     */
    callBatchByChunk(calls: Array<any>, isHaltOnError: boolean): Promise<Result>;
    /**
     * Returns Http client for requests
     */
    getHttpClient(): TypeHttp;
};

/**
 * User fields for scope:user_brief
 * @link https://dev.1c-bitrix.ru/rest_help/users/index.php
 */
type UserBrief = {
    readonly [key: string]: string | boolean | null | readonly number[];
    readonly ID: NumberString;
    readonly XML_ID: string | null;
    readonly ACTIVE: boolean;
    readonly NAME: string | null;
    readonly LAST_NAME: string | null;
    readonly SECOND_NAME: string | null;
    readonly TITLE: string | null;
    readonly IS_ONLINE: BoolString;
    readonly TIME_ZONE: string | null;
    readonly TIME_ZONE_OFFSET: NumberString | null;
    readonly TIMESTAMP_X: string;
    readonly DATE_REGISTER: ISODate;
    readonly PERSONAL_PROFESSION: string | null;
    readonly PERSONAL_GENDER: GenderString;
    readonly PERSONAL_BIRTHDAY: string | null;
    readonly PERSONAL_PHOTO: string | null;
    readonly PERSONAL_CITY: string | null;
    readonly PERSONAL_STATE: string | null;
    readonly PERSONAL_COUNTRY: string | null;
    readonly WORK_POSITION: string | null;
    readonly WORK_CITY: string | null;
    readonly WORK_STATE: string | null;
    readonly WORK_COUNTRY: string | null;
    readonly LAST_ACTIVITY_DATE: string;
    readonly UF_EMPLOYMENT_DATE: ISODate | string;
    readonly UF_TIMEMAN: string | null;
    readonly UF_SKILLS: string | null;
    readonly UF_INTERESTS: string | null;
    readonly UF_DEPARTMENT: readonly number[];
    readonly UF_PHONE_INNER: NumberString | null;
};
/**
 * User fields for scope:user_basic
 */
type UserBasic = UserBrief & {
    readonly EMAIL: string | null;
    readonly PERSONAL_WWW: string | null;
    readonly PERSONAL_ICQ: string | null;
    readonly PERSONAL_PHONE: string | null;
    readonly PERSONAL_FAX: string | null;
    readonly PERSONAL_MOBILE: string | null;
    readonly PERSONAL_PAGER: string | null;
    readonly PERSONAL_STREET: string | null;
    readonly PERSONAL_ZIP: string | null;
    readonly WORK_COMPANY: string | null;
    readonly WORK_PHONE: string | null;
    readonly UF_SKILLS: string | null;
    readonly UF_WEB_SITES: string | null;
    readonly UF_XING: string | null;
    readonly UF_LINKEDIN: string | null;
    readonly UF_FACEBOOK: string | null;
    readonly UF_TWITTER: string | null;
    readonly UF_SKYPE: string | null;
    readonly UF_DISTRICT: string | null;
    readonly USER_TYPE: 'employee';
};

type StatusClose = {
    isOpenAtNewWindow: boolean;
    isClose: boolean;
};

/**
 * CRM Entity Types
 * @link https://dev.1c-bitrix.ru/rest_help/crm/constants.php
 */
declare enum EnumCrmEntityType {
    undefined = "UNDEFINED",
    lead = "CRM_LEAD",
    deal = "CRM_DEAL",
    contact = "CRM_CONTACT",
    company = "CRM_COMPANY",
    oldInvoice = "CRM_INVOICE",
    invoice = "CRM_SMART_INVOICE",
    quote = "CRM_QUOTE",
    requisite = "CRM_REQUISITE"
}
declare enum EnumCrmEntityTypeId {
    undefined = 0,
    lead = 1,
    deal = 2,
    contact = 3,
    company = 4,
    oldInvoice = 5,
    invoice = 31,
    quote = 7,
    requisite = 8
}

/**
 * UF embedding properties interface
 *
 * @link https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=99&LESSON_ID=8633
 */
interface IPlacementUF {
    /**
     * UF ID
     */
    FIELD_NAME: string;
    /**
     * The identifier of the entity to which the field is bound
     */
    ENTITY_ID: EnumCrmEntityType;
    /**
     * The identifier of the entity element whose field value is being edited
     */
    ENTITY_VALUE_ID: NumberString;
    /**
     * The mode in which the field is called
     */
    MODE: PlacementViewMode;
    /**
     * Field Requirement Flag
     */
    MANDATORY: BoolString;
    /**
     * Field multiplicity flag
     */
    MULTIPLE: BoolString;
    /**
     * Current value of the field. For a multiple field, an array of values.
     */
    VALUE: any;
    /**
     * External field code
     */
    XML_ID: string;
}

declare enum LoadDataType {
    App = "app",
    Profile = "profile",
    Currency = "currency",
    AppOptions = "appOptions",
    UserOptions = "userOptions"
}
type TypeUser = {
    readonly isAdmin: boolean;
    readonly id: null | number;
    readonly lastName: null | string;
    readonly name: null | string;
    readonly gender: GenderString;
    readonly photo: null | string;
    readonly TimeZone: null | string;
    readonly TimeZoneOffset: null | number;
};
declare const EnumAppStatus: {
    readonly Free: "F";
    readonly Demo: "D";
    readonly Trial: "T";
    readonly Paid: "P";
    readonly Local: "L";
    readonly Subscription: "S";
};
declare const StatusDescriptions: Record<(typeof EnumAppStatus)[keyof typeof EnumAppStatus], string>;
type TypeEnumAppStatus = keyof typeof EnumAppStatus;
/**
 * @link https://dev.1c-bitrix.ru/rest_help/general/app_info.php
 */
type TypeApp = {
    /**
     * Local application identifier on the portal
     */
    readonly id: number;
    /**
     * application code
     */
    readonly code: string;
    /**
     * installed version of the application
     */
    readonly version: number;
    /**
     * application status
     */
    readonly status: TypeEnumAppStatus;
    /**
     * application installed flag
     */
    readonly isInstalled: boolean;
};
/**
 * @link https://dev.1c-bitrix.ru/rest_help/general/app_info.php
 */
type TypePayment = {
    /**
     * flag indicating whether the paid period or trial period has expired
     */
    readonly isExpired: boolean;
    /**
     * number of days remaining until the end of the paid period or trial period
     */
    readonly days: number;
};
/**
 * @link https://dev.1c-bitrix.ru/rest_help/general/app_info.php
 */
type TypeLicense = {
    /**
     * language code designation
     */
    readonly languageId: null | string;
    /**
     * tariff designation with indication of the region as a prefix
     */
    readonly license: null | string;
    /**
     * internal tariff designation without indication of region
     */
    readonly licenseType: null | string;
    /**
     * past meaning of license
     */
    readonly licensePrevious: null | string;
    /**
     * Tariff designation without specifying the region.
     */
    readonly licenseFamily: null | string;
    /**
     * flag indicating whether it is a box (true) or a cloud (false)
     */
    readonly isSelfHosted: boolean;
};
declare const TypeSpecificUrl: {
    readonly MainSettings: "MainSettings";
    readonly UfList: "UfList";
    readonly UfPage: "UfPage";
};
type TypeB24Form = {
    readonly app_code: string;
    readonly app_status: string;
    readonly payment_expired: BoolString;
    readonly days: number;
    /**
     * B24 tariff plan identifier (if cloud)
     */
    readonly b24_plan: string;
    readonly c_name: string;
    readonly c_last_name: string;
    readonly hostname: string;
};
type CurrencyFormat = {
    decimals: number;
    decPoint: string;
    formatString: string;
    fullName: string;
    isHideZero: boolean;
    thousandsSep?: string;
    thousandsVariant?: 'N' | 'D' | 'C' | 'S' | 'B' | 'OWN' | string;
};
type Currency = {
    amount: number;
    amountCnt: number;
    isBase: boolean;
    currencyCode: string;
    dateUpdate: DateTime;
    decimals: number;
    decPoint: string;
    formatString: string;
    fullName: string;
    lid: string;
    sort: number;
    thousandsSep?: string;
    lang: Record<string, CurrencyFormat>;
};
declare enum TypeOption {
    NotSet = "notSet",
    JsonArray = "jsonArray",
    JsonObject = "jsonObject",
    FloatVal = "float",
    IntegerVal = "integer",
    BoolYN = "boolYN",
    StringVal = "string"
}

type TypePullMessage = {
    command: string;
    params: Record<string, any>;
    extra: Record<string, any>;
};
type TypePullClientMessageBody = {
    module_id: string;
    command: string;
    params: any;
    extra?: {
        revision_web?: number;
        sender?: {
            type: SenderType;
        };
        server_time_unix?: number;
        server_time_ago?: number;
    };
};
declare enum ConnectionType {
    Undefined = "undefined",
    WebSocket = "webSocket",
    LongPolling = "longPolling"
}
type TypeConnector = {
    setLogger(logger: LoggerBrowser): void;
    destroy(): void;
    connect(): void;
    disconnect(code: number, reason: string): void;
    send(buffer: ArrayBuffer | string): boolean;
    connected: boolean;
    connectionPath: string;
};
type ConnectorParent = {
    session: TypePullClientSession;
    getConnectionPath(connectionType: ConnectionType): string;
    getPublicationPath(): string;
    setLastMessageId(lastMessageId: string): void;
    isProtobufSupported(): boolean;
    isJsonRpc(): boolean;
};
type ConnectorCallbacks = {
    onOpen: () => void;
    onDisconnect: (response: {
        code: number;
        reason: string;
    }) => void;
    onError: (error: Error) => void;
    onMessage: (response: string | ArrayBuffer) => void;
};
type ConnectorConfig = {
    parent: ConnectorParent;
    onOpen?: () => void;
    onDisconnect?: (response: {
        code: number;
        reason: string;
    }) => void;
    onError?: (error: Error) => void;
    onMessage?: (response: string | ArrayBuffer) => void;
};
type StorageManagerParams = {
    userId?: number;
    siteId?: string;
};
type TypeStorageManager = {
    setLogger(logger: LoggerBrowser): void;
    getLogger(): LoggerBrowser;
    set(name: string, value: any): void;
    get(name: string, defaultValue: any): any;
    remove(name: string): void;
    compareKey(eventKey: string, userKey: string): boolean;
};
declare enum LsKeys {
    PullConfig = "bx-pull-config",
    WebsocketBlocked = "bx-pull-websocket-blocked",
    LongPollingBlocked = "bx-pull-longpolling-blocked",
    LoggingEnabled = "bx-pull-logging-enabled"
}
type SharedConfigCallbacks = {
    onWebSocketBlockChanged: (response: {
        isWebSocketBlocked: boolean;
    }) => void;
};
type SharedConfigParams = {
    storage?: TypeStorageManager;
    onWebSocketBlockChanged?: (response: {
        isWebSocketBlocked: boolean;
    }) => void;
};
declare enum PullStatus {
    Online = "online",
    Offline = "offline",
    Connecting = "connect"
}
declare enum SenderType {
    Unknown = 0,
    Client = 1,
    Backend = 2
}
declare enum SubscriptionType {
    Server = "server",
    Client = "client",
    Online = "online",
    Status = "status",
    Revision = "revision"
}
type TypeSubscriptionOptions = {
    /**
     * Subscription type
     */
    type?: SubscriptionType;
    /**
     * Name of the module
     */
    moduleId?: string;
    /**
     * Name of the command
     */
    command?: null | string;
    /**
     * Function, that will be called for incoming messages
     */
    callback: Function;
};
interface UserStatusCallback {
    (params: {
        userId: number;
        isOnline: boolean;
    }): void;
}
interface CommandHandlerFunctionV1 {
    (data: Record<string, any>, info?: {
        type: SubscriptionType;
        moduleId?: string;
    }): void;
}
interface CommandHandlerFunctionV2 {
    (params: Record<string, any>, extra: Record<string, any>, command: string, info?: {
        type: SubscriptionType;
        moduleId: string;
    }): void;
}
interface TypeSubscriptionCommandHandler {
    getModuleId: () => string;
    getSubscriptionType?: () => SubscriptionType;
    getMap?: () => Record<string, CommandHandlerFunctionV2>;
    [key: string]: CommandHandlerFunctionV2 | undefined;
}
type TypePullClientEmitConfig = {
    type: SubscriptionType;
    moduleId?: string;
    data?: Record<string, any>;
};
declare enum CloseReasons {
    NORMAL_CLOSURE = 1000,
    SERVER_DIE = 1001,
    CONFIG_REPLACED = 3000,
    CHANNEL_EXPIRED = 3001,
    SERVER_RESTARTED = 3002,
    CONFIG_EXPIRED = 3003,
    MANUAL = 3004,
    STUCK = 3005,
    WRONG_CHANNEL_ID = 4010
}
declare enum SystemCommands {
    CHANNEL_EXPIRE = "CHANNEL_EXPIRE",
    CONFIG_EXPIRE = "CONFIG_EXPIRE",
    SERVER_RESTART = "SERVER_RESTART"
}
declare enum ServerMode {
    Shared = "shared",
    Personal = "personal"
}
type RpcError = {
    code: number;
    message: string;
};
declare const ListRpcError: {
    readonly Parse: RpcError;
    readonly InvalidRequest: RpcError;
    readonly MethodNotFound: RpcError;
    readonly InvalidParams: RpcError;
    readonly Internal: RpcError;
};
type JsonRpcRequest = {
    method: string;
    params: any;
    id: number;
};
type RpcCommand = {
    jsonrpc: string;
    method: string;
    params: any;
    id: number;
};
type RpcRequest = RpcCommand & {};
type RpcCommandResult = {
    jsonrpc?: string;
    id?: number;
    /**
     * @fix this TypeRpcResponseAwaiters.resolve(response)
     */
    result?: any;
    error?: RpcError;
};
declare enum RpcMethod {
    Publish = "publish",
    GetUsersLastSeen = "getUsersLastSeen",
    Ping = "ping",
    ListChannels = "listChannels",
    SubscribeStatusChange = "subscribeStatusChange",
    UnsubscribeStatusChange = "unsubscribeStatusChange"
}
type TypeRpcResponseAwaiters = {
    /**
     * @fix this RpcCommandResult.result
     */
    resolve: (response: any) => void;
    reject: (error: string | RpcError) => void;
    timeout: number;
};
type TypeJsonRpcConfig = {
    connector: TypeConnector;
    handlers: Record<string, (params: any) => RpcCommandResult>;
};
type TypePublicIdDescriptor = {
    id?: string;
    user_id?: NumberString;
    public_id?: string;
    signature?: string;
    start: ISODate;
    end: ISODate;
    type?: string;
};
type TypeChanel = {
    userId: number;
    publicId: string;
    signature: string;
    start: Date;
    end: Date;
};
type TypeChannelManagerParams = {
    b24: TypeB24;
    getPublicListMethod: string;
};
type TypePullClientSession = {
    mid: null | string;
    tag: null | string;
    time: null | number;
    history: any;
    lastMessageIds: string[];
    messageCount: number;
};
type TypeSessionEvent = {
    mid: string;
    tag?: string;
    time?: number;
    text: Record<string, any> | TypePullClientMessageBody;
};
type TypePullClientParams = {
    b24: TypeB24;
    skipCheckRevision?: boolean;
    restApplication?: string;
    siteId?: string;
    guestMode?: boolean;
    guestUserId?: number;
    userId?: number;
    serverEnabled?: boolean;
    configGetMethod?: string;
    getPublicListMethod?: string;
    skipStorageInit?: boolean;
    configTimestamp?: number;
};
type TypePullClientConfig = {
    /**
     * @fix this
     */
    clientId: null;
    api: {
        revision_mobile: number;
        revision_web: number;
    };
    channels: {
        private?: TypePublicIdDescriptor;
        shared?: TypePublicIdDescriptor;
    };
    publicChannels: Record<string, TypePublicIdDescriptor>;
    server: {
        timeShift: number;
        config_timestamp: number;
        long_polling: string;
        long_pooling_secure: string;
        mode: string;
        publish: string;
        publish_enabled: boolean;
        publish_secure: string;
        server_enabled: boolean;
        version: number;
        websocket: string;
        websocket_enabled: boolean;
        websocket_secure: string;
    };
    jwt: null | string;
    exp: number;
};
type TypePullClientMessageBatch = {
    userList?: number[];
    channelList?: (string | {
        publicId: string;
        signature: string;
    })[];
    body: TypePullClientMessageBody;
    expiry?: number;
};

type AnswerError = {
    error: string;
    errorDescription: string;
};
type AjaxErrorParams = {
    status: number;
    answerError: AnswerError;
    cause?: Error;
};
/**
 * Error requesting RestApi
 */
declare class AjaxError extends Error {
    cause: null | Error;
    private _status;
    private _answerError;
    constructor(params: AjaxErrorParams);
    get answerError(): AnswerError;
    get status(): number;
    set status(status: number);
    toString(): string;
}

declare abstract class AbstractB24 implements TypeB24 {
    static readonly batchSize = 50;
    protected _isInit: boolean;
    protected _http: null | TypeHttp;
    protected _logger: null | LoggerBrowser;
    protected constructor();
    /**
     * @inheritDoc
     */
    get isInit(): boolean;
    init(): Promise<void>;
    destroy(): void;
    setLogger(logger: LoggerBrowser): void;
    getLogger(): LoggerBrowser;
    abstract get auth(): AuthActions;
    /**
     * @inheritDoc
     */
    abstract getTargetOrigin(): string;
    /**
     * @inheritDoc
     */
    abstract getTargetOriginWithPath(): string;
    /**
     * @inheritDoc
     */
    callMethod(method: string, params?: object, start?: number): Promise<AjaxResult>;
    /**
     * @inheritDoc
     */
    callListMethod(method: string, params?: object, progress?: null | ((progress: number) => void), customKeyForResult?: null | string): Promise<Result>;
    /**
     * @inheritDoc
     */
    fetchListMethod(method: string, params?: any, idKey?: string, customKeyForResult?: null | string): AsyncGenerator<any[]>;
    /**
     * @inheritDoc
     */
    callBatch(calls: Array<any> | object, isHaltOnError?: boolean): Promise<Result>;
    chunkArray<T>(array: T[], chunkSize?: number): T[][];
    /**
     * @inheritDoc
     */
    callBatchByChunk(calls: Array<any>, isHaltOnError?: boolean): Promise<Result>;
    /**
     * @inheritDoc
     */
    getHttpClient(): TypeHttp;
    /**
     * Returns settings for http connection
     * @protected
     */
    protected _getHttpOptions(): null | object;
    /**
     * Generates an object not initialized error
     * @protected
     */
    protected _ensureInitialized(): void;
}

/**
 * List of supported languages in B24.Cloud
 *
 * It is worth remembering that there will be 1-2 languages for the B24.Box
 */
declare enum B24LangList {
    en = "en",
    de = "de",
    la = "la",
    br = "br",
    fr = "fr",
    it = "it",
    pl = "pl",
    ru = "ru",
    ua = "ua",
    tr = "tr",
    sc = "sc",
    tc = "tc",
    ja = "ja",
    vn = "vn",
    id = "id",
    ms = "ms",
    th = "th",
    ar = "ar"
}

declare class FormatterNumbers {
    private static isInternalConstructing;
    private static instance;
    private _defLocale;
    private constructor();
    /**
     * @return FormatterNumbers
     */
    static getInstance(): FormatterNumbers;
    setDefLocale(locale: string): void;
    format(value: number, locale?: string): string;
}

declare class IbanSpecification {
    /**
     * the code of the country
     */
    readonly countryCode: string;
    /**
     * the length of the IBAN
     */
    readonly length: number;
    /**
     * the structure of the underlying BBAN (for validation and formatting)
     */
    readonly structure: string;
    /**
     * an example valid IBAN
     */
    readonly example: string;
    private _cachedRegex;
    constructor(countryCode: string, length: number, structure: string, example: string);
    /**
     * Check if the passed iban is valid, according to this specification.
     *
     * @param {String} iban the iban to validate
     * @returns {boolean} true if valid, false otherwise
     */
    isValid(iban: string): boolean;
    /**
     * Convert the passed IBAN to a country-specific BBAN.
     *
     * @param iban the IBAN to convert
     * @param separator the separator to use between BBAN blocks
     * @returns {string} the BBAN
     */
    toBBAN(iban: string, separator: string): string;
    /**
     * Convert the passed BBAN to an IBAN for this country specification.
     * Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
     * This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
     *
     * @param bban the BBAN to convert to IBAN
     * @returns {string} the IBAN
     */
    fromBBAN(bban: string): string;
    /**
     * Check of the passed BBAN is valid.
     * This function only checks the format of the BBAN (length and compliance with alphanumeric specifications) but does not
     * verify the check digit.
     *
     * @param bban the BBAN to validate
     * @returns {boolean} true if the passed bban is a valid BBAN, according to this specification, false otherwise
     */
    isValidBBAN(bban: string): boolean;
    /**
     * Lazy-loaded regex (parse the structure and construct the regular expression the first time we need it for validation)
     */
    private _regex;
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
    private _parseStructure;
    /**
     * Prepare an IBAN for mod 97 computation by moving the first 4 chars to the end and transforming the letters to
     * numbers (A = 10, B = 11, ..., Z = 35), as specified in ISO13616.
     *
     * @param {string} iban the IBAN
     * @returns {string} the prepared IBAN
     */
    private _iso13616Prepare;
    /**
     * Calculates MOD 97 10 of the passed IBAN as specified in ISO7064.
     *
     * @param iban
     * @returns {number}
     */
    private _iso7064Mod9710;
}
declare class FormatterIban {
    private static isInternalConstructing;
    private static instance;
    private _countries;
    private constructor();
    /**
     * @return FormatterIban
     */
    static getInstance(): FormatterIban;
    addSpecification(IBAN: IbanSpecification): void;
    /**
     * Check if an IBAN is valid.
     *
     * @param {String} iban the IBAN to validate.
     * @returns {boolean} true if the passed IBAN is valid, false otherwise
     */
    isValid(iban: string): boolean;
    printFormat(iban: string, separator?: string): string;
    electronicFormat(iban: string): string;
    /**
     * Convert an IBAN to a BBAN.
     *
     * @param iban
     * @param {String} [separator] the separator to use between the blocks of the BBAN, defaults to ' '
     * @returns {string|*}
     */
    toBBAN(iban: string, separator?: string): string;
    /**
     * Convert the passed BBAN to an IBAN for this country specification.
     * Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
     * This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
     *
     * @param countryCode the country of the BBAN
     * @param bban the BBAN to convert to IBAN
     * @returns {string} the IBAN
     */
    fromBBAN(countryCode: string, bban: string): string;
    /**
     * Check the validity of the passed BBAN.
     *
     * @param countryCode the country of the BBAN
     * @param bban the BBAN to check the validity of
     */
    isValidBBAN(countryCode: string, bban: string): boolean;
    private _isString;
}

declare const useFormatter: () => {
    formatterNumber: FormatterNumbers;
    formatterIban: FormatterIban;
};

/**
 * B24.Hook Manager.
 *
 * @link https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=99&LESSON_ID=8581&LESSON_PATH=8771.8583.8581
 */
declare class B24Hook extends AbstractB24 implements TypeB24 {
    #private;
    constructor(b24HookParams: B24HookParams);
    setLogger(logger: LoggerBrowser): void;
    get auth(): AuthActions;
    /**
     * Disables warning about client-side query execution
     */
    offClientSideWarning(): void;
    /**
     * Get the account address BX24 ( https://name.bitrix24.com )
     */
    getTargetOrigin(): string;
    /**
     * Get the account address BX24 with Path ( https://name.bitrix24.com/rest/1/xxxxx )
     */
    getTargetOriginWithPath(): string;
}

/**
 * Authorization Manager
 */
declare class AuthHookManager implements AuthActions {
    #private;
    constructor(b24HookParams: B24HookParams);
    /**
     * @see Http.#prepareParams
     */
    getAuthData(): false | AuthData;
    refreshAuth(): Promise<AuthData>;
    getUniq(prefix: string): string;
    /**
     * Get the account address BX24 ( https://name.bitrix24.com )
     */
    getTargetOrigin(): string;
    /**
     * Get the account address BX24 with Path ( https://name.bitrix24.com/rest/1/xxxxx )
     */
    getTargetOriginWithPath(): string;
    /**
     * We believe that hooks are created only by the admin
     */
    get isAdmin(): boolean;
}

/**
 * List of commands for the B24 parent window
 */
declare enum MessageCommands {
    getInitData = "getInitData",
    setInstallFinish = "setInstallFinish",
    setInstall = "setInstall",
    refreshAuth = "refreshAuth",
    setAppOption = "setAppOption",
    setUserOption = "setUserOption",
    resizeWindow = "resizeWindow",
    reloadWindow = "reloadWindow",
    setTitle = "setTitle",
    setScroll = "setScroll",
    openApplication = "openApplication",
    closeApplication = "closeApplication",
    openPath = "openPath",
    imCallTo = "imCallTo",
    imPhoneTo = "imPhoneTo",
    imOpenMessenger = "imOpenMessenger",
    imOpenHistory = "imOpenHistory",
    selectUser = "selectUser",
    selectAccess = "selectAccess",
    selectCRM = "selectCRM",
    showAppForm = "showAppForm"
}

/**
 * Application Frame Data Manager
 */
declare class AppFrame {
    #private;
    constructor(queryParams: B24FrameQueryParams);
    /**
     * Initializes the data received from the parent window message.
     * @param data
     */
    initData(data: MessageInitData): AppFrame;
    /**
     * Returns the sid of the application relative to the parent window like this `9c33468728e1d2c8c97562475edfd96`
     */
    getAppSid(): string;
    /**
     * Get the account address BX24 (https://name.bitrix24.com)
     */
    getTargetOrigin(): string;
    /**
     * Get the account address BX24 with Path (https://name.bitrix24.com/rest)
     */
    getTargetOriginWithPath(): string;
    /**
     * Returns the localization of the B24 interface
     * @return {B24LangList} - default B24LangList.en
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-get-lang.html
     */
    getLang(): B24LangList;
}

/**
 * Parent Window Request Parameters
 * @prop isSafely auto completion mode Promise.resolve()
 * @prop safelyTime after what time (900 ms) should it be automatically resolved Promise
 */
interface SendParams {
    [index: string]: any;
    isSafely?: boolean;
    safelyTime?: number;
}
/**
 * Parent Window Communication Manager at B24
 */
declare class MessageManager {
    #private;
    protected _logger: null | LoggerBrowser;
    private runCallbackHandler;
    constructor(appFrame: AppFrame);
    setLogger(logger: LoggerBrowser): void;
    getLogger(): LoggerBrowser;
    /**
     * Subscribe to the onMessage event of the parent window
     */
    subscribe(): void;
    /**
     * Unsubscribe from the onMessage event of the parent window
     */
    unsubscribe(): void;
    /**
     * Send message to parent window
     * The answer (if) we will get in _runCallback
     *
     * @param command
     * @param params
     */
    send(command: string | MessageCommands, params?: null | SendParams): Promise<any>;
    /**
     * Fulfilling a promise based on messages from the parent window
     *
     * @param event
     * @private
     */
    _runCallback(event: MessageEvent): void;
}

/**
 * Parent window manager
 *
 * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/
 */
declare class ParentManager {
    #private;
    constructor(messageManager: MessageManager);
    /**
     * The method closes the open modal window with the application
     *
     * @return {Promise<void>}
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-close-application.html
     */
    closeApplication(): Promise<void>;
    /**
     * Sets the size of the frame containing the application to the size of the frame's content.
     *
     * @return {Promise<void>}
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-fit-window.html
     *
     * @memo in certain situations it may not be executed (placement of the main window after installing the application), in this case isSafely mode will work
     */
    fitWindow(): Promise<any>;
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
    resizeWindow(width: number, height: number): Promise<void>;
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
    resizeWindowAuto(appNode?: null | HTMLElement, minHeight?: number, minWidth?: number): Promise<void>;
    /**
     * This function returns the inner dimensions of the application frame
     *
     * @return {Promise<{scrollWidth: number; scrollHeight: number}>}
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-get-scroll-size.html
     */
    getScrollSize(): {
        scrollWidth: number;
        scrollHeight: number;
    };
    /**
     * Scrolls the parent window
     *
     * @param {number} scroll should specify the vertical scrollbar position (0 - scroll to the very top)
     * @return {Promise<void>}
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-scroll-parent-window.html
     */
    scrollParentWindow(scroll: number): Promise<void>;
    /**
     * Reload the page with the application (the whole page, not just the frame).
     *
     * @return {Promise<void>}
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-reload-window.html
     */
    reloadWindow(): Promise<void>;
    /**
     * Set Page Title
     *
     * @param {string} title
     *
     * @return {Promise<void>}
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-set-title.html
     */
    setTitle(title: string): Promise<void>;
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
    imCallTo(userId: number, isVideo?: boolean): Promise<void>;
    /**
     * Makes a call to the phone number
     *
     * @param {string} phone Phone number. The number can be in the format: `+44 20 1234 5678` or `x (xxx) xxx-xx-xx`
     *
     * @return {Promise<void>}
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-im-phone-to.html
     */
    imPhoneTo(phone: string): Promise<void>;
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
    imOpenMessenger(dialogId: number | `chat${number}` | `sg${number}` | `imol|${number}` | undefined): Promise<void>;
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
    imOpenHistory(dialogId: number | `chat${number}` | `imol|${number}`): Promise<void>;
}

/**
 * Manager for working with application settings via communication with the parent window
 *
 * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/options/index.html
 */
declare class OptionsManager$1 {
    #private;
    constructor(messageManager: MessageManager);
    /**
     * Initializes the data received from the parent window message.
     * @param data
     */
    initData(data: MessageInitData): OptionsManager$1;
    /**
     * Getting application option
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/options/bx24-app-option-get.html
     */
    appGet(option: string): any;
    /**
     * Updates application data through the parent window
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/options/bx24-app-option-set.html
     */
    appSet(option: string, value: any): Promise<void>;
    /**
     * Getting user option
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/options/bx24-user-option-get.html
     */
    userGet(option: string): any;
    /**
     * Updates user data through the parent window
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/options/bx24-user-option-set.html
     */
    userSet(option: string, value: any): Promise<void>;
}

type SelectedUser = {
    /**
     * user identifier
     */
    id: NumberString;
    /**
     * formatted username
     */
    name: string;
    photo: string;
    position: string;
    url: string;
    /**
     * The flag indicates that the selected user is a subordinate of the current user
     */
    sub: boolean;
    /**
     * The flag indicates that the selected user is the manager of the current user
     */
    sup: boolean;
};
type SelectedAccess = {
    /**
     * access permission identifier. Examples of identifiers:
     * - U1 — user with identifier 1
     * - IU1 — employees with identifier 1
     * - DR2 — all department and subdepartment employees with identifier 2
     * - D6 — all department employees with identifier 6
     * - G2 — group with identifier 2 (all visitors)
     * - SG4 — social network group with identifier 4
     * - AU — all authorized users
     * - CR — current user
     */
    id: `AU` | `CR` | `U${number}` | `IU${number}` | `DR${number}` | `D${number}` | `G${number}` | `SG${number}`;
    /**
     * name of the access permission
     */
    name: string;
};
type SelectCRMParamsEntityType = 'lead' | 'contact' | 'company' | 'deal' | 'quote';
type SelectCRMParamsValue = {
    lead?: number[];
    contact?: number[];
    company?: number[];
    deal?: number[];
    quote?: number[];
};
type SelectCRMParams = {
    /**
     * Which types of objects to display in the dialog. Possible values:
     * - lead — Leads
     * - contact — Contacts
     * - company — Companies
     * - deal — Deals
     * - quote — Estimates
     */
    entityType: SelectCRMParamsEntityType[];
    /**
     * Whether multiple objects can be selected. Default is `false`
     */
    multiple: boolean;
    /**
     * Which objects to initially add to the selected in the dialog. Works only if `multiple = true`
     */
    value?: SelectCRMParamsValue;
};
type SelectedCRMEntity = {
    id: string;
    type: SelectCRMParamsEntityType;
    place: string;
    title: string;
    desc: string;
    url: string;
};
type SelectedCRM = {
    lead?: (SelectedCRMEntity & {
        id: `L_${number}`;
    })[];
    contact?: (SelectedCRMEntity & {
        id: `C_${number}`;
        image: string;
    })[];
    company?: (SelectedCRMEntity & {
        id: `CO_${number}`;
        image: string;
    })[];
    deal?: (SelectedCRMEntity & {
        id: `D_${number}`;
    })[];
    quote?: (SelectedCRMEntity & {
        id: `Q_${number}`;
    })[];
};
/**
 * Select dialog manager
 *
 * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-dialogues/index.html
 */
declare class DialogManager {
    #private;
    constructor(messageManager: MessageManager);
    /**
     * Method displays the standard single user selection dialog
     * It only shows company employees
     *
     * @return {Promise<null|SelectedUser>}
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-dialogues/bx24-select-user.html
     */
    selectUser(): Promise<null | SelectedUser>;
    /**
     * Method displays the standard multiple user selection dialog
     * It only shows company employees
     *
     * @return {Promise<SelectedUser[]>}
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-dialogues/bx24-select-users.html
     */
    selectUsers(): Promise<SelectedUser[]>;
    /**
     * @deprecated
     * Method displays a standard access permission selection dialog
     *
     * @param {string[]} blockedAccessPermissions
     * @return {Promise<SelectedAccess[]>}
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-dialogues/bx24-select-access.html
     */
    selectAccess(blockedAccessPermissions?: string[]): Promise<SelectedAccess[]>;
    /**
     * @deprecated
     * Method invokes the system dialog for selecting a CRM entity
     *
     * @param {SelectCRMParams} params
     * @return {Promise<SelectedCRM>}
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-dialogues/bx24-select-crm.html
     */
    selectCRM(params?: SelectCRMParams): Promise<SelectedCRM>;
}

/**
 * Sliders Manager
 */
declare class SliderManager {
    #private;
    constructor(appFrame: AppFrame, messageManager: MessageManager);
    /**
     * Returns the URL relative to the domain name and path
     */
    getUrl(path?: string): URL;
    /**
     * Get the account address BX24
     */
    getTargetOrigin(): string;
    /**
     * When the method is called, a pop-up window with the application frame will be opened.
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-open-application.html
     */
    openSliderAppPage(params?: any): Promise<any>;
    /**
     * The method closes the open modal window with the application
     *
     * @return {Promise<void>}
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-close-application.html
     */
    closeSliderAppPage(): Promise<void>;
    /**
     * Opens the specified path inside the portal in the slider.
     * @param {URL} url
     * @param {number} width - Number in the range from 1640 to 1200, from 1200 to 950, from 950 to 900, from 900 ...
     * @return {Promise<StatusClose>}
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-open-path.html
     * @memo /^\/(crm\/(deal|lead|contact|company|type)|marketplace|company\/personal\/user\/[0-9]+|workgroups\/group\/[0-9]+)\//
     */
    openPath(url: URL, width?: number): Promise<StatusClose>;
    /**
     * @deprecated
     * @param params
     */
    showAppForm(params: any): Promise<void>;
}

/**
 * Placement Manager
 *
 * @see https://apidocs.bitrix24.com/api-reference/widgets/ui-interaction/index.html
 * @see https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=99&CHAPTER_ID=02535&LESSON_PATH=8771.5380.2535
 */
declare class PlacementManager {
    #private;
    constructor();
    /**
     * Initializes the data received from the parent window message.
     * @param data
     */
    initData(data: MessageInitData): PlacementManager;
    get title(): string;
    get isDefault(): boolean;
    get options(): any;
    get isSliderMode(): boolean;
}

/**
 * B24 Manager. Replacement api.bitrix24.com
 *
 * @link https://api.bitrix24.com/api/v1/
 * @see /bitrix/js/rest/applayout.js
 */
declare class B24Frame extends AbstractB24 implements TypeB24 {
    #private;
    constructor(queryParams: B24FrameQueryParams);
    setLogger(logger: LoggerBrowser): void;
    get isFirstRun(): boolean;
    get isInstallMode(): boolean;
    get parent(): ParentManager;
    get auth(): AuthActions;
    get slider(): SliderManager;
    get placement(): PlacementManager;
    get options(): OptionsManager$1;
    get dialog(): DialogManager;
    init(): Promise<void>;
    /**
     * Destructor.
     * Removes an event subscription
     */
    destroy(): void;
    /**
     * Signals that the installer or application setup has finished running.
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-functions/bx24-install-finish.html
     */
    installFinish(): Promise<any>;
    /**
     * Get the account address BX24 ( https://name.bitrix24.com )
     */
    getTargetOrigin(): string;
    /**
     * Get the account address BX24 with Path ( https://name.bitrix24.com/rest )
     */
    getTargetOriginWithPath(): string;
    /**
     * Returns the sid of the application relative to the parent window like this `9c33468728e1d2c8c97562475edfd96`
     */
    getAppSid(): string;
    /**
     * Returns the localization of the B24 interface
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-get-lang.html
     */
    getLang(): B24LangList;
}

/**
 * Authorization Manager
 */
declare class AuthManager implements AuthActions {
    #private;
    constructor(appFrame: AppFrame, messageManager: MessageManager);
    /**
     * Initializes the data received from the parent window message.
     * @param data
     */
    initData(data: MessageInitData): AuthManager;
    /**
     * Returns authorization data
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-functions/bx24-get-auth.html
     */
    getAuthData(): false | AuthData;
    /**
     * Updates authorization data through the parent window
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/system-functions/bx24-refresh-auth.html
     */
    refreshAuth(): Promise<AuthData>;
    getUniq(prefix: string): string;
    /**
     * Determines whether the current user has administrator rights
     *
     * @link https://apidocs.bitrix24.com/api-reference/bx24-js-sdk/additional-functions/bx24-is-admin.html
     */
    get isAdmin(): boolean;
}

declare abstract class AbstractHelper {
    protected _b24: TypeB24;
    protected _logger: null | LoggerBrowser;
    protected _data: any;
    constructor(b24: TypeB24);
    setLogger(logger: LoggerBrowser): void;
    getLogger(): LoggerBrowser;
    /**
     * Initializes the data received
     * @param data
     */
    initData(data: any): Promise<void>;
    abstract get data(): any;
}

declare class ProfileManager extends AbstractHelper {
    protected _data: null | TypeUser;
    /**
     * @inheritDoc
     */
    initData(data: TypeUser): Promise<void>;
    get data(): TypeUser;
}

declare class AppManager extends AbstractHelper {
    protected _data: null | TypeApp;
    /**
     * @inheritDoc
     */
    initData(data: TypeApp): Promise<void>;
    get data(): TypeApp;
    get statusCode(): string;
}

declare class PaymentManager extends AbstractHelper {
    protected _data: null | TypePayment;
    /**
     * @inheritDoc
     */
    initData(data: TypePayment): Promise<void>;
    get data(): TypePayment;
}

declare class LicenseManager extends AbstractHelper {
    protected _data: null | TypeLicense;
    /**
     * @inheritDoc
     */
    initData(data: TypeLicense): Promise<void>;
    get data(): TypeLicense;
    /**
     * Set RestrictionManager params by license
     * @link https://apidocs.bitrix24.com/api-reference/common/system/app-info.html
     */
    makeRestrictionManagerParams(): void;
}

type CurrencyFormatInit = {
    DECIMALS: NumberString;
    DEC_POINT: string;
    FORMAT_STRING: string;
    FULL_NAME: string;
    HIDE_ZERO: BoolString;
    THOUSANDS_SEP?: string;
    THOUSANDS_VARIANT: string;
};
type CurrencyInit = {
    AMOUNT: NumberString;
    AMOUNT_CNT: NumberString;
    BASE: BoolString;
    CURRENCY: string;
    DATE_UPDATE: ISODate;
    DECIMALS: NumberString;
    DEC_POINT: string;
    FORMAT_STRING: string;
    FULL_NAME: string;
    LID: string;
    SORT: NumberString;
    THOUSANDS_SEP?: string;
    LANG?: Record<string, CurrencyFormatInit>;
};
type CurrencyInitData = {
    currencyBase: string;
    currencyList: CurrencyInit[];
};
type CurrencyData = {
    currencyBase: string;
    currencyList: Map<string, Currency>;
};
declare class CurrencyManager extends AbstractHelper {
    /**
     * @inheritDoc
     */
    initData(data: CurrencyInitData): Promise<void>;
    loadData(): Promise<void>;
    get data(): CurrencyData;
    setBaseCurrency(currencyBase: string): void;
    get baseCurrency(): string;
    setCurrencyList(list?: CurrencyInit[]): void;
    getCurrencyFullName(currencyCode: string, langCode: string): string;
    getCurrencyLiteral(currencyCode: string, langCode?: string): string;
    get currencyList(): string[];
    format(value: number, currencyCode: string, langCode: string): string;
}

declare class OptionsManager extends AbstractHelper {
    protected _data: Map<string, any>;
    protected _type: 'app' | 'user';
    static getSupportTypes(): TypeOption[];
    static prepareArrayList(list: any): any[];
    constructor(b24: TypeB24, type: 'app' | 'user');
    get data(): Map<string, any>;
    reset(): void;
    /**
     * @inheritDoc
     */
    initData(data: any): Promise<void>;
    getJsonArray(key: string, defValue?: any[]): any[];
    getJsonObject(key: string, defValue?: object): object;
    getFloat(key: string, defValue?: number): number;
    getInteger(key: string, defValue?: number): number;
    getBoolYN(key: string, defValue?: boolean): boolean;
    getBoolNY(key: string, defValue?: boolean): boolean;
    getString(key: string, defValue?: string): string;
    getDate(key: string, defValue?: null | DateTime): null | DateTime;
    encode(value: any): string;
    decode(data: string, defaultValue: any): any;
    protected getMethodSave(): string;
    save(options: any, optionsPull?: {
        moduleId: string;
        command: string;
        params: any;
    }): Promise<Result>;
}

/**
 * A universal class that is used to manage the initial application data
 */
declare class B24HelperManager {
    private readonly _b24;
    protected _logger: null | LoggerBrowser;
    private _isInit;
    private _profile;
    private _app;
    private _payment;
    private _license;
    private _currency;
    private _appOptions;
    private _userOptions;
    private _b24PullClient;
    private _pullClientUnSubscribe;
    private _pullClientModuleId;
    constructor(b24: TypeB24);
    setLogger(logger: LoggerBrowser): void;
    getLogger(): LoggerBrowser;
    destroy(): void;
    loadData(dataTypes?: LoadDataType[]): Promise<void>;
    private parseUserData;
    private parseAppData;
    private parsePaymentData;
    private parseLicenseData;
    private parseCurrencyData;
    private parseOptionsData;
    get isInit(): boolean;
    get forB24Form(): TypeB24Form;
    /**
     * Get the account address BX24 (https://name.bitrix24.com)
     */
    get hostName(): string;
    get profileInfo(): ProfileManager;
    get appInfo(): AppManager;
    get paymentInfo(): PaymentManager;
    get licenseInfo(): LicenseManager;
    get currency(): CurrencyManager;
    get appOptions(): OptionsManager;
    get userOptions(): OptionsManager;
    get isSelfHosted(): boolean;
    /**
     * Returns the increment step of fields of type ID
     * @memo in a cloud step = 2 in box step = 1
     *
     * @returns {number}
     */
    get primaryKeyIncrementValue(): number;
    /**
     * Defines specific URLs for a Bitrix24 box or cloud
     */
    get b24SpecificUrl(): Record<keyof typeof TypeSpecificUrl, string>;
    usePullClient(prefix?: string, userId?: number): B24HelperManager;
    private initializePullClient;
    subscribePullClient(callback: (message: TypePullMessage) => void, moduleId?: string): B24HelperManager;
    startPullClient(): void;
    getModuleIdPullClient(): string;
    private _destroyPullClient;
    private ensureInitialized;
}

declare const useB24Helper: () => {
    initB24Helper: ($b24: TypeB24, dataTypes?: LoadDataType[]) => Promise<B24HelperManager>;
    isInitB24Helper: () => boolean;
    destroyB24Helper: () => void;
    getB24Helper: () => B24HelperManager;
    usePullClient: () => void;
    useSubscribePullClient: (callback: (message: TypePullMessage) => void, moduleId?: string) => void;
    startPullClient: () => void;
};

/**
 * @todo fix logic for _loggingEnabled
 */
declare class PullClient implements ConnectorParent {
    private _logger;
    private _restClient;
    private _status;
    private _context;
    private readonly _guestMode;
    private readonly _guestUserId;
    private _userId;
    private _configGetMethod;
    private _getPublicListMethod;
    private _siteId;
    private _enabled;
    private _unloading;
    private _starting;
    private _debug;
    private _connectionAttempt;
    private _connectionType;
    private _reconnectTimeout;
    private _restartTimeout;
    private _restoreWebSocketTimeout;
    private _skipStorageInit;
    private _skipCheckRevision;
    private _subscribers;
    private _watchTagsQueue;
    private _watchUpdateInterval;
    private _watchForceUpdateInterval;
    private _configTimestamp;
    private _session;
    private _connectors;
    private _isSecure;
    private _config;
    private _storage;
    private _sharedConfig;
    private _channelManager;
    private _jsonRpcAdapter;
    /**
     * @depricate
     */
    private _checkInterval;
    private _offlineTimeout;
    private _watchUpdateTimeout;
    private _pingWaitTimeout;
    private _isManualDisconnect;
    private _loggingEnabled;
    private _onPingTimeoutHandler;
    private _userStatusCallbacks;
    private _connectPromise;
    private _startingPromise;
    /**
     * @param params
     */
    constructor(params: TypePullClientParams);
    setLogger(logger: LoggerBrowser): void;
    getLogger(): LoggerBrowser;
    destroy(): void;
    private init;
    get connector(): null | TypeConnector;
    get status(): PullStatus;
    /**
     * @param status
     */
    set status(status: PullStatus);
    get session(): TypePullClientSession;
    /**
     * Creates a subscription to incoming messages.
     *
     * @param {TypeSubscriptionOptions | TypeSubscriptionCommandHandler} params
     * @returns { () => void } - Unsubscribe callback function
     */
    subscribe(params: TypeSubscriptionOptions | TypeSubscriptionCommandHandler): () => void;
    /**
     * @param {TypeSubscriptionCommandHandler} handler
     * @returns {() => void} - Unsubscribe callback function
     */
    private attachCommandHandler;
    /**
     * @param config
     */
    start(config?: null | (TypePullClientConfig & {
        skipReconnectToLastSession?: boolean;
    })): Promise<boolean>;
    /**
     * @param disconnectCode
     * @param disconnectReason
     */
    restart(disconnectCode?: number | CloseReasons, disconnectReason?: string): void;
    stop(disconnectCode?: number | CloseReasons, disconnectReason?: string): void;
    reconnect(disconnectCode: number | CloseReasons, disconnectReason: string, delay?: number): void;
    /**
     * @param lastMessageId
     */
    setLastMessageId(lastMessageId: string): void;
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
    sendMessage(users: number[], moduleId: string, command: string, params: any, expiry?: number): Promise<any>;
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
    sendMessageToChannels(publicChannels: string[], moduleId: string, command: string, params: any, expiry?: number): Promise<any>;
    /**
     * @param debugFlag
     */
    capturePullEvent(debugFlag?: boolean): void;
    /**
     * @param loggingFlag
     */
    enableLogging(loggingFlag?: boolean): void;
    /**
     * Returns list channels that the connection is subscribed to.
     *
     * @returns {Promise}
     */
    listChannels(): Promise<any>;
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
    getUsersLastSeen(userList: number[]): Promise<Record<number, number>>;
    /**
     * Pings server.
     * In case of success promise will be resolved, otherwise - rejected.
     *
     * @param {number} timeout Request timeout in seconds
     * @returns {Promise}
     */
    ping(timeout?: number): Promise<void>;
    /**
     * @param userId {number}
     * @param callback {UserStatusCallback}
     * @returns {Promise}
     */
    subscribeUserStatusChange(userId: number, callback: UserStatusCallback): Promise<void>;
    /**
     * @param {number} userId
     * @param {UserStatusCallback} callback
     * @returns {Promise}
     */
    unsubscribeUserStatusChange(userId: number, callback: UserStatusCallback): Promise<void>;
    getRevision(): number | null;
    getServerVersion(): number;
    getServerMode(): string | null;
    getConfig(): null | TypePullClientConfig;
    getDebugInfo(): any;
    /**
     * @process
     * @param connectionType
     */
    getConnectionPath(connectionType: ConnectionType): string;
    /**
     * @process
     */
    getPublicationPath(): string;
    isConnected(): boolean;
    isWebSocketSupported(): boolean;
    isWebSocketAllowed(): boolean;
    isWebSocketEnabled(): boolean;
    isPublishingSupported(): boolean;
    isPublishingEnabled(): boolean;
    isProtobufSupported(): boolean;
    isJsonRpc(): boolean;
    isSharedMode(): boolean;
    /**
     * @param {TypePullClientEmitConfig} params
     * @returns {boolean}
     */
    private emit;
    /**
     * @process
     *
     * @param message
     */
    private broadcastMessage;
    /**
     * @process
     *
     * @param messages
     */
    private broadcastMessages;
    /**
     * Sends batch of messages to the multiple public channels.
     *
     * @param messageBatchList Array of messages to send.
     * @return void
     */
    private sendMessageBatch;
    /**
     * @param messageBatchList
     * @param publicIds
     */
    private encodeMessageBatch;
    /**
     * @memo fix return type
     * @param users
     * @param publicIds
     */
    private createMessageReceivers;
    /**
     * @param userId
     * @param isOnline
     */
    private emitUserStatusChange;
    private restoreUserStatusSubscription;
    /**
     * @param logTag
     */
    private loadConfig;
    /**
     * @param config
     */
    private isConfigActual;
    private startCheckConfig;
    private stopCheckConfig;
    private checkConfig;
    /**
     * @param config
     * @param allowCaching
     */
    private setConfig;
    private setPublicIds;
    /**
     * @param serverRevision
     */
    private checkRevision;
    private disconnect;
    private restoreWebSocketConnection;
    /**
     * @param connectionDelay
     */
    private scheduleReconnect;
    private scheduleRestoreWebSocketConnection;
    /**
     * @returns {Promise}
     */
    private connect;
    /**
     * @param disconnectCode
     * @param disconnectReason
     * @param restartDelay
     */
    private scheduleRestart;
    /**
     * @param messageFields
     */
    private handleRpcIncomingMessage;
    /**
     * @param events
     */
    private handleIncomingEvents;
    /**
     * @param event
     */
    private updateSessionFromEvent;
    /**
     * @process
     *
     * @param command
     * @param message
     */
    private handleInternalPullEvent;
    /**
     * @param response
     */
    private onIncomingMessage;
    private onLongPollingOpen;
    /**
     * @param response
     */
    private onLongPollingDisconnect;
    /**
     * @param error
     */
    private onLongPollingError;
    /**
     * @param response
     */
    private onWebSocketBlockChanged;
    private onWebSocketOpen;
    /**
     * @param response
     */
    private onWebSocketDisconnect;
    /**
     * @param error
     */
    private onWebSocketError;
    /**
     * @param pullEvent
     */
    private extractMessages;
    /**
     * @param pullEvent
     */
    private extractProtobufMessages;
    /**
     * @param pullEvent
     */
    private extractPlainTextMessages;
    /**
     * Converts message id from byte[] to string
     * @param {Uint8Array} encodedId
     * @return {string}
     */
    private decodeId;
    /**
     * Converts message id from hex-encoded string to byte[]
     * @param {string} id Hex-encoded string.
     * @return {Uint8Array}
     */
    private encodeId;
    private onOffline;
    private onOnline;
    private onBeforeUnload;
    /**
     * @param status
     * @param delay
     */
    private sendPullStatusDelayed;
    /**
     * @param status
     */
    private sendPullStatus;
    /**
     * @memo if private?
     * @param tagId
     * @param force
     */
    private extendWatch;
    /**
     * @param force
     */
    private updateWatch;
    /**
     * @param tagId
     */
    private clearWatch;
    private onJsonRpcPing;
    private updatePingWaitTimeout;
    private clearPingWaitTimeout;
    private onPingTimeout;
    /**
     * Returns reconnect delay in seconds
     *
     * @param attemptNumber
     * @return {number}
     */
    private getConnectionAttemptDelay;
    /**
     * @param mid
     */
    private checkDuplicate;
    private trimDuplicates;
    /**
     * @param message
     */
    private logMessage;
    /**
     * @param message
     * @param force
     */
    private logToConsole;
    /**
     * @param message
     */
    private addMessageToStat;
    /**
     * @param text
     */
    private showNotification;
    /**
     * @memo may be need to use onCustomEvent
     * @memo ? force
     */
    private onCustomEvent;
}

declare function initializeB24Frame(): Promise<B24Frame>;

export { AbstractB24, AjaxError, type AjaxErrorParams, type AjaxQuery, AjaxResult, type AjaxResultParams, type AnswerError, AppFrame, type AuthActions, type AuthData, AuthHookManager, AuthManager, B24Frame, type B24FrameQueryParams, B24Hook, type B24HookParams, B24LangList, PullClient as B24PullClientManager, type BatchPayload, type BoolString, Browser, CloseReasons, type CommandHandlerFunctionV1, type CommandHandlerFunctionV2, ConnectionType, type ConnectorCallbacks, type ConnectorConfig, type ConnectorParent, type Currency, type CurrencyFormat, DataType, DialogManager, EnumAppStatus, EnumCrmEntityType, EnumCrmEntityTypeId, type Fields, type GenderString, type GetPayload, type IPlacementUF, type IRequestIdGenerator, type IResult, type ISODate, type JsonRpcRequest, type ListPayload, ListRpcError, LoadDataType, LoggerBrowser, LoggerType, LsKeys, MessageCommands, type MessageInitData, MessageManager, type MultiField, type MultiFieldArray, type NumberString, OptionsManager$1 as OptionsManager, ParentManager, type Payload, type PayloadTime, PlacementManager, type PlacementViewMode, PullStatus, type RefreshAuthData, RestrictionManagerParamsBase, RestrictionManagerParamsForEnterprise, Result, type RpcCommand, type RpcCommandResult, type RpcError, RpcMethod, type RpcRequest, type SelectCRMParams, type SelectCRMParamsEntityType, type SelectCRMParamsValue, type SelectedAccess, type SelectedCRM, type SelectedCRMEntity, type SelectedUser, type SendParams, SenderType, ServerMode, type SharedConfigCallbacks, type SharedConfigParams, SliderManager, type StatusClose, StatusDescriptions, type StorageManagerParams, SubscriptionType, SystemCommands, Text, Type, type TypeApp, type TypeB24, type TypeB24Form, type TypeChanel, type TypeChannelManagerParams, type TypeConnector, type TypeDescriptionError, type TypeEnumAppStatus, type TypeHttp, type TypeJsonRpcConfig, type TypeLicense, TypeOption, type TypePayment, type TypePublicIdDescriptor, type TypePullClientConfig, type TypePullClientEmitConfig, type TypePullClientMessageBatch, type TypePullClientMessageBody, type TypePullClientParams, type TypePullClientSession, type TypePullMessage, type TypeRestrictionManagerParams, type TypeRpcResponseAwaiters, type TypeSessionEvent, TypeSpecificUrl, type TypeStorageManager, type TypeSubscriptionCommandHandler, type TypeSubscriptionOptions, type TypeUser, type UserBasic, type UserBrief, type UserFieldType, type UserStatusCallback, initializeB24Frame, useB24Helper, useFormatter };
