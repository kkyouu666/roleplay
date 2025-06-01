export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { userId, password, confirmText } = body

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: '需要输入密码以确认删除操作'
    })
  }

  if (confirmText !== 'DELETE MY ACCOUNT') {
    throw createError({
      statusCode: 400,
      statusMessage: '请输入正确的确认文本'
    })
  }

  // 在真实应用中，这里会：
  // 1. 验证JWT token
  // 2. 验证密码是否正确
  // 3. 软删除或硬删除用户数据
  // 4. 删除相关的角色、聊天记录等数据
  // 5. 发送确认邮件
  console.log('Deleting account for user:', userId)

  // 模拟验证密码（在真实应用中会从数据库验证）
  if (password !== 'test123') {
    throw createError({
      statusCode: 400,
      statusMessage: '密码不正确'
    })
  }

  return {
    success: true,
    message: '账户已成功删除'
  }
}) 