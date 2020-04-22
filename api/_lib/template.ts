
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest, Theme } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/TTNorms-Regular.otf`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Spoof-Bold.otf`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/JetBrainsMono-Regular.woff2`).toString('base64');

function getCss(theme: Theme, fontSize: string) {
	let background = '#edfafa';
	let foreground = '#014451';
	let radial = '#edfafa';
    let shouldShowRadial = false;

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
        radial = 'dimgray';
    }
    if (theme === 'white') {
		background = 'white';
		foreground = 'black';
		radial = 'dimgray';
    }
    return `
    @font-face {
        font-family: 'Spoof';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/opentype;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'TTNorms';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/opentype;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'JetBrains Mono';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        ${shouldShowRadial ? `background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);` : ''}
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #805ad5;
        font-family: 'JetBrains Mono';
        white-space: pre-wrap;
        background-color: #f7fafc;
        border-radius: 4px;
        padding: 1px 4px;
        letter-spacing: -5px;
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Spoof;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: TTNorms, sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
	}
	.heading strong {
		font-family: Spoof, sans-serif;
	}`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images, widths, heights } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div>
            <div class="spacer">
            <div class="logo-wrapper">
                ${images.map((img, i) =>
                    getPlusSign(i) + getImage(img, widths[i], heights[i])
                ).join('')}
            </div>
            <div class="spacer">
            <div class="heading">${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width ='auto', height = '225') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}
