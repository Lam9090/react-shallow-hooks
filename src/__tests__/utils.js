export function getEmptyDepsMsg(hookName) {
  const originName = `use${hookName.slice(10)}`;

  return `\`${hookName}\` should not be used with no dependencies. Use React.${originName} instead.`;
}

export function getPrimitiveDepsMsg(hookName) {
  const originName = `use${hookName.slice(10)}`;

  return `\`${hookName}\` should not be used with dependencies that are all primitive values. Use React.${originName} instead.`;
}
