import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { Product } from '../entities/product.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PRODUCTS_REPOSITORY } from '../providers/products.providers';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DefaultMessages } from 'src/commom/types/DefaultMessages';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let queryBuilderMock: SelectQueryBuilder<Product>;
  let mockProductsRepository: Repository<Product>;

  beforeEach(async () => {
    queryBuilderMock = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockReturnValue([[], 0]),
    } as unknown as SelectQueryBuilder<Product>;

    mockProductsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn(() => queryBuilderMock),
      getManyAndCount: jest.fn().mockReturnValue([[], 0]),
    } as unknown as Repository<Product>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PRODUCTS_REPOSITORY, useValue: mockProductsRepository },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
  });

  describe('Instância das dependências', () => {
    it('Products Service', () => {
      expect(productsService).toBeDefined();
    });
  });

  describe('Cadastro de produto', () => {
    it('Deve ser possível cadastrar um produto', async () => {
      const mockCreatedValue = {
        id: 1,
        name: "Tv 20'",
        price: 1569.25,
        stockQuantity: 5,
        createdAt: new Date('2023-05-17T19:12:23.346Z'),
        updatedAt: new Date('2023-05-17T19:12:23.346Z'),
      };

      jest
        .spyOn(mockProductsRepository, 'create')
        .mockReturnValue(mockCreatedValue);

      const response = await productsService.create({
        name: "Tv 20'",
        price: 1569.25,
        stockQuantity: 5,
      });

      expect(mockProductsRepository.create).toHaveBeenLastCalledWith({
        name: "Tv 20'",
        price: 1569.25,
        stockQuantity: 5,
      });
      expect(mockProductsRepository.save).toHaveBeenCalledWith(
        mockCreatedValue,
      );
      expect(response.data).toEqual(mockCreatedValue);
    });

    it('Não deve ser possível cadastrar produtos com nomes iguais', async () => {
      jest.spyOn(mockProductsRepository, 'findOne').mockResolvedValue({
        id: 1,
        name: "Tv 20'",
        price: 1569.25,
        stockQuantity: 5,
        createdAt: new Date('2023-05-17T19:12:23.346Z'),
        updatedAt: new Date('2023-05-17T19:12:23.346Z'),
      });

      await expect(
        productsService.create(
          {
            name: "Tv 20'",
            price: 1569.25,
            stockQuantity: 5,
          },
          true,
          [{ value: { name: "Tv 20'" }, errorMessage: 'nome já cadastrado' }],
        ),
      ).rejects.toThrow(
        new HttpException(
          { message: ['nome já cadastrado'], data: null },
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe('Update de produto', () => {
    it('repository.update deve ser chamado com os parametros corretos', async () => {
      jest
        .spyOn(mockProductsRepository, 'update')
        .mockResolvedValue({ generatedMaps: [], raw: [], affected: 1 });

      jest.spyOn(mockProductsRepository, 'findOne').mockResolvedValue({
        id: 1,
        name: "Tv 20'",
        price: 2569.25,
        stockQuantity: 5,
        createdAt: new Date('2023-05-17T19:12:23.346Z'),
        updatedAt: new Date('2023-05-17T19:12:23.346Z'),
      });

      await productsService.update({
        condition: { id: 1 },
        body: {
          price: 2569.25,
        },
      });

      expect(mockProductsRepository.update).toBeCalledTimes(1);
      expect(mockProductsRepository.update).toHaveBeenCalledWith(
        { id: 1 },
        { price: 2569.25 },
      );
    });

    it('Deve atualizar um produto com os parametros corretos', async () => {
      jest
        .spyOn(mockProductsRepository, 'update')
        .mockResolvedValue({ generatedMaps: [], raw: [], affected: 1 });

      jest.spyOn(mockProductsRepository, 'findOne').mockResolvedValue({
        id: 1,
        name: "Tv 20'",
        price: 2569.25,
        stockQuantity: 5,
        createdAt: new Date('2023-05-17T19:12:23.346Z'),
        updatedAt: new Date('2023-05-17T19:12:23.346Z'),
      });

      const { data, message } = await productsService.update({
        condition: { id: 1 },
        body: {
          price: 2569.25,
        },
      });

      expect(data.price).toEqual(2569.25);
      expect(message).toEqual(['Atualizado com sucesso.']);
    });

    it('Deve retornar um erro caso a condição seja inválida', async () => {
      jest
        .spyOn(mockProductsRepository, 'update')
        .mockResolvedValue({ generatedMaps: [], raw: [], affected: 0 });

      await expect(
        productsService.update({
          condition: { id: 111 },
          body: {
            price: 2569.25,
          },
        }),
      ).rejects.toThrow(
        new HttpException(
          { message: [DefaultMessages.DATA_NOT_FOUND], data: null },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('Busca de produtos', () => {
    it('Método findOne deve ser chamado com os argumentos corretos', async () => {
      jest.spyOn(mockProductsRepository, 'findOne').mockResolvedValue({
        id: 1,
        name: "Tv 20'",
        price: 1569.25,
        stockQuantity: 5,
        createdAt: new Date('2023-05-17T19:12:23.346Z'),
        updatedAt: new Date('2023-05-17T19:12:23.346Z'),
      });

      await productsService.findOne({
        condition: { id: 1 },
        relationsEntities: [],
      });

      expect(mockProductsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [],
      });
    });

    it('Deve retornar um produto existente', async () => {
      const condition = { id: 1 };
      const relationsEntities = [];

      const expectedData = {
        id: 1,
        name: "Tv 20'",
        price: 1569.25,
        stockQuantity: 5,
        createdAt: new Date('2023-05-17T19:12:23.346Z'),
        updatedAt: new Date('2023-05-17T19:12:23.346Z'),
      };

      jest
        .spyOn(mockProductsRepository, 'findOne')
        .mockResolvedValue(expectedData);

      const result = await productsService.findOne({
        condition,
        relationsEntities,
      });

      expect(result).toEqual({
        message: ['Consulta realizada com sucesso.'],
        data: expectedData,
      });
    });
    it('Deve retornar um erro caso o produto não exista', async () => {
      const condition = { id: 1 };
      const relationsEntities = [];

      jest.spyOn(mockProductsRepository, 'findOne').mockResolvedValue(null);

      await expect(
        productsService.findOne({ condition, relationsEntities }),
      ).rejects.toThrow(
        new HttpException(
          { message: [DefaultMessages.DATA_NOT_FOUND], data: null },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
    it('Deve retornar resultados paginados no findAll', async () => {
      const params = {
        tableName: 'products',
        whereFilters: [{ name: 'tv 40' }],
        order: {
          orderByColumn: 'name',
          orderDirection: 'ASC' as const,
        },
        relationsEntities: [],
        perPage: 10,
        page: 1,
      };

      const result = await productsService.findAll(params);

      expect(mockProductsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'products',
      );

      expect(
        mockProductsRepository.createQueryBuilder().select,
      ).toHaveBeenCalled();

      expect(
        mockProductsRepository.createQueryBuilder().where,
      ).toHaveBeenCalledWith({
        name: 'tv 40',
      });

      expect(
        mockProductsRepository.createQueryBuilder().orderBy,
      ).toHaveBeenCalledWith('products.name', 'ASC', 'NULLS LAST');

      expect(
        mockProductsRepository.createQueryBuilder().take,
      ).toHaveBeenCalledWith(10);

      expect(
        mockProductsRepository.createQueryBuilder().getManyAndCount,
      ).toHaveBeenCalled();

      expect(
        mockProductsRepository.createQueryBuilder().skip,
      ).toHaveBeenCalledWith(0);

      expect(result).toEqual({
        total: 0,
        lastPage: 0,
        page: 1,
        perPage: 10,
        data: [],
        message: ['Consulta realizada com sucesso.'],
      });
    });
  });

  describe('Deletar um produto', () => {
    it(' repository.delete deve ser chamado com as condições corretas', async () => {
      const condition = { id: 1 };

      const deleteResult = { affected: 1, raw: [] };

      jest
        .spyOn(mockProductsRepository, 'delete')
        .mockResolvedValue(deleteResult);

      await productsService.remove(condition);

      expect(mockProductsRepository.delete).toHaveBeenCalledWith(condition);
    });

    it('Deve retornar uma mensagem de sucesso quando um dado for deletado com sucesso', async () => {
      const condition = { id: 1 };
      const deleteResult = { affected: 1, raw: [] };

      jest
        .spyOn(mockProductsRepository, 'delete')
        .mockResolvedValue(deleteResult);

      const result = await productsService.remove(condition);

      expect(result).toEqual({
        message: ['Deletado com sucesso.'],
        data: null,
      });
    });

    it('Deve retornar um erro quando nenhum dado é encontrado', async () => {
      const condition = { id: 11 };
      const deleteResult = { affected: 0, raw: [] };

      jest
        .spyOn(mockProductsRepository, 'delete')
        .mockResolvedValue(deleteResult);

      await expect(productsService.remove(condition)).rejects.toThrow(
        new HttpException(
          { message: [DefaultMessages.DATA_NOT_FOUND], data: null },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });
});
