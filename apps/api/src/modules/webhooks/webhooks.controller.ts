import { Body, Controller, Headers, Param, Post } from "@nestjs/common";
import { WebhooksService } from "./webhooks.service";

@Controller("webhooks")
export class WebhooksController {
  constructor(private readonly webhooks: WebhooksService) {}

  @Post(":provider")
  receive(@Param("provider") provider: string, @Body() body: unknown, @Headers("x-signature") signature?: string) {
    return this.webhooks.receive(provider.toUpperCase(), body, signature);
  }
}
