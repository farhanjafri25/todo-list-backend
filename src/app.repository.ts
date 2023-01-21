import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, backend_tasks_farhan } from './entities/Todo-list.entity';

@Injectable()
export class AppRepository {
  constructor(
    @InjectModel(backend_tasks_farhan.name) private todoModel: Model<Todo>,
  ) {}

  async createTask(todo: backend_tasks_farhan): Promise<backend_tasks_farhan> {
    const newTodo = new this.todoModel(todo);
    return newTodo.save();
  }

  async getTasks(skip: number, limit: number): Promise<any> {
    return await this.todoModel.find({ skip: skip, limit: limit });
  }

  async count(): Promise<any> {
    return await this.todoModel.count();
  }

  //   async saveTodo(userId, updateTaskDto): Promise<backend_tasks_farhan> {
  //     return this.todoModel.findOneAndUpdate(userId, updateTaskDto);
  //   }
  async updateTask(body): Promise<any> {
    return this.todoModel.findOneAndUpdate(body.taskId, {
      isCompleted: body.isCompleted,
    });
  }
}
