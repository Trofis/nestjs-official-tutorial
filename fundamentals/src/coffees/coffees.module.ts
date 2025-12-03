import { Injectable, Module, Scope } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity'
import { COFFEE_BRANDS } from './coffees.constant';
import { DataSource } from 'typeorm';

//  Class providers
class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService  {}

// Factory providers
@Injectable()
export class CoffeBrandsFactory {
    create() {
        /* do something ... */
        return ['buddy brew', 'nescafe']
    }
}


/**
 * Custom providers are useful for those cases :
 * - We're creating a custom instance of our provider instead of using the default one
 * - We want to use a Strategy pattern in which we can provide an abstract class and interchange the real implementation
 * - We need to delay the bootstrap process until one or more async tasks have completed
 */

@Module({
    controllers: [CoffeesController],
    /**
     * You have different providers :
     * - useValue to provide a constant value or a library or replace by a mock
     * - useClass to determine a class taht a token should resove
     * - useFactory to create a provider on the fly and we have the possibility to use providers
     */
    providers: [
        CoffeesService,
        // -------------- CLASS ---------------------
        {
            provide: ConfigService,
            useClass: process.env.NODE_ENV === 'development' ? DevelopmentConfigService : ProductionConfigService
        },
        // -------------- FACTORY ---------------------
        {
            provide: COFFEE_BRANDS,
            useFactory: async(dataSource: DataSource): Promise<string[]> => {
                const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe'])
                console.log('[!] Async Factory')
                return coffeeBrands
            },
            inject: [DataSource],
            scope: Scope.TRANSIENT
        },
        // BASIC FACTORY
        // {
        //     provide: COFFEE_BRANDS,
        //     useFactory:async () => ['buddy brew', 'nescafe']
        // }
        // REAL FACTORY WITH DEPENDENCY
        // {
        //     provide: COFFEE_BRANDS,
        //     useFactory: (brandsFactory: CoffeBrandsFactory) => brandsFactory.create(),
        //     inject: [CoffeBrandsFactory]
        // }
        // ---------------- VALUE --------------------
        // {
        //     provide: COFFEE_BRANDS,
        //     useValue: ['buddy brew', 'nescafe']
        // }

    ],
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
    exports: [CoffeesService],
})
export class CoffeesModule {
}
