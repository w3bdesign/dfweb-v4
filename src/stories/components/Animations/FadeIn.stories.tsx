import type { Story } from "@ladle/react";
import FadeIn from "@/components/Animations/FadeIn.component";

export default {
  title: "Animations/FadeIn",
};

export const Default: Story<{}> = () => (
  <FadeIn>
    <div className="p-4 bg-blue-500 rounded">Fade In</div>
  </FadeIn>
);

export const WithDelay: Story<{}> = () => (
  <FadeIn delay={1}>
    <div className="p-4 bg-blue-500 rounded">Fade In with Delay</div>
  </FadeIn>
);

export const LongDuration: Story<{}> = () => (
  <FadeIn duration={1.5}>
    <div className="p-4 bg-blue-500 rounded">Long Duration Fade In</div>
  </FadeIn>
);