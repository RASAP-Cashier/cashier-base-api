import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Public } from '@/common/decorators';
import { WidgetService } from './widget.service';
import {
  IGetWidgetSettingsParams,
  IGetWidgetSettingsResponse,
  ISaveWidgetSettingsParams,
  ISaveWidgetSettingsResponse,
  IWidgetPayParams,
  IWidgetPayResponse,
} from './widget.interface';

@Controller('widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Public()
  @Get('/settings')
  async getSettings(
    @Body() params: IGetWidgetSettingsParams,
  ): Promise<IGetWidgetSettingsResponse> {
    return this.widgetService.getSettings(params);
  }

  @Public()
  @Post('/settings')
  async saveSettings(@Body() params: ISaveWidgetSettingsParams): Promise<ISaveWidgetSettingsResponse> {
    return this.widgetService.saveSettings(params);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/pay')
  async login(@Body() params: IWidgetPayParams): Promise<IWidgetPayResponse> {
    return this.widgetService.pay(params);
  }
}
