# React UI Chosen

A simple and reusable Chosen component for React

## Installation

The package can be installed via [npm](https://github.com/npm/cli):

```
npm install react-ui-chosen --save
```

You’ll need to install React and Tailwind CSS separately since those dependencies aren’t included in the package.

Once Tailwind CSS installed, you'll need to add `"./node_modules/react-ui-chosen/**/*.{js,ts,jsx,tsx,mdx}"` to `content` in your `tailwind.config.js` file.

Below is a simple example of how to use the Chosen in a React view.

```js
import React from "react";
import Chosen from "react-ui-chosen";

const Example = () => {
  const values = {
    'John' : 'John',
    'Doe'  : 'Doe',
    'Some' : 'Some',
    'Test' : 'Test'
  };
  return (
    <Chosen values={values} />
  );
};
```

## Configuration

The most basic use of the Chosen can be described with:

```js
<Chosen values={values} />
```

You can use :
- `multiple` boolean prop which defines if the Chosen can have multiple selected values
- `loading` boolean prop which defines if the Chosen loading is visible or not
- `onScrollToListBottom` event handler which fires each time you have hit the bottom of the Chosen list
- `onSearch` event handler which fires each time you type in the Chosen search bar (and replace the default search behavior)

*The event handlers (and the loading prop) may be useful to load more values while searching or scrolling to bottom*

```js
<Chosen
  values={values}
  multiple={true}
  loading={false}
  onScrollToListBottom={(search) => {/* search is the Chosen search bar value */}}
  onSearch={(search) => {/* search is the Chosen search bar value */}}
/>
```

## Compatibility

### Tailwind CSS

This package has been developed with version 3.4.6.

### React

We're always trying to stay compatible with the latest version of React.

## Accessibility

### Keyboard support

- _Up_: Move to the previous list option.
- _Down_: Move to the next list option.
- _Enter_: Select a list option.
- _Backspace_: Unselect a list option.