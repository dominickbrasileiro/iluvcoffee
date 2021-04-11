import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees/coffees.controller';

@Module({
  controllers: [CoffeesController],
})
export class AppModule {}
