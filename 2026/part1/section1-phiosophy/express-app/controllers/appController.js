import { getHello as getHelloService } from '../services/appService.js';

export function getHello(_req, res) {
  return res.send(getHelloService());
}
