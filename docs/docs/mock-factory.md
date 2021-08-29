---
sidebar_position: 3
---


# Mockingbird API 🐦

## Introduction
Mockingbird provides a simple way to create mocks (sometimes called fixtures)
and to apply many variations on them. \
The entry point of Mockingbird is a simple function called `MockFactory()`, which takes 
a class as an argument and an optional generic type, for example: `MockFactory<Bird>(Bird)`.

## `MockFactory`

`MockFactory` returns a builder which you can apply some more options on (like `mutate` and `ignore`),
or just simply create mocks (or single mock).

```typescript
function MockFactory<TClass>(target: Class<TClass>): MockBuilder<TClass>;
```

Where `Class<TClass>` is an actual JavaScript class. \
Returns `MockBuilder` when invoked.



## `MockBuilder`

Consider the following class (we will use it in the following examples of each method):

```typescript
import { Mock } from 'mockingbird-ts'; 

export class Bird {
  @Mock((faker) => faker.random.name())
  name: string;
  
  @Mock(true) // Cause birds are always awesome :)
  isAwesome: boolean;
  
  @Mock()
  canFly: boolean;
}
```

### 🕵️‍ Discover more about MockBuilder interface

```typescript
export interface MockBuilder<TClass = any> {
  setLocale(locale: string): this;
  plain(): this;
  mutate(overrides: OverrideKeys<TClass>): Omit<MockBuilder<TClass>, 'mutate'>;
  ignore(...keys: IgnoreKeys<TClass>): this;
  one(): TClass;
  many(count: number): TClass[];
}
```



## API

### `.one()`
Simply creates (and return) a new mock from the class (`Bird`); here is an example:

```typescript
const birdMock = MockFactory<Bird>(Bird).one();
```

#### 💡 Hint

```
This method can not be chained,
it just return an mock which is an instance of the class Bird
```




### `.many(count: number)`
Creates (and return) the required `count` mocks from the class; \
here is an example:

```typescript
const birdMock = MockFactory<Bird>(Bird).many(3);
```

#### 💡 Hint

```
The .one() method can not be chained,
it just return an instance of the class
```




### `.omit(...keys: string[])`
Simply ignore some keys in the generated mock.

```typescript
const birdMock = MockFactory<Bird>(Bird).omit('canFly').one();
```

#### 💡 Hint

```
.ignore() takes as many arguments as you want as long as they are strings
and they are part of the class properties

Bird class has 3 properties: 'name', 'isAwesome' and 'canFly';
In the example above will get a mock without the property 'canFly'.
```




### `.pick(...keys: string[])`
Pick specific properties from the class.

```typescript
const birdMock = MockFactory<Bird>(Bird).pick('canFly').one();
```

#### 💡 Hint

```
.ignore() takes as many arguments as you want as long as they are strings
and they are part of the class properties

Bird class has 3 properties: 'name', 'isAwesome' and 'canFly';
In the example above will get a mock without the property 'canFly'.
```




### `.mutate()`

Takes an object as an argument which contains keys and values; \
It can also take a callback with faker and return an object, look at the hint \
to see an example.

```typescript
const birdMock = MockFactory<Bird>(Bird).mutate({ name: 'Birdy Bird' }).one();
```

#### 💡 Hint

Here is a detailed example:

```typescript
const builder = MockFactory<Bird>(Bird).mutate({ name: 'Birdy Bird' });

const oneBird = builder.one();
const manyBirds = builder.many(3);
```

```
The result will be a mock where the value at the property 'name' will be equal to 'Birdy Bird'
assert.equal(oneBird.name, 'Birdy Bird')

When using 'many', the outcome will be an array of objects with the given mutations
```


#### 💡 Hint (using faker)

Here is another example using `faker` and a callback:

```typescript
const builder = MockFactory<Bird>(Bird).mutate((faker) => ({ name: faker.name.firstName() }));
const oneBird = builder.one();
```


### `.plain()`

Sets the builder to return only plain objects (object literal),
and not an instance of the class `Bird`

```typescript
// Will return a plain object and NOT an instance of the class Bird
const birdMock = MockFactory<Bird>(Bird).plain().one();
```

#### 💡 Hint

```
Calling .one() and .many() will return an actual instance of the class (Bird).
When using .plain() you will get an object which is instance of Object
```

```
Using .plain() with .many() will convery all the objects in the array
into plain objects
```




### `.setLocale(locale: string)`
Sets the locale of the fake data (only apply when you use `faker`):

```typescript
const builder = MockFactory<Bird>(Bird).setLocale('es');
```

#### 💡 Hint

```
The method is relevant only when using faker in the @Mock() decorator 
e.g. @Mock((faker) => faker.name.firstName())
```

```typescript
export class Bird {
  @Mock((faker) => faker.random.name())
  name: string;
}

const bird = MockFactory<Bird>(Bird).setLocale('es').one();
```

```
bird.name will be translated into Spanish
```