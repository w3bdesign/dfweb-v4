import React from "react";
import { useForm, Path, FieldValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "./Button.component";
import InputField from "./InputField.component";

type InputType = "input" | "textarea";

type FieldConfig<T extends FieldValues> = {
  readonly name: Path<T>;
  readonly label: string;
  readonly type?: InputType;
  readonly inputPattern?: RegExp;
  readonly title?: string;
};

interface GenericFormProps<T extends z.ZodRawShape> {
  readonly formSchema: z.ZodObject<T>;
  readonly onSubmit: (data: z.infer<z.ZodObject<T>>) => Promise<void>;
  readonly fields: ReadonlyArray<FieldConfig<z.infer<z.ZodObject<T>>>>;
  readonly submitButtonText: string;
  readonly csrfToken?: string;
}

/**
 * A generic, reusable form component that can be easily customized and extended.
 * It uses Zod for schema validation and react-hook-form for form handling.
 *
 * @template T - The Zod object shape.
 * @param {Readonly<GenericFormProps<T>>} props - The props for the GenericForm component.
 * @returns {JSX.Element} The rendered form.
 */
function GenericForm<T extends z.ZodRawShape>({
  formSchema,
  onSubmit,
  fields,
  submitButtonText,
  csrfToken,
}: Readonly<GenericFormProps<T>>) {
  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <form
      id="contact-form"
      className="text-center"
      onSubmit={handleSubmit(onSubmit)}
      method="POST"
      action="/api/form"
      aria-label="Contact Form"
    >
      {csrfToken && (
        <input type="hidden" name="_csrf" value={csrfToken} />
      )}
      <fieldset>
        <legend className="text-center mx-auto text-xl mt-4 sr-only">
          Kontaktskjema
        </legend>
        {fields.map((field) => (
          <React.Fragment key={field.name}>
            <InputField<FormData>
              name={field.name}
              label={field.label}
              htmlFor={field.name}
              register={register}
              error={
                (errors[field.name] as { message?: string })?.message ??
                undefined
              }
              isRequired
              type={field.type}
              inputPattern={field.inputPattern}
              title={field.title}
            />
            <br />
          </React.Fragment>
        ))}
      </fieldset>
      <div className="-mt-4">
        <Button disabled={isSubmitting} data-testid="submit-button">
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}

export default GenericForm;
