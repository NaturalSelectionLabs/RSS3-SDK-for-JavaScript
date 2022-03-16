import type { AnyObject } from '../../types/extend';
import { UtilsObject } from './object';

export class UtilsSignature {
    static getMessage(obj: AnyObject) {
        return `[RSS3] I am confirming the results of changes to my file ${obj.identifier}: ${UtilsObject.stringify(
            obj,
        )}`;
    }

    static getAgentMessage(obj: AnyObject) {}
}
