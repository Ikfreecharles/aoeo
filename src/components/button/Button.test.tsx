import Button from "./Button";
import { render } from "@testing-library/react";

describe("Button component", () => {
  test("should test button is active", () => {
    render(<Button />);
  });
});
