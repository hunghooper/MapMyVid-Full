import { useEffect, useState } from 'react'
import { BarChart2, Edit, ExternalLink, LogOut, MapPin, Trash2, Users, Video } from 'lucide-react'

//import { jwtDecode } from 'jwt-decode';

// Dữ liệu giả (mock data)
const mockStats = [
  {
    icon: <Users className='h-6 w-6 text-indigo-500' />,
    title: 'Tổng số người dùng',
    value: '1,250',
    change: '+12%',
    changeType: 'increase'
  },
  {
    icon: <Video className='h-6 w-6 text-green-500' />,
    title: 'Tổng số video',
    value: '5,890',
    change: '+8%',
    changeType: 'increase'
  },
  {
    icon: <MapPin className='h-6 w-6 text-rose-500' />,
    title: 'Tổng số địa điểm đã trích xuất',
    value: '34,500',
    change: '+15%',
    changeType: 'increase'
  }
]

const mockRecentVideos = [
  {
    id: 'vid_123',
    name: 'Khám phá Vịnh Hạ Long',
    user: 'nguyenvanb',
    date: '2025-07-28',
    status: 'Đã hoàn thành',
    locationsCount: 15,
    exportLink: 'https://maps.google.com/?q=ha-long-bay'
  },
  {
    id: 'vid_124',
    name: 'Du lịch Sapa',
    user: 'tranthic',
    date: '2025-07-27',
    status: 'Đang xử lý',
    locationsCount: 0,
    exportLink: null
  },
  {
    id: 'vid_125',
    name: 'Review ẩm thực Đà Lạt',
    user: 'levana',
    date: '2025-07-26',
    status: 'Đã hoàn thành',
    locationsCount: 22,
    exportLink: 'https://maps.google.com/?q=da-lat-food'
  },
  {
    id: 'vid_126',
    name: 'Road trip Hà Nội',
    user: 'nguyenvanb',
    date: '2025-07-25',
    status: 'Thất bại',
    locationsCount: 0,
    exportLink: null
  }
]

const mockUsers = [
  {
    id: 'user_1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    role: 'ADMIN',
    joinedDate: '2025-01-15'
  },
  {
    id: 'user_2',
    name: 'Trần Thị B',
    email: 'tranthib@gmail.com',
    role: 'USER',
    joinedDate: '2025-02-20'
  },
  {
    id: 'user_3',
    name: 'Lê Văn C',
    email: 'levanc@gmail.com',
    role: 'USER',
    joinedDate: '2025-03-10'
  },
  {
    id: 'user_4',
    name: 'Phạm Thu D',
    email: 'phamd@gmail.com',
    role: 'USER',
    joinedDate: '2025-04-05'
  }
]

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Giả lập việc kiểm tra quyền admin từ token
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        // const decodedToken = jwtDecode(token);
        //  const userRole = decodedToken.role;
        const userRole = 'ADMIN' // Giả lập quyền admin
        setIsAdmin(userRole === 'ADMIN')
      } catch (e) {
        console.error('Failed to decode token:', e)
      }
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    window.location.href = '/login' // Chuyển hướng về trang đăng nhập
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-100'>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900'></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8 text-center'>
        <h1 className='text-3xl font-bold text-red-500'>Truy cập bị từ chối</h1>
        <p className='mt-2 text-gray-600'>Bạn không có đủ quyền để xem trang này.</p>
        <button
          onClick={handleLogout}
          className='mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800'
        >
          <LogOut className='h-4 w-4' /> Đăng xuất
        </button>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-900'>Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className='inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800'
          >
            <LogOut className='h-4 w-4' /> Đăng xuất
          </button>
        </div>

        {/* Stats Section */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {mockStats.map((stat, index) => (
            <div key={index} className='rounded-lg bg-white p-6 shadow-md'>
              <div className='flex items-center gap-4'>
                <div className='rounded-full bg-gray-100 p-3'>{stat.icon}</div>
                <div>
                  <p className='text-sm font-medium text-gray-500'>{stat.title}</p>
                  <p className='text-2xl font-bold text-gray-900'>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Recent Videos Table */}
          <div className='rounded-lg bg-white p-6 shadow-md'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-gray-900'>Video gần đây</h2>
              <button className='text-sm font-medium text-indigo-600 hover:text-indigo-800'>Xem tất cả</button>
            </div>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                  <tr className='bg-gray-50'>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Tên Video
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Người dùng
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Trạng thái
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Địa điểm
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {mockRecentVideos.map((video) => (
                    <tr key={video.id}>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>{video.name}</td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>{video.user}</td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm'>
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            video.status === 'Đã hoàn thành'
                              ? 'bg-green-100 text-green-800'
                              : video.status === 'Đang xử lý'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {video.status}
                        </span>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>{video.locationsCount}</td>
                      <td className='whitespace-nowrap px-6 py-4 text-right text-sm font-medium'>
                        {video.exportLink && (
                          <a
                            href={video.exportLink}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='mr-2 text-indigo-600 hover:text-indigo-900'
                          >
                            <ExternalLink className='inline h-4 w-4' />
                          </a>
                        )}
                        <button className='text-red-600 hover:text-red-900'>
                          <Trash2 className='inline h-4 w-4' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Management Table */}
          <div className='rounded-lg bg-white p-6 shadow-md'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-gray-900'>Quản lý người dùng</h2>
              <button className='text-sm font-medium text-indigo-600 hover:text-indigo-800'>Xem tất cả</button>
            </div>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                  <tr className='bg-gray-50'>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Tên
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Email
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Role
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {mockUsers.map((user) => (
                    <tr key={user.id}>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>{user.name}</td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>{user.email}</td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm'>
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-right text-sm font-medium'>
                        <button className='mr-2 text-indigo-600 hover:text-indigo-900'>
                          <Edit className='inline h-4 w-4' />
                        </button>
                        <button className='text-red-600 hover:text-red-900'>
                          <Trash2 className='inline h-4 w-4' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
