"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthType = exports.createRoute = exports.QueryType = void 0;
var QueryType;
(function (QueryType) {
    QueryType["String"] = "string";
    QueryType["Number"] = "number";
    QueryType["Boolean"] = "boolean";
    QueryType["Image"] = "image";
})(QueryType || (exports.QueryType = QueryType = {}));
;
function createRoute(input) { return input; }
exports.createRoute = createRoute;
;
var AuthType;
(function (AuthType) {
    AuthType[AuthType["None"] = 0] = "None";
    AuthType[AuthType["Min"] = 1] = "Min";
    AuthType[AuthType["Full"] = 2] = "Full";
})(AuthType || (exports.AuthType = AuthType = {}));
;
//# sourceMappingURL=types.js.map