import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
  ) {}

  async findAll(): Promise<Coffee[]> {
    const coffees = await this.coffeeRepository.find();

    return coffees;
  }

  async findOne(id: string): Promise<Coffee> {
    const coffee = await this.coffeeRepository.findOne(id);

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return coffee;
  }

  async create({ name, brand, flavors }: CreateCoffeeDto): Promise<Coffee> {
    const coffee = this.coffeeRepository.create({
      name,
      brand,
      flavors,
    });

    await this.coffeeRepository.save(coffee);

    return coffee;
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto): Promise<void> {
    const coffee = await this.coffeeRepository.preload({
      id: Number(id),
      ...updateCoffeeDto,
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    await this.coffeeRepository.save(coffee);
  }

  async remove(id: string): Promise<void> {
    const coffee = await this.findOne(id);

    await this.coffeeRepository.remove(coffee);
  }
}
