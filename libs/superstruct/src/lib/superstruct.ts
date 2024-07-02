import { Infer, number, object, string } from 'superstruct'

const User = object({
  id: number(),
  email: string(),
  name: string(),
})

type User = Infer<typeof User>

import { coerce, define } from 'superstruct'
import { EMAIL_REGEX_S } from '@parsers-jamboree/common';

const MyNumber = coerce(number(), string(), (value) => parseFloat(value))

const EMAIL_REGEX = new RegExp(EMAIL_REGEX_S);
const isEmail = (value: string) => EMAIL_REGEX.test(value)

// TODO fix their example https://github.com/ianstormtaylor/superstruct/blob/main/examples/custom-types.js - `code` not in Result
const Email = define('Email', (value) => {
  // todo how to compose?
  if (typeof value !== 'string') {
    return 'not_string'
  }
  if (!isEmail(value)) {
    return 'not_email'
  } else if (value.length >= 256) {
    return 'too_long'
  } else {
    return true
  }
})
