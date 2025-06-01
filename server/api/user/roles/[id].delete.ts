export default defineEventHandler(async (event) => {
  const roleId = getRouterParam(event, 'id')
  const query = getQuery(event)
  const userId = query.userId as string

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

  // 在真实应用中，这里会验证JWT token、检查角色所有权和是否为默认角色
  console.log('Deleting role:', {
    roleId,
    userId
  })

  // 模拟检查是否为默认角色（在真实应用中从数据库获取）
  // 这里假设role_1是默认角色，不允许删除
  if (roleId === 'role_1') {
    throw createError({
      statusCode: 400,
      statusMessage: '无法删除默认角色，请先设置其他角色为默认角色'
    })
  }

  return {
    success: true,
    message: '角色删除成功'
  }
}) 