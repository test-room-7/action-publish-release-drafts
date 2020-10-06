# action-publish-release-drafts [![Version][version-badge]][version-url] [![Lint status][workflow-badge]][workflow-url]

A GitHub action to publish release drafts on GitHub.

This task searches for a release draft with a given tag name. If the draft is found, the task attaches the tag (if it exists) to this release, then publishes the release.

## Usage

The action requires GitHub token for authentication.

### The workflow file

Here is an example of a workflow using `action-publish-release-drafts`:

```yml
name: Deploy
on:
    push:
        tags:
            - 'v*.*.*'
jobs:
    deploy:
        runs-on: ubuntu-latest
        steps:
            - name: Get version from ref
              id: get-version
              run: echo ::set-output name=VERSION::${GITHUB_REF/refs\/tags\//}
            - name: Publish release on GitHub
              uses: test-room-7/action-publish-release-drafts@v0
              with:
                  github-token: ${{ secrets.GITHUB_TOKEN }}
                  tag-name: ${{ steps.get-version.outputs.VERSION }}
```

### Example of basic usage

1. Create a new draft reserved for a new version, and name it in a semver format, e.g. `v0.1.0`.
2. Update a description of the draft during development, if neccessary.
3. When a new version is ready, push the tag to repository (`v0.1.0` in this case).
4. The action will be executed, and it will apply the `v0.1.0` tag to the draft, and will publish it.

### Inputs

#### Required inputs

-   `github-token`: GitHub token
-   `tag-name`: Tag name

## Development

```sh
# Install dependencies
> npm install

# Build the action
> npm run dist

# Lint project files
> npm run lint
```

Don't push dist files; they're updated automatically.

## License

Licensed under the [MIT License](./LICENSE.md).

[version-badge]: https://img.shields.io/github/v/release/test-room-7/action-publish-release-drafts
[version-url]: https://github.com/marketplace/actions/publish-release-drafts
[workflow-badge]: https://img.shields.io/github/workflow/status/test-room-7/action-publish-release-drafts/Lint?label=lint
[workflow-url]: https://github.com/test-room-7/action-publish-release-drafts/actions
