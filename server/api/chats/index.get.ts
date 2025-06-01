import charactersData from '~/server/mock/characters.json'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  try {
    // 读取角色数据
    const characters = charactersData

    // 获取前几个角色作为聊天列表
    const selectedCharacters = [
      characters.find((char: any) => char.id === 'char_001') || characters[0], // 美杜莎
      characters.find((char: any) => char.id === 'char_002') || characters[1], // 赤井秀一
      characters.find((char: any) => char.id === 'char_003') || characters[2], // 夜神月
    ]

    // 模拟用户聊天列表数据
    const userChats = [
      {
        id: 'chat_1',
        character: selectedCharacters[0],
        lastMessage: '虽然我的眼睛很危险，但我很想和你聊天...',
        lastMessageSender: 'character',
        timestamp: '2024-01-15T10:30:00Z',
        unreadCount: 0,
        messageCount: 5
      },
      {
        id: 'chat_2',
        character: selectedCharacters[1],
        lastMessage: '有什么需要我帮助调查的案件吗？',
        lastMessageSender: 'character',
        timestamp: '2024-01-14T16:45:00Z',
        unreadCount: 1,
        messageCount: 4
      },
      {
        id: 'chat_3',
        character: selectedCharacters[2],
        lastMessage: '你对我建立新世界的理念有什么看法？',
        lastMessageSender: 'character',
        timestamp: '2024-01-13T09:20:00Z',
        unreadCount: 0,
        messageCount: 6
      }
    ]

    return {
      success: true,
      chats: userChats
    }
  } catch (error) {
    console.error('Error loading chat list:', error)

    // 如果出错，返回空列表
    return {
      success: true,
      chats: []
    }
  }
}) 