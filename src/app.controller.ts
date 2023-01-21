import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { TaskDto } from './dto/update-task.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/save/todo')
  async saveTodo(@Body() body: TaskDto): Promise<any> {
    try {
      const res = await this.appService.saveTodo(body);
      return { code: 201, messsage: 'Success', data: res };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Get('/fetchAllTasks')
  async fetchAllTasks(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<any> {
    try {
      const res = await this.appService.getAllTasks(page, pageSize);
      return res;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Unable to Fetch Tasks');
    }
  }

  @Post('/update/task')
  async updateTaskInMongo(@Body() body: any): Promise<any> {
    return this.appService.updateTaskInMongo(body);
  }
}
