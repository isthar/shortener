import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsSlugConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    const slugRegex = /^[A-Za-z0-9_-]+$/;
    return slugRegex.test(value);
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Allowed slug characters are:  A-Z, a-z, 0-9, _ and -.';
  }
}

export function IsSlug(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isSlug',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsSlugConstraint,
    });
  };
}
