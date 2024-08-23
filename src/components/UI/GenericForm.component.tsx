import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from './Button.component';
import InputField from './InputField.component';

interface GenericFormProps<T extends z.ZodType<any, any>> {
  formSchema: T;
  onSubmit: (data: z.infer<T>) => Promise<void>;
  fields: Array<{
    name: keyof z.infer<T>;
    label: string;
    type?: string;
    inputPattern?: RegExp;
    title?: string;
  }>;
  submitButtonText: string;
}

function GenericForm<T extends z.ZodType<any, any>>({
  formSchema,
  onSubmit,
  fields,
  submitButtonText,
}: GenericFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<T>>({
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
          <React.Fragment key={field.name.toString()}>
            <InputField<z.infer<T>>
              name={field.name}
              label={field.label}
              htmlFor={field.name.toString()}
              register={register}
              error={errors[field.name]?.message?.toString()}
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
        <Button disabled={isSubmitting}>{submitButtonText}</Button>
      </div>
    </form>
  );
}

export default GenericForm;