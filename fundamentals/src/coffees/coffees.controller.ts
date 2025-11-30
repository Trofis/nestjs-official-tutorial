import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create.coffee.dto';
import { UpdateCoffeeDto } from './dto/update.coffee.dto';

@Controller('coffees')
export class CoffeesController {

    constructor(private readonly coffeesService: CoffeesService) {}

    @Get()  
    findAll(@Query() paginationQuery: any): Coffee[] {
        //const { limit, offset } = paginationQuery
        
        return this.coffeesService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string): Coffee {
        return this.coffeesService.findOne(id)
    }

    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto): Coffee {
        return this.coffeesService.create(createCoffeeDto)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto): Coffee {
        return this.coffeesService.update(id, updateCoffeeDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string): string {
        return  this.coffeesService.remove(id)
    }
}
