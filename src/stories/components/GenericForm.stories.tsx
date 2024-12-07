import React from "react";
import { Meta } from "@ladle/react";
import { z } from "zod";
import GenericForm from "../../components/UI/GenericForm.component";

export default {
  title: "GenericForm",
  component: GenericForm,
} as Meta;

// Example schemas
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  preferences: z.string().min(1, "Please select your preferences"),
});

const feedbackSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  rating: z.string().regex(/^[1-5]$/, "Rating must be between 1 and 5"),
  feedback: z.string().min(20, "Feedback must be at least 20 characters"),
});

type FormData = z.infer<typeof contactSchema> | 
                z.infer<typeof subscribeSchema> | 
                z.infer<typeof feedbackSchema> |
                { email: string };

// Example async submit handlers
const mockSubmit = async (data: FormData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // eslint-disable-next-line no-console
  console.log("Form submitted:", data);
};

// Contact Form Story
export const ContactForm = () => (
  <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg">
    <h2 className="text-2xl text-white mb-6">Contact Us</h2>
    <GenericForm
      formSchema={contactSchema}
      onSubmit={mockSubmit}
      submitButtonText="Send Message"
      fields={[
        {
          name: "name",
          label: "Your Name",
          type: "input",
        },
        {
          name: "email",
          label: "Email Address",
          type: "input",
          inputPattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          title: "Please enter a valid email address",
        },
        {
          name: "message",
          label: "Your Message",
          type: "textarea",
        },
      ]}
    />
  </div>
);

// Subscribe Form Story
export const SubscribeForm = () => (
  <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg">
    <h2 className="text-2xl text-white mb-6">Subscribe to Newsletter</h2>
    <GenericForm
      formSchema={subscribeSchema}
      onSubmit={mockSubmit}
      submitButtonText="Subscribe"
      fields={[
        {
          name: "email",
          label: "Email Address",
          type: "input",
          inputPattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          title: "Please enter a valid email address",
        },
        {
          name: "preferences",
          label: "Newsletter Preferences",
          type: "textarea",
        },
      ]}
    />
  </div>
);

// Feedback Form Story
export const FeedbackForm = () => (
  <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg">
    <h2 className="text-2xl text-white mb-6">Provide Feedback</h2>
    <GenericForm
      formSchema={feedbackSchema}
      onSubmit={mockSubmit}
      submitButtonText="Submit Feedback"
      fields={[
        {
          name: "title",
          label: "Feedback Title",
          type: "input",
        },
        {
          name: "rating",
          label: "Rating (1-5)",
          type: "input",
          inputPattern: /^[1-5]$/,
          title: "Please enter a number between 1 and 5",
        },
        {
          name: "feedback",
          label: "Detailed Feedback",
          type: "textarea",
        },
      ]}
    />
  </div>
);

// Simple Form Story
export const SimpleForm = () => (
  <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg">
    <h2 className="text-2xl text-white mb-6">Quick Contact</h2>
    <GenericForm
      formSchema={z.object({
        email: z.string().email("Invalid email address"),
      })}
      onSubmit={mockSubmit}
      submitButtonText="Contact"
      fields={[
        {
          name: "email",
          label: "Email Address",
          type: "input",
          inputPattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          title: "Please enter a valid email address",
        },
      ]}
    />
  </div>
);
