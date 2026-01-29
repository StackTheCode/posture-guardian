import { render,screen } from "@testing-library/react";
import { describe ,expect, it} from "vitest";
import { GlassCard } from "../../components/ui/GlassCard";

describe('GlassCard',() =>{
  it('renders children correctly', () => {
    render(
      <GlassCard>
        <p>Test Content</p>
      </GlassCard>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
})

it('applies custom classname',() =>{
    const {container} = render(
        <GlassCard className="custom-class">
            <p>Test</p>
        </GlassCard>
    );
    const card = container.firstChild;
    expect(card).toHaveClass("custom-class")
})
it("renders without hover animation when hover is false",() =>{
    const {container} = render(
        <GlassCard hover={false}>
            <p>Test</p>
        </GlassCard>
    )
    expect(container.firstChild).toBeInTheDocument();
})
})