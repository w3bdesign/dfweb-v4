'use server'

import { z } from "zod";

/**
 * Generic server action for handling form submissions
 * @param formData The form data to process
 * @param schema The Zod schema to validate against
 * @returns Result of the form submission
 */
export async function handleFormSubmission<T extends z.ZodType>(
  formData: FormData,
  schema: T
) {
  try {
    // Convert FormData to plain object
    const formObject = Object.fromEntries(formData.entries());
    
    // Validate the data
    const validatedData = schema.parse(formObject);
    
    // Process the form data
    // TODO: Implement your form processing logic here
    // For example, sending emails, saving to database, etc.
    
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors
      };
    }
    
    return {
      success: false,
      errors: [{ message: 'An unexpected error occurred' }]
    };
  }
}

/**
 * Example of a specific form action for contact form
 * @param formData The contact form data
 */
export async function handleContactForm(formData: FormData) {
  const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    message: z.string().min(10, 'Message must be at least 10 characters')
  });

  return handleFormSubmission(formData, contactSchema);
}
