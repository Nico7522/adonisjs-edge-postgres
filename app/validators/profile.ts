import vine from '@vinejs/vine'

export const profileUpdateAvatarValidator = vine.compile(
  vine.object({
    avatar: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png'],
      })
      .optional(),
  })
)

export const profileUpdateValidator = vine.compile(
  vine.object({
    firstname: vine.string(),
    lastname: vine.string(),
    email: vine.string().email(),
  })
)
