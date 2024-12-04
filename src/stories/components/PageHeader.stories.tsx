import React from "react";
import { Meta, Story } from "@ladle/react";
import PageHeader, { IPageHeaderProps } from "../../components/UI/PageHeader.component";

export default {
  title: "PageHeader",
  component: PageHeader,
} as Meta;

const Template: Story<IPageHeaderProps> = (args) => <PageHeader {...args} />;

export const BasicText = Template.bind({});
BasicText.args = {
  children: "Welcome to My Page",
};

export const WithHtmlElements = Template.bind({});
WithHtmlElements.args = {
  children: (
    <>
      Welcome to <span className="text-blue-400">My Page</span>
    </>
  ),
};

export const LongText = Template.bind({});
LongText.args = {
  children: "This is a longer page header that demonstrates how the component handles more content",
};
