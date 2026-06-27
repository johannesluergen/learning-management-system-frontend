/**
 * This module is for certain http context tokens. Http context is an Angular
 * concept which might be imagined as a space for "sticky notes" for every individual
 * http request. Most importantly: This HTTP Context is not sent over the network/
 * to the server. Instead, it is just there internally for Angular to inspect and potentially
 * change behavior depending on Context Tokens' Values (Context Tokens can be imagined as
 * "labels" for those sticky notes.) This is especially useful for customized handling of
 * requests by interceptors, and replaces the less maintainable reading of a potentially dynamic
 * URL string within the interceptor.
 * For example, we have an interceptor that works on all incoming http responses if their
 * status code is 401 UNAUTHORIZED. However, when login endpoint was called and we get this,
 * we want to disable the global standard behavior because the login endpoint itself already
 * displays a useful error message.
 * 
 * OLD, WORSE WAY TO DO THIS: read URL within interceptor and determine if this was a login request
 * NEW, BETTER WAY: Simply attach an HTTP Context Token whenever you send a login request.
 */
import { HttpContextToken } from "@angular/common/http";

/**
 * Standard behavior is that we have an interceptor that on existence attaches a JWT Token
 * to all outgoing requests, and then should we receive a 401 UNAUTHORIZED response,
 * does some special handling (logs out, redirects, displays special error message)
 * However, for certain unprotected endpoints, like /login itself, we dont want this.
 */
export const SKIP_AUTH_WRAPPING = new HttpContextToken<boolean>(
    () => false
);