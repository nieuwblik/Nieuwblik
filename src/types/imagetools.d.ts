/**
 * Imports met ?as=srcset leveren een srcset-string op in plaats van een URL.
 * Zonder deze declaratie ziet TypeScript alleen de losse *.webp-module.
 */
declare module "*&as=srcset" {
  const srcset: string;
  export default srcset;
}
