import { describe, it,expect } from "vitest"
import { StatsCards } from "../../components/dashboard/StatsCards"
import { render ,screen} from "@testing-library/react"
describe('StatsCards', () => {
  it('renders all stat cards', () => {
   render(
      <StatsCards
        goodPostureCount={45}
        badPostureCount={12}
        averageSeverity={0.35}
        totalEvents={57}
      />
   )

       expect(screen.getByText('Good Posture')).toBeInTheDocument();
       expect(screen.getByText("Needs Work")).toBeInTheDocument();
       expect(screen.getByText("Avg Severity")).toBeInTheDocument();
       expect(screen.getByText("Total Events")).toBeInTheDocument();

});


it("displays correct values",() =>{
  render(
    <StatsCards
    goodPostureCount={45}
    badPostureCount={12}
    averageSeverity={0.35}
    totalEvents={57}/>
  )

  expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('35%')).toBeInTheDocument();
    expect(screen.getByText('57')).toBeInTheDocument();
})

it('handles zero values correctly', () => {
    render(
      <StatsCards
        goodPostureCount={0}
        badPostureCount={0}
        averageSeverity={0}
        totalEvents={0}
      />
    );

    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

})