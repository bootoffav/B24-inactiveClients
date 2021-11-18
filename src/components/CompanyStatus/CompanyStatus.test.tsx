import { render, screen } from "@testing-library/react";
import { CompanyStatus } from "./CompanyStatus";
import { initCompanyStatuses } from "../Form";

it("init renders with all options chosen", () => {
  render(<CompanyStatus options={initCompanyStatuses} />);
  expect(screen.getByText(/Potential/)).toBeInTheDocument();
  expect(screen.getByText(/Working/)).toBeInTheDocument();
  expect(screen.getByText(/Not working/)).toBeInTheDocument();
});
