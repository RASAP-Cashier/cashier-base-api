import { Module } from '@nestjs/common';
import { WidgetService } from './widget.service';
import { WidgetController } from './widget.controller';

@Module({
  imports: [],
  controllers: [WidgetController],
  providers: [WidgetService],
})
export class WidgetModule {}
