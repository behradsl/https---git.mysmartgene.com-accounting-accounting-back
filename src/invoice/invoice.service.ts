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

@Injectable()
export class InvoiceService {
  constructor(
    private readonly ormProvider: OrmProvider,
    private readonly registryService: RegistryService,
  ) {}

  async create(args: CreateInvoiceDto, userId: UserIdDto) {
    try {
      const { LaboratoryId, registryIds, ...invoiceInfo } = args;

      const totalPrices = await this.registryService.calculateTotalPrices({
        ids: registryIds,
      });

      const invoice = await this.ormProvider.laboratoryInvoice.create({
        data: {
          ...invoiceInfo,
          totalRialPrice: totalPrices.totalRialPrice,
          totalUsdPrice: totalPrices.totalUsdPrice,
          Laboratory: { connect: { id: LaboratoryId } },
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

      const { registryIds, LaboratoryId, ...updateData } = args;
      const totalPrices = registryIds
        ? await this.registryService.calculateTotalPrices({ ids: registryIds })
        : undefined;

      const newInvoice = await this.ormProvider.laboratoryInvoice.update({
        where: { id: id },
        data: {
          ...updateData,
          Laboratory: { connect: { id: LaboratoryId } },
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
}
