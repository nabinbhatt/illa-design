import { act, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { globalColor, illaPrefix } from "@illa-design/theme"
import { iconColorMap } from "@illa-design/alert"
import userEvent from "@testing-library/user-event"
import { Message, MessageGroup, MessageType, useMessage } from "../src"

describe("Open Message", () => {
  const message = useMessage()

  beforeEach(() => {
    act(() => {
      jest.useFakeTimers()
    })
  })
  afterEach(() => {
    act(() => {
      message.clear
      jest.runAllTimers()
    })
  })
  test("Message renders with different type", async () => {
    const types: MessageType[] = [
      "info",
      "success",
      "error",
      "warning",
      "normal",
      "loading",
    ]
    types.forEach((type) => {
      Message[type]({
        content: `${type}`,
        id: `${type}`,
      })
    })

    types.forEach((type) => {
      expect(screen.getByText(type)).toBeInTheDocument()
      type !== "normal" &&
        expect(screen.getByText(type).previousSibling).toHaveStyle({
          marginRight: 8,
          fontSize: 16,
          color: `${iconColorMap[type]}`,
        })
    })
  })

  test("Message renders with no icon", () => {
    render(<MessageGroup />)
    message.normal({
      content: "Message",
    })
    expect(screen.getByText("Message").parentNode?.parentNode).toHaveStyle({
      paddingLeft: 16,
    })
  })

  test("Message renders with close action", async () => {
    render(<MessageGroup />)
    const handleClose = jest.fn()
    message.info({
      content: "Content",
      closable: true,
      onClose: handleClose,
    })

    const closBtn = screen.getByText("Content").nextSibling
    expect(closBtn).toBeInTheDocument()
    expect(closBtn).toHaveStyle({
      fontSize: 8,
      color: `${globalColor(`--${illaPrefix}-grayBlue-03`)}`,
      cursor: "pointer",
    })
    await userEvent.click(closBtn as Element)
    expect(handleClose).toBeCalled()
  })

  test("Message renders with update", async () => {
    render(<MessageGroup />)
    message.info({
      content: "Title",
      duration: 0,
    })
    message.info({
      content: "updateBefore",
      id: "Before",
      duration: 0,
    })

    const instance = screen.getByText("updateBefore")
    expect(instance.innerHTML).toBe("updateBefore")
    message.info({
      content: "After",
      id: "Before",
    })

    expect(instance.innerHTML).toBe("After")
  })

  test("Message renders with global config", async () => {
    render(<MessageGroup />)
    message.info({
      content: "Before",
    })
    render(<div data-testid="body" id={"container"} />)
    message.config({
      maxCount: 1,
      duration: 0,
    })

    message.info({
      content: "Old",
      id: "old",
    })

    expect(screen.getByTestId("body")).toBeInTheDocument()
    expect(screen.getByTestId("body").firstChild).toBeInTheDocument()

    const instance = screen.getByText("Old")
    expect(instance).toBeInTheDocument()
    message.info({
      content: "New",
      id: "new",
    })
    expect(screen.getByText("New")).toBeInTheDocument()
  })
})
