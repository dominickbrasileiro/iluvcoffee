import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees/coffees.controller';
import { CoffeesService } from './coffees/coffees.service';

@Module({
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class AppModule {}
