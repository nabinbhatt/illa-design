import { css, SerializedStyles } from "@emotion/react"
import { globalColor, illaPrefix } from "@illa-design/theme"
import { Variants } from "framer-motion"
import { iconColorMap } from "@illa-design/alert"
import { ModalAlignType } from "./interface"

export const applyModalMask = css`
  width: 100%;
  height: 100%;
  background-color: ${globalColor(`--${illaPrefix}-blackAlpha-02`)};
`

export const applyModalContainer = css`
  position: fixed;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

export function applyModal(): SerializedStyles {
  return css`
    display: inline-flex;
    flex-direction: column;
    position: absolute;
    top: 100px;
    margin-bottom: 100px;
    overflow: auto;
    max-height: calc(100% - 200px);
    min-width: 520px;
    text-align: left;
    white-space: initial;
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid ${globalColor(`--${illaPrefix}-grayBlue-08`)};
    background-color: ${globalColor(`--${illaPrefix}-white-01`)};
  `
}

export function applyModalHeader(
  closable?: boolean,
  withoutLine?: boolean,
): SerializedStyles {
  let border = css``
  if (!withoutLine) {
    border = css`
      border-bottom: 1px solid ${globalColor(`--${illaPrefix}-grayBlue-08`)};
    `
  }

  const paddingCss = closable
    ? css`
        padding: 16px 40px;
      `
    : css`
        padding: 16px;
      `

  return css`
    ${paddingCss};
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    ${border};
  `
}

export function applyModalTitle(): SerializedStyles {
  return css`
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: ${globalColor(`--${illaPrefix}-grayBlue-02`)};
  `
}

export function applyModalContent(withoutPadding?: boolean): SerializedStyles {
  const paddingCSS = withoutPadding
    ? css`
        padding: 0;
      `
    : ""
  return css`
    font-size: 14px;
    color: ${globalColor(`--${illaPrefix}-grayBlue-02`)};
    padding: 8px 24px;
    ${paddingCSS}
  `
}

export const modalCloseIconStyle = css`
  position: absolute;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  top: 16px;
  right: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${globalColor(`--${illaPrefix}-grayBlue-03`)};
`

export function applyModalFooter(
  footerAlign?: ModalAlignType,
  withoutLine?: boolean,
): SerializedStyles {
  const textAlignCss = footerAlign
    ? css`
        text-align: ${footerAlign};
      `
    : ""
  const line = withoutLine
    ? css``
    : css`
        border-top: 1px solid ${globalColor(`--${illaPrefix}-grayBlue-08`)};
      `
  return css`
    text-align: right;
    width: 100%;
    box-sizing: border-box;
    padding: 16px 24px;
    ${line};
    ${textAlignCss};
  `
}

export const applyModalCancelBtn = css`
  margin-right: 8px;
`

export function applyModalConfirmTitle(
  type: keyof typeof iconColorMap,
): SerializedStyles {
  return css`
    position: relative;
    padding-left: 24px;
    display: inline-block;

    > svg {
      color: ${iconColorMap[type]};
      position: absolute;
      line-height: 0;
      top: 4px;
      left: 0;
    }
  `
}

export const maskAnimation: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

export const modalAnimation: Variants = {
  initial: {
    opacity: 0,
    scaleX: 0.5,
    scaleY: 0.5,
  },
  animate: {
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
  },
  exit: {
    opacity: 0,
    scaleX: 0.5,
    scaleY: 0.5,
  },
}
