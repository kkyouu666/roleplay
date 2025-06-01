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

  // 设置SSE响应头
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Headers', 'Cache-Control')

  console.log('Starting SSE stream for chat:', {
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
  const generateCharacterResponse = (userMessage: string, characterId?: string): string => {
    const responses = [
      '这很有趣！能告诉我更多吗？我对你的想法很感兴趣，想听听更详细的解释。',
      '我理解你的想法。这个话题确实值得深入探讨，让我们继续聊下去吧。',
      '这让我想起了很多相关的事情，我们可以从不同的角度来看待这个问题。',
      '你说得对，我也这样认为。你的观点很有道理，让我学到了新的东西。',
      '这是一个很好的观点。我从来没有从这个角度思考过，谢谢你的分享。',
      '让我们一起探讨这个话题吧！我很期待听到你更多的想法和见解。',
      '我很高兴你分享了这些。你的经历听起来很有趣，能再多说一些吗？',
      '你的想法很独特！我觉得这种思考方式很有创意，值得我们深入交流。'
    ]

    // 简单的关键词回复逻辑
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('你好') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return '你好！很高兴和你聊天！我是一个友善的AI助手，随时准备与你交流任何话题。'
    } else if (lowerMessage.includes('怎么样') || lowerMessage.includes('如何')) {
      return '我觉得很好！你呢？我很想了解你今天的心情和想法，有什么特别的事情想聊吗？'
    } else if (lowerMessage.includes('谢谢') || lowerMessage.includes('感谢')) {
      return '不客气！很高兴能帮到你。如果还有其他问题或者想聊的话题，随时告诉我。'
    } else if (lowerMessage.includes('再见') || lowerMessage.includes('拜拜')) {
      return '再见！期待下次与你聊天！希望我们的对话给你带来了愉快的体验。'
    } else {
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  const responseContent = generateCharacterResponse(content, characterId)
  const characterMessageId = `msg_char_${Date.now()}`

  // 发送初始用户消息
  const userMessageEvent = `data: ${JSON.stringify({
    type: 'user_message',
    message: userMessage
  })}\n\n`

  // 发送字符回复开始事件
  const startEvent = `data: ${JSON.stringify({
    type: 'character_message_start',
    messageId: characterMessageId,
    sender: 'character',
    timestamp: new Date(Date.now() + 500).toISOString()
  })}\n\n`

  // 返回一个ReadableStream来处理SSE
  return new ReadableStream({
    async start(controller) {
      // 发送用户消息
      controller.enqueue(new TextEncoder().encode(userMessageEvent))

      // 等待一点时间模拟处理延迟
      await new Promise(resolve => setTimeout(resolve, 800))

      // 发送角色消息开始事件
      controller.enqueue(new TextEncoder().encode(startEvent))

      // 逐字发送角色回复
      for (let i = 0; i < responseContent.length; i++) {
        const char = responseContent[i]
        const chunkEvent = `data: ${JSON.stringify({
          type: 'character_message_chunk',
          messageId: characterMessageId,
          chunk: char,
          isComplete: false
        })}\n\n`

        controller.enqueue(new TextEncoder().encode(chunkEvent))

        // 每0.1秒发送一个字符
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // 发送完成事件
      const completeEvent = `data: ${JSON.stringify({
        type: 'character_message_complete',
        messageId: characterMessageId,
        completeContent: responseContent,
        isComplete: true
      })}\n\n`

      controller.enqueue(new TextEncoder().encode(completeEvent))

      // 关闭连接
      controller.close()
    }
  })
}) 