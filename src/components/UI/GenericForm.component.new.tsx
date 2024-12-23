'use client'

import React, { useTransition } from "react";
import { useForm, Path, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "./Button.component";
import InputField from "./InputField.component";
import { handleFormSubmission } from "@/app/actions/forms";

type InputType = "input" | "textarea";

type FieldConfig<T extends FieldValues> = {
  readonly name: Path<T>;
  readonly label: string;
  readonly type?: InputType;
  readonly inputPattern?: RegExp;
  readonly title?: string;
};

interface GenericFormProps<TSchema extends z.ZodType<FieldValues>> {
  readonly formSchema: TSchema;
  readonly onSubmit: (data: z.infer<TSchema>) => Promise<void>;
  readonly fields: ReadonlyArray<FieldConfig<z.infer<TSchema>>>;
  readonly submitButtonText: string;
}

/**
 * A generic, reusable form component that uses both react-hook-form for client-side validation
 * and server actions for form submission.
 *
 * @template TSchema - The Zod schema type for form validation.
 * @param {Readonly<GenericFormProps<TSchema>>} props - The props for the GenericForm component.
 * @returns {JSX.Element} The rendered form.
 */
function GenericForm<TSchema extends z.ZodType<FieldValues>>({
  formSchema,
  onSubmit,
  fields,
  submitButtonText,
}: Readonly<GenericFormProps<TSchema>>) {
  type FormData = z.infer<TSchema>;
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleFormSubmit = async (data: FormData) => {
    startTransition(async () => {
      try {
        // First, handle client-side submission
        await onSubmit(data);

        // Then, handle server-side submission
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value as string);
        });

        const result = await handleFormSubmission(formData, formSchema);
        if (!result.success) {
          console.error('Server validation failed:', result.errors);
        }
      } catch (error) {
        console.error('Form submission error:', error);
      }
    });
  };

  return (
    <form
      id="contact-form"
      className="text-center"
      onSubmit={handleSubmit(handleFormSubmit)}
      method="POST"
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
        <Button disabled={isPending} data-testid="submit-button">
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}

export default GenericForm;
