import { getInput } from '@actions/core';
import { getOctokit, context } from '@actions/github';

const octokit = getOctokit(getInput('github-token', { required: true }));

interface ReleaseData {
	id: number;
	isDraft: boolean;
}

/**
 * Publish a release on GitHub.
 * Find a previously created draft release and make it as published one.
 *
 * @param tag Git tag
 */
export async function publishRelease(tag: string): Promise<void> {
	const { owner, repo } = context.repo;

	const release = await getReleaseByName(tag);
	if (!release.isDraft) {
		throw new Error(
			`Unable to create release: ${tag} is not a draft release`
		);
	}

	await octokit.repos.updateRelease({
		owner,
		repo,

		draft: false,
		tag_name: tag,
		release_id: release.id,
	});
}

/**
 * Get release information by a git tag.
 * Find a release with the same name as the given tag, and return release info.
 *
 * @param tag Git tag
 *
 * @return Promise resolved with release object
 */
async function getReleaseByName(tag: string): Promise<ReleaseData> {
	const { owner, repo } = context.repo;

	// `octokit.repos.getReleaseByTag` does not search draft releases, but we
	// can still find the target draft by listing all releases and looking for
	// the one where the tag matches

	const response = await octokit.repos.listReleases({ owner, repo });
	if (!response) {
		throw new Error(`${owner}/${repo} has no releases`);
	}

	const releases = response.data;
	for (const release of releases) {
		if (release.tag_name === tag) {
			return { id: release.id, isDraft: release.draft };
		}
	}

	throw new Error(`${owner}/${repo} has no ${tag} release`);
}
