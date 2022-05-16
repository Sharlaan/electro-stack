import { Form } from '@remix-run/react';
import { Button } from './Button';

export function DeleteButton() {
  return (
    <Form method="post">
      <input type="hidden" name="_method" value="delete" />
      <Button>❌ DELETE</Button>
    </Form>
  );
}
