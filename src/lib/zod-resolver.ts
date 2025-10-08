import type { FieldError, Resolver } from "react-hook-form";
import { ZodError, type ZodIssue, type ZodSchema } from "zod";

function buildError(issue: ZodIssue): FieldError {
  return {
    type: issue.code,
    message: issue.message,
  };
}

function setDeepError(target: Record<string, unknown>, path: (string | number)[], error: FieldError) {
  let current: Record<string, unknown> = target;

  path.slice(0, -1).forEach((segment) => {
    if (current[segment as string] == null || typeof current[segment as string] !== "object") {
      current[segment as string] = {};
    }

    current = current[segment as string] as Record<string, unknown>;
  });

  current[path[path.length - 1] as string] = error;
}

type ResolverValues<TSchema extends ZodSchema> = import("zod").infer<TSchema>;

export function zodResolver<TSchema extends ZodSchema>(schema: TSchema): Resolver<ResolverValues<TSchema>> {
  return async (values: unknown) => {
    try {
      const data = await schema.parseAsync(values);
      return {
        values: data,
        errors: {},
      };
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;
        const formErrors: Record<string, unknown> = {};

        for (const issue of zodError.issues) {
          const path = issue.path.length > 0 ? issue.path : ["root"];
          setDeepError(formErrors, path, buildError(issue));
        }

        return {
          values: {},
          errors: formErrors,
        };
      }

      throw error;
    }
  };
}
