import { Prop, Schema } from '@nestjs/mongoose';
import { now } from 'mongoose';

@Schema()
export class BaseEntity {
  @Prop({ default: now() })
  public created_at: Date;

  @Prop({ default: now() })
  public updated_at: Date;
}
