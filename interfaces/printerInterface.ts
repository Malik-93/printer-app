export interface IRolloResults {
    printer_ip: string
}
export interface IFormPrintRequest {
    printer: string,
    copies: number,
    file: Express.Multer.File,
}
export interface IEmailJson {
    email: string
}

export interface IPrinterStatusRequest {
    printer_mac: string
}
export interface IPrinterReport {
    store_email: string,
    store_mac: string,
    printer_name: string,
    printer_mac: string,
}
export interface IResponse {
    success?: boolean,
    statusCode?: number,
    message?: string
    _res?: any,
}
export interface IPrinterStatusResponse {
    online: boolean,
    message?: string
}

export interface IPrinter {
    mac: string,
}