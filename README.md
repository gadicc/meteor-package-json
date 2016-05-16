# meteor-package-json

A helper for Meteor package authors who need info from the apps `package.json`.  Watches the file and has a callback for your package to accept changes to it's relevant section, otherwise quits Meteor asking for the user to restart.

## Quick Start

For the examples below, assume we are developing `john:doe` and have the following `package.json`:

```js
{
  "john:doe": {
    "experimental": false
  }
}
```

**Simple Fetch**

```js
const config = packageJson.getPackageConfig('john:doe');
expect(config).to.deep.equal({ experimental: true });
```

If the `john:doe` section is modified, Meteor will exit.  If any other part of the file is modified, nothing happens.  But it's even better if you can accept the changes to avoid a restart.

**Accepting Changes**

```js
// The callback below is only ever called if prev does not deep equal next
const config = packageJson.getPackageConfig('john:doe', (prev, next) => {
  if (prev.experimental !== next.experiemnetal) {
    enableExperimentalFeatures(next.experimental);
  }

  // We can accept this change; no need to restart Meteor.
  return true;
});

// On initial load
if (config.experimental)
  enableExperimentalFeatures(true);
```

## API

* `packageJson.getPackageConfig('sectionName', [acceptHandler]);`

  * Returns the `sectionName` property from `package.json`.
  * If the properties in `sectionName` have *changed* (are not deeply equal), then, Meteor will quite if no `acceptHandler` is given, or if `acceptHandler(prevSection, newSection)` does not return `true`.
  * For both the initial return and acceptHandler, if the section is undefined, an empty object (` {} `) will be returned, so no need to test for this in your   code.

## Development && testing

`npm test` or with Wallaby.js.
