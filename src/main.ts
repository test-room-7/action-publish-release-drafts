import { error, getInput, info } from '@actions/core';

import { publishRelease } from './util';

function main(): void {
	const tag = getInput('tag-name', { required: true });

	publishRelease(tag)
		.then(() => {
			info(`Published ${tag}`);
		})
		.catch((err: Error) => {
			error(err.message);
		});
}

main();
