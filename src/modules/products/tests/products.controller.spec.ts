import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { FindAllProductsDto } from '../dto/Find-all-products.dto';
import { Between, Like } from 'typeorm';
import { UpdateProductDto } from '../dto/update-product.dto';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  beforeEach(() => {
    productsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as ProductsService;

    productsController = new ProductsController(productsService);
  });

  describe('create', () => {
    it('deve chamar productsService.create com argumentos corretos', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        price: 10.99,
        stockQuantity: 5,
      };

      await productsController.create(createProductDto);

      expect(productsService.create).toHaveBeenCalledWith(
        createProductDto,
        true,
        [
          {
            value: { name: createProductDto.name },
            errorMessage: 'Já existe um produto cadastrado com esse nome',
          },
        ],
      );
    });

    it('deve retornar o resultado de productsService.create', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        price: 10.99,
        stockQuantity: 50,
      };
      const expectedResult = {
        message: ['criado com sucesso'],
        data: {
          id: 1,
          name: 'Product 1',
          price: 10.99,
          stockQuantity: 50,
          createdAt: new Date('2023-05-17T19:12:23.346Z'),
          updatedAt: new Date('2023-05-17T19:12:23.346Z'),
        },
      };

      jest.spyOn(productsService, 'create').mockResolvedValue(expectedResult);

      const result = await productsController.create(createProductDto);

      expect(result).toBe(expectedResult);
    });

    it('deve retornar uma resposta de erro quando uma exceção é lançada', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        price: 10.99,
        stockQuantity: 500,
      };
      const errorMessage = 'Internal Server Error';
      jest
        .spyOn(productsService, 'create')
        .mockRejectedValue(new Error(errorMessage));

      await expect(productsController.create(createProductDto)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe('findAll', () => {
    it('deve chamar productsService.findAll com argumentos corretos', async () => {
      const query: FindAllProductsDto = {
        page: 1,
        perPage: 10,
        orderName: 'name',
        orderDirection: 'ASC',
        name: 'Product',
        minPrice: 5,
        maxPrice: 20,
        minQuantity: 1,
        maxQuantity: 100,
      };

      await productsController.findAll(query);

      expect(productsService.findAll).toHaveBeenCalledWith({
        tableName: 'products',
        page: query.page,
        perPage: query.perPage,
        order: {
          orderByColumn: query.orderName,
          orderDirection: query.orderDirection,
        },
        whereFilters: [
          { name: Like(`%${query.name}%`) },
          {
            price: Between(query.minPrice, query.maxPrice),
          },
          {
            stockQuantity: Between(query.minQuantity, query.maxQuantity),
          },
        ],
      });
    });

    it('deve retornar o resultado de productsService.findAll', async () => {
      const query: FindAllProductsDto = {
        page: 1,
        perPage: 10,
      };
      const expectedResult = {
        data: [
          {
            id: 1,
            name: 'Product 1',
            price: 10.99,
            stockQuantity: 50,
            createdAt: new Date('2023-05-17T19:12:23.346Z'),
            updatedAt: new Date('2023-05-17T19:12:23.346Z'),
          },
        ],
        total: 1,
        page: 1,
        perPage: 10,
        lastPage: 1,
        message: [],
      };

      jest.spyOn(productsService, 'findAll').mockResolvedValue(expectedResult);

      const result = await productsController.findAll(query);

      expect(result).toBe(expectedResult);
    });

    it('deve retornar uma resposta de erro quando uma exceção é lançada', async () => {
      const query: FindAllProductsDto = {
        page: 1,
        perPage: 10,
      };
      const errorMessage = 'Internal Server Error';

      jest
        .spyOn(productsService, 'findAll')
        .mockRejectedValue(new Error(errorMessage));

      await expect(productsController.findAll(query)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe('findOne', () => {
    it('deve chamar productsService.findOne com o argumento correto', async () => {
      const id = '1';
      await productsController.findOne(id);
      expect(productsService.findOne).toHaveBeenCalledWith({
        condition: { id: +id },
      });
    });
    it('deve retornar o resultado de productsService.findOne', async () => {
      const id = '1';
      const expectedResult = {
        message: ['criado com sucesso'],
        data: {
          id: 1,
          name: 'Product 1',
          price: 10.99,
          stockQuantity: 50,
          createdAt: new Date('2023-05-17T19:12:23.346Z'),
          updatedAt: new Date('2023-05-17T19:12:23.346Z'),
        },
      };

      jest.spyOn(productsService, 'findOne').mockResolvedValue(expectedResult);

      const result = await productsController.findOne(id);
      expect(result).toBe(expectedResult);
    });
    it('deve retornar uma resposta de erro quando uma exceção é lançada', async () => {
      const id = '1';
      const errorMessage = 'Internal Server Error';

      jest
        .spyOn(productsService, 'findOne')
        .mockRejectedValue(new Error(errorMessage));

      await expect(productsController.findOne(id)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe('update', () => {
    it('deve chamar productsService.update com o argumento correto', async () => {
      const id = '1';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 19.99,
      };

      await productsController.update(id, updateProductDto);

      expect(productsService.update).toHaveBeenCalledWith({
        condition: { id: +id },
        body: updateProductDto,
      });
    });

    it('deve retornar o resultado de productsService.update', async () => {
      const id = '1';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 19.99,
      };
      const expectedResult = {
        message: ['criado com sucesso'],
        data: {
          id: 1,
          name: 'Updated Product',
          price: 10.99,
          stockQuantity: 50,
          createdAt: new Date('2023-05-17T19:12:23.346Z'),
          updatedAt: new Date('2023-05-17T19:12:23.346Z'),
        },
      };

      jest.spyOn(productsService, 'update').mockResolvedValue(expectedResult);

      const result = await productsController.update(id, updateProductDto);

      expect(result).toBe(expectedResult);
    });

    it('deve retornar uma resposta de erro quando uma exceção é lançada', async () => {
      const id = '1';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 19.99,
      };
      const errorMessage = 'Internal Server Error';

      jest
        .spyOn(productsService, 'update')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        productsController.update(id, updateProductDto),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('remove', () => {
    it('deve chamar productsService.remove com o argumento correto', async () => {
      const id = '1';

      await productsController.remove(id);

      expect(productsService.remove).toHaveBeenCalledWith(+id);
    });

    it('deve retornar o resultado de  productsService.remove', async () => {
      const id = '1';
      const expectedResult = { message: ['Deletado com sucesso'], data: null };

      jest.spyOn(productsService, 'remove').mockResolvedValue(expectedResult);

      const result = await productsController.remove(id);

      expect(result).toBe(expectedResult);
    });

    it('deve retornar uma resposta de erro quando uma exceção é lançada', async () => {
      const id = '1';
      const errorMessage = 'Internal Server Error';

      jest
        .spyOn(productsService, 'remove')
        .mockRejectedValue(new Error(errorMessage));

      await expect(productsController.remove(id)).rejects.toThrow(errorMessage);
    });
  });
});
