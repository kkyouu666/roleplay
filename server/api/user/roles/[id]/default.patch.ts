export default defineEventHandler(async (event) => {
  const roleId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { userId } = body

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  if (!roleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Role ID is required'
    })
  }

  // 在真实应用中，这里会验证JWT token、检查角色所有权并更新数据库
  // 将指定角色设为默认，其他角色取消默认
  console.log('Setting default role:', {
    roleId,
    userId
  })

  return {
    success: true,
    message: '默认角色设置成功'
  }
}) 