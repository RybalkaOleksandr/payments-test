import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { GetPaginatedDataDto } from './paginated-data.dto';

export class GetTestDataDto extends GetPaginatedDataDto {
  @IsOptional()
  @ValidateIf(({ searchText }) => !!searchText)
  @IsString()
  readonly searchText?: string;

  @IsOptional()
  @IsString()
  readonly endCustomerType?: string;
}
