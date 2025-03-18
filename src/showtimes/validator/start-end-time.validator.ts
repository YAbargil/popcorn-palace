import { Showtime } from '@prisma/client';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'customStartEndTime', async: false })
export class CustomStartEndTimeValidator
  implements ValidatorConstraintInterface
{
  validate(startTime: string, args: ValidationArguments) {
    const endTime = (args.object as { endTime: Showtime['endTime'] }).endTime;
    return new Date(startTime) < new Date(endTime); // Ensure startTime is before endTime
  }

  defaultMessage() {
    return 'Start time must be before end time';
  }
}
