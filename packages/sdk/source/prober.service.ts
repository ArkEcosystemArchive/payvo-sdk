/* istanbul ignore file */

import { NotImplemented } from "./exceptions.js";
import { ProberService } from "./prober.contract.js";

export class AbstractProberService implements ProberService {
	public async evaluate(host: string): Promise<boolean> {
		throw new NotImplemented(this.constructor.name, this.evaluate.name);
	}
}
