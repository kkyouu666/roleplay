import charactersData from '~/server/mock/characters.json'

export default defineEventHandler(async (event) => {
  const chatId = getRouterParam(event, 'id')
  const query = getQuery(event)
  const userId = query.userId as string
  const page = parseInt(query.page as string) || 1
  const pageSize = parseInt(query.pageSize as string) || 50

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  if (!chatId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Chat ID is required'
    })
  }

  // 在真实应用中，这里会验证JWT token、检查聊天会话所有权并从数据库获取消息
  console.log('Loading messages for chat:', {
    chatId,
    userId,
    page,
    pageSize
  })

  try {
    // 我们从聊天列表API的逻辑中获取角色信息
    // 这里我们需要模拟根据chatId获取对应的角色信息
    const chatIdMappings = {
      'chat_1': 'char_001', // 美杜莎
      'chat_2': 'char_002', // 赤井秀一
      'chat_3': 'char_003', // 夜神月
    }

    // 获取角色数据
    const characters = charactersData

    // 根据chatId获取对应的角色ID，如果找不到则使用默认角色
    const characterId = chatIdMappings[chatId as keyof typeof chatIdMappings] || 'char_001'
    const character = characters.find((char: any) => char.id === characterId) || characters[0]

    // 根据不同角色生成不同的模拟消息
    const generateMessagesForCharacter = (character: any, chatId: string) => {
      const baseTime = new Date('2024-01-15T09:00:00Z').getTime()

      return [
        {
          id: `msg_1_${chatId}`,
          sender: 'character',
          content: character.greeting || `你好！我是${character.name}，很高兴见到你！`,
          timestamp: new Date(baseTime).toISOString()
        },
        {
          id: `msg_2_${chatId}`,
          sender: 'user',
          content: `你好，${character.name}！很高兴认识你。`,
          timestamp: new Date(baseTime + 60000).toISOString()
        },
        {
          id: `msg_3_${chatId}`,
          sender: 'character',
          content: character.description || `我是${character.name}，${character.description}。有什么我可以帮助你的吗？`,
          timestamp: new Date(baseTime + 120000).toISOString()
        },
        {
          id: `msg_4_${chatId}`,
          sender: 'user',
          content: '能给我介绍一下你自己吗？',
          timestamp: new Date(baseTime + 180000).toISOString()
        },
        {
          id: `msg_5_${chatId}`,
          sender: 'character',
          content: generateCharacterIntroduction(character),
          timestamp: new Date(baseTime + 240000).toISOString()
        }
      ]
    }

    // 生成角色介绍
    const generateCharacterIntroduction = (character: any) => {
      const introductions = {
        'char_001': '我是美杜莎，来自希腊神话。虽然我的眼睛可能会让人变成石头，但我其实很孤独，希望能找到真正理解我的人。',
        'char_002': '我是赤井秀一，FBI探员。我擅长狙击和推理，如果你遇到什么危险或者需要帮助破案，随时可以找我。',
        'char_003': '我是夜神月，一个追求正义的人。我相信这个世界需要被净化，罪犯应该受到应有的惩罚。你对正义有什么看法？',
        'char_004': '我是春野樱，医疗忍者。我的医疗忍术可以治疗各种伤势，同时我也有着超强的怪力。如果你受伤了，我很乐意帮助你。',
        'char_005': '我是雷神托尔，阿斯加德的王子。我手持雷神之锤，守护着九界的和平。你想了解阿斯加德的故事吗？'
      }

      return introductions[character.id as keyof typeof introductions] ||
        `我是${character.name}。${character.description}我的标签包括：${character.tags?.join('、')}。`
    }

    const mockMessages = generateMessagesForCharacter(character, chatId)

    // 模拟分页
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedMessages = mockMessages.slice(startIndex, endIndex)

    return {
      success: true,
      messages: paginatedMessages,
      pagination: {
        page,
        pageSize,
        total: mockMessages.length,
        hasMore: endIndex < mockMessages.length
      }
    }
  } catch (error) {
    console.error('Error loading chat messages:', error)

    // 如果出错，返回通用消息
    const fallbackMessages = [
      {
        id: `msg_1_${chatId}`,
        sender: 'character',
        content: '你好！很高兴见到你！',
        timestamp: '2024-01-15T09:00:00Z'
      }
    ]

    return {
      success: true,
      messages: fallbackMessages,
      pagination: {
        page,
        pageSize,
        total: fallbackMessages.length,
        hasMore: false
      }
    }
  }
}) 