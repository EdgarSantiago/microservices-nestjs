import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NewEmployeeDTO } from './dtos/new-employee.dto';
import { EmployeeService } from './employee.service';
import { UpdateEmployeeDTO } from './dtos/update-employee.dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared';

@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {}

  // get all Employees
  @MessagePattern({ cmd: 'get-employees' })
  getEmployees(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.employeeService.getAllEmployess();
  }

  // get employee by id
  @MessagePattern({ cmd: 'get-employee' })
  getEmployeeById(
    @Payload() employee: { id: number },
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return this.employeeService.getEmployeeById(Number(employee.id));
  }

  // create employee
  @MessagePattern({ cmd: 'create-employee' })
  async createEmployee(@Body() employee: NewEmployeeDTO) {
    return this.employeeService.createEmployee(employee);
  }

  // update employee
  @MessagePattern({ cmd: 'update-employee' })
  async updatePost(
    @Param('id') id: string,
    @Body() employee: UpdateEmployeeDTO,
  ) {
    return this.employeeService.updateEmployee(Number(id), employee);
  }

  //delete employee
  @MessagePattern({ cmd: 'delete-employee' })
  async deleteEmployee(@Param('id') id: string) {
    this.employeeService.deleteEmployee(Number(id));
  }
}
