#!/usr/env node

const finder = require('findit')('.');
const fs = require('fs');
const path = require('path');

const EXCLUDE_DIRS = ['node_modules', '.git'];
const VALID_EXTENSIONS = ['.css$', '.scss$', '.sass$', '.js$'];

finder.on('directory', (directory, stat, stop) => {
    const base = path.basename(directory);
    if (EXCLUDE_DIRS.includes(base)) { 
        stop();
    }
});

finder.on('file', (file, stat) => {
    VALID_EXTENSIONS.map(pattern => {
        if (file.match(pattern)) {
            process(file);
        }
    });
});

function process(file) {
   const contents = fs.readFileSync(file, 'utf8');
   const lines = contents.split('\n');
   const matched = filter(lines);
}

function filter(lines) {
   return lines
    .map((line, index) => ({line, index}))
    .filter(({line}) => line && line.match(/(z-index|zIndex)/)); 
}

