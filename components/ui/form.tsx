'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

type FieldValues = Record<string, unknown>
type FieldPath<TFieldValues extends FieldValues> = Extract<keyof TFieldValues, string> | string

type FieldError = {
  message?: string
}

type ControllerRenderProps = {
  name: string
  value: unknown
  onChange: (value: unknown) => void
  onBlur: () => void
}

type ControllerFieldState = {
  error?: FieldError
}

type ControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
  defaultValue?: unknown
  render?: (args: {
    field: ControllerRenderProps
    fieldState: ControllerFieldState
  }) => React.ReactNode
  children?: React.ReactNode
}

type FormStateShape = {
  errors?: Record<string, FieldError | undefined>
}

type FormContextValue = {
  state: FormStateShape
  getFieldState: (name: string) => ControllerFieldState
}

const FormContext = React.createContext<FormContextValue>({
  state: {},
  getFieldState: () => ({}),
})

function Form({
  children,
  errors,
  ...props
}: React.ComponentProps<'form'> & { errors?: Record<string, FieldError | undefined> }) {
  const value = React.useMemo<FormContextValue>(
    () => ({
      state: { errors },
      getFieldState: (name: string) => ({
        error: errors?.[name],
      }),
    }),
    [errors],
  )

  return (
    <FormContext.Provider value={value}>
      <form data-slot="form" {...props}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  defaultValue,
  render,
  children,
}: ControllerProps<TFieldValues, TName>) => {
  const [value, setValue] = React.useState(defaultValue)
  const { getFieldState } = React.useContext(FormContext)
  const fieldState = getFieldState(String(name))

  return (
    <FormFieldContext.Provider value={{ name }}>
      {render
        ? render({
            field: {
              name: String(name),
              value,
              onChange: setValue,
              onBlur: () => undefined,
            },
            fieldState,
          })
        : children}
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = React.useContext(FormContext)

  if (!fieldContext?.name) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const fieldState = getFieldState(String(fieldContext.name))
  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
)

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn('grid gap-2', className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ children }: { children: React.ReactElement }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return React.cloneElement(children as React.ReactElement<any>, {
    'data-slot': 'form-control',
    id: formItemId,
    'aria-describedby': !error
      ? `${formDescriptionId}`
      : `${formDescriptionId} ${formMessageId}`,
    'aria-invalid': !!error,
  } as any)
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? '') : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
