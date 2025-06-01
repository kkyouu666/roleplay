export default defineEventHandler(async (event) => {
  const characterId = getRouterParam(event, 'id')
  const query = getQuery(event)

  if (!characterId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Character ID is required'
    })
  }

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 100))

  try {
    // 读取评论数据
    const comments = await import('~/server/mock/comments.json').then(m => m.default)

    // 筛选属于该角色的评论
    let characterComments = comments.filter(comment => comment.characterId === characterId)

    // 分页参数
    const page = parseInt(query.page as string) || 1
    const pageSize = parseInt(query.pageSize as string) || 10
    const offset = (page - 1) * pageSize

    // 按创建时间倒序排序
    characterComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // 应用分页
    const paginatedComments = characterComments.slice(offset, offset + pageSize)

    return {
      comments: paginatedComments,
      pagination: {
        page,
        pageSize,
        total: characterComments.length,
        hasMore: offset + pageSize < characterComments.length
      }
    }
  } catch (error) {
    console.error('Error loading character comments:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load character comments'
    })
  }
}) 