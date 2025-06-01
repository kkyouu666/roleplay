import charactersData from '~/server/mock/characters.json'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Character ID is required'
    })
  }

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100))

  const character = charactersData.find(char => char.id === id)

  if (!character) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Character not found'
    })
  }

  return character
}) 