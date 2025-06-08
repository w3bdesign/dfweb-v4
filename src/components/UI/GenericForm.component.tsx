import React from "react";
import { useForm, Path, FieldValues } from "react-hook-form";
import { z, AnyZodObject } from "zod";
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

interface GenericFormProps<TSchema extends AnyZodObject> {
  readonly formSchema: TSchema;
  readonly onSubmit: (data: z.infer<TSchema>) => Promise<void>;
  readonly fields: ReadonlyArray<FieldConfig<z.infer<TSchema>>>;
  readonly submitButtonText: string;
}

/**
 * A generic, reusable form component that can be easily customized and extended.
 * It uses Zod for schema validation and react-hook-form for form handling.
 *
 * @template TSchema - The Zod schema type for form validation.
 * @param {Readonly<GenericFormProps<TSchema>>} props - The props for the GenericForm component.
 * @returns {JSX.Element} The rendered form.
 */
function GenericForm<TSchema extends AnyZodObject>({
  formSchema,
  onSubmit,
  fields,
  submitButtonText,
}: Readonly<GenericFormProps<TSchema>>) {
  type FormData = z.infer<TSchema>;

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
              error={errors[field.name]?.message as string | undefined}
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
