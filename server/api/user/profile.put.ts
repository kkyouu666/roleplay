export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { userId, username, bio, gender, birthday, avatar } = body

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  // 在真实应用中，这里会验证JWT token并更新数据库
  // 现在我们只是模拟更新成功
  console.log('Updating user profile:', {
    userId,
    username,
    bio,
    gender,
    birthday,
    avatar: avatar ? 'Updated' : 'No change'
  })

  // 模拟更新后的用户数据
  const updatedUser = {
    id: userId,
    username: username || '测试用户',
    email: 'test@example.com', // 邮箱不可更改
    bio: bio || '',
    gender: gender || '',
    birthday: birthday || '',
    avatar: avatar || '/images/avatars/default.jpg',
    settings: {
      isPublicProfile: true,
      isPublicBio: true,
      isPublicLikes: true,
      isPublicFavorites: true,
      isPublicMemories: true
    },
    stats: {
      characters: 5,
      followers: 123,
      following: 45,
      totalChats: 289,
      totalFavorites: 67,
      totalMemories: 34
    },
    badges: ['新手'],
    joinedAt: '2024-01-01T00:00:00Z',
    lastActive: new Date().toISOString(),
    subscription: 'free',
    points: 1250
  }

  return {
    success: true,
    message: '个人信息更新成功',
    user: updatedUser
  }
}) 