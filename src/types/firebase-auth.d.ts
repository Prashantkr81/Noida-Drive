import 'firebase/auth';

declare module 'firebase/auth' {
  /**
   * Firebase exposes this from its React Native export condition, but omits it
   * from the package's platform-neutral TypeScript declarations.
   */
  export function getReactNativePersistence(storage: unknown): Persistence;
}
