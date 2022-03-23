export interface go {
  "main": {
    "App": {
		GetMachineHostname():Promise<string>
		GetMachineID():Promise<string>
		GetOS():Promise<string>
		Greet(arg1:string):Promise<string>
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
