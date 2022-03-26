import * as models from './models';

export interface go {
  "main": {
    "App": {
		GetDefaultLocalIP():Promise<models.IP>
		GetGatewayIP():Promise<models.IP>
		GetIPNetFromIP(arg1:models.IP):Promise<models.IPNet>
		GetIfaceFromIP(arg1:models.IP):Promise<models.Interface>
		GetMachineHostname():Promise<string>
		GetMachineID():Promise<string>
		GetOS():Promise<string>
		Greet(arg1:string):Promise<string>
		InitializePcap(arg1:models.Interface):Promise<void>
		LookupARPTable(arg1:models.IP):Promise<models.HardwareAddr>
		Poison(arg1:models.PoisonParams):Promise<void>
		Scan(arg1:models.Interface,arg2:models.IPNet,arg3:number):Promise<void>
		SetJWT(arg1:string):Promise<void>
		StartListening():Promise<void>
		StopPoison(arg1:models.PoisonParams):Promise<void>
		StopScan():Promise<void>
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
