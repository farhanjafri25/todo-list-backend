import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './Base.entitiy';
import { Document } from 'mongoose';

export type Todo = backend_tasks_farhan & Document;

@Schema()
export class backend_tasks_farhan extends BaseEntity {
  @Prop({ required: false, default: null })
  taskId: string;

  @Prop({ required: false, default: null })
  task: string;

  @Prop({ required: false, default: null })
  isCompleted: boolean;
}

export const UserTodoList = SchemaFactory.createForClass(backend_tasks_farhan);
