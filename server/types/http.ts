/**
 * @brief Type definition for HTTP methods.
 * @description This type defines the valid HTTP methods that can be used in requests.
 * It includes common methods such as GET, POST, PUT, DELETE, and OPTIONS.
 * This type can be used to enforce type safety in functions that handle HTTP requests.
 */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | 'HEAD' | (string & {});

/**
 * @brief Type definition for HTTP status codes.
 * @description This type defines the valid HTTP status codes that can be returned by a server.
 * It includes success codes (2xx), client error codes (4xx), and server error codes (5xx).
 * This type ensures type safety when working with HTTP response status codes.
 */
export type HTTPStatusCode =
  | 200 // OK
  | 201 // Created
  | 204 // No Content
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 409 // Conflict
  | 422 // Unprocessable Entity
  | 500 // Internal Server Error
  | 502 // Bad Gateway
  | 503 // Service Unavailable
  | (number & {});

/**
 * @brief Type definition for HTTP content types.
 * @description This type defines common MIME types used in HTTP content-type headers.
 * It provides type safety for content type validation and ensures proper media type handling.
 * These are the most commonly used content types in web applications.
 */
export type HTTPContentType =
  | 'application/json'
  | 'application/xml'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/html'
  | 'text/plain'
  | 'text/css'
  | 'text/javascript'
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'image/webp'
  | 'video/mp4'
  | 'video/webm'
  | 'audio/mpeg'
  | 'audio/wav'
  | 'application/pdf'
  | 'application/octet-stream'
  | (string & {});

/**
 * @brief Type definition for HTTP headers.
 * @description This type defines common HTTP headers that can be used in requests and responses.
 * It includes headers for content type, authorization, caching, cookies, and more.
 * This type can be used to ensure type safety when working with HTTP headers in web applications.
 * These headers are commonly used in HTTP requests and responses.
 */
export type HTTPHeader =
  | 'Content-Type'
  | 'Authorization'
  | 'Accept'
  | 'User-Agent'
  | 'Cache-Control'
  | 'Cookie'
  | 'Set-Cookie'
  | 'X-Requested-With'
  | 'Origin'
  | 'Referer'
  | 'Host'
  | 'Connection'
  | 'Upgrade-Insecure-Requests'
  | 'Accept-Encoding'
  | 'Accept-Language'
  | 'DNT'
  | 'X-Forwarded-For'
  | 'X-Forwarded-Proto'
  | 'X-Forwarded-Host'
  | 'X-Forwarded-Port'
  | 'X-Forwarded-Server'
  | 'X-Real-IP'
  | 'X-Frame-Options'
  | 'Content-Security-Policy'
  | 'Strict-Transport-Security'
  | 'Referrer-Policy'
  | 'Permissions-Policy'
  | 'Feature-Policy'
  | 'Cross-Origin-Resource-Policy'
  | 'Cross-Origin-Embedder-Policy'
  | 'Cross-Origin-Opener-Policy'
  | 'Timing-Allow-Origin'
  | 'X-XSS-Protection'
  | 'X-Content-Type-Options'
  | 'Expect-CT'
  | 'Clear-Site-Data'
  | 'NEL'
  | 'Server-Timing'
  | 'Link'
  | 'X-Powered-By'
  | 'X-UA-Compatible'
  | 'Content-Disposition'
  | 'Content-Language'
  | 'Content-Encoding'
  | 'Content-Range'
  | 'Last-Modified'
  | 'ETag'
  | 'Accept-Ranges'
  | 'Allow'
  | 'Location'
  | 'Retry-After'
  | 'Vary'
  | 'X-Content-Duration'
  | 'X-Download-Options'
  | 'X-Permitted-Cross-Domain-Policies'
  | (string & {});

/**
 * @brief Type definition for HTTP origins.
 * @description This type defines valid HTTP origins that can be used in CORS requests.
 * It includes common origins such as localhost, specific ports, and protocols.
 * This type can be used to ensure type safety when configuring CORS policies in web applications.
 * These origins are commonly used in web applications for CORS configuration.
 */
export type HTTPOrigin =
  | '*'
  | 'null'
  | 'localhost'
  | `localhost:${number}`
  | 'http://localhost'
  | `http://localhost:${number}`
  | `http://${string}`
  | `https://${string}`
  | `${number}.${number}.${number}.${number}`
  | `${number}.${number}.${number}.${number}:${number}`
  | `http://${number}.${number}.${number}.${number}`
  | `http://${number}.${number}.${number}.${number}:${number}`
  | `https://${number}.${number}.${number}.${number}`
  | `https://${number}.${number}.${number}.${number}:${number}`
  | (string & {});
