export const executableExists = (command: string): boolean => {
  const proc = Bun.spawnSync(["which", command]);
  return proc.stdout.toString() !== "";
};
