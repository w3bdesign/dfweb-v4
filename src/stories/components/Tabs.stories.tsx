import React from "react";
import { Meta, Story } from "@ladle/react";
import Tabs from "../../components/UI/Tabs.component";

export default {
  title: "Tabs",
  component: Tabs,
} as Meta;

const Template: Story<React.ComponentProps<typeof Tabs>> = (args) => (
  <Tabs {...args} />
);

// Sample content components
const TextContent = () => (
  <div className="py-4">
    <h2 className="text-xl text-white mb-4">Text Content</h2>
    <p className="text-gray-300">
      This is a sample text content for the tab panel. It demonstrates how text
      content is displayed within the tabs component.
    </p>
  </div>
);

const ListContent = () => (
  <div className="py-4">
    <h2 className="text-xl text-white mb-4">List Content</h2>
    <ul className="list-disc list-inside text-gray-300">
      <li>First item in the list</li>
      <li>Second item in the list</li>
      <li>Third item in the list</li>
    </ul>
  </div>
);

const FormContent = () => (
  <div className="py-4">
    <h2 className="text-xl text-white mb-4">Form Content</h2>
    <form className="space-y-4">
      <div>
        <label className="block text-gray-300 mb-2">Name</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label className="block text-gray-300 mb-2">Email</label>
        <input
          type="email"
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Enter your email"
        />
      </div>
    </form>
  </div>
);

export const VerticalTabs = Template.bind({});
VerticalTabs.args = {
  orientation: "vertical",
  tabs: [
    { id: "tab1", label: "Text", content: <TextContent /> },
    { id: "tab2", label: "List", content: <ListContent /> },
    { id: "tab3", label: "Form", content: <FormContent /> },
  ],
};

export const HorizontalTabs = Template.bind({});
HorizontalTabs.args = {
  orientation: "horizontal",
  tabs: [
    { id: "tab1", label: "Text", content: <TextContent /> },
    { id: "tab2", label: "List", content: <ListContent /> },
    { id: "tab3", label: "Form", content: <FormContent /> },
  ],
};

export const ManyTabs = Template.bind({});
ManyTabs.args = {
  tabs: [
    { id: "tab1", label: "Tab 1", content: <TextContent /> },
    { id: "tab2", label: "Tab 2", content: <ListContent /> },
    { id: "tab3", label: "Tab 3", content: <FormContent /> },
    { id: "tab4", label: "Tab 4", content: <TextContent /> },
    { id: "tab5", label: "Tab 5", content: <ListContent /> },
  ],
};

export const TwoTabs = Template.bind({});
TwoTabs.args = {
  tabs: [
    { id: "tab1", label: "First Tab", content: <TextContent /> },
    { id: "tab2", label: "Second Tab", content: <ListContent /> },
  ],
};