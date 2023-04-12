import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateEmployeeDTO } from './dtos/update-employee.dto';
import { NewEmployeeDTO } from './dtos/new-employee.dto';
import { EmployeeEntity } from './entities/employee.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
  ) {}

  // find all
  async getAllEmployess() {
    const employees = await this.employeeRepository.find();
    if (employees.length > 0) {
      return employees;
    }
    throw new RpcException({
      statusCode: 404,
      message: 'Não existe nenhum empregado',
    });
  }

  // find by id
  async getEmployeeById(id: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id: id },
    });
    if (employee) {
      return employee;
    }
    throw new RpcException({
      statusCode: 404,
      message: 'Empregado não encontrado',
    });
  }

  // delete
  async deleteEmployee(id: number): Promise<string> {
    const deletedEmployee = await this.employeeRepository.delete(id);
    if (deletedEmployee.affected === 0) {
      throw new RpcException({
        statusCode: 404,
        message: 'Empregado não encontrado',
      });
    }
    return `Empregado com ID ${id} foi deletado com sucesso.`;
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

    throw new RpcException({
      statusCode: 404,
      message: 'Empregado não encontrado',
    });
  }
}
