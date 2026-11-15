import { createWillChangeHandlers } from "@/components/Animations/animation-utils";

describe("createWillChangeHandlers", () => {
  it("sets will-change to opacity on start and back to auto on complete", () => {
    // Arrange
    const element = document.createElement("div");
    const { onAnimationStart, onAnimationComplete } = createWillChangeHandlers({
      current: element,
    });

    // Act
    onAnimationStart();
    const duringAnimation = element.style.willChange;
    onAnimationComplete();

    // Assert
    expect(duringAnimation).toBe("opacity");
    expect(element.style.willChange).toBe("auto");
  });

  it("does nothing when the element has unmounted", () => {
    // Arrange
    const { onAnimationStart, onAnimationComplete } = createWillChangeHandlers({
      current: null,
    });

    // Act
    const runHandlers = () => {
      onAnimationStart();
      onAnimationComplete();
    };

    // Assert
    expect(runHandlers).not.toThrow();
  });
});
