import { describe, it, expect, test } from 'vitest';
import { dequal } from 'dequal';
import { parseHash, serializeHash } from '../../../src/components/Router';

describe('parseHash', () => {

  it('should parse all root hash configurations without map correctly', () => {
    const test_01 = parseHash('#');
    expect(test_01.route).toBe('/');
    expect(dequal(test_01.params, {})).toBe(true);

    const test_02 = parseHash('#/');
    expect(test_02.route).toBe('/');
    expect(dequal(test_02.params, {})).toBe(true);
  });

  it('should parse all root hash configurations with map correctly', () => {
    const test_01 = parseHash('#map=1/0/0');
    expect(test_01.route).toBe('/');
    expect(dequal(test_01.params, { map: '1/0/0' })).toBe(true);

    const test_02 = parseHash('#/map=1/0/0');
    expect(test_02.route).toBe('/');
    expect(dequal(test_02.params, { map: '1/0/0' })).toBe(true);

    const test_03 = parseHash('#/&map=1/0/0');
    expect(test_03.route).toBe('/');
    expect(dequal(test_03.params, { map: '1/0/0' })).toBe(true);

    const test_04 = parseHash('#&map=1/0/0');
    expect(test_04.route).toBe('/');
    expect(dequal(test_04.params, { map: '1/0/0' })).toBe(true);
  });

});

describe('serializeHash', () => {

  it('should serialize app state correctly', () => {
    const test_01 = serializeHash({ route: '/', params: {} });
    expect (test_01).toBe('#/');

    const test_02 = serializeHash({ route: '/', params: { map: '1/0/0'} });
    expect (test_02).toBe('#/&map=1/0/0');

    const test_03 = serializeHash({ route: '/site/1234', params: {} });
    expect (test_03).toBe('#/site/1234');
   
    const test_04 = serializeHash({ route: '/site/1234', params: { map: '1/0/0'} });
    expect (test_04).toBe('#/site/1234&map=1/0/0');
  });

});