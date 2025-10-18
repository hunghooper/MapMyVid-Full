import { RegisterOptions } from 'react-hook-form'
import * as yup from 'yup'

type Rules = { [key in 'email' | 'password']?: RegisterOptions }

export const getRules = (): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email is required'
    },
    pattern: {
      value: /^[\w.-]+@[\w-]+\.[a-zA-Z]{2,}$/,
      message: 'Email is not in valid format'
    },
    maxLength: {
      value: 160,
      message: 'Email must in range 5-160 words'
    },
    minLength: {
      value: 5,
      message: 'Email must in range 5-160 words'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password is required'
    },
    maxLength: {
      value: 160,
      message: 'Password must in range 6-160 words'
    },
    minLength: {
      value: 6,
      message: 'Password must in range 6-160 words'
    }
  }
})

export const schema = yup
  .object({
    email: yup
      .string()
      .required('Email is required')
      .email('Email is not in valid format')
      .max(160, 'Email must in range 5-160 words')
      .min(5, 'Email must in range 5-160 words'),
    password: yup
      .string()
      .required()
      .max(160, 'Password must in range 6-160 words')
      .min(6, 'Password must in range 6-160 words'),
    name: yup.string().trim().required('')
  })
  .required()

export type Schema = yup.InferType<typeof schema>
