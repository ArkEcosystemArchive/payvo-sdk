// @ts-ignore
export const require = async (path: string): Promise<any> => (await import(path)).default;
