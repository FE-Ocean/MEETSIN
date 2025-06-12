import { Injectable } from "@nestjs/common";
import { UserDto, User } from "src/modules/users/schemas/user.schema";
import { UsersRepository } from "./users.repository";
import { plainToClass } from "class-transformer";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}
    entityToDto(user: User): UserDto {
        return plainToClass(UserDto, {
            _id: user._id.toString(),
            email: user.email,
            user_name: user.user_name,
            profile_img: user.profile_img,
            character: user.character,
            provider: user.provider,
        });
    }
}
