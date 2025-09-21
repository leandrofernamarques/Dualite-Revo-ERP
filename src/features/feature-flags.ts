interface FeatureFlags {
  'feature.clients': boolean;
}

export const featureFlags: FeatureFlags = {
  'feature.clients': true,
};

export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return featureFlags[flag] ?? false;
}
