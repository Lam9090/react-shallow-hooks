# react-shallow-hooks

[![Build Status](https://travis-ci.org/lintuming/react-shallow-hooks.svg?branch=master)](https://travis-ci.org/lintuming/react-shallow-hooks)
[![Coverage Status](https://coveralls.io/repos/github/lintuming/react-shallow-hooks/badge.svg?branch=master)](https://coveralls.io/github/lintuming/react-shallow-hooks?branch=master)
![npm](https://img.shields.io/npm/v/react-shallow-hooks)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![GitHub](https://img.shields.io/github/license/lintuming/react-shallow-hooks)

A bunch sets of React Hooks which performs a shallow equality comparison on each dependencies array values to determine if they should update.

The shallow equality comparison checks return true when the following situations:

- The `Object.is(A,B)` return true
- Both value A and B are object with same keys,for each key, `Object.is(A[key],B[key])` return true

The list of hooks are avaliable:

- useShallowEffect
- useShallowLayoutEffect
- useShallowMemo
- useShallowCallback
- useShallowImperativeHandle

## Install

```js
npm install react-shallow-hooks
# or
yarn add react-shallow-hooks
```

## Usage

```js
import {useShallowEffect} 'react-shallow-hooks'

const useSomething=()=>{
  const deps={
    a:123,
    b:123
  }
  //The effect callback only call once ,and won't call on every re-render;
  //shallowEqual(deps,previousdeps)===true
  useShallowEffect(()=>{
    console.log('update')
  },[deps])

}
```

## LICENSE

- [MIT](./LICENSE)
