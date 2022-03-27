import * as models from './models';

export interface go {
  "main": {
    "App": {
		GetDefaultLocalIP():Promise<models.IP>
		GetGatewayIP():Promise<models.IP>
		GetIPNetFromIP(arg1:models.IP):Promise<models.IPNet>
		GetIfaceFromIP(arg1:models.IP):Promise<models.Interface>
		GetMACFromString(arg1:string):Promise<models.HardwareAddr>
		GetMachineHostname():Promise<string>
		GetMachineID():Promise<string>
		GetOS():Promise<string>
		GetVersion():Promise<string>
		Greet(arg1:string):Promise<string>
		Initialize(arg1:models.Interface):Promise<void>
		LookupARPTable(arg1:models.IP):Promise<models.MACInfo>
		NeedsPermissions():Promise<boolean>
		Poison(arg1:models.PoisonParams):Promise<void>
		Quit():Promise<void>
		Scan(arg1:models.Interface,arg2:models.IPNet,arg3:number):Promise<void>
		SetJWT(arg1:string):Promise<void>
		SetPermissions():Promise<boolean>
		StartListening():Promise<void>
		StopPoison(arg1:models.PoisonParams):Promise<void>
		StopScan():Promise<void>
		UpdateCheck():Promise<void>
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
