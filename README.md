# serxy
> serxy = ser(ver) + (pro)xy

Serve static files and support proxy setting.

## Insatll
```bash
npm i -g serxy
```

## Cli

#### Usage
```bash
serxy
```

#### Options
```
Usage: serxy [options]

Options:
  -v, --version                   Output the version number.
  -p, --port <PORT>               Listen on PORT (default: 8080)
  -d, --directory <DIRECTORY>     Serve the contents of DIRECTORY. (Default: `process.cwd()` )
  -i, --index <INDEXES>           Use the specified INDEX filename as the result when a directory is requested. (default:
                                  ["index.html","index.htm"])
  -ai, --auto-index               If the index file is not found will list the directory. (default: true)
  -P, --proxy <PATHNAME=>TARGET>  Set the proxy path.
                                  e.g. "/api=>http://example.com" will let `/api/foo` proxy to `http://example.com/foo`.
                                  Multiple use `,` separated.
  -co, --change-origin            Changes the origin of the host header to the proxy's URLs. (default: true)
  --cors                          Set CORS. (default: true)
```

## API

#### Usage
```js
import serxy from 'serxy';

serxy(options).then(() => console.log('Listening at', options.port);
```

#### Options
```ts
interface Options {
  // Listen on PORT 
  // default: `8080`
  port?: number;

  // Serve the contents of DIRECTORY. 
  // default: `process.cwd()`
  directory?: string;

  // Use the specified INDEX filename as the result when a directory is requested. 
  // default: `["index.html","index.htm"]`
  index?: string[];

  // If the index file is not found will list the directory. 
  // default: `true`
  autoIndex?: boolean;

  // Set the proxy path.
  // e.g. "/api=>http://example.com" will let `/api/foo` proxy to `http://example.com/foo`.
  // Multiple use `,` separated.
  proxy?: { pathname: string; target: string }[];

  // Changes the origin of the host header to the proxy's URLs. 
  // default: `true`
  changeOrigin?: boolean;

  // Set CORS.
  // default: true
  cors?: boolean;
}
```
