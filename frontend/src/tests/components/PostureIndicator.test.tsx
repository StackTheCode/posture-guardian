import { render,screen } from "@testing-library/react";
import { describe ,expect,it} from "vitest";
import { PostureIndicator } from "../../components/dashboard/PostureIndicator";
import { PostureState } from "../../types";

describe("PostureIndicator",() =>{
    it("renders good posture state correctly",() =>{
        render(
            <PostureIndicator
            state={PostureState.GOOD}
            confidence={0.85}
            severity={0.2}/>
        )
        expect(screen.getByText("Excellent Posture")).toBeInTheDocument();
        expect(screen.getByText("85% confident")).toBeInTheDocument();
    });

    it("renders bad posture state correctly",() =>{
        render(
            <PostureIndicator
            state={PostureState.SLOUCHED}
            confidence={0.90}
            severity={0.75}
            />
        );
         expect(screen.getByText("Needs Attention")).toBeInTheDocument();
        expect(screen.getByText("90% confident")).toBeInTheDocument();
    });

    it('renders forward lean state correctly', () => {
    render(
      <PostureIndicator
        state={PostureState.FORWARD_LEAN}
        confidence={0.80}
        severity={0.45}
      />
    );

    expect(screen.getByText('Minor lean')).toBeInTheDocument();
  });


  it("displays the severity percentage correctly",() =>{
    render(
        <PostureIndicator
        state={PostureState.SLOUCHED}
        confidence={0.85}
        severity={0.65}
        />
    );
    expect(screen.getByText("Severity: 65%")).toBeInTheDocument();
  })


})