import { launch, Page } from 'puppeteer-core';
import { font } from 'chrome-aws-lambda';
import { getOptions } from './options';
import { FileType } from './types';
let _page: Page | null;

async function getPage(isDev: boolean) {
    if (_page) {
        return _page;
    }
	const options = await getOptions(isDev);
	await Promise.all([
		font('https://dev-assets.sitesauce.app/fonts/jetbrains/jetbrainsmono-regular.woff2'),
		font('https://dev-assets.sitesauce.app/fonts/spoof/Spoof-Bold.otf'),
		font('https://dev-assets.sitesauce.app/fonts/tt-norms/TTNorms-Regular.otf'),
	])
    const browser = await launch(options);
    _page = await browser.newPage();
    return _page;
}

export async function getScreenshot(url: string, type: FileType, isDev: boolean) {
    const page = await getPage(isDev);
    await page.setViewport({ width: 2048, height: 1170 });
    await page.goto(url);
    const file = await page.screenshot({ type });
    return file;
}
