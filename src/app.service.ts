import { Injectable } from '@nestjs/common';
import { AppRepository } from './app.repository';
import { v4 as uuid } from 'uuid';
import { RedisService } from './redis.service';
@Injectable()
export class AppService {
  constructor(
    private readonly appRepository: AppRepository,
    private readonly redisService: RedisService, //private readonly myGateway: myGateway,
  ) {}

  // async saveTask(body): Promise<any> {
  //   return this.appRepository.createTask(body);
  // }

  async saveTodo(body: any): Promise<any> {
    body.taskId = uuid();
    await this.redisService.saveDataInRedis(body);
    return;
  }

  async getAllTasks(page: number, pageSize: number): Promise<any> {
    const { skip, limit } = this.getPagination(page, pageSize);
    let count;
    const userRedisKey = `BACKEND_TASK_Farhan`;
    const data = await this.redisService.getTasks(
      skip,
      limit,
      page,
      userRedisKey,
    );
    console.log('Docs Len: ', data?.docs.length);
    console.log('limit: ', limit);

    if (data) {
      return data;
    }
    console.log('calling from Mongo: ');
    const res = await this.appRepository.getTasks(skip, limit);
    // eslint-disable-next-line prefer-const
    count = await this.appRepository.count();
    // }
    return {
      docs: res.length < limit ? res : res.slice(0, res.length - 1),
      nextPage: res.length < limit ? null : +page + 1,
      totalDocs: count,
    };
  }

  async updateTaskInMongo(body: any): Promise<any> {
    return this.appRepository.updateTask(body);
  }
  getHello(): string {
    return 'Hello World!';
  }

  public getPagination(page: number, pageSize: number) {
    if (!page) page = 1;
    if (!pageSize) pageSize = 5;
    page = page - 1;
    const skip = page <= 0 ? 0 : page * pageSize;
    const limit = +(Number.isNaN(pageSize) ? 30 : pageSize);
    return {
      skip,
      limit,
      page: page + 1,
    };
  }
}
