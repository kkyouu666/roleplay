import notificationsData from '~/server/mock/notifications.json'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const page = parseInt(query.page as string) || 1
  const pageSize = parseInt(query.pageSize as string) || 10
  const filter = query.filter as string || 'all' // all, unread, read

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100))

  let filteredNotifications = [...notificationsData]

  // 过滤通知
  if (filter === 'unread') {
    filteredNotifications = filteredNotifications.filter(notification => !notification.read)
  } else if (filter === 'read') {
    filteredNotifications = filteredNotifications.filter(notification => notification.read)
  }

  // 按时间倒序排序
  filteredNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // 分页
  const total = filteredNotifications.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const notifications = filteredNotifications.slice(start, end)
  const hasMore = end < total

  return {
    notifications,
    pagination: {
      page,
      pageSize,
      total,
      hasMore
    }
  }
}) 