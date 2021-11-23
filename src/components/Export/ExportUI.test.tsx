import { render, screen } from "@testing-library/react";
import Export from "./ExportUI";

it("renders excel download button", () => {
  // @ts-ignore
  render(<Export />);
  expect(screen.getByText("Export in Excel")).toBeInTheDocument();
});
