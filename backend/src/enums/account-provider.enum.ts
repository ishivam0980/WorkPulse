export const ProviderEnum = {
  GOOGLE: "GOOGLE",
  EMAIL: "EMAIL",
} as const;

export type ProviderEnumType = keyof typeof ProviderEnum;
