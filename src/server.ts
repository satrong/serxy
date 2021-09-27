import { createServer } from 'http';
import { URL } from 'url';
import * as Path from 'path';
import * as Fs from 'fs-extra';
import httpProxy from 'http-proxy';
import mime from 'mime';
import * as util from './util';

async function getIndexPath(cwd: string, index: string[]) {
  for (const item of index) {
    const filepath = Path.join(cwd, item);
    if (await Fs.pathExists(filepath)) {
      return filepath;
    }
  }
  return null;
}

export interface Options {
  port?: number;
  directory?: string;
  index?: string[];
  autoIndex?: boolean;
  proxy?: { pathname: string; target: string }[];
  changeOrigin?: boolean;
}

const proxyServer = httpProxy.createProxyServer({});

export default function startServer(options: Options = {}) {
  return new Promise((resolve, reject) => {
    const {
      port = 8080,
      directory,
      index = ['index.html', 'index.htm'],
      autoIndex = true,
      proxy = [],
      changeOrigin = true,
    } = options;

    const root = directory ? Path.resolve(directory) : process.cwd();

    const server = createServer(async (req, res) => {
      const uri = new URL(req.url || '', 'http://a.b');
      const pathname = decodeURIComponent(uri.pathname);

      const indexPage = async () => {
        const indexPath = await getIndexPath(root, index);
        if (indexPath) {
          return util.fileStream(req, res, indexPath);
        }

        const isNotFileRequest = !mime.getType(pathname);

        if (autoIndex && isNotFileRequest) {
          return util.autoIndex(req, res, root, root);
        }
        return util.notFound(req, res);
      };

      if (proxy.length > 0) {
        const matched = proxy.find((el) => pathname.startsWith(el.pathname));
        if (matched) {
          const proxyPathname = pathname.replace(matched.pathname, '/').replace(/^\/+/, '/');
          return proxyServer.web(req, res, {
            target: matched.target + proxyPathname,
            ignorePath: true,
            followRedirects: true,
            changeOrigin,
          });
        }
      }

      if (pathname === '/') {
        return indexPage();
      }

      const filepath = Path.join(root, pathname);
      const pathType = await util.pathType(filepath);

      if (pathType === 'file') {
        return util.fileStream(req, res, filepath);
      }

      if (pathType === 'directory') {
        return util.autoIndex(req, res, root, filepath);
      }

      return indexPage();
    });

    server.on('listening', resolve);

    server.on('error', reject);

    server.listen(port);
  });
}
