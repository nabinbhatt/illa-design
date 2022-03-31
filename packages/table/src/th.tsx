import * as React from "react"
import { forwardRef, useContext } from "react"
import { ThProps } from "./interface"
import { applyBorderStyle, applySizeStyle, applyThStyle } from "./style"
import { css } from "@emotion/react"
import { TableContext } from "./table-context"
import { ThContext } from "./th-context"

export const Th = forwardRef<HTMLTableHeaderCellElement, ThProps>(
  (props, ref) => {
    const {
      size,
      borderedCell,
      striped,
      align,
      fixedHeader,
      _css,
      ...otherProps
    } = props
    const tableContext = useContext(TableContext)
    const thContext = useContext(ThContext)

    return (
      <th
        align={align ?? tableContext?.align ?? "left"}
        css={css(
          applyThStyle(fixedHeader ?? thContext?.fixedHeader ?? true),
          applySizeStyle(size ?? tableContext?.size ?? "medium"),
          applyBorderStyle(
            borderedCell ?? tableContext?.borderedCell,
            striped ?? tableContext?.striped,
          ),
          _css,
        )}
        ref={ref}
        {...otherProps}
      />
    )
  },
)

Th.displayName = "Th"
