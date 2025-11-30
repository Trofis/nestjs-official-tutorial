import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {

    @Get()  
    findAll(@Query() paginationQuery: any): string {
        const { limit, offset } = paginationQuery
        
        return 'This action returns all coffees, limit: ' + limit + ', offset: ' + offset
    }

    @Get(':id')
    findOne(@Param('id') id: string): string {
        return `This action returns a #${id} coffee`
    }

    @Post()
    create(@Body() createCoffeeDto: any): string {
        return createCoffeeDto
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCoffeeDto: any): string {
        return `This action updates a #${id} coffee`
    }

    @Delete(':id')
    remove(@Param('id') id: string): string {
        return `This action removes a #${id} coffee`
    }
}
