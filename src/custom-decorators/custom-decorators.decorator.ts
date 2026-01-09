import { Transform } from 'class-transformer';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { applyDecorators } from '@nestjs/common';

/**
 * Custom decorator to trim leading and trailing spaces from a string property.
 */
export function Trim() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  });
}

//  removes trailing spaces from the json string
export function TrimJsonString() {
  const replacer = (key: string, value: any): any => {
    // If the value is a string, return the trimmed version.
    if (typeof value === 'string') {
      return value.trim();
    }
    // Otherwise, return the original value.
    return value;
  };

  return Transform(({ value }) => {
    try {
      return JSON.stringify(value, replacer);
    } catch {
      return value.trim();
    }
  });
}

@ValidatorConstraint({ name: 'MatchString' }) //  register decorator
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} does not match ${args.constraints[0]}`;
  }
}

export function MatchString( //  compares two params in dto
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

import {
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function ApiCommonErrorResponses() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'if something wrong, eg body, etc',
    }),
    ApiResponse({
      status: 404,
      description: 'if the resource not found',
    }),
    ApiResponse({
      status: 403,
      description: 'if the user is not authorized to do this action',
    }),
  );
}
