#!/usr/bin/env node

import {spawn} from 'node:child_process'
import * as n_path from 'node:path'
import * as fs from 'node:fs'

function parseArgs(args) {
  if (args.length == 0) {
    throw Error(`You must at least pass which program to run as an argument!`)
  }
  const env = {
    // PATH: process.env.PATH
    // a related bug I discovered:
    // https://github.com/nodejs/node/issues/55374
  }
  if (args.length == 1) {
    return {env, program: args[0], programArgs: []}
  }
  const programArgs = []
  let program

  let hyphenFound = 0
  for (const arg of args) {
    switch (hyphenFound) {
      case 1: // just found
        hyphenFound = 2
        program = arg
      break
      case 2: // program argument
        programArgs.push(arg)
      break
      case 0: { // not found
        if (arg == '-') {
          hyphenFound = 1
          break // break early then
        }
        const [title, value] = arg.split('=')
        if (value != undefined) {
          if ((value.startsWith(`"`) && value.endsWith(`"`))
          ||  (value.startsWith(`'`) && value.endsWith(`'`))) {
            env[title] = value.slice(1,-1)
          } else {
            env[title] = value
          }
        } else if (title in process.env) {
          env[title] = process.env[title]
        }
      } break
    }
  }

  if (!program) {
    throw Error(`After the environment variables you must define which program to run (after a hyphen sign). E.g. 'VAR1=1 - programToRun'.`)
  }

  return {env, program, programArgs}
}

try {
  const args = process.argv.slice(2)
  if (args[0] == '--print-environment') {
    console.dir(process.env)
    process.exit()
  }
  let {env, program, programArgs} = parseArgs(args)
  if (env.PATH != process.env.PATH) { // custom path
    if (!program.includes(n_path.sep)) {
      program = findPath(program)
    }
  }
  spawn(program, programArgs, {
    env,
    stdio: 'inherit', // pass through I/O
  })
} catch (error) {
  console.error(`Error: ${error.message || error}`)
  process.exit(1)
}

function findPath(program) {
  for (const path of process.env.PATH.split(n_path.delimiter)) {
    try { // check if executable at location
      const programPath = n_path.join(path, program)
      fs.accessSync(programPath, fs.constants.X_OK)
      return programPath
    } catch {} // guess not
  }
  throw Error(`No such executable found in PATH: ${program}`)
}
