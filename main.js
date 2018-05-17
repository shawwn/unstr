// ESM syntax is supported.
import Path from 'path'
import fs from 'fs'

export function replace (string, stringTable, shouldThrow=false) {
  if (typeof string !== 'string' || !string) return string
  if (typeof stringTable !== 'object' || !stringTable) return string

  // replace any %{StringTable_key} forms with the corresponding value
  var strExpr = /(\\*)\%\{([^}]+)\}/g
  var out = string.replace(strExpr, function (orig, esc, name) {
    //console.dir({orig, esc, name})
    esc = esc.length && esc.length % 2
    if (esc) return orig
    if (undefined === stringTable[name]) {
      if (shouldThrow) {
        throw new Error('Failed to interpolate string: ' + orig + ' for ' + require('util').inspect({string, stringTable}))
      }
      return orig;
    }

    return stringTable[name]
  })
  //console.dir({out, strExpr, string, stringTable});
  return out;
}

export function parse(str) {
  str = str.split(/[\/][\/][^\n]+[\n]/g).join("\n");
  str = str.split("\r\n").join("\n");
  str = str.split(/^[ \t]+/g).join("\n");
  const lines = str.split("\n");
  let result = Object.create(null);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const pos = line.search(/[ \t]+/);
    if (pos >= 0) {
      let key = line.substr(0, pos);
      let value = line.substr(pos).trim();
      value = value.split(/\\n/g).join("\n")
      value = value.split(/\\r/g).join("\r")
      value = value.split(/\\t/g).join("\t")
      value = value.split(/\\\\/g).join("\\")
      result[key] = value;
    }
  }
  return result;
}

export const languages = {
  armenian: "hy",
  chinese: "zh",
  czech: "cs",
  danish: "da",
  dutch: "nl",
  english: "en",
  esperanto: "eo",
  finnish: "fi",
  french: "fr",
  georgian: "ka",
  german: "de",
  greek: "el",
  italian: "it",
  japanese: "ja",
  korean: "ko",
  malay: "ms",
  kurdish: "ku",
  persian: "fa",
  polish: "pl",
  portuguese: "pt",
  romanian: "ro",
  russian: "ru",
  spanish: "es",
  swedish: "sv",
  tagalog: "tl",
  turkish: "tr",
  urdu: "ur",
}

export function loadSync(path, lang="en") {
  if (Object.values(languages).indexOf(lang) < 0) {
    throw new Error(`Invalid language ${lang}`);
  }
  const mergeFiles = [
    `${path}`,
    `${path}_${lang}`,
  ]
  let result = {};
  let loaded = false;
  for (let path of mergeFiles) {
    if (!path.toLowerCase().endsWith(".str")) {
      path = path + ".str";
    }
    if (isFile(path)) {
      _parseFile(path, result);
      loaded = true;
    }
  }
  if (loaded) {
    return result;
  }
  //throw new Error(`Couldn't load stringtable ${path} (language=${language})`)
}

function is(x) {
  return x != null;
}

function isFile(path) {
  return fs.existsSync(path) ?  fs.statSync(path).isFile() : false;
}

export function readFile(path) {
  if (isFile(path)) {
    return _readFile(path);
  }
}

function _readFile(path) {
  return fs.readFileSync(path, 'utf8');
}

function _parseFile(path, result) {
  return Object.assign(result||{}, parse(_readFile(path)));
}

function tryReadFile(path, ext="") {
  if (path.endsWith(ext)) {
    return readFile(path);
  }
  let x = readFile(path+ext);
  return is(x) ? x : readFile(path);
}
