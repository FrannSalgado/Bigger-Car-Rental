import {IsNotEmpty, Matches, MaxLength, MinLength} from "class-validator";

export class SignInDto{
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    username: string;

    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(30)
    @Matches(/^(?=.*\d)(?=.*[A-Z]).{8,}$/)
    password: string;
}
