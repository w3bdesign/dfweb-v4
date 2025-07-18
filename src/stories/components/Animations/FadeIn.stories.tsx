import type { Story } from "@ladle/react";
import FadeIn, {
  FadeInProps,
} from "@/components/Animations/FadeIn.component";

const FadeInStories = {
  title: "Animations/FadeIn",
};

export default FadeInStories;

export const Default: Story<FadeInProps> = () => (
  <FadeIn>
    <div className="p-4 bg-blue-500 rounded">Fade In</div>
  </FadeIn>
);

export const WithDelay: Story<FadeInProps> = () => (
  <FadeIn delay={1}>
    <div className="p-4 bg-blue-500 rounded">Fade In with Delay</div>
  </FadeIn>
);

export const LongDuration: Story<FadeInProps> = () => (
  <FadeIn duration={1.5}>
    <div className="p-4 bg-blue-500 rounded">Long Duration Fade In</div>
  </FadeIn>
);
