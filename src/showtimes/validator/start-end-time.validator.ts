import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAfter(
  property: string,
  validationOptions?: ValidationOptions,
) {
  // Ref: https://www.npmjs.com/package/class-validator/v/0.6.0 - Custom validation decorators
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfter',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (!value || !relatedValue) return false;
          return new Date(value).getTime() > new Date(relatedValue).getTime();
        },
        defaultMessage(): string {
          return `$property must be after ${property}`;
        },
      },
    });
  };
}
