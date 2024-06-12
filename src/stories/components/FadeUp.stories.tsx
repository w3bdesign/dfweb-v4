import React from 'react';
import { Meta, Story } from '@ladle/react';
import FadeUp from '../../components/Animations/FadeUp.component';
import { IAnimateWithDelayProps } from '../../components/Animations/types/Animations.types';

export default {
  title: 'FadeUp',
  component: FadeUp,
} as Meta;

const Template: Story<IAnimateWithDelayProps> = (args) => <FadeUp {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Fade Up Animation',
  cssClass: 'p-4 bg-gray-100 border border-gray-300 rounded',
  delay: 0,
};

export const WithDelay = Template.bind({});
WithDelay.args = {
  children: 'Fade Up with Delay',
  cssClass: 'p-4 bg-blue-100 border border-blue-300 rounded',
  delay: 1,
};

export const CustomStyles = Template.bind({});
CustomStyles.args = {
  children: 'Fade Up with Custom Styles',
  cssClass: 'p-4 bg-green-100 border border-green-300 rounded shadow-lg',
  delay: 0.5,
};
