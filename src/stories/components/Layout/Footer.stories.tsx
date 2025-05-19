import React from "react";
import { Meta } from "@ladle/react";
import Footer from "@/components/Layout/Footer.component";
import "@/app/globals.css";

export default {
  title: "Layout/Footer",
  component: Footer,
} as Meta;

// Default footer
export const Default = () => <Footer />;

// With content above
export const WithContent = () => (
  <>
    <div className="min-h-[200px] flex items-center justify-center bg-slate-700">
      <p>Page content</p>
    </div>
    <Footer />
  </>
);

// Narrow viewport
export const NarrowViewport = () => (
  <div style={{ width: "320px" }}>
    <Footer />
  </div>
);

// Wide viewport
export const WideViewport = () => <Footer />;

// With margin top showcase
export const WithMarginTop = () => (
  <>
    <div className="min-h-[100px] flex items-center justify-center bg-slate-700">
      <p>Content area</p>
    </div>
    <Footer />
  </>
);
