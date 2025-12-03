import { NotFoundException, Injectable, Inject, Scope } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create.coffee.dto';
import { UpdateCoffeeDto } from './dto/update.coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity';
@Injectable({
    scope: Scope.REQUEST
})
export class CoffeesService {

    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly dataSource: DataSource,
        @Inject('COFFEE_BRANDS') coffeeBrands: string[],
    ) {
        console.log(coffeeBrands)
    }

    async findAll(paginationQuery: PaginationQueryDto): Promise<Coffee[]> {
        const { limit, offset } = paginationQuery

        return await this.coffeeRepository.find({
            relations: {
                flavors: true
            },
            take: limit,
            skip: offset,
            
        })
    }

    async findOne(id: string): Promise<Coffee> {
        const coffee = await this.coffeeRepository.findOne({ where: { id: +id }, relations: { flavors: true } })

        if (!coffee) {
            throw new NotFoundException(`Coffee ${id} not found`)
        }
        return coffee
    }

    async create(createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
        )
    
        const coffeeToPush = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors
        })
        return this.coffeeRepository.save(coffeeToPush)
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto): Promise<Coffee> {
        const flavors = updateCoffeeDto.flavors ? await Promise.all(
            updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
        ) : undefined

        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors
        })
        if (!coffee) {
            throw new NotFoundException(`Coffee ${id} not found`)
        }
        return this.coffeeRepository.save(coffee)
    }

    async remove(id: string): Promise<string> {
        const coffee = await this.findOne(id)
        this.coffeeRepository.remove(coffee)
        return `This action removes a #${id} coffee`
    }

    async recommendCoffee(coffee: Coffee) {
        const queryRunner = this.dataSource.createQueryRunner()

        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            coffee.recommendations += 1

            const recommendEvent = new Event()
            recommendEvent.name = 'recommend_coffee'
            recommendEvent.type = 'coffee'
            recommendEvent.payload = { coffeeId: coffee.id }

            await queryRunner.manager.save(Event)
            await queryRunner.manager.save(coffee)

            await queryRunner.commitTransaction()
        } catch (err) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    private async preloadFlavorByName(name:string): Promise<Flavor> {
        const flavor = await this.flavorRepository.findOneBy({ name })
        if (flavor) {
            return flavor
        }
        return this.flavorRepository.create({ name })
    }
}
