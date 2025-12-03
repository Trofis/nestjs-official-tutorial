import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Inject } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create.coffee.dto';
import { UpdateCoffeeDto } from './dto/update.coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';

@Controller('coffees')
export class CoffeesController {

    constructor(private readonly coffeesService: CoffeesService, @Inject(REQUEST) private readonly request: Request) {
        console.log('CoffeesController constructor')
    }

    @Get()  
    async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<Coffee[]> {
        return this.coffeesService.findAll(paginationQuery)
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Coffee> {
        return this.coffeesService.findOne(id)
    }

    @Post()
    async create(@Body() createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
        return this.coffeesService.create(createCoffeeDto)
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto): Promise<Coffee> {
        return this.coffeesService.update(id, updateCoffeeDto)
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<string> {
        return this.coffeesService.remove(id)
    }
}
