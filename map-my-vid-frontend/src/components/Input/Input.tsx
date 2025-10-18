import { InputHTMLAttributes } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  rules?: RegisterOptions
  classNameInput?: string
  classNameError?: string
}
export default function Input({
  className,
  classNameError = 'mt-1 text-red-600 min-h-[1rem] text-sm',
  classNameInput = 'p-3 w-full outline-none border border-gray-200 focus:border-gray-300 rounded-sm focus:shadow-sm',
  name,
  errorMessage,
  register,
  rules,
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : {}
  return (
    <div className={className}>
      <input {...registerResult} className={classNameInput} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
