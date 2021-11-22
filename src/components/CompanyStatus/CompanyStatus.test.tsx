import { render, screen } from "@testing-library/react";
import { CompanyStatus } from "./CompanyStatus";

xit("init renders with all options chosen", () => {
  // @ts-ignore
  render(<CompanyStatus />);
  expect(screen.getByText(/Potential/)).toBeInTheDocument();
  expect(screen.getByText(/Working/)).toBeInTheDocument();
  expect(screen.getByText(/Not working/)).toBeInTheDocument();
});
