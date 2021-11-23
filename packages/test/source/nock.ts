import base, { Scope } from "nock";

export const nock = {
	cleanAll: base.cleanAll,
	disableNetConnect: base.disableNetConnect,
	enableNetConnect: base.enableNetConnect,
	fake: (basePath: string | RegExp): Scope => {
		base.disableNetConnect();

		return base(basePath ?? /.+/);
	},
};
