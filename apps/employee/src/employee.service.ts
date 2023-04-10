import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateEmployeeDTO } from './dtos/update-employee.dto';
import { NewEmployeeDTO } from './dtos/new-employee.dto';
import { EmployeeEntity } from './entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
  ) {}

  // find all
  async getAllEmployess() {
    return await this.employeeRepository.find();
  }

  // find by id
  async getEmployeeById(id: number) {
    const employee = await this.employeeRepository.find({ where: { id: id } });
    if (employee) {
      return employee;
    }
    throw new HttpException('EmployeeEntity not found', HttpStatus.NOT_FOUND);
  }

  // create
  async createEmployee(employee: NewEmployeeDTO) {
    const newEmployee = this.employeeRepository.create(employee);
    await this.employeeRepository.save(newEmployee);

    return newEmployee;
  }

  // update
  async updateEmployee(id: number, post: UpdateEmployeeDTO) {
    const updatedEmployee = await this.employeeRepository.findOne({
      where: { id },
    });
    if (updatedEmployee) {
      await this.employeeRepository.update(id, post);
      return updatedEmployee;
    }

    throw new HttpException('EmployeeEntity not found', HttpStatus.NOT_FOUND);
  }

  // delete
  async deleteEmployee(id: number) {
    const deletedEmployee = await this.employeeRepository.delete(id);
    if (!deletedEmployee.affected) {
      throw new HttpException('EmployeeEntity not found', HttpStatus.NOT_FOUND);
    }
  }
}
