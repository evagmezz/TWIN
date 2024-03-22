import { IsUUID, Length } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreatePostDto {
  @IsUUID('4', { message: 'El id del usuario debe ser un UUID v4' })
  userId: string

  @Length(1, 100, {
    message: 'El título debe tener entre 1 y 100 caracteres',
  })
  @Transform(({ value }) => value.trim())
  title: string

  @Transform(({ value }) => value.trim())
  photos: string[] = []
}
