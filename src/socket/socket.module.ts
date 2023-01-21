import { Module } from '@nestjs/common';
import { myGateway } from './socket';

@Module({
  imports: [myGateway],
})
export class GatewayModule {}
