import { BadRequestException, Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import { CreateInvoiceDto } from './dtos/invoice.dto';
import { RegistryService } from 'src/registry/registry.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly ormProvider: OrmProvider,
    private readonly registryService: RegistryService,
  ) {}

  async create(args: CreateInvoiceDto, userId: string) {
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
          createdBy: { connect: { id: userId } },
        },
      });

      await this.registryService.assignInvoice(
        { ids: registryIds },
        { id: invoice.id },
      );
      return invoice;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
