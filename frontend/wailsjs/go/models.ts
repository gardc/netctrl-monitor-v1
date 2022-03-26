/* Do not change, this code is generated from Golang structs */

export {};

export class IPNet {


    static createFrom(source: any = {}) {
        return new IPNet(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);

    }
}
export class Interface {


    static createFrom(source: any = {}) {
        return new Interface(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);

    }
}

export class PoisonParams {
    targetIp: number[];
    targetMac: number[];
    localIface: Interface;
    gatewayMac: number[];
    gatewayIp: number[];
    blockSleepSeconds: number;

    static createFrom(source: any = {}) {
        return new PoisonParams(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.targetIp = source["targetIp"];
        this.targetMac = source["targetMac"];
        this.localIface = this.convertValues(source["localIface"], Interface);
        this.gatewayMac = source["gatewayMac"];
        this.gatewayIp = source["gatewayIp"];
        this.blockSleepSeconds = source["blockSleepSeconds"];
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}


