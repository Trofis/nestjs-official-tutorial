import { NotFoundException, Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create.coffee.dto';
import { UpdateCoffeeDto } from './dto/update.coffee.dto';

@Injectable()
export class CoffeesService {

    private coffees: Coffee[] = [
        {
          id: 1,
          name: 'Shipwreck Roast',
          brand: 'Buddy Brew',
          flavors: ['chocolate', 'vanilla'],
        },
      ];

    findAll(): Coffee[] {
        return this.coffees
    }

    findOne(id: string): Coffee {
        const coffee = this.coffees.find((coffee) => coffee.id === +id)

        if (!coffee) {
            throw new NotFoundException(`Coffee ${id} not found`)
        }
        return coffee
    }

    create(createCoffeeDto: CreateCoffeeDto): Coffee {
        const lastId = Math.max(...this.coffees.map((coffee) => coffee.id))

        const coffeeToPush = {
            id: lastId + 1,
            ...createCoffeeDto
        }
       this.coffees.push(coffeeToPush)
       return coffeeToPush
    }

    update(id: string, updateCoffeeDto: UpdateCoffeeDto): Coffee {
        const coffeeToUpdate = this.findOne(id)
        const updatedCoffee = {
            ...coffeeToUpdate,
            ...updateCoffeeDto
        }
        this.coffees = [...this.coffees.filter((coffee) => coffee.id !== +id), updatedCoffee]
        return updatedCoffee
    }

    remove(id: string): string {
        this.coffees = this.coffees.filter((coffee) => coffee.id !== +id)
        return `This action removes a #${id} coffee`
    }
}
