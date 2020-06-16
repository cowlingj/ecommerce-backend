import * as keystone from "@keystonejs/keystone";
import { FieldType } from "@keystonejs/fields";

declare module "@keystonejs/keystone" {
  type Operation = "create" | "read" | "update" | "delete" | "auth";

  interface AuthenticationContext {
    operation: Operation;
  }

  interface BaseFieldOptions {
    label?: string
    type: FieldType
    isRequired?: boolean
    isUnique?: boolean
    hooks?: Hooks
    access?: Access
  }

  interface TextFieldOptions extends BaseFieldOptions {
    isMultiline?: boolean;
  }

  interface _ListSchema<Fields extends string = string> {
    listQueryName?: string
    label?: string
    plural?: string
    labelField?: Fields[keyof Fields]
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
