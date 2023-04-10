import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NewEmployeeDTO } from './dtos/new-employee.dto';
import { EmployeeService } from './employee.service';
import { UpdateEmployeeDTO } from './dtos/update-employee.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // get all Employees
  @MessagePattern({ cmd: 'get-employees' })
  getEmployees() {
    return this.employeeService.getAllEmployess();
  }

  // get employee by id
  @MessagePattern({ cmd: 'get-employee' })
  getEmployeeById(@Param('id') id: string) {
    return this.employeeService.getEmployeeById(Number(id));
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
