import { render, screen } from "@testing-library/react";
import SendToEmailButton from "./SendToEmailButton";

it("init renders without crashing", () => {
  render(<SendToEmailButton />);
  expect(screen.getByText(/Send to email/)).toBeInTheDocument();
});
