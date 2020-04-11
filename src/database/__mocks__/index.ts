import { Sequelize, Model, Repository } from 'sequelize-typescript';
import { Base } from '../../database/base';
import path from 'path';
import { Identifier, NonNullFindOptions } from 'sequelize/types';

const modelPaths = path.join(__dirname, '../models');

const database = new Sequelize({
  models: [modelPaths],
});

export class MockRepository<T extends Base<T>> {
  private readonly data: T[];
  private readonly model: Repository<T>;
  constructor(model: (new() => T), initialData: T[] = []) {
    this.model = database.getRepository(model);
    this.data = initialData;
  }

  private wrapInModel<M>(value: M) {
    return {
      ...value,
      get: () => value,
      getDataValue: () => value,
    } as unknown as Model<M>;
  }

  async findByPk(identifier: Identifier,
    options?: Omit<NonNullFindOptions, 'where'>): Promise<Model<T>> {
    const pkField = this.model.primaryKeyAttribute;
    const result = this.data.find((m: any) => m[pkField] === identifier);
    return Promise.resolve(this.wrapInModel(result));
  }

  async findOne(options: NonNullFindOptions) {
    const [result] = this.data;
    return Promise.resolve(this.wrapInModel(result));
  }
}

export default database;
