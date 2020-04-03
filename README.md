# @upstatement/react-hooks

> A collection of commonly used React hooks across Upstatement projects.

## 👋 Meet the Hooks

### `useState`

This basic hook provides an extra layer of security over React's existing `useState` hook. While it functions the exact same as the original, our hook will no longer accept updates to the state post-unmount.

#### API

The API remains unchanged from React's `useState` hook: https://reactjs.org/docs/hooks-reference.html#usestate

#### Usage

```jsx
import { useState } from '@upstatement/react-hooks';

const App = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count => count + 1);
  };

  return (
    <div>
      <h4>Count: {count}</h4>
      <button onClick={increment}>Increment</button>
    </div>
  );
};
```

### `useStateReducer`

This hook is a step between the `useState` and `useReducer` hooks, providing a way to create a mini state store inside your component.

#### API

```js
const [state, set] = useStateReducer(initialState);
```

The initial state should be a record of key-value pairs. Similar to `useState`, these values can either be the exact value, or a function to be lazily evaluated when the hook is run. For example:

```js
const [state, set] = useStateReducer({
  name: 'John',
  expensiveValue: () => {
    const initialState = someExpensiveComputation();
    return initialState;
  },
});
```

The `set` function contains a number of properties that update the respective values within the state. For example:

```js
const [state, set] = useStateReducer({
  name: 'John',
  age: 6,
});

set.name('Andrew'); // Sets name to "Andrew"
set.age(state => state.age + 1); // Increases age by 1
```

#### Usage

```jsx
import { useStateReducer } from '@upstatement/react-hooks';

const UserForm = ({ onSubmit }) => {
  const [state, set] = useStateReducer({
    name: '',
    age: 0,
    createdAt: () => new Date(),
  });

  return (
    <form onSubmit={onSubmit}>
      <input id="name" value={state.name} onChange={evt => set.name(evt.target.value)} />
      <input id="age" type="number" value={state.age} onChange={evt => set.age(evt.target.value)} />
    </form>
  );
};
```

### `usePrevious`

This hook allows for tracking of the value of a given variable on a previous render.

#### API

```js
const previousValue = usePrevious(currentValue);
```

The initial previous value returned will be the same as the current value.

It's important to note that the previous value does not update when the given value changes, but rather on _every render_.

#### Usage

```jsx
import { usePrevious } from '@upstatement/react-hooks';

const Direction = ({ scrollY }) => {
  const previousScrollY = usePrevious(scrollY);

  if (scrollY === previousScrollY) {
    return null;
  } else if (scrollY > previousScrollY) {
    return <ArrowUp />;
  }
  return <ArrowDown />;
};
```

### `useMap`

This hook allows for use of the [ES6 Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) as a state variable inside your React component.

#### API

```js
const map = useMap(arrayOfTuples);
// Accepts the same initial value that Map's constructor does
```

All map methods can then be used as normal, including (but not limited to) `map.set`, `map.has`, and `map.delete`.

#### Usage

```jsx
import { useMap, useState } from '@upstatement/react-hooks';

const DictionarySearch = () => {
  const dictionaryMap = useMap();

  const [search, setSearch] = useState('');
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');

  const addDefinition = evt => {
    evt.preventDefault();
    dictionaryMap.add(term, definition);
    setTerm('');
    setDefinition('');
  };

  const onChange = setFunction => evt => {
    setFunction(evt.target.value);
  };

  return (
    <div>
      <input id="search" value={search} onChange={onChange(setSearch)} />
      {dictionaryMap.has(search) ? (
        <p style={{ color: 'green' }}>{dictionaryMap.get(search)}</p>
      ) : (
        <p style={{ color: 'red' }}>Term not found in dictionary.</p>
      )}
      <form onSubmit={addDefinition}>
        <input id="term" value={term} onChange={onChange(setTerm)} />
        <textarea id="definition" value={definition} onChange={onChange(setDefinition)}></textarea>
      </form>
    </div>
  );
};
```

### `useSet`

Similar to `useMap`, this hook allows you to use an [ES6 Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) as a state variable inside your React component.

#### API

```js
const set = useSet(arrayOfValues);
// Accepts the same initial value that Set's constructor does
```

All set methods can then be used as normal, including (but not limited to) `set.add`, `set.has`, and `set.delete`.

#### Usage

```jsx
import { useSet } from '@upstatement/react-hooks';

const Shop = ({ items }) => {
  const cartSet = useSet();

  const addToCart = index => {
    const item = items[index];
    if (item) {
      cartSet.add(item.name);
    }
  };

  return (
    <div>
      <h2>Items</h2>
      <ul>
        {items.map(({ name, price }, index) => (
          <li key={name}>
            <p>{name}</p>
            <p>${price}</p>
            <button disabled={cartSet.has(name)} onClick={() => addToCart(index)}>
              Add to cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### `useMultiRef`

Allows for tracking multiple refs in the React DOM. This is particularly useful when looping over items.

### API

```js
const [refs, setRef] = useMultiRef();
```

### Usage

```jsx
import { useEffect } from 'react';
import { useMultiRef } from '@upstatement/react-hooks';
import { last } from 'lodash';

const Modal = ({ links }) => {
  const [linkRefs, setLinkRef] = useMultiRef();

  const lockModalFocus = evt => {
    if (evt.keyCode === 9) {
      // Pressed tab
      const linkEls = linkRefs.current;
      if (evt.shiftKey && document.activeElement === linkEls[0]) {
        evt.preventDefault();
        last(linkEls).focus();
      } else if (!evt.shiftKey && document.activeElement === last(linkEls)) {
        evt.preventDefault();
        linkEls[0].focus();
      }
    }
  };

  useEffect(() => {
    linkRefs.current[0].focus();
    window.addEventListener('keydown', lockModalFocus);
    return () => {
      window.removeEventListener('keydown', lockModalFocus);
    };
  }, []);

  return (
    <ul>
      {links.map(({ href, text }, index) => (
        <li key={index} ref={setLinkRef(index)}>
          <a href={href}>{text}</a>
        </li>
      ))}
    </ul>
  );
};
```

### `useForceUpdate`

This utility hook provides a way to force the a component to update. It's recommended to _only be used_ when the DOM is dependent on a ref value.

#### API

```js
const update = useForceUpdate();
```

Every call to the `update` function will increase an internal tick. This in turn will force a re-render of the component.

#### Usage

This hook is actually used in our `useSet` and `useMap` hooks! A snippet of that code is found below:

```js
import { useRef } from 'react';
import { useForceUpdate } from '@upstatement/react-hooks';

const useSet = iterable => {
  const update = useForceUpdate();
  const setRef = useRef(new Set(iterable));

  const set = new Set(setRef.current);

  set.add = value => {
    const newSet = setRef.add(value); // Add to our set reference
    update(); // force update to hook, recreating the `set` value
    return newSet;
  };

  return set;
};
```
