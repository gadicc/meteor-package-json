# meteor-package-json

A helper for Meteor package authors who need info from the apps `package.json`.  Watches the file and has a callback for your package to accept changes to it's
relevant section, otherwise quits Meteor asking for the user to reboot.

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
expect(config).to.deep.equal({ "experimental: true "});
```

If the `john:doe` section is modified, Meteor will exit.  If any other part of the file is modified, nothing happens.

**Accepting Changes**

```js
const config = packageJson.getPackageConfig('john:doe', (prev, next) => {
  // prev !== next, guaranteed, else the function isn't called
  if (prev.experimental !== next.experiemnetal && next.experimental)
    enableExperimentalFeatures();

  // We could accept this change; no need to restart Meteor.
  return true;
});

// On initial load
if (config.experimental)
  enableExperimentalFeatures();
```

## API

* `packageJson.getPackageConfig('sectionName', [acceptHandler]);`

  * Returns the `sectionName` property from `package.json`.
  * If the properties in `sectionName` have *changed* (are not deeply equal), then, Meteor will quite if no `acceptHandler` is given, or if `acceptHandler(prevSection, newSection)` does not return `true`.

## Development && testing

`npm test` or with Wallaby.js.