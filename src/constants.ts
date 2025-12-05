export const LOADING = 'loading';
export const LOADED = 'loaded';
export const FAILED = 'failed';
export const DENIED = 'denied';
export type StatusValue = typeof LOADING | typeof LOADED | typeof FAILED | typeof DENIED;

export const EVENT_TYPE_CREATE_EVENT = 'CREATE_EVENT'
