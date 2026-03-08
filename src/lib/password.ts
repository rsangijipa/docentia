type PasswordLib = {
  hash: (value: string, saltOrRounds: number) => Promise<string>;
  compare: (value: string, hash: string) => Promise<boolean>;
};

async function loadPasswordLib(): Promise<PasswordLib> {
  try {
    const bcrypt = await import('bcrypt');
    const lib = (bcrypt.default ?? bcrypt) as PasswordLib;
    return lib;
  } catch {
    const bcryptjs = await import('bcryptjs');
    const lib = (bcryptjs.default ?? bcryptjs) as PasswordLib;
    return lib;
  }
}

export async function hashPassword(value: string): Promise<string> {
  const lib = await loadPasswordLib();
  return lib.hash(value, 10);
}

export async function comparePassword(value: string, hashedValue: string): Promise<boolean> {
  const lib = await loadPasswordLib();
  return lib.compare(value, hashedValue);
}
