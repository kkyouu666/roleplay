export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { userId, name, age, bio, avatar } = body

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  if (!name || !name.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: '角色名称不能为空'
    })
  }

  // 在真实应用中，这里会验证JWT token并保存到数据库
  console.log('Creating new role:', {
    userId,
    name,
    age,
    bio,
    avatar: avatar ? 'Has avatar' : 'No avatar'
  })

  // 模拟创建的新角色
  const newRole = {
    id: `role_${Date.now()}`,
    name: name.trim(),
    age: age || null,
    bio: bio || '',
    avatar: avatar || '',
    isDefault: false, // 新创建的角色默认不是默认角色
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return {
    success: true,
    message: '角色创建成功',
    role: newRole
  }
}) 