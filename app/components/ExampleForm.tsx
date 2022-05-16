import { Form, useTransition } from '@remix-run/react';
import type { Example } from '~/models';
import { ExampleType } from '~/models';
import { Button } from './Button';

export function ExampleForm({ example, title }: Partial<{ example: Example; title: string }>) {
  const transition = useTransition();

  return (
    <>
      {title && <h2>{title} Page</h2>}

      <Form method="post" className="form-template">
        <label htmlFor="name">Example Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Example"
          defaultValue={example?.name ?? ''}
          required
        />

        <label htmlFor="type">Type</label>
        <select id="type" name="type" defaultValue={example?.type ?? ExampleType.TYPE_A} required>
          <option value={ExampleType.TYPE_A}>Type A</option>
          <option value={ExampleType.TYPE_B}>Type B</option>
          <option value={ExampleType.TYPE_C}>Type C</option>
        </select>

        <label htmlFor="property">Some Property</label>
        <input
          id="property"
          name="property"
          type="text"
          placeholder="Property"
          defaultValue={example?.property ?? ''}
        />

        <h4 className="array-property">Array Properties</h4>
        {example?.arrayProperty.map((subExample, i) => (
          <SubExampleField key={i} index={i + 1} subExample={subExample} />
        )) ?? <SubExampleField index={1} subExample="" />}

        <Button>SUBMIT</Button>
      </Form>
      <small>Form State: {transition.state}</small>
    </>
  );
}

const SubExampleField = ({
  index,
  subExample,
}: {
  index: number;
  subExample: Example['arrayProperty'][0];
}) => (
  <>
    <label htmlFor={`subExample.${index}`}>Sub-example #{index}</label>
    <textarea
      id={`subExample.${index}`}
      name="arrayProperty"
      defaultValue={subExample}
      placeholder=""
      minLength={10}
    />
  </>
);
