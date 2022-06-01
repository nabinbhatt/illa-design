import {
  cloneElement,
  FC,
  Fragment,
  isValidElement,
  MutableRefObject,
  ReactElement,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react"
import { TriggerProps } from "./interface"
import { AnimatePresence, motion } from "framer-motion"
import {
  applyAnimation,
  applyChildrenContainer,
  applyDefaultContentSize,
  applyMotionDiv,
  applyTipsContainer,
  applyTipsText,
  applyTriangleStyle,
} from "./style"
import {
  TriangleBottom,
  TriangleLeft,
  TriangleRight,
  TriangleTop,
} from "./triangle"
import {
  adjustLocation,
  AdjustResult,
  getFinalPosition,
} from "./adjust-tips-location"
import { Popup } from "./popup"
import useMeasure from "react-use/lib/useMeasure"
import useWindowSize from "react-use/lib/useWindowSize"
import { mergeRefs, throttleByRaf } from "@illa-design/system"
import useClickAway from "react-use/lib/useClickAway"
import useMouse from "react-use/lib/useMouse"
import { css } from "@emotion/react"

export const Trigger: FC<TriggerProps> = (props) => {
  const {
    _css,
    colorScheme = "gray",
    content,
    closeOnInnerClick,
    position = "top",
    clickOutsideToClose,
    showArrow = true,
    closeDelay = 150,
    openDelay = 150,
    autoFitPosition = true,
    autoAlignPopupWidth,
    closeOnClick = true,
    defaultPopupVisible,
    maxWidth = "588px",
    withoutPadding,
    disabled,
    popupVisible,
    onVisibleChange,
    trigger = "hover",
    customPosition = {},
  } = props

  const [tipVisible, setTipsVisible] = useState<boolean>(false)
  // to watch `tipVisible` change in `updatePopupPositionOnScroll`
  const tipVisibleRef = useRef<boolean>(tipVisible)
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const [windowSize, setWindowSize] = useState({
    windowWidth: 0,
    windowHeight: 0,
  })

  const childrenRef = useRef<HTMLElement>(null) as MutableRefObject<HTMLElement>

  const [adjustResult, setAdjustResult] = useState<AdjustResult>()
  const finalPosition = getFinalPosition(
    adjustResult?.opposite ?? false,
    position,
  )

  const [measureRef, measureInfo] = useMeasure<HTMLElement>()

  // delay to do sth
  let timeOutHandlerId: number | undefined
  const delayTodo = (todo: () => void, timeout: number) => {
    if (timeOutHandlerId != undefined) {
      window.clearTimeout(timeOutHandlerId)
    }
    if (timeout <= 0) {
      todo()
    } else {
      timeOutHandlerId = window.setTimeout(() => {
        todo()
        timeOutHandlerId = undefined
      }, timeout)
    }
  }

  let tipsNode: ReactNode
  let centerNode: ReactNode

  const closeContent = <div css={applyDefaultContentSize}>{content}</div>

  switch (finalPosition) {
    case "top":
    case "tl":
    case "tr":
      centerNode = (
        <div css={css(applyTipsContainer(finalPosition), _css)}>
          <div
            css={applyTipsText(
              colorScheme,
              maxWidth,
              withoutPadding,
              adjustResult,
              autoAlignPopupWidth,
            )}
          >
            {closeContent}
          </div>
          {showArrow && (
            <TriangleTop
              css={applyTriangleStyle(colorScheme, finalPosition)}
              width="8px"
              height="4px"
            />
          )}
        </div>
      )
      break
    case "bottom":
    case "bl":
    case "br":
      centerNode = (
        <div css={css(applyTipsContainer(finalPosition), _css)}>
          {showArrow && (
            <TriangleBottom
              css={applyTriangleStyle(colorScheme, finalPosition)}
              width="8px"
              height="4px"
            />
          )}
          <div
            css={applyTipsText(
              colorScheme,
              maxWidth,
              withoutPadding,
              adjustResult,
              autoAlignPopupWidth,
            )}
          >
            {closeContent}
          </div>
        </div>
      )
      break
    case "left":
    case "lt":
    case "lb":
      centerNode = (
        <div css={css(applyTipsContainer(finalPosition), _css)}>
          <div
            css={applyTipsText(
              colorScheme,
              maxWidth,
              withoutPadding,
              adjustResult,
              autoAlignPopupWidth,
            )}
          >
            {closeContent}
          </div>
          {showArrow && (
            <TriangleLeft
              css={applyTriangleStyle(colorScheme, finalPosition)}
              width="4px"
              height="8px"
            />
          )}
        </div>
      )
      break
    case "right":
    case "rt":
    case "rb":
      centerNode = (
        <div css={css(applyTipsContainer(finalPosition), _css)}>
          {showArrow && (
            <TriangleRight
              css={applyTriangleStyle(colorScheme, finalPosition)}
              width="4px"
              height="8px"
            />
          )}
          <div
            css={applyTipsText(
              colorScheme,
              maxWidth,
              withoutPadding,
              adjustResult,
              autoAlignPopupWidth,
            )}
          >
            {closeContent}
          </div>
        </div>
      )
      break
  }

  const adjustLocationAndResult = async () => {
    if (childrenRef.current != null) {
      const result = await adjustLocation(
        tipsNode,
        childrenRef.current,
        position,
        autoFitPosition,
        customPosition,
      )
      // async deal
      setAdjustResult(result)
    }
  }

  const showTips = (control?: boolean) => {
    delayTodo(async () => {
      if (childrenRef.current != null) {
        await adjustLocationAndResult()
        if (popupVisible == undefined || control) {
          setTipsVisible(true)
        }
        if (onVisibleChange != undefined) {
          if (popupVisible != undefined) {
            onVisibleChange(true)
          } else {
            if (!tipVisible) {
              onVisibleChange(true)
            }
          }
        }
      }
    }, openDelay)
  }

  const hideTips = (control?: boolean) => {
    delayTodo(() => {
      if (popupVisible == undefined || control) {
        setTipsVisible(false)
      }
      if (onVisibleChange != undefined) {
        if (popupVisible != undefined) {
          onVisibleChange(false)
        } else {
          if (tipVisible) {
            onVisibleChange(false)
          }
        }
      }
    }, closeDelay)
  }

  const [tipsMeasureRef, tipsMeasureInfo] = useMeasure<HTMLDivElement>()

  tipsNode = (
    <motion.div
      css={applyMotionDiv()}
      variants={applyAnimation(finalPosition, showArrow)}
      initial="initial"
      animate="animate"
      exit="exit"
      onMouseEnter={(event) => {
        if (!disabled && trigger == "hover") {
          showTips()
        }
      }}
      onMouseLeave={(event) => {
        if (!disabled && trigger == "hover") {
          hideTips()
        }
      }}
    >
      {centerNode}
    </motion.div>
  )

  const updatePopupPositionOnScroll = useCallback(
    throttleByRaf(async (event: UIEvent) => {
      if (
        !tipVisibleRef.current ||
        !(event.target as Element).contains(childrenRef.current)
      ) {
        return
      }

      await adjustLocationAndResult()
    }),
    [],
  )

  useEffect(() => {
    tipVisibleRef.current = tipVisible
  }, [tipVisible])

  useEffect(() => {
    let isMount = true
    const newWindowSize = { windowWidth, windowHeight }

    if (JSON.stringify(newWindowSize) !== JSON.stringify(windowSize)) {
      setWindowSize(newWindowSize)
      ;async () => await adjustLocationAndResult()
    }

    if (!disabled && childrenRef.current != null) {
      if (popupVisible == undefined) {
        if (tipVisible || defaultPopupVisible) {
          showTips()
        }
      } else {
        popupVisible ? showTips(true) : hideTips(true)
      }
    }

    window.addEventListener("scroll", updatePopupPositionOnScroll, true)

    return () => {
      isMount = false
      window.clearTimeout(timeOutHandlerId)
      updatePopupPositionOnScroll.cancel()
      window.removeEventListener("scroll", updatePopupPositionOnScroll, true)
    }
  }, [
    popupVisible,
    position,
    content,
    disabled,
    measureInfo,
    maxWidth,
    autoAlignPopupWidth,
    windowWidth,
    windowHeight,
  ])

  const protalRef = useRef<HTMLDivElement>(null)
  const { elX, elY } = useMouse(protalRef)

  useClickAway(childrenRef, () => {
    if (!disabled && clickOutsideToClose) {
      if (
        elX < 0 ||
        elX > tipsMeasureInfo.width ||
        elY < 0 ||
        elY > tipsMeasureInfo.height
      ) {
        hideTips()
      }
    }
  })

  const newProps = {
    onMouseEnter: (e: SyntheticEvent<Element, Event>) => {
      if (!disabled && trigger == "hover") {
        showTips()
      }
    },
    onMouseLeave: (e: SyntheticEvent<Element, Event>) => {
      if (!disabled && trigger == "hover") {
        hideTips()
      }
    },
    onFocus: (e: SyntheticEvent<Element, Event>) => {
      if (!disabled && trigger == "focus") {
        showTips()
      }
    },
    onBlur: (e: SyntheticEvent<Element, Event>) => {
      if (!disabled && trigger == "focus") {
        hideTips()
      }
    },
    onClick: (e: SyntheticEvent<Element, Event>) => {
      switch (trigger) {
        case "click":
          if (!disabled) {
            if (!tipVisible) {
              showTips()
            } else if (tipVisible) {
              if (closeOnClick) {
                hideTips()
              }
            }
          }
          break
        case "hover":
        case "focus":
          if (!disabled && closeOnClick && tipVisible) {
            hideTips()
          }
          break
      }
      e.stopPropagation()
    },
  }

  const protalContent = (
    <AnimatePresence>
      {!disabled && tipVisible && childrenRef.current !== null ? (
        <Popup
          ref={mergeRefs(protalRef, tipsMeasureRef)}
          onClick={() => {
            if (closeOnInnerClick) {
              hideTips(popupVisible !== undefined)
            }
          }}
          top={`${adjustResult?.transY}px`}
          left={`${adjustResult?.transX}px`}
        >
          {tipsNode}
        </Popup>
      ) : null}
    </AnimatePresence>
  )

  if (isValidElement(props.children)) {
    const finalProps = {
      ref: mergeRefs(
        (props.children as ReactElement).props?.ref ?? null,
        measureRef,
        childrenRef,
      ),
      onMouseEnter: (e: SyntheticEvent<Element, Event>) => {
        newProps.onMouseEnter(e)
        ;(props.children as ReactElement).props?.onMouseEnter?.call(e)
      },
      onMouseLeave: (e: SyntheticEvent<Element, Event>) => {
        newProps.onMouseLeave(e)
        ;(props.children as ReactElement).props?.onMouseLeave?.call(e)
      },
      onFocus: (e: SyntheticEvent<Element, Event>) => {
        newProps.onFocus(e)
        ;(props.children as ReactElement).props?.onFocus?.call(e)
      },
      onBlur: (e: SyntheticEvent<Element, Event>) => {
        newProps.onBlur(e)
        ;(props.children as ReactElement).props?.onBlur?.call(e)
      },
      onClick: (e: SyntheticEvent<Element, Event>) => {
        newProps.onClick(e)
        ;(props.children as ReactElement).props?.onClick?.call(e)
      },
    }
    return (
      <Fragment>
        {cloneElement(props.children as ReactElement, {
          key: "illa-trigger",
          ...finalProps,
        })}
        {protalContent}
      </Fragment>
    )
  } else {
    return (
      <span
        css={applyChildrenContainer}
        ref={(ref) => {
          if (ref != null) {
            measureRef(ref)
            childrenRef.current = ref
          }
        }}
        {...newProps}
      >
        {props.children}
        {protalContent}
      </span>
    )
  }
}

Trigger.displayName = "Trigger"
