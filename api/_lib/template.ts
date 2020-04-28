
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest, Theme } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

function getCss(theme: Theme, fontSize: string) {
	let background = '#edfafa';
	let foreground = '#014451';
	let radial = '#edfafa';
	let shouldShowRadial = false;
	
	if (theme === 'brand_dark') {
		foreground = "#edfafa";
    	background = "#014451";
	}

    if (theme === 'black') {
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
    body {
        background: ${background};
        ${
          shouldShowRadial
            ? `background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);`
            : ""
        }
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        font-family: 'JetBrains Mono';
        background-color: ${['white', 'brand'].includes(theme) ? '#d5f5f6' : '#05505c'};
		line-height: ${sanitizeHtml(fontSize)};
		display: inline-block;
		border-radius: 1.25rem;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		white-space: nowrap;
		color: ${['white', 'brand'].includes(theme) ? '#047481' :'#d5f5f6'};
		font-weight: 400;
		vertical-align: baseline;
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
        color: ${foreground};
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
        font-family: 'TT Norms', sans-serif;
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
