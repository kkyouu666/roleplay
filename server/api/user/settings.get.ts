export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  // 模拟用户设置数据
  const userSettings = {
    // 个人信息
    personalInfo: {
      username: 'TestUser',
      email: 'test@example.com',
      bio: '这是一个测试用户账号，用于开发和测试功能。我喜欢探索各种AI角色，特别是科幻和奇幻类型的角色。',
      gender: 'male',
      birthday: '1990-01-01',
      avatar: 'https://pic.re/image?d=111111'
    },

    // 隐私设置
    privacy: {
      genderVisibility: 'public',
      birthdayVisibility: 'public',
      bioVisibility: 'public',
      favoritesVisibility: 'public',
      likesVisibility: 'public',
      allowPersonalization: true,
      allowAnalytics: true
    },

    // 通知设置
    notifications: {
      emailEnabled: true,
      pushEnabled: true,
      messageNotifications: true,
      mentionNotifications: true,
      updateNotifications: true,
      marketingNotifications: false
    },

    // 账户设置
    account: {
      language: 'zh',
      theme: 'system',
      emailVerified: true,
      twoFactorEnabled: false
    },

    // 订阅信息
    subscription: {
      plan: 'free',
      expiresAt: null,
      isActive: false,
      features: ['基础功能', '限制对话次数']
    }
  }

  return {
    success: true,
    settings: userSettings
  }
}) 