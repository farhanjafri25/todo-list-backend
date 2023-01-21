import { Injectable } from '@nestjs/common';
import { AppRepository } from './app.repository';

const client = require('./config/redis.config');

@Injectable()
export class RedisService {
  constructor(private readonly appRepository: AppRepository) {}
  public async saveDataInRedis(data: any): Promise<any> {
    try {
      const key = `BACKEND_TASK_Farhan`;
      console.log('data: ', data);
      const user = await client.get(key);
      console.log('userObj From Redis: ', JSON.parse(user));
      const userObj = JSON.parse(user);
      const totalDocs = userObj?.totalDocs ?? 0;
      let updatedData = [];
      let saveDataToMongo = [];
      // const stringifiedData = JSON.stringify(data);
      if (userObj && userObj?.data.length > 0) {
        console.log('Calling here: ');
        updatedData = [data, ...userObj.data];
      } else {
        updatedData = [data];
      }
      console.log('updatedData: ', updatedData);

      console.log('updatedData.length: ', updatedData.length);

      if (updatedData.length > 50) {
        saveDataToMongo = updatedData.slice(50, updatedData.length);
        updatedData = updatedData.slice(0, 50);
      }
      const updatedObj = {
        data: updatedData,
        totalDocs: totalDocs + 1,
      };
      const finalData = JSON.stringify(updatedObj);
      const saveRes = await client.set(key, finalData);
      if (saveDataToMongo.length > 0) {
        console.log(`-----save Data to mongo-----`, saveDataToMongo);
        saveDataToMongo.forEach(async (item) => {
          await this.appRepository.createTask(item);
        });
      }
      console.log('Saving UserTasks Redis: ', saveRes);
      return true;
    } catch (err) {
      console.log('Error while saving data in redis: ', err);
    }
  }

  public async getTasks(
    skip: number,
    limit: number,
    page: number,
    key: string,
  ): Promise<any> {
    try {
      const dataFromRedis = await client.get(key);
      console.log('dataFromRedis: ', dataFromRedis);
      console.log('skip: ', skip);
      console.log('limit: ', limit);

      const parsedData = JSON.parse(dataFromRedis);
      if (parsedData && parsedData?.data.length) {
        let slicedData = [];
        let totalDocs = 0;
        slicedData = parsedData.data.length
          ? parsedData.data.slice(skip, skip + limit + 1)
          : [];
        totalDocs = parsedData?.totalDocs ?? 0;

        const nextPage = slicedData.length < limit + 1 ? null : page + 1;
        const docs =
          slicedData.length < limit + 1
            ? slicedData
            : slicedData.slice(0, slicedData.length - 1);
        if (page > 1) {
          console.log('chekcing For Redis TImeOut');
          console.log('slicedData.length < limit : ', docs.length < limit);
          console.log('nextPage === null: ', nextPage === null);
          console.log(
            'otalDocs > parsedData?.data.length: ',
            totalDocs > parsedData?.data.length,
          );

          const handle =
            docs.length < limit &&
            nextPage === null &&
            totalDocs > parsedData?.data.length;
          console.log('handle: ', handle);

          if (handle) {
            return null;
          }
        }
        return {
          docs: docs,
          nextPage: nextPage,
          totalDocs: totalDocs,
        };
      }
      return null;
    } catch (err) {
      console.log('Error While Getting Tasks: ', err);
      return null;
    }
  }
}
