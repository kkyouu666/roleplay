import charactersData from '~/server/mock/characters.json'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { userId, characterId } = body

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  if (!characterId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Character ID is required'
    })
  }

  // 在真实应用中，这里会验证JWT token、检查角色是否存在并创建聊天会话
  console.log('Creating new chat:', {
    userId,
    characterId
  })

  try {
    // 读取角色mock数据
    const characters = charactersData

    // 根据characterId查找对应角色
    const character = characters.find((char: any) => char.id === characterId)

    if (!character) {
      throw createError({
        statusCode: 404,
        statusMessage: `Character with ID ${characterId} not found`
      })
    }

    // 模拟创建的新聊天会话
    const newChat = {
      id: `chat_${Date.now()}`,
      character: character,
      lastMessage: character.greeting,
      lastMessageSender: 'character',
      timestamp: new Date().toISOString(),
      unreadCount: 1,
      messageCount: 1
    }

    return {
      success: true,
      message: '聊天会话创建成功',
      chat: newChat
    }
  } catch (error) {
    // 如果是我们抛出的createError，直接重新抛出
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // 其他错误（如文件读取错误）
    console.error('Error reading character data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load character data'
    })
  }
}) 