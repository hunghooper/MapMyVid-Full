import { useContext } from 'react'
import authApi from '@/api/auth.api'
import GoogleIcon from '@/assets/Icons/GoogleIcon'
import Button from '@/components/Button'
import Input from '@/components/Input'
import path from '@/constants/path'
import { AppContext } from '@/contexts/app.context'
import { ErrorResponse } from '@/types/utils.type'
import { Schema, schema } from '@/utils/rules'
import { isAxiosUnprocessableEntity } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { Lock, LogIn, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const { setIsAuthenticated, setProfile, profile } = useContext(AppContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<FormData>({ resolver: yupResolver(loginSchema) })

  const loginAccountMutation = useMutation({
    mutationFn: (body: FormData) => authApi.loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
        console.log('Form data submitted:', data)

        setIsAuthenticated(true)
        setProfile(data.data.user)
        console.log('Login successful, user profile set:', profile)
        navigate('/')
        toast.success('Đăng nhập thành công!')
      },
      onError: (error) => {
        console.error('Login error:', error)
        if (isAxiosUnprocessableEntity<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Sever'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-lg'>
        <div className='text-center'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>Đăng Nhập</h1>
          <p className='text-gray-600'>Chào mừng bạn trở lại! Vui lòng nhập thông tin.</p>
        </div>

        <form className='mt-8 space-y-6' noValidate onSubmit={onSubmit}>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              Địa chỉ Email
            </label>
            <div className='relative mt-1 rounded-md shadow-sm'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
              <Input
                type='email'
                name='email'
                autoComplete='on'
                register={register}
                errorMessage={errors.email?.message}
                placeholder='Email'
              />
            </div>
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              Mật khẩu
            </label>
            <div className='relative mt-1 rounded-md shadow-sm'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
              <Input
                type='password'
                name='password'
                autoComplete='on'
                register={register}
                errorMessage={errors.password?.message}
                placeholder='Password'
              />
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div className='text-sm'>
              <a href='#' className='font-medium text-gray-600 hover:text-gray-900'>
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <div>
            <Button
              disabled={loginAccountMutation.isPending}
              isLoading={loginAccountMutation.isPending}
              className='group relative flex w-full justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
            >
              <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                <LogIn className='h-5 w-5 text-gray-400 group-hover:text-gray-300' aria-hidden='true' />
              </span>
              Đăng Nhập
            </Button>
          </div>
        </form>

        {/* Phần phân cách */}
        <div className='relative mt-6'>
          <div className='absolute inset-0 flex items-center' aria-hidden='true'>
            <div className='w-full border-t border-gray-300'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='bg-white px-2 text-gray-500'>Hoặc</span>
          </div>
        </div>

        {/* Nút đăng nhập với Google */}
        <div className='mt-6'>
          <Button className='inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50'>
            <GoogleIcon className='mr-3 h-5 w-5' />
            Đăng nhập với Google
          </Button>
        </div>

        <div className='mt-6 text-center text-sm text-gray-600'>
          Chưa có tài khoản?{' '}
          <Link to={path.register} className='font-medium text-gray-600 hover:text-gray-900'>
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  )
}
