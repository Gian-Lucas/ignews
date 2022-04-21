import { fireEvent, render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { signIn, useSession } from "next-auth/react";
import { SubscribeButton } from ".";
import { useRouter } from "next/router";

jest.mock("next-auth/react");

jest.mock("next/router");

describe("SubscribeButton component", () => {
  it("render correctly", () => {
    const useSessionMoked = mocked(useSession);

    useSessionMoked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe Now")).toBeInTheDocument();
  });

  it("redirects user to sign in when not authenticated", () => {
    const useSessionMoked = mocked(useSession);
    const signInMoked = mocked(signIn);

    useSessionMoked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(<SubscribeButton />);
    const subscribeButton = screen.getByText("Subscribe Now");

    fireEvent.click(subscribeButton);

    expect(signInMoked).toHaveBeenCalled();
  });

  it("redirects to posts when user already has a subscription", () => {
    const useRouterMoked = mocked(useRouter);
    const useSessionMoked = mocked(useSession);
    const pushMock = jest.fn();

    useSessionMoked.mockReturnValueOnce({
      data: {
        user: { name: "John Doe", email: "jdoe@example.com" },
        activeSubscription: "fake-activeSub",
        expires: "fake expires",
      },
      status: "authenticated",
    });

    useRouterMoked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<SubscribeButton />);
    const subscribeButton = screen.getByText("Subscribe Now");

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith("/posts");
  });
});
