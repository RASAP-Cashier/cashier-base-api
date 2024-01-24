import { Injectable } from '@nestjs/common';
import {
  IGetWidgetSettingsParams,
  IGetWidgetSettingsResponse,
  ISaveWidgetSettingsParams,
  ISaveWidgetSettingsResponse,
  IWidgetPayParams,
  IWidgetPayResponse,
} from './widget.interface';

@Injectable()
export class WidgetService {
  constructor() {} //

  public async getSettings(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: IGetWidgetSettingsParams,
  ): Promise<IGetWidgetSettingsResponse> {
    // TODO implement
    return Promise.resolve({});
  }

  public async saveSettings(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ISaveWidgetSettingsParams,
  ): Promise<ISaveWidgetSettingsResponse> {
    // TODO implement
    return Promise.resolve({});
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async pay(params: IWidgetPayParams): Promise<IWidgetPayResponse> {
    // TODO implement
    return Promise.resolve({});
  }
}
