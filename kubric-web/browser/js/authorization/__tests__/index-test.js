jest.unmock('../creator');
jest.unmock('../admin');
jest.unmock('../../lib/lodash');
jest.unmock('../index');

import { getAuthorizationRules } from '../index';

const INVALID_ERROR = 'Invalid value passed for roles or formName parameters';

describe('getAuthorizationRules', () => {

  it('throws exception if no parameters are passed', () => {
    expect(getAuthorizationRules).toThrowError(INVALID_ERROR);
  });

  it('throws exception if only roles are passed', () => {
    expect(getAuthorizationRules.bind(null, {
      creator: true,
    })).toThrowError(INVALID_ERROR);
  });

  it('throws exception if only formName is passed', () => {
    expect(getAuthorizationRules.bind(null, undefined, 'episode')).toThrowError(INVALID_ERROR);
  });

  it('returns empty object for channel form on admin role(no config)', () => {
    expect(getAuthorizationRules({
      admin: true,
    }, 'channel')).toEqual({
      'lockedFields': {},
      'restrictedFields': {},
    });
  });

  it('returns authorization object for profile form on admin role', () => {
    expect(getAuthorizationRules({
      admin: true,
    }, 'profile')).toEqual({
      'lockedFields': {
        'email': true,
      },
      'restrictedFields': {},
    });
  });

  it('returns authorization object for channel form on creator role', () => {
    expect(getAuthorizationRules({
      creator: true,
    }, 'channel')).toEqual({
      'restrictedFields': {
        'rss': true,
        'enabled': true,
      },
      'lockedFields': {
        'author': true,
      },
    });
  });

  it('returns restricted fields object for episode form on creator role', () => {
    expect(getAuthorizationRules({
      creator: true,
    }, 'episode')).toEqual({
      'restrictedFields': {
        'evergreen': true,
        'editorspick': true,
        'enabled': true,
      },
      'lockedFields': {
        'author': true,
      },
    });
  });

  it('returns restricted fields object for appheader form on creator role', () => {
    expect(getAuthorizationRules({
      creator: true,
    }, 'appheader')).toEqual({
      'restrictedFields': {
        'search': true,
      },
      'lockedFields': {},
    });
  });
});
