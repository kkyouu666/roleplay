export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { userId, currentPassword, newPassword, confirmNewPassword } = body

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: '所有密码字段都是必需的'
    })
  }

  if (newPassword !== confirmNewPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: '新密码和确认密码不匹配'
    })
  }

  if (newPassword.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: '新密码长度至少为6位'
    })
  }

  // 在真实应用中，这里会：
  // 1. 验证JWT token
  // 2. 验证当前密码是否正确
  // 3. 对新密码进行哈希处理
  // 4. 更新数据库中的密码
  console.log('Changing password for user:', userId)

  // 模拟验证当前密码（在真实应用中会从数据库验证）
  if (currentPassword !== 'test123') {
    throw createError({
      statusCode: 400,
      statusMessage: '当前密码不正确'
    })
  }

  return {
    success: true,
    message: '密码更改成功'
  }
}) 