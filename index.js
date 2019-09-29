#!/usr/env node

const finder = require('findit')(process.argv[2] || '.');
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
            console.log(file);
        }
    });
});


