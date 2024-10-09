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
