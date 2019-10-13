#!/usr/env node

const finder = require('findit')('.');
const fs = require('fs');
const path = require('path');

const CONTEXT = 3;
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
    display(file, lines, matched);
}

function filter(lines) {
    return lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) => line && line.match(/(z-index|zIndex)/));
}

function display(file, lines, matched) {
    console.log(file);
    const show = [...Array(CONTEXT).keys()];
    matched.forEach(match => {
        const { line, index } = match;
        show.reverse().forEach(offset => {
            const adjustedOffset = offset + 1;
            const position = (index - adjustedOffset) + 1;
            if (position > 0) {
                print(position, lines[index - adjustedOffset]);
            }
        });
        print(index + 1, line);
        show.reverse().forEach(offset => {
            const adjustedOffset = offset + 1;
            const position = (index + adjustedOffset) + 1;
            if (position <= lines.length) {
                print(position, lines[index + adjustedOffset]);
            }
        });
    });
    console.log('');
}

function print(position, line) {
    console.log(`${position}: ${line}`);
}
