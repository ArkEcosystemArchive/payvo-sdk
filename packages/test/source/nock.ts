import base, { Scope } from "nock";

export const nock = {
	enableNetConnect: base.enableNetConnect,
	disableNetConnect: base.disableNetConnect,
	cleanAll: base.cleanAll,
	fake: (basePath: string | RegExp): Scope => {
		base.disableNetConnect();

		return base(basePath ?? /.+/);
	},
};
