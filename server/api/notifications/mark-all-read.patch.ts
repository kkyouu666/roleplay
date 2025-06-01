export default defineEventHandler(async (event) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100))

  // 在真实应用中，这里会更新数据库中的所有未读通知
  // 现在我们只是模拟成功响应

  return {
    success: true,
    message: 'All notifications marked as read'
  }
}) 