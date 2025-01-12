import { Controller, Get, Head, Header, Response } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { WellKnownService } from './well-known.service';

/**
 * This controller is used to handle well-known URIs.
 *
 * It exposes the Thing Description document via `/.well-known/wot` and
 * implements the CoRE Link Format introduction method via `/.well-known/core`.
 *
 * @see https://w3c.github.io/wot-discovery/#introduction-well-known
 * @see https://w3c.github.io/wot-discovery/#introduction-core-rd-sec
 */
@ApiTags('Introduction')
@Controller('.well-known')
export class WellKnownController {
  public constructor(private readonly service: WellKnownService) {}

  @Get('wot')
  @Header('Content-type', 'application/td+json')
  public thingDescription() {
    return this.service.getThingDescription();
  }

  @Head('wot')
  @Header('Content-type', 'application/td+json')
  @ApiExcludeEndpoint()
  public async ping(@Response() response: FastifyReply) {
    const size = await this.service.size();
    response.header('Content-length', `${size}`);
    await response.send();
  }

  @Get('core')
  @Header('Content-type', 'application/link-format')
  public wellKnownCore() {
    return '</.well-known/wot>;rt="wot.directory";ct=432';
  }
}
