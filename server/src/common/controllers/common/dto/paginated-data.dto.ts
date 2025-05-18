import { IsNumber, IsOptional, Max, ValidateIf } from 'class-validator';
import config from 'src/config';

const TEMPORARY_MAX_PAGE_AMOUNT = 1000;

const {
  DEFAULT_PAGINATION: { MAX_PAGE_SIZE },
} = config;

export class GetPaginatedDataDto {
  @IsOptional()
  @ValidateIf(({ pageSize }) => !!pageSize)
  @IsNumber()
  @Max(MAX_PAGE_SIZE, {
    message: `Provided page size should be less than ${MAX_PAGE_SIZE}`,
  })
  readonly pageSize?: number;

  @IsOptional()
  @ValidateIf(({ current }) => !!current)
  @IsNumber()
  @Max(TEMPORARY_MAX_PAGE_AMOUNT, {
    message: `Provided page number should be less than ${TEMPORARY_MAX_PAGE_AMOUNT}`,
  })
  readonly current?: number;
}
