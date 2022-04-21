import { render, screen } from "@testing-library/react";
import { SignInButton } from ".";
import { mocked } from "jest-mock";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react");

describe("SignInButton component", () => {
  it("render correctly when user is not signed in", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(<SignInButton />);

    expect(screen.getByText("Sign in with GitHub")).toBeInTheDocument();
  });

  it("render correctly when user is signed in", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { name: "John Doe", email: "jdoe@example.com" },
        expires: "fake expires",
      },
      status: "authenticated",
    });

    render(<SignInButton />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
