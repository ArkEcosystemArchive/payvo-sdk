import base, { Scope } from "nock";

export const nock = (basePath: string | RegExp): Scope => {
	base.disableNetConnect();

	return base(basePath ?? /.+/);
};
