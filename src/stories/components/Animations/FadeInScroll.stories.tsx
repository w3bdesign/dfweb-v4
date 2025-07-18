import type { Story } from "@ladle/react";
import FadeInScroll from "@/components/Animations/FadeInScroll.component";

export default {
  title: "Animations/FadeInScroll",
};

export const Default: Story<{}> = () => (
  <div className="h-[200vh] pt-[100vh]">
    <FadeInScroll>
      <div className="p-4 bg-green-500 rounded">Fade In on Scroll</div>
    </FadeInScroll>
  </div>
);

export const CustomViewAmount: Story<{}> = () => (
  <div className="h-[200vh] pt-[100vh]">
    <FadeInScroll viewAmount={0.8}>
      <div className="p-4 bg-green-500 rounded">Fade In with 80% visible</div>
    </FadeInScroll>
  </div>
);
