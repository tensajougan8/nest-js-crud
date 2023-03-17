import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  readonly title: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  readonly body: string;
}
