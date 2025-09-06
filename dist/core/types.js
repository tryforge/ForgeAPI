"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthType = exports.QueryType = void 0;
exports.createRoute = createRoute;
var QueryType;
(function (QueryType) {
    QueryType["String"] = "string";
    QueryType["Number"] = "number";
    QueryType["Boolean"] = "boolean";
    QueryType["Image"] = "image";
})(QueryType || (exports.QueryType = QueryType = {}));
;
function createRoute(input) { return input; }
;
var AuthType;
(function (AuthType) {
    AuthType[AuthType["None"] = 0] = "None";
    AuthType[AuthType["Min"] = 1] = "Min";
    AuthType[AuthType["Full"] = 2] = "Full";
})(AuthType || (exports.AuthType = AuthType = {}));
;
//# sourceMappingURL=types.js.map