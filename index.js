#!/usr/env node

const finder = require('findit')('.');
const fs = require('fs');
const path = require('path');

const CONTEXT = 2;
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
    display(file, lines, filter(lines));
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
        contextBefore(show, lines, index);
        print(index + 1, line);
        contextAfer(show, lines, index);
    });
    console.log('');
}

function contextBefore(show, lines, index) {
    show.reverse().forEach(offset => {
        const {adjusted, position} = adjustedPostion(offset, index);
        if (position > 0) {
            print(position, lines[index - adjusted]);
        }
    });
}

function contextAfer(show, lines, index) {
    show.reverse().forEach(offset => {
        const {adjusted, position} = adjustedPostion(offset, index);
        if (position <= lines.length) {
            print(position, lines[index + adjusted]);
        }
    });
}

function adjustedPostion(offset, index) {
    return { 
        adjusted: offset + 1, 
        position: (index - (offset + 1)) + 1 
    };
}

function print(position, line) {
    console.log(`${position}: ${line}`);
}
