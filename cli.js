#!/usr/bin/env node

const unstr = require(".")
const Path = require('path');
const fs = require('fs');


const file = process.argv[2]
if (!file) {
  console.log(`${require("./package.json").name} <file> <language>`);
  console.log(`  <language> must be a language code (en for english, es for spanish, etc)`)
  console.log(require('util').inspect(unstr.languages, null, '  '))
  process.exit(0)
}
const language = process.argv[3] || "en"
//const table = process.argv[4] || file.replace(Path.extname(file), `_${language}.str`)
const table = process.argv[4] || `index_${language}.str`

const translations = unstr.loadSync(table, language, true)
const markdown = fs.readFileSync(file, 'utf8')

console.dir(unstr.replace(markdown, translations))
console.dir({language, translations});
