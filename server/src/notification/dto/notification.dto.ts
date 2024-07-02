import { IsNotEmpty, IsString } from "class-validator";

class KeysDTO {
    @IsNotEmpty()
    @IsString()
    p256dh: string;

    @IsNotEmpty()
    @IsString()
    auth: string;
}

export class NotificationDTO {
    @IsNotEmpty()
    @IsString()
    endpoint: string;

    @IsNotEmpty()
    keys: KeysDTO;
}
