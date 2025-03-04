import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IUser } from '../../users/interface/user.interface';

export class SignUpDto implements Omit<IUser, 'id'> {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  @Matches(/^(?=.*\d)(?=.*[A-Z]).{8,}$/)
  password: string;

  @IsEmail()
  email: string;
}
