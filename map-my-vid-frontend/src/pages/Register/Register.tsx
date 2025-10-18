import GoogleIcon from '@/assets/Icons/GoogleIcon'
import { Lock, LogIn, Mail, User } from 'lucide-react'

export default function Register() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-lg'>
        <div className='text-center'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>Đăng Ký</h1>
          <p className='text-gray-600'>Hãy tạo một tài khoản mới để bắt đầu.</p>
        </div>

        {/* Form đăng ký truyền thống */}
        <form className='mt-8 space-y-6'>
          {/* Tên người dùng */}
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
              Tên của bạn
            </label>
            <div className='relative mt-1 rounded-md shadow-sm'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <User className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
              <input
                type='text'
                id='name'
                name='name'
                className='block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm'
                placeholder='Nguyễn Văn A'
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              Địa chỉ Email
            </label>
            <div className='relative mt-1 rounded-md shadow-sm'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
              <input
                type='email'
                id='email'
                name='email'
                className='block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm'
                placeholder='you@example.com'
                required
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              Mật khẩu
            </label>
            <div className='relative mt-1 rounded-md shadow-sm'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
              <input
                type='password'
                id='password'
                name='password'
                className='block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm'
                placeholder='Tạo mật khẩu'
                required
              />
            </div>
          </div>

          {/* Nút đăng ký */}
          <div>
            <button
              type='submit'
              className='group relative flex w-full justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
            >
              <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                <LogIn className='h-5 w-5 text-gray-400 group-hover:text-gray-300' aria-hidden='true' />
              </span>
              Đăng Ký
            </button>
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

        {/* Nút đăng ký với Google */}
        <div className='mt-6'>
          <button
            type='button'
            className='inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50'
          >
            <GoogleIcon className='mr-3 h-5 w-5' />
            Đăng ký với Google
          </button>
        </div>

        {/* Liên kết đăng nhập */}
        <div className='mt-6 text-center text-sm text-gray-600'>
          Đã có tài khoản?{' '}
          <a href='/login' className='font-medium text-gray-600 hover:text-gray-900'>
            Đăng nhập ngay
          </a>
        </div>
      </div>
    </div>
  )
}
