import * as Fs from 'fs-extra';
import { ServerResponse, IncomingMessage } from 'http';
import mime from 'mime';
import AutoIndex from './autoIndex';

export async function pathType(path: string) {
  try {
    const stat = await Fs.promises.stat(path);
    if (stat.isFile()) return 'file';
    if (stat.isDirectory()) return 'directory';
  } catch (err: any) {
    console.error(err.message);
  }
  return null;
}

export function fileStream(req:IncomingMessage, res: ServerResponse, filepath: string) {
  res.writeHead(200, { 'Content-Type': req.headers['content-type'] || mime.getType(filepath) || 'application/octet-stream' });
  const rs = Fs.createReadStream(filepath);
  rs.pipe(res);
}

export function notFound(req:IncomingMessage, res: ServerResponse) {
  res.writeHead(404, { 'Content-Type': req.headers['content-type'] || 'text/plain' });
  res.end('<h1>Not Found</h1>');
}

export function response(req:IncomingMessage, res: ServerResponse, body: string, ext: string) {
  res.writeHead(200, { 'Content-Type': req.headers['content-type'] || mime.getType(ext) || 'text/plain' });
  res.write(body);
  res.end();
}

export async function autoIndex(
  req:IncomingMessage,
  res: ServerResponse,
  root:string,
  dir: string,
) {
  const body = await AutoIndex(root, dir);
  if (body) {
    res.writeHead(200, { 'Content-Type': req.headers['content-type'] || 'text/html' });
    res.write(body);
    res.end();
  } else {
    notFound(req, res);
  }
}
