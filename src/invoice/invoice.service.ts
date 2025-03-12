import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import {
  CreateInvoiceDto,
  InvoiceIdDto,
  UpdateInvoiceDto,
} from './dtos/invoice.dto';
import { RegistryService } from 'src/registry/registry.service';
import { UserIdDto } from 'src/user/dtos/user.dto';
import { OrderBy } from 'src/types/global-types';
import { LaboratoryIdDto } from 'src/laboratory/dtos/laboratory.dto';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly ormProvider: OrmProvider,
    private readonly registryService: RegistryService,
  ) {}

  async create(args: CreateInvoiceDto, userId: UserIdDto) {
    try {
      const { registryIds, ...invoiceInfo } = args;
      const laboratoryId = await this.registryService.checkLaboratory({
        ids: registryIds,
      });

      const totalPrices = await this.registryService.calculateTotalPrices({
        ids: registryIds,
      });

      const invoice = await this.ormProvider.laboratoryInvoice.create({
        data: {
          ...invoiceInfo,
          totalRialPrice: totalPrices.totalRialPrice,
          totalUsdPrice: totalPrices.totalUsdPrice,
          Laboratory: { connect: { id: laboratoryId } },
          createdBy: { connect: { id: userId.id } },
        },
      });

      await this.registryService.assignInvoice({
        ids: registryIds,
        invoiceId: invoice.id,
        invoiceStatus: invoice.status,
      });
      return invoice;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    args: Partial<UpdateInvoiceDto>,
    { id }: InvoiceIdDto,
    userId: UserIdDto,
  ) {
    try {
      const existingInvoice =
        await this.ormProvider.laboratoryInvoice.findUnique({
          where: { id: id },
        });

      if (!existingInvoice) {
        throw new NotFoundException('invoice not found!');
      }

      if (existingInvoice.status != 'DRAFT') {
        throw new BadRequestException('invoice is already issued!');
      }

      const { registryIds, ...updateData } = args;
      const laboratoryId = registryIds
        ? await this.registryService.checkLaboratory({ ids: registryIds })
        : undefined;
      const totalPrices = registryIds
        ? await this.registryService.calculateTotalPrices({ ids: registryIds })
        : undefined;

      const newInvoice = await this.ormProvider.laboratoryInvoice.update({
        where: { id: id },
        data: {
          ...updateData,
          Laboratory: { connect: { id: laboratoryId } },
          Registries: {
            set: registryIds ? registryIds.map((id) => ({ id })) : undefined,
          },
          totalRialPrice: totalPrices ? totalPrices.totalRialPrice : undefined,
          totalUsdPrice: totalPrices ? totalPrices.totalUsdPrice : undefined,
          updatedAt: new Date(),
          updatedBy: { connect: userId },
        },
      });

      return newInvoice;
    } catch (error) {}
  }

  async findOne({ id }: InvoiceIdDto) {
    try {
      const invoice = await this.ormProvider.laboratoryInvoice.findUnique({
        where: { id: id },
      });

      return invoice;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 15,
    sortingBy: string = 'createdAt',
    orderBy: OrderBy = OrderBy.asc,
  ) {
    try {
      const skip = (page - 1) * limit;

      const invoicesCount = await this.ormProvider.laboratoryInvoice.count({});

      const invoices = await this.ormProvider.laboratoryInvoice.findMany({
        take: limit,
        skip: skip,
        orderBy: { [sortingBy]: orderBy },
        include: {
          createdBy: {
            select: { name: true, id: true, email: true, position: true },
          },
          updatedBy: {
            select: { name: true, id: true, email: true, position: true },
          },
          Laboratory: { select: { name: true } },
        },
      });

      return { invoices: invoices, totalCount: invoicesCount };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async findAByLaboratory(
    { id }: LaboratoryIdDto,
    page: number = 1,
    limit: number = 15,
    sortingBy: string = 'createdAt',
    orderBy: OrderBy = OrderBy.asc,
  ) {
    try {
      const skip = (page - 1) * limit;

      const invoicesCount = await this.ormProvider.laboratoryInvoice.count({
        where: { LaboratoryId: id },
      });

      const invoices = await this.ormProvider.laboratoryInvoice.findMany({
        where: { LaboratoryId: id },
        take: limit,
        skip: skip,
        orderBy: { [sortingBy]: orderBy },
        include: {
          createdBy: {
            select: { name: true, id: true, email: true, position: true },
          },
          updatedBy: {
            select: { name: true, id: true, email: true, position: true },
          },
          Laboratory: { select: { name: true } },
        },
      });

      return { invoices: invoices, totalCount: invoicesCount };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
