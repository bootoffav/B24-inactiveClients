import { render, screen } from "@testing-library/react";
import Export from "./Export";

it("renders excel download button", () => {
  // @ts-ignore
  render(<Export />);
  expect(screen.getByText("Export to Excel")).toBeInTheDocument();
});
