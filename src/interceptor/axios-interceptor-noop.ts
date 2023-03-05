import { AxiosUIData } from "../types";

export default class AxiosInterceptorNoop {
  constructor(
    interceptId?: string,
    options?: { timeout?: number; debugHeader: { key: string; value: string } }
  ) {}

  public clear(): void {}
  public intercept(): void {}
  public eject(): void {}
  public getData(
    options: { eject: boolean } = { eject: true }
  ): AxiosUIData {
    return {};
  }
}
