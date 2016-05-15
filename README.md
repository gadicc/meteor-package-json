# meteor-package-json

A helper for Meteor package authors who need info from the apps `package.json`.  Watches the file and has a callback for your package to accept changes to it's
relevant section, otherwise quits Meteor asking for the user to reboot.

## API

For the examples below, assume we are developing `john:doe` and have the following `package.json`:

```js
{
  "john:doe": {
    "experimental": false
  }
}
```

**Quick Start**

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
});

// On initial load
if (config.experimental)
  enableExperimentalFeatures();
```

## Development && testing

`npm test` or with Wallaby.js.