import template from 'lodash.template';
import * as Fs from 'fs-extra';
import * as Path from 'path';
import * as util from './util';
import indexTemplate from './template';

const complied = template(indexTemplate);

export default async function autoIndex(root: string, dir: string) {
  if (await Fs.pathExists(dir)) {
    const pathname = Path.relative(root, dir);
    const files = await Fs.readdir(dir);
    const list: { name: string; link: string; type: 'file' | 'directory' }[] = [];

    for (const el of files) {
      list.push({
        name: el,
        link: Path.join('/', pathname, el),
        type: (await util.pathType(Path.join(dir, el))) || 'file',
      });
    }

    const arr = pathname ? pathname.split(Path.sep) : [];
    arr.unshift('');

    const breadcrumbs = arr.map((el, index) => ({
      name: el || '~',
      link: arr.slice(0, index + 1).join('/') || '/',
      isCurrent: index === arr.length - 1,
    }));

    return complied({
      title: arr[arr.length - 1],
      files: list,
      breadcrumbs,
    });
  }
  return null;
}
