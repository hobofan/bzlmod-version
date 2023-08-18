import { expect, describe, it } from 'vitest'
import {
  equals,
  getMajor,
  getMinor,
  getPatch,
  getSatisfyingVersion, isCompatible,
  isGreaterThan,
  isLessThanRange, isSingleVersion, isStable, isValid, isVersion,
  matches, minSatisfyingVersion, sortVersions
} from "./index";

describe('modules/versioning/bazel-module/index', () => {
  it('getMajor()', () => {
    expect(getMajor('1.2.3')).toBe(1);
  });

  it('getMinor()', () => {
    expect(getMinor('1.2.3')).toBe(2);
  });

  it('getPatch()', () => {
    expect(getPatch('1.2.3')).toBe(3);
  });

  it.each`
    a          | b          | exp
    ${'1.2.3'} | ${'1.2.3'} | ${true}
    ${'1.2.3'} | ${'1.2.4'} | ${false}
  `('equals($a, $b)', ({ a, b, exp }) => {
    expect(equals(a, b)).toBe(exp);
    // The following are currently aliases for equals.
    expect(matches(a, b)).toBe(exp);
  });

  it.each`
    a          | b          | exp
    ${'1.2.4'} | ${'1.2.3'} | ${true}
    ${'1.2.3'} | ${'1.2.3'} | ${false}
    ${'1.2.2'} | ${'1.2.3'} | ${false}
  `('isGreaterThan($a, $b)', ({ a, b, exp }) => {
    expect(isGreaterThan(a, b)).toBe(exp);
  });

  it.each`
    a          | b          | exp
    ${'1.2.4'} | ${'1.2.3'} | ${false}
    ${'1.2.3'} | ${'1.2.3'} | ${false}
    ${'1.2.2'} | ${'1.2.3'} | ${true}
  `('isLessThanRange($a, $b)', ({ a, b, exp }) => {
    expect(isLessThanRange!(a, b)).toBe(exp);
  });

  it.each`
    vers                           | rng        | exp
    ${[]}                          | ${'1.2.3'} | ${null}
    ${['1.1.0', '1.2.0', '2.0.0']} | ${'1.2.0'} | ${'1.2.0'}
    ${['1.1.0', '1.2.0', '2.0.0']} | ${'1.2.3'} | ${null}
  `('getSatisfyingVersion(vers, rng)', ({ vers, rng, exp }) => {
    expect(getSatisfyingVersion(vers, rng)).toBe(exp);
    // The following are currently aliases for getSatisfyingVersion.
    expect(minSatisfyingVersion(vers, rng)).toBe(exp);
  });

  it.each`
    a          | b          | exp
    ${'1.2.3'} | ${'1.2.3'} | ${0}
    ${'1.2.3'} | ${'1.2.4'} | ${-1}
    ${'1.2.4'} | ${'1.2.3'} | ${1}
  `('sortVersions($a, $b)', ({ a, b, exp }) => {
    expect(sortVersions(a, b)).toBe(exp);
  });

  it.each`
    a                | exp
    ${'1.2.3'}       | ${true}
    ${'1.2.3-pre'}   | ${false}
    ${'1.2.3+build'} | ${true}
  `('isStable', ({ a, exp }) => {
    expect(isStable(a)).toBe(exp);
  });

  it.each`
    a                    | exp
    ${'1.2.3'}           | ${true}
    ${'1.2.3-pre'}       | ${true}
    ${'1.2.3+build'}     | ${true}
    ${'1.2.3-pre+build'} | ${true}
    ${'1.2.3-pre+build'} | ${true}
    ${'-abc'}            | ${false}
    ${'1_2'}             | ${false}
  `('isValid($a)', ({ a, exp }) => {
    expect(isValid(a)).toBe(exp);
    // The following are currently aliases for isValid.
    expect(isCompatible(a)).toBe(exp);
    expect(isSingleVersion(a)).toBe(exp);
  });

  it.each`
    a            | exp
    ${'1.2.3'}   | ${true}
    ${'-abc'}    | ${false}
    ${null}      | ${false}
    ${undefined} | ${false}
  `('isVersion($a)', ({ a, exp }) => {
    expect(isVersion(a)).toBe(exp);
  });
});
