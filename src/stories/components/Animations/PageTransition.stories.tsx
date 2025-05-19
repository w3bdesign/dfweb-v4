import React from "react";
import { Meta } from "@ladle/react";
import PageTransition from "@/components/Animations/PageTransition.component";
import "@/app/globals.css";

export default {
  title: "Animations/PageTransition",
  component: PageTransition,
} as Meta;

// Default page transition with simple content
export const Default = () => (
  <PageTransition>
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-white text-xl mb-4">Page Content</h2>
      <p className="text-gray-300">
        This content will have a fade in/out transition when the component
        mounts or unmounts.
      </p>
    </div>
  </PageTransition>
);

// Page transition with custom CSS class
export const WithCustomClass = () => (
  <PageTransition cssClass="max-w-2xl mx-auto border-2 border-green-500 rounded-xl overflow-hidden">
    <div className="p-6 bg-slate-800">
      <h2 className="text-white text-xl mb-4">Styled Container</h2>
      <p className="text-gray-300">
        This content has a custom CSS class applied to the transition wrapper.
      </p>
    </div>
  </PageTransition>
);

// Multiple transitions side by side
export const MultipleTransitions = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <PageTransition>
      <div className="p-6 bg-blue-900 rounded-lg h-full">
        <h2 className="text-white text-xl mb-4">First Panel</h2>
        <p className="text-gray-300">This is the first transition panel.</p>
      </div>
    </PageTransition>

    <PageTransition>
      <div className="p-6 bg-purple-900 rounded-lg h-full">
        <h2 className="text-white text-xl mb-4">Second Panel</h2>
        <p className="text-gray-300">This is the second transition panel.</p>
      </div>
    </PageTransition>
  </div>
);

// Page transition with a form
export const WithForm = () => (
  <PageTransition>
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-white text-xl mb-4">Contact Form</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-1">Name</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Message</label>
          <textarea
            className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
            rows={4}
            placeholder="Your message here..."
          ></textarea>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit
        </button>
      </form>
    </div>
  </PageTransition>
);
