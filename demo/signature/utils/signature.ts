import { UtilsObject } from './object';

export class UtilsSignature {
    static getMessage(obj: any) {
        return `[RSS3] I am confirming the results of changes to my file ${obj.identifier}: ${UtilsObject.stringify(
            obj,
        )}`;
    }
}
