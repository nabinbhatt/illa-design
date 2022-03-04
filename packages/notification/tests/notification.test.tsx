import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import "@testing-library/jest-dom"
import * as React from "react"
import { globalColor, illaPrefix } from "@illa-design/theme"
import { iconColorMap } from "@illa-design/alert"

import { Button } from "@illa-design/button"
import Notification, { NotificationType } from "../src"

describe("Open Notification", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    Notification.clear()
    jest.runAllTimers()
  })
  test("Notification renders with different type", () => {
    const types: NotificationType[] = [
      "info",
      "success",
      "error",
      "warning",
      "normal",
    ]
    types.forEach((type) => {
      Notification[type]({
        title: `${type}`,
        content: "Content",
        id: `${type}`,
      })
      expect(screen.getByText(type)).toBeInTheDocument()

      type !== "normal" &&
        expect(screen.getByText(type).parentNode?.previousSibling).toHaveStyle({
          paddingRight: 8,
          fontSize: 16,
          color: `${iconColorMap[type]}`,
        })
    })
  })

  test("Notification renders with close action", async () => {
    const handleClose = jest.fn()
    const handleAfterClose = jest.fn()
    Notification.info({
      title: "Close",
      content: "Content",
      closable: true,
      onClose: handleClose,
      afterClose: handleAfterClose,
    })
    const closBtn = screen.getByText("Close").parentNode?.nextSibling
    expect(closBtn).toBeInTheDocument()
    expect(closBtn).toHaveStyle({
      fontSize: 8,
      color: `${globalColor(`--${illaPrefix}-gray-03`)}`,
      cursor: "pointer",
    })
    fireEvent.click(closBtn as Element)
    expect(handleClose).toBeCalled()
    await waitFor(
      () => {
        expect(handleAfterClose).toBeCalled()
      },
      {
        timeout: 500,
      },
    )
  })

  test("Notification renders with action button", async () => {
    Notification.info({
      title: `Action`,
      content: "Content",
      action: <Button data-testid={"notify-action"}>OK</Button>,
    })
    const action = screen.getByTestId("notify-action").parentNode
    expect(action).toBeInTheDocument()
    expect(action).toHaveStyle({
      textAlign: "right",
      marginTop: 16,
    })
  })

  test("Notification renders with duration", async () => {
    Notification.info({
      title: `Default`,
      content: "Content",
    })
    let instance = screen.getByText("Default")
    expect(instance).toBeInTheDocument()
    await waitFor(
      () => {
        expect(instance).not.toBeInTheDocument()
      },
      {
        timeout: 3500,
      },
    )
    Notification.info({
      title: `New duration`,
      content: "Content",
      duration: 500,
    })
    instance = screen.getByText("New duration")
    expect(instance).toBeInTheDocument()
    await waitFor(
      () => {
        expect(instance).not.toBeInTheDocument()
      },
      {
        timeout: 1500,
      },
    )
  })

  test("Notification renders with mouse action", async () => {
    Notification.info({
      title: `Default`,
      content: "Content",
      duration: 800,
    })
    let instance = screen.getByText("Default")
    fireEvent.mouseEnter(instance)
    await waitFor(
      () => {
        expect(instance).toBeInTheDocument()
      },
      {
        timeout: 1500,
      },
    )
    fireEvent.mouseLeave(instance)
    await waitFor(
      () => {
        expect(instance).not.toBeInTheDocument()
      },
      {
        timeout: 1500,
      },
    )
  })

  test("Notification renders with remove&clear", async () => {
    Notification.info({
      title: "Remove",
      id: "remove",
      action: <Button data-testid="removeBtn">Hello</Button>,
    })
    let instance = screen.getByTestId("removeBtn")
    expect(instance).toBeInTheDocument()
    Notification.remove("remove")
    await waitFor(
      () => {
        expect(instance).not.toBeInTheDocument()
      },
      {
        timeout: 800,
      },
    )
    Notification.info({
      title: "ItemA",
      id: "itemA",
    })
    Notification.info({
      title: "ItemB",
      id: "itemB",
    })
    let instanceA = screen.getByText("ItemA")
    let instanceB = screen.getByText("ItemB")
    expect(instanceA).toBeInTheDocument()
    expect(instanceB).toBeInTheDocument()
    Notification.clear()
    await waitFor(
      () => {
        expect(instanceA).not.toBeInTheDocument()
        expect(instanceB).not.toBeInTheDocument()
      },
      {
        timeout: 800,
      },
    )
  })

  test("Notification renders with update", async () => {
    Notification.info({
      title: "Title",
      duration: 0,
    })
    Notification.info({
      title: "updateBefore",
      id: "Before",
      duration: 0,
      action: <span data-testid="updateBtn">updateBefore</span>,
    })
    const instance = screen.getByTestId("updateBtn")
    expect(instance.innerHTML).toBe("updateBefore")
    Notification.info({
      title: "After",
      id: "Before",
      action: <span data-testid="updateBtn">After</span>,
    })
    expect(instance.innerHTML).toBe("After")
  })
})

test("Notification renders with global config", async () => {
  Notification.info({
    title: "Before",
    id: "before",
  })
  render(<div data-testid="container" id={"container"} />)
  Notification.config({
    maxCount: 1,
    duration: 0,
    getContainer: () => document.getElementById("container") as HTMLElement,
  })

  Notification.info({
    title: "Old",
    id: "old",
  })
  expect(screen.getByTestId("container")).toBeInTheDocument()
  expect(screen.getByTestId("container").firstChild).toBeInTheDocument()
  const instance = screen.getByText("Old")
  await waitFor(
    () => {
      expect(instance).toBeInTheDocument()
    },
    {
      timeout: 3500,
    },
  )
  Notification.info({
    title: "New",
    id: "new",
  })
  expect(instance.innerHTML).not.toBe("Old")
  expect(instance.innerHTML).toBe("New")
})
