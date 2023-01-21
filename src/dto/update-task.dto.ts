import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class TaskDto {
  @IsNotEmpty()
  @IsString()
  task: string;

  @IsBoolean()
  isCompleted: boolean;
}
