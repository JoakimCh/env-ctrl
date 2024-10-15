
# env-ctrl - (Environment Control)

## What is this?

This is a [CLI](https://en.wikipedia.org/wiki/Command-line_interface) tool for launching other programs in an isolated environment (as in full control over which [environment variables](https://en.wikipedia.org/wiki/Environment_variable) are available to it).

By default it will launch the program with an empty environment; and you will have to define which variables to set or pass through.

## But why?

Because using environment variables (alias EV) is a great way to send arguments to a program as an alternative to command line arguments (alias CLA).

But if a program supports them and is looking for e.g. a variable called X and it is already set as a global EV; then if you don't explicitly set it when launching the program it will instead use the global variable.

Hence a quick and easy way to control which global EVs are passed through is an essential tool to have when launching such programs!

## Why favor EVs over CLAs?

1. They require no parsing logic; hence they're easier for a developer to implement.
2. They follow a standard format unlike CLAs (which you never know how are parsed).
3. They're often less confusing to use.


## The CLAs of this software

> env-ctrl [...ENV-VARIABLES] - program-to-run

E.g. `env-ctrl PATH - program-to-run` to only pass through the PATH environment variable.

And you can also define EVs in the CLAs, e.g. `env-ctrl USER=Joakim PATH - program-to-run` to define an EV named USER and also pass through the PATH (as a direct alternative to `USER=Joakim env-ctrl USER PATH - program-to-run`).

If you don't want to set or pass through any EVs then you can just do `env-ctrl program-to-run` to pass it an environment with no variables set.

### --print-environment

We also support an argument called `--print-environment` which can be used to check which environment variables are set.

This can be used to check what is passed through to a program you want to launch. E.g. like this:
```sh
TEST='a test' env-ctrl TEST - env-ctrl --print-environment
```
There we set the TEST EV and pass it through, the output is then:
```js
{ TEST: 'a test' }
```

## How to install it?

First you need to have [Node.js](https://nodejs.org) on your system, then you can install it like this:

```sh
npm i -g env-ctrl
```

## The End

That's all for now.

Take care.
