export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  // 模拟用户角色数据
  const userRoles = [
    {
      id: 'role_1',
      name: '默认人设',
      age: 25,
      bio: '这是我和角色聊天时的默认人格设定。',
      avatar: 'https://pic.re/image?d=222222',
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'role_2',
      name: '奇幻冒险者',
      age: 32,
      bio: '一位勇敢的冒险者，寻找新的任务和宝藏。喜欢探索未知的世界。',
      avatar: 'https://pic.re/image?d=333333',
      isDefault: false,
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    },
    {
      id: 'role_3',
      name: '现代学生',
      age: 20,
      bio: '一名对AI技术充满好奇的大学生，喜欢和各种角色交流学习。',
      avatar: 'https://pic.re/image?d=444444',
      isDefault: false,
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z'
    }
  ]

  return {
    success: true,
    roles: userRoles
  }
}) 