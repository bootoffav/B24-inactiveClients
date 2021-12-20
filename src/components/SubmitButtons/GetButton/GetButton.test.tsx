import { getByText, render, screen, within } from "@testing-library/react";
import GetButton from "./GetButton";

it("renders proper button text", () => {
  render(<GetButton started={true} setStarted={null} abort={() => {}} />);
  expect(screen.getByText(/Cancel/)).toBeInTheDocument();

  render(<GetButton started={false} setStarted={null} abort={() => {}} />);
  expect(screen.getByText(/Get/)).toBeInTheDocument();
});

// const { getByText } = render(<MyComponent />);
// const messages = getByText("messages");
// const helloMessage = within(messages).getByText("hello");
