export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const roleId = getRouterParam(event, 'id')

  const { userId, name, age, bio, avatar } = body

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

  if (!name || !name.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: '角色名称不能为空'
    })
  }

  // 在真实应用中，这里会验证JWT token、检查角色所有权并更新数据库
  console.log('Updating role:', {
    roleId,
    userId,
    name,
    age,
    bio,
    avatar: avatar ? 'Updated' : 'No change'
  })

  // 模拟更新后的角色数据
  const updatedRole = {
    id: roleId,
    name: name.trim(),
    age: age || null,
    bio: bio || '',
    avatar: avatar || '',
    isDefault: false, // 保持原有的默认状态，这里简化处理
    createdAt: '2024-01-01T00:00:00Z', // 保持原有创建时间
    updatedAt: new Date().toISOString()
  }

  return {
    success: true,
    message: '角色更新成功',
    role: updatedRole
  }
}) 