export default defineEventHandler(async (event) => {
  const chatId = getRouterParam(event, 'id')
  const body = await readBody(event)

  const { userId, content, characterId } = body

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

  if (!content || !content.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Message content is required'
    })
  }

  // 在真实应用中，这里会验证JWT token、检查聊天会话所有权并保存消息
  console.log('Sending message:', {
    chatId,
    userId,
    content: content.substring(0, 50) + '...',
    characterId
  })

  // 创建用户消息
  const userMessage = {
    id: `msg_user_${Date.now()}`,
    sender: 'user',
    content: content.trim(),
    timestamp: new Date().toISOString()
  }

  // 模拟AI角色回复生成
  const generateCharacterResponse = (userMessage: string, characterId?: string) => {
    const responses = [
      '这很有趣！能告诉我更多吗？',
      '我理解你的想法。',
      '这让我想起了...',
      '你说得对，我也这样认为。',
      '这是一个很好的观点。',
      '让我们一起探讨这个话题吧！',
      '我很高兴你分享了这些。',
      '你的想法很独特！'
    ]

    // 简单的关键词回复逻辑
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('你好') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return '你好！很高兴和你聊天！'
    } else if (lowerMessage.includes('怎么样') || lowerMessage.includes('如何')) {
      return '我觉得很好！你呢？'
    } else if (lowerMessage.includes('谢谢') || lowerMessage.includes('感谢')) {
      return '不客气！很高兴能帮到你。'
    } else if (lowerMessage.includes('再见') || lowerMessage.includes('拜拜')) {
      return '再见！期待下次与你聊天！'
    } else {
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  // 创建角色回复消息
  const characterMessage = {
    id: `msg_char_${Date.now()}`,
    sender: 'character',
    content: generateCharacterResponse(content, characterId),
    timestamp: new Date(Date.now() + 1000).toISOString() // 稍微延迟一点
  }

  return {
    success: true,
    messages: [userMessage, characterMessage]
  }
}) 