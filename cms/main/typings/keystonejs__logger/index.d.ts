import * as keystone from "@keystonejs/logger"
import { Logger } from "pino"

declare module "@keystonejs/logger" {
  function logger(name: string): Logger;
}

