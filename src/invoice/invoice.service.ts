import { BadRequestException, Injectable } from '@nestjs/common';
import { OrmProvider } from 'src/providers/orm.provider';
import { CreateInvoiceDto } from './dtos/invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private readonly ormProvider: OrmProvider) {}

  async create(args: CreateInvoiceDto, userId: string) {
    try {
      const { LaboratoryId, registryIds, ...invoiceInfo } = args;

      const registries = await this.ormProvider.registry.findMany({
        where: {
          id: { in: registryIds },
        },
      });

      const registryNullPrice = registries.map((registry) => {
        if (
          registry.totalPriceRial === null ||
          registry.usdExchangeRate === null ||
          registry.productPriceUsd === null
        ) {
          return registry.MotId;
        }
      });

      if (registryNullPrice.length > 0) {
        throw new BadRequestException(
          `Registries with MOT ID(s) ${registryNullPrice.join(', ')} have empty prices.`,
        );
      }

      const totalPrices = await this.ormProvider.registry.aggregate({
        where: { id: { in: registryIds } },
        _sum: {
          productPriceUsd: true,
          totalPriceRial: true,
        },
      });

      const totalUsdPrice =
        totalPrices._sum.productPriceUsd ??
        (() => {
          throw new BadRequestException('Could not calculate total USD price');
        })();
      const totalRialPrice =
        totalPrices._sum.totalPriceRial ??
        (() => {
          throw new BadRequestException('Could not calculate total Rial price');
        })();

      const invoice = await this.ormProvider.laboratoryInvoice.create({
        data: {
          ...invoiceInfo,
          totalRialPrice: totalRialPrice,
          totalUsdPrice: totalUsdPrice,
          Laboratory: { connect: { id: LaboratoryId } },
          createdBy: { connect: { id: userId } },
        },
      });

      await this.ormProvider.registry.updateMany({
        where: { id: { in: registryIds } },
        data: { LaboratoryInvoiceId: invoice.id },
      });

      return invoice;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
