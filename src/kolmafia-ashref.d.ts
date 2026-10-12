export {};

// Local KoLmafia runtime declarations verified against live ASHref.
// These augment the npm bindings when KoLmafia has added a runtime function
// before the published TypeScript package has caught up.
declare module "kolmafia" {
  export function appendBufferToFile(buffer: string, filename: string): boolean;
  export function urlEncode(value: string): string;
}
