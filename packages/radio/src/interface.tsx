import { HTMLAttributes, ChangeEvent, ReactNode } from "react"
import { AvatarColorScheme, AvatarGroupContextProps, AvatarShape, AvatarSize } from "@illa-design/avatar/src"

export type RadioColorScheme =
  string
  | "white"
  | "blackAlpha"
  | "gray"
  | "grayBlue"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "cyan"
  | "purple"

export interface RadioProps extends Omit<HTMLAttributes<HTMLLabelElement>, 'onChange'> {
  name?: string
  value?: any
  disabled?: boolean
  checked?: boolean
  defaultChecked?: boolean

  colorScheme?: RadioColorScheme
  onChange?: (value: any, event: ChangeEvent) => void;
}

export type RadioOwnGroupProps = HTMLAttributes<HTMLDivElement> & RadioGroupContextProps

// export interface RadioGroupProps extends RadioOwnGroupProps {}

interface optionsArr {
  label: string
  value: string
  disabled?: boolean
}[]

export interface RadioGroupContextProps {
  name?: string
  value?: any
  colorScheme?: RadioColorScheme
  disabled?: boolean
  defaultValue?: any
  options?: string[] | optionsArr[]
  direction?: "vertical" | "horizontal"
  spacing?: string | number

  onChange?: (value: any, event: ChangeEvent) => void;
  onChangeValue?: (value: any, event: ChangeEvent) => void;
}

export interface RadioGroupProps extends
  Omit<HTMLAttributes<HTMLDivElement>, 'onChange'|'defaultValue'>,
  RadioGroupContextProps  {
}