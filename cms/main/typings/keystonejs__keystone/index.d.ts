import * as keystone from "@keystonejs/keystone";
import { type } from "os";

declare module "@keystonejs/keystone" {
  type Operation = "create" | "read" | "update" | "delete" | "auth";

  interface AuthenticationContext {
    operation: Operation;
  }

  interface TextFieldOptions extends BaseFieldOptions {
    isMultiline?: boolean;
  }

  interface _ListSchema<Fields extends string = string> {
    fields: { [fieldName in Fields]: AllFieldsOptions | TextFieldOptions };
    listAdapterClass?: any;
    access?: Access;
    plugins?: Plugin[];
    hooks?: Hooks;
    labelResolver?: (item: { [fieldName in Fields]: any }) => string;
  }

  interface Keystone {
    createList<Fields extends string>(
      name: string,
      schema: _ListSchema<Fields>
    ): void;
  }
}
