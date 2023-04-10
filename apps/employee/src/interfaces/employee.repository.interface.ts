import { BaseInterfaceRepository } from '@app/shared';
import { EmployeeEntity } from '../entities/employee.entity';

export interface EmployeeRepositoryInterface
  extends BaseInterfaceRepository<EmployeeEntity> {}
