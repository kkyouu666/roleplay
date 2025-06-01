export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Notification ID is required'
    })
  }

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100))

  // 在真实应用中，这里会从数据库删除通知
  // 现在我们只是模拟成功响应

  return {
    success: true,
    message: 'Notification deleted'
  }
}) 