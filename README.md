# Ivy

## Format

### Expression format
```
(<type> <op1> <op2> ... <opN>)
```

### Function declaration
```
"(def foo (bar) (+ bar 10))"
```

### Lambda expression. IILE - Immediately-invoked lambda expression

```
(lambda (x) (\* x x) 10)
```


## Design goals

- Simple syntax: S-expression
- Everything is an expression
- No explicit return, last evaluated expression is the result
- First-class functions: assign to variables, pass as arguments, retur nas values
- Static scope: all functions are closures
- Lambda functions, IILEs
- Functinoal Programming
- Imperative programming
- Namespaces and modules
- OOP: class-based, prototype-based
