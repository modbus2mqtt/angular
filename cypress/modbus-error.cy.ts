import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, provideRouter } from "@angular/router";

import { ISpecificationMethods } from "angular/src/app/services/specificationInterface";
import { ModbusErrorComponent } from "angular/src/app/modbus-error/modbus-error.component";
import {
  Iconfiguration,
  ImodbusErrorsForSlave,
  ModbusErrorStates,
  ModbusTasks,
} from "@modbus2mqtt/server.shared";
import { ModbusRegisterType } from "@modbus2mqtt/specification.shared";


let date = Date.now()
let modbusErrors: ImodbusErrorsForSlave = {
  task: ModbusTasks.deviceDetection,
  date: date,
  address: { address:1,registerType:ModbusRegisterType.HoldingRegister},
  state:ModbusErrorStates.crc

};
function mount( currentDate:number){
    // This configures the rootUrl for /api... calls
    // they need to be relative in ingress scenarios,
    // but they must be absolute for cypress tests
    cy.window().then((win) => {
      (win as any).configuration = { rootUrl: "/" };
    });
    cy.mount(ModbusErrorComponent, {
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([]),
      ],
      autoDetectChanges: true,
      componentProperties: {
        modbusErrors: [modbusErrors],
        currentDate: date + 30*1000
      },
    });

    // This configures the rootUrl for /api... calls
    // they need to be relative in ingress scenarios,
    // but they must be absolute for cypress tests
    cy.window().then((win) => {
      (win as any).configuration = { rootUrl: "/" };
    });
    cy.mount(ModbusErrorComponent, {
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([]),
      ],
      autoDetectChanges: true,
      componentProperties: {
        modbusErrors: [modbusErrors],
        currentDate: currentDate
      },
    });
}
describe("Modbus Error Component tests", () => {
  it("can mount 30 seconds after last error", () => {
    mount(date + 30*1000)
    cy.get('mat-panel-description:first').should('contain', '30 seconds ago')
  });
  
  it("can mount 90 seconds after last error", () => {
      mount(date + 90*1000)
      cy.get('mat-panel-description:first').should('contain', '1:30 minutes ago')
  });
});
