import { Module } from '@nestjs/common';
import { CoffeeRatingService } from './coffee-rating.service';
import { CoffeesModule } from '../coffees/coffees.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [CoffeesModule, DatabaseModule.register({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    synchronize: true,
  })],
  providers: [CoffeeRatingService]
})
export class CoffeeRatingModule {}
