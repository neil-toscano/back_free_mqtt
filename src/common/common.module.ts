import { Module } from '@nestjs/common';
import { DateScalar } from './providers/date.scalar';

@Module({
  providers: [DateScalar],
  exports: [],
})
export class CommonModule {}
