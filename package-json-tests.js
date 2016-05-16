//import { describe, it } from 'mocha';
// import { spy } from 'sinon';
import { expect } from 'chai';

global._PACKAGE_JSON_TEST_MODE = 1;
const packageJson = require('./package-json.js').default;
delete global._PACKAGE_JSON_TEST_MODE;

const exposed = packageJson._expose();

function deathByMutation(obj) {
  for (let k in obj)
    delete obj[k];
}

// would be better to restore state after
describe('package-json', () => {

  afterEach(() => {
    deathByMutation(exposed.sectionChangeCallbacks);
    deathByMutation(exposed.entireChangeCallbacks);
  });

  it('sets and gets for testing', () => {
    var obj = { test: 1 };
    exposed.setInitial(obj);
    expect(packageJson.getEntireConfig('test')).to.equal(obj);
    expect(packageJson.getPackageConfig('test')).to.equal(1);
    expect(exposed.entireChangeCallbacks.test).to.equal(false);
    expect(exposed.sectionChangeCallbacks.test).to.equal(false);
  });

  it('sectionChanged', () => {
    const initial = { test: { a: 1 } };
    exposed.setInitial(initial);

    var wasChanged = false;
    const section = packageJson.getPackageConfig('test', (old, next) => {
        wasChanged = next;
        return true;
    });

    // initial get
    expect(section).to.equal(initial.test);

    const unrelatedChanged = { test: { a: 1 }, unrelated: 2 };
    exposed.updateWith(unrelatedChanged);
    expect(wasChanged).to.be.false;

    const next = { test: { a: 2 } };
    exposed.updateWith(next);
    expect(wasChanged).to.equal(next.test);
  });

  /*
  it('unhandled entire change quits', () => {
    exposed.setInitial({ test: { a: 1 } });

    var message;
    exposed.local.exit = (msg) => { message = msg; return false; };
    packageJson.getEntireConfig('test');

    exposed.updateWith({ test: { a: 2 } });
    expect(message).to.not.be.undefined;
    expect(message).to.equal("Your package.json was updated and changes to the following sections could not be accepted: test\nPlease restart Meteor");
  });
  */

  it('unhandled section change quits', () => {
    exposed.setInitial({ test: { a: 1 } });

    var message;
    exposed.setExit(msg => message = msg);
    packageJson.getPackageConfig('test');

    exposed.updateWith({ test: { a: 1 }, unrelated: 2 });
    expect(message).to.be.undefined;

    exposed.updateWith({ test: { a: 2 } });
    expect(message).to.not.be.undefined;
    expect(message).to.equal("Your package.json was updated and changes to the following sections could not be accepted: test\nPlease restart Meteor");
  });

  it('passes {} for undefined section', () => {
    var prev, next, nextConfig = { test: { a: 1 } };
    exposed.setInitial({});

    var test = packageJson.getPackageConfig('test', (_prev, _next) => {
      prev = _prev; next = _next; return true;
    });

    // test section undefined, so should return {}
    expect(test).to.deep.equal({});

    exposed.updateWith(nextConfig);
    expect(prev).to.deep.equal({});
    expect(next).to.equal(nextConfig.test);

    exposed.updateWith({});
    expect(next).to.deep.equal({});
  });

});
